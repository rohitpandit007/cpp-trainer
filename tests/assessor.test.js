import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assessSubmission, normalizeOutput, compareOutputs, verifyConcepts } from '../server/assessor.js';
import { findCompiler } from '../server/executor.js';
import { exerciseCatalog } from '../src/exerciseData.js';

const compiler = findCompiler();
const describeWithCompiler = compiler ? describe : describe.skip;

describe('Assessor Unit Tests (Normalization & Concepts)', () => {
  it('normalizes CRLF and LF differences', () => {
    const raw1 = 'Line 1\r\nLine 2\r\n';
    const raw2 = 'Line 1\nLine 2';
    assert.equal(normalizeOutput(raw1), normalizeOutput(raw2));
  });

  it('trims trailing whitespace per line and end of text', () => {
    const raw = '  Score: 42   \n  Total: 100   \n\n\n';
    const expected = '  Score: 42\n  Total: 100';
    assert.equal(normalizeOutput(raw), expected);
  });

  it('correctly compares outputs ignoring trailing spaces/newlines', () => {
    assert.ok(compareOutputs('15\n\n', '15'));
    assert.ok(compareOutputs('Hello World   \n', 'Hello World'));
    assert.ok(!compareOutputs('15', '16'));
  });

  it('verifies concept patterns accurately', () => {
    const sourceWithClass = `class Student { public: string name; }; int main() {}`;
    const checks = [{ id: 'has-student-class', description: 'Must have Student class', pattern: 'class\\s+Student' }];
    const passResult = verifyConcepts(sourceWithClass, checks);
    assert.equal(passResult.passed, true);

    const sourceWithoutClass = `int main() { return 0; }`;
    const failResult = verifyConcepts(sourceWithoutClass, checks);
    assert.equal(failResult.passed, false);
    assert.equal(failResult.checks[0].passed, false);
  });
});

