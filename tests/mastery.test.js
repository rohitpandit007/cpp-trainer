import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  MASTERY_LEVELS,
  ERROR_CATEGORIES,
  createConceptMastery,
  calculateMasteryLevel,
  classifyError,
  updateConceptMastery,
  getAdaptiveRecommendation,
  migrateProfile
} from '../src/masteryEngine.js';

import { eventBus, LEARNING_EVENTS } from '../src/eventBus.js';
import { exerciseCatalog } from '../src/exerciseData.js';
import { updateLearnerProfile, nextDifficulty } from '../src/learningEngine.js';

describe('1. Concept Mastery Model & 6-Level Progression', () => {
  it('initializes a concept at Level 1 (Introduced)', () => {
    const concept = createConceptMastery('cin');
    assert.equal(concept.conceptId, 'cin');
    assert.equal(concept.level, 1);
    assert.equal(concept.levelName, 'Introduced');
    assert.equal(concept.attempts, 0);
  });

  it('progresses to Level 2 (Practicing) upon multiple attempts or first success', () => {
    const concept = createConceptMastery('cin');
    concept.attempts = 2;
    concept.successfulAttempts = 1;
    concept.recentPerformance = ['fail', 'pass'];

    const evalResult = calculateMasteryLevel(concept);
    assert.equal(evalResult.level, 2);
    assert.equal(evalResult.levelName, 'Practicing');
  });

  it('progresses to Level 3 (Developing) after 2+ successes with medium difficulty', () => {
    const concept = createConceptMastery('functions');
    concept.attempts = 3;
    concept.successfulAttempts = 2;
    concept.difficultySuccessfullyCompleted = { easy: 1, medium: 1, hard: 0 };
    concept.recentPerformance = ['pass', 'fail', 'pass'];

    const evalResult = calculateMasteryLevel(concept);
    assert.equal(evalResult.level, 3);
    assert.equal(evalResult.levelName, 'Developing');
  });

  it('progresses to Level 4 (Proficient) with consistent success and low hints', () => {
    const concept = createConceptMastery('classes');
    concept.attempts = 5;
    concept.successfulAttempts = 4;
    concept.difficultySuccessfullyCompleted = { easy: 2, medium: 2, hard: 0 };
    concept.recentPerformance = ['pass', 'pass', 'fail', 'pass', 'pass'];
    concept.hintsUsed = 2;

    const evalResult = calculateMasteryLevel(concept);
    assert.equal(evalResult.level, 4);
    assert.equal(evalResult.levelName, 'Proficient');
  });

  it('progresses to Level 5 (Independent) with independent hard wins and 0 solution reveals', () => {
    const concept = createConceptMastery('constructors');
    concept.attempts = 6;
    concept.successfulAttempts = 5;
    concept.difficultySuccessfullyCompleted = { easy: 2, medium: 2, hard: 1 };
    concept.independentSuccesses = 2;
    concept.solutionReveals = 0;
    concept.recentPerformance = ['pass', 'pass', 'pass', 'pass', 'pass'];

    const evalResult = calculateMasteryLevel(concept);
    assert.equal(evalResult.level, 5);
    assert.equal(evalResult.levelName, 'Independent');
  });

  it('progresses to Level 6 (Mastered) with combined concepts and spaced retention', () => {
    const concept = createConceptMastery('inheritance');
    concept.attempts = 8;
    concept.successfulAttempts = 7;
    concept.difficultySuccessfullyCompleted = { easy: 2, medium: 3, hard: 2 };
    concept.independentSuccesses = 3;
    concept.combinedConceptSuccesses = 2;
    concept.solutionReveals = 0;
    concept.spacedRetentionSuccesses = 1;
    concept.recentPerformance = ['pass', 'pass', 'pass', 'pass', 'pass'];

    const evalResult = calculateMasteryLevel(concept);
    assert.equal(evalResult.level, 6);
    assert.equal(evalResult.levelName, 'Mastered');
  });

  it('applies regression guard when learner has 3 consecutive failures', () => {
    const concept = createConceptMastery('pointers');
    concept.attempts = 10;
    concept.successfulAttempts = 7;
    concept.difficultySuccessfullyCompleted = { easy: 3, medium: 4, hard: 0 };
    concept.hintsUsed = 2;
    // 7 passes followed by 3 consecutive fails
    concept.recentPerformance = ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'fail', 'fail', 'fail'];

    const evalResult = calculateMasteryLevel(concept);
    // Would have been Level 4 without regression (70% pass rate, 4 medium wins), drops to Level 3
    assert.equal(evalResult.level, 3);
  });
});

