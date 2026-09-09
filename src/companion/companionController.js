/**
 * Companion Controller for CodeBloom C++ Trainer.
 * Orchestrates companion state machine, listens to LearningEventBus,
 * manages state priority preemption, handles temporary state timeouts,
 * debounces editor typing, and dispatches updates to presentation layers.
 */

import {
  COMPANION_STATES,
  STATE_CATEGORIES,
  STATE_CATEGORY_MAP,
  STATE_PRIORITIES,
  DEFAULT_STATE_DURATIONS_MS,
  TYPING_DEBOUNCE_MS,
  REPEATED_FAILURE_THRESHOLD,
  ACHIEVEMENT_REACTION_TIERS,
  PROGRESSION_TIERS,
  getProgressionTier
} from './companionState.js';

import { assetRegistry as defaultAssetRegistry } from './assetRegistry.js';
import { eventBus as defaultEventBus, LEARNING_EVENTS } from '../eventBus.js';

export class CompanionController {
  /**
   * @param {Object} [options]
   * @param {import('./assetRegistry.js').AssetRegistry} [options.assetRegistry]
   * @param {import('../eventBus.js').LearningEventBus} [options.eventBus]
   * @param {boolean} [options.reducedMotion]
   * @param {string} [options.characterId]
   * @param {number} [options.level]
   * @param {string} [options.levelName]
   */
  constructor(options = {}) {
    this.assetRegistry = options.assetRegistry || defaultAssetRegistry;
    this.eventBus = options.eventBus || defaultEventBus;
    this.reducedMotion = Boolean(options.reducedMotion);
    this.characterId = options.characterId || this.assetRegistry.getActiveCharacter();
    this.level = Number(options.level) || 1;
    this.levelName = options.levelName || 'C++ Beginner';

    this.currentState = COMPANION_STATES.IDLE;
    this.baseState = COMPANION_STATES.IDLE;
    this.previousState = null;
    this.currentMetadata = {};

    this.consecutiveFailures = 0;
    this.lastFailure = null;
    this.activeTimer = null;
    this.typingTimer = null;

    this.subscribers = new Set();
    this.unsubscribes = [];

    // Automatically bind to event bus if provided
    if (this.eventBus) {
      this.bindEventBus();
    }
  }

  /**
   * Subscribes to learning events emitted by the learning & assessment engine.
   */
  bindEventBus() {
    this.unbindEventBus();

    this.unsubscribes.push(
      this.eventBus.on(LEARNING_EVENTS.CODE_STARTED, (data) => this.handleCodeStarted(data)),
      this.eventBus.on(LEARNING_EVENTS.COMPILE_FAILED, (data) => this.handleCompileFailed(data)),
      this.eventBus.on(LEARNING_EVENTS.RUNTIME_FAILED, (data) => this.handleRuntimeFailed(data)),
      this.eventBus.on(LEARNING_EVENTS.TEST_FAILED, (data) => this.handleTestFailed(data)),
      this.eventBus.on(LEARNING_EVENTS.TEST_PASSED, (data) => this.handleTestPassed(data)),
      this.eventBus.on(LEARNING_EVENTS.EXERCISE_COMPLETED, (data) => this.handleExerciseCompleted(data)),
      this.eventBus.on(LEARNING_EVENTS.CONCEPT_MASTERED, (data) => this.handleConceptMastered(data)),

      // Phase D4B Progression & Milestone Events
      this.eventBus.on(LEARNING_EVENTS.LEVEL_UP, (data) => this.handleLevelUp(data)),
      this.eventBus.on(LEARNING_EVENTS.ACHIEVEMENT_UNLOCKED, (data) => this.handleAchievementUnlocked(data)),
      this.eventBus.on(LEARNING_EVENTS.CURRICULUM_COMPLETED, (data) => this.handleCurriculumCompleted(data)),
      this.eventBus.on(LEARNING_EVENTS.INDEPENDENT_SUCCESS, (data) => this.handleIndependentSuccess(data))
    );
  }

  /**
   * Unbinds from learning event bus.
   */
  unbindEventBus() {
    for (const unbind of this.unsubscribes) {
      if (typeof unbind === 'function') {
        unbind();
      }
    }
    this.unsubscribes = [];
  }

  // -------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------

  handleCodeStarted(data) {
    const payload = data || {};
    this.transitionTo(COMPANION_STATES.THINKING, { sourceEvent: LEARNING_EVENTS.CODE_STARTED, ...payload });
  }

  handleCompileFailed(data) {
    const payload = data || {};
    this.consecutiveFailures += 1;
    this.lastFailure = { type: 'compile', exerciseId: payload.exerciseId, timestamp: Date.now() };
    const targetState = this.consecutiveFailures >= REPEATED_FAILURE_THRESHOLD
      ? COMPANION_STATES.TIRED
      : COMPANION_STATES.COMPILE_ERROR;

    this.transitionTo(targetState, {
      sourceEvent: LEARNING_EVENTS.COMPILE_FAILED,
      consecutiveFailures: this.consecutiveFailures,
      ...payload
    });
  }

