/**
 * CodeBloom C++ Benchmark & Transfer Validation Engine (Phase E7).
 *
 * Implements objective, repeatable scoring for independent coding proficiency
 * and transfer validation without runtime debuggers or audio APIs.
 *
 * Consumes events from existing eventBus and tracks:
 * - Independence Score
 * - Generalization Score (hidden tests)
 * - Transfer Score (paired training/test comparison)
 * - Debugging Burden & Convergence
 * - Training-to-Transfer Gap Classification
 */

import { benchmarkBattery, benchmarkBatteryMap } from './benchmarkData.js';

export const TRANSFER_OUTCOMES = {
  GENUINE_CONCEPT_TRANSFER: 'genuine_concept_transfer',
  PATTERN_MEMORIZATION: 'pattern_memorization',
  INTUITIVE_TRANSFER: 'intuitive_transfer',
  INSUFFICIENT_MASTERY: 'insufficient_mastery',
  DEVELOPING_TRANSFER: 'developing_transfer'
};

/**
 * 0–5 Analytical Scoring Scale Definitions (Section 51):
 * 0: No capability / Unattempted / Failed initial comprehension.
 * 1: Elementary recall / Requires continuous line-by-line guidance.
 * 2: Guided reproduction / Can adapt known templates when class structure is given.
 * 3: Competent synthesis / Can combine known concepts with moderate assistance.
 * 4: Autonomous design / Independently architects and implements unseen problems.
 * 5: Exemplary mastery / Solves unseen transfer problems with optimal abstractions,
 *    zero assistance, and complete hidden-test robustness.
 */
export const ANALYTICAL_SCALE = {
  0: 'No demonstrated capability / Complete failure to compile or execute',
  1: 'Elementary recall / High dependence on prescribed syntax',
  2: 'Guided adaptation / Can adapt existing code when blueprints are provided',
  3: 'Competent implementation / Combines familiar concepts with minor assistance',
  4: 'Autonomous decomposition / Independently designs and solves novel problems',
  5: 'Exemplary transfer / Full independent design, zero leakage, robust edge cases'
};

/**
 * Retrieves the full benchmark battery.
 */
export function getBenchmarkBattery() {
  return benchmarkBattery;
}

/**
 * Selects an unseen benchmark problem, guaranteeing novelty.
 * @param {string[]} completedBenchmarkIds
 * @returns {Object|null}
 */
export function getUnseenBenchmarkProblem(completedBenchmarkIds = []) {
  const completed = new Set(completedBenchmarkIds);
  const unseen = benchmarkBattery.filter(b => !completed.has(b.id));
  if (unseen.length === 0) return null;
  return unseen[Math.floor(Math.random() * unseen.length)];
}

/**
 * Calculates the Independence Score (0.0 to 1.0) for an attempt.
 * Full independence (1.0) requires passing all tests with 0 hints and 0 solution reveals.
 * @param {Object} attempt
 * @returns {number}
 */
export function calculateIndependenceScore(attempt = {}) {
  const {
    passed = false,
    hintsUsed = 0,
    solutionRevealed = false,
    sourceLength = 0
  } = attempt;

  if (!passed || solutionRevealed) return 0.0;
  if (sourceLength < 30) return 0.0; // Trivial / empty

  if (hintsUsed === 0) return 1.0;
  if (hintsUsed === 1) return 0.70;
  if (hintsUsed === 2) return 0.40;
  return 0.15; // 3+ hints
}

/**
 * Calculates Generalization Score (0.0 to 1.0) based on hidden test pass ratio.
 * @param {number} visiblePass
 * @param {number} hiddenPass
 * @param {number} totalVisible
 * @param {number} totalHidden
 * @returns {number}
 */
export function calculateGeneralizationScore(visiblePass, hiddenPass, totalVisible, totalHidden) {
  if (totalHidden <= 0) {
    return totalVisible > 0 ? (visiblePass / totalVisible) : 0.0;
  }
  const hiddenRatio = hiddenPass / totalHidden;
  const visibleRatio = totalVisible > 0 ? (visiblePass / totalVisible) : 1.0;
  return Number((0.7 * hiddenRatio + 0.3 * visibleRatio).toFixed(2));
}

/**
 * Evaluates Debugging Convergence Score (0.0 to 1.0).
 * Distinguishes thoughtful error resolution from blind random guessing.
 * @param {number} compileFailures
 * @param {number} runtimeFailures
 * @param {boolean} finalPass
 * @returns {number}
 */
export function calculateDebuggingScore(compileFailures = 0, runtimeFailures = 0, finalPass = false) {
  if (!finalPass) return 0.0;
  const totalFailures = compileFailures + runtimeFailures;

  if (totalFailures === 0) return 1.0;  // Clean first-try execution
  if (totalFailures <= 2) return 0.85; // Methodical rapid diagnosis
  if (totalFailures <= 5) return 0.65; // Moderate iterative debugging
  if (totalFailures <= 8) return 0.40; // High debugging friction
  return 0.25;                         // Likely guess-and-check iteration
}

