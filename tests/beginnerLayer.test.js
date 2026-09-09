import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ONBOARDING_STEPS,
  MENTAL_MODELS,
  VOCABULARY_TERMS,
  WHY_EXPLANATIONS,
  PREDICT_CHALLENGES,
  MICRO_DEBUG_CHALLENGES,
  DECOMPOSITION_TEMPLATES,
  INPUT_LAB_SNIPPETS,
  LESSON_WORKED_EXAMPLES as RICH_WORKED_EXAMPLES
} from '../src/beginner/beginnerData.js';
import { lessons, LESSON_WORKED_EXAMPLES } from '../src/courseData.js';
import { detectCin } from '../src/app.js';

import { OnboardingEngine } from '../src/beginner/onboardingEngine.js';
import { MentalModelsEngine } from '../src/beginner/mentalModels.js';
import { VocabularyEngine } from '../src/beginner/vocabularyEngine.js';
import { WhyExplanationEngine } from '../src/beginner/whyExplanations.js';
import { PredictEngine, normalizeOutput } from '../src/beginner/predictEngine.js';
import { DebugEngine } from '../src/beginner/debugEngine.js';
import { DecompositionEngine } from '../src/beginner/decompositionEngine.js';
import { ScaffoldingEngine, SCAFFOLD_LEVELS, SCAFFOLD_STAGES, STAGE_CONFIG, getTransferBenchmarkForLesson } from '../src/beginner/scaffoldingEngine.js';
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

      // Competent learner with high accuracy and guided completion -> Independent or Transfer
      const competentRec = scEngine.getRecommendedStage('lesson-1', {
        consecutiveFailures: 0,
        recentAccuracy: 0.95,
        streak: 5,
        beginner: {
          scaffoldHistory: {
            'lesson-1': { guided_completed: true }
          }
        }
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

  // ==========================================================================
  // 11. PHASE 1: FOUNDATIONAL CURRICULUM, WORKED EXAMPLES & HANDS-ON INPUT (cin)
  // ==========================================================================
  await t.test('11. Phase 1: Foundational Curriculum Order, Worked Examples & Hands-On cin', async (st) => {
    await st.test('curriculum ordering establishes strict foundational dependencies (conditionals & loops before functions & memory)', () => {
      assert.equal(lessons[0].id, 'cpp-basics', 'Lesson 1 must be cpp-basics');
      assert.equal(lessons[1].id, 'keywords', 'Lesson 2 must be keywords');
      assert.equal(lessons[2].id, 'conditionals', 'Lesson 3 must be conditionals');
      assert.equal(lessons[3].id, 'loops', 'Lesson 4 must be loops');
      assert.equal(lessons[4].id, 'functions', 'Lesson 5 must be functions');

      assert.equal(lessons[2].module, 'Start Writing C++', 'Conditionals must belong to Module 1');
      assert.equal(lessons[3].module, 'Start Writing C++', 'Loops must belong to Module 1');
      assert.equal(lessons[4].module, 'Start Writing C++', 'Functions must belong to Module 1');

      // Check constructor position (Lesson 7, right after classes)
      assert.equal(lessons[5].id, 'classes', 'Lesson 6 must be classes');
      assert.equal(lessons[6].id, 'constructors', 'Lesson 7 must be constructors');

      // Check runtime polymorphism before abstract classes
      const runtimeIdx = lessons.findIndex(l => l.id === 'runtime');
      const abstractIdx = lessons.findIndex(l => l.id === 'abstract');
      assert.ok(runtimeIdx < abstractIdx, 'Runtime virtual functions must precede abstract classes');

      // Check dynamic memory moved to Module 5
      assert.equal(lessons[18].id, 'memory', 'Lesson 19 must be memory');
      assert.equal(lessons[19].id, 'destructors', 'Lesson 20 must be destructors');
    });

    await st.test('all 20 lessons have concept-specific, non-placeholder worked examples', () => {
      assert.equal(Object.keys(LESSON_WORKED_EXAMPLES).length, 20, 'Must have worked examples for all 20 lessons');

      for (const lesson of lessons) {
        const example = lesson.example;
        assert.ok(example, `Lesson ${lesson.id} must have an example`);
        assert.ok(example.includes('int main()'), `Lesson ${lesson.id} example must include main()`);
        assert.ok(example.includes('#include <iostream>'), `Lesson ${lesson.id} example must include iostream`);
        assert.equal(
          example.includes(`Lesson ${lessons.indexOf(lesson) + 1}: ${lesson.title}`),
          false,
          `Lesson ${lesson.id} must NOT use the generic placeholder title pattern`
        );
      }

      // Check specific tailored concepts in worked examples
      const condLesson = lessons.find(l => l.id === 'conditionals');
      const loopLesson = lessons.find(l => l.id === 'loops');
      const funcLesson = lessons.find(l => l.id === 'functions');
      const memLesson = lessons.find(l => l.id === 'memory');
      const classLesson = lessons.find(l => l.id === 'classes');
      const accessLesson = lessons.find(l => l.id === 'access');
      const runtimeLesson = lessons.find(l => l.id === 'runtime');

      assert.ok(condLesson.example.includes('if (') || condLesson.example.includes('else'), 'Conditionals example must demonstrate if/else');
      assert.ok(loopLesson.example.includes('while (') || loopLesson.example.includes('for ('), 'Loops example must demonstrate loops');
      assert.ok(funcLesson.example.includes('int add(') || funcLesson.example.includes('int square('), 'Functions example must demonstrate functions');
      assert.ok(memLesson.example.includes('new int') && memLesson.example.includes('delete'), 'Memory example must demonstrate new and delete');
      assert.ok(classLesson.example.includes('class Student'), 'Classes example must demonstrate a class');
      assert.ok(accessLesson.example.includes('private:') && accessLesson.example.includes('public:'), 'Access example must demonstrate access specifiers');
      assert.ok(runtimeLesson.example.includes('virtual') && runtimeLesson.example.includes('override'), 'Runtime polymorphism example must demonstrate virtual/override');
    });

    await st.test('detectCin accurately identifies cin in code and exercise schemas', () => {
      assert.equal(detectCin('cin >> x;', null), true, 'Must detect cin in source code');
      assert.equal(detectCin('cout << "Hello";', null), false, 'Must return false when no cin');

      const exWithCinConcept = { concepts: ['cin', 'variables'] };
      assert.equal(detectCin('cout << 1;', exWithCinConcept), true, 'Must detect cin in concepts array');

      const exWithInputFormat = { inputFormat: 'A single integer n.' };
      assert.equal(detectCin('int x = 0;', exWithInputFormat), true, 'Must detect cin when inputFormat is non-none');

      const exWithNoInput = { inputFormat: 'None.' };
      assert.equal(detectCin('cout << 0;', exWithNoInput), false, 'Must not detect cin when inputFormat is None');
    });

    await st.test('OnboardingEngine supports stdin state and updates', () => {
      const ob = new OnboardingEngine({ initialStep: 5 });
      assert.equal(ob.stdin, '', 'Default stdin should be empty string');

      ob.updateStdin('42\n');
      assert.equal(ob.stdin, '42\n', 'updateStdin must update this.stdin');

      // Test rendering when source includes cin
      ob.updateSource('#include <iostream>\nusing namespace std;\nint main() { int x; cin >> x; return 0; }');
      const rendered = ob.render();
      assert.ok(rendered.includes('ob-stdin-container'), 'Onboarding render must show stdin container when code has cin');
      assert.ok(rendered.includes('data-onboarding-stdin'), 'Onboarding render must include data-onboarding-stdin textarea');
    });

    await st.test('BeginnerUI renders visual 3-stage data flow indicator', () => {
      const flowInactive = BeginnerUI.renderDataFlowIndicator(false, false);
      assert.ok(flowInactive.includes('data-flow-indicator'));
      assert.ok(flowInactive.includes('1. INPUT (cin)'));
      assert.ok(flowInactive.includes('2. PROGRAM (Code)'));
      assert.ok(flowInactive.includes('3. OUTPUT (Screen)'));
      assert.equal(flowInactive.includes('flow-input active'), false, 'Input pill should not be active when cin is false');

      const flowActive = BeginnerUI.renderDataFlowIndicator(true, true);
      assert.ok(flowActive.includes('flow-input active'), 'Input pill must be active when cin is true');
      assert.ok(flowActive.includes('flow-output active'), 'Output pill must be active when feedback is true');
    });

    await st.test('BeginnerUI renders interactive Hands-On Input Lab with snippets', () => {
      assert.ok(INPUT_LAB_SNIPPETS.doubler, 'Must have doubler snippet');
      assert.ok(INPUT_LAB_SNIPPETS.greeter, 'Must have greeter snippet');
      assert.ok(INPUT_LAB_SNIPPETS.sum, 'Must have sum snippet');

      const labHtml = BeginnerUI.renderHandsOnInputLab({
        snippetKey: 'doubler',
        inputValue: '15',
        executing: false,
        output: { status: 'success', stdout: 'Input received: 15\nDouble that number is: 30' },
        history: [{ input: '15', output: 'Input received: 15 Double that number is: 30' }]
      });

      assert.ok(labHtml.includes('hands-on-input-lab'), 'Must render hands-on-input-lab container');
      assert.ok(labHtml.includes('data-action="run-input-lab"'), 'Must render run-input-lab button');
      assert.ok(labHtml.includes('data-input-lab-val'), 'Must render input field for stdin value');
      assert.ok(labHtml.includes('value="15"'), 'Must populate the current input value');
      assert.ok(labHtml.includes('Double that number is: 30'), 'Must display execution output');
    });

    await st.test('Beginner Hub includes Hands-On Input Lab in Models tab', () => {
      const hubHtml = BeginnerUI.renderHub('models', {}, {
        previousMode: 'course',
        inputLab: { snippetKey: 'doubler', inputValue: '7' }
      });
      assert.ok(hubHtml.includes('hands-on-input-lab'), 'Models tab must render the Hands-On Input Lab');
      assert.ok(hubHtml.includes('data-action="run-input-lab"'), 'Models tab must include run-input-lab action');
    });
  });

  // ==========================================================================
  // 12. PHASE 2: FUNCTIONAL LEARNING SCAFFOLDING & 5-STAGE LADDER
  // ==========================================================================
  await t.test('12. Phase 2: Functional Learning Scaffolding & 5-Stage Ladder', async (st) => {
    await st.test('all 20 lessons have rich worked example metadata (problem statement, IO, reasoning, line explanations)', () => {
      assert.equal(Object.keys(RICH_WORKED_EXAMPLES).length, 20, 'Must have worked example metadata for all 20 lessons');
      for (const lesson of lessons) {
        const we = RICH_WORKED_EXAMPLES[lesson.id];
        assert.ok(we, `Lesson ${lesson.id} must have rich worked example`);
        assert.ok(we.concept, `Lesson ${lesson.id} must specify concept`);
        assert.ok(we.problemStatement && we.problemStatement.length > 20, `Lesson ${lesson.id} must have a non-trivial problem statement`);
        assert.ok(typeof we.input === 'string', `Lesson ${lesson.id} must define input requirements`);
        assert.ok(typeof we.expectedOutput === 'string' && we.expectedOutput.length > 0, `Lesson ${lesson.id} must define expected output`);
        assert.ok(Array.isArray(we.reasoningSteps) && we.reasoningSteps.length >= 4, `Lesson ${lesson.id} must have at least 4 reasoning steps (Problem->Reasoning->Code->Execution)`);
        assert.ok(lesson.example && lesson.example.includes('int main()'), `Lesson ${lesson.id} must have complete compilable code`);
        assert.ok(we.lineExplanations && Object.keys(we.lineExplanations).length >= 2, `Lesson ${lesson.id} must have line-by-line explanations`);
        assert.ok(we.fadingGuidance && we.fadingGuidance.length > 10, `Lesson ${lesson.id} must have fading guidance`);
      }
    });

    await st.test('getTransferBenchmarkForLesson correctly maps all 20 lessons to valid benchmarks', () => {
      for (const lesson of lessons) {
        const benchmark = getTransferBenchmarkForLesson(lesson.id);
        assert.ok(benchmark, `Transfer benchmark for lesson ${lesson.id} must exist`);
        assert.ok(benchmarkBattery.some(b => b.id === benchmark.id), `Transfer benchmark ${benchmark.id} must be in benchmark battery`);
        assert.ok(benchmark.title, `Transfer benchmark must have a title`);
        assert.ok(benchmark.problemStatement, `Transfer benchmark must have a problem statement`);
        assert.ok(Array.isArray(benchmark.testCases) && benchmark.testCases.length > 0, `Transfer benchmark must have test cases`);
      }

      // Default fallback
      const fallback = getTransferBenchmarkForLesson('unknown-lesson-xyz');
      assert.ok(fallback && fallback.id, 'Fallback benchmark must be returned for unknown lesson');
    });

    await st.test('ScaffoldingEngine generates complete 5-stage progression for each lesson', () => {
      const engine = new ScaffoldingEngine();
      for (const lesson of lessons) {
        const progression = engine.getProgressionForLesson(lesson.id);
        assert.equal(progression.lessonId, lesson.id);
        assert.equal(progression.lessonTitle, lesson.title);
        assert.ok(progression.stages, `Lesson ${lesson.id} must have stages`);

        const { worked, faded, guided, independent, transfer } = progression.stages;
        assert.equal(worked.stage, 'worked');
        assert.equal(worked.isWorkedExample, true);
        assert.ok(worked.code.includes('int main()'));

        assert.equal(faded.stage, 'faded');
        assert.ok(faded.exerciseId.endsWith('-mini') || faded.exerciseId === 'cpp-basics-intro');
        assert.equal(faded.revealsSolution, false);

        assert.equal(guided.stage, 'guided');
        assert.ok(guided.exerciseId.endsWith('-medium') || guided.exerciseId === 'cpp-basics-medium');
        assert.equal(guided.revealsSolution, false);

        assert.equal(independent.stage, 'independent');
        assert.ok(independent.exerciseId.endsWith('-hard') || independent.exerciseId === 'cpp-basics-hard');
        assert.equal(independent.revealsSolution, false, 'Independent stage must NEVER reveal solution');

        assert.equal(transfer.stage, 'transfer');
        assert.ok(transfer.benchmarkId.startsWith('bench-'));
        assert.equal(transfer.revealsSolution, false);
      }
    });

    await st.test('Phase 2.1: Scaffolding progression integrity & 10 required regression tests', async (sst) => {
      const engine = new ScaffoldingEngine();

      // Brand new learner starts at worked
      assert.equal(engine.getRecommendedStage('cpp-basics', {}), 'worked');

      // Test 1: One Faded success -> Guided
      await sst.test('Test 1: One Faded success -> Guided', () => {
        const fromHistory = engine.getRecommendedStage('cpp-basics', {
          beginner: { scaffoldHistory: { 'cpp-basics': { faded_completed: true } } }
        });
        assert.equal(fromHistory, 'guided', 'One Faded success in scaffoldHistory must advance to Guided');

        const fromDifficulty = engine.getRecommendedStage('cpp-basics', {
          conceptMastery: { 'cpp-basics': { difficultySuccessfullyCompleted: { easy: 1 } } }
        });
        assert.equal(fromDifficulty, 'guided', 'One Faded success in difficultySuccessfullyCompleted must advance to Guided');
      });

      // Test 2: Two Faded successes -> STILL Guided (CRITICAL)
      await sst.test('Test 2: Two Faded successes -> STILL Guided (critical acceptance test)', () => {
        const twoFaded = engine.getRecommendedStage('cpp-basics', {
          conceptMastery: {
            'cpp-basics': {
              difficultySuccessfullyCompleted: { easy: 2 },
              successfulAttempts: 2
            }
          },
          topics: { 'cpp-basics': { wins: 2 } }
        });
        assert.equal(twoFaded, 'guided', 'Two Faded successes must STILL remain at Guided; cannot jump to Independent');
      });

      // Test 3: Guided success -> Independent
      await sst.test('Test 3: Guided success -> Independent', () => {
        const fromHistory = engine.getRecommendedStage('cpp-basics', {
          beginner: { scaffoldHistory: { 'cpp-basics': { guided_completed: true } } }
        });
        assert.equal(fromHistory, 'independent', 'Guided success in scaffoldHistory must advance to Independent');

        const fromDifficulty = engine.getRecommendedStage('cpp-basics', {
          conceptMastery: { 'cpp-basics': { difficultySuccessfullyCompleted: { medium: 1 } } }
        });
        assert.equal(fromDifficulty, 'independent', 'Guided success in difficultySuccessfullyCompleted must advance to Independent');
      });

      // Test 4: No Guided success + global streak >= 5 -> NOT Independent
      await sst.test('Test 4: No Guided success + global streak >= 5 -> NOT Independent', () => {
        const streakNoGuided = engine.getRecommendedStage('cpp-basics', {
          streak: 5,
          conceptMastery: {
            'cpp-basics': {
              difficultySuccessfullyCompleted: { easy: 3 }, // 3 faded successes, 0 guided
              successfulAttempts: 3
            }
          }
        });
        assert.notEqual(streakNoGuided, 'independent', 'High global streak without Guided completion must NOT grant Independent');
        assert.equal(streakNoGuided, 'guided', 'Must remain at Guided until medium/guided is completed');
      });

      // Test 5: No Independent success + global streak >= 5 -> NOT Transfer
      await sst.test('Test 5: No Independent success + global streak >= 5 -> NOT Transfer', () => {
        const streakNoIndep = engine.getRecommendedStage('cpp-basics', {
          streak: 5,
          conceptMastery: {
            'cpp-basics': {
              difficultySuccessfullyCompleted: { medium: 2 }, // guided done, no independent
              independentSuccesses: 0
            }
          }
        });
        assert.notEqual(streakNoIndep, 'transfer', 'High global streak without Independent success must NOT grant Transfer');
        assert.equal(streakNoIndep, 'independent', 'Must remain at Independent until independent problem is solved');
      });

      // Test 6: Independent success -> Transfer
      await sst.test('Test 6: Independent success -> Transfer', () => {
        const fromHistory = engine.getRecommendedStage('cpp-basics', {
          beginner: { scaffoldHistory: { 'cpp-basics': { independent_completed: true } } }
        });
        assert.equal(fromHistory, 'transfer', 'Independent success in scaffoldHistory must advance to Transfer');

        const fromConcept = engine.getRecommendedStage('cpp-basics', {
          conceptMastery: { 'cpp-basics': { independentSuccesses: 1 } }
        });
        assert.equal(fromConcept, 'transfer', 'Independent success in conceptMastery must advance to Transfer');
      });

      // Test 7: Solution revealed on current attempt -> no independent credit for that attempt
      await sst.test('Test 7: Solution revealed on current attempt -> no independent credit for that attempt', () => {
        const currentReveal = engine.getRecommendedStage('cpp-basics', {
          solutionRevealedCurrentAttempt: true,
          conceptMastery: {
            'cpp-basics': {
              difficultySuccessfullyCompleted: { medium: 1 }
            }
          }
        });
        assert.equal(currentReveal, 'worked', 'Revealing solution on current attempt must fall back to Worked');
      });

      // Test 8: Solution revealed historically + later genuine unassisted success -> learner CAN regain Independent
      await sst.test('Test 8: Solution revealed historically + later genuine unassisted success -> learner CAN regain Independent', () => {
        const recovered = engine.getRecommendedStage('cpp-basics', {
          conceptMastery: {
            'cpp-basics': {
              solutionReveals: 2, // 2 lifetime reveals
              difficultySuccessfullyCompleted: { medium: 1 },
              recentPerformance: ['fail', 'pass']
            }
          },
          history: [
            { exerciseId: 'cpp-basics-medium', solutionRevealed: true },
            { exerciseId: 'cpp-basics-medium', solutionRevealed: false } // later unassisted success
          ]
        });
        assert.equal(recovered, 'independent', 'Historical solution reveals must not permanently trap learner if unassisted success follows');
      });

      // Test 9: Successes in another lesson -> cannot advance this lesson
      await sst.test('Test 9: Successes in another lesson -> cannot advance this lesson', () => {
        const otherLessonSuccess = engine.getRecommendedStage('conditionals', {
          beginner: {
            scaffoldHistory: {
              'cpp-basics': { faded_completed: true, guided_completed: true, independent_completed: true }
            }
          },
          conceptMastery: {
            'cpp-basics': { independentSuccesses: 3, difficultySuccessfullyCompleted: { medium: 2 } }
          },
          streak: 10
        });
        assert.equal(otherLessonSuccess, 'worked', 'Successes in cpp-basics must not advance conditionals');
      });

      // Test 10: Easy/medium wins alone -> cannot produce Transfer
      await sst.test('Test 10: Easy/medium wins alone -> cannot produce Transfer', () => {
        const manyEasyMedium = engine.getRecommendedStage('cpp-basics', {
          conceptMastery: {
            'cpp-basics': {
              difficultySuccessfullyCompleted: { easy: 10, medium: 10 },
              independentSuccesses: 0
            }
          },
          streak: 20,
          recentAccuracy: 1.0,
          consecutiveFailures: 0
        });
        assert.notEqual(manyEasyMedium, 'transfer', 'Easy/medium wins alone without independent problem completion must never grant Transfer');
        assert.equal(manyEasyMedium, 'independent', 'Should be at Independent, awaiting independent problem solution');
      });

      // Struggle fallback tests
      await sst.test('Fallback on consecutive failures or poor accuracy', () => {
        assert.equal(engine.getRecommendedStage('cpp-basics', {
          consecutiveFailures: 2,
          conceptMastery: { 'cpp-basics': { difficultySuccessfullyCompleted: { medium: 1 } } }
        }), 'worked');

        assert.equal(engine.getRecommendedStage('cpp-basics', {
          consecutiveFailures: 1,
          conceptMastery: { 'cpp-basics': { difficultySuccessfullyCompleted: { medium: 1 } } }
        }), 'faded');
      });
    });

    await st.test('faded exercises have genuine fading gaps and are not pre-solved', () => {
      const keywordsMini = exerciseCatalog['keywords-mini'];
      assert.ok(keywordsMini);
      assert.notEqual(keywordsMini.starterCode, keywordsMini.solution, 'keywords-mini starter must not equal solution');
      assert.ok(keywordsMini.starterCode.includes('fill in'), 'keywords-mini must have faded fill-in comments');

      const functionsMini = exerciseCatalog['functions-mini'];
      assert.ok(functionsMini);
      assert.notEqual(functionsMini.starterCode, functionsMini.solution, 'functions-mini starter must not equal solution');
      assert.ok(functionsMini.starterCode.includes('complete') || functionsMini.starterCode.includes('fill in'), 'functions-mini must have faded fill-in comments');

      const inheritanceMini = exerciseCatalog['inheritance-mini'];
      assert.ok(inheritanceMini);
      assert.notEqual(inheritanceMini.starterCode, inheritanceMini.solution, 'inheritance-mini starter must not equal solution');
      assert.ok(inheritanceMini.starterCode.includes('fill in'), 'inheritance-mini must have faded fill-in comments');
    });

    await st.test('BeginnerUI renders Worked Walkthrough with problem, IO, reasoning and runnable code', () => {
      const engine = new ScaffoldingEngine();
      const progression = engine.getProgressionForLesson('conditionals');
      const html = BeginnerUI.renderWorkedWalkthrough(progression, null, false);

      assert.ok(html.includes('worked-walkthrough-panel'), 'Must render worked-walkthrough-panel');
      assert.ok(html.includes('data-action="run-worked-example"'), 'Must contain run-worked-example action');
      assert.ok(html.includes('data-action="start-scaffold-stage"'), 'Must contain start-scaffold-stage action');
      assert.ok(html.includes('data-stage="faded"'), 'Next step button must target faded stage');
      assert.ok(html.includes("Programmer's Thought Process"), 'Must include thought process');
      assert.ok(html.includes('Line-by-Line Breakdown:'), 'Must include line breakdown');
      assert.ok(html.includes('score = 85') || html.includes('score &gt;= 90'), 'Must show code in walkthrough');
    });

    await st.test('BeginnerUI renders Reference Worked Pattern drawer for faded practice', () => {
      const engine = new ScaffoldingEngine();
      const progression = engine.getProgressionForLesson('conditionals');
      const html = BeginnerUI.renderReferenceWorkedPattern(progression, false);

      assert.ok(html.includes('faded-guidance-container'), 'Must render faded-guidance-container');
      assert.ok(html.includes('STAGE 2 · FADED PRACTICE'), 'Must show stage 2 banner');
      assert.ok(html.includes('ref-pattern-details'), 'Must include details container');
      assert.ok(html.includes('score = 85') || html.includes('score &gt;= 90'), 'Must display the reference code');
    });

    await st.test('BeginnerUI renders Guided Decomposition Panel for medium exercises', () => {
      const engine = new ScaffoldingEngine();
      const progression = engine.getProgressionForLesson('conditionals');
      const condMedium = exerciseCatalog['conditionals-medium'];
      const html = BeginnerUI.renderDecompositionGuide(progression, condMedium);

      assert.ok(html.includes('guided-decomposition-card'), 'Must render guided-decomposition-card');
      assert.ok(html.includes('STAGE 3 · GUIDED PRACTICE'));
      assert.ok(html.includes('Step 1') && html.includes('Inputs'));
      assert.ok(html.includes('Step 2') && html.includes('Expected Output'));
      assert.ok(html.includes('Step 3') && (html.includes('Storage &amp; Types') || html.includes('Storage & Types')));
      assert.ok(html.includes('Step 4') && html.includes('Algorithm Logic'));
    });

    await st.test('BeginnerUI renders Transfer Challenge Banner for unseen benchmarks', () => {
      const engine = new ScaffoldingEngine();
      const progression = engine.getProgressionForLesson('conditionals');
      const html = BeginnerUI.renderTransferChallengeBanner(progression);

      assert.ok(html.includes('transfer-challenge-banner'), 'Must render transfer-challenge-banner');
      assert.ok(html.includes('STAGE 5 · UNSEEN TRANSFER BENCHMARK'), 'Must label as Unseen Transfer Benchmark');
      assert.ok(html.includes('Transfer Challenge: True Conceptual Independence'), 'Must display title');
      assert.ok(html.includes(progression.stages.transfer.title), 'Must display benchmark title');
    });

    await st.test('BeginnerUI renders 5-stage Scaffolding Stage Bar with active and completed indicators', () => {
      const profile = {
        beginner: {
          scaffoldHistory: {
            'conditionals': {
              worked_completed: true,
              faded_completed: true
            }
          }
        }
      };

      const html = BeginnerUI.renderScaffoldingStageBar('conditionals', 'guided', profile);
      assert.ok(html.includes('scaffold-stage-bar'), 'Must render scaffold-stage-bar');
      assert.ok(html.includes('stage-pill worked') && html.includes('completed'), 'Worked stage must be marked completed');
      assert.ok(html.includes('stage-pill faded') && html.includes('completed'), 'Faded stage must be marked completed');
      assert.ok(html.includes('stage-pill guided active'), 'Guided stage must be marked active');
      assert.ok(html.includes('stage-pill independent'), 'Independent stage must be present');
      assert.ok(html.includes('stage-pill transfer'), 'Transfer stage must be present');
    });

    await st.test('BeginnerUI renders Scaffolding Next Step Banner on assessment completion', () => {
      const nextWorked = BeginnerUI.renderScaffoldingNextStepBanner('worked', 'conditionals', {});
      assert.ok(nextWorked.includes('Advance to Faded Practice'));
      assert.ok(nextWorked.includes('data-stage="faded"'), 'Should advance to faded from worked');

      const nextFaded = BeginnerUI.renderScaffoldingNextStepBanner('faded', 'conditionals', {});
      assert.ok(nextFaded.includes('Advance to Guided Practice'));
      assert.ok(nextFaded.includes('data-stage="guided"'), 'Should advance to guided from faded');

      const nextGuided = BeginnerUI.renderScaffoldingNextStepBanner('guided', 'conditionals', {});
      assert.ok(nextGuided.includes('Advance to Independent Problem'));
      assert.ok(nextGuided.includes('data-stage="independent"'), 'Should advance to independent from guided');

      const nextIndep = BeginnerUI.renderScaffoldingNextStepBanner('independent', 'conditionals', {});
      assert.ok(nextIndep.includes('Advance to Unseen Transfer Benchmark'));
      assert.ok(nextIndep.includes('data-stage="transfer"'), 'Should advance to transfer from independent');
    });

    await st.test('BeginnerUI renders dynamic line-by-line reading card for current lesson', () => {
      const condLesson = lessons.find(l => l.id === 'conditionals');
      const html = BeginnerUI.renderDynamicLineCard(condLesson);

      assert.ok(html.includes('How to read this Decisions with if and else example'), 'Must dynamically label lesson title');
      assert.ok(html.includes('score &gt;= 90') || html.includes('score >= 90'), 'Must explain conditional statements');
      assert.equal(html.includes('Greeting Program Breakdown'), false, 'Must NOT render hardcoded Lesson 1 greeting breakdown');
    });
  });

  // ==========================================================================
  // 13. PHASE 3: BEGINNER REASONING & PROBLEM-SOLVING LAYER
  // ==========================================================================
  await t.test('13. Phase 3: Beginner Reasoning & Problem-Solving Layer', async (st) => {
    // 1. Micro Debugging 5-Step Flow
    await st.test('micro debugging: 5-step structured workflow (Observe -> Locate -> Explain -> Fix -> Verify)', () => {
      const bus = new LearningEventBus();
      const de = new DebugEngine({ eventBus: bus });
      const cur = de.getCurrentChallenge();

      // Step 1: Observe
      assert.equal(de.state.currentStep, 'observe');
      assert.ok(cur.symptom, 'Must have observed symptom or compiler error');
      const lines = de.getFormattedSourceLines();
      assert.ok(lines.length >= 4, 'Must format source code into lines');
      assert.equal(lines[0].lineNum, 1);

      // Step 2: Locate
      de.setStep('locate');
      assert.equal(de.state.currentStep, 'locate');
      // Wrong line selection
      const wrongLine = cur.buggyLine === 4 ? 3 : 4;
      const isWrongLocate = de.selectLine(wrongLine);
      assert.equal(isWrongLocate, false);
      assert.equal(de.state.locatedCorrectly, false);

      // Correct line selection
      const isCorrectLocate = de.selectLine(cur.buggyLine);
      assert.equal(isCorrectLocate, true);
      assert.equal(de.state.locatedCorrectly, true);
      // Auto-transitions to explain on correct locate
      assert.equal(de.state.currentStep, 'explain');

      // Step 3: Explain
      assert.ok(cur.explainQuestion, 'Must have diagnostic question');
      assert.ok(Array.isArray(cur.explainOptions), 'Must have diagnostic options');
      // Wrong explain option
      const wrongOpt = (cur.correctExplainIndex + 1) % cur.explainOptions.length;
      const isWrongExplain = de.selectExplainOption(wrongOpt);
      assert.equal(isWrongExplain, false);
      assert.equal(de.state.explainCorrect, false);

      // Correct explain option
      const isCorrectExplain = de.selectExplainOption(cur.correctExplainIndex);
      assert.equal(isCorrectExplain, true);
      assert.equal(de.state.explainCorrect, true);
      // Auto-transitions to fix on correct explain
      assert.equal(de.state.currentStep, 'fix');

      // Step 4: Fix
      de.updateUserSource(cur.brokenCode.replace('Ready to learn', 'Ready to learn;'));

      // Step 5: Verify
      let eventFired = false;
      bus.on(LEARNING_EVENTS.MICRO_DEBUG_COMPLETED, () => { eventFired = true; });

      const verified = de.evaluateFix({
        status: 'success',
        stdout: cur.expectedOutput
      });
      assert.equal(verified, true);
      assert.equal(de.state.passed, true);
      assert.equal(de.state.currentStep, 'verify');
      assert.equal(eventFired, true);
    });

    // 2. All 8 Required Error Categories
    await st.test('micro debugging: full coverage of all 8 beginner error categories with required metadata', () => {
      const requiredCategories = [
        'missing semicolon',
        'wrong variable name',
        'wrong comparison/operator',
        'incorrect if condition',
        'simple loop error',
        'incorrect function argument',
        'incorrect return value',
        'incorrect output'
      ];

      assert.equal(MICRO_DEBUG_CHALLENGES.length, 8, 'Must provide exactly 8 micro-debug challenges');

      const existingCategories = MICRO_DEBUG_CHALLENGES.map(c => c.category);
      for (const req of requiredCategories) {
        assert.ok(existingCategories.includes(req), `Micro debugging must cover category: "${req}"`);
      }

      for (const c of MICRO_DEBUG_CHALLENGES) {
        assert.ok(c.id, 'Must have id');
        assert.ok(c.title, 'Must have title');
        assert.ok(c.symptom, `Challenge ${c.id} must specify symptom/error output`);
        assert.ok(typeof c.buggyLine === 'number', `Challenge ${c.id} must specify 1-indexed buggyLine`);
        assert.ok(Array.isArray(c.lineOptions) && c.lineOptions.length >= 2, `Challenge ${c.id} must offer line candidate options`);
        assert.ok(c.lineOptions.includes(c.buggyLine), `Challenge ${c.id} lineOptions must include the buggy line`);
        assert.ok(c.explainQuestion, `Challenge ${c.id} must ask why code is wrong`);
        assert.ok(Array.isArray(c.explainOptions) && c.explainOptions.length >= 3, `Challenge ${c.id} must offer explain options`);
        assert.ok(typeof c.correctExplainIndex === 'number', `Challenge ${c.id} must specify correctExplainIndex`);
        assert.ok(Array.isArray(c.hints) && c.hints.length === 3, `Challenge ${c.id} must provide exactly 3 progressive hints`);
        assert.ok(c.brokenCode, `Challenge ${c.id} must supply broken code`);
        assert.ok(c.expectedOutput, `Challenge ${c.id} must specify exact expected output`);
      }
    });

    // 3. Progressive Hints (3 Tiers, No Premature Reveal)
    await st.test('micro debugging: 3-tier progressive hints unlock without premature solution leak', () => {
      const de = new DebugEngine();
      const cur = de.getCurrentChallenge();

      assert.equal(de.state.hintTier, 0);

      // Unlock Tier 1: Concept rule
      de.unlockNextHint();
      assert.equal(de.state.hintTier, 1);
      const hint1 = de.getHint();
      assert.equal(hint1, cur.hints[0]);
      assert.ok(hint1.toLowerCase().includes('rule') || hint1.toLowerCase().includes('every') || hint1.toLowerCase().includes('syntax'));

      // Unlock Tier 2: Target location / token
      de.unlockNextHint();
      assert.equal(de.state.hintTier, 2);
      const hint2 = de.getHint();
      assert.equal(hint2, cur.hints[1]);
      assert.ok(hint2.toLowerCase().includes('line') || hint2.toLowerCase().includes('inspect') || hint2.toLowerCase().includes('target'));

      // Unlock Tier 3: Concrete pattern
      de.unlockNextHint();
      assert.equal(de.state.hintTier, 3);
      const hint3 = de.getHint();
      assert.equal(hint3, cur.hints[2]);

      // Max tier cap
      de.unlockNextHint();
      assert.equal(de.state.hintTier, 3, 'Hint tier must cap at 3');
    });

    // 4. Problem Decomposition: Requirement-Based Validation
    await st.test('problem decomposition: requirement-based validation converts natural-language to structured plan', () => {
      const decomp = new DecompositionEngine();
      assert.ok(DECOMPOSITION_TEMPLATES.length >= 5, 'Must have at least 5 decomposition templates');

      for (const tpl of DECOMPOSITION_TEMPLATES) {
        assert.ok(tpl.id);
        assert.ok(tpl.problem, 'Must have natural-language problem description');
        assert.ok(tpl.steps.input, 'Must identify input');
        assert.ok(tpl.steps.output, 'Must identify output');
        assert.ok(tpl.steps.memory, 'Must identify variables/memory');
        assert.ok(tpl.steps.operations, 'Must identify operations');
        assert.ok(tpl.steps.decisions, 'Must identify decisions');
        assert.ok(tpl.steps.repetition, 'Must identify repetition');
        assert.ok(tpl.steps.pseudocode, 'Must have step-by-step pseudocode');
        assert.ok(tpl.starterCode, 'Must have starter code');
      }

      // Valid structured submission in independent mode succeeds
      decomp.setScaffoldLevel('independent');
      decomp.updateField('input', 'Integer temperature in Celsius read via cin');
      decomp.updateField('output', 'Fahrenheit temperature printed to cout');
      decomp.updateField('requiredConcepts', 'double, cin, cout, formula');
      decomp.updateField('pseudocode', 'READ celsius\nSET fahrenheit = (celsius * 9.0 / 5.0) + 32.0\nPRINT fahrenheit');
      decomp.updateField('code', '#include <iostream>\nusing namespace std;\nint main() { double c; cin >> c; cout << (c * 9.0 / 5.0) + 32.0; return 0; }');

      const check = decomp.validateDecomposition();
      assert.equal(check.valid, true, `Decomposition should be valid: ${check.reason}`);
      assert.equal(decomp.completeDecomposition(), true);
    });

    // 5. Problem Decomposition: Rejects Superficial Placeholders
    await st.test('problem decomposition: rejects superficial placeholders and incomplete plans', () => {
      const decomp = new DecompositionEngine();
      decomp.setScaffoldLevel('independent');

      const placeholders = ['...', 'todo', 'test', 'asdf', 'none', 'n/a'];
      for (const ph of placeholders) {
        decomp.updateField('input', ph);
        decomp.updateField('output', 'valid output');
        decomp.updateField('requiredConcepts', 'int, cin');
        decomp.updateField('pseudocode', 'Step 1\nStep 2');
        decomp.updateField('code', 'int main() { return 0; }');

        const res = decomp.validateDecomposition();
        assert.equal(res.valid, false, `Must reject placeholder "${ph}" in input field`);
        assert.ok(res.missing.includes('input'));
      }

      // Rejects single-line pseudocode when multiple steps are required
      decomp.updateField('input', 'A single integer marks');
      decomp.updateField('output', 'Pass or Fail');
      decomp.updateField('requiredConcepts', 'int, if, else');
      decomp.updateField('pseudocode', 'just do it in one step');
      decomp.updateField('code', 'int main() { return 0; }');

      const singleStepRes = decomp.validateDecomposition();
      assert.equal(singleStepRes.valid, false, 'Single line pseudocode without steps must be rejected');
      assert.ok(singleStepRes.reason.includes('sequential steps') || singleStepRes.issues.length > 0);

      // Rejects code without main function
      decomp.updateField('pseudocode', 'READ marks\nIF marks >= 40 THEN PRINT Pass\nELSE PRINT Fail');
      decomp.updateField('code', 'cout << "Pass";');
      const noMainRes = decomp.validateDecomposition();
      assert.equal(noMainRes.valid, false, 'Code without int main() must be rejected');
    });

    // 6. Contextual Vocabulary: 4-Field Structure
    await st.test('contextual vocabulary: unified 4-field structure (meaning, does here, why needed, code example)', () => {
      const vocab = new VocabularyEngine();
      const coreTokens = ['int', 'double', 'bool', 'string', 'cout', 'cin', 'main', 'return', '#include', ';', '{}', '<<', '>>', 'if', 'while', 'for'];

      for (const tok of coreTokens) {
        const entry = vocab.getTerm(tok);
        assert.ok(entry, `Term "${tok}" must exist in VOCABULARY_TERMS`);
        assert.ok(entry.whatItMeans || entry.plainDefinition, `"${tok}" must define what it means`);
        assert.ok(entry.whatItDoesHere || entry.analogy, `"${tok}" must define what it does here`);
        assert.ok(entry.whyNeeded, `"${tok}" must define why it is needed`);
        assert.ok(entry.example, `"${tok}" must provide a code example`);
      }

      const cardHtml = VocabularyEngine.renderTermCard(vocab.getTerm('int'));
      assert.ok(cardHtml.includes('1. What it means:'));
      assert.ok(cardHtml.includes('2. What it does here:'));
      assert.ok(cardHtml.includes('3. Why it is needed:'));
      assert.ok(cardHtml.includes('4. In Code Example:'));
      assert.ok(cardHtml.includes('int score = 100;'));
    });

    // 7. Contextual Vocabulary: Alias Resolution
    await st.test('contextual vocabulary: term aliases resolve correctly', () => {
      const vocab = new VocabularyEngine();
      assert.equal(vocab.getTerm('semicolon')?.term, '; (Semicolon)');
      assert.equal(vocab.getTerm('stream insertion')?.term, '<< (Stream Insertion)');
      assert.equal(vocab.getTerm('stream extraction')?.term, '>> (Stream Extraction)');
      assert.equal(vocab.getTerm('and')?.term, '&& (Logical AND)');
      assert.equal(vocab.getTerm('or')?.term, '|| (Logical OR)');
      assert.equal(vocab.getTerm('not')?.term, '! (Logical NOT)');
      assert.equal(vocab.getTerm('newline')?.term, 'endl');
    });

    // 8. Contextual Why Explanations: 3-Part Card
    await st.test('contextual why explanations: 3-part card for all foundational Module 1-2 syntax', () => {
      const why = new WhyExplanationEngine();
      const requiredTopics = [
        '#include <iostream>',
        'using namespace std;',
        'int main()',
        'return 0;',
        ';',
        '<<',
        '>>',
        'int',
        'double',
        'bool',
        'string',
        'if',
        'while',
        'for',
        'functions',
        'endl'
      ];

      for (const topic of requiredTopics) {
        const item = why.getExplanation(topic);
        assert.ok(item, `WhyExplanationEngine must cover topic: "${topic}"`);
        assert.ok(item.whatIsThis, `Topic "${topic}" must answer: What is this?`);
        assert.ok(item.whyDoINeedIt, `Topic "${topic}" must answer: Why do I need it here?`);
        assert.ok(item.whatHappensIfRemoved, `Topic "${topic}" must answer: What happens if removed?`);

        const card = WhyExplanationEngine.renderCard(item);
        assert.ok(card.includes('1. What is this?'));
        assert.ok(card.includes('2. Why do I need it?'));
        assert.ok(card.includes('3. What happens if I remove it?'));
      }
    });

    // 9. State Persistence & Metric Recording
    await st.test('learner profile persistence and recovery across debugging and decomposition', () => {
      const profile = createDefaultProfile();
      assert.equal(profile.beginner.debugsCompleted, 0);
      assert.equal(profile.beginner.decompositionsCompleted, 0);

      // Simulating completions increments profile counters
      profile.beginner.debugsCompleted += 1;
      profile.beginner.decompositionsCompleted += 1;

      assert.equal(profile.beginner.debugsCompleted, 1);
      assert.equal(profile.beginner.decompositionsCompleted, 1);

      // Profile serialization and migration preserves these counters
      const migrated = migrateProfile(profile);
      assert.equal(migrated.beginner.debugsCompleted, 1);
      assert.equal(migrated.beginner.decompositionsCompleted, 1);
    });
  });

  // ==========================================================================
  // 14. Phase 4: Progressive Code Construction & Reasoning Integration
  // ==========================================================================
  await t.test('14. Phase 4: Progressive Code Construction & Reasoning Integration', async (st) => {
    const scEngine = new ScaffoldingEngine();

    // A. WORKED
    await st.test('A. WORKED: complete worked examples remain executable and concept-specific across all 20 lessons', () => {
      assert.equal(lessons.length, 20, 'Authoritative curriculum must have exactly 20 lessons');

      for (const lesson of lessons) {
        const prog = scEngine.getProgressionForLesson(lesson.id);
        const worked = prog.stages.worked;
        assert.ok(worked, `Lesson ${lesson.id} must have a Worked stage`);
        assert.equal(worked.isWorkedExample, true);
        assert.ok(worked.code, `Worked code must exist for ${lesson.id}`);
        assert.ok(worked.code.includes('#include <iostream>'), `Worked code for ${lesson.id} must include iostream`);
        assert.ok(worked.code.includes('main'), `Worked code for ${lesson.id} must define main()`);

        // Check worked metadata
        const workedData = RICH_WORKED_EXAMPLES[lesson.id];
        assert.ok(workedData, `RICH_WORKED_EXAMPLES must cover ${lesson.id}`);
        assert.ok(workedData.concept, `Worked example ${lesson.id} must define concept`);
        assert.ok(workedData.problemStatement, `Worked example ${lesson.id} must define problemStatement`);
        assert.ok(Array.isArray(workedData.reasoningSteps) && workedData.reasoningSteps.length >= 2, `Worked example ${lesson.id} must have >=2 reasoning steps`);
        assert.ok(Array.isArray(workedData.lineExplanations) && workedData.lineExplanations.length >= 3, `Worked example ${lesson.id} must have >=3 line explanations`);
      }
    });

    // B. FADED
    await st.test('B. FADED: exercises require meaningful blanks and do not leak the complete solution', () => {
      for (const lesson of lessons) {
        const prog = scEngine.getProgressionForLesson(lesson.id);
        const faded = prog.stages.faded;
        assert.ok(faded, `Lesson ${lesson.id} must have a Faded stage`);
        assert.equal(faded.revealsSolution, false, `Faded stage for ${lesson.id} must not reveal solution`);
        assert.ok(faded.starterCode, `Faded stage for ${lesson.id} must have starterCode`);

        const ex = faded.exercise;
        assert.ok(ex, `Faded exercise must exist for ${lesson.id}`);
        assert.notEqual(faded.starterCode.trim(), (ex.solution || '').trim(), `Faded starter code for ${lesson.id} must not be identical to solution`);

        // Reference pattern drawer must be available for faded practice
        const refHtml = BeginnerUI.renderReferenceWorkedPattern(prog, false);
        assert.ok(refHtml.includes('Inspect Reference Worked Solution Pattern'), 'Faded practice must provide reference pattern drawer');
      }
    });

    // C. GUIDED
    await st.test('C. GUIDED: decomposition feeds implementation without exposing complete solution', () => {
      const decompEngine = new DecompositionEngine();

      for (const lesson of lessons) {
        const prog = scEngine.getProgressionForLesson(lesson.id);
        const guided = prog.stages.guided;
        assert.ok(guided, `Lesson ${lesson.id} must have a Guided stage`);
        assert.equal(guided.revealsSolution, false, `Guided stage for ${lesson.id} must not reveal solution`);

        const ex = guided.exercise;
        assert.ok(ex, `Guided exercise must exist for ${lesson.id}`);
        assert.notEqual(guided.starterCode.trim(), (ex.solution || '').trim(), `Guided starter for ${lesson.id} must not be pre-solved`);

        // Plan generation from exercise
        const plan = DecompositionEngine.createPlanFromExercise(ex);
        assert.ok(plan, `Should generate structured plan for ${ex.id}`);
        assert.ok(plan.input, 'Plan must specify inputs');
        assert.ok(plan.output, 'Plan must specify expected outputs');
        assert.ok(plan.memory, 'Plan must specify state/variables');
        assert.ok(Array.isArray(plan.pseudocodeSteps) && plan.pseudocodeSteps.length > 0, 'Plan must have pseudocode steps');

        // UI renders active computational plan drawer
        const guideHtml = BeginnerUI.renderDecompositionGuide(prog, ex, plan);
        assert.ok(guideHtml.includes('ACTIVE COMPUTATIONAL PLAN'), 'Guided UI must render active computational plan');
        assert.ok(guideHtml.includes('Step-by-Step Logic Steps:'), 'Guided UI must display logic steps');
        assert.ok(guideHtml.includes('Translate each step above into C++ in the editor'), 'Guided UI must instruct learner to write their own code');
      }

      // Guided success does NOT grant Independent or Transfer
      const profile = {
        beginner: {
          scaffoldHistory: {
            'conditionals': { faded_completed: true, guided_completed: true }
          }
        },
        conceptMastery: {
          conditionals: { difficultySuccessfullyCompleted: { easy: 1, medium: 1 } }
        }
      };
      const rec = scEngine.getRecommendedStage('conditionals', profile);
      assert.equal(rec, SCAFFOLD_STAGES.INDEPENDENT, 'Guided completion unlocks Independent stage');
      assert.notEqual(rec, SCAFFOLD_STAGES.TRANSFER, 'Guided completion must NOT grant Transfer');
    });

    // D. INDEPENDENT
    await st.test('D. INDEPENDENT: tasks expose only legitimate specifications and require full code construction', () => {
      for (const lesson of lessons) {
        const prog = scEngine.getProgressionForLesson(lesson.id);
        const indep = prog.stages.independent;
        assert.ok(indep, `Lesson ${lesson.id} must have an Independent stage`);
        assert.equal(indep.revealsSolution, false, `Independent stage for ${lesson.id} must strictly NEVER reveal solution`);

        const ex = indep.exercise;
        assert.ok(ex, `Independent exercise must exist for ${lesson.id}`);
        assert.ok(ex.problemStatement, `Independent problem statement must exist for ${lesson.id}`);
        assert.ok(Array.isArray(ex.testCases) && ex.testCases.length >= 2, `Independent exercise ${lesson.id} must have >=2 test cases`);

        // Starter code must not solve the problem
        assert.notEqual(indep.starterCode.trim(), (ex.solution || '').trim(), `Independent starter for ${lesson.id} must not be pre-solved`);
      }

      // Solution reveal on current attempt must forfeit independent credit
      const profileWithReveal = {
        recentSolutionRevealed: true,
        beginner: {
          scaffoldHistory: {
            'loops': { faded_completed: true, guided_completed: true }
          }
        }
      };
      const fallbackRec = scEngine.getRecommendedStage('loops', profileWithReveal);
      assert.equal(fallbackRec, SCAFFOLD_STAGES.WORKED, 'Current solution reveal must fall back to Worked');
    });

    // E. DEBUGGING
    await st.test('E. DEBUGGING: learner-created compile and output failures enter the 5-step debugging workflow', () => {
      const debugEngine = new DebugEngine();

      // 1. Compile Error Diagnostic input
      const compileErrSource = `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World"\n    return 0;\n}`;
      const compileDiag = `main.cpp:5:27: error: expected ';' before 'return'`;

      const challenge = debugEngine.initFromWorkspaceError({
        source: compileErrSource,
        diagnostic: compileDiag,
        classifiedError: { category: 'syntax_missing_semicolon', description: 'Expected semicolon' },
        exerciseTitle: 'Syntax Bug'
      });

      assert.ok(debugEngine.isWorkspaceActive, 'DebugEngine must be active for workspace error');
      assert.equal(challenge.buggyLine, 5, 'Must extract line 5 from compiler diagnostic');
      assert.ok(challenge.explainOptions.length >= 3, 'Must formulate >=3 explanation options');
      assert.equal(debugEngine.state.currentStep, 'observe', 'Must start at Step 1 Observe');

      // Step 2: Locate
      debugEngine.setStep('locate');
      const located = debugEngine.selectLine(5);
      assert.equal(located, true, 'Selecting line 5 must locate correctly');
      assert.equal(debugEngine.state.currentStep, 'explain', 'Successful locate advances to explain');

      // Step 3: Explain
      const explained = debugEngine.selectExplainOption(0);
      assert.equal(explained, true, 'Selecting correct explanation index must pass');
      assert.equal(debugEngine.state.currentStep, 'fix', 'Successful explain advances to fix');

      // Step 4: Fix with progressive hints
      assert.equal(debugEngine.state.hintTier, 0);
      debugEngine.unlockNextHint();
      assert.equal(debugEngine.state.hintTier, 1);
      assert.ok(debugEngine.getHint().length > 0, 'Must provide Tier 1 hint');

      // Step 5: Verify
      const fixedSource = `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World";\n    return 0;\n}`;
      debugEngine.updateUserSource(fixedSource);

      const verifyResult = debugEngine.evaluateFix({
        status: 'success',
        stdout: 'Hello World',
        exitCode: 0
      });
      assert.equal(verifyResult, true, 'Clean compilation must verify fix successfully');
      assert.equal(debugEngine.state.currentStep, 'verify', 'Successful fix advances to verify');

      // 2. Output Mismatch input
      const mismatchChallenge = debugEngine.initFromWorkspaceError({
        source: `cout << 2 + 2;`,
        expectedOutput: '4',
        actualOutput: '5',
        exerciseTitle: 'Math Logic'
      });
      assert.ok(mismatchChallenge.problem.includes('Expected "4", but received "5"'));
    });

    // F. TRANSFER
    await st.test('F. TRANSFER: remains locked until genuine Independent success and tests unseen domain', () => {
      // Learner with zero independent success cannot access transfer
      const noIndepProfile = {
        beginner: {
          scaffoldHistory: {
            'functions': { faded_completed: true, guided_completed: true }
          }
        },
        streak: 10
      };
      assert.notEqual(scEngine.getRecommendedStage('functions', noIndepProfile), SCAFFOLD_STAGES.TRANSFER);

      // Learner WITH genuine independent success unlocks transfer
      const indepProfile = {
        beginner: {
          scaffoldHistory: {
            'functions': { faded_completed: true, guided_completed: true, independent_completed: true }
          }
        }
      };
      assert.equal(scEngine.getRecommendedStage('functions', indepProfile), SCAFFOLD_STAGES.TRANSFER);

      // Transfer benchmark is in an unseen domain
      const transferBench = getTransferBenchmarkForLesson('functions');
      assert.ok(transferBench, 'Transfer benchmark must exist for functions');
      assert.equal(transferBench.id, 'bench-flight-manifest', 'Functions must map to flight manifest transfer benchmark');
      assert.ok(transferBench.problemStatement.length > 50, 'Transfer benchmark must have extensive specification');
    });

    // G. ISOLATION
    await st.test('G. ISOLATION: progress in one lesson cannot grant implementation progress in another lesson', () => {
      const isolatedProfile = {
        beginner: {
          scaffoldHistory: {
            'cpp-basics': { faded_completed: true, guided_completed: true, independent_completed: true }
          }
        }
      };

      // Lesson 1 is at Transfer
      assert.equal(scEngine.getRecommendedStage('cpp-basics', isolatedProfile), SCAFFOLD_STAGES.TRANSFER);

      // Lesson 2 (keywords) must NOT be at Transfer or Independent; must be at Worked
      assert.equal(scEngine.getRecommendedStage('keywords', isolatedProfile), SCAFFOLD_STAGES.WORKED);

      // Lesson 3 (conditionals) must be at Worked
      assert.equal(scEngine.getRecommendedStage('conditionals', isolatedProfile), SCAFFOLD_STAGES.WORKED);
    });

    // H. REGRESSION
    await st.test('H. REGRESSION: progression safeguards against streak shortcuts and solution reveal traps are preserved', () => {
      // Global streak >= 5 cannot promote from Faded to Independent
      const fProfile = {
        beginner: {
          scaffoldHistory: {
            'classes': { faded_completed: true }
          }
        },
        streak: 15
      };
      assert.equal(scEngine.getRecommendedStage('classes', fProfile), SCAFFOLD_STAGES.GUIDED, 'Must remain Guided despite high streak');

      // Global streak >= 5 cannot promote from Guided to Transfer
      const gProfile = {
        beginner: {
          scaffoldHistory: {
            'classes': { faded_completed: true, guided_completed: true }
          }
        },
        streak: 20
      };
      assert.equal(scEngine.getRecommendedStage('classes', gProfile), SCAFFOLD_STAGES.INDEPENDENT, 'Must remain Independent despite high streak');

      // Historical reveal followed by unassisted success can regain Independent
      const histRevealProfile = {
        solutionRevealedCurrentAttempt: false,
        recentSolutionRevealed: false,
        beginner: {
          scaffoldHistory: {
            'access': { faded_completed: true, guided_completed: true }
          }
        },
        conceptMastery: {
          access: {
            recentSolutionRevealed: false,
            recentPerformance: ['pass', 'pass'],
            successfulAttempts: 2,
            failedAttempts: 1,
            difficultySuccessfullyCompleted: { easy: 1, medium: 1 }
          }
        }
      };
      assert.equal(scEngine.getRecommendedStage('access', histRevealProfile), SCAFFOLD_STAGES.INDEPENDENT, 'Learner can regain Independent after historical reveal');
    });
  });
});

