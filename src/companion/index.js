/**
 * Companion Module Entry Point for CodeBloom C++ Trainer.
 * Exports companion states, priorities, durations, asset registry,
 * companion controller, and presentation UI components.
 */

export {
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

export {
  AssetRegistry,
  assetRegistry,
  PIKACHU_ASSET_MAP,
  DEFAULT_BASE_PATH,
  DEFAULT_FALLBACK_FILE
} from './assetRegistry.js';

export {
  CompanionController,
  companionController
} from './companionController.js';

export {
  PikachuCompanion,
  initPikachuCompanion,
  DEFAULT_SPEECH_MESSAGES,
  SPEECH_POOLS,
  CXX_TIPS,
  getSpeechMessage
} from './pikachuCompanion.js';

