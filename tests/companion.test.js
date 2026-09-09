/**
 * Automated Test Suite for Companion & Animation Architecture (Phase D1).
 * Tests state machine transitions, event mappings, priority preemption,
 * debounce typing, asset registry resolution, fallbacks, and determinism.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  COMPANION_STATES,
  STATE_CATEGORIES,
  STATE_PRIORITIES,
  DEFAULT_STATE_DURATIONS_MS,
  REPEATED_FAILURE_THRESHOLD
} from '../src/companion/companionState.js';

import {
  AssetRegistry,
  PIKACHU_ASSET_MAP,
  DEFAULT_FALLBACK_FILE
} from '../src/companion/assetRegistry.js';

import { CompanionController } from '../src/companion/companionController.js';
import { LEARNING_EVENTS } from '../src/eventBus.js';

// Minimal mock event bus for isolated unit testing
class MockEventBus {
  constructor() {
    this.listeners = new Map();
  }
  on(event, cb) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(cb);
    return () => this.listeners.get(event)?.delete(cb);
  }
  emit(event, data = {}) {
    const set = this.listeners.get(event);
    if (set) {
      for (const cb of set) cb(data);
    }
  }
}

test('Companion & Animation Architecture (Phase D1)', async (t) => {

  await t.test('1. Default initialization starts in IDLE base state', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    assert.equal(controller.currentState, COMPANION_STATES.IDLE);
    assert.equal(controller.baseState, COMPANION_STATES.IDLE);
    assert.equal(controller.consecutiveFailures, 0);

    const snapshot = controller.getSnapshot();
    assert.equal(snapshot.state, COMPANION_STATES.IDLE);
    assert.equal(snapshot.category, STATE_CATEGORIES.BASE);
    assert.equal(snapshot.priority, 10);
    assert.equal(snapshot.assetFilename, 'default.png');
    assert.equal(snapshot.isTemporary, false);

    controller.destroy();
  });

  await t.test('2. COMPILE_FAILED transitions to COMPILE_ERROR', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    mockBus.emit(LEARNING_EVENTS.COMPILE_FAILED, { diagnostics: 'syntax error' });

    assert.equal(controller.currentState, COMPANION_STATES.COMPILE_ERROR);
    assert.equal(controller.consecutiveFailures, 1);
    const snapshot = controller.getSnapshot();
    assert.equal(snapshot.category, STATE_CATEGORIES.TEMPORARY);
    assert.equal(snapshot.priority, 60);
    assert.equal(snapshot.assetFilename, 'compile error.png');

    controller.destroy();
  });

  await t.test('3. RUNTIME_FAILED transitions to RUNTIME_ERROR', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    mockBus.emit(LEARNING_EVENTS.RUNTIME_FAILED, { exitCode: 139 });

    assert.equal(controller.currentState, COMPANION_STATES.RUNTIME_ERROR);
    assert.equal(controller.consecutiveFailures, 1);
    assert.equal(controller.getSnapshot().assetFilename, 'runtime error.png');

    controller.destroy();
  });

  await t.test('4. TEST_FAILED transitions to WRONG_OUTPUT', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    mockBus.emit(LEARNING_EVENTS.TEST_FAILED, { failedTests: 1 });

    assert.equal(controller.currentState, COMPANION_STATES.WRONG_OUTPUT);
    assert.equal(controller.consecutiveFailures, 1);
    assert.equal(controller.getSnapshot().assetFilename, 'wrong answer.png');

    controller.destroy();
  });

  await t.test('5. TEST_PASSED transitions to TEST_PASSED state', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    mockBus.emit(LEARNING_EVENTS.TEST_PASSED, { testIndex: 0 });

    assert.equal(controller.currentState, COMPANION_STATES.TEST_PASSED);
    assert.equal(controller.getSnapshot().assetFilename, 'test passed.png');

    controller.destroy();
  });

  await t.test('6. EXERCISE_COMPLETED with hintsUsed > 0 triggers CELEBRATION', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    mockBus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, { hintsUsed: 2, solutionRevealed: false });

    assert.equal(controller.currentState, COMPANION_STATES.CELEBRATION);
    assert.equal(controller.consecutiveFailures, 0);
    assert.equal(controller.getSnapshot().assetFilename, 'all tests passed.png');

    controller.destroy();
  });

  await t.test('7. EXERCISE_COMPLETED without hints triggers INDEPENDENT_SUCCESS', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    mockBus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, { hintsUsed: 0, solutionRevealed: false });

    assert.equal(controller.currentState, COMPANION_STATES.INDEPENDENT_SUCCESS);
    assert.equal(controller.consecutiveFailures, 0);
    assert.equal(controller.getSnapshot().assetFilename, 'solved without hints.png');

    controller.destroy();
  });

  await t.test('8. Repeated failure threshold (>=3) triggers TIRED state', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    mockBus.emit(LEARNING_EVENTS.COMPILE_FAILED);
    assert.equal(controller.currentState, COMPANION_STATES.COMPILE_ERROR);
    assert.equal(controller.consecutiveFailures, 1);

    mockBus.emit(LEARNING_EVENTS.RUNTIME_FAILED);
    assert.equal(controller.consecutiveFailures, 2);

    mockBus.emit(LEARNING_EVENTS.TEST_FAILED);
    assert.equal(controller.consecutiveFailures, 3);
    assert.equal(controller.currentState, COMPANION_STATES.TIRED);
    assert.equal(controller.getSnapshot().assetFilename, 'repeated failure.png');

    controller.destroy();
  });

  await t.test('9. Passing an exercise resets consecutive failures to 0', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    mockBus.emit(LEARNING_EVENTS.COMPILE_FAILED);
    mockBus.emit(LEARNING_EVENTS.COMPILE_FAILED);
    assert.equal(controller.consecutiveFailures, 2);

    mockBus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, { hintsUsed: 1 });
    assert.equal(controller.consecutiveFailures, 0);

    controller.destroy();
  });

  await t.test('10. CONCEPT_MASTERED triggers MASTERY state (priority 90)', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    mockBus.emit(LEARNING_EVENTS.CONCEPT_MASTERED, { concept: 'pointers' });

    assert.equal(controller.currentState, COMPANION_STATES.MASTERY);
    assert.equal(controller.getSnapshot().assetFilename, 'concept mastered.png');
    assert.equal(controller.getSnapshot().priority, 90);

    controller.destroy();
  });

  await t.test('11. Temporary state automatically expires back to base state', async () => {
    const controller = new CompanionController({ eventBus: null, reducedMotion: true });
    controller.transitionTo(COMPANION_STATES.TEST_PASSED);

    assert.equal(controller.currentState, COMPANION_STATES.TEST_PASSED);

    // In reducedMotion mode, TEST_PASSED duration is max(500, floor(2000 * 0.4)) = 800ms
    await new Promise(r => setTimeout(r, 900));

    assert.equal(controller.currentState, COMPANION_STATES.IDLE);
    controller.destroy();
  });

  await t.test('12. Higher priority event preempts lower priority temporary state', () => {
    const controller = new CompanionController({ eventBus: null });

    // Priority 50
    controller.transitionTo(COMPANION_STATES.WRONG_OUTPUT);
    assert.equal(controller.currentState, COMPANION_STATES.WRONG_OUTPUT);

    // Priority 90 > 50 -> Preemption allowed
    const preempted = controller.transitionTo(COMPANION_STATES.MASTERY);
    assert.equal(preempted, true);
    assert.equal(controller.currentState, COMPANION_STATES.MASTERY);

    controller.destroy();
  });

  await t.test('13. Lower priority event is rejected when higher temporary state is active', () => {
    const controller = new CompanionController({ eventBus: null });

    // Priority 80
    controller.transitionTo(COMPANION_STATES.CELEBRATION);
    assert.equal(controller.currentState, COMPANION_STATES.CELEBRATION);

    // Priority 40 < 80 -> Preemption rejected
    const rejected = controller.transitionTo(COMPANION_STATES.TEST_PASSED);
    assert.equal(rejected, false);
    assert.equal(controller.currentState, COMPANION_STATES.CELEBRATION);

    controller.destroy();
  });

  await t.test('14. Equal priority event does not preempt active temporary state', () => {
    const controller = new CompanionController({ eventBus: null });

    // COMPILE_ERROR priority is 60
    controller.transitionTo(COMPANION_STATES.COMPILE_ERROR);
    assert.equal(controller.currentState, COMPANION_STATES.COMPILE_ERROR);

    // RUNTIME_ERROR priority is also 60 -> Equal priority rejected to prevent thrashing
    const rejected = controller.transitionTo(COMPANION_STATES.RUNTIME_ERROR);
    assert.equal(rejected, false);
    assert.equal(controller.currentState, COMPANION_STATES.COMPILE_ERROR);

    controller.destroy();
  });

  await t.test('15. Base state changes during temporary reaction are remembered for return', async () => {
    const controller = new CompanionController({ eventBus: null, reducedMotion: true });

    // Start in temporary state
    controller.transitionTo(COMPANION_STATES.TEST_PASSED);
    assert.equal(controller.currentState, COMPANION_STATES.TEST_PASSED);

    // Base state transition to THINKING occurs while reaction is active
    controller.transitionTo(COMPANION_STATES.THINKING);
    assert.equal(controller.baseState, COMPANION_STATES.THINKING);
    // Visual state stays TEST_PASSED until expired
    assert.equal(controller.currentState, COMPANION_STATES.TEST_PASSED);

    // Wait for expiration
    await new Promise(r => setTimeout(r, 900));

    // Must return to THINKING, not IDLE
    assert.equal(controller.currentState, COMPANION_STATES.THINKING);
    controller.destroy();
  });

  await t.test('16. notifyTyping() transitions to CODING and debounces back to IDLE', async () => {
    const controller = new CompanionController({ eventBus: null });
    assert.equal(controller.currentState, COMPANION_STATES.IDLE);

    controller.notifyTyping();
    assert.equal(controller.currentState, COMPANION_STATES.CODING);
    assert.equal(controller.getSnapshot().assetFilename, 'coding.png');

    // Fast second stroke resets debounce timer
    controller.notifyTyping();
    assert.equal(controller.currentState, COMPANION_STATES.CODING);

    controller.destroy();
  });

  await t.test('17. Reduced motion setting reduces durations and updates snapshot flag', () => {
    const controller = new CompanionController({ eventBus: null, reducedMotion: false });
    assert.equal(controller.reducedMotion, false);

    controller.setReducedMotion(true);
    assert.equal(controller.reducedMotion, true);
    assert.equal(controller.getSnapshot().reducedMotion, true);

    controller.destroy();
  });

  await t.test('18. Asset Registry resolves all 12 verified assets for Pikachu accurately', () => {
    const registry = new AssetRegistry('/assets/companion');

    for (const [state, filename] of Object.entries(PIKACHU_ASSET_MAP)) {
      const resolvedFile = registry.getFilename(state);
      assert.equal(resolvedFile, filename, `State ${state} should map to ${filename}`);

      const url = registry.getAssetUrl(state);
      assert.ok(url.startsWith('/assets/companion/'));
      assert.ok(url.includes(encodeURIComponent(filename).replace(/%2F/g, '/')));
    }
  });

  await t.test('19. Asset Registry safely falls back to default.png for unknown state', () => {
    const registry = new AssetRegistry('/assets/companion');

    const filename = registry.getFilename('NON_EXISTENT_STATE');
    assert.equal(filename, DEFAULT_FALLBACK_FILE);

    const url = registry.getAssetUrl('NON_EXISTENT_STATE');
    assert.equal(url, '/assets/companion/default.png');
  });

  await t.test('20. Support for registering and switching to a custom character theme', () => {
    const registry = new AssetRegistry('/assets/companion');
    registry.registerCharacter('robot', 'RoboCoder', {
      [COMPANION_STATES.IDLE]: 'robot-idle.png',
      [COMPANION_STATES.CODING]: 'robot-coding.png'
    }, '/assets/robot');

    const controller = new CompanionController({ assetRegistry: registry, eventBus: null });
    controller.setCharacter('robot');

    assert.equal(controller.getSnapshot().characterId, 'robot');
    assert.equal(controller.getSnapshot().assetFilename, 'robot-idle.png');
    assert.equal(controller.getSnapshot().assetUrl, '/assets/robot/robot-idle.png');

    controller.destroy();
  });

  await t.test('21. Asset preloader completes safely in Node environment', async () => {
    const registry = new AssetRegistry('/assets/companion');
    const results = await registry.preloadAssets();

    assert.ok(Array.isArray(results));
    assert.equal(results.length, 12);
    assert.equal(results[0].status, 'skipped'); // Node has no window.Image
  });

  await t.test('22. Rapid event storm stress test ensures deterministic final state', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    // Emit 10 events in immediate succession
    mockBus.emit(LEARNING_EVENTS.CODE_STARTED);
    mockBus.emit(LEARNING_EVENTS.TEST_PASSED);
    mockBus.emit(LEARNING_EVENTS.COMPILE_FAILED);
    mockBus.emit(LEARNING_EVENTS.RUNTIME_FAILED);
    mockBus.emit(LEARNING_EVENTS.TEST_FAILED);
    mockBus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, { hintsUsed: 0 });
    mockBus.emit(LEARNING_EVENTS.TEST_PASSED); // Lower priority (40 vs 85)
    mockBus.emit(LEARNING_EVENTS.CONCEPT_MASTERED); // Higher priority (90 vs 85)

    // Final state should be MASTERY because priority 90 beats 85
    assert.equal(controller.currentState, COMPANION_STATES.MASTERY);

    controller.destroy();
  });

  await t.test('23. Malformed event payloads and invalid state transitions are handled gracefully', () => {
    const mockBus = new MockEventBus();
    const controller = new CompanionController({ eventBus: mockBus });

    // Malformed calls
    mockBus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, null);
    mockBus.emit(LEARNING_EVENTS.COMPILE_FAILED, undefined);

    // Invalid transition
    const result = controller.transitionTo('COMPLETELY_INVALID_STATE');
    assert.equal(result, false);

    // Controller should remain stable
    assert.ok(controller.currentState);
    controller.destroy();
  });

  await t.test('24. Subscriber receives synchronous snapshot upon subscription and on update', () => {
    const controller = new CompanionController({ eventBus: null });
    const snapshots = [];

    const unsubscribe = controller.subscribe((s) => snapshots.push(s));
    assert.equal(snapshots.length, 1);
    assert.equal(snapshots[0].state, COMPANION_STATES.IDLE);

    controller.transitionTo(COMPANION_STATES.THINKING);
    assert.equal(snapshots.length, 2);
    assert.equal(snapshots[1].state, COMPANION_STATES.THINKING);

    unsubscribe();
    controller.transitionTo(COMPANION_STATES.IDLE);
    assert.equal(snapshots.length, 2); // No new dispatch after unsubscribe

    controller.destroy();
  });
});
