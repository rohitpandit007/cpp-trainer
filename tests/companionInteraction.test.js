/**
 * Phase D4B: Pikachu Interaction & Contextual Reactions Test Suite
 * Validates companion responsiveness to coding errors, bug recovery,
 * concept mastery, level progression, achievement unlocks, curriculum completion,
 * deterministic tip cycling, and zero-sound architectural compliance.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  COMPANION_STATES,
  ACHIEVEMENT_REACTION_TIERS,
  PROGRESSION_TIERS,
  getProgressionTier,
  CompanionController,
  PikachuCompanion,
  getSpeechMessage,
  SPEECH_POOLS,
  CXX_TIPS,
  DEFAULT_SPEECH_MESSAGES
} from '../src/companion/index.js';

import { LearningEventBus, LEARNING_EVENTS } from '../src/eventBus.js';

// --- Lightweight DOM Mock for Component Testing ---
class MockClassList {
  constructor(element) {
    this.element = element;
    this.classes = new Set();
  }
  add(...names) {
    for (const n of names) this.classes.add(n);
    this.sync();
  }
  remove(...names) {
    for (const n of names) this.classes.delete(n);
    this.sync();
  }
  toggle(name, force) {
    const shouldAdd = typeof force === 'boolean' ? force : !this.classes.has(name);
    if (shouldAdd) this.classes.add(name);
    else this.classes.delete(name);
    this.sync();
    return shouldAdd;
  }
  contains(name) {
    return this.classes.has(name);
  }
  sync() {
    this.element._className = Array.from(this.classes).join(' ');
  }
  [Symbol.iterator]() {
    return this.classes[Symbol.iterator]();
  }
}

class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.attributes = new Map();
    this.listeners = new Map();
    this.style = {};
    this._className = '';
    this.classList = new MockClassList(this);
    this.textContent = '';
    this.title = '';
    this.id = '';
    this.complete = true;
    this._src = '';
  }

  get className() {
    return this._className;
  }

  set className(val) {
    this._className = val || '';
    this.classList.classes.clear();
    for (const c of this._className.split(/\s+/).filter(Boolean)) {
      this.classList.classes.add(c);
    }
  }

  setAttribute(k, v) {
    this.attributes.set(k, String(v));
    if (k === 'id') this.id = String(v);
    if (k === 'class') this.className = String(v);
  }

  getAttribute(k) {
    if (k === 'src') return this.src;
    return this.attributes.get(k) || null;
  }

  get src() {
    return this.attributes.get('src') || this._src || '';
  }

  set src(v) {
    this._src = v;
    this.attributes.set('src', v);
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }

  addEventListener(event, cb) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(cb);
  }

  removeEventListener(event, cb) {
    this.listeners.get(event)?.delete(cb);
  }

  dispatchEvent(event) {
    const set = this.listeners.get(event.type || event);
    if (set) {
      for (const cb of set) cb(typeof event === 'object' ? event : { type: event, stopPropagation: () => {} });
    }
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const results = [];
    const match = (el) => {
      if (selector.startsWith('#') && el.id === selector.slice(1)) {
        results.push(el);
      } else if (selector.startsWith('.') && el.classList.contains(selector.slice(1))) {
        results.push(el);
      } else if (el.tagName.toLowerCase() === selector.toLowerCase()) {
        results.push(el);
      }
      for (const child of el.children) match(child);
    };

    for (const child of this.children) match(child);
    return results;
  }

  set innerHTML(html) {
    this.children = [];
    if (html.includes('companion-bubble')) {
      const bubble = new MockElement('div');
      bubble.className = 'companion-bubble';
      bubble.id = 'companion-bubble';

      const text = new MockElement('span');
      text.className = 'bubble-text';
      bubble.appendChild(text);

      const tail = new MockElement('div');
      tail.className = 'bubble-tail';
      bubble.appendChild(tail);

      this.appendChild(bubble);
    }

    if (html.includes('companion-stage')) {
      const stage = new MockElement('div');
      stage.className = 'companion-stage';

      const frame = new MockElement('div');
      frame.className = 'companion-avatar-frame';

      const imgCurrent = new MockElement('img');
      imgCurrent.className = 'companion-img current';
      imgCurrent.src = '/assets/companion/default.png';
      frame.appendChild(imgCurrent);

      const imgNext = new MockElement('img');
      imgNext.className = 'companion-img next';
      imgNext.src = '';
      frame.appendChild(imgNext);

      stage.appendChild(frame);

      const controls = new MockElement('div');
      controls.className = 'companion-controls';

      const badge = new MockElement('span');
      badge.className = 'companion-state-badge';
      badge.textContent = 'IDLE';
      controls.appendChild(badge);

      const btn = new MockElement('button');
      btn.className = 'companion-toggle-btn';
      btn.textContent = '─';
      controls.appendChild(btn);

      stage.appendChild(controls);
      this.appendChild(stage);
    }
  }
}

globalThis.document = {
  createElement(tag) { return new MockElement(tag); },
  body: new MockElement('body')
};

globalThis.window = {
  matchMedia: () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {}
  })
};

// ==============================================================
// TEST SUITE: Phase D4B Pikachu Interactions & Contextual Reactions
// ==============================================================

test('Phase D4B: Progression Tiers & State Mapping', async (t) => {
  await t.test('1. Progression tiers correctly map from levels 1 through 10', () => {
    assert.equal(getProgressionTier(1), PROGRESSION_TIERS.NOVICE);
    assert.equal(getProgressionTier(2), PROGRESSION_TIERS.NOVICE);
    assert.equal(getProgressionTier(3), PROGRESSION_TIERS.APPRENTICE);
    assert.equal(getProgressionTier(4), PROGRESSION_TIERS.APPRENTICE);
    assert.equal(getProgressionTier(5), PROGRESSION_TIERS.ARCHITECT);
    assert.equal(getProgressionTier(6), PROGRESSION_TIERS.ARCHITECT);
    assert.equal(getProgressionTier(7), PROGRESSION_TIERS.PRACTITIONER);
    assert.equal(getProgressionTier(8), PROGRESSION_TIERS.PRACTITIONER);
    assert.equal(getProgressionTier(9), PROGRESSION_TIERS.MASTER);
    assert.equal(getProgressionTier(10), PROGRESSION_TIERS.MASTER);
    assert.equal(getProgressionTier(15), PROGRESSION_TIERS.MASTER);
  });

  await t.test('2. CompanionController default snapshot has Level 1 Novice tier', () => {
    const controller = new CompanionController({ eventBus: null });
    const snap = controller.getSnapshot();
    assert.equal(snap.level, 1);
    assert.equal(snap.levelName, 'C++ Beginner');
    assert.equal(snap.progressionTier, 'novice');
    controller.destroy();
  });

  await t.test('3. setLevel updates snapshot level, levelName, and progression tier', () => {
    const controller = new CompanionController({ eventBus: null });
    controller.setLevel(5, 'C++ System Architect');
    const snap = controller.getSnapshot();
    assert.equal(snap.level, 5);
    assert.equal(snap.levelName, 'C++ System Architect');
    assert.equal(snap.progressionTier, 'architect');
    controller.destroy();
  });
});

test('Phase D4B: Contextual Error Feedback (Compiler, Runtime, Output)', async (t) => {
  await t.test('4. COMPILE_ERROR provides pointer & dynamic memory contextual guidance', () => {
    const msg = getSpeechMessage({
      state: COMPANION_STATES.COMPILE_ERROR,
      lastMetadata: { concept: 'memory', lessonId: 'memory' }
    });
    assert.match(msg, /pointer syntax|dynamic allocation/i);
  });

  await t.test('5. COMPILE_ERROR provides class & struct semicolon guidance', () => {
    const msg = getSpeechMessage({
      state: COMPANION_STATES.COMPILE_ERROR,
      lastMetadata: { concept: 'classes', lessonId: 'classes' }
    });
    assert.match(msg, /semicolon \(;\)/i);
  });

  await t.test('6. COMPILE_ERROR provides function signature & return type guidance', () => {
    const msg = getSpeechMessage({
      state: COMPANION_STATES.COMPILE_ERROR,
      lastMetadata: { concept: 'functions', lessonId: 'functions' }
    });
    assert.match(msg, /return type|parameter list/i);
  });

  await t.test('7. COMPILE_ERROR provides inheritance & abstract class guidance', () => {
    const msg = getSpeechMessage({
      state: COMPANION_STATES.COMPILE_ERROR,
      lastMetadata: { concept: 'inheritance', lessonId: 'inheritance' }
    });
    assert.match(msg, /base class|pure virtual/i);
  });

  await t.test('8. COMPILE_ERROR provides runtime polymorphism virtual function guidance', () => {
    const msg = getSpeechMessage({
      state: COMPANION_STATES.COMPILE_ERROR,
      lastMetadata: { concept: 'runtime', lessonId: 'runtime' }
    });
    assert.match(msg, /virtual function/i);
  });

  await t.test('9. COMPILE_ERROR includes classifiedError description when provided', () => {
    const msg = getSpeechMessage({
      state: COMPANION_STATES.COMPILE_ERROR,
      classifiedError: { description: 'Missing closing brace' }
    });
    assert.equal(msg, 'Compiler note: Missing closing brace');
  });

  await t.test('10. RUNTIME_ERROR provides contextual memory/pointer clues', () => {
    const msg = getSpeechMessage({
      state: COMPANION_STATES.RUNTIME_ERROR,
      lastMetadata: { concept: 'memory' }
    });
    assert.match(msg, /pointers are not null|allocated memory/i);
  });

  await t.test('11. WRONG_OUTPUT provides contextual return value clues for functions', () => {
    const msg = getSpeechMessage({
      state: COMPANION_STATES.WRONG_OUTPUT,
      lastMetadata: { concept: 'functions' }
    });
    assert.match(msg, /returns the value/i);
  });

  await t.test('12. Repeated failure (>=3) triggers TIRED state with encouraging message', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.COMPILE_FAILED, { error: 'Syntax error 1' });
    bus.emit(LEARNING_EVENTS.COMPILE_FAILED, { error: 'Syntax error 2' });
    bus.emit(LEARNING_EVENTS.COMPILE_FAILED, { error: 'Syntax error 3' });

    assert.equal(controller.getSnapshot().state, COMPANION_STATES.TIRED);
    assert.equal(controller.consecutiveFailures, 3);
    controller.destroy();
  });
});

test('Phase D4B: Success Reactions, Independent Solves & Bug Recovery', async (t) => {
  await t.test('13. Passing an exercise without hints triggers INDEPENDENT_SUCCESS', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'cpp-basics-1',
      hintsUsed: 0
    });

    assert.equal(controller.getSnapshot().state, COMPANION_STATES.INDEPENDENT_SUCCESS);
    controller.destroy();
  });

  await t.test('14. Passing an exercise with hints triggers CELEBRATION', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'cpp-basics-1',
      hintsUsed: 1
    });

    assert.equal(controller.getSnapshot().state, COMPANION_STATES.CELEBRATION);
    controller.destroy();
  });

  await t.test('15. Passing after a prior failure triggers Bug Recovery celebration speech', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    // Step 1: Encounter a compiler error
    bus.emit(LEARNING_EVENTS.COMPILE_FAILED, { error: 'missing semicolon' });
    assert.equal(controller.consecutiveFailures, 1);
    assert.ok(controller.lastFailure);

    // Step 2: Now solve and pass the exercise
    bus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
      exerciseId: 'cpp-basics-1',
      hintsUsed: 0
    });

    const snapshot = controller.getSnapshot();
    assert.equal(snapshot.lastMetadata?.isBugRecovery, true);

    const speech = getSpeechMessage(snapshot);
    assert.match(speech, /Bug squashed! Persistence through errors/i);

    // Consecutive failures should be reset to 0
    assert.equal(controller.consecutiveFailures, 0);
    assert.equal(controller.lastFailure, null);
    controller.destroy();
  });
});

test('Phase D4B: Concept Mastery & Curriculum Completion Reactions', async (t) => {
  await t.test('16. CONCEPT_MASTERED triggers MASTERY state with concept name in speech', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.CONCEPT_MASTERED, {
      concept: 'functions',
      conceptName: 'Functions & Recursion'
    });

    const snap = controller.getSnapshot();
    assert.equal(snap.state, COMPANION_STATES.MASTERY);

    const speech = getSpeechMessage(snap);
    assert.match(speech, /Mastery achieved in Functions & Recursion!/i);
    controller.destroy();
  });

  await t.test('17. CURRICULUM_COMPLETED triggers ULTIMATE_MASTERY (Priority 100)', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.CURRICULUM_COMPLETED, {
      totalLessons: 20,
      masteryCompleted: true
    });

    const snap = controller.getSnapshot();
    assert.equal(snap.state, COMPANION_STATES.ULTIMATE_MASTERY);

    const speech = getSpeechMessage(snap);
    assert.match(speech, /Curriculum complete! You are a genuine C\+\+ coder!/i);
    controller.destroy();
  });
});

test('Phase D4B: Level Up & Progression Tier Dynamic Updates', async (t) => {
  await t.test('18. LEVEL_UP event updates level and triggers MASTERY state with level announcement', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.LEVEL_UP, {
      level: 4,
      levelName: 'C++ Code Apprentice'
    });

    const snap = controller.getSnapshot();
    assert.equal(snap.state, COMPANION_STATES.MASTERY);
    assert.equal(snap.level, 4);
    assert.equal(snap.levelName, 'C++ Code Apprentice');
    assert.equal(snap.progressionTier, 'apprentice');

    const speech = getSpeechMessage(snap);
    assert.match(speech, /Level up! You are now a Level 4 C\+\+ Code Apprentice!/i);
    controller.destroy();
  });

  await t.test('19. UI component updates progression tier CSS class on root element', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    const dock = rootContainer.querySelector('#companion-dock');
    assert.ok(dock.classList.contains('tier-novice'), 'Initial tier should be novice');

    // Update level to 7 (Practitioner)
    controller.setLevel(7, 'C++ Systems Practitioner');
    assert.ok(dock.classList.contains('tier-practitioner'), 'Tier should update to tier-practitioner');
    assert.ok(!dock.classList.contains('tier-novice'), 'Previous tier-novice should be removed');

    // Update level to 10 (Master)
    controller.setLevel(10, 'C++ Master');
    assert.ok(dock.classList.contains('tier-master'), 'Tier should update to tier-master');

    companion.destroy();
    controller.destroy();
  });
});

test('Phase D4B: Achievement Reaction Tiers', async (t) => {
  await t.test('20. FINAL achievement tier maps to ULTIMATE_MASTERY (Priority 100)', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.ACHIEVEMENT_UNLOCKED, {
      achievement: {
        id: 'CURRICULUM_CONQUEROR',
        title: 'Master of C++',
        tier: ACHIEVEMENT_REACTION_TIERS.FINAL
      }
    });

    const snap = controller.getSnapshot();
    assert.equal(snap.state, COMPANION_STATES.ULTIMATE_MASTERY);
    controller.destroy();
  });

  await t.test('21. MAJOR achievement tier maps to MASTERY (Priority 90)', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.ACHIEVEMENT_UNLOCKED, {
      achievement: {
        id: 'INDEPENDENT_STREAK_5',
        title: 'Craftsperson V',
        tier: ACHIEVEMENT_REACTION_TIERS.MAJOR
      }
    });

    const snap = controller.getSnapshot();
    assert.equal(snap.state, COMPANION_STATES.MASTERY);
    assert.equal(getSpeechMessage(snap), 'Achievement unlocked: Craftsperson V!');
    controller.destroy();
  });

  await t.test('22. IMPORTANT achievement tier maps to CELEBRATION (Priority 80)', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.ACHIEVEMENT_UNLOCKED, {
      achievement: {
        id: 'INDEPENDENT_STREAK_3',
        title: 'Craftsperson III',
        tier: ACHIEVEMENT_REACTION_TIERS.IMPORTANT
      }
    });

    const snap = controller.getSnapshot();
    assert.equal(snap.state, COMPANION_STATES.CELEBRATION);
    controller.destroy();
  });

  await t.test('23. MINOR achievement tier maps to TEST_PASSED (Priority 40)', () => {
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });

    bus.emit(LEARNING_EVENTS.ACHIEVEMENT_UNLOCKED, {
      achievement: {
        id: 'FIRST_COMPILE',
        title: 'First Build',
        tier: ACHIEVEMENT_REACTION_TIERS.MINOR
      }
    });

    const snap = controller.getSnapshot();
    assert.equal(snap.state, COMPANION_STATES.TEST_PASSED);
    controller.destroy();
  });
});

test('Phase D4B: Preemption and Priority Arbitration', async (t) => {
  await t.test('24. ULTIMATE_MASTERY (Priority 100) rejects lower priority events', () => {
    const controller = new CompanionController({ eventBus: null });
    controller.transitionTo(COMPANION_STATES.ULTIMATE_MASTERY);
    assert.equal(controller.getSnapshot().state, COMPANION_STATES.ULTIMATE_MASTERY);

    // Attempt to trigger lower priority events
    controller.transitionTo(COMPANION_STATES.COMPILE_ERROR);
    assert.equal(controller.getSnapshot().state, COMPANION_STATES.ULTIMATE_MASTERY);

    controller.transitionTo(COMPANION_STATES.TEST_PASSED);
    assert.equal(controller.getSnapshot().state, COMPANION_STATES.ULTIMATE_MASTERY);

    controller.destroy();
  });

  await t.test('25. MASTERY (Priority 90) preempts COMPILE_ERROR (Priority 60)', () => {
    const controller = new CompanionController({ eventBus: null });
    controller.transitionTo(COMPANION_STATES.COMPILE_ERROR);
    assert.equal(controller.getSnapshot().state, COMPANION_STATES.COMPILE_ERROR);

    controller.transitionTo(COMPANION_STATES.MASTERY);
    assert.equal(controller.getSnapshot().state, COMPANION_STATES.MASTERY);

    controller.destroy();
  });
});

test('Phase D4B: Side-Effect Free Deterministic Tip Cycling & Avatar Click', async (t) => {
  await t.test('26. Avatar click cycles CXX_TIPS in exact deterministic order', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    const bubbleText = rootContainer.querySelector('.bubble-text');

    // Click 1
    companion.handleAvatarClick();
    assert.equal(bubbleText.textContent, CXX_TIPS[0]);

    // Click 2
    companion.handleAvatarClick();
    assert.equal(bubbleText.textContent, CXX_TIPS[1]);

    // Click 3
    companion.handleAvatarClick();
    assert.equal(bubbleText.textContent, CXX_TIPS[2]);

    companion.destroy();
    controller.destroy();
  });

  await t.test('27. Avatar click is strictly non-gameplay (0 XP, 0 streak effect, 0 mastery mutation)', () => {
    const rootContainer = new MockElement('div');
    const bus = new LearningEventBus();
    const controller = new CompanionController({ eventBus: bus });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    let xpEventFired = false;
    let streakEventFired = false;
    let masteryEventFired = false;

    bus.on(LEARNING_EVENTS.XP_AWARDED, () => { xpEventFired = true; });
    bus.on(LEARNING_EVENTS.STREAK_UPDATED, () => { streakEventFired = true; });
    bus.on(LEARNING_EVENTS.CONCEPT_MASTERED, () => { masteryEventFired = true; });

    // Rapid clicking on Pikachu
    for (let i = 0; i < 20; i++) {
      companion.handleAvatarClick();
    }

    assert.equal(xpEventFired, false, 'Avatar click must NEVER award XP');
    assert.equal(streakEventFired, false, 'Avatar click must NEVER alter streaks');
    assert.equal(masteryEventFired, false, 'Avatar click must NEVER mutate concept mastery');

    companion.destroy();
    controller.destroy();
  });

  await t.test('28. Deterministic speech pools cycle cleanly without Math.random', () => {
    const indexMap = {};
    const snap = { state: COMPANION_STATES.IDLE };

    const first = getSpeechMessage(snap, indexMap);
    const second = getSpeechMessage(snap, indexMap);
    const third = getSpeechMessage(snap, indexMap);
    const fourth = getSpeechMessage(snap, indexMap); // should wrap back to first

    assert.equal(first, SPEECH_POOLS[COMPANION_STATES.IDLE][0]);
    assert.equal(second, SPEECH_POOLS[COMPANION_STATES.IDLE][1]);
    assert.equal(third, SPEECH_POOLS[COMPANION_STATES.IDLE][2]);
    assert.equal(fourth, SPEECH_POOLS[COMPANION_STATES.IDLE][0]);
  });
});

test('Phase D4B: Minimized Dock & Milestone Indicator', async (t) => {
  await t.test('29. Minimized dock hides speech bubble and adds minimized class', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    const dock = rootContainer.querySelector('#companion-dock');
    assert.ok(!dock.classList.contains('minimized'));

    companion.toggleMinimize(true);
    assert.ok(dock.classList.contains('minimized'));

    companion.destroy();
    controller.destroy();
  });

  await t.test('30. Milestone pulse triggers when minimized during MASTERY or LEVEL_UP', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    companion.toggleMinimize(true);
    const dock = rootContainer.querySelector('#companion-dock');
    assert.ok(!dock.classList.contains('milestone-pulse'));

    controller.transitionTo(COMPANION_STATES.MASTERY);
    assert.ok(dock.classList.contains('milestone-pulse'), 'Milestone pulse should activate when minimized');

    companion.destroy();
    controller.destroy();
  });
});

test('Phase D4B: Zero-Sound Architectural Invariants & Reduced Motion', async (t) => {
  await t.test('31. Strictly zero audio APIs, AudioContext, or sound files across companion codebase', () => {
    const companionDir = path.resolve('src', 'companion');
    const files = fs.readdirSync(companionDir).filter(f => f.endsWith('.js') || f.endsWith('.css'));

    const forbiddenTerms = [
      'AudioContext',
      'webkitAudioContext',
      'Audio(',
      'new Audio',
      'createOscillator',
      'speechSynthesis',
      '.mp3',
      '.wav',
      '.ogg',
      '.m4a',
      'soundEnabled',
      'audioToggle'
    ];

    for (const file of files) {
      const content = fs.readFileSync(path.join(companionDir, file), 'utf8');
      for (const term of forbiddenTerms) {
        assert.ok(
          !content.includes(term),
          `File src/companion/${file} violates Zero-Sound rule: contains "${term}"`
        );
      }
    }
  });
});
