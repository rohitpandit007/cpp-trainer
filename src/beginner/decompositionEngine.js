/**
 * Problem Decomposition Trainer for CodeBloom Beginner Learning Layer.
 * Bridges the gap between "I know syntax" and "I can solve a problem".
 * Implements a structured 9-step pre-coding breakdown with fading scaffolding:
 * Input -> Output -> Memory -> Steps -> Decisions -> Repetition -> Concepts -> Pseudocode -> Code.
 */

import { DECOMPOSITION_TEMPLATES } from './beginnerData.js';
import { LEARNING_EVENTS } from '../eventBus.js';

export class DecompositionEngine {
  constructor(options = {}) {
    this.templates = DECOMPOSITION_TEMPLATES;
    this.eventBus = options.eventBus || null;
    this.currentIndex = 0;
    this.scaffoldLevel = options.scaffoldLevel || 'full'; // 'full' | 'faded' | 'independent'
    this.userFields = {
      input: '',
      output: '',
      memory: '',
      operations: '',
      decisions: '',
      repetition: '',
      pseudocode: '',
      code: ''
    };
  }

  getCurrentTemplate() {
    return this.templates[this.currentIndex] || this.templates[0];
  }

  setTemplateIndex(index) {
    if (index >= 0 && index < this.templates.length) {
      this.currentIndex = index;
      this.resetUserFields();
    }
  }

  resetUserFields() {
    const cur = this.getCurrentTemplate();
    this.userFields = {
      input: this.scaffoldLevel === 'full' ? cur.steps.input : '',
      output: this.scaffoldLevel === 'full' ? cur.steps.output : '',
      memory: this.scaffoldLevel === 'full' ? cur.steps.memory : '',
      operations: this.scaffoldLevel === 'full' ? cur.steps.operations : '',
      decisions: this.scaffoldLevel === 'full' ? cur.steps.decisions : '',
      repetition: this.scaffoldLevel === 'full' ? cur.steps.repetition : '',
      pseudocode: this.scaffoldLevel === 'full' ? cur.steps.pseudocode : '',
      code: cur.starterCode
    };
  }

  updateField(fieldName, value) {
    if (this.userFields.hasOwnProperty(fieldName)) {
      this.userFields[fieldName] = value;
    }
  }

  setScaffoldLevel(level) {
    if (['full', 'faded', 'independent'].includes(level)) {
      this.scaffoldLevel = level;
      this.resetUserFields();
    }
  }

  completeDecomposition() {
    const cur = this.getCurrentTemplate();
    if (this.eventBus) {
      this.eventBus.emit(LEARNING_EVENTS.DECOMPOSITION_COMPLETED, {
        templateId: cur.id,
        scaffoldLevel: this.scaffoldLevel
      });
    }
    return true;
  }

  /**
   * Renders the interactive Decomposition Trainer.
   */
  render() {
    const cur = this.getCurrentTemplate();
    const isFaded = this.scaffoldLevel === 'faded';
    const isIndependent = this.scaffoldLevel === 'independent';

    return `
      <div class="decomposition-card" data-decomp-id="${cur.id}">
        <div class="decomp-header">
          <div class="decomp-badge">🧩 PROBLEM DECOMPOSITION TRAINER</div>
          <h3>${cur.problem}</h3>
          <div class="scaffold-toggle-row">
            <span class="scaffold-label">Scaffolding Assistance:</span>
            <button class="scaffold-lvl-btn ${this.scaffoldLevel === 'full' ? 'active' : ''}" data-action="decomp-scaffold" data-lvl="full">Full Guidance</button>
            <button class="scaffold-lvl-btn ${this.scaffoldLevel === 'faded' ? 'active' : ''}" data-action="decomp-scaffold" data-lvl="faded">Faded Prompts</button>
            <button class="scaffold-lvl-btn ${this.scaffoldLevel === 'independent' ? 'active' : ''}" data-action="decomp-scaffold" data-lvl="independent">Independent</button>
          </div>
        </div>

        <div class="decomp-grid">
          <div class="decomp-step-item">
            <span class="decomp-step-title">1. INPUT</span>
            <input type="text" data-decomp-input="input" value="${this.userFields.input}" placeholder="What information comes into the program?" ${this.scaffoldLevel === 'full' ? 'readonly' : ''} />
          </div>

          <div class="decomp-step-item">
            <span class="decomp-step-title">2. OUTPUT</span>
            <input type="text" data-decomp-input="output" value="${this.userFields.output}" placeholder="What must be printed or returned?" ${this.scaffoldLevel === 'full' ? 'readonly' : ''} />
          </div>

          <div class="decomp-step-item">
            <span class="decomp-step-title">3. INFORMATION TO REMEMBER (MEMORY)</span>
            <input type="text" data-decomp-input="memory" value="${this.userFields.memory}" placeholder="What variables are needed?" ${this.scaffoldLevel === 'full' ? 'readonly' : ''} />
          </div>

          <div class="decomp-step-item">
            <span class="decomp-step-title">4. OPERATIONS / STEPS</span>
            <input type="text" data-decomp-input="operations" value="${this.userFields.operations}" placeholder="What calculations or checks take place?" ${this.scaffoldLevel === 'full' ? 'readonly' : ''} />
          </div>

          <div class="decomp-step-item">
            <span class="decomp-step-title">5. DECISIONS</span>
            <input type="text" data-decomp-input="decisions" value="${this.userFields.decisions}" placeholder="Any if / else branches?" ${this.scaffoldLevel === 'full' ? 'readonly' : ''} />
          </div>

          <div class="decomp-step-item">
            <span class="decomp-step-title">6. REPETITION</span>
            <input type="text" data-decomp-input="repetition" value="${this.userFields.repetition}" placeholder="Any loops (for / while)?" ${this.scaffoldLevel === 'full' ? 'readonly' : ''} />
          </div>
        </div>

        <div class="decomp-pseudocode-section">
          <span class="decomp-step-title">7 & 8. PSEUDOCODE (Plain Logic Plan)</span>
          <textarea class="decomp-pseudocode-area" data-decomp-input="pseudocode" placeholder="Write step-by-step plain English logic here...">${this.userFields.pseudocode}</textarea>
        </div>

        <div class="decomp-code-section">
          <span class="decomp-step-title">9. TRANSLATE TO C++ CODE</span>
          <textarea class="decomp-code-area" data-decomp-input="code" spellcheck="false">${this.userFields.code}</textarea>
        </div>

        <div class="decomp-actions">
          <button class="decomp-complete-btn" data-action="decomp-complete">
            ✓ Complete Decomposition & Send to Workspace
          </button>
          <button class="decomp-next-btn" data-action="decomp-next" ${this.currentIndex >= this.templates.length - 1 ? 'disabled' : ''}>
            Next Problem Decomposition →
          </button>
        </div>
      </div>
    `;
  }
}
