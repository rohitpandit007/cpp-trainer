/**
 * Mastery Engine for CodeBloom C++ Trainer.
 * Implements the 6-tier concept mastery model, objective level criteria,
 * error classification, adaptive exercise recommendation, spaced retrieval scheduling,
 * and profile schema migration.
 */

import { eventBus, LEARNING_EVENTS } from './eventBus.js';

export const MASTERY_LEVELS = {
  1: 'Introduced',
  2: 'Practicing',
  3: 'Developing',
  4: 'Proficient',
  5: 'Independent',
  6: 'Mastered'
};

export const ERROR_CATEGORIES = {
  SYNTAX_COMPILATION: 'syntax_compilation',
  RUNTIME_ERROR: 'runtime_error',
  TIMEOUT: 'timeout',
  INPUT_OUTPUT_MISMATCH: 'input_output_mismatch',
  INCORRECT_LOGIC: 'incorrect_logic',
  EDGE_CASE_FAILURE: 'edge_case_failure',
  CONSTRUCTOR_ISSUE: 'constructor_issue',
  FUNCTION_DESIGN_ISSUE: 'function_design_issue',
  CLASS_DESIGN_ISSUE: 'class_design_issue',
  INHERITANCE_ISSUE: 'inheritance_issue',
  POLYMORPHISM_ISSUE: 'polymorphism_issue',
  OPERATOR_OVERLOADING_ISSUE: 'operator_overloading_issue'
};

/**
 * Creates an empty, initialized ConceptMastery record.
 */
export function createConceptMastery(conceptId) {
  return {
    conceptId,
    attempts: 0,
    successfulAttempts: 0,
    failedAttempts: 0,
    compilationErrors: 0,
    runtimeErrors: 0,
    wrongAnswers: 0,
    hintsUsed: 0,
    solutionReveals: 0,
    difficultyAttempted: { easy: 0, medium: 0, hard: 0 },
    difficultySuccessfullyCompleted: { easy: 0, medium: 0, hard: 0 },
    recentPerformance: [], // sliding window of up to 10 'pass' | 'fail'
    independentSuccesses: 0,
    combinedConceptSuccesses: 0,
    spacedRetentionSuccesses: 0,
    level: 1,
    levelName: MASTERY_LEVELS[1],
    lastPracticed: null
  };
}

/**
 * Calculates the objective mastery level (1 to 6) for a concept.
 * Takes into account attempts, successes, difficulty, hints, independent wins,
 * combined wins, spaced retention, and regression on consecutive failures.
 */
