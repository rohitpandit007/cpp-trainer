import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const KNOWN_CURRICULUM_CONCEPTS = new Set([
  // Module 1: Foundations
  'cout', 'cin', 'endl', 'newlines', 'strings', 'variables', 'types', 'int', 'float', 'double',
  'char', 'bool', 'arithmetic', 'keywords', 'scope-resolution', 'scope', 'memory', 'new', 'delete',
  'dynamic-memory', 'pointers', 'arrays', 'loops', 'branching',

  // Module 2: Functions
  'functions', 'parameters', 'return', 'pass-by-value', 'pass-by-reference', 'references',
  'inline-functions', 'default-arguments',

  // Module 3: Structures, Classes & Objects
  'structs', 'classes', 'objects', 'member-variables', 'methods', 'member-functions',
  'access-control', 'access-specifiers', 'public', 'private', 'protected',
  'arrays-of-objects', 'passing-objects', 'returning-objects',

  // Module 4: Static & Friend Features
  'static', 'static-members', 'static-methods', 'friends', 'friend-functions', 'friend-classes',

  // Module 5: Constructors
  'constructors', 'default-constructor', 'parameterized-constructor', 'copy-constructor',
  'multiple-constructors', 'initializer-list', 'dynamic-initialization',

  // Module 6: Destructors
  'destructors', 'object-lifecycle', 'cleanup',

  // Module 7: Inheritance
  'inheritance', 'single-inheritance', 'multilevel-inheritance', 'multiple-inheritance',
  'virtual-base-classes', 'abstract-classes', 'derived-constructors',

  // Module 8: Compile-Time Polymorphism
  'function-overloading', 'operator-overloading', 'unary-operators', 'binary-operators',
  'friend-operators', 'stream-operators', 'string-operators',

  // Module 9: Runtime Polymorphism
  'base-pointers', 'object-pointers', 'virtual-functions', 'pure-virtual-functions',
  'runtime-polymorphism', 'dynamic-dispatch', 'virtual-destructors'
]);

export const VALID_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);