describe('2. Error Classification Engine', () => {
  it('classifies missing semicolon as SYNTAX_COMPILATION', () => {
    const assessmentResult = {
      status: 'compile_error',
      compilation: {
        status: 'compile_error',
        stderr: 'main.cpp:5:10: error: expected \';\' before \'return\''
      }
    };
    const error = classifyError(assessmentResult);
    assert.equal(error.category, ERROR_CATEGORIES.SYNTAX_COMPILATION);
    assert.match(error.description, /semicolon/i);
  });

  it('classifies constructor argument mismatch as CONSTRUCTOR_ISSUE', () => {
    const assessmentResult = {
      status: 'compile_error',
      compilation: {
        status: 'compile_error',
        stderr: 'main.cpp:8:15: error: no matching function for call to \'Rectangle::Rectangle(int)\''
      }
    };
    const error = classifyError(assessmentResult);
    assert.equal(error.category, ERROR_CATEGORIES.CONSTRUCTOR_ISSUE);
    assert.match(error.description, /constructor/i);
  });

  it('classifies execution timeout as TIMEOUT', () => {
    const assessmentResult = {
      status: 'wrong_output',
      testResults: [
        { id: 't1', status: 'timeout', passed: false }
      ]
    };
    const error = classifyError(assessmentResult);
    assert.equal(error.category, ERROR_CATEGORIES.TIMEOUT);
  });

  it('classifies runtime crash as RUNTIME_ERROR', () => {
    const assessmentResult = {
      status: 'wrong_output',
      testResults: [
        { id: 't1', status: 'runtime_error', passed: false, exitCode: 139 }
      ]
    };
    const error = classifyError(assessmentResult);
    assert.equal(error.category, ERROR_CATEGORIES.RUNTIME_ERROR);
  });

  it('classifies visible pass with hidden fail as EDGE_CASE_FAILURE', () => {
    const assessmentResult = {
      status: 'wrong_output',
      antiCheatWarning: 'Your solution appears to hardcode outputs.',
      testResults: [
        { id: 't1', isHidden: false, passed: true },
        { id: 't2', isHidden: true, passed: false }
      ]
    };
    const error = classifyError(assessmentResult);
    assert.equal(error.category, ERROR_CATEGORIES.EDGE_CASE_FAILURE);
  });

  it('classifies failed concept check as specific concept issue', () => {
    const assessmentResult = {
      status: 'concept_warning',
      conceptChecks: [
        { id: 'has-inheritance-syntax', passed: false, message: 'Class Student must inherit from Person' }
      ],
      testResults: [
        { id: 't1', isHidden: false, passed: true }
      ]
    };
    const error = classifyError(assessmentResult);
    assert.equal(error.category, ERROR_CATEGORIES.INHERITANCE_ISSUE);
    assert.match(error.remedy, /inherit/i);
  });

  it('classifies verbose prompt output as INPUT_OUTPUT_MISMATCH', () => {
    const assessmentResult = {
      status: 'wrong_output',
      testResults: [
        {
          id: 't1',
          passed: false,
          actualOutput: 'Enter two numbers: The sum is 15',
          expectedOutput: '15'
        }
      ]
    };
    const error = classifyError(assessmentResult);
    assert.equal(error.category, ERROR_CATEGORIES.INPUT_OUTPUT_MISMATCH);
    assert.match(error.remedy, /prompt/i);
  });
});

