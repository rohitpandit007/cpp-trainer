import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assessSubmission } from '../server/assessor.js';
import { findCompiler } from '../server/executor.js';
import { exerciseCatalog } from '../src/exerciseData.js';

const compiler = findCompiler();
const describeWithCompiler = compiler ? describe : describe.skip;

describeWithCompiler('Live Exercise Solution & Test Case Validation', { concurrency: 1 }, () => {
  const E2_EXERCISE_IDS = [
    // Dynamic Memory (Lesson 3)
    'memory-mini',
    'memory-medium',
    'memory-hard',

    // References (Lesson 4)
    'functions-medium',
    'functions-hard',

    // Access Control (Lesson 6)
    'access-mini',
    'access-medium',
    'access-hard',

    // Destructors & Lifecycle (Lesson 12)
    'destructors-mini',
    'destructors-medium',
    'destructors-hard',

    // Conditionals (Lesson 3)
    'conditionals-mini',
    'conditionals-medium',
    'conditionals-hard',

    // Virtual Destructors & Polymorphism (Lesson 20)
    'runtime-mini',
    'runtime-medium',
    'runtime-hard'
  ];

  const E3_EXERCISE_IDS = [
    // Module 3: Classes, Objects & Encapsulation
    'classes-medium',
    'classes-hard',
    'member-functions-mini',
    'member-functions-medium',
    'member-functions-hard',
    'object-flow-mini',
    'object-flow-medium',
    'object-flow-hard',

    // Module 4: Static & Friends
    'static-mini',
    'static-medium',
    'static-hard',
    'friends-mini',
    'friends-medium',
    'friends-hard',

    // Module 5: Constructors & Lifecycle
    'constructors-hard',

    // Module 7: Inheritance & Class Hierarchies
    'inheritance-medium',
    'inheritance-hard',
    'abstract-mini',
    'abstract-medium',
    'abstract-hard',
    'derived-constructors-mini',
    'derived-constructors-medium',
    'derived-constructors-hard'
  ];

  const E4_EXERCISE_IDS = [
    // Module 8: Compile-Time Polymorphism & Operator Overloading
    'overloading-mini',
    'overloading-medium',
    'overloading-hard',
    'operators-mini',
    'operators-medium',
    'operators-hard',
    'loops-mini',
    'loops-medium',
    'loops-hard',

    // Module 9 & Cross-Module Polymorphic Capstones
    'combined-polymorphism-pipeline',
    'combined-operator-hierarchy'
  ];

  const E5_EXERCISE_IDS = [
    // Phase E5: Independent Capstones & Problems
    'capstone-library-lending',
    'capstone-geometry-pipeline',
    'capstone-device-network',
    'capstone-booking-scheduler',
    'independent-sensor-pipeline',
    'debug-polymorphic-slicing',
    'debug-resource-leak'
  ];

  const ALL_TESTED_IDS = [...E2_EXERCISE_IDS, ...E3_EXERCISE_IDS, ...E4_EXERCISE_IDS, ...E5_EXERCISE_IDS];

  for (const exId of ALL_TESTED_IDS) {
    it(`compiles and passes all tests for reference solution: ${exId}`, async () => {
      const exercise = exerciseCatalog[exId];
      assert.ok(exercise, `Exercise ${exId} must exist in catalog`);
      assert.ok(exercise.solution, `Exercise ${exId} must have a reference solution`);
      assert.ok(exercise.testCases.length >= 4, `Exercise ${exId} must have >= 4 test cases`);

      const result = await assessSubmission(exercise.solution, exercise);

      assert.equal(result.status, 'success', `Execution status must be success for ${exId}, got ${result.status} (stderr: ${result.compilation?.stderr || result.testResults?.find(t => !t.passed)?.message})`);
      assert.equal(result.passed, true, `All test cases must pass for reference solution in ${exId}`);
      assert.equal(result.summary.failed, 0, `Expected 0 failed tests for ${exId}, got ${result.summary.failed}`);
      assert.equal(result.summary.passed, exercise.testCases.length, `Expected all ${exercise.testCases.length} tests to pass for ${exId}`);

      // Verify hidden test privacy protection
      for (const res of result.testResults) {
        if (res.isHidden) {
          assert.equal(res.input, undefined, `Hidden test input must not be leaked in result for ${exId}`);
          assert.equal(res.expectedOutput, undefined, `Hidden expectedOutput must not be leaked in result for ${exId}`);
        }
      }
    });
  }

  // Debugging exercise validation: Verify that starter code in Level 1 buggy exercises produces failure
  it('verifies that starter code for memory-mini fails cleanly due to bug', async () => {
    const exercise = exerciseCatalog['memory-mini'];
    const result = await assessSubmission(exercise.starterCode, exercise);
    assert.equal(result.passed, false, 'Buggy starter code in memory-mini must not pass assessment');
  });

  it('verifies that starter code for access-mini fails cleanly due to encapsulation bug', async () => {
    const exercise = exerciseCatalog['access-mini'];
    const result = await assessSubmission(exercise.starterCode, exercise);
    assert.equal(result.passed, false, 'Buggy starter code in access-mini must not pass assessment');
  });

  it('verifies that starter code for runtime-mini fails due to missing virtual keyword', async () => {
    const exercise = exerciseCatalog['runtime-mini'];
    const result = await assessSubmission(exercise.starterCode, exercise);
    assert.equal(result.passed, false, 'Buggy starter code in runtime-mini must not pass assessment');
  });

  // Phase E3 Debugging Starter Code Failures
  it('verifies that starter code for member-functions-mini fails due to missing scope resolution', async () => {
    const exercise = exerciseCatalog['member-functions-mini'];
    const result = await assessSubmission(exercise.starterCode, exercise);
    assert.equal(result.passed, false, 'Buggy starter code in member-functions-mini must fail assessment');
  });

  it('verifies that starter code for static-mini fails due to missing static definition', async () => {
    const exercise = exerciseCatalog['static-mini'];
    const result = await assessSubmission(exercise.starterCode, exercise);
    assert.equal(result.passed, false, 'Buggy starter code in static-mini must fail assessment');
  });

  it('verifies that starter code for abstract-mini fails due to diamond ambiguity', async () => {
    const exercise = exerciseCatalog['abstract-mini'];
    const result = await assessSubmission(exercise.starterCode, exercise);
    assert.equal(result.passed, false, 'Buggy starter code in abstract-mini must fail assessment');
  });

  it('verifies that starter code for derived-constructors-mini fails due to unchained base constructor', async () => {
    const exercise = exerciseCatalog['derived-constructors-mini'];
    const result = await assessSubmission(exercise.starterCode, exercise);
    assert.equal(result.passed, false, 'Buggy starter code in derived-constructors-mini must fail assessment');
  });

  // Phase E4 Debugging Starter Code Failures
  it('verifies that starter code for overloading-mini fails due to ambiguous overloads', async () => {
    const exercise = exerciseCatalog['overloading-mini'];
    const result = await assessSubmission(exercise.starterCode, exercise);
    assert.equal(result.passed, false, 'Buggy starter code in overloading-mini must fail assessment');
  });

  it('verifies that starter code for operators-mini fails due to invalid mutating unary operator', async () => {
    const exercise = exerciseCatalog['operators-mini'];
    const result = await assessSubmission(exercise.starterCode, exercise);
    assert.equal(result.passed, false, 'Buggy starter code in operators-mini must fail assessment');
  });

  // Phase E5 Debugging Starter Code Failures
  it('verifies that starter code for debug-polymorphic-slicing fails due to object slicing', async () => {
    const exercise = exerciseCatalog['debug-polymorphic-slicing'];
    const result = await assessSubmission(exercise.starterCode, exercise);
    assert.equal(result.passed, false, 'Buggy starter code in debug-polymorphic-slicing must fail assessment');
  });

  it('verifies that starter code for debug-resource-leak fails due to shallow copy double-free', async () => {
    const exercise = exerciseCatalog['debug-resource-leak'];
    const result = await assessSubmission(exercise.starterCode, exercise);
    assert.equal(result.passed, false, 'Buggy starter code in debug-resource-leak must fail assessment');
  });

  // Verification of independent flag on Level 5 independent exercises
  it('verifies that Level 5 independent exercises are correctly tagged', () => {
    const independentIds = [
      'classes-hard',
      'member-functions-hard',
      'object-flow-hard',
      'static-hard',
      'friends-hard',
      'constructors-hard',
      'inheritance-hard',
      'abstract-hard',
      'derived-constructors-hard',
      'overloading-hard',
      'operators-hard',
      'loops-hard',
      'combined-operator-hierarchy',
      'capstone-library-lending',
      'capstone-geometry-pipeline',
      'capstone-device-network',
      'capstone-booking-scheduler',
      'independent-sensor-pipeline'
    ];
    for (const id of independentIds) {
      const ex = exerciseCatalog[id];
      assert.ok(ex, `Exercise ${id} must exist in catalog`);
      assert.equal(ex.level, 5, `Exercise ${id} must be Level 5`);
      assert.equal(ex.isIndependent, true, `Exercise ${id} must be tagged isIndependent: true`);
    }
  });
});
