/**
 * Gamification & Progression Engine for CodeBloom C++ Trainer (Phase D4A).
 * Responsible for event-driven XP calculation, anti-farming enforcement,
 * deterministic level calculation, achievement evaluation, streak tracking,
 * and profile persistence.
 *
 * CRITICAL RULE: Phase C mastery remains the SINGLE SOURCE OF TRUTH for
 * concept mastery and competency. This engine consumes Phase C evaluations.
 */

import { eventBus as defaultEventBus, LEARNING_EVENTS } from '../eventBus.js';
import { ACHIEVEMENTS } from './achievements.js';

export const LEVEL_THRESHOLDS = [
  { level: 1, name: 'C++ Beginner', minXp: 0 },
  { level: 2, name: 'Syntax Explorer', minXp: 150 },
  { level: 3, name: 'Logic Builder', minXp: 400 },
  { level: 4, name: 'Function Apprentice', minXp: 800 },
  { level: 5, name: 'Memory Explorer', minXp: 1400 },
  { level: 6, name: 'Object Builder', minXp: 2200 },
  { level: 7, name: 'Inheritance Apprentice', minXp: 3200 },
  { level: 8, name: 'Polymorphism Practitioner', minXp: 4500 },
  { level: 9, name: 'C++ Problem Solver', minXp: 6000 },
  { level: 10, name: 'C++ Master', minXp: 8000 }
];

export const BASE_XP_REWARDS = {
  EASY: 50,
  MEDIUM: 100,
  HARD: 180,
  MASTERY: 300
};

export const REWARD_MODIFIERS = {
  INDEPENDENT_BONUS: 0.50,       // +50% for 0 hints & no solution reveal
  MULTI_CONCEPT_BONUS: 0.25,     // +25% for combining multiple concepts
  BUG_HUNTER_BONUS: 35,          // Flat bonus for fixing an active bug
  CONCEPT_MASTERED_BONUS: 250,   // Bonus when Phase C reaches Level 6 Mastered
  REPEAT_COMPLETION_2ND: 0.40,   // 40% XP on second solve of same exercise
  REPEAT_COMPLETION_3RD_PLUS: 0  // 0% XP on 3rd+ solve (strict anti-farming)
};

/**
 * Creates an empty, initialized Gamification profile partition.
 */
export function createDefaultGamificationState() {
  return {
    xp: 0,
    level: 1,
    levelName: LEVEL_THRESHOLDS[0].name,
    unlockedAchievements: {},
    streaks: {
      currentIndependentStreak: 0,
      bestIndependentStreak: 0,
      currentPassStreak: 0,
      bestPassStreak: 0
    },
    stats: {
      exercisesCompleted: 0,
      independentSolves: 0,
      bugsFixed: 0,
      conceptsMastered: 0,
      hardProblemsSolved: 0,
      multiConceptProblemsSolved: 0,
      masteryTestsPassed: 0
    },
    exerciseHistory: {},
    recentFailure: null,
    processedTransactions: [],
    version: 1
  };
}

export class GamificationEngine {
  /**
   * @param {Object} [options]
   * @param {Object} [options.state] Initial gamification state (or extracts from profile)
   * @param {import('../eventBus.js').LearningEventBus} [options.eventBus]
   * @param {Function} [options.onSave] Callback invoked when state mutates
   */
  constructor(options = {}) {
    this.eventBus = options.eventBus || defaultEventBus;
    this.onSave = options.onSave || null;
    this.state = options.state ? { ...options.state } : createDefaultGamificationState();

    // Ensure all required fields exist defensively
    this.ensureStateIntegrity();

    this.subscribers = new Set();
    this.unsubscribes = [];

    if (this.eventBus) {
      this.bindEvents();
    }
  }

  ensureStateIntegrity() {
    const d = createDefaultGamificationState();
    this.state.xp = Number.isFinite(this.state.xp) ? this.state.xp : 0;
    this.state.level = this.state.level || 1;
    this.state.levelName = this.state.levelName || LEVEL_THRESHOLDS[0].name;
    this.state.unlockedAchievements = this.state.unlockedAchievements || {};
    this.state.streaks = { ...d.streaks, ...(this.state.streaks || {}) };
    this.state.stats = { ...d.stats, ...(this.state.stats || {}) };
    this.state.exerciseHistory = this.state.exerciseHistory || {};
    this.state.processedTransactions = Array.isArray(this.state.processedTransactions)
      ? this.state.processedTransactions
      : [];
    this.state.version = 1;

    // Recalculate level to maintain exact consistency with XP
    const lvlInfo = this.calculateLevel(this.state.xp);
    this.state.level = lvlInfo.level;
    this.state.levelName = lvlInfo.name;
  }

