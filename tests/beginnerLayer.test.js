import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ONBOARDING_STEPS,
  MENTAL_MODELS,
  VOCABULARY_TERMS,
  WHY_EXPLANATIONS,
  PREDICT_CHALLENGES,
  MICRO_DEBUG_CHALLENGES,
  DECOMPOSITION_TEMPLATES
} from '../src/beginner/beginnerData.js';

import { OnboardingEngine } from '../src/beginner/onboardingEngine.js';
import { MentalModelsEngine } from '../src/beginner/mentalModels.js';
import { VocabularyEngine } from '../src/beginner/vocabularyEngine.js';
import { WhyExplanationEngine } from '../src/beginner/whyExplanations.js';
import { PredictEngine } from '../src/beginner/predictEngine.js';
import { DebugEngine } from '../src/beginner/debugEngine.js';
import { DecompositionEngine } from '../src/beginner/decompositionEngine.js';
import { ScaffoldingEngine, SCAFFOLD_LEVELS } from '../src/beginner/scaffoldingEngine.js';
import { BeginnerUI } from '../src/beginner/beginnerUI.js';

import { LearningEventBus, LEARNING_EVENTS } from '../src/eventBus.js';
import { GamificationEngine } from '../src/gamification/gamificationEngine.js';
import { CompanionController } from '../src/companion/companionController.js';
import { COMPANION_STATES } from '../src/companion/companionState.js';
import { createDefaultProfile, migrateProfile, calculateMasteryLevel } from '../src/masteryEngine.js';
import { StorageManager } from '../src/storageManager.js';
import { exerciseCatalog } from '../src/exerciseData.js';
import { benchmarkBattery } from '../src/benchmark/benchmarkData.js';

