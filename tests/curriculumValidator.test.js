/**
 * Automated Test Suite for Curriculum Validator Tool (Phase E1).
 * Tests canonical schema validation, duplicate detection, test rigor enforcement,
 * progressive hint validation, concept taxonomy matching, and existing catalog integrity.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateExercise,
  validateExerciseCatalog,
  validateIndependentExercise,
  KNOWN_CURRICULUM_CONCEPTS
} from '../scripts/validateCurriculum.js';

import { exerciseCatalog } from '../src/exerciseData.js';

const sampleValidExercise = {
  id: 'sample-exercise',
  title: 'Compute Square of Number',
  concepts: ['functions', 'arithmetic', 'return'],
  difficulty: 'easy',
  level: 2,
  problemStatement: 'Write a function int square(int n) that returns the square of integer n.',
  starterCode: '#include <iostream>\nusing namespace std;\nint square(int n) {\n  return 0;\n}\nint main() {\n  return 0;\n}',
  testCases: [
    { id: 't1', description: 'Visible test: 4 -> 16', input: '4', expectedOutput: '16', isHidden: false },
    { id: 't2', description: 'Hidden test: -5 -> 25', input: '-5', expectedOutput: '25', isHidden: true }
  ],
  hints: [
    'What is the formula for the square of a number?',
    'Multiply the parameter n by itself using n * n.',
    'Return the resulting product directly from the function.'
  ],
  solution: '#include <iostream>\nusing namespace std;\nint square(int n) { return n * n; }\nint main() { int x; if (cin >> x) cout << square(x); return 0; }'
};

test('1. Valid Exercise Conformance', async (t) => {
  await t.test('accepts a fully compliant exercise definition', () => {
    const res = validateExercise(sampleValidExercise);
    assert.equal(res.valid, true);
    assert.equal(res.errors.length, 0);
  });
});

test('2. ID Validation & Duplicate Detection', async (t) => {
  await t.test('rejects missing or empty id', () => {
    const invalid = { ...sampleValidExercise, id: '' };
    const res = validateExercise(invalid);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('Missing or non-string "id"')));
  });

  await t.test('rejects non-kebab-case id format', () => {
    const invalid = { ...sampleValidExercise, id: 'SampleExercise_1' };
    const res = validateExercise(invalid);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('Invalid id format')));
  });

  await t.test('detects duplicate exercise ids across a catalog', () => {
    const seen = new Set(['sample-exercise']);
    const res = validateExercise(sampleValidExercise, seen);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('Duplicate exercise id')));
  });
});

test('3. Title and Problem Statement Validation', async (t) => {
  await t.test('rejects missing or whitespace-only title', () => {
    const invalid = { ...sampleValidExercise, id: 'test-title', title: '  ' };
    const res = validateExercise(invalid);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('Missing or invalid "title"')));
  });

  await t.test('rejects missing or overly brief problem statement', () => {
    const invalid = { ...sampleValidExercise, id: 'test-desc', problemStatement: 'Too short' };
    const res = validateExercise(invalid);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('Problem statement is missing or too brief')));
  });
});

test('4. Concepts Taxonomy Validation', async (t) => {
  await t.test('rejects empty concepts array', () => {
    const invalid = { ...sampleValidExercise, id: 'test-concepts', concepts: [] };
    const res = validateExercise(invalid);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('Must specify at least one concept')));
  });

  await t.test('warns when concept is not in standard syllabus taxonomy', () => {
    const withUnknown = { ...sampleValidExercise, id: 'test-tax', concepts: ['functions', 'unknown-concept-xyz'] };
    const res = validateExercise(withUnknown);
    assert.equal(res.valid, true);
    assert.ok(res.warnings.some(w => w.includes('is not in standard curriculum taxonomy')));
  });
});

test('5. Difficulty and Scaffold Level Validation', async (t) => {
  await t.test('rejects invalid difficulty string', () => {
    const invalid = { ...sampleValidExercise, id: 'test-diff', difficulty: 'super-hard' };
    const res = validateExercise(invalid);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('Invalid difficulty')));
  });

  await t.test('rejects level outside [1, 5] range', () => {
    const invalid0 = { ...sampleValidExercise, id: 'test-lvl0', level: 0 };
    const invalid6 = { ...sampleValidExercise, id: 'test-lvl6', level: 6 };
    assert.equal(validateExercise(invalid0).valid, false);
    assert.equal(validateExercise(invalid6).valid, false);
  });
});

test('6. Solution Verification', async (t) => {
  await t.test('rejects missing or empty reference solution', () => {
    const invalid = { ...sampleValidExercise, id: 'test-sol', solution: '' };
    const res = validateExercise(invalid);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('Missing or insufficient reference "solution"')));
  });
});

test('7. Test Suite Rigor & Hidden Tests', async (t) => {
  await t.test('rejects exercise with 0 test cases', () => {
    const invalid = { ...sampleValidExercise, id: 'test-notests', testCases: [] };
    const res = validateExercise(invalid);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('"testCases" must contain at least 1 test case')));
  });

  await t.test('rejects exercise with 0 visible test cases', () => {
    const onlyHidden = {
      ...sampleValidExercise,
      id: 'test-nohidden',
      testCases: [{ id: 't1', description: 'Hidden', input: '', expectedOutput: '1', isHidden: true }]
    };
    const res = validateExercise(onlyHidden);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('Must have at least 1 visible test case')));
  });

  await t.test('warns when Level 2+ exercise lacks hidden test cases', () => {
    const noHidden = {
      ...sampleValidExercise,
      id: 'test-nohidden-warn',
      level: 3,
      testCases: [{ id: 't1', description: 'Vis', input: '', expectedOutput: '1', isHidden: false }]
    };
    const res = validateExercise(noHidden);
    assert.equal(res.valid, true);
    assert.ok(res.warnings.some(w => w.includes('Lacks hidden test cases to prevent hardcoding')));
  });
});

test('8. Progressive Hints Quality', async (t) => {
  await t.test('warns when exercise has fewer than 3 hints', () => {
    const twoHints = { ...sampleValidExercise, id: 'test-hints', hints: ['Hint 1', 'Hint 2'] };
    const res = validateExercise(twoHints);
    assert.equal(res.valid, true);
    assert.ok(res.warnings.some(w => w.includes('Should provide at least 3 progressive hints')));
  });

  await t.test('rejects empty or whitespace-only hints', () => {
    const emptyHint = { ...sampleValidExercise, id: 'test-emptyhint', hints: ['Valid hint here', '   ', 'Another valid hint'] };
    const res = validateExercise(emptyHint);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some(e => e.includes('is empty or too short')));
  });
});

test('9. Catalog Key Consistency', async (t) => {
  await t.test('flags mismatch between catalog key and exercise.id', () => {
    const catalog = {
      'different-key': { ...sampleValidExercise, id: 'actual-id' }
    };
    const report = validateExerciseCatalog(catalog);
    assert.equal(report.valid, false);
    assert.ok(report.results['different-key'].errors.some(e => e.includes('does not match exercise.id')));
  });
});

test('10. Full Catalog Validation', async (t) => {
  await t.test('validates all 75 exercises in exerciseCatalog', () => {
    const report = validateExerciseCatalog(exerciseCatalog);
    assert.equal(report.totalExercises, 75);
    assert.equal(report.valid, true);
    assert.equal(report.errorCount, 0);
    assert.equal(report.warningCount, 0);
  });
});

test('11. Independent Exercise Anti-Leak & Scaffolding Validation', async (t) => {
  await t.test('flags prescriptive TODO comments in independent starterCode', () => {
    const leakyExercise = {
      ...sampleValidExercise,
      id: 'leaky-starter-exercise',
      isIndependent: true,
      starterCode: '#include <iostream>\nusing namespace std;\n// TODO: Design MyClass with static method\nint main() { return 0; }'
    };
    const res = validateIndependentExercise(leakyExercise);
    assert.equal(res.valid, true);
    assert.ok(res.warnings.some(w => w.includes('Independent starterCode contains prescriptive comments')));
  });

  await t.test('flags prescriptive mechanism keywords in independent exercise titles', () => {
    const leakyTitleExercise = {
      ...sampleValidExercise,
      id: 'leaky-title-exercise',
      title: 'Polymorphic Expression Evaluator with Operator Overloading',
      isIndependent: true
    };
    const res = validateIndependentExercise(leakyTitleExercise);
    assert.equal(res.valid, true);
    assert.ok(res.warnings.some(w => w.includes('contains prescriptive C++ mechanism keywords')));
  });

  await t.test('accepts clean domain-oriented independent exercises', () => {
    const cleanExercise = {
      ...sampleValidExercise,
      id: 'clean-domain-exercise',
      title: 'Composite Arithmetic Formula Tree Evaluator',
      isIndependent: true,
      starterCode: '#include <iostream>\nusing namespace std;\n// Write your complete solution here\nint main() { return 0; }'
    };
    const res = validateIndependentExercise(cleanExercise);
    assert.equal(res.valid, true);
    assert.equal(res.warnings.length, 0);
  });
});

