/**
 * Progressive Scaffolding & Worked->Faded->Independent Engine for CodeBloom.
 * Manages 8 progressive assistance levels and the 5-stage pedagogical ladder:
 * Worked Example -> Faded Example -> Guided Practice -> Independent Practice -> Transfer.
 */

import { LEARNING_EVENTS } from '../eventBus.js';

export const SCAFFOLD_LEVELS = {
  1: { level: 1, name: 'Recognition', desc: 'Choose the correct code fragment among distractors.' },
  2: { level: 2, name: 'Ordering', desc: 'Arrange scrambled code lines into correct logical sequence.' },
  3: { level: 3, name: 'Fill Blank', desc: 'Complete missing tokens, operators, or expressions.' },
  4: { level: 4, name: 'Complete Line', desc: 'Write a single missing statement.' },
  5: { level: 5, name: 'Complete Function', desc: 'Fill in a function body while signature is provided.' },
  6: { level: 6, name: 'Complete Program', desc: 'Complete main() within a provided boilerplate skeleton.' },
  7: { level: 7, name: 'Guided Problem', desc: 'Decomposition and pseudocode plan provided.' },
  8: { level: 8, name: 'Independent Problem', desc: 'Problem specifications only. No templates or hints.' },
  9: { level: 9, name: 'Unseen Transfer', desc: 'Completely novel problem domain testing underlying concept.' }
};

export class ScaffoldingEngine {
  constructor(options = {}) {
    this.eventBus = options.eventBus || null;
  }

  getScaffoldLevel(levelNumber) {
    return SCAFFOLD_LEVELS[levelNumber] || SCAFFOLD_LEVELS[1];
  }

  /**
   * Evaluates a Parsons problem (ordering code lines).
   * @param {string[]} userOrder - Array of line strings arranged by learner
   * @param {string[]} correctOrder - Array of expected line strings in order
   */
  evaluateOrdering(userOrder, correctOrder) {
    if (!Array.isArray(userOrder) || !Array.isArray(correctOrder)) return false;
    if (userOrder.length !== correctOrder.length) return false;

    const matches = userOrder.every((line, idx) => line.trim() === correctOrder[idx].trim());
    if (matches && this.eventBus) {
      this.eventBus.emit(LEARNING_EVENTS.SCAFFOLD_COMPLETED, {
        level: 2,
        type: 'ordering'
      });
    }
    return matches;
  }

  /**
   * Evaluates a fill-in-the-blank expression.
   */
  evaluateFillBlank(userAnswer, expectedAnswers) {
    const clean = (userAnswer || '').trim();
    const targets = Array.isArray(expectedAnswers) ? expectedAnswers : [expectedAnswers];
    const isCorrect = targets.some(t => t.trim() === clean);

    if (isCorrect && this.eventBus) {
      this.eventBus.emit(LEARNING_EVENTS.SCAFFOLD_COMPLETED, {
        level: 3,
        type: 'fill_blank'
      });
    }
    return isCorrect;
  }

  /**
   * Renders the Worked -> Faded -> Independent trajectory card.
   */
  static renderProgressionOverview() {
    return `
      <div class="scaffold-progression-matrix" role="region" aria-label="Progressive scaffolding ladder">
        <div class="matrix-header">
          <span class="matrix-badge">PEDAGOGICAL PROGRESSION</span>
          <h3>From Scaffolding to Independence</h3>
          <p>Assistance decreases as your competence increases.</p>
        </div>

        <div class="matrix-steps-list">
          <div class="matrix-step worked">
            <div class="m-icon">📖</div>
            <div class="m-info">
              <strong>1. Worked Example</strong>
              <p>Fully working code with line-by-line explanation of why every token exists.</p>
            </div>
          </div>

          <div class="matrix-step faded">
            <div class="m-icon">✏️</div>
            <div class="m-info">
              <strong>2. Faded Example</strong>
              <p>Key operations are removed for you to fill in and reinforce the pattern.</p>
            </div>
          </div>

          <div class="matrix-step guided">
            <div class="m-icon">🧭</div>
            <div class="m-info">
              <strong>3. Guided Practice</strong>
              <p>Problem decomposition and pseudocode plan guide your implementation.</p>
            </div>
          </div>

          <div class="matrix-step independent">
            <div class="m-icon">🛡️</div>
            <div class="m-info">
              <strong>4. Independent Problem</strong>
              <p>Zero templates. You write the solution from problem requirements.</p>
            </div>
          </div>

          <div class="matrix-step transfer">
            <div class="m-icon">🔬</div>
            <div class="m-info">
              <strong>5. Transfer Benchmark</strong>
              <p>Completely unseen problem domain testing true conceptual mastery.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
