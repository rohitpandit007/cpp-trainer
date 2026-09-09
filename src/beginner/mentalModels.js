/**
 * Mental Models UI & Logic Primitives for CodeBloom Beginner Learning Layer.
 * Renders Models A (Input/Process/Output), B (Store/Change/Use), C (Condition/Decision),
 * D (Action/Check/Repeat), and E (Big Problem/Smaller Parts).
 */

import { MENTAL_MODELS } from './beginnerData.js';

export class MentalModelsEngine {
  constructor(options = {}) {
    this.models = MENTAL_MODELS;
    this.onEvent = options.onEvent || null;
  }

  getModel(idOrCode) {
    return this.models.find(m => m.id === idOrCode || m.code === idOrCode) || null;
  }

  getAllModels() {
    return this.models;
  }

  /**
   * Renders the interactive visual diagram for a mental model.
   */
  static renderDiagram(model) {
    if (!model || !model.steps) return '';

    return `
      <div class="mental-model-diagram ${model.id}" role="img" aria-label="${model.title} flow diagram">
        <div class="diagram-flow">
          ${model.steps.map((step, idx) => `
            <div class="diagram-step-box">
              <div class="step-icon">${step.icon}</div>
              <div class="step-name">${step.name}</div>
              <div class="step-desc">${step.desc}</div>
            </div>
            ${idx < model.steps.length - 1 ? '<div class="diagram-arrow" aria-hidden="true">➔</div>' : ''}
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Renders a full MentalModelCard with explanation, diagram, example code, and interactive check.
   */
  static renderCard(model, options = {}) {
    if (!model) return '';
    const isCompleted = options.isCompleted || false;
    const selectedCheck = options.selectedCheck ?? null;
    const checkEvaluated = options.checkEvaluated || false;

    return `
      <article class="mental-model-card" data-model-id="${model.id}">
        <div class="mm-header">
          <div class="mm-badge">${model.concept}</div>
          <h3 class="mm-title">${model.title}</h3>
          <p class="mm-tagline"><em>${model.tagline}</em></p>
        </div>

        <p class="mm-summary">${model.summary}</p>

        ${MentalModelsEngine.renderDiagram(model)}

        <div class="mm-example-box">
          <span class="example-label">Concrete C++ Example:</span>
          <pre><code>${model.example.cpp}</code></pre>
        </div>

        ${model.check ? `
          <div class="mm-check-section">
            <span class="check-title">💡 Quick Mental Check</span>
            <p class="check-question">${model.check.question}</p>
            <div class="check-options-list">
              ${model.check.options.map((opt, optIdx) => {
                let btnCls = 'check-opt-btn';
                if (checkEvaluated) {
                  if (optIdx === model.check.correctIndex) btnCls += ' correct';
                  else if (optIdx === selectedCheck) btnCls += ' incorrect';
                } else if (optIdx === selectedCheck) {
                  btnCls += ' selected';
                }
                return `
                  <button class="${btnCls}" data-action="mm-check-opt" data-model-id="${model.id}" data-opt-idx="${optIdx}" ${checkEvaluated ? 'disabled' : ''}>
                    ${opt}
                  </button>
                `;
              }).join('')}
            </div>

            ${checkEvaluated ? `
              <div class="check-feedback ${selectedCheck === model.check.correctIndex ? 'feedback-success' : 'feedback-error'}">
                <strong>${selectedCheck === model.check.correctIndex ? '✓ Correct Mental Model!' : '✕ Not quite:'}</strong>
                <span>${model.check.explanation}</span>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </article>
    `;
  }
}