describe('3. Adaptive Difficulty & Recommendation Engine', () => {
  it('reduces difficulty to "support" when learner has 2+ misses', () => {
    assert.equal(nextDifficulty({ misses: 2, wins: 0 }), 'support');
    assert.equal(nextDifficulty({ misses: 3, wins: 1 }), 'support');
  });

  it('increases difficulty to "medium" when learner has 2+ wins', () => {
    assert.equal(nextDifficulty({ misses: 0, wins: 2 }), 'medium');
  });

  it('recommends targeted remediation ladder when recent mistake is constructor issue', () => {
    const profile = {
      version: 3,
      recentMistakes: [
        {
          timestamp: Date.now() - 1000,
          error: { category: ERROR_CATEGORIES.CONSTRUCTOR_ISSUE }
        }
      ],
      retrievalQueue: [],
      topics: {}
    };

    const rec = getAdaptiveRecommendation(profile, 'constructors', exerciseCatalog);
    assert.equal(rec.type, 'remediation');
    assert.match(rec.reason, /constructor/i);
    assert.ok(rec.exerciseId);
  });

  it('recommends spaced retrieval practice when concept is in retrieval queue', () => {
    const profile = {
      version: 3,
      recentMistakes: [],
      retrievalQueue: ['functions'],
      topics: {}
    };

    const rec = getAdaptiveRecommendation(profile, 'classes', exerciseCatalog);
    assert.equal(rec.type, 'retrieval');
    assert.match(rec.reason, /functions/i);
    assert.ok(rec.exerciseId);
  });

  it('recommends stretch challenge when learner has 2+ wins on current topic', () => {
    const profile = {
      version: 3,
      recentMistakes: [],
      retrievalQueue: [],
      topics: {
        'keywords': { wins: 2, misses: 0 }
      }
    };

    const rec = getAdaptiveRecommendation(profile, 'keywords', exerciseCatalog);
    assert.equal(rec.type, 'stretch');
    assert.match(rec.reason, /Level Up|stretch/i);
  });
});

describe('4. Spaced Retrieval Scheduling', () => {
  it('queues functions for retrieval after practicing classes', () => {
    const baseProfile = {
      version: 3,
      conceptMastery: {
        functions: {
          conceptId: 'functions',
          attempts: 2,
          lastPracticed: Date.now() - 1000 * 60 * 20
        }
      },
      retrievalQueue: [],
      recentMistakes: [],
      history: []
    };

    const classesEx = exerciseCatalog['classes-mini'];
    const { updatedProfile } = updateConceptMastery(baseProfile, {
      exercise: classesEx,
      passed: true
    });

    assert.ok(updatedProfile.retrievalQueue.includes('functions'));
  });

  it('queues constructors for retrieval after practicing inheritance', () => {
    const baseProfile = {
      version: 3,
      conceptMastery: {
        constructors: {
          conceptId: 'constructors',
          attempts: 3,
          lastPracticed: Date.now() - 1000 * 60 * 30
        }
      },
      retrievalQueue: [],
      recentMistakes: [],
      history: []
    };

    const inheritanceEx = exerciseCatalog['inheritance-mini'];
    const { updatedProfile } = updateConceptMastery(baseProfile, {
      exercise: inheritanceEx,
      passed: true
    });

    assert.ok(updatedProfile.retrievalQueue.includes('constructors'));
  });
});