/**
 * Validates a single exercise object against the canonical schema.
 * @param {Object} exercise
 * @param {Set<string>} seenIds Set of previously seen exercise IDs for duplicate detection
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export function validateExercise(exercise, seenIds = new Set()) {
  const errors = [];
  const warnings = [];

  if (!exercise || typeof exercise !== 'object') {
    return { valid: false, errors: ['Exercise is not a valid object.'], warnings: [] };
  }

  // 1. ID Validation
  if (!exercise.id || typeof exercise.id !== 'string') {
    errors.push('Missing or non-string "id".');
  } else {
    if (!/^[a-z0-9-]+$/.test(exercise.id)) {
      errors.push(`Invalid id format "${exercise.id}". Must be kebab-case lowercase.`);
    }
    if (seenIds.has(exercise.id)) {
      errors.push(`Duplicate exercise id "${exercise.id}".`);
    } else {
      seenIds.add(exercise.id);
    }
  }

  // 2. Title Validation
  if (!exercise.title || typeof exercise.title !== 'string' || exercise.title.trim().length < 3) {
    errors.push(`Exercise "${exercise.id || 'unknown'}": Missing or invalid "title".`);
  }

  // 3. Concepts Validation
  if (!Array.isArray(exercise.concepts) || exercise.concepts.length === 0) {
    errors.push(`Exercise "${exercise.id}": Must specify at least one concept in "concepts" array.`);
  } else {
    for (const c of exercise.concepts) {
      if (typeof c !== 'string' || !KNOWN_CURRICULUM_CONCEPTS.has(c.toLowerCase())) {
        warnings.push(`Exercise "${exercise.id}": Concept "${c}" is not in standard curriculum taxonomy.`);
      }
    }
  }

  // 4. Difficulty & Scaffold Level Validation
  if (!exercise.difficulty || !VALID_DIFFICULTIES.has(exercise.difficulty)) {
    errors.push(`Exercise "${exercise.id}": Invalid difficulty "${exercise.difficulty}". Must be easy, medium, or hard.`);
  }

  if (typeof exercise.level !== 'number' || exercise.level < 1 || exercise.level > 5) {
    errors.push(`Exercise "${exercise.id}": "level" must be an integer between 1 and 5 (received ${exercise.level}).`);
  }

  // 5. Problem Statement Validation
  if (!exercise.problemStatement || typeof exercise.problemStatement !== 'string' || exercise.problemStatement.trim().length < 15) {
    errors.push(`Exercise "${exercise.id}": Problem statement is missing or too brief.`);
  }

  // 6. Starter Code Validation
  if (!exercise.starterCode || typeof exercise.starterCode !== 'string' || !exercise.starterCode.includes('#include')) {
    warnings.push(`Exercise "${exercise.id}": Starter code is missing standard C++ skeleton headers.`);
  }

  // 7. Reference Solution Validation
  if (!exercise.solution || typeof exercise.solution !== 'string' || exercise.solution.trim().length < 20) {
    errors.push(`Exercise "${exercise.id}": Missing or insufficient reference "solution".`);
  }

  // 8. Test Cases Rigor
  if (!Array.isArray(exercise.testCases) || exercise.testCases.length === 0) {
    errors.push(`Exercise "${exercise.id}": "testCases" must contain at least 1 test case.`);
  } else {
    let visibleCount = 0;
    let hiddenCount = 0;

    exercise.testCases.forEach((tc, idx) => {
      if (!tc.id) errors.push(`Exercise "${exercise.id}": Test case #${idx + 1} missing "id".`);
      if (typeof tc.expectedOutput !== 'string') errors.push(`Exercise "${exercise.id}": Test case #${idx + 1} missing "expectedOutput".`);
      if (tc.isHidden) hiddenCount++;
      else visibleCount++;
    });

    if (visibleCount === 0) {
      errors.push(`Exercise "${exercise.id}": Must have at least 1 visible test case for learner verification.`);
    }

    // Exercises beyond introductory fill-in should have hidden tests to verify genuine understanding
    if (exercise.level >= 2 && hiddenCount === 0) {
      warnings.push(`Exercise "${exercise.id}" (Level ${exercise.level}): Lacks hidden test cases to prevent hardcoding.`);
    }
  }

  // 9. Progressive Hints Quality & Anti-Leak Check
  if (!Array.isArray(exercise.hints) || exercise.hints.length < 3) {
    warnings.push(`Exercise "${exercise.id}": Should provide at least 3 progressive hints (has ${exercise.hints?.length || 0}).`);
  } else {
    exercise.hints.forEach((hint, idx) => {
      if (typeof hint !== 'string' || hint.trim().length < 8) {
        errors.push(`Exercise "${exercise.id}": Hint #${idx + 1} is empty or too short.`);
      }
      // Anti-leak heuristic: Check if hint verbatim instructs exact code replacement
      if (/\b(Write:\s*cout|Replace\s+".*"\s+with\s+".*")/i.test(hint) && idx < 2) {
        warnings.push(`Exercise "${exercise.id}": Hint #${idx + 1} appears to leak exact syntax instead of conceptual guidance.`);
      }
    });
  }

  // 10. Prerequisites Validation
  if (exercise.prerequisiteConcepts && Array.isArray(exercise.prerequisiteConcepts)) {
    for (const prereq of exercise.prerequisiteConcepts) {
      if (!KNOWN_CURRICULUM_CONCEPTS.has(prereq.toLowerCase())) {
        warnings.push(`Exercise "${exercise.id}": Prerequisite "${prereq}" is not in known curriculum taxonomy.`);
      }
    }
  }

  // 11. Independent Problem Anti-Leak Quality
  if (exercise.isIndependent) {
    const indepCheck = validateIndependentExercise(exercise);
    if (!indepCheck.valid) {
      errors.push(...indepCheck.errors);
    }
    if (indepCheck.warnings.length > 0) {
      warnings.push(...indepCheck.warnings);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates an independent exercise for concept leaks, anti-hardcoding rigor, and starter scaffolding independence.
 * @param {Object} exercise
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export function validateIndependentExercise(exercise) {
  const errors = [];
  const warnings = [];

  if (!exercise || typeof exercise !== 'object') {
    return { valid: false, errors: ['Exercise is not a valid object.'], warnings: [] };
  }

  const isIndependentProblem = Boolean(exercise.isIndependent || exercise.level === 5);
  if (!isIndependentProblem) {
    return { valid: true, errors, warnings };
  }

  // 1. Starter code independence: Must not contain prescriptive TODO comments or class designs
  if (exercise.starterCode && (/\/\/\s*TODO/i.test(exercise.starterCode) || /\/\/\s*Design\b/i.test(exercise.starterCode))) {
    warnings.push(`Exercise "${exercise.id}": Independent starterCode contains prescriptive comments.`);
  }

  // 2. Title anti-leak check: Independent problem titles should describe domain challenges rather than C++ syntax
  const prescriptiveTitlePatterns = [
    /\bpolymorphic expression\b/i,
    /\boperator overloading\b/i,
    /\bvirtual functions?\b/i,
    /\bfriend class\b/i,
    /\bfriend function\b/i,
    /\bpure virtual\b/i
  ];
  for (const pat of prescriptiveTitlePatterns) {
    if (pat.test(exercise.title)) {
      warnings.push(`Exercise "${exercise.id}": Title "${exercise.title}" contains prescriptive C++ mechanism keywords.`);
    }
  }

  // 3. Anti-leak prompt check: Problem statements must not prescribe specific C++ keywords/mechanisms
  const prescriptivePromptPatterns = [
    /\bcreate a class named\b/i,
    /\bdeclare a virtual function\b/i,
    /\boverload the operator\b/i,
    /\buse pure virtual\b/i
  ];
  for (const pat of prescriptivePromptPatterns) {
    if (pat.test(exercise.problemStatement)) {
      warnings.push(`Exercise "${exercise.id}": Problem statement contains prescriptive mechanism directive.`);
    }
  }

  // 4. Anti-hardcoding test cases: Independent problems must possess non-trivial hidden test cases
  const hiddenTests = (exercise.testCases || []).filter(tc => tc.isHidden);
  if (hiddenTests.length === 0) {
    errors.push(`Exercise "${exercise.id}": Independent problem must contain at least 1 hidden test case to prevent hardcoding.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates an entire exercise catalog map.
 * @param {Object} catalog Map of exerciseId -> Exercise
 * @returns {{ valid: boolean, totalExercises: number, errorCount: number, warningCount: number, results: Object }}
 */
