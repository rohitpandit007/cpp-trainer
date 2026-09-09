/**
 * Learning Event Bus for CodeBloom C++ Trainer.
 * Provides a clean pub/sub event architecture decoupled from the UI.
 * Subscribed to by mastery engines, UI notifiers, and future animated companion systems.
 */

export const LEARNING_EVENTS = {
  CODE_STARTED: 'CODE_STARTED',
  COMPILE_SUCCESS: 'COMPILE_SUCCESS',
  COMPILE_FAILED: 'COMPILE_FAILED',
  RUNTIME_FAILED: 'RUNTIME_FAILED',
  TEST_FAILED: 'TEST_FAILED',
  TEST_PASSED: 'TEST_PASSED',
  EXERCISE_COMPLETED: 'EXERCISE_COMPLETED',
  HINT_USED: 'HINT_USED',
  SOLUTION_REVEALED: 'SOLUTION_REVEALED',
  CONCEPT_IMPROVED: 'CONCEPT_IMPROVED',
  CONCEPT_MASTERED: 'CONCEPT_MASTERED',
  DIFFICULTY_INCREASED: 'DIFFICULTY_INCREASED',
  DIFFICULTY_DECREASED: 'DIFFICULTY_DECREASED',

  // Phase D4A Progression & Gamification Events
  XP_EARNED: 'XP_EARNED',
  LEVEL_UP: 'LEVEL_UP',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED',
  INDEPENDENT_SUCCESS: 'INDEPENDENT_SUCCESS',
  CURRICULUM_COMPLETED: 'CURRICULUM_COMPLETED',

  // Beginner Learning Layer Events
  ONBOARDING_STARTED: 'ONBOARDING_STARTED',
  ONBOARDING_STEP_COMPLETED: 'ONBOARDING_STEP_COMPLETED',
  ONBOARDING_COMPLETED: 'ONBOARDING_COMPLETED',
  PREDICTION_SUBMITTED: 'PREDICTION_SUBMITTED',
  PREDICTION_CORRECT: 'PREDICTION_CORRECT',
  PREDICTION_INCORRECT: 'PREDICTION_INCORRECT',
  MICRO_DEBUG_COMPLETED: 'MICRO_DEBUG_COMPLETED',
  DECOMPOSITION_COMPLETED: 'DECOMPOSITION_COMPLETED',
  SCAFFOLD_COMPLETED: 'SCAFFOLD_COMPLETED'
};

export class LearningEventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event.
   * @param {string} eventName
   * @param {Function} callback
   * @returns {Function} unsubscribe function
   */
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);
    return () => this.off(eventName, callback);
  }

  /**
   * Unsubscribe from an event.
   */
  off(eventName, callback) {
    const set = this.listeners.get(eventName);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(eventName);
      }
    }
  }

  /**
   * Emit an event to all subscribers.
   */
  emit(eventName, data = {}) {
    const payload = {
      event: eventName,
      timestamp: Date.now(),
      ...data
    };
    const set = this.listeners.get(eventName);
    if (set) {
      for (const callback of set) {
        try {
          callback(payload);
        } catch (err) {
          console.error(`[EventBus] Error in listener for ${eventName}:`, err);
        }
      }
    }
    // Wildcard subscriber support
    const allSet = this.listeners.get('*');
    if (allSet) {
      for (const callback of allSet) {
        try {
          callback(payload);
        } catch (err) {
          console.error(`[EventBus] Error in wildcard listener:`, err);
        }
      }
    }
    return payload;
  }

  /**
   * Returns the count of active listeners for a specific event or overall.
   */
  listenerCount(eventName) {
    if (eventName) {
      return this.listeners.get(eventName)?.size || 0;
    }
    let total = 0;
    for (const set of this.listeners.values()) {
      total += set.size;
    }
    return total;
  }

  /**
   * Clear all registered listeners (primarily for testing isolation).
   */
  clear() {
    this.listeners.clear();
  }
}

export const eventBus = new LearningEventBus();