describe('5. Progressive Hints & Solution Reveal Penalties', () => {
  it('all catalog exercises contain exactly 3 progressive hints', () => {
    for (const [id, ex] of Object.entries(exerciseCatalog)) {
      assert.ok(Array.isArray(ex.hints), `Exercise ${id} must have hints array`);
      assert.ok(ex.hints.length >= 3, `Exercise ${id} must have at least 3 progressive hints`);
      assert.ok(ex.hints[0].length > 10, `Exercise ${id} hint 1 must be descriptive`);
      assert.ok(ex.hints[1].length > 10, `Exercise ${id} hint 2 must be descriptive`);
      assert.ok(ex.hints[2].length > 10, `Exercise ${id} hint 3 must be descriptive`);
    }
  });

  it('tracks hint usage count in profile stats and concept record', () => {
    const profile = migrateProfile({ completed: [], topics: {} });
    const ex = exerciseCatalog['keywords-medium'];

    const { updatedProfile } = updateConceptMastery(profile, {
      exercise: ex,
      passed: true,
      hintsUsedCount: 2
    });

    assert.equal(updatedProfile.stats.hintsRevealed, 2);
    assert.equal(updatedProfile.conceptMastery['variables'].hintsUsed, 2);
  });

  it('solution reveal prevents independent success credit', () => {
    const profile = migrateProfile({ completed: [], topics: {} });
    const ex = exerciseCatalog['keywords-hard']; // Level 5 exercise

    const { updatedProfile } = updateConceptMastery(profile, {
      exercise: ex,
      passed: true,
      hintsUsedCount: 3,
      solutionRevealed: true,
      isIndependent: true
    });

    assert.equal(updatedProfile.stats.solutionsRevealed, 1);
    assert.equal(updatedProfile.conceptMastery['variables'].solutionReveals, 1);
    // Independent success MUST NOT be awarded when solution is revealed
    assert.equal(updatedProfile.conceptMastery['variables'].independentSuccesses, 0);
  });
});

describe('6. Combined-Concept & Mastery Assessments', () => {
  it('catalog contains multi-concept combined exercises', () => {
    const boxEx = exerciseCatalog['combined-classes-constructors'];
    assert.ok(boxEx);
    assert.ok(boxEx.concepts.includes('classes') && boxEx.concepts.includes('constructors'));
    assert.equal(boxEx.level, 4);

    const polyEx = exerciseCatalog['combined-inheritance-virtual'];
    assert.ok(polyEx);
    assert.ok(polyEx.concepts.includes('inheritance') && polyEx.concepts.includes('runtime-polymorphism'));
  });

  it('passing a multi-concept exercise increments combinedConceptSuccesses', () => {
    const profile = migrateProfile({ completed: [], topics: {} });
    const boxEx = exerciseCatalog['combined-classes-constructors'];

    const { updatedProfile } = updateConceptMastery(profile, {
      exercise: boxEx,
      passed: true
    });

    assert.equal(updatedProfile.conceptMastery['classes'].combinedConceptSuccesses, 1);
    assert.equal(updatedProfile.conceptMastery['constructors'].combinedConceptSuccesses, 1);
  });

  it('mastery exercises span syllabus and have full test suites', () => {
    const studentEx = exerciseCatalog['mastery-student-manager'];
    assert.ok(studentEx);
    assert.ok(studentEx.testCases.length >= 4);
    assert.ok(studentEx.testCases.some(t => t.isHidden));

    const bankEx = exerciseCatalog['mastery-bank-hierarchy'];
    assert.ok(bankEx);
    assert.ok(bankEx.testCases.some(t => t.isHidden));
  });
});

describe('7. Profile Migration & Persistence', () => {
  it('migrates unversioned legacy profile to Schema Version 3 without data loss', () => {
    const legacy = {
      completed: ['cpp-basics', 'keywords'],
      topics: {
        'cpp-basics': { wins: 3, misses: 1 },
        'keywords': { wins: 2, misses: 0 }
      }
    };

    const migrated = migrateProfile(legacy);
    assert.equal(migrated.version, 3);
    assert.deepEqual(migrated.completed, ['cpp-basics', 'keywords']);
    assert.ok(migrated.conceptMastery['cpp-basics']);
    assert.equal(migrated.conceptMastery['cpp-basics'].attempts, 4);
    assert.equal(migrated.conceptMastery['cpp-basics'].successfulAttempts, 3);
    assert.ok(migrated.conceptMastery['keywords']);
    assert.equal(migrated.conceptMastery['keywords'].successfulAttempts, 2);
    assert.ok(Array.isArray(migrated.retrievalQueue));
    assert.ok(Array.isArray(migrated.recentMistakes));
    assert.ok(migrated.stats);
  });

  it('preserves existing Version 3 profiles idempotently', () => {
    const v3 = {
      version: 3,
      completed: ['cpp-basics'],
      topics: { 'cpp-basics': { wins: 1, misses: 0 } },
      conceptMastery: { 'cpp-basics': createConceptMastery('cpp-basics') },
      stats: { totalSubmissions: 2, passedSubmissions: 1, hintsRevealed: 0, solutionsRevealed: 0 },
      retrievalQueue: [],
      recentMistakes: [],
      history: []
    };

    const result = migrateProfile(v3);
    assert.equal(result, v3);
  });
});