/**
 * Calculates Transfer Score (0.0 to 1.0) for a paired problem.
 * @param {boolean} trainingSuccess Learner solved the curriculum analog
 * @param {boolean} benchmarkSuccess Learner solved the unseen transfer problem
 * @returns {number}
 */
export function calculateTransferScore(trainingSuccess, benchmarkSuccess) {
  if (trainingSuccess && benchmarkSuccess) return 1.0; // Strong transfer
  if (!trainingSuccess && benchmarkSuccess) return 0.8; // Intuitive transfer
  if (trainingSuccess && !benchmarkSuccess) return 0.2; // Weak transfer / memorization
  return 0.0;                                          // Insufficient mastery
}

/**
 * Analyzes the Training-to-Transfer Gap across all benchmark attempts.
 * @param {Object} trainingProfile { completedExerciseIds: string[] }
 * @param {Array<Object>} benchmarkAttempts
 * @returns {Object} Gap analysis summary
 */
export function analyzeTrainingTransferGap(trainingProfile = {}, benchmarkAttempts = []) {
  const completedTraining = new Set(trainingProfile.completedExerciseIds || []);
  let trainingSuccessCount = 0;
  let benchmarkSuccessCount = 0;
  let totalEvaluated = 0;

  const pairDetails = [];

  for (const b of benchmarkBattery) {
    const trained = completedTraining.has(b.trainingAnalogId);
    const attempt = benchmarkAttempts.find(a => a.benchmarkId === b.id);
    const benchmarkPassed = Boolean(attempt?.passed && (attempt?.independenceScore || 0) >= 0.7);

    if (trained) trainingSuccessCount++;
    if (benchmarkPassed) benchmarkSuccessCount++;
    totalEvaluated++;

    const transferScore = calculateTransferScore(trained, benchmarkPassed);
    pairDetails.push({
      benchmarkId: b.id,
      dimension: b.benchmarkDimension,
      trainingAnalogId: b.trainingAnalogId,
      trained,
      benchmarkPassed,
      transferScore
    });
  }

  const trainingRate = totalEvaluated > 0 ? trainingSuccessCount / totalEvaluated : 0;
  const benchmarkRate = totalEvaluated > 0 ? benchmarkSuccessCount / totalEvaluated : 0;
  const gap = Number((trainingRate - benchmarkRate).toFixed(2));

  let outcome = TRANSFER_OUTCOMES.DEVELOPING_TRANSFER;
  if (trainingRate >= 0.75 && benchmarkRate >= 0.75) {
    outcome = TRANSFER_OUTCOMES.GENUINE_CONCEPT_TRANSFER;
  } else if (trainingRate >= 0.70 && benchmarkRate < 0.40) {
    outcome = TRANSFER_OUTCOMES.PATTERN_MEMORIZATION;
  } else if (trainingRate < 0.40 && benchmarkRate >= 0.70) {
    outcome = TRANSFER_OUTCOMES.INTUITIVE_TRANSFER;
  } else if (trainingRate < 0.40 && benchmarkRate < 0.40) {
    outcome = TRANSFER_OUTCOMES.INSUFFICIENT_MASTERY;
  }

  return {
    totalBatterySize: totalEvaluated,
    trainingSuccessCount,
    benchmarkSuccessCount,
    trainingSuccessRate: Number(trainingRate.toFixed(2)),
    benchmarkSuccessRate: Number(benchmarkRate.toFixed(2)),
    gap,
    outcome,
    pairDetails
  };
}

/**
 * Evaluates a single benchmark attempt against all criteria.
 * @param {Object} rawAttempt
 * @returns {Object} Comprehensive evaluation summary
 */
export function evaluateBenchmarkAttempt(rawAttempt = {}) {
  const {
    benchmarkId,
    passed = false,
    visibleTestsPassed = 0,
    totalVisibleTests = 2,
    hiddenTestsPassed = 0,
    totalHiddenTests = 2,
    hintsUsed = 0,
    solutionRevealed = false,
    compileFailures = 0,
    runtimeFailures = 0,
    source = ''
  } = rawAttempt;

  const benchmark = benchmarkBatteryMap[benchmarkId];
  const independenceScore = calculateIndependenceScore({
    passed,
    hintsUsed,
    solutionRevealed,
    sourceLength: (source || '').trim().length
  });

  const generalizationScore = calculateGeneralizationScore(
    visibleTestsPassed,
    hiddenTestsPassed,
    totalVisibleTests,
    totalHiddenTests
  );

  const debuggingScore = calculateDebuggingScore(
    compileFailures,
    runtimeFailures,
    passed
  );

  const meetsProficiency = passed && independenceScore >= 0.70 && generalizationScore === 1.0;

  return {
    benchmarkId,
    title: benchmark?.title || 'Unknown Benchmark',
    dimension: benchmark?.benchmarkDimension || 'unknown',
    trainingAnalogId: benchmark?.trainingAnalogId || 'unknown',
    passed,
    meetsProficiency,
    independenceScore,
    generalizationScore,
    debuggingScore,
    visibleCoverage: `${visibleTestsPassed}/${totalVisibleTests}`,
    hiddenCoverage: `${hiddenTestsPassed}/${totalHiddenTests}`,
    designDecisionsRequired: benchmark?.expectedDesignDecisions || []
  };
}