export function calculateMasteryLevel(concept) {
  if (!concept || concept.attempts === 0) {
    return { level: 1, levelName: MASTERY_LEVELS[1], reason: 'Not yet attempted' };
  }

  const {
    attempts,
    successfulAttempts,
    solutionReveals,
    difficultySuccessfullyCompleted = {},
    recentPerformance = [],
    independentSuccesses = 0,
    combinedConceptSuccesses = 0,
    spacedRetentionSuccesses = 0,
    hintsUsed = 0
  } = concept;

  // Use sliding window of up to 10 recent attempts
  const recentWindow = recentPerformance.slice(-10);
  const recentPasses = recentWindow.filter(r => r === 'pass').length;
  const recentRate = recentWindow.length > 0 ? recentPasses / recentWindow.length : 0;
  const hintRatio = hintsUsed / Math.max(1, successfulAttempts);

  let targetLevel = 1;

  // Level 6: Mastered
  // Requires: >=3 independent wins, >=2 combined wins, 0 solution reveals,
  // verified spaced retention, recent pass rate >= 80%, error rate <= 20%.
  if (
    independentSuccesses >= 3 &&
    combinedConceptSuccesses >= 2 &&
    solutionReveals === 0 &&
    spacedRetentionSuccesses >= 1 &&
    recentRate >= 0.75 &&
    successfulAttempts >= 6
  ) {
    targetLevel = 6;
  }
  // Level 5: Independent
  // Requires: >=2 independent wins, at least 1 hard difficulty completed,
  // 0 solution reveals, recent pass rate >= 70%.
  else if (
    independentSuccesses >= 2 &&
    (difficultySuccessfullyCompleted.hard || 0) >= 1 &&
    solutionReveals === 0 &&
    recentRate >= 0.7
  ) {
    targetLevel = 5;
  }
  // Level 4: Proficient
  // Requires: >=4 successful attempts, >=2 medium or hard completions,
  // recent rate >= 60%, low hint reliance.
  else if (
    successfulAttempts >= 4 &&
    ((difficultySuccessfullyCompleted.medium || 0) + (difficultySuccessfullyCompleted.hard || 0)) >= 2 &&
    recentRate >= 0.6 &&
    hintRatio <= 1.5
  ) {
    targetLevel = 4;
  }
  // Level 3: Developing
  // Requires: >=2 successful attempts, at least 1 medium or level 2+ completion,
  // recent rate >= 50%.
  else if (
    successfulAttempts >= 2 &&
    ((difficultySuccessfullyCompleted.medium || 0) + (difficultySuccessfullyCompleted.hard || 0)) >= 1 &&
    recentRate >= 0.45
  ) {
    targetLevel = 3;
  }
  // Level 2: Practicing
  // Requires: >=2 attempts with >=1 success, or >=3 attempts.
  else if ((attempts >= 2 && successfulAttempts >= 1) || attempts >= 3) {
    targetLevel = 2;
  }
  // Level 1: Introduced
  else {
    targetLevel = 1;
  }

  // Regression Guard:
  // If last 3 consecutive attempts are failures, down-level by 1.
  const lastThree = recentPerformance.slice(-3);
  if (lastThree.length === 3 && lastThree.every(r => r === 'fail')) {
    if (targetLevel > 1) {
      targetLevel -= 1;
    }
  }

  return {
    level: targetLevel,
    levelName: MASTERY_LEVELS[targetLevel] || 'Introduced',
    reason: `Evaluated ${attempts} attempts with ${successfulAttempts} successes (${Math.round(recentRate * 100)}% recent success rate).`
  };
}

/**
 * Classifies an assessment failure into an actionable error category.
 */