  handleRuntimeFailed(data) {
    const payload = data || {};
    this.consecutiveFailures += 1;
    this.lastFailure = { type: 'runtime', exerciseId: payload.exerciseId, timestamp: Date.now() };
    const targetState = this.consecutiveFailures >= REPEATED_FAILURE_THRESHOLD
      ? COMPANION_STATES.TIRED
      : COMPANION_STATES.RUNTIME_ERROR;

    this.transitionTo(targetState, {
      sourceEvent: LEARNING_EVENTS.RUNTIME_FAILED,
      consecutiveFailures: this.consecutiveFailures,
      ...payload
    });
  }

  handleTestFailed(data) {
    const payload = data || {};
    this.consecutiveFailures += 1;
    this.lastFailure = { type: 'test', exerciseId: payload.exerciseId, timestamp: Date.now() };
    const targetState = this.consecutiveFailures >= REPEATED_FAILURE_THRESHOLD
      ? COMPANION_STATES.TIRED
      : COMPANION_STATES.WRONG_OUTPUT;

    this.transitionTo(targetState, {
      sourceEvent: LEARNING_EVENTS.TEST_FAILED,
      consecutiveFailures: this.consecutiveFailures,
      ...payload
    });
  }

  handleTestPassed(data) {
    const payload = data || {};
    this.transitionTo(COMPANION_STATES.TEST_PASSED, {
      sourceEvent: LEARNING_EVENTS.TEST_PASSED,
      ...payload
    });
  }

  handleExerciseCompleted(data) {
    const payload = data || {};
    const hadPriorFailure = this.consecutiveFailures > 0 || Boolean(this.lastFailure) || Boolean(payload.recoveredFromFailure);
    this.consecutiveFailures = 0;
    this.lastFailure = null;

    // Check for unguided/independent completion
    const isIndependent = (payload.hintsUsed === 0 || payload.hintsUsed == null) && !payload.solutionRevealed;
    const targetState = isIndependent
      ? COMPANION_STATES.INDEPENDENT_SUCCESS
      : COMPANION_STATES.CELEBRATION;

    this.transitionTo(targetState, {
      sourceEvent: LEARNING_EVENTS.EXERCISE_COMPLETED,
      isIndependent,
      isBugRecovery: hadPriorFailure,
      recoveredFromFailure: hadPriorFailure,
      ...payload
    });
  }

  handleConceptMastered(data) {
    const payload = data || {};
    this.transitionTo(COMPANION_STATES.MASTERY, {
      sourceEvent: LEARNING_EVENTS.CONCEPT_MASTERED,
      conceptId: payload.conceptId,
      conceptName: payload.conceptName || payload.conceptId,
      ...payload
    });
  }

  handleLevelUp(data) {
    const payload = data || {};
    this.level = Number(payload.level || payload.newLevel) || this.level;
    if (payload.levelName) this.levelName = payload.levelName;

    this.transitionTo(COMPANION_STATES.MASTERY, {
      sourceEvent: LEARNING_EVENTS.LEVEL_UP,
      isLevelUp: true,
      level: this.level,
      levelName: this.levelName,
      totalXp: payload.totalXp,
      ...payload
    });
  }

  handleAchievementUnlocked(data) {
    const payload = data || {};
    const ach = payload.achievement || {};

    let tier = ach.tier || ACHIEVEMENT_REACTION_TIERS.MINOR;
    if (!ach.tier) {
      if (ach.id === 'CURRICULUM_COMPLETE' || ach.category === 'curriculum') {
        tier = ACHIEVEMENT_REACTION_TIERS.FINAL;
      } else if ((ach.xpReward && ach.xpReward >= 250) || ach.id === 'MULTI_CONCEPT_SOLVER' || ach.id === 'INDEPENDENT_STREAK_5') {
        tier = ACHIEVEMENT_REACTION_TIERS.MAJOR;
      } else if ((ach.xpReward && ach.xpReward >= 75) || ach.id === 'BUG_HUNTER' || ach.id === 'NO_HELP_NEEDED' || ach.id === 'INDEPENDENT_STREAK_3') {
        tier = ACHIEVEMENT_REACTION_TIERS.IMPORTANT;
      }
    }

    if (tier === ACHIEVEMENT_REACTION_TIERS.FINAL) {
      this.baseState = COMPANION_STATES.ULTIMATE_MASTERY;
      this.transitionTo(COMPANION_STATES.ULTIMATE_MASTERY, {
        sourceEvent: LEARNING_EVENTS.ACHIEVEMENT_UNLOCKED,
        achievement: ach,
        achievementTier: tier,
        title: ach.title,
        ...payload
      });
      return;
    }

    const targetState = (tier === ACHIEVEMENT_REACTION_TIERS.MAJOR)
      ? COMPANION_STATES.MASTERY
      : (tier === ACHIEVEMENT_REACTION_TIERS.IMPORTANT)
        ? COMPANION_STATES.CELEBRATION
        : COMPANION_STATES.TEST_PASSED;

    this.transitionTo(targetState, {
      sourceEvent: LEARNING_EVENTS.ACHIEVEMENT_UNLOCKED,
      achievement: ach,
      achievementTier: tier,
      title: ach.title,
      ...payload
    });
  }

