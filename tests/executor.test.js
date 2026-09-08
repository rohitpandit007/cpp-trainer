import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { executeCpp, findCompiler, parseCompilerDiagnostics, generateFriendlyExplanation } from '../server/executor.js';

const compiler = findCompiler();
const describeWithCompiler = compiler ? describe : describe.skip;

describe('Compiler Detection and Diagnostic Unit Tests', () => {
  it('identifies compiler availability or returns null safely', () => {
    const detected = findCompiler();
    // Should be string or null, but never throw
    assert.ok(detected === null || typeof detected === 'string');
  });

  it('correctly parses GCC/Clang diagnostic error messages', () => {
    const rawError = `solution.cpp:4:5: error: expected ';' before 'return'\n    4 |     return 0;\n      |     ^~~~~~`;
    const diagnostics = parseCompilerDiagnostics(rawError);
    assert.equal(diagnostics.length, 1);
    assert.equal(diagnostics[0].line, 4);
    assert.equal(diagnostics[0].column, 5);
    assert.equal(diagnostics[0].severity, 'error');
    assert.match(diagnostics[0].message, /expected ';'/);
  });

  it('generates a beginner-friendly explanation for missing semicolon', () => {
    const rawError = `solution.cpp:4:5: error: expected ';' before 'return'`;
    const diagnostics = parseCompilerDiagnostics(rawError);
    const explanation = generateFriendlyExplanation(diagnostics, rawError);
    assert.match(explanation, /Missing semicolon/i);
    assert.match(explanation, /line 4/);
  });

  it('generates a beginner-friendly explanation for undeclared variable', () => {
    const rawError = `solution.cpp:3:19: error: 'totalSum' was not declared in this scope`;
    const diagnostics = parseCompilerDiagnostics(rawError);
    const explanation = generateFriendlyExplanation(diagnostics, rawError);
    assert.match(explanation, /totalSum.*not declared/i);
  });

  it('generates a friendly explanation when main() is missing', () => {
    const rawError = `undefined reference to 'main'`;
    const diagnostics = parseCompilerDiagnostics(rawError);
    const explanation = generateFriendlyExplanation(diagnostics, rawError);
    assert.match(explanation, /missing a main\(\) function/i);
  });
});

describe('Execution Layer Input Validation', () => {
  it('rejects empty source code without spawning compiler', async () => {
    const result = await executeCpp('');
    assert.equal(result.status, 'compile_error');
    assert.equal(result.exitCode, 1);
    assert.match(result.friendlyExplanation, /No C\+\+ code was provided/i);
  });

  it('rejects whitespace-only source code', async () => {
    const result = await executeCpp('   \n\t  \r\n   ');
    assert.equal(result.status, 'compile_error');
    assert.equal(result.exitCode, 1);
  });
});

