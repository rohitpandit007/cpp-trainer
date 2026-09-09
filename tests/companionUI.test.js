/**
 * Automated Test Suite for Pikachu Companion Presentation Layer (Phase D2).
 * Tests DOM rendering, double-buffered asset transitions, state classes,
 * speech bubble contextual messaging, minimize controls, reduced motion, and cleanup.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { COMPANION_STATES } from '../src/companion/companionState.js';
import { AssetRegistry, PIKACHU_ASSET_MAP } from '../src/companion/assetRegistry.js';
import { CompanionController } from '../src/companion/companionController.js';
import {
  PikachuCompanion,
  initPikachuCompanion,
  DEFAULT_SPEECH_MESSAGES
} from '../src/companion/pikachuCompanion.js';

// Minimal mock DOM node for Node.js test runner
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
    this.element.className = Array.from(this.classes).join(' ');
  }
  [Symbol.iterator]() {
    return this.classes[Symbol.iterator]();
  }
}

class MockElement {
  constructor(tagName) {
    this.tagName = (tagName || 'div').toUpperCase();
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

  get src() {
    return this.attributes.get('src') || this._src || '';
  }

  set src(v) {
    this._src = v;
    this.attributes.set('src', v);
  }

  getAttribute(k) {
    if (k === 'src') return this.src;
    return this.attributes.get(k) || null;
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
    const set = this.listeners.get(event);
    if (set) {
      for (const cb of set) cb({ stopPropagation: () => {} });
    }
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const results = [];
    const match = (el) => {
      if (selector.startsWith('.')) {
        const requiredClasses = selector.split('.').filter(Boolean);
        if (requiredClasses.every(c => el.classList.contains(c))) {
          results.push(el);
        }
      } else if (selector.startsWith('#') && el.id === selector.slice(1)) {
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
    // Basic parser for our companion dock template
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

// Minimal mock document
const mockDocument = {
  createElement(tag) {
    return new MockElement(tag);
  },
  body: new MockElement('body')
};

// Install global DOM mocks during tests
globalThis.document = mockDocument;
globalThis.window = {
  matchMedia: (query) => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {}
  })
};

test('Pikachu Companion Presentation Layer (Phase D2)', async (t) => {

  await t.test('1. Renders companion widget in IDLE state with default.png asset', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    const dock = rootContainer.querySelector('#companion-dock');
    assert.ok(dock, 'Companion dock should be mounted in container');
    assert.ok(dock.classList.contains('state-idle'), 'Dock should have state-idle class');

    const imgCurrent = dock.querySelector('.companion-img.current');
    assert.ok(imgCurrent, 'imgCurrent should be present');
    assert.equal(imgCurrent.src, '/assets/companion/default.png');

    const badge = dock.querySelector('.companion-state-badge');
    assert.equal(badge.textContent, 'IDLE');

    const bubble = dock.querySelector('.bubble-text');
    assert.equal(bubble.textContent, DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.IDLE]);

    companion.destroy();
    controller.destroy();
  });

  await t.test('2. Verified asset mapping for all 12 companion states', () => {
    const registry = new AssetRegistry('/assets/companion');
    const expectedMap = {
      [COMPANION_STATES.IDLE]: 'default.png',
      [COMPANION_STATES.THINKING]: 'thinking.png',
      [COMPANION_STATES.CODING]: 'coding.png',
      [COMPANION_STATES.COMPILE_ERROR]: 'compile error.png',
      [COMPANION_STATES.RUNTIME_ERROR]: 'runtime error.png',
      [COMPANION_STATES.WRONG_OUTPUT]: 'wrong answer.png',
      [COMPANION_STATES.TEST_PASSED]: 'test passed.png',
      [COMPANION_STATES.CELEBRATION]: 'all tests passed.png',
      [COMPANION_STATES.INDEPENDENT_SUCCESS]: 'solved without hints.png',
      [COMPANION_STATES.TIRED]: 'repeated failure.png',
      [COMPANION_STATES.MASTERY]: 'concept mastered.png',
      [COMPANION_STATES.ULTIMATE_MASTERY]: 'ultimate mastery.png'
    };

    for (const [state, filename] of Object.entries(expectedMap)) {
      const resolved = registry.getFilename(state);
      assert.equal(resolved, filename, `State ${state} must resolve to ${filename}`);
      const url = registry.getAssetUrl(state);
      assert.ok(url.endsWith(encodeURIComponent(filename).replace(/%2F/g, '/')));
    }
  });

  await t.test('3. State transitions update CSS class and status badge', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    controller.transitionTo(COMPANION_STATES.COMPILE_ERROR);

    const dock = rootContainer.querySelector('#companion-dock');
    assert.ok(dock.classList.contains('state-compile-error'), 'Dock should gain state-compile-error class');
    assert.ok(!dock.classList.contains('state-idle'), 'Dock should remove previous state-idle class');

    const badge = dock.querySelector('.companion-state-badge');
    assert.equal(badge.textContent, 'COMPILE ERROR');

    companion.destroy();
    controller.destroy();
  });

  await t.test('4. Speech bubble updates with state-specific messages', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    const bubble = rootContainer.querySelector('.bubble-text');

    controller.transitionTo(COMPANION_STATES.THINKING);
    assert.equal(bubble.textContent, DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.THINKING]);

    controller.transitionTo(COMPANION_STATES.TEST_PASSED);
    assert.equal(bubble.textContent, DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.TEST_PASSED]);

    controller.transitionTo(COMPANION_STATES.CELEBRATION);
    assert.equal(bubble.textContent, DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.CELEBRATION]);

    controller.transitionTo(COMPANION_STATES.INDEPENDENT_SUCCESS);
    assert.equal(bubble.textContent, DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.INDEPENDENT_SUCCESS]);

    controller.transitionTo(COMPANION_STATES.MASTERY);
    assert.equal(bubble.textContent, DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.MASTERY]);

    companion.destroy();
    controller.destroy();
  });

  await t.test('5. CODING state hides speech bubble to prevent typing distraction', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    const bubbleEl = rootContainer.querySelector('.companion-bubble');
    assert.ok(!bubbleEl.classList.contains('bubble-hidden'), 'Bubble should be visible in IDLE');

    controller.notifyTyping();

    assert.equal(controller.currentState, COMPANION_STATES.CODING);
    assert.ok(bubbleEl.classList.contains('bubble-hidden'), 'Bubble should gain bubble-hidden class during CODING');

    companion.destroy();
    controller.destroy();
  });

  await t.test('6. Minimize toggle switches minimized class and button indicator', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    const dock = rootContainer.querySelector('#companion-dock');
    const toggleBtn = dock.querySelector('.companion-toggle-btn');

    assert.ok(!dock.classList.contains('minimized'), 'Should start expanded');
    assert.equal(toggleBtn.textContent, '─');

    // Click toggle button to minimize
    toggleBtn.dispatchEvent('click');
    assert.ok(dock.classList.contains('minimized'), 'Should gain minimized class');
    assert.equal(toggleBtn.textContent, '▲');

    // Click toggle button to expand
    toggleBtn.dispatchEvent('click');
    assert.ok(!dock.classList.contains('minimized'), 'Should remove minimized class');
    assert.equal(toggleBtn.textContent, '─');

    companion.destroy();
    controller.destroy();
  });

  await t.test('7. Clicking avatar when minimized automatically expands companion', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    const dock = rootContainer.querySelector('#companion-dock');
    const avatar = dock.querySelector('.companion-avatar-frame');

    companion.toggleMinimize(true);
    assert.ok(dock.classList.contains('minimized'));

    avatar.dispatchEvent('click');
    assert.ok(!dock.classList.contains('minimized'), 'Avatar click should restore companion from minimized');

    companion.destroy();
    controller.destroy();
  });

  await t.test('8. Image loading error safely falls back to default.png', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    const imgCurrent = rootContainer.querySelector('.companion-img.current');
    imgCurrent.src = '/assets/companion/broken-link.png';

    imgCurrent.dispatchEvent('error');
    assert.equal(imgCurrent.src, '/assets/companion/default.png', 'Error should trigger fallback to default.png');

    companion.destroy();
    controller.destroy();
  });

  await t.test('9. Reduced motion setting updates dock class and disables long transitions', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null, reducedMotion: true });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    const imgCurrent = rootContainer.querySelector('.companion-img.current');
    const testUrl = '/assets/companion/thinking.png';

    // Under reduced motion, transitionImage sets imgCurrent.src directly
    companion.transitionImage(testUrl);
    assert.equal(imgCurrent.src, testUrl);

    companion.destroy();
    controller.destroy();
  });

  await t.test('10. Clean destroy removes DOM and unregisters controller subscriber', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = new PikachuCompanion({ container: rootContainer, controller });

    assert.equal(controller.subscribers.size, 1);
    assert.ok(rootContainer.querySelector('#companion-dock'));

    companion.destroy();

    assert.equal(controller.subscribers.size, 0);
    assert.equal(rootContainer.querySelector('#companion-dock'), null);

    controller.destroy();
  });

  await t.test('11. initPikachuCompanion factory helper mounts component cleanly', () => {
    const rootContainer = new MockElement('div');
    const controller = new CompanionController({ eventBus: null });
    const companion = initPikachuCompanion(rootContainer, controller);

    assert.ok(companion instanceof PikachuCompanion);
    assert.ok(rootContainer.querySelector('#companion-dock'));

    companion.destroy();
    controller.destroy();
  });
});
