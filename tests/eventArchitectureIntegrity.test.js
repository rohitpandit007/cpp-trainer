import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LearningEventBus, LEARNING_EVENTS } from '../src/eventBus.js';
import { GamificationEngine } from '../src/gamification/gamificationEngine.js';
import { CompanionController } from '../src/companion/companionController.js';
import { COMPANION_STATES } from '../src/companion/companionState.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('Subphase F5: EventBus, Mastery, Gamification & Companion Integrity', async (t) => {
  await t.test('1. Event ordering and decoupled pub/sub delivery', () => {
    const bus = new LearningEventBus();
    const received = [];

    bus.on(LEARNING_EVENTS.CODE_STARTED, (d) => received.push(['CODE_STARTED', d.step]));
    bus.on(LEARNING_EVENTS.COMPILE_SUCCESS, (d) => received.push(['COMPILE_SUCCESS', d.step]));
    bus.on(LEARNING_EVENTS.TEST_PASSED, (d) => received.push(['TEST_PASSED', d.step]));

    bus.emit(LEARNING_EVENTS.CODE_STARTED, { step: 1 });
    bus.emit(LEARNING_EVENTS.COMPILE_SUCCESS, { step: 2 });
    bus.emit(LEARNING_EVENTS.TEST_PASSED, { step: 3 });

    assert.deepEqual(received, [
      ['CODE_STARTED', 1],
      ['COMPILE_SUCCESS', 2],
      ['TEST_PASSED', 3]
    ]);
  });

  await t.test('2. Rapid event bursts (50 events) process cleanly without memory/listener leaks', () => {
    const bus = new LearningEventBus();
    let count = 0;
    const unsub = bus.on(LEARNING_EVENTS.CODE_STARTED, () => { count++; });

    for (let i = 0; i < 50; i++) {
      bus.emit(LEARNING_EVENTS.CODE_STARTED, { i });
    }
    assert.equal(count, 50);
    unsub();
    assert.equal(bus.listenerCount(LEARNING_EVENTS.CODE_STARTED), 0);
  });

  await t.test('3. Single-transaction idempotency prevents duplicate XP and streak awards', () => {
    const bus = new LearningEventBus();
    const ge = new GamificationEngine({ eventBus: bus });
    const initialXP = ge.state.xp;

    const eventPayload = {
      exerciseId: 'cpp-basics-mini',
      transactionId: 'tx-test-unique-12345',
      difficulty: 'easy',
      hintsUsed: 0,
      solutionRevealed: false,
      timestamp: Date.now()
    };

    // Emit duplicate event with same transactionId 3 times
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, eventPayload);
    const xpAfterFirst = ge.state.xp;
    assert.ok(xpAfterFirst > initialXP, 'XP should be awarded on first event');

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, eventPayload);
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, eventPayload);

    assert.equal(ge.state.xp, xpAfterFirst, 'XP must NOT increase on duplicate transaction IDs');
  });

  await t.test('4. Benchmark mode is strictly isolated from gamification XP and streaks', () => {
    const bus = new LearningEventBus();
    const ge = new GamificationEngine({ eventBus: bus });
    const initialXP = ge.state.xp;

    const benchmarkPayload = {
      exerciseId: 'bench-sensor-telemetry',
      transactionId: 'tx-bench-001',
      mode: 'benchmark',
      isBenchmark: true,
      difficulty: 'hard',
      hintsUsed: 0
    };

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, benchmarkPayload);
    assert.equal(ge.state.xp, initialXP, 'Benchmark solve must NOT award normal gamification XP');
  });

  await t.test('5. Listener cleanup: repeated bind/unbind cycles leave zero orphaned listeners', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    assert.ok(bus.listenerCount() > 0, 'Controller should have bound listeners');

    for (let i = 0; i < 20; i++) {
      controller.bindEventBus();
    }
    // bindEventBus cleans previous unsubs before rebinding
    const countAfterRebinds = bus.listenerCount();

    controller.unbindEventBus();
    assert.equal(bus.listenerCount(), 0, 'All listeners must be cleaned upon unbind');
  });

  await t.test('6. Priority preemption: ULTIMATE_MASTERY (100) cannot be overridden by TEST_PASSED (40)', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    controller.transitionTo(COMPANION_STATES.ULTIMATE_MASTERY);
    assert.equal(controller.currentState, COMPANION_STATES.ULTIMATE_MASTERY);

    // Attempt to transition to lower-priority TEST_PASSED
    controller.transitionTo(COMPANION_STATES.TEST_PASSED);
    assert.equal(controller.currentState, COMPANION_STATES.ULTIMATE_MASTERY, 'Higher priority state must not be preempted by lower priority');
  });

  await t.test('7. Absolute Invariant Scan: STRICTLY ZERO audio elements or speech synthesis across repository', () => {
    const targetDirs = ['src', 'server'];
    const forbiddenAudioPatterns = [
      /AudioContext/i,
      /webkitAudioContext/i,
      /\bnew\s+Audio\s*\(/i,
      /<audio[\s>]/i,
      /speechSynthesis/i,
      /SpeechSynthesisUtterance/i
    ];

    function scanDir(dir) {
      const fullDir = path.resolve(ROOT_DIR, dir);
      if (!fs.existsSync(fullDir)) return;
      const entries = fs.readdirSync(fullDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(fullDir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.name.endsWith('.js') || entry.name.endsWith('.html') || entry.name.endsWith('.css')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const pat of forbiddenAudioPatterns) {
            assert.equal(pat.test(content), false, `Forbidden sound/audio API ${pat} found in ${path.relative(ROOT_DIR, fullPath)}`);
          }
        }
      }
    }

    for (const dir of targetDirs) {
      scanDir(dir);
    }
    // Also scan index.html
    const indexHtml = fs.readFileSync(path.resolve(ROOT_DIR, 'index.html'), 'utf8');
    for (const pat of forbiddenAudioPatterns) {
      assert.equal(pat.test(indexHtml), false, `Forbidden sound/audio API ${pat} found in index.html`);
    }
  });

  await t.test('8. Absolute Invariant Scan: STRICTLY ZERO runtime debuggers (GDB/LLDB) or process tracing', () => {
    const targetDirs = ['src', 'server'];
    const forbiddenTracingPatterns = [
      /\bgdb\b/i,
      /\blldb\b/i,
      /\bptrace\b/i,
      /\bprocess\.binding\b/i
    ];

    function scanDir(dir) {
      const fullDir = path.resolve(ROOT_DIR, dir);
      if (!fs.existsSync(fullDir)) return;
      const entries = fs.readdirSync(fullDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(fullDir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.name.endsWith('.js')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const pat of forbiddenTracingPatterns) {
            assert.equal(pat.test(content), false, `Forbidden debugger/tracing token ${pat} found in ${path.relative(ROOT_DIR, fullPath)}`);
          }
        }
      }
    }

    for (const dir of targetDirs) {
      scanDir(dir);
    }
  });
});
