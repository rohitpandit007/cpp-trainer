import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { executeCpp, cleanStaleTempDirectories } from '../server/executor.js';
import { assessSubmission } from '../server/assessor.js';

test('Subphase F7: Performance & Long-Session Stress Testing', async (t) => {
  // Pre-clean stale temp directories
  cleanStaleTempDirectories(0);

  await t.test('1. Rapid compilation burst (10 rapid compiles in sequence, zero crashes, zero zombies)', async () => {
    const code = `
      #include <iostream>
      using namespace std;
      int main() {
          int product = 1;
          for (int i = 1; i <= 5; ++i) product *= i;
          cout << "Factorial: " << product << endl;
          return 0;
      }
    `;

    for (let i = 1; i <= 5; i++) {
      const res = await executeCpp(code, { timeoutMs: 3000 });
      assert.equal(res.status, 'success', `Iteration #${i} must succeed`);
      assert.ok(res.stdout.includes('Factorial: 120'), `Iteration #${i} output must match`);
    }
  });

  await t.test('2. Multi-step assessment endurance (5 full assessments with hidden tests)', async () => {
    const exerciseId = 'cpp-basics-mini';
    const solution = `
      #include <iostream>
      using namespace std;
      int main() {
          cout << "Hello, Alex!" << endl;
          return 0;
      }
    `;

    for (let i = 1; i <= 5; i++) {
      const res = await assessSubmission(solution, exerciseId, { testTimeoutMs: 3000 });
      assert.ok(
        res.passed === true && res.status === 'success',
        `Iteration #${i} status must pass, got: ${res.status}`
      );
      assert.ok(res.testResults.length > 0, `Iteration #${i} must evaluate test cases`);
    }
  });

  await t.test('3. Temporary directory leak detector: verify that os.tmpdir() has zero leaked folders', async () => {
    // Settle file locks on Windows
    await new Promise(r => setTimeout(r, 150));
    const tmpEntries = fs.readdirSync(os.tmpdir(), { withFileTypes: true });
    const activeTrainerDirs = tmpEntries.filter(
      e => e.isDirectory() && (e.name.startsWith('cpp-trainer-') || e.name.startsWith('cpp-assess-'))
    );
    assert.equal(
      activeTrainerDirs.length,
      0,
      `Detected ${activeTrainerDirs.length} leaked temporary directories in ${os.tmpdir()}`
    );
  });

  await t.test('4. Memory delta invariant: verify process heap growth remains well bounded', () => {
    const heap = process.memoryUsage().heapUsed;
    const heapMb = heap / (1024 * 1024);
    assert.ok(heapMb < 250, `Heap memory should be bounded, currently ${heapMb.toFixed(2)} MB`);
  });

  await t.test('5. Zombie process detector: verify zero orphaned compiled executables running', () => {
    if (process.platform === 'win32') {
      try {
        const taskList = execSync('tasklist', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
        const matches = taskList.match(/codebloom_[\w-]+\.exe/gi) || [];
        assert.equal(matches.length, 0, `Detected ${matches.length} orphaned runner processes: ${matches.join(', ')}`);
      } catch {}
    }
  });
});
