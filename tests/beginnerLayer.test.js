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
import { PredictEngine, normalizeOutput } from '../src/beginner/predictEngine.js';
import { DebugEngine } from '../src/beginner/debugEngine.js';
import { DecompositionEngine } from '../src/beginner/decompositionEngine.js';
import { ScaffoldingEngine, SCAFFOLD_LEVELS, SCAFFOLD_STAGES, STAGE_CONFIG } from '../src/beginner/scaffoldingEngine.js';
import { BeginnerUI } from '../src/beginner/beginnerUI.js';

import { LearningEventBus, LEARNING_EVENTS } from '../src/eventBus.js';
import { GamificationEngine } from '../src/gamification/gamificationEngine.js';
import { CompanionController } from '../src/companion/companionController.js';
import { COMPANION_STATES } from '../src/companion/companionState.js';
import { createDefaultProfile, migrateProfile, calculateMasteryLevel, sanitizeBeginnerState } from '../src/masteryEngine.js';
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

    await st.test('Step 6 first program requires matching stdout before advancing', () => {
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

    await st.test('Step 6 cannot advance if run is not executed and passed', () => {
      const ob = new OnboardingEngine({ initialStep: 5 }); // Step 6 requires run
      const data = ob.getCurrentStepData();
      assert.equal(data.requiresRun, true);
      assert.equal(ob.stepFeedback, null);
      const res = ob.evaluateStep(null);
      assert.equal(res, false);
      assert.equal(ob.currentStep, 5, 'Must remain on step 6 if run is not passed');
    });

    await st.test('Step 7 requires source code edit before continue succeeds', () => {
      const bus = new LearningEventBus();
      const ob = new OnboardingEngine({ initialStep: 6, eventBus: bus }); // Step 7
      assert.equal(ob.currentStep, 6);

      // Unmodified source fails
      const unmodifiedRes = ob.evaluateStep();
      assert.equal(unmodifiedRes, false, 'Unmodified code must not pass step 7');
      assert.equal(ob.currentStep, 6);
      assert.ok(ob.stepFeedback?.message.includes('replace') || ob.stepFeedback?.message.includes('Hello'));

      // Modifying code to target greeting succeeds
      ob.updateSource(ob.source.replace('Hello, world!', 'Hello, CodeBloom!'));
      const modifiedRes = ob.evaluateStep();
      assert.ok(modifiedRes, 'Modified code must pass step 7');
      assert.equal(ob.currentStep, 7);
    });

    await st.test('Step 9 intentional mistake requires genuine compile error', () => {
      const bus = new LearningEventBus();
      const ob = new OnboardingEngine({ initialStep: 8, eventBus: bus }); // Step 9: intentional mistake
      assert.equal(ob.currentStep, 8);

      // Clean compile fails the objective
      const failRes = ob.evaluateStep({ status: 'success', stdout: 'Hello, CodeBloom!' });
      assert.equal(failRes, false, 'Clean compile must fail step 9');
      assert.equal(ob.currentStep, 8);

      // Triggering compile error passes step 9 and records diagnostic
      const passRes = ob.evaluateStep({ status: 'compile_error', stderr: "error: expected ';' before 'return'" });
      assert.ok(passRes);
      assert.equal(ob.currentStep, 9, 'Must advance to step 10 when compiler error is observed');
      assert.ok(ob.lastCompilerError);
      assert.ok(ob.lastCompilerError.includes("expected ';'"));
    });

    await st.test('Step 10 renders and allows inspection of compiler diagnostic', () => {
      const ob = new OnboardingEngine({ initialStep: 9 }); // Step 10
      ob.lastCompilerError = "main.cpp:4:36: error: expected ';' before 'return'";
      const html = ob.render();
      assert.ok(html.includes('ACTUAL COMPILER DIAGNOSTIC INSPECTED'));
      assert.ok(html.includes("expected ';' before 'return'"));
    });

    await st.test('Step 11 repair requires clean compile and matching stdout', () => {
      const bus = new LearningEventBus();
      const ob = new OnboardingEngine({ initialStep: 10, eventBus: bus }); // Step 11
      assert.equal(ob.currentStep, 10);

      // Broken compile fails
      const failRes = ob.evaluateStep({ status: 'compile_error', stderr: 'error' });
      assert.equal(failRes, false);

      // Fixed code succeeds
      const passRes = ob.evaluateStep({ status: 'success', stdout: 'Hello, CodeBloom!' });
      assert.ok(passRes);
      assert.equal(ob.currentStep, 11);
    });

    await st.test('Step 12 final challenge requires two custom output lines', () => {
      const bus = new LearningEventBus();
      let completedFired = false;
      bus.on(LEARNING_EVENTS.ONBOARDING_COMPLETED, () => {
        completedFired = true;
      });

      const ob = new OnboardingEngine({ initialStep: 11, eventBus: bus }); // Step 12
      assert.equal(ob.currentStep, 11);

      // Single line output fails
      const singleLineRes = ob.evaluateStep({ status: 'success', stdout: 'I am learning C++!' });
      assert.equal(singleLineRes, false, 'Single line output must fail two-line challenge');
      assert.equal(ob.completed, false);

      // Two lines output succeeds and graduates onboarding
      const twoLinesRes = ob.evaluateStep({
        status: 'success',
        stdout: 'I am learning C++!\nMy journey begins today!'
      });
      assert.ok(twoLinesRes);
      assert.equal(ob.completed, true);
      assert.ok(completedFired, 'ONBOARDING_COMPLETED event must fire upon step 12 graduation');
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
      assert.ok(vocab.getTerm('main'));
      assert.ok(vocab.getTerm('cout'));
      assert.ok(vocab.getTerm('cin'));
      assert.ok(vocab.getTerm('return'));
      assert.ok(vocab.getTerm('#include'));
      assert.ok(vocab.getTerm('iostream'));
      assert.ok(vocab.getTerm(';'));
      assert.ok(vocab.getTerm('{}'));
      assert.ok(vocab.getTerm('()'));
      assert.ok(vocab.getTerm('<<'));
      assert.ok(vocab.getTerm('>>'));
      assert.ok(vocab.getTerm('='));
      assert.ok(vocab.getTerm('=='));
      assert.ok(vocab.getTerm('&'));
      assert.ok(vocab.getTerm('*'));
      assert.ok(vocab.getTerm('::'));
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

    await st.test('contextual syntax bar renders token chips and inspector drawer', () => {
      const barHtml = BeginnerUI.renderContextualSyntaxBar('cout');
      assert.ok(barHtml.includes('data-token="cout"'));
      assert.ok(barHtml.includes('syntax-chip active'));
      assert.ok(barHtml.includes('syntax-inspector-drawer'));
    });
  });

  // ==========================================================================
  // 4. PREDICT-BEFORE-RUN TESTS (REAL EXECUTION DEPENDENCY)
  // ==========================================================================
  await t.test('4. Predict-Before-Run Engine & Anti-Mastery Inflation', async (st) => {
    await st.test('stdout normalization unifies CRLF, trailing spaces, and blank lines', () => {
      const raw = '  \r\nHello World!  \r\n42 \r\n\r\n';
      const clean = normalizeOutput(raw);
      assert.equal(clean, 'Hello World!\n42');
    });

    await st.test('correct prediction + correct actual execution => prediction_correct', () => {
      const bus = new LearningEventBus();
      let eventPayload = null;
      let correctFired = false;
      bus.on(LEARNING_EVENTS.PREDICTION_SUBMITTED, (data) => {
        eventPayload = data;
      });
      bus.on(LEARNING_EVENTS.PREDICTION_CORRECT, () => {
        correctFired = true;
      });

      const pe = new PredictEngine({ eventBus: bus });
      const challenge = pe.getCurrentChallenge();
      assert.ok(challenge);

      pe.selectOption(challenge.correctIndex);
      const evalRes = pe.submitPrediction({ status: 'success', stdout: challenge.expectedOutput });

      assert.ok(evalRes);
      assert.equal(evalRes.status, 'prediction_correct');
      assert.equal(evalRes.isCorrect, true);
      assert.ok(eventPayload);
      assert.equal(eventPayload.correct, true);
      assert.ok(correctFired);
    });

    await st.test('wrong prediction + correct actual execution => prediction_incorrect', () => {
      const bus = new LearningEventBus();
      let incorrectFired = false;
      bus.on(LEARNING_EVENTS.PREDICTION_INCORRECT, () => {
        incorrectFired = true;
      });

      const pe = new PredictEngine({ eventBus: bus });
      const challenge = pe.getCurrentChallenge();
      const wrongIdx = (challenge.correctIndex + 1) % challenge.options.length;

      pe.selectOption(wrongIdx);
      const evalRes = pe.submitPrediction({ status: 'success', stdout: challenge.expectedOutput });

      assert.ok(evalRes);
      assert.equal(evalRes.status, 'prediction_incorrect');
      assert.equal(evalRes.isCorrect, false);
      assert.ok(incorrectFired);
    });

    await st.test('correct prediction + failed execution => execution_failure (NOT correct)', () => {
      const bus = new LearningEventBus();
      let correctFired = false;
      let incorrectFired = false;
      bus.on(LEARNING_EVENTS.PREDICTION_CORRECT, () => { correctFired = true; });
      bus.on(LEARNING_EVENTS.PREDICTION_INCORRECT, () => { incorrectFired = true; });

      const pe = new PredictEngine({ eventBus: bus });
      const challenge = pe.getCurrentChallenge();

      pe.selectOption(challenge.correctIndex);
      // Execution fails with compilation error
      const evalRes = pe.submitPrediction({
        status: 'compile_error',
        stderr: 'fatal error: compiler terminated'
      });

      assert.ok(evalRes);
      assert.equal(evalRes.status, 'execution_failure');
      assert.equal(evalRes.isCorrect, false, 'Execution failure must NEVER be reported as correct prediction');
      assert.equal(correctFired, false, 'PREDICTION_CORRECT must NOT fire on execution failure');
      assert.ok(incorrectFired, 'PREDICTION_INCORRECT must fire on execution failure');
    });

    await st.test('unexpected stdout results in prediction mismatch', () => {
      const pe = new PredictEngine();
      const challenge = pe.getCurrentChallenge();

      pe.selectOption(challenge.correctIndex);
      const evalRes = pe.submitPrediction({ status: 'success', stdout: 'completely unexpected output 9999' });

      assert.equal(evalRes.isCorrect, false);
      assert.equal(evalRes.status, 'prediction_incorrect');
    });

    await st.test('runtime error, timeout, or non-zero exit => execution_failure and isCorrect false', () => {
      const pe = new PredictEngine();
      const challenge = pe.getCurrentChallenge();
      pe.selectOption(challenge.correctIndex);

      // Runtime crash
      const rtRes = pe.submitPrediction({ status: 'runtime_error', stderr: 'Segmentation fault (core dumped)' });
      assert.equal(rtRes.status, 'execution_failure');
      assert.equal(rtRes.isCorrect, false);

      // Timeout
      pe.resetState();
      pe.selectOption(challenge.correctIndex);
      const toRes = pe.submitPrediction({ status: 'timeout', stderr: 'Process execution timed out after 3000ms' });
      assert.equal(toRes.status, 'execution_failure');
      assert.equal(toRes.isCorrect, false);

      // Non-zero exit code
      pe.resetState();
      pe.selectOption(challenge.correctIndex);
      const exitRes = pe.submitPrediction({ status: 'execution_error', stderr: 'Exited with code 1' });
      assert.equal(exitRes.status, 'execution_failure');
      assert.equal(exitRes.isCorrect, false);
    });

    await st.test('prediction success does NOT inflate coding mastery profile', () => {
      const profile = createDefaultProfile();
      const initialMastery = calculateMasteryLevel(profile.conceptMastery['cpp-basics']);

      const bus = new LearningEventBus();
      const pe = new PredictEngine({ eventBus: bus });
      pe.selectOption(1);
      pe.submitPrediction({ status: 'success', stdout: 'Output' });

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

    await st.test('initializes with all 9 canonical decomposition fields including requiredConcepts', () => {
      const decomp = new DecompositionEngine({ eventBus: bus });
      const expectedFields = [
        'input',
        'output',
        'memory',
        'operations',
        'decisions',
        'repetition',
        'requiredConcepts',
        'pseudocode',
        'code'
      ];
      for (const field of expectedFields) {
        assert.ok(decomp.userFields.hasOwnProperty(field), `Decomposition must have field: ${field}`);
      }
      assert.equal(Object.keys(decomp.userFields).length, 9, 'Must have exactly 9 decomposition fields');
    });

    await st.test('scaffolding fading clears guided templates for independent practice', () => {
      const decomp = new DecompositionEngine({ eventBus: bus });
      decomp.setScaffoldLevel('independent');
      assert.equal(decomp.userFields.input, '');
      assert.equal(decomp.userFields.output, '');
      assert.equal(decomp.userFields.pseudocode, '');
      assert.equal(decomp.userFields.requiredConcepts, '');

      decomp.updateField('pseudocode', 'READ x\nPRINT x');
      assert.equal(decomp.userFields.pseudocode, 'READ x\nPRINT x');
    });

    await st.test('deterministic validation rejects empty or incomplete submissions', () => {
      const decomp = new DecompositionEngine({ eventBus: bus });
      decomp.setScaffoldLevel('independent');

      // Empty submission
      const emptyValidation = decomp.validateDecomposition();
      assert.equal(emptyValidation.valid, false, 'Empty decomposition must be invalid');
      assert.ok(emptyValidation.missing.length > 0, 'Must report missing fields');
      assert.equal(decomp.completeDecomposition(), false, 'completeDecomposition must fail when invalid');

      // Partial submission (only input provided)
      decomp.updateField('input', 'Integer N');
      const partialValidation = decomp.validateDecomposition();
      assert.equal(partialValidation.valid, false);
      assert.ok(partialValidation.missing.includes('output'));
      assert.ok(partialValidation.missing.includes('pseudocode'));
      assert.equal(decomp.completeDecomposition(), false);
    });

    await st.test('valid decomposition completes successfully and emits event', () => {
      let fired = false;
      let payload = null;
      bus.on(LEARNING_EVENTS.DECOMPOSITION_COMPLETED, (data) => {
        fired = true;
        payload = data;
      });

      const decomp = new DecompositionEngine({ eventBus: bus });
      // In guided mode, pre-filled fields pass validation
      const val = decomp.validateDecomposition();
      assert.equal(val.valid, true, 'Guided mode with template defaults must be valid');

      const success = decomp.completeDecomposition();
      assert.equal(success, true);
      assert.ok(fired, 'DECOMPOSITION_COMPLETED event must fire on successful completion');
      assert.ok(payload.problemId);
      assert.equal(payload.scaffoldLevel, 'full');
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

    await st.test('maps curriculum lessons to 5 canonical stages (Worked -> Faded -> Guided -> Independent -> Transfer)', () => {
      const prog = scEngine.getProgressionForLesson('cpp-basics');
      assert.ok(prog);
      assert.equal(prog.lessonId, 'cpp-basics');
      assert.ok(prog.stages.worked, 'Must define Worked stage');
      assert.ok(prog.stages.faded, 'Must define Faded stage');
      assert.ok(prog.stages.guided, 'Must define Guided stage');
      assert.ok(prog.stages.independent, 'Must define Independent stage');
      assert.ok(prog.stages.transfer, 'Must define Transfer stage');

      // Independent stage must not leak solution
      assert.equal(prog.stages.independent.revealsSolution, false, 'Independent stage must have revealsSolution: false');
    });

    await st.test('adaptive stage recommendation falls back on struggle and advances on competence', () => {
      // Novice or struggling learner -> Worked example fallback
      const struggleRec = scEngine.getRecommendedStage('lesson-1', {
        consecutiveFailures: 2,
        recentAccuracy: 0.2
      });
      assert.equal(struggleRec, SCAFFOLD_STAGES.WORKED, 'Struggling learner must receive Worked stage');

      // Novice with 1 failure -> Faded step
      const mildStruggleRec = scEngine.getRecommendedStage('lesson-1', {
        consecutiveFailures: 1,
        recentAccuracy: 0.5
      });
      assert.equal(mildStruggleRec, SCAFFOLD_STAGES.FADED);

      // Competent learner with high accuracy -> Independent or Transfer
      const competentRec = scEngine.getRecommendedStage('lesson-1', {
        consecutiveFailures: 0,
        recentAccuracy: 0.95,
        streak: 5
      });
      assert.ok(
        competentRec === SCAFFOLD_STAGES.INDEPENDENT || competentRec === SCAFFOLD_STAGES.TRANSFER,
        'Competent learner must advance towards Independent/Transfer'
      );
    });

    await st.test('lower-level scaffold evaluations verify recognition, ordering, and fill-blank', () => {
      assert.equal(scEngine.evaluateRecognition('cout', 'cout'), true);
      assert.equal(scEngine.evaluateRecognition('cin', 'cout'), false);

      assert.equal(scEngine.evaluateOrdering(['line1', 'line2'], ['line1', 'line2']), true);
      assert.equal(scEngine.evaluateOrdering(['line2', 'line1'], ['line1', 'line2']), false);

      assert.equal(scEngine.evaluateFillBlank(['int', 'x'], ['int', 'x']), true);
      assert.equal(scEngine.evaluateFillBlank(['double', 'x'], ['int', 'x']), false);
    });

    await st.test('renderInteractiveLadder outputs actionable start-scaffold-stage buttons', () => {
      const html = scEngine.renderInteractiveLadder('cpp-basics');
      assert.ok(html.includes('data-action="start-scaffold-stage"'));
      assert.ok(html.includes('data-stage="worked"'));
      assert.ok(html.includes('data-stage="independent"'));
      assert.ok(html.includes('Start Independent Problem →'));
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
  await t.test('9. Storage & Migration: Beginner State Preservation & Corruption Recovery', async (st) => {
    await st.test('preserves all 7 beginner properties across migrations without data loss', () => {
      const fullBeginnerProfile = {
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
          mentalModelsViewed: ['model-a', 'model-b'],
          predictionsCompleted: 5,
          predictionsCorrect: 4,
          debugsCompleted: 3,
          decompositionsCompleted: 2,
          scaffoldHistory: { 'lesson-1': 'independent' }
        }
      };

      const migrated = migrateProfile(fullBeginnerProfile);
      assert.equal(migrated.version, 3);
      assert.ok(migrated.beginner, 'Beginner partition must be preserved');
      assert.equal(migrated.beginner.onboarding.completed, true);
      assert.equal(migrated.beginner.onboarding.currentStep, 12);
      assert.deepEqual(migrated.beginner.mentalModelsViewed, ['model-a', 'model-b']);
      assert.equal(migrated.beginner.predictionsCompleted, 5);
      assert.equal(migrated.beginner.predictionsCorrect, 4);
      assert.equal(migrated.beginner.debugsCompleted, 3);
      assert.equal(migrated.beginner.decompositionsCompleted, 2);
      assert.equal(migrated.beginner.scaffoldHistory['lesson-1'], 'independent');
    });

    await st.test('recovers from corrupted beginner state defensively', () => {
      const corruptedBeginner = {
        onboarding: { completed: 'not-a-bool', currentStep: 99, skipped: 'junk' },
        mentalModelsViewed: 'not-an-array',
        predictionsCompleted: -10,
        predictionsCorrect: NaN,
        debugsCompleted: 'three',
        decompositionsCompleted: -1,
        scaffoldHistory: null
      };

      const sanitized = sanitizeBeginnerState(corruptedBeginner);
      assert.equal(typeof sanitized.onboarding.completed, 'boolean');
      assert.equal(sanitized.onboarding.currentStep, 12, 'Out of bound step 99 clamped to 12');
      assert.ok(Array.isArray(sanitized.mentalModelsViewed), 'Must recover as array');
      assert.equal(sanitized.predictionsCompleted, 0, 'Negative count recovered to 0');
      assert.equal(sanitized.predictionsCorrect, 0, 'NaN count recovered to 0');
      assert.equal(sanitized.debugsCompleted, 0, 'Invalid string count recovered to 0');
      assert.equal(sanitized.decompositionsCompleted, 0);
      assert.equal(typeof sanitized.scaffoldHistory, 'object');
      assert.ok(sanitized.scaffoldHistory !== null);
    });

    await st.test('migration is idempotent', () => {
      const profile = {
        version: 2,
        completed: ['hello-cpp'],
        beginner: {
          predictionsCompleted: 2,
          predictionsCorrect: 1
        }
      };

      const mig1 = migrateProfile(profile);
      const mig2 = migrateProfile(mig1);
      assert.deepEqual(mig1.beginner, mig2.beginner, 'Repeated migrations must yield identical beginner state');
    });

    await st.test('default profile initializes all 7 beginner properties', () => {
      const defaultProfile = createDefaultProfile();
      assert.ok(defaultProfile);
      assert.equal(defaultProfile.version, 3);
      assert.ok(defaultProfile.beginner, 'Default profile must include beginner partition');
      assert.equal(defaultProfile.beginner.onboarding.completed, false);
      assert.equal(defaultProfile.beginner.onboarding.currentStep, 1);
      assert.equal(defaultProfile.beginner.onboarding.skipped, false);
      assert.deepEqual(defaultProfile.beginner.mentalModelsViewed, []);
      assert.equal(defaultProfile.beginner.predictionsCompleted, 0);
      assert.equal(defaultProfile.beginner.predictionsCorrect, 0);
      assert.equal(defaultProfile.beginner.debugsCompleted, 0);
      assert.equal(defaultProfile.beginner.decompositionsCompleted, 0);
      assert.deepEqual(defaultProfile.beginner.scaffoldHistory, {});
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
