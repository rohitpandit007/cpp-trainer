/**
 * Centralized, Fault-Tolerant Storage Manager for CodeBloom C++ Trainer.
 * Encapsulates localStorage access, in-memory fallbacks (for private browsing/sandboxes),
 * automatic corruption recovery, quota safety, and benchmark state isolation.
 */

import { migrateProfile } from './masteryEngine.js';

export const STORAGE_KEYS = {
  PROFILE: 'codebloom-profile',
  THEME: 'codebloom-theme',
  COMPANION_MINIMIZED: 'codebloom-companion-minimized',
  BENCHMARK_RESULTS: 'codebloom-benchmark-results'
};

export class StorageManager {
  constructor(storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
    this.storage = storage;
    this.memoryFallback = new Map();
  }

  getItem(key) {
    if (this.storage) {
      try {
        const item = this.storage.getItem(key);
        if (item !== null) return item;
      } catch (err) {
        // e.g. SecurityError in strict iframes or private browsing
      }
    }
    return this.memoryFallback.has(key) ? this.memoryFallback.get(key) : null;
  }

  setItem(key, value) {
    const stringValue = String(value);
    this.memoryFallback.set(key, stringValue);
    if (this.storage) {
      try {
        this.storage.setItem(key, stringValue);
        return true;
      } catch (err) {
        // Handles QuotaExceededError or SecurityError
        console.warn(`[StorageManager] Failed to write to storage key "${key}":`, err.message);
        return false;
      }
    }
    return true;
  }

  removeItem(key) {
    this.memoryFallback.delete(key);
    if (this.storage) {
      try {
        this.storage.removeItem(key);
      } catch (err) {}
    }
  }

  clear() {
    this.memoryFallback.clear();
    if (this.storage) {
      try {
        this.storage.clear();
      } catch (err) {}
    }
  }

  /**
   * Loads, validates, migrates, and repairs the learner profile.
   * Never throws on corrupted, malformed, or missing storage data.
   *
   * Pipeline:
   * Load -> Validate -> Migrate -> Repair/Default -> Return
   */
  getProfile() {
    const raw = this.getItem(STORAGE_KEYS.PROFILE);
    let parsed = null;
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        console.warn('[StorageManager] Profile JSON was corrupted; initializing default profile.');
      }
    }
    return migrateProfile(parsed || {});
  }

  /**
   * Atomically saves the profile to storage.
   */
  saveProfile(profile) {
    if (!profile || typeof profile !== 'object') return false;
    try {
      return this.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (err) {
      return false;
    }
  }

  getTheme(defaultTheme = 'light') {
    return this.getItem(STORAGE_KEYS.THEME) || defaultTheme;
  }

  saveTheme(theme) {
    return this.setItem(STORAGE_KEYS.THEME, theme);
  }

  isCompanionMinimized() {
    return this.getItem(STORAGE_KEYS.COMPANION_MINIMIZED) === 'true';
  }

  setCompanionMinimized(minimized) {
    return this.setItem(STORAGE_KEYS.COMPANION_MINIMIZED, minimized ? 'true' : 'false');
  }

  /**
   * Isolated benchmark telemetry - separate from standard curriculum progression.
   */
  getBenchmarkResults() {
    const raw = this.getItem(STORAGE_KEYS.BENCHMARK_RESULTS);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveBenchmarkResult(result) {
    if (!result) return false;
    const current = this.getBenchmarkResults();
    current.push(result);
    // Retain sliding window of up to 50 historical benchmark attempts
    const trimmed = current.slice(-50);
    return this.setItem(STORAGE_KEYS.BENCHMARK_RESULTS, JSON.stringify(trimmed));
  }
}

export const storageManager = new StorageManager();