export function validateExerciseCatalog(catalog = {}) {
  const seenIds = new Set();
  const results = {};
  let totalErrors = 0;
  let totalWarnings = 0;

  const entries = Object.entries(catalog);

  for (const [key, exercise] of entries) {
    if (exercise.id && exercise.id !== key) {
      totalErrors++;
      results[key] = {
        valid: false,
        errors: [`Catalog key "${key}" does not match exercise.id "${exercise.id}".`],
        warnings: []
      };
      continue;
    }

    const res = validateExercise(exercise, seenIds);
    if (!res.valid) totalErrors += res.errors.length;
    totalWarnings += res.warnings.length;
    results[key] = res;
  }

  return {
    valid: totalErrors === 0,
    totalExercises: entries.length,
    errorCount: totalErrors,
    warningCount: totalWarnings,
    results
  };
}

/**
 * Validates the benchmark transfer problem battery.
 * @param {Array<Object>} battery
 * @returns {{ valid: boolean, totalBenchmarks: number, errorCount: number, warningCount: number, results: Object }}
 */
export function validateBenchmarkBattery(battery = []) {
  const seenIds = new Set();
  const results = {};
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const exercise of battery) {
    const res = validateExercise(exercise, seenIds);
    if (!res.valid) totalErrors += res.errors.length;
    totalWarnings += res.warnings.length;
    results[exercise.id] = res;
  }

  return {
    valid: totalErrors === 0,
    totalBenchmarks: battery.length,
    errorCount: totalErrors,
    warningCount: totalWarnings,
    results
  };
}

// Standalone CLI execution
const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFile)) {
  Promise.all([
    import('../src/exerciseData.js'),
    import('../src/benchmark/benchmarkData.js')
  ]).then(([{ exerciseCatalog }, { benchmarkBattery }]) => {
    console.log('====================================================');
    console.log('  CodeBloom Curriculum Validation & Gap Analysis    ');
    console.log('====================================================\n');

    const report = validateExerciseCatalog(exerciseCatalog);
    console.log(`Total Exercises Audited: ${report.totalExercises}`);
    console.log(`Valid: ${report.valid ? 'YES' : 'NO'}`);
    console.log(`Total Errors: ${report.errorCount}`);
    console.log(`Total Warnings: ${report.warningCount}\n`);

    for (const [id, res] of Object.entries(report.results)) {
      if (!res.valid) {
        console.error(`[ERROR] ${id}:`);
        res.errors.forEach(e => console.error(`  - ${e}`));
      }
      if (res.warnings.length > 0) {
        console.warn(`[WARN] ${id}:`);
        res.warnings.forEach(w => console.warn(`  - ${w}`));
      }
    }

    if (report.valid) {
      console.log('✓ All existing catalog exercises conform to canonical schema structure.');
    }

    // Benchmark Battery Validation
    if (benchmarkBattery && benchmarkBattery.length > 0) {
      console.log('\n----------------------------------------------------');
      console.log('  Benchmark Transfer Battery Validation             ');
      console.log('----------------------------------------------------');
      const benchReport = validateBenchmarkBattery(benchmarkBattery);
      console.log(`Total Benchmarks Audited: ${benchReport.totalBenchmarks}`);
      console.log(`Valid: ${benchReport.valid ? 'YES' : 'NO'}`);
      console.log(`Total Errors: ${benchReport.errorCount}`);
      console.log(`Total Warnings: ${benchReport.warningCount}`);

      for (const [id, res] of Object.entries(benchReport.results)) {
        if (!res.valid) {
          console.error(`[ERROR] ${id}:`);
          res.errors.forEach(e => console.error(`  - ${e}`));
        }
        if (res.warnings.length > 0) {
          console.warn(`[WARN] ${id}:`);
          res.warnings.forEach(w => console.warn(`  - ${w}`));
        }
      }

      if (benchReport.valid) {
        console.log('✓ All benchmark battery problems conform to canonical schema structure.');
      }
    }
  }).catch(err => {
    console.error('Fatal validation error:', err);
    process.exit(1);
  });
}

