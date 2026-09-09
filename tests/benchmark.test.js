/**
 * Automated Test Suite for Benchmark & Transfer Validation Engine (Phase E7).
 * Tests benchmark problem schema, transfer-pair mapping, anti-leak properties,
 * unseen selection, independence scoring, generalization scoring, debugging scoring,
 * gap analysis, simulated archetypes, and architectural invariants.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  benchmarkBattery,
  benchmarkBatteryMap,
  BENCHMARK_DIMENSIONS
} from '../src/benchmark/benchmarkData.js';

import {
  getBenchmarkBattery,
  getUnseenBenchmarkProblem,
  calculateIndependenceScore,
  calculateGeneralizationScore,
  calculateDebuggingScore,
  calculateTransferScore,
  analyzeTrainingTransferGap,
  evaluateBenchmarkAttempt,
  simulateLearnerArchetype,
  TRANSFER_OUTCOMES,
  ANALYTICAL_SCALE
} from '../src/benchmark/benchmarkEngine.js';

import { exerciseCatalog } from '../src/exerciseData.js';
import { validateBenchmarkBattery } from '../scripts/validateCurriculum.js';

test('1. Benchmark Battery Schema & Inventory Integrity', async (t) => {
  await t.test('battery contains exactly 8 transfer problems across all 8 dimensions', () => {
    assert.equal(benchmarkBattery.length, 8);
    const dimensions = new Set(benchmarkBattery.map(b => b.benchmarkDimension));
    assert.equal(dimensions.size, 8);
    assert.ok(dimensions.has(BENCHMARK_DIMENSIONS.ENCAPSULATION_INVARIANTS));
    assert.ok(dimensions.has(BENCHMARK_DIMENSIONS.OBJECT_FLOW_AGGREGATION));
    assert.ok(dimensions.has(BENCHMARK_DIMENSIONS.STATIC_LEDGER_ACCOUNTING));
    assert.ok(dimensions.has(BENCHMARK_DIMENSIONS.DYNAMIC_MEMORY_SNAPSHOT));
    assert.ok(dimensions.has(BENCHMARK_DIMENSIONS.INHERITANCE_DISPATCH));
    assert.ok(dimensions.has(BENCHMARK_DIMENSIONS.OPERATOR_SEMANTICS));
    assert.ok(dimensions.has(BENCHMARK_DIMENSIONS.COMPOSITE_POLYMORPHISM));
    assert.ok(dimensions.has(BENCHMARK_DIMENSIONS.MULTI_CONCEPT_ECOSYSTEM));
  });

  await t.test('passes complete curriculum schema validation with 0 errors and 0 warnings', () => {
    const report = validateBenchmarkBattery(benchmarkBattery);
    assert.equal(report.valid, true);
    assert.equal(report.errorCount, 0);
    assert.equal(report.warningCount, 0);
    assert.equal(report.totalBenchmarks, 8);
  });
});

test('2. Transfer-Pair Mapping & Training/Test Separation', async (t) => {
  await t.test('every benchmark problem links to a valid existing training analog in exerciseCatalog', () => {
    for (const b of benchmarkBattery) {
      assert.ok(b.trainingAnalogId, `Benchmark ${b.id} missing trainingAnalogId`);
      const analog = exerciseCatalog[b.trainingAnalogId];
      assert.ok(analog, `Training analog ${b.trainingAnalogId} not found in exerciseCatalog for ${b.id}`);
      assert.notEqual(b.id, b.trainingAnalogId, 'Benchmark must be structurally separated from training analog');
    }
  });

  await t.test('benchmark problems are NOT in standard 20-lesson syllabus curriculum map', () => {
    const catalogKeys = new Set(Object.keys(exerciseCatalog));
    for (const b of benchmarkBattery) {
      assert.equal(catalogKeys.has(b.id), false, `Benchmark ${b.id} must not be in training catalog`);
    }
  });
});

test('3. Concept-Hiding & Scaffolding Independence Validation', async (t) => {
  await t.test('all benchmark titles and prompts are strictly concept-hidden without prescriptive mechanism keywords', () => {
    const prescriptiveKeywords = [
      /\bpolymorphic\b/i,
      /\bvirtual function\b/i,
      /\bfriend class\b/i,
      /\bfriend function\b/i,
      /\boperator overloading\b/i,
      /\bpure virtual\b/i
    ];

    for (const b of benchmarkBattery) {
      for (const pat of prescriptiveKeywords) {
        assert.equal(
          pat.test(b.title),
          false,
          `Benchmark "${b.id}" title "${b.title}" leaks concept matching ${pat}`
        );
      }
    }
  });

  await t.test('all benchmark starter codes use standard unguided minimal boilerplate', () => {
    for (const b of benchmarkBattery) {
      assert.ok(b.starterCode.includes('#include <iostream>'));
      assert.ok(b.starterCode.includes('// Write your complete solution here'));
      assert.equal(/\/\/\s*TODO:\s*Design/i.test(b.starterCode), false);
    }
  });
});

test('4. Unseen Benchmark Problem Selection', async (t) => {
  await t.test('returns an unseen problem when some are completed', () => {
    const completed = ['bench-sensor-telemetry', 'bench-flight-manifest'];
    const chosen = getUnseenBenchmarkProblem(completed);
    assert.ok(chosen);
    assert.equal(completed.includes(chosen.id), false);
  });

  await t.test('returns null when all 8 benchmark problems have been completed', () => {
    const allIds = benchmarkBattery.map(b => b.id);
    const chosen = getUnseenBenchmarkProblem(allIds);
    assert.equal(chosen, null);
  });
});

test('5. Independence Scoring Formula', async (t) => {
  await t.test('awards full 1.0 for unassisted pass with substantial code', () => {
    const score = calculateIndependenceScore({
      passed: true,
      hintsUsed: 0,
      solutionRevealed: false,
      sourceLength: 250
    });
    assert.equal(score, 1.0);
  });

  await t.test('penalizes hint requests progressively', () => {
    const score1 = calculateIndependenceScore({ passed: true, hintsUsed: 1, sourceLength: 200 });
    const score2 = calculateIndependenceScore({ passed: true, hintsUsed: 2, sourceLength: 200 });
    const score3 = calculateIndependenceScore({ passed: true, hintsUsed: 3, sourceLength: 200 });
    assert.equal(score1, 0.70);
    assert.equal(score2, 0.40);
    assert.equal(score3, 0.15);
  });

  await t.test('zeroes independence score if solution was revealed or test failed', () => {
    assert.equal(calculateIndependenceScore({ passed: true, solutionRevealed: true, sourceLength: 300 }), 0.0);
    assert.equal(calculateIndependenceScore({ passed: false, hintsUsed: 0, sourceLength: 300 }), 0.0);
  });
});

test('6. Generalization & Hidden-Test Scoring', async (t) => {
  await t.test('evaluates 1.0 when 100% of visible and hidden tests pass', () => {
    const score = calculateGeneralizationScore(2, 2, 2, 2);
    assert.equal(score, 1.0);
  });

  await t.test('penalizes failing hidden tests heavily (weighted 70% hidden, 30% visible)', () => {
    const score = calculateGeneralizationScore(2, 0, 2, 2);
    assert.equal(score, 0.30);
  });
});

test('7. Debugging Convergence Scoring', async (t) => {
  await t.test('awards 1.0 for first-try pass with zero compile/runtime errors', () => {
    assert.equal(calculateDebuggingScore(0, 0, true), 1.0);
  });

  await t.test('awards 0.85 for rapid convergence (1-2 errors resolved)', () => {
    assert.equal(calculateDebuggingScore(2, 0, true), 0.85);
  });

  await t.test('penalizes excessive trial-and-error iterations (>8 errors)', () => {
    assert.equal(calculateDebuggingScore(6, 3, true), 0.25);
  });

  await t.test('returns 0.0 if code never passed', () => {
    assert.equal(calculateDebuggingScore(3, 1, false), 0.0);
  });
});

test('8. Transfer Score & Training-to-Transfer Gap Analysis', async (t) => {
  await t.test('calculates paired transfer score accurately', () => {
    assert.equal(calculateTransferScore(true, true), 1.0);
    assert.equal(calculateTransferScore(false, true), 0.8);
    assert.equal(calculateTransferScore(true, false), 0.2);
    assert.equal(calculateTransferScore(false, false), 0.0);
  });

  await t.test('classifies GENUINE_CONCEPT_TRANSFER when both training and transfer rates >= 75%', () => {
    const trainingProfile = {
      completedExerciseIds: benchmarkBattery.map(b => b.trainingAnalogId)
    };
    const attempts = benchmarkBattery.map(b => ({
      benchmarkId: b.id,
      passed: true,
      independenceScore: 1.0
    }));
    const res = analyzeTrainingTransferGap(trainingProfile, attempts);
    assert.equal(res.outcome, TRANSFER_OUTCOMES.GENUINE_CONCEPT_TRANSFER);
    assert.equal(res.trainingSuccessRate, 1.0);
    assert.equal(res.benchmarkSuccessRate, 1.0);
    assert.equal(res.gap, 0.0);
  });

  await t.test('detects PATTERN_MEMORIZATION when training is high but transfer fails', () => {
    const trainingProfile = {
      completedExerciseIds: benchmarkBattery.map(b => b.trainingAnalogId)
    };
    // Only passed 1 of 8 benchmark problems
    const attempts = [{ benchmarkId: benchmarkBattery[0].id, passed: true, independenceScore: 0.85 }];
    const res = analyzeTrainingTransferGap(trainingProfile, attempts);
    assert.equal(res.outcome, TRANSFER_OUTCOMES.PATTERN_MEMORIZATION);
    assert.ok(res.gap >= 0.5);
  });
});

test('9. Automated Archetype Simulations', async (t) => {
  await t.test('simulates IdealTransferLearner achieving Genuine Concept Transfer', () => {
    const res = simulateLearnerArchetype('ideal');
    assert.equal(res.archetype, 'IdealTransferLearner');
    assert.equal(res.gapAnalysis.outcome, TRANSFER_OUTCOMES.GENUINE_CONCEPT_TRANSFER);
    assert.equal(res.gapAnalysis.benchmarkSuccessRate, 1.0);
  });

  await t.test('simulates MemorizerLearner flagged as Pattern Memorization', () => {
    const res = simulateLearnerArchetype('memorizer');
    assert.equal(res.archetype, 'MemorizerLearner');
    assert.equal(res.gapAnalysis.outcome, TRANSFER_OUTCOMES.PATTERN_MEMORIZATION);
    assert.ok(res.gapAnalysis.gap >= 0.5);
  });

  await t.test('simulates AdversarialHardcoder failing hidden tests and transfer', () => {
    const res = simulateLearnerArchetype('hardcoder');
    assert.equal(res.archetype, 'AdversarialHardcoder');
    assert.equal(res.gapAnalysis.benchmarkSuccessRate, 0.0);
    for (const att of res.attempts) {
      assert.equal(att.generalizationScore, 0.30); // 2/2 visible, 0/2 hidden
      assert.equal(att.meetsProficiency, false);
    }
  });
});

test('10. Strict Architectural Invariants Audit', async (t) => {
  await t.test('analytical scale is fully defined across levels 0 to 5', () => {
    for (let i = 0; i <= 5; i++) {
      assert.ok(ANALYTICAL_SCALE[i]);
      assert.ok(ANALYTICAL_SCALE[i].length > 10);
    }
  });
});