describeWithCompiler('C++ Execution Pipeline (Live Compiler)', () => {
  // 1. Valid hello-world program
  it('1. executes valid hello-world program successfully', async () => {
    const source = `#include <iostream>\nint main() { std::cout << "Hello, C++ World!"; return 0; }`;
    const result = await executeCpp(source);
    assert.equal(result.status, 'success');
    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /Hello, C\+\+ World!/);
  });

  // 2. Valid input/output program
  it('2. executes valid program with stdin and stdout', async () => {
    const source = `#include <iostream>\nint main() { int a, b; if (std::cin >> a >> b) { std::cout << "Sum=" << (a + b); } return 0; }`;
    const result = await executeCpp(source, { stdin: '18 24' });
    assert.equal(result.status, 'success');
    assert.equal(result.exitCode, 0);
    assert.equal(result.stdout.trim(), 'Sum=42');
  });

  // 3. Syntax error
  it('3. detects syntax error cleanly', async () => {
    const source = `#include <iostream>\nint main() { std::cout << "Broken" return 0; }`;
    const result = await executeCpp(source);
    assert.equal(result.status, 'compile_error');
    assert.notEqual(result.exitCode, 0);
    assert.ok(result.diagnostics.length > 0);
  });

  // 4. Missing semicolon
  it('4. detects missing semicolon and flags relevant line', async () => {
    const source = `#include <iostream>\nint main() {\n  int x = 42\n  return 0;\n}`;
    const result = await executeCpp(source);
    assert.equal(result.status, 'compile_error');
    assert.match(result.friendlyExplanation, /semicolon/i);
  });

  // 5. Undefined variable
  it('5. detects undefined variable with helpful explanation', async () => {
    const source = `#include <iostream>\nint main() { std::cout << unknownVariable; return 0; }`;
    const result = await executeCpp(source);
    assert.equal(result.status, 'compile_error');
    assert.match(result.friendlyExplanation, /unknownVariable.*not declared/i);
  });

  // 6. Runtime crash
  it('6. detects runtime crash and abnormal termination', async () => {
    const source = `#include <cstdlib>\nint main() { int* ptr = nullptr; *ptr = 123; return 0; }`;
    const result = await executeCpp(source);
    assert.equal(result.status, 'runtime_error');
    assert.notEqual(result.exitCode, 0);
  });

  // 7. Division-by-zero behavior
  it('7. detects division-by-zero crash or error', async () => {
    const source = `#include <iostream>\nint main() { volatile int a = 100; volatile int b = 0; volatile int c = a / b; std::cout << c; return 0; }`;
    const result = await executeCpp(source);
    // On x86/x64, integer division by zero generates SIGFPE / crash (exit code != 0)
    assert.ok(result.status === 'runtime_error' || result.status === 'compile_error');
    assert.notEqual(result.exitCode, 0);
  });

  // 8. Infinite loop (timeout trigger)
  it('8. triggers timeout and terminates infinite loops safely', async () => {
    const source = `#include <iostream>\nint main() { while(true) {} return 0; }`;
    const startTime = Date.now();
    const result = await executeCpp(source, { timeoutMs: 1200 });
    const elapsed = Date.now() - startTime;

    assert.equal(result.status, 'timeout');
    assert.ok(elapsed >= 1000 && elapsed < 4000, `Elapsed time was ${elapsed}ms`);
    assert.match(result.friendlyExplanation, /time limit/i);
  });

  // 9. Large output (buffer capping)
  it('9. bounds large stdout output to prevent buffer exhaustion', async () => {
    const source = `#include <iostream>\nint main() { for (int i = 0; i < 5000; ++i) { std::cout << "0123456789ABCDEF\\n"; } return 0; }`;
    const result = await executeCpp(source, { maxOutputBytes: 2048 });
    assert.equal(result.status, 'success');
    assert.equal(result.truncated, true);
    assert.ok(Buffer.byteLength(result.stdout) <= 4096);
  });

  // 10. Non-zero exit code
  it('10. distinguishes clean exit 0 from non-zero exit code', async () => {
    const source = `int main() { return 17; }`;
    const result = await executeCpp(source);
    assert.equal(result.status, 'runtime_error');
    assert.equal(result.exitCode, 17);
  });

  // 11. Empty source handled earlier
  it('11. returns compile_error on empty source', async () => {
    const result = await executeCpp('');
    assert.equal(result.status, 'compile_error');
  });

  // 12. Malformed source
  it('12. handles malformed source code safely without throwing', async () => {
    const source = `///???%%%!@#$^&*() random non-C++ junk """'''`;
    const result = await executeCpp(source);
    assert.equal(result.status, 'compile_error');
    assert.ok(result.stderr.length > 0);
  });

  // 13. Multiple executions (concurrency & stability)
  it('13. safely handles multiple concurrent executions without interference', async () => {
    const tasks = [1, 2, 3].map(i => {
      const src = `#include <iostream>\nint main() { std::cout << "Worker ${i}"; return 0; }`;
      return executeCpp(src);
    });
    const results = await Promise.all(tasks);
    assert.equal(results.length, 3);
    results.forEach((r, idx) => {
      assert.equal(r.status, 'success');
      assert.match(r.stdout, new RegExp(`Worker ${idx + 1}`));
    });
  });

  // 14. Temporary file cleanup
  it('14. guarantees temporary directories are wiped after execution', async () => {
    const tmpBefore = fsSync.readdirSync(os.tmpdir()).filter(n => n.startsWith('cpp-trainer-'));
    const source = `#include <iostream>\nint main() { std::cout << "Cleanup check"; return 0; }`;
    await executeCpp(source);

    // Give 100ms for file system release on Windows
    await new Promise(r => setTimeout(r, 100));
    const tmpAfter = fsSync.readdirSync(os.tmpdir()).filter(n => n.startsWith('cpp-trainer-'));
    assert.equal(tmpAfter.length, tmpBefore.length);
  });

  // 15. Timeout enforcement
  it('15. strictly enforces custom execution timeout limits', async () => {
    const source = `#include <chrono>\n#include <thread>\nint main() { std::this_thread::sleep_for(std::chrono::seconds(10)); return 0; }`;
    const start = Date.now();
    const result = await executeCpp(source, { timeoutMs: 800 });
    const duration = Date.now() - start;

    assert.equal(result.status, 'timeout');
    assert.ok(result.executionTimeMs >= 700 && result.executionTimeMs < 2500, `Execution time was ${result.executionTimeMs}ms`);
    assert.ok(duration < 6000, `Total duration was ${duration}ms`);
  });
});