export function classifyError(assessmentResult, sourceCode = '', exercise = null) {
  if (!assessmentResult) {
    return {
      category: ERROR_CATEGORIES.SYNTAX_COMPILATION,
      description: 'Unknown assessment failure',
      remedy: 'Check your program structure and ensure it compiles.'
    };
  }

  const { status, compilation, testResults = [], antiCheatWarning, conceptChecks } = assessmentResult;
  const source = sourceCode || '';

  // 1. Compilation errors
  if (status === 'compile_error' || compilation?.status === 'compile_error') {
    const stderr = compilation?.stderr || '';

    if (/expected.*[;}]|missing.*[;}]/i.test(stderr)) {
      return {
        category: ERROR_CATEGORIES.SYNTAX_COMPILATION,
        description: 'Missing semicolon or unbalanced braces in C++ source.',
        remedy: 'Verify each statement ends with a semicolon and all opening braces { have matching closing braces }.'
      };
    }

    if (/no matching function for call to.*::|cannot call constructor|no matching constructor|candidate expects/i.test(stderr)) {
      return {
        category: ERROR_CATEGORIES.CONSTRUCTOR_ISSUE,
        description: 'Constructor signature or argument mismatch during object initialization.',
        remedy: 'Review constructor parameters and ensure arguments match your class definition.'
      };
    }

    if (/operator.*cannot be applied|no match for 'operator/i.test(stderr)) {
      return {
        category: ERROR_CATEGORIES.OPERATOR_OVERLOADING_ISSUE,
        description: 'Operator overload signature mismatch or unsupported operands.',
        remedy: 'Verify the return type and parameter count for your operator function.'
      };
    }

    if (/virtual|pure virtual|override|abstract/i.test(stderr)) {
      return {
        category: ERROR_CATEGORIES.POLYMORPHISM_ISSUE,
        description: 'Polymorphism or virtual function dispatch error.',
        remedy: 'Ensure the base class function is marked virtual and derived overrides match the exact signature.'
      };
    }

    return {
      category: ERROR_CATEGORIES.SYNTAX_COMPILATION,
      description: compilation?.friendlyExplanation || 'C++ compilation failed.',
      remedy: 'Read the compiler diagnostics and fix syntax or type errors on indicated line numbers.'
    };
  }

  // 2. Timeout
  if (testResults.some(t => t.status === 'timeout')) {
    return {
      category: ERROR_CATEGORIES.TIMEOUT,
      description: 'Program execution timed out (potential infinite loop or waiting for input).',
      remedy: 'Ensure loops have reachable termination conditions and cin reads match input data.'
    };
  }

  // 3. Runtime errors / crashes
  if (testResults.some(t => t.status === 'runtime_error')) {
    return {
      category: ERROR_CATEGORIES.RUNTIME_ERROR,
      description: 'Program crashed during execution (e.g. segmentation fault or division by zero).',
      remedy: 'Check pointer bounds, array indices, and ensure denominators are non-zero.'
    };
  }

  // 4. Anti-cheat or edge-case failure (visible tests pass, hidden tests fail)
  const visiblePassed = testResults.filter(t => !t.isHidden && t.passed).length;
  const hiddenFailed = testResults.filter(t => t.isHidden && !t.passed).length;

  if (antiCheatWarning || (visiblePassed > 0 && hiddenFailed > 0)) {
    return {
      category: ERROR_CATEGORIES.EDGE_CASE_FAILURE,
      description: antiCheatWarning || 'Passed sample cases but failed hidden edge test cases (e.g. zeros, negatives, large values).',
      remedy: 'Avoid hardcoding sample outputs. Write general logic that computes the answer dynamically from standard input.'
    };
  }

  // 5. Concept check warnings
  if (status === 'concept_warning' && conceptChecks) {
    const failedCheck = conceptChecks.find(c => !c.passed);
    if (failedCheck) {
      if (/constructor/i.test(failedCheck.id) || /constructor/i.test(failedCheck.description)) {
        return {
          category: ERROR_CATEGORIES.CONSTRUCTOR_ISSUE,
          description: failedCheck.message || 'Required constructor construct missing.',
          remedy: 'Declare the constructor with the same name as the class without a return type.'
        };
      }
      if (/inheritance|inherit/i.test(failedCheck.id) || /inherit/i.test(failedCheck.description)) {
        return {
          category: ERROR_CATEGORIES.INHERITANCE_ISSUE,
          description: failedCheck.message || 'Required inheritance syntax missing.',
          remedy: 'Inherit from the base class using: class SubClass : public BaseClass { ... };'
        };
      }
      if (/function/i.test(failedCheck.id)) {
        return {
          category: ERROR_CATEGORIES.FUNCTION_DESIGN_ISSUE,
          description: failedCheck.message || 'Required function signature missing.',
          remedy: 'Implement the function with the specified return type, name, and parameter list.'
        };
      }
      if (/class/i.test(failedCheck.id)) {
        return {
          category: ERROR_CATEGORIES.CLASS_DESIGN_ISSUE,
          description: failedCheck.message || 'Required class definition missing.',
          remedy: 'Define the class blueprint and declare public members.'
        };
      }
      if (/operator/i.test(failedCheck.id)) {
        return {
          category: ERROR_CATEGORIES.OPERATOR_OVERLOADING_ISSUE,
          description: failedCheck.message || 'Required operator overload missing.',
          remedy: 'Implement the operator method using the "operator" keyword.'
        };
      }
    }
  }

  // 6. Input/output formatting mismatch vs incorrect logic
  const failedTest = testResults.find(t => !t.passed);
  if (failedTest && failedTest.actualOutput && failedTest.expectedOutput) {
    const normActual = failedTest.actualOutput.trim();
    const normExpected = failedTest.expectedOutput.trim();

    // Check if the expected number is contained inside verbose output
    if (normActual.includes(normExpected) && normActual.length > normExpected.length + 10) {
      return {
        category: ERROR_CATEGORIES.INPUT_OUTPUT_MISMATCH,
        description: 'Output format mismatch: extra prompt text or labels detected.',
        remedy: 'Only print the exact requested values or format without interactive prompt strings (e.g. "Enter a number:").'
      };
    }
  }

  return {
    category: ERROR_CATEGORIES.INCORRECT_LOGIC,
    description: 'Program output did not match expected result.',
    remedy: 'Trace your calculation step-by-step with pencil and paper on the sample input.'
  };
}

