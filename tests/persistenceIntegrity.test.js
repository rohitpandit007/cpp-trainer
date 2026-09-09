import test from 'node:test';
import assert from 'node:assert/strict';
import { StorageManager, STORAGE_KEYS } from '../src/storageManager.js';
import { validateProfileSchema, migrateProfile } from '../src/masteryEngine.js';

test('Subphase F3: Persistence, Migration & State Integrity', async (t) => {
  await t.test('1. Clean boot with empty storage initializes valid v3 profile', () => {
    const mockStorage = {
      store: {},
      getItem(k) { return this.store[k] || null; },
      setItem(k, v) { this.store[k] = String(v); },
      removeItem(k) { delete this.store[k]; }
    };

    const sm = new StorageManager(mockStorage);
    const profile = sm.getProfile();

    assert.equal(profile.version, 3);
    assert.ok(Array.isArray(profile.completed));
    assert.equal(profile.completed.length, 0);
    assert.ok(typeof profile.conceptMastery === 'object');
    assert.ok(validateProfileSchema(profile), 'Default initialized profile must satisfy Schema v3');
  });

  await t.test('2. Corrupted JSON string auto-recovers to valid v3 profile without throwing', () => {
    const mockStorage = {
      store: { [STORAGE_KEYS.PROFILE]: '{"broken": json... syntax error here' },
      getItem(k) { return this.store[k] || null; },
      setItem(k, v) { this.store[k] = String(v); },
      removeItem(k) { delete this.store[k]; }
    };

    const sm = new StorageManager(mockStorage);
    // Must NOT throw
    assert.doesNotThrow(() => {
      const profile = sm.getProfile();
      assert.equal(profile.version, 3);
      assert.ok(validateProfileSchema(profile));
    });
  });

  await t.test('3. Partial / missing nested properties are defensively repaired', () => {
    const partialProfile = {
      version: 3,
      completed: ['cpp-basics'],
      topics: { 'cpp-basics': { wins: 3, misses: 0 } },
      // conceptMastery is corrupt with bad types
      conceptMastery: {
        'cpp-basics': {
          attempts: 'invalid-string',
          level: null,
          recentPerformance: 'not-an-array'
        }
      }
    };

    const repaired = migrateProfile(partialProfile);
    assert.equal(repaired.version, 3);
    assert.equal(repaired.completed[0], 'cpp-basics');
    assert.equal(repaired.conceptMastery['cpp-basics'].attempts, 0, 'Non-numeric attempts repaired to 0');
    assert.equal(repaired.conceptMastery['cpp-basics'].level, 1, 'Null level repaired to 1');
    assert.ok(Array.isArray(repaired.conceptMastery['cpp-basics'].recentPerformance));
    assert.ok(validateProfileSchema(repaired));
  });

  await t.test('4. Legacy v1/v2 profile migration preserves completed topics and topic wins', () => {
    const legacyProfile = {
      completed: ['cpp-basics', 'functions'],
      topics: {
        'cpp-basics': { wins: 4, misses: 1 },
        'functions': { wins: 2, misses: 0 }
      }
    };

    const migrated = migrateProfile(legacyProfile);
    assert.equal(migrated.version, 3);
    assert.equal(migrated.completed.length, 2);
    assert.equal(migrated.topics['cpp-basics'].wins, 4);
    assert.equal(migrated.conceptMastery['cpp-basics'].successfulAttempts, 4);
    assert.equal(migrated.conceptMastery['cpp-basics'].attempts, 5);
    assert.ok(migrated.conceptMastery['cpp-basics'].level >= 2, 'Mastery level seeded from legacy wins');
    assert.ok(validateProfileSchema(migrated));
  });

  await t.test('5. Idempotent migration preserves already-v3 profile untouched', () => {
    const v3Profile = {
      version: 3,
      completed: ['cpp-basics'],
      topics: { 'cpp-basics': { wins: 3, misses: 1 } },
      conceptMastery: {},
      recentMistakes: [],
      retrievalQueue: ['functions'],
      history: [],
      stats: { totalSubmissions: 5, passedSubmissions: 3, hintsRevealed: 1, solutionsRevealed: 0 },
      gamification: { xp: 150, level: 2 }
    };

    const migrated = migrateProfile(v3Profile);
    assert.equal(migrated.version, 3);
    assert.equal(migrated.retrievalQueue[0], 'functions');
    assert.equal(migrated.gamification.xp, 150);
    assert.ok(validateProfileSchema(migrated));
  });

  await t.test('6. QuotaExceededError is caught and falls back to memory safely', () => {
    const mockQuotaStorage = {
      getItem() { return null; },
      setItem() {
        const err = new Error('Quota exceeded');
        err.name = 'QuotaExceededError';
        throw err;
      },
      removeItem() {}
    };

    const sm = new StorageManager(mockQuotaStorage);
    // Saving should not throw
    const success = sm.setItem('test-key', 'test-value');
    assert.equal(success, false, 'Should report false on quota failure');
    // Memory fallback should still return the value
    assert.equal(sm.getItem('test-key'), 'test-value', 'Memory fallback should return item');
  });

  await t.test('7. Benchmark results remain isolated from curriculum profile state', () => {
    const mockStorage = {
      store: {},
      getItem(k) { return this.store[k] || null; },
      setItem(k, v) { this.store[k] = String(v); },
      removeItem(k) { delete this.store[k]; }
    };

    const sm = new StorageManager(mockStorage);
    const profile = sm.getProfile();
    sm.saveProfile(profile);

    const benchResult = {
      exerciseId: 'bench-sensor-telemetry',
      score: 1.0,
      timestamp: Date.now()
    };
    sm.saveBenchmarkResult(benchResult);

    const reloadedProfile = sm.getProfile();
    assert.equal(reloadedProfile.completed.includes('bench-sensor-telemetry'), false, 'Benchmark problem must not contaminate profile.completed');
    assert.equal(reloadedProfile.topics['bench-sensor-telemetry'], undefined, 'Benchmark must not contaminate profile.topics');

    const benchmarkHistory = sm.getBenchmarkResults();
    assert.equal(benchmarkHistory.length, 1);
    assert.equal(benchmarkHistory[0].exerciseId, 'bench-sensor-telemetry');
  });
});
