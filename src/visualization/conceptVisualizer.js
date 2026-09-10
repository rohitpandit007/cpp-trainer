/**
 * Interactive C++ Concept Visualizer Component (Phase D3).
 * Manages timeline playback, user step controls, keyboard shortcuts,
 * rendering of visual primitives, and educational concept demonstrations.
 */

import { analyzeCppSource, CONCEPT_FAMILIES, CONCEPT_DEMOS } from './conceptAnalyzer.js';
import { TimelineModel } from './timelineModel.js';
import { VisualPrimitives } from './visualPrimitives.js';
import { eventBus } from '../eventBus.js';
import { companionController } from '../companion/index.js';

export class ConceptVisualizer {
  /**
   * @param {Object} [options]
   * @param {HTMLElement} [options.container] Mounting target
   * @param {Function} [options.onLoadDemo] Callback to inject demo code into the editor
   * @param {boolean} [options.reducedMotion]
   */
  constructor(options = {}) {
    this.container = options.container || null;
    this.onLoadDemo = options.onLoadDemo || null;
    this.onClose = options.onClose || null;
    this.reducedMotion = Boolean(options.reducedMotion);

    this.timeline = null;
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.playTimer = null;
    this.mode = 'STEP'; // 'STEP' | 'AUTO'
    this.autoPlayIntervalMs = 2000;
    this.isVisible = false;

    this.root = null;
    this.keyHandler = null;

    if (this.container) {
      this.init();
    }
  }

  /**
   * Initializes visualizer DOM shell and binds global keyboard events.
   */
  init() {
    if (!this.container || typeof document === 'undefined') return;

    this.root = document.createElement('div');
    this.root.className = 'concept-visualizer-container hidden';
    this.root.id = 'concept-visualizer-container';
    this.root.setAttribute('role', 'region');
    this.root.setAttribute('aria-label', 'Interactive C++ Concept Visualizer');

    this.container.appendChild(this.root);

    // Bind interaction event delegation on root
    this.root.addEventListener('click', (e) => this.handleActionClick(e));

    // Bind keyboard shortcuts
    this.keyHandler = (e) => {
      if (!this.isVisible) return;
      // Do not capture if user is actively typing in a textarea or input
      if (['TEXTAREA', 'INPUT'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevStep();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        this.reset();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.hide();
      }
    };

    window.addEventListener('keydown', this.keyHandler);
  }

  /**
   * Loads C++ code into the visualizer, analyzes it, and renders Step 1.
   * @param {string} sourceCode
   * @param {string} [suggestedConcept]
   */
  loadSource(sourceCode = '', suggestedConcept = null) {
    this.pause();
    const analysis = analyzeCppSource(sourceCode);

    if (suggestedConcept && !analysis.supported) {
      analysis.primaryConcept = suggestedConcept;
    }

    this.timeline = TimelineModel.generateTimeline(analysis);
    this.currentStepIndex = 0;
    this.render();
    this.notifyStepChange();
  }

  /**
   * Loads a curated educational demo for a concept family.
   * @param {string} concept
   */
  loadDemo(concept = CONCEPT_FAMILIES.VARIABLES) {
    const demoCode = CONCEPT_DEMOS[concept] || CONCEPT_DEMOS[CONCEPT_FAMILIES.VARIABLES];
    if (typeof this.onLoadDemo === 'function') {
      this.onLoadDemo(demoCode, concept);
    }
    this.loadSource(demoCode, concept);
  }

  /**
   * Advance to next step.
   */
  nextStep() {
    if (!this.timeline || !this.timeline.steps) return;
    if (this.currentStepIndex < this.timeline.steps.length - 1) {
      this.currentStepIndex += 1;
      this.render();
      this.notifyStepChange();
    } else if (this.isPlaying) {
      this.pause();
    }
  }

  /**
   * Go to previous step.
   */
  prevStep() {
    if (!this.timeline || !this.timeline.steps) return;
    if (this.currentStepIndex > 0) {
      this.currentStepIndex -= 1;
      this.render();
      this.notifyStepChange();
    }
  }

  /**
   * Jump to specific step.
   * @param {number} index
   */
  goToStep(index) {
    if (!this.timeline || !this.timeline.steps) return;
    const target = Math.max(0, Math.min(index, this.timeline.steps.length - 1));
    if (target !== this.currentStepIndex) {
      this.currentStepIndex = target;
      this.render();
      this.notifyStepChange();
    }
  }

  /**
   * Start auto-play.
   */
  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.mode = 'AUTO';

    // If at the end, wrap to start
    if (this.timeline && this.currentStepIndex >= this.timeline.steps.length - 1) {
      this.currentStepIndex = 0;
      this.render();
      this.notifyStepChange();
    }

    const interval = this.reducedMotion ? Math.max(1000, this.autoPlayIntervalMs * 0.7) : this.autoPlayIntervalMs;
    this.playTimer = setInterval(() => {
      if (this.currentStepIndex < this.timeline.steps.length - 1) {
        this.nextStep();
      } else {
        this.pause();
      }
    }, interval);

    this.render();
  }