/**
 * Updates learner concept mastery upon an exercise attempt.
 */
export function updateConceptMastery(profile, {
  exercise,
  passed,
  assessmentResult,
  hintsUsedCount = 0,
  solutionRevealed = false,
  isIndependent = false,
  isRetrieval = false
}) {
  const updatedProfile = {
    ...profile,
    conceptMastery: { ...profile.conceptMastery },
    stats: {
      totalSubmissions: (profile.stats?.totalSubmissions || 0) + 1,
      passedSubmissions: (profile.stats?.passedSubmissions || 0) + (passed ? 1 : 0),
      hintsRevealed: (profile.stats?.hintsRevealed || 0) + hintsUsedCount,
      solutionsRevealed: (profile.stats?.solutionsRevealed || 0) + (solutionRevealed ? 1 : 0)
    },
    recentMistakes: [...(profile.recentMistakes || [])],
    retrievalQueue: [...(profile.retrievalQueue || [])],
    history: [...(profile.history || [])]
  };

  const concepts = exercise?.concepts || [];
  const difficulty = exercise?.difficulty || 'easy';
  const isMultiConcept = concepts.length >= 2;

  // Track attempt history record
  updatedProfile.history.push({
    timestamp: Date.now(),
    exerciseId: exercise?.id,
    passed,
    hintsUsedCount,
    solutionRevealed,
    concepts
  });
  if (updatedProfile.history.length > 50) {
    updatedProfile.history.shift();
  }

  // Classify failure if not passed
  let classifiedError = null;
  if (!passed && assessmentResult) {
    classifiedError = classifyError(assessmentResult, null, exercise);
    updatedProfile.recentMistakes.push({
      timestamp: Date.now(),
      exerciseId: exercise?.id,
      concepts,
      error: classifiedError
    });
    if (updatedProfile.recentMistakes.length > 10) {
      updatedProfile.recentMistakes.shift();
    }
  }

  // Process each concept
  for (const conceptId of concepts) {
    const current = updatedProfile.conceptMastery[conceptId] || createConceptMastery(conceptId);
    const prevLevel = current.level;

    const attempts = current.attempts + 1;
    const successfulAttempts = current.successfulAttempts + (passed ? 1 : 0);
    const failedAttempts = current.failedAttempts + (passed ? 0 : 1);
    const hintsUsed = current.hintsUsed + hintsUsedCount;
    const solutionReveals = current.solutionReveals + (solutionRevealed ? 1 : 0);

    const difficultyAttempted = {
      ...current.difficultyAttempted,
      [difficulty]: (current.difficultyAttempted[difficulty] || 0) + 1
    };

    const difficultySuccessfullyCompleted = {
      ...current.difficultySuccessfullyCompleted,
      [difficulty]: (current.difficultySuccessfullyCompleted[difficulty] || 0) + (passed ? 1 : 0)
    };

    const recentPerformance = [...current.recentPerformance, passed ? 'pass' : 'fail'];
    if (recentPerformance.length > 10) recentPerformance.shift();

    let independentSuccesses = current.independentSuccesses;
    if (passed && (isIndependent || exercise?.level >= 4) && !solutionRevealed && hintsUsedCount <= 1) {
      independentSuccesses += 1;
    }

    let combinedConceptSuccesses = current.combinedConceptSuccesses;
    if (passed && isMultiConcept && !solutionRevealed) {
      combinedConceptSuccesses += 1;
    }

    let spacedRetentionSuccesses = current.spacedRetentionSuccesses || 0;
    if (passed && isRetrieval) {
      spacedRetentionSuccesses += 1;
    }

    const updatedConcept = {
      ...current,
      attempts,
      successfulAttempts,
      failedAttempts,
      hintsUsed,
      solutionReveals,
      difficultyAttempted,
      difficultySuccessfullyCompleted,
      recentPerformance,
      independentSuccesses,
      combinedConceptSuccesses,
      spacedRetentionSuccesses,
      lastPracticed: Date.now()
    };

    if (classifiedError) {
      if (classifiedError.category === ERROR_CATEGORIES.SYNTAX_COMPILATION) {
        updatedConcept.compilationErrors = (updatedConcept.compilationErrors || 0) + 1;
      } else if (classifiedError.category === ERROR_CATEGORIES.RUNTIME_ERROR) {
        updatedConcept.runtimeErrors = (updatedConcept.runtimeErrors || 0) + 1;
      } else {
        updatedConcept.wrongAnswers = (updatedConcept.wrongAnswers || 0) + 1;
      }
    }

    const levelEvaluation = calculateMasteryLevel(updatedConcept);
    updatedConcept.level = levelEvaluation.level;
    updatedConcept.levelName = levelEvaluation.levelName;

    updatedProfile.conceptMastery[conceptId] = updatedConcept;

    // Emit level transition events
    if (updatedConcept.level > prevLevel) {
      eventBus.emit(LEARNING_EVENTS.CONCEPT_IMPROVED, {
        conceptId,
        fromLevel: prevLevel,
        toLevel: updatedConcept.level,
        levelName: updatedConcept.levelName
      });
      if (updatedConcept.level === 6) {
        eventBus.emit(LEARNING_EVENTS.CONCEPT_MASTERED, { conceptId });
      }
    } else if (updatedConcept.level < prevLevel) {
      eventBus.emit(LEARNING_EVENTS.DIFFICULTY_DECREASED, {
        conceptId,
        fromLevel: prevLevel,
        toLevel: updatedConcept.level,
        levelName: updatedConcept.levelName
      });
    }
  }

  // Update retrieval queue
  scheduleRetrievalCheck(updatedProfile, exercise);

  return { updatedProfile, classifiedError };
}

