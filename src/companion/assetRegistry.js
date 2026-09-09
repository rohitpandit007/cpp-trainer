/**
 * Asset Registry for Companion Characters in CodeBloom C++ Trainer.
 * Decouples semantic companion states from physical asset files.
 * Provides fallback handling, character themes, and asset preloading.
 */

import { COMPANION_STATES } from './companionState.js';

export const PIKACHU_ASSET_MAP = {
  [COMPANION_STATES.IDLE]: 'default.png',
  [COMPANION_STATES.THINKING]: 'thinking.png',
  [COMPANION_STATES.CODING]: 'coding.png',
  [COMPANION_STATES.TEST_PASSED]: 'test passed.png',
  [COMPANION_STATES.WRONG_OUTPUT]: 'wrong answer.png',
  [COMPANION_STATES.COMPILE_ERROR]: 'compile error.png',
  [COMPANION_STATES.RUNTIME_ERROR]: 'runtime error.png',
  [COMPANION_STATES.TIRED]: 'repeated failure.png',
  [COMPANION_STATES.CELEBRATION]: 'all tests passed.png',
  [COMPANION_STATES.INDEPENDENT_SUCCESS]: 'solved without hints.png',
  [COMPANION_STATES.MASTERY]: 'concept mastered.png',
  [COMPANION_STATES.ULTIMATE_MASTERY]: 'ultimate mastery.png'
};

export const DEFAULT_BASE_PATH = '/assets/companion';
export const DEFAULT_FALLBACK_FILE = 'default.png';

export class AssetRegistry {
  constructor(basePath = DEFAULT_BASE_PATH) {
    this.basePath = basePath.replace(/\/+$/, '');
    this.characters = new Map();
    this.activeCharacterId = 'pikachu';

    // Register built-in default character
    this.registerCharacter('pikachu', 'Pikachu', PIKACHU_ASSET_MAP, this.basePath);
  }

  /**
   * Register a new character pack.
   * @param {string} id Unique character identifier
   * @param {string} displayName User-friendly name
   * @param {Record<string, string>} assetMap Semantic state to filename map
   * @param {string} [basePath] Custom base path if distinct
   */
  registerCharacter(id, displayName, assetMap, basePath = this.basePath) {
    if (!id || typeof id !== 'string') {
      throw new Error('Character ID must be a non-empty string');
    }
    this.characters.set(id, {
      id,
      displayName: displayName || id,
      basePath: basePath.replace(/\/+$/, ''),
      assetMap: { ...assetMap },
      fallbackFile: assetMap[COMPANION_STATES.IDLE] || DEFAULT_FALLBACK_FILE
    });
  }

  /**
   * Set the active character theme.
   * @param {string} id
   */
  setActiveCharacter(id) {
    if (!this.characters.has(id)) {
      console.warn(`[AssetRegistry] Character "${id}" not found. Falling back to pikachu.`);
      this.activeCharacterId = 'pikachu';
      return;
    }
    this.activeCharacterId = id;
  }

  /**
   * Get active character ID.
   * @returns {string}
   */
  getActiveCharacter() {
    return this.activeCharacterId;
  }

  /**
   * Get character metadata.
   * @param {string} [characterId]
   */
  getCharacter(characterId = this.activeCharacterId) {
    return this.characters.get(characterId) || this.characters.get('pikachu');
  }

  /**
   * List all registered characters.
   * @returns {Array<{ id: string, displayName: string }>}
   */
  getRegisteredCharacters() {
    return Array.from(this.characters.values()).map(c => ({
      id: c.id,
      displayName: c.displayName
    }));
  }

  /**
   * Resolves the asset filename for a given state, with fallback.
   * @param {string} state
   * @param {string} [characterId]
   * @returns {string} filename
   */
  getFilename(state, characterId = this.activeCharacterId) {
    const character = this.getCharacter(characterId);
    if (!character) return DEFAULT_FALLBACK_FILE;

    const filename = character.assetMap[state];
    return filename || character.fallbackFile || DEFAULT_FALLBACK_FILE;
  }

  /**
   * Resolves the full URL / path for a companion state.
   * Encodes URI components to handle spaces in filenames safely.
   * @param {string} state
   * @param {string} [characterId]
   * @returns {string} URL string
   */
  getAssetUrl(state, characterId = this.activeCharacterId) {
    const character = this.getCharacter(characterId);
    const basePath = character ? character.basePath : this.basePath;
    const filename = this.getFilename(state, characterId);
    const encodedFilename = encodeURIComponent(filename).replace(/%2F/g, '/');
    return `${basePath}/${encodedFilename}`;
  }

  /**
   * Preloads all images for the specified character into the browser cache.
   * @param {string} [characterId]
   * @returns {Promise<Array<{ state: string, url: string, status: 'loaded' | 'error' | 'skipped' }>>}
   */
  async preloadAssets(characterId = this.activeCharacterId) {
    const character = this.getCharacter(characterId);
    if (!character) return [];

    const states = Object.keys(character.assetMap);

    // If running in headless / Node environment, return resolved metadata
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      return states.map(state => ({
        state,
        url: this.getAssetUrl(state, characterId),
        status: 'skipped'
      }));
    }

    const promises = states.map(state => {
      const url = this.getAssetUrl(state, characterId);
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({ state, url, status: 'loaded' });
        img.onerror = () => resolve({ state, url, status: 'error' });
        img.src = url;
      });
    });

    return Promise.all(promises);
  }
}

export const assetRegistry = new AssetRegistry();