describe('8. Learning Event Bus Decoupled Contract', () => {
  beforeEach(() => {
    eventBus.clear();
  });

  it('subscribes to and receives learning events', () => {
    let received = null;
    const unsubscribe = eventBus.on(LEARNING_EVENTS.TEST_PASSED, (data) => {
      received = data;
    });

    eventBus.emit(LEARNING_EVENTS.TEST_PASSED, { exerciseId: 'test-ex-1' });
    assert.ok(received);
    assert.equal(received.event, LEARNING_EVENTS.TEST_PASSED);
    assert.equal(received.exerciseId, 'test-ex-1');

    // Test unsubscribe
    received = null;
    unsubscribe();
    eventBus.emit(LEARNING_EVENTS.TEST_PASSED, { exerciseId: 'test-ex-2' });
    assert.equal(received, null);
  });

  it('emits CONCEPT_IMPROVED and CONCEPT_MASTERED on level promotions', () => {
    const events = [];
    eventBus.on(LEARNING_EVENTS.CONCEPT_IMPROVED, (d) => events.push(d));
    eventBus.on(LEARNING_EVENTS.CONCEPT_MASTERED, (d) => events.push(d));

    let profile = migrateProfile({ completed: [], topics: {} });
    const ex = exerciseCatalog['keywords-mini'];

    // First attempt: initializes at Level 1 (Introduced)
    profile = updateConceptMastery(profile, {
      exercise: ex,
      passed: true
    }).updatedProfile;

    // Second attempt: advances to Level 2 (Practicing), emitting CONCEPT_IMPROVED
    updateConceptMastery(profile, {
      exercise: ex,
      passed: true
    });

    assert.ok(events.length >= 1);
    assert.equal(events[0].conceptId, 'variables');
    assert.equal(events[0].toLevel, 2);
  });
});

describe('9. Comprehensive Edge Cases', () => {
  it('handles first attempt cleanly without prior records', () => {
    const emptyProfile = migrateProfile({});
    const ex = exerciseCatalog['cpp-basics-mini'];

    const { updatedProfile } = updateConceptMastery(emptyProfile, {
      exercise: ex,
      passed: true
    });

    assert.equal(updatedProfile.conceptMastery['cout'].attempts, 1);
    assert.equal(updatedProfile.conceptMastery['cout'].successfulAttempts, 1);
  });

  it('handles repeated failures without negative or corrupted levels', () => {
    let profile = migrateProfile({});
    const ex = exerciseCatalog['functions-mini'];

    for (let i = 0; i < 5; ++i) {
      const res = updateConceptMastery(profile, {
        exercise: ex,
        passed: false,
        assessmentResult: { status: 'wrong_output', testResults: [{ passed: false }] }
      });
      profile = res.updatedProfile;
    }

    const concept = profile.conceptMastery['functions'];
    assert.equal(concept.attempts, 5);
    assert.equal(concept.failedAttempts, 5);
    assert.ok(concept.level >= 1);
    assert.ok(concept.level <= 2);
  });

  it('recovers level progression after previous failures (success after many failures)', () => {
    let profile = migrateProfile({});
    const ex = exerciseCatalog['keywords-medium'];

    // 3 initial failures
    for (let i = 0; i < 3; ++i) {
      profile = updateConceptMastery(profile, { exercise: ex, passed: false }).updatedProfile;
    }

    // Followed by 4 consecutive successes
    for (let i = 0; i < 4; ++i) {
      profile = updateConceptMastery(profile, { exercise: ex, passed: true }).updatedProfile;
    }

    const concept = profile.conceptMastery['variables'];
    assert.equal(concept.successfulAttempts, 4);
    assert.ok(concept.level >= 3, 'Should recover to Developing/Proficient');
  });
});