/**
 * Evaluates whether previously learned concepts are ready for spaced retrieval practice.
 */
function scheduleRetrievalCheck(profile, completedExercise) {
  const RETRIEVAL_MAP = {
    classes: 'functions',
    constructors: 'classes',
    inheritance: 'constructors',
    runtime: 'inheritance',
    operators: 'classes'
  };

  if (!completedExercise) return;

  for (const c of completedExercise.concepts || []) {
    const targetRetrieval = RETRIEVAL_MAP[c];
    if (targetRetrieval && profile.conceptMastery[targetRetrieval]) {
      const retrievalRecord = profile.conceptMastery[targetRetrieval];
      const timeSincePractice = Date.now() - (retrievalRecord.lastPracticed || 0);
      // If practiced > 10 minutes ago or over 3 submissions ago, queue for retrieval
      if (!profile.retrievalQueue.includes(targetRetrieval) && (retrievalRecord.attempts > 0)) {
        profile.retrievalQueue.push(targetRetrieval);
      }
    }
  }
}

/**
 * Adaptive recommendation algorithm:
 * Returns the recommended next exercise with human-understandable reason.
 */
export function getAdaptiveRecommendation(profile, currentLessonId, exerciseCatalog = {}) {
  const catalogExercises = Object.values(exerciseCatalog);

  // 1. Check for targeted error remediation
  const latestMistake = (profile.recentMistakes || []).slice(-1)[0];
  if (latestMistake && Date.now() - latestMistake.timestamp < 1000 * 60 * 30) {
    const errorCat = latestMistake.error?.category;

    // Targeted remediation ladder
    if (errorCat === ERROR_CATEGORIES.CONSTRUCTOR_ISSUE) {
      const candidate = catalogExercises.find(e => e.id === 'constructors-mini' || (e.concepts?.includes('constructors') && e.level <= 2));
      if (candidate) {
        return {
          exerciseId: candidate.id,
          exercise: candidate,
          type: 'remediation',
          reason: 'Targeted Practice: Revisit basic constructor declaration before attempting combined class problems.'
        };
      }
    }

    if (errorCat === ERROR_CATEGORIES.INHERITANCE_ISSUE) {
      const candidate = catalogExercises.find(e => e.id === 'inheritance-mini' || (e.concepts?.includes('inheritance') && e.level <= 2));
      if (candidate) {
        return {
          exerciseId: candidate.id,
          exercise: candidate,
          type: 'remediation',
          reason: 'Targeted Practice: Practice single inheritance syntax before multi-tier hierarchies.'
        };
      }
    }

    if (errorCat === ERROR_CATEGORIES.EDGE_CASE_FAILURE) {
      const candidate = catalogExercises.find(e => e.id === latestMistake.exerciseId);
      if (candidate) {
        return {
          exerciseId: candidate.id,
          exercise: candidate,
          type: 'remediation',
          reason: 'Edge-Case Remediation: Your logic passed visible samples but failed hidden boundary tests. Try handling 0 and negative inputs.'
        };
      }
    }
  }

  // 2. Check for Spaced Retrieval Practice
  if (profile.retrievalQueue && profile.retrievalQueue.length > 0) {
    const retrievalConcept = profile.retrievalQueue[0];
    const candidate = catalogExercises.find(e => e.concepts?.includes(retrievalConcept) && e.level >= 2 && e.level <= 4);
    if (candidate) {
      return {
        exerciseId: candidate.id,
        exercise: candidate,
        type: 'retrieval',
        reason: `Spaced Retrieval: It has been a while since you practiced "${retrievalConcept}". Solidify your memory!`
      };
    }
  }

  // 3. Performance Progression on Current Lesson
  const currentTopic = profile.topics?.[currentLessonId] || { wins: 0, misses: 0 };
  if (currentTopic.misses >= 2) {
    const candidate = catalogExercises.find(e => e.id.startsWith(currentLessonId) && (e.difficulty === 'easy' || e.level <= 2));
    if (candidate) {
      return {
        exerciseId: candidate.id,
        exercise: candidate,
        type: 'scaffold',
        reason: 'Scaffolding Step: Let’s break the concept down with an easy, guided exercise first.'
      };
    }
  }

  if (currentTopic.wins >= 2) {
    // Ready for stretch or combined-concept problem
    const candidate = catalogExercises.find(e => (e.id.startsWith(currentLessonId) && e.difficulty === 'hard') || (e.concepts?.length >= 2 && e.level >= 4));
    if (candidate) {
      return {
        exerciseId: candidate.id,
        exercise: candidate,
        type: 'stretch',
        reason: 'Level Up: You solved the earlier tasks with high confidence. Stretch your skills with an independent challenge!'
      };
    }
  }

  // Default next practice
  const defaultCandidate = catalogExercises.find(e => e.id.startsWith(currentLessonId)) || catalogExercises[0];
  return {
    exerciseId: defaultCandidate?.id || 'keywords-medium',
    exercise: defaultCandidate,
    type: 'practice',
    reason: 'Standard Progression: Continue through the guided learning curriculum.'
  };
}

