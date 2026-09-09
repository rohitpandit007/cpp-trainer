/**
 * Predict-Before-Run Engine for CodeBloom Beginner Learning Layer.
 * Promotes active cognitive prediction before execution:
 * PREDICT → RUN → COMPARE.
 * Dispatches learning events and compares prediction against real C++ execution.
 */

import { PREDICT_CHALLENGES } from './beginnerData.js';
import { LEARNING_EVENTS } from '../eventBus.js';

export class PredictEngine {
  constructor(options = {}) {
    this.challenges = PREDICT_CHALLENGES;
    this.eventBus = options.eventBus || null;
    this.currentChallengeIndex = 0;
    this.state = {
      selectedOption: null,
      submitted: false,
      isCorrect: false,
      executionResult: null,
      comparing: false
    };
  }

  getCurrentChallenge() {
    return this.challenges[this.currentChallengeIndex] || this.challenges[0];
  }

  setChallengeIndex(index) {
    if (index >= 0 && index < this.challenges.length) {
      this.currentChallengeIndex = index;
      this.resetState();
    }
  }

  resetState() {
    this.state = {
      selectedOption: null,
      submitted: false,
      isCorrect: false,
      executionResult: null,
      comparing: false
    };
  }

  selectOption(optIndex) {
    if (!this.state.submitted) {
      this.state.selectedOption = optIndex;
    }
  }

  /**
   * Evaluates the learner's prediction and dispatches event.
   * @param {Object} [execResult] - Real C++ execution output from /api/execute
   */
  submitPrediction(execResult = null) {
    const challenge = this.getCurrentChallenge();
    if (this.state.selectedOption === null) return null;

    this.state.submitted = true;
    this.state.isCorrect = this.state.selectedOption === challenge.correctIndex;
    this.state.executionResult = execResult;

    if (this.eventBus) {
      this.eventBus.emit(LEARNING_EVENTS.PREDICTION_SUBMITTED, {
        challengeId: challenge.id,
        concept: challenge.concept,
        selectedOption: this.state.selectedOption,
        correct: this.state.isCorrect
      });

      if (this.state.isCorrect) {
        this.eventBus.emit(LEARNING_EVENTS.PREDICTION_CORRECT, {
          challengeId: challenge.id,
          concept: challenge.concept
        });
      } else {
        this.eventBus.emit(LEARNING_EVENTS.PREDICTION_INCORRECT, {
          challengeId: challenge.id,
          concept: challenge.concept
        });
      }
    }

    return {
      isCorrect: this.state.isCorrect,
      explanation: challenge.explanation,
      expectedOutput: challenge.expectedOutput
    };
  }

  /**
   * Renders the interactive Predict-Before-Run UI card.
   */
  render(options = {}) {
    const challenge = this.getCurrentChallenge();
    const { selectedOption, submitted, isCorrect, executionResult } = this.state;

    return `
      <div class="predict-card" data-challenge-id="${challenge.id}">
        <div class="predict-header">
          <div class="predict-badge">🔬 PREDICT-BEFORE-RUN · ${challenge.concept}</div>
          <h3>${challenge.title}</h3>
        </div>

        <div class="predict-code-viewer">
          <pre><code>${challenge.code}</code></pre>
        </div>

        <div class="predict-prompt">
          <strong>Question:</strong> ${challenge.question}
        </div>

        <div class="predict-options-list" role="radiogroup" aria-label="Prediction options">
          ${challenge.options.map((opt, idx) => {
            let cls = 'predict-opt-btn';
            if (submitted) {
              if (idx === challenge.correctIndex) cls += ' correct';
              else if (idx === selectedOption) cls += ' incorrect';
            } else if (idx === selectedOption) {
              cls += ' selected';
            }
            return `
              <button class="${cls}" data-action="predict-select" data-opt-idx="${idx}" ${submitted ? 'disabled' : ''} role="radio" aria-checked="${idx === selectedOption}">
                <span class="opt-letter">${String.fromCharCode(65 + idx)}.</span>
                <span class="opt-text">${opt}</span>
              </button>
            `;
          }).join('')}
        </div>

        <div class="predict-actions">
          ${!submitted ? `
            <button class="predict-submit-btn" data-action="predict-submit" ${selectedOption === null ? 'disabled' : ''}>
              🔮 Submit Prediction & Run Code
            </button>
          ` : `
            <div class="predict-result-banner ${isCorrect ? 'match' : 'mismatch'}">
              <div class="result-headline">
                ${isCorrect ? '🎯 Prediction Matched!' : '💡 Divergence Observed'}
              </div>
              <p class="result-explanation">${challenge.explanation}</p>
              ${executionResult?.stdout ? `
                <div class="result-actual-stdout">
                  <small>Actual C++ Console Output:</small>
                  <code>${executionResult.stdout}</code>
                </div>
              ` : `
                <div class="result-actual-stdout">
                  <small>Expected Output:</small>
                  <code>${challenge.expectedOutput}</code>
                </div>
              `}
            </div>

            <div class="predict-nav-row">
              <button class="predict-nav-btn" data-action="predict-next" ${this.currentChallengeIndex >= this.challenges.length - 1 ? 'disabled' : ''}>
                Next Prediction Challenge →
              </button>
              <button class="predict-nav-btn secondary" data-action="predict-retry">
                Try Again ↻
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }
}
