/**
 * Predict-Before-Run Engine for CodeBloom Beginner Learning Layer.
 * Promotes active cognitive prediction before execution:
 * PREDICT → RUN → COMPARE.
 * Dispatches learning events and compares prediction against real C++ execution.
 */

import { PREDICT_CHALLENGES } from './beginnerData.js';
import { LEARNING_EVENTS } from '../eventBus.js';

/**
 * Normalizes C++ text output for fair comparison:
 * - Unifies CRLF / LF line endings
 * - Strips trailing whitespace per line
 * - Strips leading/trailing empty lines
 */
export function normalizeOutput(text) {
  if (typeof text !== 'string') return '';
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const cleaned = lines.map(line => line.trimEnd());
  while (cleaned.length > 0 && cleaned[0] === '') {
    cleaned.shift();
  }
  while (cleaned.length > 0 && cleaned[cleaned.length - 1] === '') {
    cleaned.pop();
  }
  return cleaned.join('\n');
}

export class PredictEngine {
  constructor(options = {}) {
    this.challenges = PREDICT_CHALLENGES;
    this.eventBus = options.eventBus || null;
    this.currentChallengeIndex = 0;
    this.state = {
      selectedOption: null,
      submitted: false,
      isCorrect: false,
      executionFailure: false,
      resultStatus: null,
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
      executionFailure: false,
      resultStatus: null,
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
   * Evaluates the learner's prediction and dispatches event based on real C++ execution.
   * @param {Object} [execResult] - Real C++ execution output from /api/execute
   */
  submitPrediction(execResult = null) {
    const challenge = this.getCurrentChallenge();
    if (this.state.selectedOption === null) return null;

    this.state.submitted = true;
    this.state.executionResult = execResult;

    // Check for execution failure: compilation error, runtime error, timeout, missing result, or status !== 'success'
    if (!execResult || execResult.status !== 'success') {
      this.state.isCorrect = false;
      this.state.executionFailure = true;
      this.state.resultStatus = 'execution_failure';

      const errorMsg = execResult?.stderr || execResult?.rawError || execResult?.error || 'Execution failed';

      if (this.eventBus) {
        this.eventBus.emit(LEARNING_EVENTS.PREDICTION_SUBMITTED, {
          challengeId: challenge.id,
          concept: challenge.concept,
          selectedOption: this.state.selectedOption,
          correct: false,
          executionFailure: true
        });
        this.eventBus.emit(LEARNING_EVENTS.PREDICTION_INCORRECT, {
          challengeId: challenge.id,
          concept: challenge.concept,
          executionFailure: true
        });
      }

      return {
        status: 'execution_failure',
        isCorrect: false,
        explanation: 'Execution failed. The program could not be executed to verify your prediction.',
        error: errorMsg,
        expectedOutput: challenge.expectedOutput
      };
    }

    // Successful execution: capture and normalize actual stdout
    this.state.executionFailure = false;
    const actualStdout = normalizeOutput(execResult.stdout);
    const expectedOutput = normalizeOutput(challenge.expectedOutput);

    // Determine what actual result corresponds to
    const executionMatchedExpected = actualStdout === expectedOutput;

    // Learner prediction is correct ONLY IF:
    // 1. Code executed successfully, AND
    // 2. The actual output produced matches expected output, AND
    // 3. The learner's selected option was the correct prediction
    const isPredictionCorrect = executionMatchedExpected && (this.state.selectedOption === challenge.correctIndex);

    this.state.isCorrect = isPredictionCorrect;
    this.state.resultStatus = isPredictionCorrect ? 'prediction_correct' : 'prediction_incorrect';

    if (this.eventBus) {
      this.eventBus.emit(LEARNING_EVENTS.PREDICTION_SUBMITTED, {
        challengeId: challenge.id,
        concept: challenge.concept,
        selectedOption: this.state.selectedOption,
        correct: this.state.isCorrect,
        executionFailure: false
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
      status: this.state.resultStatus,
      isCorrect: this.state.isCorrect,
      explanation: challenge.explanation,
      expectedOutput: challenge.expectedOutput,
      actualOutput: actualStdout,
      executionMatchedExpected
    };
  }

  /**
   * Renders the interactive Predict-Before-Run UI card.
   */
  render(options = {}) {
    const challenge = this.getCurrentChallenge();
    const { selectedOption, submitted, isCorrect, executionFailure, executionResult } = this.state;

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
            if (submitted && !executionFailure) {
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
            ${executionFailure ? `
              <div class="predict-result-banner failure">
                <div class="result-headline">⚠️ Execution Failure</div>
                <p class="result-explanation">The program encountered an execution or compilation error. A prediction cannot be verified when execution fails.</p>
                <div class="result-actual-stdout">
                  <small>Diagnostic error:</small>
                  <code>${executionResult?.stderr || executionResult?.error || 'Execution error'}</code>
                </div>
              </div>
            ` : `
              <div class="predict-result-banner ${isCorrect ? 'match' : 'mismatch'}">
                <div class="result-headline">
                  ${isCorrect ? '🎯 Prediction Matched!' : '💡 Divergence Observed'}
                </div>
                <p class="result-explanation">${challenge.explanation}</p>
                <div class="result-actual-stdout">
                  <small>Actual C++ Console Output:</small>
                  <code>${executionResult?.stdout ? executionResult.stdout : '(no output)'}</code>
                </div>
                ${!isCorrect ? `
                  <div class="result-expected-stdout">
                    <small>Expected Output:</small>
                    <code>${challenge.expectedOutput}</code>
                  </div>
                ` : ''}
              </div>
            `}

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
