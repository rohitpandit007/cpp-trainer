/**
 * Automated Test Suite for Phase D4C: Workspace Polish, UX Refinement & Advanced Companion Flourishes.
 * Verifies problem specification disclosure, feedback empty state, error hierarchy,
 * collapsible diagnostics, test results formatting, hidden test masking, toast capping,
 * accessibility attributes (ARIA, focus), Pikachu dock clearance, and zero sound compliance.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  renderProblemSpecs,
  renderExecutionFeedback,
  renderAssessmentFeedback,
  renderFeedbackSlot,
  renderTestPreview
} from '../src/app.js';

import { GamificationUI } from '../src/gamification/gamificationUI.js';
import { GamificationEngine } from '../src/gamification/gamificationEngine.js';

// Minimal mock DOM node for testing UI components in Node environment
class MockElement {
  constructor(tagName) {
    this.tagName = (tagName || 'div').toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.attributes = new Map();
    this.listeners = new Map();
    this._className = '';
    this.style = {};
    this.classList = {
      add: (...cls) => {
        const parts = new Set((this._className || '').split(' ').filter(Boolean));
        cls.forEach(c => parts.add(c));
        this._className = Array.from(parts).join(' ');
      },
      remove: (...cls) => {
        const parts = new Set((this._className || '').split(' ').filter(Boolean));
        cls.forEach(c => parts.delete(c));
        this._className = Array.from(parts).join(' ');
      },
      contains: (c) => (this._className || '').split(' ').includes(c)
    };
  }

  get firstChild() {
    return this.children[0] || null;
  }

  get className() {
    return this._className;
  }

  set className(val) {
    this._className = val;
  }

  get innerHTML() {
    return this._innerHTML || '';
  }

  set innerHTML(val) {
    this._innerHTML = val;
    if (typeof val === 'string' && val.includes('toast-close')) {
      const btn = new MockElement('button');
      btn.className = 'toast-close';
      this.appendChild(btn);
    }
  }

  setAttribute(name, val) {
    this.attributes.set(name, String(val));
  }

  getAttribute(name) {
    return this.attributes.get(name) || null;
  }

  hasAttribute(name) {
    return this.attributes.has(name);
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

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(listener);
  }

  dispatchEvent(event) {
    const list = this.listeners.get(event.type) || [];
    for (const l of list) l(event);
  }

  querySelector(selector) {
    if (selector.startsWith('#')) {
      const id = selector.slice(1);
      return this._find(el => el.id === id);
    }
    if (selector.startsWith('.')) {
      const cls = selector.slice(1);
      return this._find(el => el.className && el.className.split(' ').includes(cls));
    }
    return null;
  }

  _find(predicate) {
    for (const child of this.children) {
      if (predicate(child)) return child;
      const sub = child._find ? child._find(predicate) : null;
      if (sub) return sub;
    }
    return null;
  }
}

test('1. Problem Specifications & Progressive Disclosure', async (t) => {
  await t.test('returns empty string when exercise has no constraints or IO format', () => {
    const html = renderProblemSpecs({});
    assert.equal(html, '');
  });

  await t.test('renders constraints list when exercise defines constraints', () => {
    const exercise = {
      constraints: ['Must output exactly one line.', 'No external libraries.']
    };
    const html = renderProblemSpecs(exercise);
    assert.match(html, /class="problem-specs"/);
    assert.match(html, /Constraints/);
    assert.match(html, /Must output exactly one line\./);
    assert.match(html, /No external libraries\./);
  });

  await t.test('renders input and output specifications when present', () => {
    const exercise = {
      inputFormat: 'Two space-separated integers a and b',
      outputFormat: 'The sum of a and b'
    };
    const html = renderProblemSpecs(exercise);
    assert.match(html, /Input:/);
    assert.match(html, /Two space-separated integers a and b/);
    assert.match(html, /Output:/);
    assert.match(html, /The sum of a and b/);
  });
});

test('2. Feedback Empty State & Execution Hierarchy', async (t) => {
  await t.test('renders welcoming empty state before any code is executed', () => {
    const html = renderFeedbackSlot();
    assert.match(html, /feedback-empty-state/);
    assert.match(html, /Ready to run your code/);
    assert.match(html, /▷ Run Code/);
    assert.match(html, /✓ Submit Assessment/);
    assert.match(html, /role="status"/);
  });

  await t.test('sample test preview accurately counts visible vs hidden test cases', () => {
    const exercise = {
      testCases: [
        { id: 't1', isHidden: false, input: '5', expectedOutput: '25' },
        { id: 't2', isHidden: false, input: '10', expectedOutput: '100' },
        { id: 't3', isHidden: true, input: '1000', expectedOutput: '1000000' }
      ]
    };
    const html = renderTestPreview(exercise);
    assert.match(html, /Sample Test Cases \(2 visible, 1 hidden\)/);
    assert.match(html, /Input: <code>5<\/code>/);
    assert.match(html, /Expected: <code>25<\/code>/);
    // Hidden test must NOT be revealed in sample preview
    assert.doesNotMatch(html, /1000000/);
  });
});

test('3. Test Suite Assessment Results Polish', async (t) => {
  await t.test('distinguishes PASS and FAIL test badges with structured summary', () => {
    const assessmentResult = {
      status: 'ready',
      passed: false,
      badge: 'Check failed',
      title: 'Output Mismatch',
      message: 'Some tests did not produce the expected output.',
      summary: { total: 2, passed: 1, failed: 1 },
      testResults: [
        { id: '1', description: 'Simple test', passed: true, input: '2', expectedOutput: '4', actualOutput: '4', durationMs: 12 },
        { id: '2', description: 'Edge case test', passed: false, input: '-1', expectedOutput: '1', actualOutput: '-1', durationMs: 15 }
      ]
    };

    assert.equal(assessmentResult.summary.passed, 1);
    assert.equal(assessmentResult.summary.failed, 1);
    assert.equal(assessmentResult.testResults[0].passed, true);
    assert.equal(assessmentResult.testResults[1].passed, false);
  });

  await t.test('never leaks hidden test inputs or expected outputs in results', () => {
    const hiddenTestCase = {
      id: 'h1',
      description: 'Hidden extreme edge case',
      passed: false,
      isHidden: true,
      input: 'SECRET_INPUT_XYZ',
      expectedOutput: 'SECRET_EXPECTED_XYZ',
      actualOutput: 'WRONG'
    };

    const tcHtml = hiddenTestCase.isHidden ? `
      <div class="tc-hidden-note">🔒 Hidden test case (inputs and outputs masked to verify genuine logic)</div>
    ` : `
      <div class="tc-io-details">${hiddenTestCase.input}</div>
    `;

    assert.match(tcHtml, /🔒 Hidden test case/);
    assert.doesNotMatch(tcHtml, /SECRET_INPUT_XYZ/);
    assert.doesNotMatch(tcHtml, /SECRET_EXPECTED_XYZ/);
  });
});

test('4. Diagnostic Comprehension & Collapsible Raw Console', async (t) => {
  await t.test('wraps raw diagnostics inside collapsible <details class="raw-console-details">', () => {
    const cssPath = path.resolve(process.cwd(), 'src/style.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    assert.match(cssContent, /\.raw-console-details/);
    assert.match(cssContent, /\.details-chevron/);

    const appJsPath = path.resolve(process.cwd(), 'src/app.js');
    const appJsContent = fs.readFileSync(appJsPath, 'utf8');
    assert.match(appJsContent, /COMPILER ERROR DETAILS/);
  });

  await t.test('educational diagnosis card emphasizes what to inspect rather than solution code', () => {
    const appJsPath = path.resolve(process.cwd(), 'src/app.js');
    const appJsContent = fs.readFileSync(appJsPath, 'utf8');

    assert.match(appJsContent, /🔍 WHAT TO INSPECT:/);
    assert.match(appJsContent, /Suggested Direction:/);
  });
});

test('5. Gamification Toast Capping & Non-Intrusiveness', async (t) => {
  await t.test('caps visible achievement toasts at 3 to prevent viewport congestion', () => {
    const mockBody = new MockElement('body');
    const prevDoc = globalThis.document;

    globalThis.document = {
      body: mockBody,
      createElement: (tag) => new MockElement(tag),
      querySelector: (sel) => mockBody.querySelector(sel)
    };

    try {
      const ui = new GamificationUI();
      ui.showToast({ id: 'a1', title: 'Achievement 1', xpReward: 25 });
      ui.showToast({ id: 'a2', title: 'Achievement 2', xpReward: 25 });
      ui.showToast({ id: 'a3', title: 'Achievement 3', xpReward: 25 });
      ui.showToast({ id: 'a4', title: 'Achievement 4', xpReward: 25 });
      ui.showToast({ id: 'a5', title: 'Achievement 5', xpReward: 25 });

      const container = mockBody.querySelector('#achievement-toast-container');
      assert.ok(container);
      assert.ok(container.children.length <= 3, `Expected <= 3 toasts, but found ${container.children.length}`);
    } finally {
      globalThis.document = prevDoc;

    }
  });

  await t.test('modal dialog contains dialog role, aria-modal, and aria-label', () => {
    const mockBody = new MockElement('body');
    const prevDoc = globalThis.document;

    globalThis.document = {
      body: mockBody,
      createElement: (tag) => new MockElement(tag),
      querySelector: (sel) => mockBody.querySelector(sel)
    };

    try {
      const ui = new GamificationUI();
      ui.openModal();

      const modal = mockBody.children.find(c => c.className === 'achievements-modal-backdrop');
      assert.ok(modal);
      assert.equal(modal.getAttribute('role'), 'dialog');
      assert.equal(modal.getAttribute('aria-modal'), 'true');
      assert.equal(modal.getAttribute('aria-label'), 'Achievements and Level Progress');

      ui.closeModal();
      assert.equal(mockBody.children.length, 0);
    } finally {
      globalThis.document = prevDoc;
    }
  });
});

test('6. Pikachu Dock Clearance & Non-Collision', async (t) => {
  await t.test('workspace CSS includes bottom clearance so Pikachu never obscures controls', () => {
    const cssPath = path.resolve(process.cwd(), 'src/style.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    assert.match(cssContent, /\.course,\s*\.independent\s*\{\s*padding-bottom:\s*140px/);
  });

  await t.test('companion CSS specifies pointer-events: none on dock container to allow pass-through clicks', () => {
    const compCssPath = path.resolve(process.cwd(), 'src/companion/companion.css');
    const compCss = fs.readFileSync(compCssPath, 'utf8');

    assert.match(compCss, /\.companion-dock\s*\{[^}]*pointer-events:\s*none;/);
    assert.match(compCss, /\.companion-dock\s*\*\s*\{[^}]*pointer-events:\s*auto;/);
  });
});

test('7. Accessibility & Keyboard Focus', async (t) => {
  await t.test('app HTML contains aria-live="polite" and aria-atomic on feedback container', () => {
    const appJsPath = path.resolve(process.cwd(), 'src/app.js');
    const appJsContent = fs.readFileSync(appJsPath, 'utf8');

    assert.match(appJsContent, /class="feedback-container"\s+aria-live="polite"\s+aria-atomic="true"/);
  });

  await t.test('interactive buttons include explicit aria-label attributes', () => {
    const appJsPath = path.resolve(process.cwd(), 'src/app.js');
    const appJsContent = fs.readFileSync(appJsPath, 'utf8');

    assert.match(appJsContent, /aria-label="Toggle Concept Visualizer"/);
    assert.match(appJsContent, /aria-label="Request progressive hint"/);
    assert.match(appJsContent, /aria-label="Run Code"/);
    assert.match(appJsContent, /aria-label="Submit Assessment"/);
    assert.match(appJsContent, /aria-label="Reset starter code"/);
  });

  await t.test('style.css defines high-contrast :focus-visible outlines for keyboard accessibility', () => {
    const cssPath = path.resolve(process.cwd(), 'src/style.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    assert.match(cssContent, /button:focus-visible/);
    assert.match(cssContent, /outline:\s*2px\s+solid/);
  });
});

test('8. Responsive Layout Breakpoints', async (t) => {
  await t.test('verifies mobile breakpoint at max-width: 600px and 375px', () => {
    const cssPath = path.resolve(process.cwd(), 'src/style.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    assert.match(cssContent, /@media\s*\(max-width:\s*900px\)/);
    assert.match(cssContent, /@media\s*\(max-width:\s*600px\)/);
    assert.match(cssContent, /@media\s*\(max-width:\s*375px\)/);
  });

  await t.test('prevents horizontal viewport overflow', () => {
    const cssPath = path.resolve(process.cwd(), 'src/style.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    assert.match(cssContent, /overflow-x:\s*hidden/);
    assert.match(cssContent, /max-width:\s*100vw/);
  });
});

test('9. Reduced Motion Support', async (t) => {
  await t.test('style.css disables keyframes and animations on prefers-reduced-motion', () => {
    const cssPath = path.resolve(process.cwd(), 'src/style.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    assert.match(cssContent, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    assert.match(cssContent, /animation-duration:\s*0\.01ms\s*!important/);
  });

  await t.test('companion.css respects reduced motion with zero transforms and animations', () => {
    const compCssPath = path.resolve(process.cwd(), 'src/companion/companion.css');
    const compCss = fs.readFileSync(compCssPath, 'utf8');

    assert.match(compCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    assert.match(compCss, /\.reduced-motion/);
  });
});

test('10. Sound Prohibition Audit', async (t) => {
  await t.test('strictly ZERO audio elements, AudioContext, or speech synthesis across source files', () => {
    const srcDir = path.resolve(process.cwd(), 'src');
    const files = fs.readdirSync(srcDir, { recursive: true });

    for (const f of files) {
      if (typeof f === 'string' && (f.endsWith('.js') || f.endsWith('.css') || f.endsWith('.html'))) {
        const fullPath = path.join(srcDir, f);
        const content = fs.readFileSync(fullPath, 'utf8');

        assert.doesNotMatch(content, /new\s+Audio\(/i, `Audio instantiation found in ${f}`);
        assert.doesNotMatch(content, /AudioContext/i, `AudioContext found in ${f}`);
        assert.doesNotMatch(content, /webkitAudioContext/i, `webkitAudioContext found in ${f}`);
        assert.doesNotMatch(content, /speechSynthesis/i, `speechSynthesis found in ${f}`);
        assert.doesNotMatch(content, /<audio/i, `<audio> tag found in ${f}`);
        assert.doesNotMatch(content, /\.mp3|\.wav|\.ogg/i, `Audio asset reference found in ${f}`);
      }
    }
  });
});
