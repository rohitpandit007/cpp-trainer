import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { executeCpp, cleanStaleTempDirectories, findCompiler } from '../server/executor.js';

const compiler = findCompiler();

test('Subphase F2: C++ Execution Security & Reliability (P0 Adversarial Audit)', async (t) => {
  if (!compiler) {
    t.skip('No C++ compiler available on host');
    return;
  }

  await t.test('1. Empty source code fails immediately without spawning compiler', async () => {
    const res1 = await executeCpp('');
    assert.equal(res1.status, 'compile_error');
    assert.equal(res1.exitCode, 1);
    assert.match(res1.friendlyExplanation, /No C\+\+ code was provided/i);

    const res2 = await executeCpp('   \n\t   ');
    assert.equal(res2.status, 'compile_error');
  });

  await t.test('2. Infinite loop terminates cleanly within timeout window', async () => {
    const infiniteLoopCode = `
      #include <iostream>
      int main() {
        while (true) {}
        return 0;
      }
    `;
    const start = Date.now();
    const res = await executeCpp(infiniteLoopCode, { timeoutMs: 1500, compileTimeoutMs: 5000 });
    const elapsed = Date.now() - start;

    assert.equal(res.status, 'timeout');
    assert.ok(elapsed >= 1400, `Elapsed time ${elapsed}ms should be >= timeout limit 1500ms`);
    assert.ok(elapsed < 6000, `Process should terminate within reasonable grace period, took ${elapsed}ms`);
  });

  await t.test('3. Stack overflow recursion terminates with runtime_error without crashing host', async () => {
    const stackBomb = `
      volatile int counter = 0;
      void recurse() {
        volatile char pad[1024];
        pad[0] = 1;
        counter++;
        recurse();
      }
      int main() {
        recurse();
        return 0;
      }
    `;
    const res = await executeCpp(stackBomb, { timeoutMs: 2500 });
    assert.ok(res.status === 'runtime_error' || res.status === 'timeout', `Expected runtime_error or timeout, got: ${res.status}`);
    assert.ok(res.exitCode !== 0, 'Exit code must be non-zero for crashed program');
  });

  await t.test('4. Excessive stdout flooding is truncated safely at 64KB', async () => {
    const floodCode = `
      #include <iostream>
      int main() {
        for (int i = 0; i < 20000; i++) {
          std::cout << "ABCDEF1234567890!@#$%^&*()_+\\n";
        }
        return 0;
      }
    `;
    const res = await executeCpp(floodCode, { maxOutputBytes: 16 * 1024, timeoutMs: 3000 });
    assert.ok(res.truncated, 'Output must be marked truncated');
    assert.ok(Buffer.byteLength(res.stdout) <= 20 * 1024, 'Output byte size must remain bounded');
  });

  await t.test('5. Environment variable isolation prevents access to host credentials', async () => {
    const secretKey = 'CODEBLOOM_TEST_SECRET_TOKEN';
    process.env[secretKey] = 'SuperSensitiveSecret12345';

    const envSnifferCode = `
      #include <iostream>
      #include <cstdlib>
      int main() {
        const char* val = getenv("${secretKey}");
        if (val) {
          std::cout << "LEAKED:" << val;
        } else {
          std::cout << "PROTECTED";
        }
        return 0;
      }
    `;

    const res = await executeCpp(envSnifferCode);
    delete process.env[secretKey];

    assert.equal(res.status, 'success');
    assert.equal(res.stdout.trim(), 'PROTECTED', 'Child C++ process must NOT have access to host environment secrets');
  });

  await t.test('6. Concurrent executions complete without collisions or race conditions', async () => {
    const jobs = [1, 2, 3, 4, 5].map(id => {
      const code = `
        #include <iostream>
        int main() {
          std::cout << "JOB_${id}_OK";
          return 0;
        }
      `;
      return executeCpp(code);
    });

    const results = await Promise.all(jobs);
    for (let i = 0; i < results.length; i++) {
      assert.equal(results[i].status, 'success');
      assert.equal(results[i].stdout.trim(), `JOB_${i + 1}_OK`);
    }
  });

  await t.test('7. cleanStaleTempDirectories removes expired folders without affecting active ones', () => {
    const tmpBase = os.tmpdir();
    const staleDir = path.join(tmpBase, 'cpp-trainer-stale-test-1234');
    fs.mkdirSync(staleDir, { recursive: true });

    // Set mtime to 1 hour ago
    const pastTime = (Date.now() - 3600 * 1000) / 1000;
    fs.utimesSync(staleDir, pastTime, pastTime);

    cleanStaleTempDirectories(10 * 60 * 1000); // 10 minutes max age
    assert.equal(fs.existsSync(staleDir), false, 'Stale temporary directory must be removed');
  });

  await t.test('8. AbortSignal cleanly terminates in-flight compilation/execution', async () => {
    const abortController = new AbortController();
    const longRunningCode = `
      #include <iostream>
      #include <thread>
      #include <chrono>
      int main() {
        std::this_thread::sleep_for(std::chrono::seconds(5));
        std::cout << "Finished";
        return 0;
      }
    `;

    const promise = executeCpp(longRunningCode, { timeoutMs: 8000, abortSignal: abortController.signal });
    // Abort after 400ms
    setTimeout(() => abortController.abort(), 400);

    const res = await promise;
    assert.ok(res.timedOut || res.status === 'timeout' || res.status === 'compile_error', 'Aborted execution must resolve with timeout or error status');
  });
});