  handleCurriculumCompleted(data) {
    const payload = data || {};
    this.baseState = COMPANION_STATES.ULTIMATE_MASTERY;
    this.transitionTo(COMPANION_STATES.ULTIMATE_MASTERY, {
      sourceEvent: LEARNING_EVENTS.CURRICULUM_COMPLETED,
      ...payload
    });
  }

  handleIndependentSuccess(data) {
    const payload = data || {};
    this.transitionTo(COMPANION_STATES.INDEPENDENT_SUCCESS, {
      sourceEvent: LEARNING_EVENTS.INDEPENDENT_SUCCESS,
      isIndependent: true,
      streak: payload.streak,
      ...payload
    });
  }

  // -------------------------------------------------------------
  // Typing Heartbeat & Interaction (Non-compiling)
  // -------------------------------------------------------------

  /**
   * Called when user types in the editor.
   * Smoothly transitions base state to CODING with debounced return.
   * NEVER runs compiler or tests.
   */
  notifyTyping() {
    this.baseState = COMPANION_STATES.CODING;

    // Only update visual state if we are in a base state or idle
    const currentCategory = STATE_CATEGORY_MAP[this.currentState];
    if (currentCategory === STATE_CATEGORIES.BASE) {
      if (this.currentState !== COMPANION_STATES.CODING) {
        this.previousState = this.currentState;
        this.currentState = COMPANION_STATES.CODING;
        this.notifySubscribers({ reason: 'typing_active' });
      }
    }

    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    this.typingTimer = setTimeout(() => {
      if (this.currentState === COMPANION_STATES.CODING) {
        this.transitionTo(COMPANION_STATES.IDLE);
      }
      this.typingTimer = null;
    }, TYPING_DEBOUNCE_MS);
  }

  // -------------------------------------------------------------
  // State Machine Engine & Priority Management
  // -------------------------------------------------------------

  /**
   * Attempt transition to a target companion state.
   * Respects priority preemption and temporary state durations.
   * @param {string} targetState
   * @param {Object} [metadata]
   * @returns {boolean} Whether the transition took effect
   */
  transitionTo(targetState, metadata = {}) {
    if (!COMPANION_STATES[targetState]) {
      console.warn(`[CompanionController] Unknown state: "${targetState}"`);
      return false;
    }

    const targetCategory = STATE_CATEGORY_MAP[targetState] || STATE_CATEGORIES.BASE;
    const targetPriority = STATE_PRIORITIES[targetState] ?? 0;
    const currentPriority = STATE_PRIORITIES[this.currentState] ?? 0;
    const currentCategory = STATE_CATEGORY_MAP[this.currentState];

    if (targetCategory === STATE_CATEGORIES.BASE) {
      // ULTIMATE_MASTERY is the ultimate base state and cannot be downgraded
      if (this.currentState === COMPANION_STATES.ULTIMATE_MASTERY && targetState !== COMPANION_STATES.ULTIMATE_MASTERY) {
        return false;
      }

      // Target is contextual base state
      this.baseState = targetState;

      // If currently displaying a temporary reaction, do not interrupt it
      if (currentCategory === STATE_CATEGORIES.TEMPORARY) {
        return false;
      }

      // If current state is already this base state, no-op
      if (this.currentState === targetState) {
        return false;
      }

      this.previousState = this.currentState;
      this.currentState = targetState;
      this.notifySubscribers({ ...metadata });
      return true;
    }

    // Target is TEMPORARY reaction state
    // Must have strictly higher priority than current active state
    if (currentPriority >= targetPriority) {
      return false;
    }

    // Clear existing reaction timer
    if (this.activeTimer) {
      clearTimeout(this.activeTimer);
      this.activeTimer = null;
    }

    this.previousState = this.currentState;
    this.currentState = targetState;
    this.currentMetadata = { ...metadata };

    // Determine duration
    let duration = DEFAULT_STATE_DURATIONS_MS[targetState] || 3000;
    if (this.reducedMotion) {
      duration = Math.max(500, Math.floor(duration * 0.4));
    }

    this.activeTimer = setTimeout(() => {
      this.onTemporaryStateExpired(targetState);
    }, duration);

    this.notifySubscribers({
      duration,
      isTemporary: true,
      ...metadata
    });

    return true;
  }

