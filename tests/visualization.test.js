/**
 * Automated Test Suite for Phase D3 Interactive C++ Concept Visualization.
 * Tests ConceptAnalyzer, TimelineModel, VisualPrimitives, and ConceptVisualizer.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  analyzeCppSource,
  CONCEPT_FAMILIES,
  CONCEPT_DEMOS
} from '../src/visualization/conceptAnalyzer.js';

import { TimelineModel } from '../src/visualization/timelineModel.js';

import {
  renderVariables,
  renderCallStack,
  renderHeap,
  renderClasses,
  renderObjects,
  renderRelationships,
  renderPlayerControls,
  renderOutput
} from '../src/visualization/visualPrimitives.js';

import { ConceptVisualizer } from '../src/visualization/conceptVisualizer.js';
import { eventBus } from '../src/learningEngine.js';
import { companionController } from '../src/companion/companionController.js';

// ==========================================
// 1. CONCEPT ANALYZER TESTS
// ==========================================

test('1. Concept Analyzer: Variables, Types, and Expressions', async (t) => {
  await t.test('detects primitive variables and values', () => {
    const code = `
      int main() {
        int count = 10;
        double price = 19.99;
        string name = "CodeBloom";
        bool active = true;
        return 0;
      }
    `;
    const res = analyzeCppSource(code);
    assert.equal(res.supported, true);
    assert.equal(res.metadata.variables.length, 4);
    assert.equal(res.metadata.variables[0].name, 'count');
    assert.equal(res.metadata.variables[0].type, 'int');
    assert.equal(res.metadata.variables[0].initialValue, '10');
    assert.equal(res.metadata.variables[1].name, 'price');
    assert.equal(res.metadata.variables[1].type, 'double');
    assert.equal(res.metadata.variables[2].name, 'name');
    assert.equal(res.metadata.variables[2].type, 'string');
    assert.equal(res.metadata.variables[3].name, 'active');
    assert.equal(res.metadata.variables[3].type, 'bool');
  });

  await t.test('detects assignments and update expressions', () => {
    const code = `
      int main() {
        int x = 5;
        x = 8;
        return 0;
      }
    `;
    const res = analyzeCppSource(code);
    assert.equal(res.supported, true);
    assert.equal(res.metadata.variables[0].assignments.length, 1);
    assert.equal(res.metadata.variables[0].assignments[0].value, '8');
  });
});

test('2. Concept Analyzer: Functions, Parameters, and Return Values', async (t) => {
  await t.test('detects function signatures, parameters, and calls', () => {
    const code = `
      int add(int a, int b) {
        return a + b;
      }
      int main() {
        int result = add(3, 4);
        return 0;
      }
    `;
    const res = analyzeCppSource(code);
    assert.equal(res.supported, true);
    assert.equal(res.primaryConcept, CONCEPT_FAMILIES.FUNCTIONS);
    assert.equal(res.metadata.functions.length, 1);

    const addFn = res.metadata.functions.find(f => f.name === 'add');
    assert.ok(addFn);
    assert.equal(addFn.returnType, 'int');
    assert.equal(addFn.params.length, 2);
    assert.equal(addFn.params[0].name, 'a');
    assert.equal(addFn.params[0].type, 'int');
    assert.equal(addFn.params[1].name, 'b');
  });
});

test('3. Concept Analyzer: Pointers, References, and Heap', async (t) => {
  await t.test('detects pointer declaration and address-of referencing', () => {
    const code = `
      int main() {
        int value = 42;
        int* ptr = &value;
        return 0;
      }
    `;
    const res = analyzeCppSource(code);
    assert.equal(res.supported, true);
    assert.equal(res.primaryConcept, CONCEPT_FAMILIES.POINTERS);
    assert.equal(res.metadata.pointers.length, 1);
    assert.equal(res.metadata.pointers[0].name, 'ptr');
    assert.equal(res.metadata.pointers[0].targetVar, 'value');
  });

  await t.test('detects references as aliases', () => {
    const code = `
      int main() {
        int score = 100;
        int& ref = score;
        return 0;
      }
    `;
    const res = analyzeCppSource(code);
    assert.equal(res.supported, true);
    assert.equal(res.primaryConcept, CONCEPT_FAMILIES.REFERENCES);
    assert.equal(res.metadata.references.length, 1);
    assert.equal(res.metadata.references[0].name, 'ref');
    assert.equal(res.metadata.references[0].targetVar, 'score');
  });

  await t.test('detects heap dynamic allocation and delete', () => {
    const code = `
      int main() {
        int* p = new int(100);
        delete p;
        return 0;
      }
    `;
    const res = analyzeCppSource(code);
    assert.equal(res.supported, true);
    assert.equal(res.primaryConcept, CONCEPT_FAMILIES.DYNAMIC_MEMORY);
    assert.equal(res.metadata.pointers.length, 1);
    assert.equal(res.metadata.pointers[0].isNew, true);
  });
});

test('4. Concept Analyzer: Classes, Objects, Constructors, and Destructors', async (t) => {
  await t.test('detects class definition with members and methods', () => {
    const code = `
      class Hero {
      public:
        string name;
        int health;
      };
      int main() {
        Hero h;
        return 0;
      }
    `;
    const res = analyzeCppSource(code);
    assert.equal(res.supported, true);
    assert.equal(res.metadata.classes.length, 1);
    const hero = res.metadata.classes[0];
    assert.equal(hero.name, 'Hero');
    assert.equal(hero.members.length, 2);
  });

  await t.test('detects constructors with member initializer lists and destructors', () => {
    const code = `
      class BankAccount {
      public:
        string owner;
        double balance;
        BankAccount(string o, double b) : owner(o), balance(b) {}
        ~BankAccount() {}
      };
      int main() {
        return 0;
      }
    `;
    const res = analyzeCppSource(code);
    assert.equal(res.supported, true);
    assert.equal(res.primaryConcept, CONCEPT_FAMILIES.DESTRUCTORS);
    const cls = res.metadata.classes[0];
    assert.equal(cls.hasConstructor, true);
    assert.ok(res.detectedConcepts.includes(CONCEPT_FAMILIES.CONSTRUCTORS));
    assert.ok(res.detectedConcepts.includes(CONCEPT_FAMILIES.DESTRUCTORS));
  });
});

test('5. Concept Analyzer: Inheritance and Polymorphism', async (t) => {
  await t.test('detects inheritance and base class chaining', () => {
    const code = `
      class Character {
      public:
        int health;
      };
      class Warrior : public Character {
      public:
        int swordPower;
      };
      int main() {
        return 0;
      }
    `;
    const res = analyzeCppSource(code);
    assert.equal(res.supported, true);
    assert.equal(res.primaryConcept, CONCEPT_FAMILIES.INHERITANCE);
    assert.ok(res.metadata.inheritance);
    assert.equal(res.metadata.inheritance.derived, 'Warrior');
    assert.equal(res.metadata.inheritance.base, 'Character');
  });

  await t.test('detects virtual functions, overrides, and base pointer dispatch', () => {
    const code = `
      class Animal {
      public:
        virtual void speak() {}
      };
      class Dog : public Animal {
      public:
        void speak() override {}
      };
      int main() {
        Animal* pet = new Dog();
        pet->speak();
        delete pet;
        return 0;
      }
    `;
    const res = analyzeCppSource(code);
    assert.equal(res.supported, true);
    assert.equal(res.primaryConcept, CONCEPT_FAMILIES.POLYMORPHISM);
    assert.ok(res.metadata.polymorphism);
    assert.equal(res.metadata.polymorphism.baseClass, 'Animal');
    assert.equal(res.metadata.polymorphism.derivedClass, 'Dog');
    assert.equal(res.metadata.polymorphism.dispatchedMethod, 'speak');
  });

  await t.test('detects abstract classes with pure virtual methods', () => {
    const code = `
      class Shape {
      public:
        virtual void draw() = 0;
      };
      class Circle : public Shape {
      public:
        void draw() override {}
      };
      int main() {
        return 0;
      }
    `;
    const res = analyzeCppSource(code);
    assert.equal(res.supported, true);
    assert.equal(res.primaryConcept, CONCEPT_FAMILIES.ABSTRACT_CLASSES);
    assert.ok(res.detectedConcepts.includes(CONCEPT_FAMILIES.ABSTRACT_CLASSES));
  });
});

test('6. Concept Analyzer: Curated Demos Completeness & Fallback', async (t) => {
  await t.test('all 12 concept families have valid curated demos', () => {
    const families = Object.values(CONCEPT_FAMILIES);
    assert.ok(families.length >= 10);
    for (const fam of families) {
      assert.ok(CONCEPT_DEMOS[fam], `Missing curated demo for ${fam}`);
      const analysis = analyzeCppSource(CONCEPT_DEMOS[fam]);
      assert.equal(analysis.supported, true, `Curated demo for ${fam} must be supported`);
    }
  });

  await t.test('handles empty or non-C++ code with educational unsupported notice', () => {
    const emptyRes = analyzeCppSource('');
    assert.equal(emptyRes.supported, false);
    assert.ok(emptyRes.reason);

    const randomRes = analyzeCppSource('console.log("hello javascript");');
    assert.equal(randomRes.supported, false);
  });
});

// ==========================================
// 2. TIMELINE MODEL TESTS
// ==========================================

test('7. Timeline Model: Generation across Concept Tiers', async (t) => {
  await t.test('generates timeline for variables with stack frame and memory box', () => {
    const code = CONCEPT_DEMOS[CONCEPT_FAMILIES.VARIABLES];
    const analysis = analyzeCppSource(code);
    const timeline = TimelineModel.generateTimeline(analysis);

    assert.ok(timeline);
    assert.ok(timeline.steps.length >= 3);
    assert.equal(timeline.concept, CONCEPT_FAMILIES.VARIABLES);

    // Initial setup step
    const step0 = timeline.steps[0];
    assert.equal(step0.memoryState.stackFrames.length, 1);
    assert.equal(step0.memoryState.stackFrames[0].name, 'main()');

    // Middle step where variable is allocated
    const varStep = timeline.steps.find(s => s.memoryState.variables?.length > 0);
    assert.ok(varStep);
    assert.ok(varStep.label);
    assert.ok(varStep.explanation);
  });

  await t.test('generates timeline for function call frames push and pop', () => {
    const code = CONCEPT_DEMOS[CONCEPT_FAMILIES.FUNCTIONS];
    const analysis = analyzeCppSource(code);
    const timeline = TimelineModel.generateTimeline(analysis);

    assert.ok(timeline.steps.length >= 4);
    // Find step where add frame is pushed
    const callStep = timeline.steps.find(s => s.memoryState.stackFrames?.some(f => f.name.includes('add')));
    assert.ok(callStep, 'Should have a step with add stack frame');
    assert.equal(callStep.memoryState.stackFrames.length, 2, 'Should have main and add frames');

    // Final step add has popped back to main
    const lastStep = timeline.steps[timeline.steps.length - 1];
    assert.equal(lastStep.memoryState.stackFrames.length, 1);
    assert.equal(lastStep.memoryState.stackFrames[0].name, 'main()');
  });

  await t.test('generates timeline for pointers referencing address and heap allocation', () => {
    const code = CONCEPT_DEMOS[CONCEPT_FAMILIES.DYNAMIC_MEMORY];
    const analysis = analyzeCppSource(code);
    const timeline = TimelineModel.generateTimeline(analysis);

    // Find step where heap allocation exists
    const heapStep = timeline.steps.find(s => s.memoryState.heapObjects?.length > 0);
    assert.ok(heapStep, 'Should have a step with heap allocation');
    assert.ok(heapStep.memoryState.heapObjects[0].id);
    assert.equal(heapStep.memoryState.heapObjects[0].isFreed, false);

    // Find step where delete is executed
    const deleteStep = timeline.steps.find(s => s.memoryState.heapObjects?.some(h => h.isFreed));
    assert.ok(deleteStep, 'Should have a step marking heap allocation as freed');
  });

  await t.test('generates timeline for constructors, inheritance, and polymorphism', () => {
    const code = CONCEPT_DEMOS[CONCEPT_FAMILIES.POLYMORPHISM];
    const analysis = analyzeCppSource(code);
    const timeline = TimelineModel.generateTimeline(analysis);

    assert.ok(timeline.steps.length >= 4);
    assert.equal(timeline.concept, CONCEPT_FAMILIES.POLYMORPHISM);

    // Find step with virtual dispatch resolution
    const dispatchStep = timeline.steps.find(s => s.memoryState?.relationships?.some(r => r.type === 'dispatches'));
    assert.ok(dispatchStep, 'Should have a virtual dispatch relationship step');
  });

  await t.test('generates fallback timeline for unsupported code', () => {
    const emptyAnalysis = analyzeCppSource('');
    const timeline = TimelineModel.generateTimeline(emptyAnalysis);
    assert.ok(timeline);
    assert.equal(timeline.isFallback, true);
    assert.equal(timeline.steps.length, 1);
  });
});

// ==========================================
// 3. VISUAL PRIMITIVES RENDERING TESTS
// ==========================================

test('8. Visual Primitives: Rendering & Accessibility', async (t) => {
  await t.test('renderVariables produces structured HTML', () => {
    const memory = [
      { name: 'score', type: 'int', value: '100', address: '0x7ff1', isPointer: false }
    ];
    const html = renderVariables(memory);
    assert.ok(html.includes('vis-variable-grid'));
    assert.ok(html.includes('score'));
    assert.ok(html.includes('100'));
    assert.ok(html.includes('0x7ff1'));
  });

  await t.test('renderCallStack produces frames with parameters and locals', () => {
    const frames = [
      {
        name: 'add(int a, int b)',
        isActive: true,
        locals: [{ name: 'a', value: '3' }],
        returnValue: '7'
      },
      {
        name: 'main()',
        isActive: false,
        locals: [{ name: 'x', value: '10' }]
      }
    ];
    const html = renderCallStack(frames);
    assert.ok(html.includes('vis-stack-container'));
    assert.ok(html.includes('add(int a, int b)'));
    assert.ok(html.includes('main()'));
    assert.ok(html.includes('TOP (ACTIVE)'));
  });

  await t.test('renderHeap produces heap chunks and freed tombstone', () => {
    const heap = [
      { id: '0xheap1', type: 'int', value: '42', isFreed: false },
      { id: '0xheap2', type: 'double', value: '3.14', isFreed: true }
    ];
    const html = renderHeap(heap);
    assert.ok(html.includes('vis-heap-grid'));
    assert.ok(html.includes('0xheap1'));
    assert.ok(html.includes('DEALLOCATED'));
  });

  await t.test('renderRelationships produces pills for pointers & inheritance', () => {
    const relationships = [
      { type: 'points_to', from: 'ptr', to: 'score' },
      { type: 'inherits', from: 'Dog', to: 'Animal' },
      { type: 'dispatches', from: 'pet->speak()', to: 'Dog::speak()' }
    ];
    const html = renderRelationships(relationships);
    assert.ok(html.includes('vis-relationships-bar'));
    assert.ok(html.includes('Dog'));
    assert.ok(html.includes('Animal'));
    assert.ok(html.includes('points to'));
  });

  await t.test('renderPlayerControls generates player buttons, step info and progress bar', () => {
    const html = renderPlayerControls(2, 5, false, 'STEP');
    assert.ok(html.includes('data-vis-action="prev"'));
    assert.ok(html.includes('data-vis-action="next"'));
    assert.ok(html.includes('data-vis-action="toggle-play"'));
    assert.ok(html.includes('data-vis-action="reset"'));
    assert.ok(html.includes('Step <b>3</b> of <b>5</b>'));
  });
});

// ==========================================
// 4. CONCEPT VISUALIZER COMPONENT TESTS
// ==========================================

// Mock Minimal DOM setup for testing ConceptVisualizer UI controller
class MockClassList {
  constructor() {
    this.classes = new Set();
  }
  add(...names) {
    for (const n of names) this.classes.add(n);
  }
  remove(...names) {
    for (const n of names) this.classes.delete(n);
  }
  contains(name) {
    return this.classes.has(name);
  }
}

class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.classList = new MockClassList();
    this.attributes = new Map();
    this.listeners = new Map();
    this.dataset = {};
    this.id = '';
    this._innerHTML = '';
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = val;
  }

  setAttribute(k, v) {
    this.attributes.set(k, String(v));
    if (k === 'id') this.id = String(v);
  }

  getAttribute(k) {
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

  addEventListener(type, cb) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(cb);
  }

  dispatchEvent(event) {
    const handlers = this.listeners.get(event.type) || [];
    for (const h of handlers) h(event);
  }

  closest(selector) {
    let cur = this;
    while (cur) {
      if (selector === '[data-vis-action]' && cur.dataset && cur.dataset.visAction) return cur;
      if (selector === '[data-step-index]' && cur.dataset && cur.dataset.stepIndex !== undefined) return cur;
      if (selector === '[data-demo-concept]' && cur.dataset && cur.dataset.demoConcept) return cur;
      cur = cur.parentNode;
    }
    return null;
  }

  querySelector(selector) {
    if (selector.startsWith('.')) {
      const cls = selector.slice(1);
      const search = (node) => {
        if (node.classList.contains(cls)) return node;
        for (const c of node.children) {
          const res = search(c);
          if (res) return res;
        }
        return null;
      };
      return search(this);
    }
    return null;
  }
}

// Global browser stubbing for visualizer lifecycle tests
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    createElement: (tag) => new MockElement(tag),
    activeElement: null
  };
}
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    matchMedia: () => ({ matches: false })
  };
}

test('9. Concept Visualizer: Lifecycle, Navigation & Controls', async (t) => {
  await t.test('instantiates and initializes with container element', () => {
    const container = new MockElement('div');
    const vis = new ConceptVisualizer({ container, reducedMotion: true });

    assert.ok(vis.root);
    assert.equal(container.children.length, 1);
    assert.equal(vis.reducedMotion, true);
    assert.equal(vis.mode, 'STEP');
    assert.equal(vis.currentStepIndex, 0);
  });

  await t.test('loadSource analyzes code and renders timeline Step 1', () => {
    const container = new MockElement('div');
    const vis = new ConceptVisualizer({ container });
    vis.loadSource(CONCEPT_DEMOS[CONCEPT_FAMILIES.VARIABLES]);

    assert.ok(vis.timeline);
    assert.equal(vis.currentStepIndex, 0);
    assert.ok(vis.root.innerHTML.includes('Step <b>1</b> of'));
    assert.ok(vis.root.innerHTML.includes('Declare and Initialize'));
  });

  await t.test('nextStep and prevStep navigate with bounds clamping', () => {
    const container = new MockElement('div');
    const vis = new ConceptVisualizer({ container });
    vis.loadSource(CONCEPT_DEMOS[CONCEPT_FAMILIES.VARIABLES]);

    const maxSteps = vis.timeline.steps.length;
    assert.ok(maxSteps >= 3);

    vis.nextStep();
    assert.equal(vis.currentStepIndex, 1);

    vis.nextStep();
    assert.equal(vis.currentStepIndex, 2);

    vis.prevStep();
    assert.equal(vis.currentStepIndex, 1);

    vis.prevStep();
    assert.equal(vis.currentStepIndex, 0);

    // Clamping at zero
    vis.prevStep();
    assert.equal(vis.currentStepIndex, 0);

    // Clamping at upper bound
    vis.goToStep(999);
    assert.equal(vis.currentStepIndex, maxSteps - 1);
    vis.nextStep();
    assert.equal(vis.currentStepIndex, maxSteps - 1);
  });

  await t.test('reset rewinds to step 0 and pauses', () => {
    const container = new MockElement('div');
    const vis = new ConceptVisualizer({ container });
    vis.loadSource(CONCEPT_DEMOS[CONCEPT_FAMILIES.VARIABLES]);

    vis.goToStep(2);
    assert.equal(vis.currentStepIndex, 2);

    vis.reset();
    assert.equal(vis.currentStepIndex, 0);
    assert.equal(vis.isPlaying, false);
  });

  await t.test('show and hide methods toggle drawer visibility', () => {
    const container = new MockElement('div');
    let closed = false;
    const vis = new ConceptVisualizer({
      container,
      onClose: () => { closed = true; }
    });

    vis.show();
    assert.equal(vis.isVisible, true);
    assert.equal(vis.root.classList.contains('hidden'), false);

    vis.hide(true);
    assert.equal(vis.isVisible, false);
    assert.equal(vis.root.classList.contains('hidden'), true);
    assert.equal(closed, true);
  });

  await t.test('loadDemo invokes callback and loads curated code', () => {
    const container = new MockElement('div');
    let loadedCode = '';
    const vis = new ConceptVisualizer({
      container,
      onLoadDemo: (code) => { loadedCode = code; }
    });

    vis.loadDemo(CONCEPT_FAMILIES.POLYMORPHISM);
    assert.ok(loadedCode.includes('Animal'));
    assert.equal(vis.timeline.concept, CONCEPT_FAMILIES.POLYMORPHISM);
  });

  await t.test('handleActionClick delegates player actions', () => {
    const container = new MockElement('div');
    const vis = new ConceptVisualizer({ container });
    vis.loadSource(CONCEPT_DEMOS[CONCEPT_FAMILIES.VARIABLES]);

    const btnNext = new MockElement('button');
    btnNext.dataset = { visAction: 'next' };

    vis.handleActionClick({ target: btnNext });
    assert.equal(vis.currentStepIndex, 1);

    const btnReset = new MockElement('button');
    btnReset.dataset = { visAction: 'reset' };

    vis.handleActionClick({ target: btnReset });
    assert.equal(vis.currentStepIndex, 0);
  });
});