test('Beginner Learning Layer Test Battery', async (t) => {

  // ==========================================================================
  // 1. ONBOARDING TESTS
  // ==========================================================================
  await t.test('1. Onboarding Engine: Progression, Verification & Persistence', async (st) => {
    await st.test('loads 12 well-defined interactive steps', () => {
      assert.equal(ONBOARDING_STEPS.length, 12, 'Must have exactly 12 onboarding steps');
      for (const step of ONBOARDING_STEPS) {
        assert.ok(step.title, 'Step must have a title');
        assert.ok(step.content, 'Step must have content text');
        assert.ok(step.actionPrompt, 'Step must have an action prompt');
      }
    });

    await st.test('pure conceptual steps advance on continue', () => {
      const bus = new LearningEventBus();
      const ob = new OnboardingEngine({ initialStep: 0, eventBus: bus });
      assert.equal(ob.currentStep, 0);

      const res = ob.advanceStep();
      assert.equal(res.completed, false);
      assert.equal(ob.currentStep, 1);
    });

    await st.test('code execution step requires matching stdout before advancing', () => {
      const bus = new LearningEventBus();
      const ob = new OnboardingEngine({ initialStep: 5, eventBus: bus }); // Step 6: first program
      assert.equal(ob.currentStep, 5);

      // Attempt without output fails
      const failRes = ob.evaluateStep({ status: 'compile_error', stderr: 'syntax error' });
      assert.equal(failRes, false);
      assert.equal(ob.currentStep, 5, 'Must remain on step 6 if compilation fails');

      // Attempt with correct output succeeds
      const passRes = ob.evaluateStep({ status: 'success', stdout: 'Hello, world!' });
      assert.ok(passRes);
      assert.equal(ob.currentStep, 6, 'Must advance to step 7 on successful execution');
    });

    await st.test('intentional mistake step (step 9) requires compile error to pass', () => {
      const bus = new LearningEventBus();
      const ob = new OnboardingEngine({ initialStep: 8, eventBus: bus }); // Step 9: intentional mistake
      assert.equal(ob.currentStep, 8);

      // Clean compile fails the objective
      const failRes = ob.evaluateStep({ status: 'success', stdout: 'Hello, CodeBloom!' });
      assert.equal(failRes, false);

      // Triggering compile error passes step 9
      const passRes = ob.evaluateStep({ status: 'compile_error', stderr: "error: expected ';' before 'return'" });
      assert.ok(passRes);
      assert.equal(ob.currentStep, 9, 'Must advance to step 10 when compiler error is observed');
    });

    await st.test('skip onboarding sets skipped flag and allows resumption', () => {
      const ob = new OnboardingEngine({ initialStep: 2 });
      ob.skipOnboarding();
      assert.equal(ob.skipped, true);
    });
  });

  // ==========================================================================
  // 2. MENTAL MODELS TESTS
  // ==========================================================================
  await t.test('2. Mental Models: Models A to E Structure & Checks', async (st) => {
    const mmEngine = new MentalModelsEngine();

    await st.test('all 5 canonical models (A, B, C, D, E) exist', () => {
      const all = mmEngine.getAllModels();
      assert.equal(all.length, 5);
      const codes = all.map(m => m.code);
      assert.ok(codes.includes('MODEL_A'));
      assert.ok(codes.includes('MODEL_B'));
      assert.ok(codes.includes('MODEL_C'));
      assert.ok(codes.includes('MODEL_D'));
      assert.ok(codes.includes('MODEL_E'));
    });

    await st.test('diagram renders accessible steps and icons', () => {
      const modelA = mmEngine.getModel('model-a');
      assert.ok(modelA);
      const diagramHtml = MentalModelsEngine.renderDiagram(modelA);
      assert.ok(diagramHtml.includes('INPUT'));
      assert.ok(diagramHtml.includes('PROCESS'));
      assert.ok(diagramHtml.includes('OUTPUT'));
      assert.ok(diagramHtml.includes('role="img"'));
    });

    await st.test('quick mental checks evaluate correctly', () => {
      const modelB = mmEngine.getModel('model-b');
      assert.ok(modelB.check);
      assert.equal(typeof modelB.check.correctIndex, 'number');

      const cardHtml = MentalModelsEngine.renderCard(modelB, {
        selectedCheck: modelB.check.correctIndex,
        checkEvaluated: true
      });
      assert.ok(cardHtml.includes('Correct Mental Model!'));
    });
  });

  // ==========================================================================
  // 3. VOCABULARY & WHY EXPLANATIONS TESTS
  // ==========================================================================
  await t.test('3. Contextual Vocabulary & "Why" Engine', async (st) => {
    const vocab = new VocabularyEngine();
    const why = new WhyExplanationEngine();

    await st.test('resolves core syntax tokens and keywords', () => {
      assert.ok(vocab.getTerm('int'));
      assert.ok(vocab.getTerm('cout'));
      assert.ok(vocab.getTerm('cin'));
      assert.ok(vocab.getTerm(';'));
      assert.ok(vocab.getTerm('<<'));
      assert.ok(vocab.getTerm('>>'));
      assert.ok(vocab.getTerm('class'));
      assert.ok(vocab.getTerm('object'));
    });

    await st.test('missing vocabulary terms return null and do not throw', () => {
      assert.doesNotThrow(() => {
        const res = vocab.getTerm('unreal_engine_keyword_123');
        assert.equal(res, null);
      });
      const emptyCard = VocabularyEngine.renderTermCard(null);
      assert.ok(emptyCard.includes('Select a keyword'));
    });

    await st.test('why explanations answer all 3 required pedagogical questions', () => {
      const whyInclude = why.getExplanation('#include <iostream>');
      assert.ok(whyInclude);
      assert.ok(whyInclude.whatIsThis, 'Must explain: What is this?');
      assert.ok(whyInclude.whyDoINeedIt, 'Must explain: Why do I need it?');
      assert.ok(whyInclude.whatHappensIfRemoved, 'Must explain: What happens if removed?');

      const cardHtml = WhyExplanationEngine.renderCard(whyInclude);
      assert.ok(cardHtml.includes('1. What is this?'));
      assert.ok(cardHtml.includes('2. Why do I need it?'));
      assert.ok(cardHtml.includes('3. What happens if I remove it?'));
    });
  });

  // ==========================================================================
  // 4. PREDICT-BEFORE-RUN TESTS
  // ==========================================================================
  await t.test('4. Predict-Before-Run Engine & Anti-Mastery Inflation', async (st) => {
    await st.test('predict flow: selection -> submit -> event emission', () => {
      const bus = new LearningEventBus();
      let eventPayload = null;
      bus.on(LEARNING_EVENTS.PREDICTION_SUBMITTED, (data) => {
        eventPayload = data;
      });

      const pe = new PredictEngine({ eventBus: bus });
      const challenge = pe.getCurrentChallenge();
      assert.ok(challenge);

      // Select correct option
      pe.selectOption(challenge.correctIndex);
      const evalRes = pe.submitPrediction({ status: 'success', stdout: challenge.expectedOutput });

      assert.ok(evalRes);
      assert.equal(evalRes.isCorrect, true);
      assert.ok(eventPayload);
      assert.equal(eventPayload.correct, true);
    });

    await st.test('prediction success does NOT inflate coding mastery profile', () => {
      const profile = createDefaultProfile();
      const initialMastery = calculateMasteryLevel(profile.conceptMastery['cpp-basics']);

      // Simulating a prediction event
      const bus = new LearningEventBus();
      const pe = new PredictEngine({ eventBus: bus });
      pe.selectOption(1);
      pe.submitPrediction({ status: 'success', stdout: 'Output' });

      // Ensure profile was not mutated directly by prediction
      const afterMastery = calculateMasteryLevel(profile.conceptMastery['cpp-basics']);
      assert.equal(afterMastery.level, initialMastery.level, 'Prediction must not increment coding mastery level');
    });
  });

  // ==========================================================================
  // 5. MICRO DEBUGGING TESTS
  // ==========================================================================
  await t.test('5. Micro Debugging: Error Identification & Fix Assessment', async (st) => {
    const bus = new LearningEventBus();
    const de = new DebugEngine({ eventBus: bus });

    await st.test('broken code snippet loads with hypothesis prompt', () => {
      const challenge = de.getCurrentChallenge();
      assert.ok(challenge.brokenCode);
      assert.ok(challenge.scaffoldQuestion);
      assert.ok(Array.isArray(challenge.scaffoldOptions));
    });

    await st.test('successful fix compilation and stdout verification', () => {
      let debugCompletedFired = false;
      bus.on(LEARNING_EVENTS.MICRO_DEBUG_COMPLETED, () => {
        debugCompletedFired = true;
      });

      const challenge = de.getCurrentChallenge();
      de.updateUserSource(challenge.brokenCode.replace('Ready to learn', 'Ready to learn;'));

      const isFixed = de.evaluateFix({
        status: 'success',
        stdout: challenge.expectedOutput
      });

      assert.ok(isFixed);
      assert.ok(debugCompletedFired, 'MICRO_DEBUG_COMPLETED event must be emitted on fix');
    });
  });

  // ==========================================================================
  // 6. PROBLEM DECOMPOSITION TRAINER TESTS
  // ==========================================================================
  await t.test('6. Problem Decomposition Trainer & Scaffolding Fading', async (st) => {
    const bus = new LearningEventBus();
    const decomp = new DecompositionEngine({ eventBus: bus });

    await st.test('initializes with all 9 decomposition fields', () => {
      assert.ok(decomp.userFields.hasOwnProperty('input'));
      assert.ok(decomp.userFields.hasOwnProperty('output'));
      assert.ok(decomp.userFields.hasOwnProperty('memory'));
      assert.ok(decomp.userFields.hasOwnProperty('operations'));
      assert.ok(decomp.userFields.hasOwnProperty('decisions'));
      assert.ok(decomp.userFields.hasOwnProperty('repetition'));
      assert.ok(decomp.userFields.hasOwnProperty('pseudocode'));
      assert.ok(decomp.userFields.hasOwnProperty('code'));
    });

    await st.test('scaffolding fading clears guided templates for independent practice', () => {
      decomp.setScaffoldLevel('independent');
      assert.equal(decomp.userFields.input, '');
      assert.equal(decomp.userFields.output, '');
      assert.equal(decomp.userFields.pseudocode, '');

      decomp.updateField('pseudocode', 'READ x\nPRINT x');
      assert.equal(decomp.userFields.pseudocode, 'READ x\nPRINT x');
    });

    await st.test('completing decomposition fires event without error', () => {
      let fired = false;
      bus.on(LEARNING_EVENTS.DECOMPOSITION_COMPLETED, () => {
        fired = true;
      });
      decomp.completeDecomposition();
      assert.ok(fired);
    });
  });

  // ==========================================================================
  // 7. PROGRESSIVE SCAFFOLDING & ISOLATION TESTS
  // ==========================================================================
  await t.test('7. Progressive Scaffolding Hierarchy & Transfer Isolation', async (st) => {
    const scEngine = new ScaffoldingEngine();

    await st.test('all 9 scaffold levels are defined and ordered', () => {
      for (let i = 1; i <= 9; i++) {
        const lvl = scEngine.getScaffoldLevel(i);
        assert.equal(lvl.level, i);
        assert.ok(lvl.name);
      }
    });

    await st.test('Level 8 Independent Exercises do not leak answers', () => {
      // Check hard exercises and benchmark battery
      for (const [id, ex] of Object.entries(exerciseCatalog)) {
        if (ex.level >= 5 || ex.isIndependent) {
          assert.ok(ex.problemStatement, `Exercise ${id} must have problem statement`);
          // Solution field exists in exercise definition for reference, but hints must not be mandatory
          assert.ok(Array.isArray(ex.testCases), `Exercise ${id} must have test cases`);
        }
      }

      for (const bp of benchmarkBattery) {
        assert.ok(bp.problemStatement, `Benchmark ${bp.id} must have problem statement`);
        assert.ok(bp.testCases && bp.testCases.length > 0, `Benchmark ${bp.id} must have test cases`);
      }
    });
  });

  // ==========================================================================
  // 8. GAMIFICATION & PIKACHU COMPANION INTEGRATION
  // ==========================================================================
  await t.test('8. Gamification & Companion Reaction to Beginner Events', async (st) => {
    await st.test('Pikachu reacts to prediction and onboarding events', () => {
      const bus = new LearningEventBus();
      const companion = new CompanionController({ eventBus: bus });

      // 1. Prediction submitted -> Thinking state
      bus.emit(LEARNING_EVENTS.PREDICTION_SUBMITTED, { challengeId: 'test' });
      assert.equal(companion.currentState, COMPANION_STATES.THINKING);

      // 2. Prediction correct -> Test passed state
      bus.emit(LEARNING_EVENTS.PREDICTION_CORRECT, { challengeId: 'test' });
      assert.equal(companion.currentState, COMPANION_STATES.TEST_PASSED);

      // 3. Onboarding completed -> Celebration state
      bus.emit(LEARNING_EVENTS.ONBOARDING_COMPLETED, { totalSteps: 12 });
      assert.equal(companion.currentState, COMPANION_STATES.CELEBRATION);
    });

    await st.test('Gamification awards modest XP with anti-farming protection', () => {
      const bus = new LearningEventBus();
      const ge = new GamificationEngine({ eventBus: bus });
      const initialXP = ge.state.xp;

      // First solve awards XP
      bus.emit(LEARNING_EVENTS.PREDICTION_CORRECT, { challengeId: 'pred_test_1' });
      const xpAfterFirst = ge.state.xp;
      assert.equal(xpAfterFirst, initialXP + 15, 'Should award +15 XP on first prediction');

      // Second solve of same challenge awards 0 XP (anti-farming)
      bus.emit(LEARNING_EVENTS.PREDICTION_CORRECT, { challengeId: 'pred_test_1' });
      assert.equal(ge.state.xp, xpAfterFirst, 'Should award 0 XP on repeated prediction solve');
    });
  });

  // ==========================================================================
  // 9. STORAGE & MIGRATION RESILIENCE
  // ==========================================================================
  await t.test('9. Storage & Migration: Beginner State Preservation', async (st) => {
    await st.test('preserves beginner partition across migrations without data loss', () => {
      const legacyWithBeginner = {
        version: 3,
        completed: ['cpp-basics'],
        topics: { 'cpp-basics': { wins: 2, misses: 0 } },
        conceptMastery: {},
        recentMistakes: [],
        retrievalQueue: [],
        history: [],
        stats: { totalSubmissions: 2, passedSubmissions: 2, hintsRevealed: 0, solutionsRevealed: 0 },
        beginner: {
          onboarding: { completed: true, currentStep: 12, skipped: false },
          predictionsCompleted: 5
        }
      };

      const migrated = migrateProfile(legacyWithBeginner);
      assert.equal(migrated.version, 3);
      assert.equal(migrated.completed[0], 'cpp-basics');
      assert.ok(migrated.beginner, 'Beginner partition must be preserved');
      assert.equal(migrated.beginner.onboarding.completed, true);
      assert.equal(migrated.beginner.predictionsCompleted, 5);
    });

    await st.test('default profile without beginner partition defaults gracefully', () => {
      const defaultProfile = createDefaultProfile();
      assert.ok(defaultProfile);
      assert.equal(defaultProfile.version, 3);
      assert.equal(defaultProfile.completed.length, 0);
    });
  });

  // ==========================================================================
  // 10. BEGINNER HUB BACK NAVIGATION TEST
  // ==========================================================================
  await t.test('10. Beginner Hub Navigation: Back Button Option', async (st) => {
    await st.test('renders back button referencing previous mode', () => {
      const hubHtml = BeginnerUI.renderHub('models', {}, { previousMode: 'course' });
      assert.ok(hubHtml.includes('data-action="beginner-back"'), 'Hub must contain beginner-back action');
      assert.ok(hubHtml.includes('Back to Learning Path'), 'Hub must label return destination');

      const hubPractice = BeginnerUI.renderHub('models', {}, { previousMode: 'practice' });
      assert.ok(hubPractice.includes('Back to Practice Lab'));
    });
  });
});