/**
 * Automated Archetype Simulation Runner.
 * Allows reproducible regression testing without fabricating human learner results.
 * @param {'ideal'|'memorizer'|'debugger'|'hint_dependent'|'hardcoder'} archetype
 * @returns {Object}
 */
export function simulateLearnerArchetype(archetype) {
  const trainingIds = benchmarkBattery.map(b => b.trainingAnalogId);

  if (archetype === 'ideal') {
    // Ideal transfer learner: completed training and succeeds independently on all transfer problems
    const attempts = benchmarkBattery.map(b => ({
      benchmarkId: b.id,
      passed: true,
      visibleTestsPassed: 2,
      totalVisibleTests: 2,
      hiddenTestsPassed: 2,
      totalHiddenTests: 2,
      hintsUsed: 0,
      solutionRevealed: false,
      compileFailures: 0,
      runtimeFailures: 0,
      source: b.solution
    })).map(evaluateBenchmarkAttempt);

    const gapAnalysis = analyzeTrainingTransferGap(
      { completedExerciseIds: trainingIds },
      attempts
    );

    return { archetype: 'IdealTransferLearner', attempts, gapAnalysis };
  }

  if (archetype === 'memorizer') {
    // Memorizer learner: completed training exercises, but fails novel transfer benchmarks (no class names given)
    const attempts = benchmarkBattery.map((b, idx) => ({
      benchmarkId: b.id,
      // Only passes 1st problem by coincidence, fails remaining 7
      passed: idx === 0,
      visibleTestsPassed: idx === 0 ? 2 : 0,
      totalVisibleTests: 2,
      hiddenTestsPassed: idx === 0 ? 2 : 0,
      totalHiddenTests: 2,
      hintsUsed: 3,
      solutionRevealed: false,
      compileFailures: 4,
      runtimeFailures: 2,
      source: idx === 0 ? b.solution : '// Incomplete template reproduction attempt'
    })).map(evaluateBenchmarkAttempt);

    const gapAnalysis = analyzeTrainingTransferGap(
      { completedExerciseIds: trainingIds },
      attempts
    );

    return { archetype: 'MemorizerLearner', attempts, gapAnalysis };
  }

  if (archetype === 'debugger') {
    // Struggling debugger: initially makes compilation errors, but successfully converges
    const attempts = benchmarkBattery.map(b => ({
      benchmarkId: b.id,
      passed: true,
      visibleTestsPassed: 2,
      totalVisibleTests: 2,
      hiddenTestsPassed: 2,
      totalHiddenTests: 2,
      hintsUsed: 0,
      solutionRevealed: false,
      compileFailures: 3,
      runtimeFailures: 1,
      source: b.solution
    })).map(evaluateBenchmarkAttempt);

    const gapAnalysis = analyzeTrainingTransferGap(
      { completedExerciseIds: trainingIds },
      attempts
    );

    return { archetype: 'StrugglingDebugger', attempts, gapAnalysis };
  }

  if (archetype === 'hint_dependent') {
    // Hint dependent: passes only after requesting multiple hints
    const attempts = benchmarkBattery.map(b => ({
      benchmarkId: b.id,
      passed: true,
      visibleTestsPassed: 2,
      totalVisibleTests: 2,
      hiddenTestsPassed: 2,
      totalHiddenTests: 2,
      hintsUsed: 3,
      solutionRevealed: false,
      compileFailures: 1,
      runtimeFailures: 0,
      source: b.solution
    })).map(evaluateBenchmarkAttempt);

    const gapAnalysis = analyzeTrainingTransferGap(
      { completedExerciseIds: trainingIds },
      attempts
    );

    return { archetype: 'HintDependentLearner', attempts, gapAnalysis };
  }

  // Default: Adversarial Hardcoder (hardcodes visible tests, fails hidden tests)
  const attempts = benchmarkBattery.map(b => ({
    benchmarkId: b.id,
    passed: false, // Fails overall because hidden tests failed
    visibleTestsPassed: 2,
    totalVisibleTests: 2,
    hiddenTestsPassed: 0, // 0/2 hidden tests
    totalHiddenTests: 2,
    hintsUsed: 0,
    solutionRevealed: false,
    compileFailures: 0,
    runtimeFailures: 0,
    source: '// hardcoded lookup table'
  })).map(evaluateBenchmarkAttempt);

  const gapAnalysis = analyzeTrainingTransferGap(
    { completedExerciseIds: trainingIds },
    attempts
  );

  return { archetype: 'AdversarialHardcoder', attempts, gapAnalysis };
}
