/**
 * Micro Debugging Engine for CodeBloom Beginner Learning Layer.
 * Teaches beginners structured error identification and resolution:
 * broken code → inspect → identify likely issue → modify → run → verify.
 */

import { MICRO_DEBUG_CHALLENGES } from './beginnerData.js';
import { LEARNING_EVENTS } from '../eventBus.js';

export class DebugEngine {
  constructor(options = {}) {
    this.challenges = MICRO_DEBUG_CHALLENGES;
    this.eventBus = options.eventBus || null;
    this.currentIndex = 0;
    this.state = {
      userSource: this.challenges[0].brokenCode,
      scaffoldSelected: null,
      scaffoldEvaluated: false,
      showHint: false,
      lastExecResult: null,
      passed: false
    };
  }

  getCurrentChallenge() {
    return this.challenges[this.currentIndex] || this.challenges[0];
  }

  setChallengeIndex(index) {
    if (index >= 0 && index < this.challenges.length) {
      this.currentIndex = index;
      this.resetState();
    }
  }

  resetState() {
    const cur = this.getCurrentChallenge();
    this.state = {
      userSource: cur.brokenCode,
      scaffoldSelected: null,
      scaffoldEvaluated: false,
      showHint: false,
      lastExecResult: null,
      passed: false
    };
  }

  selectScaffoldOption(optIndex) {
    this.state.scaffoldSelected = optIndex;
    this.state.scaffoldEvaluated = true;
  }

  updateUserSource(newSource) {
    this.state.userSource = newSource;
  }

  toggleHint() {
    this.state.showHint = !this.state.showHint;
  }

  /**
   * Assesses the learner's fixed code after execution.
   */
  evaluateFix(execResult) {
    const cur = this.getCurrentChallenge();
    this.state.lastExecResult = execResult;

    if (!execResult) {
      this.state.passed = false;
      return false;
    }

    const cleanStdout = (execResult.stdout || '').trim();
    const expected = cur.expectedOutput.trim();

    const isFixed = execResult.status === 'success' && cleanStdout.includes(expected);
    this.state.passed = isFixed;

    if (isFixed && this.eventBus) {
      this.eventBus.emit(LEARNING_EVENTS.MICRO_DEBUG_COMPLETED, {
        challengeId: cur.id,
        category: cur.category
      });
    }

    return isFixed;
  }

  /**
   * Renders the interactive Micro-Debugging workspace.
   */
  render() {
    const cur = this.getCurrentChallenge();
    const { userSource, scaffoldSelected, scaffoldEvaluated, showHint, lastExecResult, passed } = this.state;
    const isScaffoldCorrect = scaffoldSelected === cur.correctScaffoldIndex;

    return `
      <div class="micro-debug-card" data-debug-id="${cur.id}">
        <div class="debug-header">
          <div class="debug-badge">🛠️ MICRO DEBUGGING · ${cur.category} (${cur.difficulty})</div>
          <h3>${cur.title}</h3>
          <p class="debug-problem-statement">${cur.problem}</p>
        </div>

        <div class="debug-scaffold-hypothesis">
          <span class="hypothesis-title">Step 1: Diagnose the Problem</span>
          <p class="hypothesis-question">${cur.scaffoldQuestion}</p>
          <div class="hypothesis-options">
            ${cur.scaffoldOptions.map((opt, idx) => {
              let btnCls = 'hypothesis-btn';
              if (scaffoldEvaluated) {
                if (idx === cur.correctScaffoldIndex) btnCls += ' correct';
                else if (idx === scaffoldSelected) btnCls += ' incorrect';
              } else if (idx === scaffoldSelected) {
                btnCls += ' selected';
              }
              return `
                <button class="${btnCls}" data-action="debug-scaffold-opt" data-opt-idx="${idx}">
                  ${opt}
                </button>
              `;
            }).join('')}
          </div>
          ${scaffoldEvaluated ? `
            <div class="hypothesis-feedback ${isScaffoldCorrect ? 'feedback-success' : 'feedback-error'}">
              ${isScaffoldCorrect ? '✓ Spot-on diagnosis! Now fix the code below and run it.' : '💡 Hint: Review the question and compiler expectations again.'}
            </div>
          ` : ''}
        </div>

        <div class="debug-editor-box">
          <div class="debug-editor-bar">
            <span>Step 2: Inspect & Fix Code</span>
            <button class="hint-toggle-btn" data-action="debug-toggle-hint">${showHint ? 'Hide Hint ✕' : 'Need a Hint? 💡'}</button>
          </div>
          ${showHint ? `
            <div class="debug-hint-box">
              <strong>Hint:</strong> ${cur.hint}
            </div>
          ` : ''}
          <textarea class="debug-textarea" data-debug-source spellcheck="false">${userSource}</textarea>
        </div>

        <div class="debug-actions">
          <button class="debug-run-btn" data-action="debug-run">
            ▷ Compile & Verify Fix
          </button>

          ${passed ? `
            <div class="debug-success-banner">
              <strong>🎉 Bug Fixed Successfully!</strong>
              <p>Your program compiled and produced the expected output: <code>${cur.expectedOutput}</code></p>
              <button class="debug-next-btn" data-action="debug-next" ${this.currentIndex >= this.challenges.length - 1 ? 'disabled' : ''}>
                Next Debug Challenge →
              </button>
            </div>
          ` : lastExecResult ? `
            <div class="debug-fail-banner">
              <strong>⚠️ Fix Incomplete</strong>
              <p>${lastExecResult.status === 'compile_error' ? 'Code failed to compile. Check syntax and punctuation!' : `Output did not match expected "${cur.expectedOutput}".`}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}