  /**
   * Called when a temporary reaction expires.
   * Returns cleanly to current base state.
   * @param {string} expiredState
   */
  onTemporaryStateExpired(expiredState) {
    if (this.currentState === expiredState) {
      this.activeTimer = null;
      this.previousState = this.currentState;
      this.currentState = this.baseState;
      this.notifySubscribers({ reason: 'reaction_expired' });
    }
  }

  // -------------------------------------------------------------
  // Subscription & Presentation Integration
  // -------------------------------------------------------------

  /**
   * Subscribe to companion state changes.
   * Immediately calls the listener with current state snapshot.
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Subscriber must be a function');
    }
    this.subscribers.add(callback);

    // Initial snapshot dispatch
    try {
      callback(this.getSnapshot());
    } catch (err) {
      console.error('[CompanionController] Error in subscriber initial callback:', err);
    }

    return () => this.unsubscribe(callback);
  }

  /**
   * Unsubscribe a listener.
   * @param {Function} callback
   */
  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  /**
   * Dispatches the current state snapshot to all registered subscribers.
   * @param {Object} [extra]
   */
  notifySubscribers(extra = {}) {
    const snapshot = {
      ...this.getSnapshot(),
      ...extra
    };

    for (const listener of this.subscribers) {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('[CompanionController] Error in subscriber listener:', err);
      }
    }
  }

  /**
   * Returns a complete, decoupled state snapshot.
   * @returns {Object}
   */
  getSnapshot() {
    const category = STATE_CATEGORY_MAP[this.currentState] || STATE_CATEGORIES.BASE;
    const priority = STATE_PRIORITIES[this.currentState] ?? 0;
    const assetFilename = this.assetRegistry.getFilename(this.currentState, this.characterId);
    const assetUrl = this.assetRegistry.getAssetUrl(this.currentState, this.characterId);

    return {
      state: this.currentState,
      previousState: this.previousState,
      baseState: this.baseState,
      category,
      priority,
      assetFilename,
      assetUrl,
      characterId: this.characterId,
      reducedMotion: this.reducedMotion,
      isTemporary: category === STATE_CATEGORIES.TEMPORARY,
      consecutiveFailures: this.consecutiveFailures,
      level: this.level,
      levelName: this.levelName,
      progressionTier: getProgressionTier(this.level),
      lastFailure: this.lastFailure,
      lastMetadata: this.currentMetadata,
      timestamp: Date.now()
    };
  }

  // -------------------------------------------------------------
  // Configuration & LifeCycle Controls
  // -------------------------------------------------------------

  /**
   * Updates companion level and progression tier.
   * @param {number} level
   * @param {string} [levelName]
   */
  setLevel(level, levelName) {
    this.level = Number(level) || 1;
    if (levelName) this.levelName = levelName;
    this.notifySubscribers({ reason: 'level_updated' });
  }

  /**
   * Update accessibility reduced-motion preference.
   * @param {boolean} enabled
   */
  setReducedMotion(enabled) {
    this.reducedMotion = Boolean(enabled);
    this.notifySubscribers({ reason: 'config_changed' });
  }

  /**
   * Switch the active character skin.
   * @param {string} characterId
   */
  setCharacter(characterId) {
    this.characterId = characterId;
    this.assetRegistry.setActiveCharacter(characterId);
    this.notifySubscribers({ reason: 'character_changed' });
  }

  /**
   * Trigger ultimate mastery celebration state.
   */
  triggerUltimateMastery() {
    this.baseState = COMPANION_STATES.ULTIMATE_MASTERY;
    this.transitionTo(COMPANION_STATES.ULTIMATE_MASTERY, { sourceEvent: 'MANUAL_ULTIMATE_MASTERY' });
  }

  /**
   * Resets companion state, timers, and failure counters.
   */
  reset() {
    if (this.activeTimer) {
      clearTimeout(this.activeTimer);
      this.activeTimer = null;
    }
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }

    this.consecutiveFailures = 0;
    this.lastFailure = null;
    this.currentMetadata = {};
    this.baseState = COMPANION_STATES.IDLE;
    this.previousState = this.currentState;
    this.currentState = COMPANION_STATES.IDLE;
    this.notifySubscribers({ reason: 'reset' });
  }

  /**
   * Cleanly destroys controller instance.
   */
  destroy() {
    this.unbindEventBus();
    if (this.activeTimer) {
      clearTimeout(this.activeTimer);
      this.activeTimer = null;
    }
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
    this.subscribers.clear();
  }
}

export const companionController = new CompanionController();