  /**
   * Pause auto-play.
   */
  pause() {
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
    this.isPlaying = false;
    this.render();
  }

  /**
   * Toggle between Play and Pause.
   */
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Reset timeline back to Step 1.
   */
  reset() {
    this.pause();
    this.currentStepIndex = 0;
    this.render();
    this.notifyStepChange();
  }

  /**
   * Toggle player mode between STEP and AUTO.
   */
  toggleMode() {
    if (this.mode === 'STEP') {
      this.play();
    } else {
      this.pause();
      this.mode = 'STEP';
      this.render();
    }
  }

  /**
   * Mounts or re-attaches the visualizer to a container element.
   * @param {HTMLElement} container
   */
  mount(container) {
    if (!container) return;
    this.container = container;
    if (this.root) {
      if (this.root.parentNode !== container) {
        container.appendChild(this.root);
      }
    } else {
      this.init();
    }
  }

  /**
   * Shows the visualizer drawer.
   */
  show() {
    this.isVisible = true;
    if (this.root) {
      this.root.classList.remove('hidden');
    }
  }

  /**
   * Hides the visualizer drawer.
   * @param {boolean} [notify=true]
   */
  hide(notify = true) {
    this.pause();
    this.isVisible = false;
    if (this.root) {
      this.root.classList.add('hidden');
    }
    if (notify && typeof this.onClose === 'function') {
      this.onClose();
    }
  }

  /**
   * Toggles drawer open/close.
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Emits notification and coordinates contextual Pikachu speech bubble.
   */
  notifyStepChange() {
    if (!this.timeline) return;

    const currentStep = this.timeline.steps[this.currentStepIndex];
    if (!currentStep) return;

    // Emit event bus notification
    if (typeof eventBus?.emit === 'function') {
      eventBus.emit('VISUALIZATION_STEP', {
        concept: this.timeline.concept,
        stepIndex: this.currentStepIndex,
        totalSteps: this.timeline.steps.length,
        label: currentStep.label,
        lineNumber: currentStep.lineNumber
      });
    }

    // Contextual Pikachu encouragement on key milestones
    if (companionController) {
      if (this.timeline.concept === CONCEPT_FAMILIES.POLYMORPHISM && this.currentStepIndex === 3) {
        companionController.notifySubscribers({
          speechOverride: "Watch how Animal* dynamically resolves to Dog::speak() at runtime!"
        });
      } else if (this.timeline.concept === CONCEPT_FAMILIES.CONSTRUCTORS && this.currentStepIndex === 2) {
        companionController.notifySubscribers({
          speechOverride: "Notice the initializer list executing before the constructor body!"
        });
      }
    }
  }

  /**
   * Action delegation click handler.
   * @param {MouseEvent} e
   */
  handleActionClick(e) {
    const btn = e.target.closest('[data-vis-action]');
    if (btn) {
      const action = btn.dataset.visAction;
      if (action === 'prev') this.prevStep();
      if (action === 'next') this.nextStep();
      if (action === 'toggle-play') this.togglePlay();
      if (action === 'reset') this.reset();
      if (action === 'toggle-mode') this.toggleMode();
      if (action === 'close') this.hide();
      return;
    }

    const dot = e.target.closest('[data-vis-step]');
    if (dot) {
      const stepIdx = parseInt(dot.dataset.visStep, 10);
      if (!isNaN(stepIdx)) {
        this.goToStep(stepIdx);
      }
      return;
    }

    const demoBtn = e.target.closest('[data-vis-load-demo]');
    if (demoBtn) {
      const concept = demoBtn.dataset.visLoadDemo || CONCEPT_FAMILIES.VARIABLES;
      this.loadDemo(concept);
    }
  }

