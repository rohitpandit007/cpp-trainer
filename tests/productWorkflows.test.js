import test from 'node:test';
import assert from 'node:assert/strict';
import { exerciseCatalog, getExerciseById } from '../src/exerciseData.js';
import { lessons } from '../src/courseData.js';
import { LearningEventBus, LEARNING_EVENTS } from '../src/eventBus.js';
import { GamificationEngine, BASE_XP_REWARDS, REWARD_MODIFIERS } from '../src/gamification/gamificationEngine.js';
import { CompanionController } from '../src/companion/companionController.js';
import { COMPANION_STATES } from '../src/companion/companionState.js';
import { createDefaultProfile } from '../src/masteryEngine.js';
import { updateLearnerProfile } from '../src/learningEngine.js';
import { analyzeCppSource, CONCEPT_FAMILIES } from '../src/visualization/conceptAnalyzer.js';
import { TimelineModel } from '../src/visualization/timelineModel.js';

test('Subphase F8: Core Learner Workflows Verification', async (t) => {

  await t.test('Workflow 1: Beginner First Steps (Lesson 1 load, submit, test pass, level up)', () => {
    const bus = new LearningEventBus();
    const ge = new GamificationEngine({ eventBus: bus });
    const companion = new CompanionController({ eventBus: bus });
    let profile = createDefaultProfile();

    // 1. User selects Lesson 1
    const lesson1 = lessons[0];
    assert.equal(lesson1.id, 'cpp-basics');
    const exercise = getExerciseById('cpp-basics-mini');
    assert.ok(exercise, 'Lesson 1 exercise must exist');

    // 2. User solves and passes
    const initialXP = ge.state.xp;

    profile = updateLearnerProfile(profile, lesson1.id, true, {
      exercise,
      hintsUsedCount: 0,
      solutionRevealed: false,
      isIndependent: false
    });

    bus.emit(LEARNING_EVENTS.COMPILE_SUCCESS, { exerciseId: exercise.id });
    bus.emit(LEARNING_EVENTS.TEST_PASSED, { exerciseId: exercise.id });
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: exercise.id,
      exercise,
      difficulty: 'easy',
      hintsUsed: 0,
      solutionRevealed: false,
      mode: 'course'
    });

    assert.ok(ge.state.xp > initialXP, 'XP should increase after first completion');
    assert.ok(profile.completed.includes(lesson1.id), 'Lesson 1 should be marked completed in profile');
    assert.ok(
      [COMPANION_STATES.TEST_PASSED, COMPANION_STATES.MASTERY, COMPANION_STATES.CELEBRATION].includes(companion.currentState),
      `Companion should react with positive state (got ${companion.currentState})`
    );
  });

  await t.test('Workflow 2: Hint Penalty vs Independent Solve (+50% bonus)', () => {
    // Attempt A: with 2 hints
    const busA = new LearningEventBus();
    const geA = new GamificationEngine({ eventBus: busA });
    busA.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'cpp-basics-medium',
      difficulty: 'medium',
      hintsUsed: 2,
      solutionRevealed: false
    });
    const xpWithHints = geA.state.xp;

    // Attempt B: 0 hints, completely independent
    const busB = new LearningEventBus();
    const geB = new GamificationEngine({ eventBus: busB });
    busB.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'cpp-basics-medium',
      difficulty: 'medium',
      hintsUsed: 0,
      solutionRevealed: false
    });
    const xpIndependent = geB.state.xp;

    // Independent solve must exceed solve with 2 hints
    assert.ok(
      xpIndependent > xpWithHints,
      `Independent XP (${xpIndependent}) must exceed XP with 2 hints (${xpWithHints})`
    );
  });

  await t.test('Workflow 3: Bug Recovery Celebration (+35 XP bonus)', () => {
    const bus = new LearningEventBus();
    const ge = new GamificationEngine({ eventBus: bus });
    const companion = new CompanionController({ eventBus: bus });

    const exerciseId = 'cpp-basics-hard';

    // 1. Learner encounters compilation error
    bus.emit(LEARNING_EVENTS.COMPILE_FAILED, { exerciseId });
    assert.equal(companion.currentState, COMPANION_STATES.COMPILE_ERROR);
    assert.ok(ge.state.recentFailure, 'Failure must be recorded for bug recovery window');

    // 2. Learner fixes the bug and passes without solution reveal
    const xpBeforeFix = ge.state.xp;
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId,
      difficulty: 'hard',
      hintsUsed: 0,
      solutionRevealed: false
    });

    const xpEarned = ge.state.xp - xpBeforeFix;
    const expectedBase = Math.round(BASE_XP_REWARDS.HARD * (1.0 + REWARD_MODIFIERS.INDEPENDENT_BONUS));

    assert.ok(xpEarned >= expectedBase + REWARD_MODIFIERS.BUG_HUNTER_BONUS, 'Earned XP must include bug hunter bonus');
    assert.equal(ge.state.stats.bugsFixed, 1, 'Stats must track 1 bug fixed');
  });

  await t.test('Workflow 4: Conceptual Timeline Exploration (Pointers / Memory)', () => {
    const pointerCode = `
      #include <iostream>
      using namespace std;
      int main() {
          int x = 10;
          int* p = &x;
          *p = 25;
          cout << "x is " << x << endl;
          return 0;
      }
    `;

    const analysis = analyzeCppSource(pointerCode);
    assert.ok(analysis.supported, 'Pointer code must be recognized');
    assert.ok(analysis.detectedConcepts.includes(CONCEPT_FAMILIES.POINTERS));

    const timeline = TimelineModel.generateTimeline(analysis);
    assert.ok(timeline.steps.length >= 3, 'Pointers timeline must have at least 3 simulation steps');

    // Step 1: Declaration of x
    const step1 = timeline.steps[0];
    assert.ok(step1.memoryState.variables.length > 0);

    // Step 2: Pointer binding
    const step2 = timeline.steps[1];
    assert.ok(step2.memoryState.variables.length > 0);
    assert.ok(step2.memoryState.relationships.length > 0);
    assert.equal(step2.memoryState.relationships[0].to, 'x');

    // Step 3: Dereference mutation
    const step3 = timeline.steps[2];
    assert.ok(step3.explanation.includes('mutates') || step3.explanation.includes('x') || step3.explanation.includes('25'));
  });

  await t.test('Workflow 5: Mastery Capstone Completion (Level 5 independent solve)', () => {
    const bus = new LearningEventBus();
    const ge = new GamificationEngine({ eventBus: bus });
    const companion = new CompanionController({ eventBus: bus });
    let profile = createDefaultProfile();

    const rawCapstone = exerciseCatalog['capstone-library-lending'];
    assert.ok(rawCapstone, 'Capstone exercise must exist');
    const capstoneEx = {
      ...rawCapstone,
      concepts: rawCapstone.concepts || rawCapstone.prerequisiteConcepts || ['classes']
    };

    profile = updateLearnerProfile(profile, 'lesson-13-classes', true, {
      exercise: capstoneEx,
      hintsUsedCount: 0,
      solutionRevealed: false,
      isIndependent: true
    });

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: capstoneEx.id,
      exercise: capstoneEx,
      difficulty: 'MASTERY',
      mode: 'mastery',
      hintsUsed: 0,
      solutionRevealed: false
    });

    assert.ok(ge.state.stats.masteryTestsPassed >= 1, 'Mastery tests count must increment');
    assert.ok(ge.state.streaks.currentIndependentStreak >= 1, 'Independent streak must increment');
    assert.ok(profile.conceptMastery['classes']?.successfulAttempts >= 1, 'Concept successful attempt must be recorded');
    assert.ok(profile.conceptMastery['classes']?.independentSuccesses >= 1, 'Independent success must be recorded on concept');
  });
});