  /**
   * Calculates level metadata for a given XP amount.
   * @param {number} xp
   * @returns {Object} { level, name, minXp, nextLevelXp, progressPercentage }
   */
  static calculateLevel(xp = 0) {
    let current = LEVEL_THRESHOLDS[0];
    let next = LEVEL_THRESHOLDS[1];

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (xp >= LEVEL_THRESHOLDS[i].minXp) {
        current = LEVEL_THRESHOLDS[i];
        next = LEVEL_THRESHOLDS[i + 1] || null;
      } else {
        break;
      }
    }

    let progressPercentage = 100;
    if (next) {
      const range = next.minXp - current.minXp;
      const progress = xp - current.minXp;
      progressPercentage = Math.min(100, Math.max(0, Math.floor((progress / range) * 100)));
    }

    return {
      level: current.level,
      name: current.name,
      minXp: current.minXp,
      nextLevelXp: next ? next.minXp : current.minXp,
      progressPercentage
    };
  }

  calculateLevel(xp = 0) {
    return GamificationEngine.calculateLevel(xp);
  }

  /**
   * Binds to LearningEventBus to consume canonical learner activity.
   */
  bindEvents() {
    this.unbindEvents();

    this.unsubscribes.push(
      this.eventBus.on(LEARNING_EVENTS.EXERCISE_COMPLETED, (data) => this.handleExerciseCompleted(data)),
      this.eventBus.on(LEARNING_EVENTS.COMPILE_SUCCESS, (data) => this.handleCompileSuccess(data)),
      this.eventBus.on(LEARNING_EVENTS.COMPILE_FAILED, (data) => this.handleFailure(data, 'compile')),
      this.eventBus.on(LEARNING_EVENTS.RUNTIME_FAILED, (data) => this.handleFailure(data, 'runtime')),
      this.eventBus.on(LEARNING_EVENTS.TEST_FAILED, (data) => this.handleFailure(data, 'test')),
      this.eventBus.on(LEARNING_EVENTS.CONCEPT_MASTERED, (data) => this.handleConceptMastered(data))
    );
  }

  unbindEvents() {
    for (const unbind of this.unsubscribes) {
      if (typeof unbind === 'function') unbind();
    }
    this.unsubscribes = [];
  }

  // -------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------

  handleCompileSuccess(data) {
    this.evaluateAchievements({
      firstCompileSuccess: true,
      stats: this.state.stats,
      streaks: this.state.streaks
    });
    this.persist();
  }

  handleFailure(data, type) {
    const exerciseId = data?.exerciseId;
    if (exerciseId) {
      this.state.recentFailure = {
        exerciseId,
        type,
        timestamp: Date.now()
      };
    }
    // Failure breaks the current pass streak
    this.state.streaks.currentPassStreak = 0;
    this.notifySubscribers();
    this.persist();
  }

  handleConceptMastered(data) {
    const conceptId = data?.conceptId;
    if (!conceptId) return;

    const txId = `concept_mastered:${conceptId}`;
    if (this.isTransactionProcessed(txId)) return;

    this.state.stats.conceptsMastered += 1;
    this.awardXP({
      amount: REWARD_MODIFIERS.CONCEPT_MASTERED_BONUS,
      reason: `Concept Mastered: ${conceptId}`,
      transactionId: txId
    });

    this.evaluateAchievements({
      completedConcept: conceptId,
      conceptMastery: data.conceptMastery || {}
    });

    this.persist();
  }

  /**
   * Canonical handler for exercise completions.
   * Deterministic, idempotent reward calculation.
   */
  handleExerciseCompleted(data) {
    if (!data || typeof data !== 'object') return;
    // Benchmark mode is strictly isolated from normal curriculum XP and streaks
    if (data.isBenchmark || data.mode === 'benchmark') return;

    const exerciseId = data.exerciseId || 'general';
    const txId = data.transactionId || `solve:${exerciseId}:${data.timestamp || Date.now()}`;

    // Prevent duplicate event double-processing
    if (this.isTransactionProcessed(txId)) return;
    this.markTransactionProcessed(txId);

    const hintsUsed = Number(data.hintsUsed) || 0;
    const solutionRevealed = Boolean(data.solutionRevealed);
    const difficulty = (data.difficulty || data.exercise?.difficulty || 'easy').toUpperCase();
    const isIndependent = (hintsUsed === 0 && !solutionRevealed);
    const concepts = data.concepts || data.exercise?.concepts || [];
    const isMultiConcept = concepts.length >= 2;
    const isMastery = data.mode === 'mastery' || difficulty === 'MASTERY' || data.exercise?.level === 5;

    // 1. Determine Base XP
    let baseXP = BASE_XP_REWARDS[difficulty] || BASE_XP_REWARDS.EASY;
    if (isMastery) baseXP = BASE_XP_REWARDS.MASTERY;

    // 2. Multipliers & Bonuses
    let multiplier = 1.0;

    // Hint decay
    if (hintsUsed > 0) {
      multiplier = Math.max(0.3, 1.0 - hintsUsed * 0.15);
    }

    // Solution reveal nullifies attempt reward
    if (solutionRevealed) {
      multiplier = 0.0;
    }

    // Independent solve bonus (+50%)
    let bonusMultiplier = 0.0;
    if (isIndependent && !solutionRevealed) {
      bonusMultiplier += REWARD_MODIFIERS.INDEPENDENT_BONUS;
    }

    // Multi-concept bonus (+25%)
    if (isMultiConcept && !solutionRevealed) {
      bonusMultiplier += REWARD_MODIFIERS.MULTI_CONCEPT_BONUS;
    }

    // 3. Anti-Farming Factor
    const priorSolves = this.state.exerciseHistory[exerciseId]?.count || 0;
    let antiFarmingFactor = 1.0;
    if (priorSolves === 1) {
      antiFarmingFactor = REWARD_MODIFIERS.REPEAT_COMPLETION_2ND; // 40% on 2nd solve
    } else if (priorSolves >= 2) {
      antiFarmingFactor = REWARD_MODIFIERS.REPEAT_COMPLETION_3RD_PLUS; // 0% on 3rd+ solve
    }

    let calculatedXP = Math.round(baseXP * (multiplier + bonusMultiplier) * antiFarmingFactor);

    // 4. Bug Recovery Bonus (+35 XP)
    let bugRecovered = false;
    if (
      !solutionRevealed &&
      this.state.recentFailure &&
      this.state.recentFailure.exerciseId === exerciseId &&
      Date.now() - this.state.recentFailure.timestamp < 1000 * 60 * 30
    ) {
      bugRecovered = true;
      this.state.stats.bugsFixed += 1;
      this.state.recentFailure = null;
      calculatedXP += REWARD_MODIFIERS.BUG_HUNTER_BONUS;
    } else if (solutionRevealed && this.state.recentFailure?.exerciseId === exerciseId) {
      this.state.recentFailure = null;
    }

    // Update History Record
    this.state.exerciseHistory[exerciseId] = {
      count: priorSolves + 1,
      firstSolvedAt: this.state.exerciseHistory[exerciseId]?.firstSolvedAt || Date.now(),
      lastSolvedAt: Date.now()
    };

    // Update Stats
    this.state.stats.exercisesCompleted += 1;
    if (isIndependent) this.state.stats.independentSolves += 1;
    if (difficulty === 'HARD') this.state.stats.hardProblemsSolved += 1;
    if (isMultiConcept) this.state.stats.multiConceptProblemsSolved += 1;
    if (isMastery) this.state.stats.masteryTestsPassed += 1;

    // Update Streaks
    this.state.streaks.currentPassStreak += 1;
    if (this.state.streaks.currentPassStreak > this.state.streaks.bestPassStreak) {
      this.state.streaks.bestPassStreak = this.state.streaks.currentPassStreak;
    }

    if (isIndependent) {
      this.state.streaks.currentIndependentStreak += 1;
      if (this.state.streaks.currentIndependentStreak > this.state.streaks.bestIndependentStreak) {
        this.state.streaks.bestIndependentStreak = this.state.streaks.currentIndependentStreak;
      }
      // Emit independent success event for Pikachu reaction
      this.eventBus.emit(LEARNING_EVENTS.INDEPENDENT_SUCCESS, {
        exerciseId,
        streak: this.state.streaks.currentIndependentStreak
      });
    } else {
      this.state.streaks.currentIndependentStreak = 0;
    }

    // Award XP
    let reason = `${difficulty} problem solved`;
    if (antiFarmingFactor < 1.0) reason += ' (repeated practice)';
    if (isIndependent) reason += ' · Independent bonus';

    this.awardXP({
      amount: calculatedXP,
      reason,
      exerciseId,
      transactionId: txId
    });

    // Evaluate Achievements
    this.evaluateAchievements({
      firstCompileSuccess: !solutionRevealed,
      recoveredFromFailure: bugRecovered,
      isIndependentSolve: isIndependent,
      isSolutionRevealed: solutionRevealed,
      completedLessons: data.completedLessons || [],
      completedConcepts: concepts,
      conceptMastery: data.conceptMastery || {},
      stats: this.state.stats,
      streaks: this.state.streaks
    });

    // Check Curriculum Completion
    if (
      (data.completedLessons?.length >= 20 || data.totalLessonsCompleted >= 20) &&
      this.state.stats.masteryTestsPassed >= 1
    ) {
      this.eventBus.emit(LEARNING_EVENTS.CURRICULUM_COMPLETED, {
        totalCompleted: data.completedLessons?.length || 20,
        masteryTestsPassed: this.state.stats.masteryTestsPassed
      });
    }

    this.persist();
  }

  /**
   * Centralized, idempotent XP awarding method.
   * @param {Object} params
   * @param {number} params.amount
   * @param {string} params.reason
   * @param {string} [params.exerciseId]
   * @param {string} [params.transactionId]
   */
  awardXP({ amount, reason, exerciseId, transactionId }) {
    const xpToAdd = Math.max(0, Math.round(amount || 0));
    const previousLevel = this.state.level;

    this.state.xp += xpToAdd;

    // Evaluate Level Progression
    const levelInfo = this.calculateLevel(this.state.xp);
    this.state.level = levelInfo.level;
    this.state.levelName = levelInfo.name;

    // Emit XP_EARNED
    this.eventBus.emit(LEARNING_EVENTS.XP_EARNED, {
      amount: xpToAdd,
      reason: reason || 'Programming progress',
      totalXp: this.state.xp,
      level: this.state.level,
      exerciseId
    });

    // Emit LEVEL_UP if level increased
    if (this.state.level > previousLevel) {
      this.eventBus.emit(LEARNING_EVENTS.LEVEL_UP, {
        previousLevel,
        level: this.state.level,
        newLevel: this.state.level,
        levelName: this.state.levelName,
        totalXp: this.state.xp
      });
    }

    this.notifySubscribers();
    return xpToAdd;
  }

  /**
   * Evaluates all achievements against current context and unlocks any newly earned.
   * @param {Object} context
   */
  evaluateAchievements(context = {}) {
    const evalContext = {
      ...context,
      stats: this.state.stats,
      streaks: this.state.streaks,
      xp: this.state.xp,
      level: this.state.level
    };

    const newlyUnlocked = [];

    for (const achievement of Object.values(ACHIEVEMENTS)) {
      if (this.state.unlockedAchievements[achievement.id]) {
        continue; // Already unlocked (idempotency)
      }

      try {
        if (achievement.check(evalContext)) {
          this.state.unlockedAchievements[achievement.id] = {
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            category: achievement.category,
            icon: achievement.icon,
            unlockedAt: Date.now(),
            xpReward: achievement.xpReward
          };

          newlyUnlocked.push(achievement);

          // Award achievement XP
          this.awardXP({
            amount: achievement.xpReward,
            reason: `Achievement Unlocked: ${achievement.title}`,
            transactionId: `achieve:${achievement.id}`
          });

          // Emit ACHIEVEMENT_UNLOCKED
          this.eventBus.emit(LEARNING_EVENTS.ACHIEVEMENT_UNLOCKED, {
            achievement,
            totalXp: this.state.xp
          });
        }
      } catch (err) {
        console.error(`[GamificationEngine] Error checking achievement ${achievement.id}:`, err);
      }
    }

    if (newlyUnlocked.length > 0) {
      this.notifySubscribers();
    }

    return newlyUnlocked;
  }

  isTransactionProcessed(txId) {
    if (!txId) return false;
    return this.state.processedTransactions.includes(txId);
  }

  markTransactionProcessed(txId) {
    if (!txId) return;
    this.state.processedTransactions.push(txId);
    // Keep sliding window of latest 200 transactions
    if (this.state.processedTransactions.length > 200) {
      this.state.processedTransactions.shift();
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.getSnapshot());
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    const snap = this.getSnapshot();
    for (const sub of this.subscribers) {
      try {
        sub(snap);
      } catch (e) {
        console.error('[GamificationEngine] Subscriber error:', e);
      }
    }
  }

  getSnapshot() {
    const lvlInfo = this.calculateLevel(this.state.xp);
    return {
      xp: this.state.xp,
      level: lvlInfo.level,
      levelName: lvlInfo.name,
      minXp: lvlInfo.minXp,
      nextLevelXp: lvlInfo.nextLevelXp,
      progressPercentage: lvlInfo.progressPercentage,
      streaks: { ...this.state.streaks },
      stats: { ...this.state.stats },
      unlockedAchievements: { ...this.state.unlockedAchievements },
      unlockedCount: Object.keys(this.state.unlockedAchievements).length,
      totalAchievements: Object.keys(ACHIEVEMENTS).length
    };
  }

  persist() {
    if (typeof this.onSave === 'function') {
      this.onSave(this.state);
    }
  }

  destroy() {
    this.unbindEvents();
    this.subscribers.clear();
  }
}