describeWithCompiler('Assessment Engine Live Compiler Tests', () => {
  const sumExercise = exerciseCatalog['keywords-medium']; // Sum of two numbers (5 10 -> 15, -15 25 -> 10, etc.)

  // 1. Correct solution passing all visible and hidden test cases
  it('1. awards full pass for genuine correct solution', async () => {
    const source = `#include <iostream>\nusing namespace std;\nint main() { int a, b; if (cin >> a >> b) { cout << a + b; } return 0; }`;
    const result = await assessSubmission(source, sumExercise);

    assert.equal(result.status, 'success');
    assert.equal(result.passed, true);
    assert.equal(result.summary.passed, sumExercise.testCases.length);
    assert.equal(result.summary.failed, 0);
    assert.equal(result.antiCheatWarning, null);
  });

  // 2. Incorrect solution failing with wrong output
  it('2. reports wrong output failure for incorrect logic', async () => {
    const source = `#include <iostream>\nusing namespace std;\nint main() { int a, b; if (cin >> a >> b) { cout << a * b; } return 0; }`;
    const result = await assessSubmission(source, sumExercise);

    assert.equal(result.passed, false);
    assert.ok(result.summary.failed > 0);
    assert.ok(result.testResults.some(t => t.status === 'wrong_output'));
  });

  // 3. Hardcoded visible answer anti-cheat detection
  it('3. detects hardcoded visible answer and triggers anti-cheat warning', async () => {
    // Hardcodes 15 (which passes test 1: 5 10 -> 15, but fails hidden tests: 0 0, -15 25, etc.)
    const source = `#include <iostream>\nusing namespace std;\nint main() { cout << 15; return 0; }`;
    const result = await assessSubmission(source, sumExercise);

    assert.equal(result.passed, false);
    assert.ok(result.summary.passed >= 1, 'Should pass the visible hardcoded test');
    assert.ok(result.summary.failed >= 1, 'Must fail hidden tests with different inputs');
    assert.ok(result.antiCheatWarning !== null, 'Anti-cheat warning must be triggered');
    assert.match(result.antiCheatWarning, /hardcoding/i);
  });

  // 4. Edge cases (negative numbers, zeros)
  it('4. evaluates edge case inputs correctly', async () => {
    const source = `#include <iostream>\nusing namespace std;\nint main() { int a, b; if (cin >> a >> b) cout << (a + b); return 0; }`;
    const result = await assessSubmission(source, sumExercise);

    const zeroTest = result.testResults.find(t => t.id === 'test-3'); // 0 0 -> 0
    assert.ok(zeroTest);
    assert.equal(zeroTest.passed, true);

    const negTest = result.testResults.find(t => t.id === 'test-4'); // -15 25 -> 10
    assert.ok(negTest);
    assert.equal(negTest.passed, true);
  });

  // 5. Compilation error in assessment
  it('5. handles compilation failure without executing test cases', async () => {
    const brokenSource = `#include <iostream>\nint main() { brokenSyntax `;
    const result = await assessSubmission(brokenSource, sumExercise);

    assert.equal(result.status, 'compile_error');
    assert.equal(result.passed, false);
    assert.equal(result.testResults.length, 0);
    assert.ok(result.compilation.diagnostics.length > 0);
  });

  // 6. Runtime error in assessment
  it('6. detects runtime crash during test execution', async () => {
    const crashSource = `#include <iostream>\nint main() { int* p = nullptr; *p = 99; return 0; }`;
    const result = await assessSubmission(crashSource, sumExercise);

    assert.equal(result.passed, false);
    assert.ok(result.testResults.some(t => t.status === 'runtime_error'));
  });

  // 7. Timeout in assessment
  it('7. detects timeout on test case without hanging', async () => {
    const loopSource = `#include <iostream>\nint main() { while(true) {} return 0; }`;
    const result = await assessSubmission(loopSource, sumExercise, { testTimeoutMs: 1200 });

    assert.equal(result.passed, false);
    assert.ok(result.testResults.some(t => t.status === 'timeout'));
  });

  // 8. Whitespace handling
  it('8. accepts answers with varied trailing spaces and newlines', async () => {
    const source = `#include <iostream>\nusing namespace std;\nint main() { int a, b; if (cin >> a >> b) { cout << "  " << (a + b) << "  \\n\\n"; } return 0; }`;
    const result = await assessSubmission(source, sumExercise);

    assert.equal(result.status, 'success');
    assert.equal(result.passed, true);
  });

  // 9. Hidden test case security (no data leakage)
  it('9. does NOT leak hidden test inputs or expected outputs in results', async () => {
    const wrongSource = `#include <iostream>\nint main() { std::cout << 9999; return 0; }`;
    const result = await assessSubmission(wrongSource, sumExercise);

    const hiddenResults = result.testResults.filter(t => t.isHidden);
    assert.ok(hiddenResults.length > 0, 'Should have hidden test results');

    for (const h of hiddenResults) {
      assert.equal(h.input, undefined, 'Hidden input must not be leaked');
      assert.equal(h.expectedOutput, undefined, 'Hidden expected output must not be leaked');
      assert.equal(h.actualOutput, undefined, 'Hidden actual output must not be leaked');
      assert.match(h.message, /hidden/i);
    }
  });

  // 10. Partial success
  it('10. reports partial success count when only some tests pass', async () => {
    // Passes when input is positive, wrong when input is negative or zero
    const source = `#include <iostream>\nusing namespace std;\nint main() { int a, b; if (cin >> a >> b) { cout << (a > 0 ? a + b : 999); } return 0; }`;
    const result = await assessSubmission(source, sumExercise);

    assert.equal(result.passed, false);
    assert.ok(result.summary.passed > 0, 'At least 1 test passed');
    assert.ok(result.summary.failed > 0, 'At least 1 test failed');
    assert.match(result.message, /\d+ of \d+ test cases passed/);
  });

  // 11. Concept requirement verification
  it('11. flags concept check warning if behavioral tests pass but concept is missing', async () => {
    const funcExercise = exerciseCatalog['functions-mini']; // requires int square(int n)
    // Solution computes square directly in main without defining square() function
    const sourceWithoutFunc = `#include <iostream>\nusing namespace std;\nint main() { int n; if (cin >> n) { cout << (n * n); } return 0; }`;
    const result = await assessSubmission(sourceWithoutFunc, funcExercise);

    assert.equal(result.passed, false);
    assert.equal(result.status, 'concept_warning');
    assert.ok(result.conceptChecks.some(c => !c.passed));
    assert.match(result.message, /concept/i);
  });

  // 12. Practice mode exercise assessment
  it('12. assesses Practice mode exercise successfully', async () => {
    const practiceEx = exerciseCatalog['functions-mini'];
    const validSource = practiceEx.solution;
    const result = await assessSubmission(validSource, practiceEx);

    assert.equal(result.status, 'success');
    assert.equal(result.passed, true);
  });

  // 13. Challenge mode exercise assessment
  it('13. assesses Challenge mode exercise with class and constructor', async () => {
    const challengeEx = exerciseCatalog['constructors-mini'];
    const validSource = challengeEx.solution;
    const result = await assessSubmission(validSource, challengeEx);

    assert.equal(result.status, 'success');
    assert.equal(result.passed, true);
    assert.equal(result.conceptChecks[0].passed, true);
  });

  // 14. Mastery mode exercise assessment
  it('14. assesses Mastery mode problem against all edge cases', async () => {
    const masteryEx = exerciseCatalog['mastery-student-manager'];
    const validSource = masteryEx.solution;
    const result = await assessSubmission(validSource, masteryEx);

    assert.equal(result.status, 'success');
    assert.equal(result.passed, true);
    assert.equal(result.summary.passed, masteryEx.testCases.length);
  });
});