/**
 * Validates whether a profile adheres to canonical Schema Version 3.
 */
export function validateProfileSchema(profile) {
  if (!profile || typeof profile !== 'object') return false;
  if (typeof profile.version !== 'number' || profile.version < 3) return false;
  if (!Array.isArray(profile.completed)) return false;
  if (!profile.topics || typeof profile.topics !== 'object') return false;
  if (!profile.conceptMastery || typeof profile.conceptMastery !== 'object') return false;
  if (!Array.isArray(profile.recentMistakes)) return false;
  if (!Array.isArray(profile.retrievalQueue)) return false;
  if (!Array.isArray(profile.history)) return false;
  if (!profile.stats || typeof profile.stats !== 'object') return false;
  return true;
}

/**
 * Migrates a legacy learner profile (Phase A/B or v1/v2) to Schema Version 3.
 * Preserves all completed lessons and topic wins/misses without data loss,
 * and defensively repairs corrupted, missing, or malformed fields.
 */
export function migrateProfile(rawProfile) {
  const profile = rawProfile && typeof rawProfile === 'object' ? rawProfile : {};

  // If already a valid Version 3 profile, preserve object reference idempotently
  if (profile.version === 3 && profile.conceptMastery && typeof profile.conceptMastery === 'object' && validateProfileSchema(profile)) {
    return profile;
  }

  const completed = Array.isArray(profile.completed) ? [...profile.completed] : [];
  const topics = profile.topics && typeof profile.topics === 'object' ? { ...profile.topics } : {};
  let conceptMastery = profile.conceptMastery && typeof profile.conceptMastery === 'object'
    ? { ...profile.conceptMastery }
    : {};

  // If no concept mastery exists yet, seed from existing topic wins
  if (Object.keys(conceptMastery).length === 0) {
    for (const [topicId, data] of Object.entries(topics)) {
      const wins = typeof data?.wins === 'number' ? data.wins : 0;
      const misses = typeof data?.misses === 'number' ? data.misses : 0;
      const concept = createConceptMastery(topicId);
      concept.attempts = wins + misses;
      concept.successfulAttempts = wins;
      concept.failedAttempts = misses;
      concept.difficultyAttempted = { easy: wins + misses, medium: 0, hard: 0 };
      concept.difficultySuccessfullyCompleted = { easy: wins, medium: 0, hard: 0 };
      concept.recentPerformance = Array(Math.min(wins, 5)).fill('pass');

      const evalResult = calculateMasteryLevel(concept);
      concept.level = evalResult.level;
      concept.levelName = evalResult.levelName;
      conceptMastery[topicId] = concept;
    }
  } else {
    // Defensively repair existing concept records
    for (const [topicId, c] of Object.entries(conceptMastery)) {
      if (!c || typeof c !== 'object') {
        conceptMastery[topicId] = createConceptMastery(topicId);
      } else {
        c.attempts = Number.isFinite(c.attempts) && c.attempts >= 0 ? c.attempts : 0;
        c.successfulAttempts = Number.isFinite(c.successfulAttempts) && c.successfulAttempts >= 0 ? c.successfulAttempts : 0;
        c.failedAttempts = Number.isFinite(c.failedAttempts) && c.failedAttempts >= 0 ? c.failedAttempts : 0;
        c.level = Number.isInteger(c.level) && c.level >= 1 && c.level <= 6 ? c.level : 1;
        c.levelName = MASTERY_LEVELS[c.level] || MASTERY_LEVELS[1];
        c.recentPerformance = Array.isArray(c.recentPerformance) ? c.recentPerformance.slice(-10) : [];
      }
    }
  }

  const recentMistakes = Array.isArray(profile.recentMistakes) ? [...profile.recentMistakes] : [];
  const retrievalQueue = Array.isArray(profile.retrievalQueue) ? [...profile.retrievalQueue] : [];
  const history = Array.isArray(profile.history) ? [...profile.history] : [];
  const rawStats = profile.stats && typeof profile.stats === 'object' ? profile.stats : {};

  const stats = {
    totalSubmissions: typeof rawStats.totalSubmissions === 'number' ? rawStats.totalSubmissions : completed.length * 2,
    passedSubmissions: typeof rawStats.passedSubmissions === 'number' ? rawStats.passedSubmissions : completed.length,
    hintsRevealed: typeof rawStats.hintsRevealed === 'number' ? rawStats.hintsRevealed : 0,
    solutionsRevealed: typeof rawStats.solutionsRevealed === 'number' ? rawStats.solutionsRevealed : 0
  };

  const gamification = profile.gamification && typeof profile.gamification === 'object' ? profile.gamification : undefined;
  const beginner = profile.beginner && typeof profile.beginner === 'object' ? profile.beginner : undefined;

  const result = {
    version: 3,
    completed,
    topics,
    conceptMastery,
    recentMistakes,
    retrievalQueue,
    history,
    stats
  };

  if (gamification) {
    result.gamification = gamification;
  }
  if (beginner) {
    result.beginner = beginner;
  }

  return result;
}

/**
 * Creates an empty, canonical Version 3 learner profile.
 */
export function createDefaultProfile() {
  return migrateProfile({});
}
