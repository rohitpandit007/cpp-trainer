/**
 * "Why Am I Writing This?" Explanation Engine for CodeBloom Beginner Learning Layer.
 * Answers the three critical beginner questions for any syntax element:
 * 1. What is this?
 * 2. Why do I need it?
 * 3. What happens if I remove or change it?
 */

import { WHY_EXPLANATIONS } from './beginnerData.js';

export class WhyExplanationEngine {
  constructor() {
    this.explanations = WHY_EXPLANATIONS;
  }

  getExplanation(key) {
    if (!key || typeof key !== 'string') return null;
    const clean = key.trim();

    if (this.explanations[clean]) return this.explanations[clean];

    // Fuzzy matching for partial strings
    const match = Object.keys(this.explanations).find(k => clean.includes(k) || k.includes(clean));
    return match ? this.explanations[match] : null;
  }

  getAllExplanations() {
    return Object.values(this.explanations);
  }

  /**
   * Renders the structured 3-part "Why" explanation card.
   */
  static renderCard(item) {
    if (!item) {
      return `
        <div class="why-card empty">
          <p>No explanation available for this syntax construct.</p>
        </div>
      `;
    }

    return `
      <div class="why-card" role="region" aria-label="Why explanation for ${item.target}">
        <h4 class="why-title">🤔 ${item.title}</h4>
        
        <div class="why-section what">
          <span class="why-label">1. What is this?</span>
          <p>${item.whatIsThis}</p>
        </div>

        <div class="why-section why">
          <span class="why-label">2. Why do I need it?</span>
          <p>${item.whyDoINeedIt}</p>
        </div>

        <div class="why-section impact">
          <span class="why-label">3. What happens if I remove it?</span>
          <p>⚠️ ${item.whatHappensIfRemoved}</p>
        </div>
      </div>
    `;
  }

  /**
   * Renders a quick accordion list of all essential "Why" topics.
   */
  static renderAccordion(activeKey = '#include <iostream>') {
    const list = Object.values(WHY_EXPLANATIONS);
    return `
      <div class="why-accordion">
        ${list.map(item => `
          <details class="why-item" ${item.target === activeKey ? 'open' : ''}>
            <summary class="why-summary"><code>${item.target}</code> — ${item.title}</summary>
            <div class="why-item-body">
              ${WhyExplanationEngine.renderCard(item)}
            </div>
          </details>
        `).join('')}
      </div>
    `;
  }
}
