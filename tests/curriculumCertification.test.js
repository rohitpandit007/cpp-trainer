import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/courseData.js';
import { exerciseCatalog } from '../src/exerciseData.js';
import { benchmarkBattery } from '../src/benchmark/benchmarkData.js';
import { validateExerciseCatalog, validateBenchmarkBattery } from '../scripts/validateCurriculum.js';
import { assessSubmission } from '../server/assessor.js';

test('Subphase F4: Curriculum & Assessment Certification', async (t) => {
  await t.test('1. 100% schema conformance across all 75 curriculum exercises with zero errors and zero warnings', () => {
    const report = validateExerciseCatalog(exerciseCatalog);
    assert.equal(report.valid, true);
    assert.equal(report.totalExercises, 75, 'Catalog must contain exactly 75 exercises');
    assert.equal(report.errorCount, 0, 'Must have 0 curriculum validation errors');
    assert.equal(report.warningCount, 0, 'Must have 0 curriculum validation warnings');
  });

  await t.test('2. 100% schema conformance across all 8 benchmark transfer problems with zero errors and zero warnings', () => {
    const benchReport = validateBenchmarkBattery(benchmarkBattery);
    assert.equal(benchReport.valid, true);
    assert.equal(benchReport.totalBenchmarks, 8, 'Must have exactly 8 benchmark problems');
    assert.equal(benchReport.errorCount, 0, 'Must have 0 benchmark validation errors');
    assert.equal(benchReport.warningCount, 0, 'Must have 0 benchmark validation warnings');
  });

  await t.test('3. All 20 syllabus lessons have valid mini, medium, hard exercises mapped without default fallbacks', () => {
    assert.equal(lessons.length, 20, 'Must have exactly 20 syllabus lessons');
    for (const l of lessons) {
      assert.ok(l.exercises.mini && l.exercises.mini.id, `Lesson ${l.id} mini exercise missing`);
      assert.ok(l.exercises.medium && l.exercises.medium.id, `Lesson ${l.id} medium exercise missing`);
      assert.ok(l.exercises.hard && l.exercises.hard.id, `Lesson ${l.id} hard exercise missing`);
      // Assert that none of them are fallback default placeholder exercises
      assert.notEqual(l.exercises.mini.title, `Guided Practice: ${l.title}`, `Lesson ${l.id} mini is using default fallback`);
      assert.notEqual(l.exercises.medium.title, `Applied Problem: ${l.title}`, `Lesson ${l.id} medium is using default fallback`);
      assert.notEqual(l.exercises.hard.title, `Independent Challenge: ${l.title}`, `Lesson ${l.id} hard is using default fallback`);
    }
  });

  await t.test('4. Zero concept leakage across all independent exercises and benchmark problems', () => {
    const leakKeywords = [
      /\bpolymorphic expression\b/i,
      /\boperator overloading\b/i,
      /\bvirtual functions?\b/i,
      /\bfriend class\b/i,
      /\bfriend function\b/i,
      /\bpure virtual\b/i
    ];

    const independentExercises = Object.values(exerciseCatalog).filter(ex => ex.isIndependent);
    assert.ok(independentExercises.length >= 18, `Must have at least 18 independent exercises (found ${independentExercises.length})`);

    for (const ex of independentExercises) {
      for (const pat of leakKeywords) {
        assert.equal(pat.test(ex.title), false, `Independent exercise ${ex.id} title "${ex.title}" must not contain mechanism keyword ${pat}`);
      }
    }

    for (const bench of benchmarkBattery) {
      for (const pat of leakKeywords) {
        assert.equal(pat.test(bench.title), false, `Benchmark ${bench.id} title "${bench.title}" must not contain mechanism keyword ${pat}`);
        assert.equal(pat.test(bench.problemStatement), false, `Benchmark ${bench.id} prompt must not contain mechanism keyword ${pat}`);
      }
    }
  });

  await t.test('5. Anti-hardcoding test: lookup table cheating fails hidden test cases and sets antiCheatWarning', async () => {
    const testEx = exerciseCatalog['classes-hard'];
    assert.ok(testEx, 'classes-hard exercise must exist');

    // Extract visible expected output
    const visibleCase = testEx.testCases.find(tc => !tc.isHidden);
    assert.ok(visibleCase, 'Must have a visible test case');

    // Craft a cheat solution that hardcodes the visible output
    const cheatSolution = `
      #include <iostream>
      int main() {
        std::cout << "${visibleCase.expectedOutput}";
        return 0;
      }
    `;

    const result = await assessSubmission(cheatSolution, testEx);
    assert.equal(result.passed, false, 'Cheating solution must fail overall assessment');
    assert.ok(result.summary.passed >= 1, 'Cheating solution should pass the visible case');
    assert.ok(result.summary.failed >= 1, 'Cheating solution must fail the hidden cases');
    assert.ok(result.antiCheatWarning !== null, 'Assessor must set antiCheatWarning when visible passes but hidden fails');
    assert.match(result.antiCheatWarning, /Avoid hardcoding outputs/i);
  });

  await t.test('6. Assessment status hierarchy adheres strictly to compile_error -> runtime_error -> wrong_output -> partial_success -> success', async () => {
    const testEx = exerciseCatalog['cpp-basics-mini'];
    assert.ok(testEx);

    // 1. Compile error
    const compileFail = await assessSubmission('invalid cpp code syntax error;;;', testEx);
    assert.equal(compileFail.status, 'compile_error');
    assert.equal(compileFail.passed, false);

    // 2. Runtime crash
    const runtimeCrash = await assessSubmission(`
      #include <iostream>
      int main() {
        int* p = nullptr;
        *p = 10;
        return 0;
      }
    `, testEx);
    assert.equal(runtimeCrash.status, 'runtime_error');
    assert.equal(runtimeCrash.passed, false);

    // 3. Wrong output
    const wrongOutput = await assessSubmission(`
      #include <iostream>
      int main() {
        std::cout << "totally incorrect answer";
        return 0;
      }
    `, testEx);
    assert.equal(wrongOutput.status, 'wrong_output');
    assert.equal(wrongOutput.passed, false);

    // 4. Clean success
    const cleanSuccess = await assessSubmission(testEx.solution, testEx);
    assert.equal(cleanSuccess.status, 'success');
    assert.equal(cleanSuccess.passed, true);
  });
});
