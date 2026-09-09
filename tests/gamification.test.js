/**
 * Automated Test Suite for Gamification, Progression & Achievements (Phase D4A).
 * Verifies XP calculation, multipliers, anti-farming decay, streaks, bug recovery,
 * level progression, deterministic achievements, transaction idempotency, and UI rendering.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GamificationEngine,
  LEVEL_THRESHOLDS,
  BASE_XP_REWARDS,
  REWARD_MODIFIERS
} from '../src/gamification/gamificationEngine.js';

import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES
} from '../src/gamification/achievements.js';

import { GamificationUI } from '../src/gamification/gamificationUI.js';
import { LEARNING_EVENTS } from '../src/eventBus.js';

// Minimal mock event bus for isolated unit testing
class MockEventBus {
  constructor() {
    this.listeners = new Map();
    this.emitted = [];
  }
  on(event, cb) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(cb);
    return () => this.listeners.get(event)?.delete(cb);
  }
  emit(event, data = {}) {
    this.emitted.push({ event, data });
    const set = this.listeners.get(event);
    if (set) {
      for (const cb of set) cb(data);
    }
  }
}

test('1. Default State & Initialization', async (t) => {
  await t.test('initializes clean default state when none is provided', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ eventBus: bus });
    const snapshot = engine.getSnapshot();

    assert.equal(snapshot.xp, 0);
    assert.equal(snapshot.level, 1);
    assert.equal(snapshot.levelName, 'C++ Beginner');
    assert.equal(snapshot.nextLevelXp, 150);
    assert.equal(snapshot.progressPercentage, 0);
    assert.equal(snapshot.unlockedCount, 0);
    assert.equal(snapshot.totalAchievements, 14);
    assert.equal(snapshot.streaks.currentPassStreak, 0);
    assert.equal(snapshot.streaks.currentIndependentStreak, 0);
  });

  await t.test('initializes with existing saved state without resetting progress', () => {
    const bus = new MockEventBus();
    const existing = {
      xp: 450,
      level: 3,
      streaks: { currentPassStreak: 4, bestPassStreak: 4, currentIndependentStreak: 2, bestIndependentStreak: 2 },
      unlockedAchievements: { FIRST_COMPILE: { id: 'FIRST_COMPILE', unlockedAt: 1000 } },
      exerciseHistory: { 'ex-1': { count: 1 } },
      stats: { exercisesCompleted: 3 }
    };
    const engine = new GamificationEngine({ state: existing, eventBus: bus });
    const snapshot = engine.getSnapshot();

    assert.equal(snapshot.xp, 450);
    assert.equal(snapshot.level, 3);
    assert.equal(snapshot.levelName, 'Logic Builder');
    assert.equal(snapshot.unlockedCount, 1);
    assert.equal(snapshot.streaks.currentPassStreak, 4);
  });
});

const preUnlockedState = {
  unlockedAchievements: {
    FIRST_COMPILE: { id: 'FIRST_COMPILE', unlockedAt: 1 },
    FIRST_SUCCESS: { id: 'FIRST_SUCCESS', unlockedAt: 1 },
    NO_HELP_NEEDED: { id: 'NO_HELP_NEEDED', unlockedAt: 1 },
    INDEPENDENT_STREAK_3: { id: 'INDEPENDENT_STREAK_3', unlockedAt: 1 },
    INDEPENDENT_STREAK_5: { id: 'INDEPENDENT_STREAK_5', unlockedAt: 1 },
    BUG_HUNTER: { id: 'BUG_HUNTER', unlockedAt: 1 }
  }
};

test('2. Base XP Awards & Difficulties', async (t) => {
  await t.test('awards correct base XP for each difficulty with 1 hint (no bonuses)', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ state: preUnlockedState, eventBus: bus });

    // Easy: base 50. With 1 hint: multiplier = 0.85 -> round(50 * 0.85) = 43 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'test-easy',
      difficulty: 'easy',
      hintsUsed: 1,
      solutionRevealed: false
    });
    assert.equal(engine.state.xp, 43);

    // Medium: base 100. With 1 hint: round(100 * 0.85) = 85 XP -> 43 + 85 = 128 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'test-medium',
      difficulty: 'medium',
      hintsUsed: 1,
      solutionRevealed: false
    });
    assert.equal(engine.state.xp, 128);

    // Hard: base 180. With 1 hint: round(180 * 0.85) = 153 XP -> 128 + 153 = 281 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'test-hard',
      difficulty: 'hard',
      hintsUsed: 1,
      solutionRevealed: false
    });
    assert.equal(engine.state.xp, 281);

    // Mastery: base 300. No hints allowed in mastery: 300 * 1.5 (independent) = 450 XP -> 281 + 450 = 731 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'test-mastery',
      difficulty: 'mastery',
      hintsUsed: 0,
      solutionRevealed: false
    });
    assert.equal(engine.state.xp, 731);
  });
});

test('3. Reward Modifiers & Penalties', async (t) => {
  await t.test('awards +50% bonus for independent solve (no hints, no solution)', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ state: preUnlockedState, eventBus: bus });

    // Easy (50) * (1.0 + 0.5) = 75 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'indep-1',
      difficulty: 'easy',
      hintsUsed: 0,
      solutionRevealed: false
    });
    assert.equal(engine.state.xp, 75);
    assert.equal(engine.state.stats.independentSolves, 1);
  });

  await t.test('awards +25% bonus for multi-concept exercise', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ state: preUnlockedState, eventBus: bus });

    // Medium (100) with 1 hint (0.85) + multi-concept (0.25) = round(100 * 1.10) = 110 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'multi-1',
      difficulty: 'medium',
      concepts: ['classes', 'pointers'],
      hintsUsed: 1,
      solutionRevealed: false
    });
    const xpEvent = bus.emitted.find(e => e.event === LEARNING_EVENTS.XP_EARNED && e.data.exerciseId === 'multi-1');
    assert.equal(xpEvent?.data?.amount, 110);
    assert.equal(engine.state.stats.multiConceptProblemsSolved, 1);
  });

  await t.test('stacks independent (+50%) and multi-concept (+25%) bonuses', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ state: preUnlockedState, eventBus: bus });

    // Hard (180) * (1.0 + 0.5 + 0.25) = round(180 * 1.75) = 315 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'stacked-1',
      difficulty: 'hard',
      concepts: ['inheritance', 'polymorphism'],
      hintsUsed: 0,
      solutionRevealed: false
    });
    const xpEvent = bus.emitted.find(e => e.event === LEARNING_EVENTS.XP_EARNED && e.data.exerciseId === 'stacked-1');
    assert.equal(xpEvent?.data?.amount, 315);
  });

  await t.test('hint penalty linearly scales and is clamped to minimum 30%', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ state: preUnlockedState, eventBus: bus });

    // Easy (50) with 5 hints: 1.0 - 5 * 0.15 = 0.25, clamped to 0.30 -> round(50 * 0.3) = 15 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'hints-many',
      difficulty: 'easy',
      hintsUsed: 5,
      solutionRevealed: false
    });
    assert.equal(engine.state.xp, 15);
  });

  await t.test('solution revealed gives 0 XP attempt reward and resets independent streak', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ state: preUnlockedState, eventBus: bus });

    // First do an independent solve to establish streak = 1
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'indep-pre',
      difficulty: 'easy',
      hintsUsed: 0,
      solutionRevealed: false
    });
    assert.equal(engine.state.streaks.currentIndependentStreak, 1);
    const xpBefore = engine.state.xp;

    // Now reveal solution
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'sol-revealed',
      difficulty: 'hard',
      hintsUsed: 2,
      solutionRevealed: true
    });

    assert.equal(engine.state.xp, xpBefore); // No new XP
    assert.equal(engine.state.streaks.currentIndependentStreak, 0); // Streak broken
    assert.equal(engine.state.exerciseHistory['sol-revealed'].count, 1); // Solved count logged
  });
});

test('4. Anti-Farming Factor & Repeat Decay', async (t) => {
  await t.test('scales XP: 100% on 1st solve, 40% on 2nd solve, 0% on 3rd+ solve', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ state: preUnlockedState, eventBus: bus });

    // 1st solve: Medium independent: round(100 * 1.5) = 150 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'farm-target',
      difficulty: 'medium',
      hintsUsed: 0,
      solutionRevealed: false,
      timestamp: 100
    });
    assert.equal(engine.state.xp, 150);

    // 2nd solve: 40% of 150 = round(150 * 0.4) = 60 XP -> Total = 210 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'farm-target',
      difficulty: 'medium',
      hintsUsed: 0,
      solutionRevealed: false,
      timestamp: 200
    });
    assert.equal(engine.state.xp, 210);

    // 3rd solve: 0% of 150 = 0 XP -> Total = 210 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'farm-target',
      difficulty: 'medium',
      hintsUsed: 0,
      solutionRevealed: false,
      timestamp: 300
    });
    assert.equal(engine.state.xp, 210);

    // 4th solve: 0% -> Total remains 210 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'farm-target',
      difficulty: 'medium',
      hintsUsed: 0,
      solutionRevealed: false,
      timestamp: 400
    });
    assert.equal(engine.state.xp, 210);
    assert.equal(engine.state.exerciseHistory['farm-target'].count, 4);
  });
});

test('5. Bug Recovery Bonus (+35 XP)', async (t) => {
  await t.test('awards +35 XP when recovering from recent failure on the same exercise', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ state: preUnlockedState, eventBus: bus });

    // Learner fails compilation
    bus.emit(LEARNING_EVENTS.COMPILE_FAILED, { exerciseId: 'buggy-ex' });
    assert.ok(engine.state.recentFailure);
    assert.equal(engine.state.recentFailure.exerciseId, 'buggy-ex');

    // Learner fixes it and solves with 1 hint: base 50 * 0.85 = 43 XP + 35 Bug Recovery = 78 XP
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'buggy-ex',
      difficulty: 'easy',
      hintsUsed: 1,
      solutionRevealed: false
    });

    assert.equal(engine.state.xp, 78);
    assert.equal(engine.state.stats.bugsFixed, 1);
    assert.equal(engine.state.recentFailure, null);
  });

  await t.test('does not award bug recovery bonus if solution was revealed', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ state: preUnlockedState, eventBus: bus });

    bus.emit(LEARNING_EVENTS.TEST_FAILED, { exerciseId: 'give-up-ex' });
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'give-up-ex',
      difficulty: 'easy',
      hintsUsed: 3,
      solutionRevealed: true
    });

    assert.equal(engine.state.xp, 0);
    assert.equal(engine.state.recentFailure, null);
  });
});

test('6. Streaks Management', async (t) => {
  await t.test('tracks current and best pass streaks and resets on failure', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, { exerciseId: 's1', hintsUsed: 1, timestamp: 1 });
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, { exerciseId: 's2', hintsUsed: 1, timestamp: 2 });
    assert.equal(engine.state.streaks.currentPassStreak, 2);
    assert.equal(engine.state.streaks.bestPassStreak, 2);

    // Failure resets pass streak
    bus.emit(LEARNING_EVENTS.RUNTIME_FAILED, { exerciseId: 's3' });
    assert.equal(engine.state.streaks.currentPassStreak, 0);
    assert.equal(engine.state.streaks.bestPassStreak, 2); // best is preserved
  });

  await t.test('tracks independent streak and emits INDEPENDENT_SUCCESS', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, { exerciseId: 'ind1', hintsUsed: 0, solutionRevealed: false, timestamp: 1 });
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, { exerciseId: 'ind2', hintsUsed: 0, solutionRevealed: false, timestamp: 2 });

    assert.equal(engine.state.streaks.currentIndependentStreak, 2);
    assert.equal(engine.state.streaks.bestIndependentStreak, 2);

    const indEvents = bus.emitted.filter(e => e.event === LEARNING_EVENTS.INDEPENDENT_SUCCESS);
    assert.equal(indEvents.length, 2);
    assert.equal(indEvents[1].data.streak, 2);

    // Using a hint resets independent streak
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, { exerciseId: 'ind3', hintsUsed: 1, solutionRevealed: false, timestamp: 3 });
    assert.equal(engine.state.streaks.currentIndependentStreak, 0);
    assert.equal(engine.state.streaks.bestIndependentStreak, 2);
  });
});

test('7. Level Progression & Thresholds', async (t) => {
  await t.test('calculates correct level and name from XP thresholds', () => {
    assert.equal(GamificationEngine.calculateLevel(0).level, 1);
    assert.equal(GamificationEngine.calculateLevel(149).level, 1);
    assert.equal(GamificationEngine.calculateLevel(150).level, 2);
    assert.equal(GamificationEngine.calculateLevel(399).level, 2);
    assert.equal(GamificationEngine.calculateLevel(400).level, 3);
    assert.equal(GamificationEngine.calculateLevel(800).level, 4);
    assert.equal(GamificationEngine.calculateLevel(1400).level, 5);
    assert.equal(GamificationEngine.calculateLevel(2200).level, 6);
    assert.equal(GamificationEngine.calculateLevel(3200).level, 7);
    assert.equal(GamificationEngine.calculateLevel(4500).level, 8);
    assert.equal(GamificationEngine.calculateLevel(6000).level, 9);
    assert.equal(GamificationEngine.calculateLevel(8000).level, 10);
    assert.equal(GamificationEngine.calculateLevel(12000).level, 10);
    assert.equal(GamificationEngine.calculateLevel(8000).name, 'C++ Master');
  });

  await t.test('emits LEVEL_UP event when XP passes threshold', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ eventBus: bus });

    // Solve mastery problem: 300 * 1.5 = 450 XP -> jumps from Level 1 directly to Level 3!
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'mastery-leap',
      difficulty: 'mastery',
      hintsUsed: 0,
      solutionRevealed: false
    });

    const levelUps = bus.emitted.filter(e => e.event === LEARNING_EVENTS.LEVEL_UP);
    assert.equal(levelUps.length, 1);
    assert.equal(levelUps[0].data.level, 3);
    assert.equal(levelUps[0].data.previousLevel, 1);
  });
});

test('8. Deterministic Achievements Evaluation & Catalog', async (t) => {
  await t.test('all 14 achievements are defined with deterministic checks and positive rewards', () => {
    assert.equal(Object.keys(ACHIEVEMENTS).length, 14);
    for (const [id, ach] of Object.entries(ACHIEVEMENTS)) {
      assert.equal(ach.id, id);
      assert.ok(ach.title && ach.title.length > 0);
      assert.ok(ach.description && ach.description.length > 0);
      assert.ok(ach.xpReward > 0);
      assert.equal(typeof ach.check, 'function');
    }
  });

  await t.test('unlocks FIRST_COMPILE upon valid build', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.COMPILE_SUCCESS, { exerciseId: 'first-compile' });
    assert.ok(engine.state.unlockedAchievements.FIRST_COMPILE);
  });

  await t.test('unlocks INDEPENDENT_STREAK_3 and INDEPENDENT_STREAK_5', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ eventBus: bus });

    for (let i = 1; i <= 5; i++) {
      bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
        exerciseId: `indep-streak-${i}`,
        difficulty: 'easy',
        hintsUsed: 0,
        solutionRevealed: false,
        timestamp: i * 10
      });
    }

    assert.ok(engine.state.unlockedAchievements.INDEPENDENT_STREAK_3);
    assert.ok(engine.state.unlockedAchievements.INDEPENDENT_STREAK_5);
  });

  await t.test('unlocks concept mastery achievements: FUNCTION_BUILDER, MEMORY_EXPLORER, etc.', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'func-ex',
      difficulty: 'easy',
      concepts: ['functions'],
      hintsUsed: 1,
      solutionRevealed: false
    });
    assert.ok(engine.state.unlockedAchievements.FUNCTION_BUILDER);

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'mem-ex',
      difficulty: 'easy',
      concepts: ['pointers'],
      hintsUsed: 1,
      solutionRevealed: false
    });
    assert.ok(engine.state.unlockedAchievements.MEMORY_EXPLORER);

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'oop-ex',
      difficulty: 'easy',
      concepts: ['classes'],
      hintsUsed: 1,
      solutionRevealed: false
    });
    assert.ok(engine.state.unlockedAchievements.OBJECT_BUILDER);

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'ctor-ex',
      difficulty: 'easy',
      concepts: ['constructors'],
      hintsUsed: 1,
      solutionRevealed: false
    });
    assert.ok(engine.state.unlockedAchievements.CONSTRUCTOR_CRAFT);

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'poly-ex',
      difficulty: 'easy',
      concepts: ['polymorphism', 'virtual'],
      hintsUsed: 1,
      solutionRevealed: false
    });
    assert.ok(engine.state.unlockedAchievements.POLYMORPHISM_PRACTITIONER);
    assert.ok(engine.state.unlockedAchievements.MULTI_CONCEPT_SOLVER);
  });

  await t.test('achievements are idempotent and never double-award XP', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.COMPILE_SUCCESS, { exerciseId: 'c1' });
    const xpAfterFirst = engine.state.xp;
    assert.ok(engine.state.unlockedAchievements.FIRST_COMPILE);

    // Trigger again
    bus.emit(LEARNING_EVENTS.COMPILE_SUCCESS, { exerciseId: 'c2' });
    assert.equal(engine.state.xp, xpAfterFirst); // No duplicate XP awarded
  });
});

test('9. Transaction Deduplication & Idempotency', async (t) => {
  await t.test('ignores duplicate events with identical transactionId', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ eventBus: bus });

    const payload = {
      transactionId: 'unique-tx-123',
      exerciseId: 'test-dup',
      difficulty: 'easy',
      hintsUsed: 0,
      solutionRevealed: false
    };

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, payload);
    const xp1 = engine.state.xp;

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, payload);
    const xp2 = engine.state.xp;

    assert.equal(xp1, xp2);
    assert.equal(engine.state.stats.exercisesCompleted, 1);
  });
});

test('10. Curriculum Completion & Companion Ultimate Mastery Event', async (t) => {
  await t.test('emits CURRICULUM_COMPLETED when 20 lessons completed and 1 mastery passed', () => {
    const bus = new MockEventBus();
    const engine = new GamificationEngine({ eventBus: bus });

    const completedLessons = Array.from({ length: 20 }, (_, i) => `lesson-${i + 1}`);

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'mastery-capstone',
      difficulty: 'mastery',
      hintsUsed: 0,
      solutionRevealed: false,
      completedLessons,
      totalLessonsCompleted: 20
    });

    const currEvents = bus.emitted.filter(e => e.event === LEARNING_EVENTS.CURRICULUM_COMPLETED);
    assert.equal(currEvents.length, 1);
    assert.ok(engine.state.unlockedAchievements.CURRICULUM_COMPLETE);
  });
});

test('11. UI Rendering & Accessibility', async (t) => {
  await t.test('renderHeaderPill produces accessible HTML with level, XP and streak tag', () => {
    const snapshot = {
      level: 4,
      levelName: 'C++ Function Craftsman',
      xp: 950,
      nextLevelXp: 1400,
      progressPercentage: 25,
      streaks: { currentIndependentStreak: 3 }
    };

    const html = GamificationUI.renderHeaderPill(snapshot);
    assert.ok(html.includes('LVL 4'));
    assert.ok(html.includes('C++ Function Craftsman'));
    assert.ok(html.includes('950 XP'));
    assert.ok(html.includes('🔥 3'));
    assert.ok(html.includes('data-action="open-achievements"'));
  });

  await t.test('renderHeaderPill gracefully handles empty snapshot', () => {
    const html = GamificationUI.renderHeaderPill(null);
    assert.equal(html, '');
  });
});

test('12. Architectural Compliance & Sound Verification', async (t) => {
  await t.test('verifies zero audio API or audio files referenced in gamification modules', () => {
    // Phase D4A STRICT rule: absolutely no sound
    const audioKeywords = ['AudioContext', 'webkitAudioContext', 'HTMLAudioElement', 'play()', '.mp3', '.wav', '.ogg', 'synth'];
    const gamificationEngineStr = GamificationEngine.toString();
    const gamificationUIStr = GamificationUI.toString();

    for (const kw of audioKeywords) {
      assert.ok(
        !gamificationEngineStr.includes(kw),
        `GamificationEngine must not contain audio keyword: ${kw}`
      );
      assert.ok(
        !gamificationUIStr.includes(kw),
        `GamificationUI must not contain audio keyword: ${kw}`
      );
    }
  });
});