  /**
   * Renders the complete visualization state.
   */
  render() {
    if (!this.root) return;

    if (!this.timeline || !this.timeline.steps || this.timeline.steps.length === 0) {
      this.root.innerHTML = `
        <div class="vis-fallback-card">
          <h3>Interactive Concept Visualizer</h3>
          <p class="vis-disclaimer">A simplified concept illustration, not an exact execution trace.</p>
          <p>Click "Visualize Concept" or select an educational demo to explore key C++ concepts visually.</p>
          <button class="load-demo-btn" data-vis-load-demo="${CONCEPT_FAMILIES.VARIABLES}">Load Variable Demo →</button>
        </div>
      `;
      return;
    }

    // Fallback notice for unsupported constructs
    if (this.timeline.concept === 'UNSUPPORTED') {
      const step = this.timeline.steps[0];
      this.root.innerHTML = `
        <div class="vis-header">
          <div class="vis-header-left">
            <h3>${esc(this.timeline.title)}</h3>
            <p class="vis-objective">${esc(this.timeline.educationalObjective)}</p>
          </div>
          <button class="close-vis-btn" data-vis-action="close" title="Close">✕</button>
        </div>
        <div class="vis-fallback-card">
          <p>${esc(step.explanation)}</p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button class="vis-btn" data-vis-load-demo="${CONCEPT_FAMILIES.VARIABLES}">Variables Demo</button>
            <button class="vis-btn" data-vis-load-demo="${CONCEPT_FAMILIES.FUNCTIONS}">Functions Demo</button>
            <button class="vis-btn" data-vis-load-demo="${CONCEPT_FAMILIES.POINTERS}">Pointers Demo</button>
            <button class="vis-btn" data-vis-load-demo="${CONCEPT_FAMILIES.CLASSES_OBJECTS}">Classes Demo</button>
            <button class="vis-btn" data-vis-load-demo="${CONCEPT_FAMILIES.POLYMORPHISM}">Polymorphism Demo</button>
          </div>
        </div>
      `;
      return;
    }

    const currentStep = this.timeline.steps[this.currentStepIndex];
    const mem = currentStep.memoryState || {};

    this.root.innerHTML = `
      <!-- Visualizer Header -->
      <div class="vis-header">
        <div class="vis-header-left">
          <h3>
            ${esc(this.timeline.title)}
            <span class="provenance-tag">CONCEPTUAL MODEL</span>
          </h3>
          <p class="vis-disclaimer">A simplified concept illustration, not an exact execution trace.</p>
          <p class="vis-objective">🎯 <b>Core Principle:</b> ${esc(this.timeline.educationalObjective)}</p>
        </div>
        <div class="vis-header-right">
          <button class="close-vis-btn" data-vis-action="close" title="Close visualizer">✕</button>
        </div>
      </div>

      <!-- Active Step Card -->
      <div class="vis-step-card">
        <div class="step-meta-row">
          <span class="step-title">Step ${this.currentStepIndex + 1}: ${esc(currentStep.label)}</span>
          ${currentStep.lineNumber ? `<span class="step-line-pill">Line ${currentStep.lineNumber}</span>` : ''}
        </div>
        ${currentStep.codeSnippet ? `
          <div class="step-code-preview"><code>${esc(currentStep.codeSnippet)}</code></div>
        ` : ''}
        <p class="step-explanation">💡 ${esc(currentStep.explanation)}</p>
      </div>

      <!-- Visual Stage Body (Composed Primitives) -->
      <div class="vis-stage-body">
        ${VisualPrimitives.renderRelationships(mem.relationships)}
        ${VisualPrimitives.renderClasses(mem.classes)}
        ${VisualPrimitives.renderObjects(mem.objects)}
        ${VisualPrimitives.renderCallStack(mem.stackFrames, currentStep.highlightTarget)}
        ${VisualPrimitives.renderVariables(mem.variables, currentStep.highlightTarget)}
        ${VisualPrimitives.renderHeap(mem.heapObjects)}
        ${VisualPrimitives.renderOutput(currentStep.outputLog)}
      </div>

      <!-- Player Controls -->
      ${VisualPrimitives.renderPlayerControls(this.currentStepIndex, this.timeline.steps.length, this.isPlaying, this.mode)}
    `;
  }

  /**
   * Destroys visualizer, clears timers, and removes keyboard listeners.
   */
  destroy() {
    this.pause();
    if (this.keyHandler && typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
    if (this.root && this.root.parentNode) {
      this.root.parentNode.removeChild(this.root);
      this.root = null;
    }
  }
}

function esc(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}
