/**
 * 12-Step Zero-to-C++ Onboarding Engine for CodeBloom.
 * Guides true beginners from knowing nothing about programming to executing,
 * modifying, intentionally breaking, reading compiler errors, and fixing C++ programs.
 */

import { ONBOARDING_STEPS } from './beginnerData.js';
import { LEARNING_EVENTS } from '../eventBus.js';

export class OnboardingEngine {
  constructor(options = {}) {
    this.steps = ONBOARDING_STEPS;
    this.eventBus = options.eventBus || null;
    this.currentStep = options.initialStep || 0;
    this.completed = Boolean(options.completed);
    this.skipped = Boolean(options.skipped);
    this.source = this.steps[this.currentStep]?.starterCode || '';
    this.lastExecResult = null;
    this.stepFeedback = null;
  }

  getCurrentStepData() {
    return this.steps[this.currentStep] || this.steps[0];
  }

  setCurrentStep(index) {
    if (index >= 0 && index < this.steps.length) {
      this.currentStep = index;
      const data = this.getCurrentStepData();
      if (data.starterCode) {
        this.source = data.starterCode;
      }
      this.stepFeedback = null;
      this.lastExecResult = null;
    }
  }

  updateSource(code) {
    this.source = code;
  }

  skipOnboarding() {
    this.skipped = true;
    return { skipped: true };
  }

  /**
   * Evaluates the current step following a real C++ compilation / execution.
   */
  evaluateStep(execResult = null) {
    const data = this.getCurrentStepData();
    this.lastExecResult = execResult;

    // Steps that do not require running code can simply advance
    if (!data.requiresRun) {
      return this.advanceStep();
    }

    if (!execResult) {
      this.stepFeedback = { passed: false, message: 'Please run the code to continue.' };
      return false;
    }

    // Step 9: Intentional Error
    if (data.expectCompileError) {
      if (execResult.status === 'compile_error') {
        this.stepFeedback = {
          passed: true,
          message: 'Excellent! You deliberately triggered a compiler error. Notice how the compiler flagged the missing semicolon.'
        };
        return this.advanceStep();
      } else {
        this.stepFeedback = {
          passed: false,
          message: 'The code compiled without errors! Did you remove the semicolon at the end of line 4?'
        };
        return false;
      }
    }

    // Standard run verification
    if (execResult.status === 'compile_error') {
      this.stepFeedback = {
        passed: false,
        message: 'Compilation failed! Check your spelling, quotes, and semicolons.'
      };
      return false;
    }

    const cleanStdout = (execResult.stdout || '').trim();
    if (data.expectedOutput) {
      if (cleanStdout.includes(data.expectedOutput)) {
        this.stepFeedback = {
          passed: true,
          message: `Success! Program printed: "${cleanStdout}"`
        };
        return this.advanceStep();
      } else {
        this.stepFeedback = {
          passed: false,
          message: `Expected output to include "${data.expectedOutput}", but received: "${cleanStdout || '(no output)'}".`
        };
        return false;
      }
    }

    return this.advanceStep();
  }

  advanceStep() {
    const currentData = this.getCurrentStepData();
    if (this.eventBus) {
      this.eventBus.emit(LEARNING_EVENTS.ONBOARDING_STEP_COMPLETED, {
        stepIndex: this.currentStep,
        stepId: currentData.id
      });
    }

    if (this.currentStep < this.steps.length - 1) {
      this.currentStep += 1;
      const nextData = this.getCurrentStepData();
      if (nextData.starterCode) {
        this.source = nextData.starterCode;
      }
      return { completed: false, nextStep: this.currentStep };
    } else {
      this.completed = true;
      if (this.eventBus) {
        this.eventBus.emit(LEARNING_EVENTS.ONBOARDING_COMPLETED, {
          totalSteps: this.steps.length
        });
      }
      return { completed: true, nextStep: this.currentStep };
    }
  }

  /**
   * Renders the full-screen or embedded Zero-to-C++ Onboarding UI.
   */
  render() {
    const data = this.getCurrentStepData();
    const isLastStep = this.currentStep === this.steps.length - 1;

    return `
      <div class="onboarding-wrapper" role="region" aria-label="Zero-to-C++ Beginner Onboarding">
        <header class="onboarding-header">
          <div class="ob-progress-bar">
            ${this.steps.map((s, idx) => `
              <div class="ob-step-dot ${idx === this.currentStep ? 'active' : idx < this.currentStep ? 'completed' : ''}" title="${s.title}"></div>
            `).join('')}
          </div>
          <div class="ob-step-meta">
            <span class="ob-badge">STEP ${this.currentStep + 1} OF ${this.steps.length}</span>
            <button class="ob-skip-btn" data-action="onboarding-skip">Skip Onboarding →</button>
          </div>
        </header>

        <div class="onboarding-body">
          <div class="ob-teach-pane">
            <h2>${data.title}</h2>
            <p class="ob-summary">${data.summary}</p>
            <div class="ob-content-text">
              ${data.content.replace(/\n\n/g, '<br/><br/>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')}
            </div>
            
            <div class="ob-action-prompt">
              <strong>👉 Your Action:</strong> ${data.actionPrompt}
            </div>

            ${this.stepFeedback ? `
              <div class="ob-feedback-banner ${this.stepFeedback.passed ? 'success' : 'error'}">
                ${this.stepFeedback.passed ? '✓ ' : '⚠️ '}${this.stepFeedback.message}
              </div>
            ` : ''}

            ${!data.requiresRun ? `
              <div class="ob-next-row">
                <button class="ob-primary-btn" data-action="onboarding-continue">
                  ${isLastStep ? 'Complete Onboarding & Enter CodeBloom 🎉' : 'Continue to Next Step →'}
                </button>
              </div>
            ` : ''}
          </div>

          ${data.requiresRun ? `
            <div class="ob-code-pane">
              <div class="ob-editor-bar">
                <span><i></i> main.cpp</span>
                <span class="ob-compiler-tag">Real C++ Compiler Active</span>
              </div>
              <textarea class="ob-editor-textarea" data-onboarding-source spellcheck="false">${this.source}</textarea>
              <div class="ob-editor-actions">
                <button class="ob-run-btn" data-action="onboarding-run">
                  ▷ Run Code
                </button>
                ${this.stepFeedback?.passed ? `
                  <button class="ob-advance-btn" data-action="onboarding-continue">
                    ${isLastStep ? 'Complete Onboarding & Enter CodeBloom 🎉' : 'Next Step →'}
                  </button>
                ` : ''}
              </div>
              ${this.lastExecResult ? `
                <div class="ob-console-output">
                  <span class="console-label">C++ OUTPUT CONSOLE</span>
                  <pre><code>${this.lastExecResult.stdout || this.lastExecResult.stderr || '(no output)'}</code></pre>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}
