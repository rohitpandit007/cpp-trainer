/**
 * Micro Debugging Engine for CodeBloom Beginner Learning Layer.
 * Teaches beginners structured error identification and resolution:
 * 1. OBSERVE: Symptom, output mismatch, or compiler error
 * 2. LOCATE: Identify the wrong line
 * 3. EXPLAIN: Explain why it is wrong before modifying code
 * 4. FIX: Apply targeted code modifications with 3-tier progressive hints
 * 5. VERIFY: Compile and run to verify expected output
 */

import { MICRO_DEBUG_CHALLENGES } from './beginnerData.js';
import { LEARNING_EVENTS } from '../eventBus.js';

export class DebugEngine {
  constructor(options = {}) {
    this.challenges = MICRO_DEBUG_CHALLENGES;
    this.eventBus = options.eventBus || null;
    this.currentIndex = 0;
    this.state = {
      currentStep: 'observe', // 'observe' | 'locate' | 'explain' | 'fix' | 'verify'
      selectedLine: null,
      locatedCorrectly: null,
      explainSelected: null,
      explainCorrect: null,
      hintTier: 0, // 0 = none, 1 = concept, 2 = target token, 3 = fix pattern
      userSource: this.challenges[0].brokenCode,
      lastExecResult: null,
      passed: false,
      // Backwards-compatibility fields
      scaffoldSelected: null,
      scaffoldEvaluated: false,
      showHint: false
    };
  }

  getCurrentChallenge() {
    if (this.isWorkspaceActive && this.workspaceChallenge) {
      return this.workspaceChallenge;
    }
    return this.challenges[this.currentIndex] || this.challenges[0];
  }

  setChallengeIndex(index) {
    if (index >= 0 && index < this.challenges.length) {
      this.isWorkspaceActive = false;
      this.workspaceChallenge = null;
      this.currentIndex = index;
      this.resetState();
    }
  }

  /**
   * Initializes a contextual 5-step debugging session from a live workspace compile error or test failure.
   */
  initFromWorkspaceError({
    source = '',
    diagnostic = '',
    classifiedError = null,
    testResult = null,
    expectedOutput = '',
    actualOutput = '',
    exerciseTitle = 'Workspace Problem'
  } = {}) {
    const rawDiag = diagnostic || classifiedError?.rawError || '';
    let buggyLine = 1;
    const match = rawDiag.match(/:(\d+):\d+:\s*(?:error|warning):/i) ||
      rawDiag.match(/line\s+(\d+)/i) ||
      rawDiag.match(/:(\d+):/);
    if (match) {
      buggyLine = parseInt(match[1], 10);
    }

    const lines = (source || '').split('\n');
    if (buggyLine > lines.length) buggyLine = Math.max(1, lines.length);

    const errCategory = classifiedError?.category || (expectedOutput ? 'logic_error' : 'syntax_error');
    let correctExplain = '';
    let distractors = [];
    let hints = [];

    if (errCategory.includes('syntax') || rawDiag.includes('expected') || rawDiag.includes('semicolon')) {
      correctExplain = 'A syntax element (like a missing semicolon, unmatched bracket, or token typo) prevents compilation.';
      distractors = [
        'The variable data types are taking up too much computer RAM.',
        'The compiler ran out of execution time.'
      ];
      hints = [
        'Inspect the punctuation at the end of every statement on or immediately before the indicated line.',
        'Look specifically for missing semicolons (;) or unclosed curly braces { } around the block.',
        'Verify that all keywords and variable identifiers are spelled exactly as declared.'
      ];
    } else if (errCategory.includes('type') || rawDiag.includes('cannot convert') || rawDiag.includes('no matching function')) {
      correctExplain = 'A type mismatch or incompatible operator exists between the variable types.';
      distractors = [
        'The program is missing the #include <iostream> header completely.',
        'The program contains an endless while loop.'
      ];
      hints = [
        'Check the data types of variables being assigned or passed.',
        'Ensure numeric types and text/character types are not mistakenly mixed.',
        'Match variable declarations to the required operation.'
      ];
    } else if (expectedOutput || testResult) {
      correctExplain = 'The program compiles and runs, but outputs a result that differs from the required problem specification.';
      distractors = [
        'The g++ compiler crashed while reading the main() function.',
        'The operating system denied permission to print characters to stdout.'
      ];
      hints = [
        'Compare the actual output against the expected output character by character.',
        'Check your math operations, loop conditions, or if/else branch logic.',
        'Ensure cout prints exact spaces, numbers, and newlines as requested in the specification.'
      ];
    } else {
      correctExplain = 'The code encountered an error during compilation or execution that requires inspection.';
      distractors = [
        'The computer ran out of memory while allocating an integer.',
        'The operating system refused to run C++.'
      ];
      hints = [
        'Read the compiler diagnostic carefully to see which line and token failed.',
        'Inspect the syntax and variable definitions around that line.',
        'Correct the mistake and re-run to verify output.'
      ];
    }

    const candidateLines = [buggyLine];
    if (buggyLine > 1 && !candidateLines.includes(buggyLine - 1)) candidateLines.push(buggyLine - 1);
    if (buggyLine < lines.length && !candidateLines.includes(buggyLine + 1)) candidateLines.push(buggyLine + 1);

    const challenge = {
      id: 'workspace-live-debug',
      title: `Workspace Debug: ${exerciseTitle}`,
      category: errCategory,
      difficulty: 'Dynamic',
      problem: expectedOutput
        ? `Output mismatch: Expected "${expectedOutput}", but received "${actualOutput}".`
        : `Diagnostic: ${classifiedError?.description || rawDiag.split('\n')[0] || 'Code failed to build cleanly.'}`,
      symptom: rawDiag || `Expected output: "${expectedOutput}", Received: "${actualOutput}"`,
      expectedOutput: expectedOutput || '',
      buggyLine,
      lineOptions: candidateLines,
      brokenCode: source,
      correctExplainIndex: 0,
      explainOptions: [correctExplain, distractors[0], distractors[1]],
      hints,
      isWorkspaceDebug: true
    };

    this.workspaceChallenge = challenge;
    this.isWorkspaceActive = true;
    this.resetState();
    return challenge;
  }

  exitWorkspaceDebug() {
    this.isWorkspaceActive = false;
    this.workspaceChallenge = null;
    this.resetState();
  }

  resetState() {
    const cur = this.getCurrentChallenge();
    this.state = {
      currentStep: 'observe',
      selectedLine: null,
      locatedCorrectly: null,
      explainSelected: null,
      explainCorrect: null,
      hintTier: 0,
      userSource: cur.brokenCode,
      lastExecResult: null,
      passed: false,
      scaffoldSelected: null,
      scaffoldEvaluated: false,
      showHint: false
    };
  }

  setStep(step) {
    const valid = ['observe', 'locate', 'explain', 'fix', 'verify'];
    if (valid.includes(step)) {
      this.state.currentStep = step;
    }
  }

  /**
   * Step 2: Locate - Select line suspected of having the bug.
   */
  selectLine(lineNumber) {
    const cur = this.getCurrentChallenge();
    const lineNum = Number(lineNumber);
    this.state.selectedLine = lineNum;
    const isCorrect = lineNum === cur.buggyLine;
    this.state.locatedCorrectly = isCorrect;
    if (isCorrect && this.state.currentStep === 'locate') {
      this.state.currentStep = 'explain';
    }
    return isCorrect;
  }

  /**
   * Step 3: Explain - Select reason why the line/code is wrong.
   */
  selectExplainOption(optIndex) {
    const cur = this.getCurrentChallenge();
    const idx = Number(optIndex);
    this.state.explainSelected = idx;
    const isCorrect = idx === cur.correctExplainIndex;
    this.state.explainCorrect = isCorrect;

    // Backwards-compatibility sync
    this.state.scaffoldSelected = idx;
    this.state.scaffoldEvaluated = true;

    if (isCorrect && (this.state.currentStep === 'explain' || this.state.currentStep === 'observe')) {
      this.state.currentStep = 'fix';
    }
    return isCorrect;
  }

  // Backwards-compatibility method
  selectScaffoldOption(optIndex) {
    return this.selectExplainOption(optIndex);
  }

  updateUserSource(newSource) {
    this.state.userSource = newSource;
  }

  /**
   * Step 4: Progressive Hint Unlock (Tier 1 -> Tier 2 -> Tier 3).
   */
  unlockNextHint() {
    const cur = this.getCurrentChallenge();
    const maxTiers = cur.hints ? cur.hints.length : 3;
    if (this.state.hintTier < maxTiers) {
      this.state.hintTier += 1;
    }
    this.state.showHint = this.state.hintTier > 0;
    return this.state.hintTier;
  }

  getHint() {
    const cur = this.getCurrentChallenge();
    if (!cur.hints || cur.hints.length === 0) {
      return cur.hint || 'Inspect punctuation and variable names.';
    }
    const tier = Math.max(1, Math.min(this.state.hintTier, cur.hints.length));
    return cur.hints[tier - 1];
  }

  toggleHint() {
    if (this.state.showHint) {
      this.state.showHint = false;
    } else {
      if (this.state.hintTier === 0) {
        this.unlockNextHint();
      }
      this.state.showHint = true;
    }
  }

  /**
   * Step 5: Verify - Assesses the learner's fixed code after execution.
   */
  evaluateFix(execResult) {
    const cur = this.getCurrentChallenge();
    this.state.lastExecResult = execResult;

    if (!execResult) {
      this.state.passed = false;
      return false;
    }

    const cleanStdout = (execResult.stdout || '').trim();
    const expected = (cur.expectedOutput || '').trim();

    let isFixed = false;
    if (cur.isWorkspaceDebug) {
      if (execResult.passed) {
        isFixed = true;
      } else if (expected) {
        isFixed = execResult.status === 'success' && cleanStdout.includes(expected);
      } else {
        isFixed = execResult.status === 'success';
      }
    } else {
      isFixed = execResult.status === 'success' && cleanStdout.includes(expected);
    }

    this.state.passed = isFixed;

    if (isFixed) {
      this.state.currentStep = 'verify';
      if (this.eventBus) {
        this.eventBus.emit(LEARNING_EVENTS.MICRO_DEBUG_COMPLETED, {
          challengeId: cur.id,
          category: cur.category
        });
      }
    }

    return isFixed;
  }

  /**
   * Formats source code lines with numbers for the Locate step.
   */
  getFormattedSourceLines() {
    const cur = this.getCurrentChallenge();
    const lines = cur.brokenCode.split('\n');
    return lines.map((code, idx) => ({
      lineNum: idx + 1,
      code
    }));
  }

  /**
   * Renders the interactive 5-Step Micro-Debugging workspace.
   */
  render() {
    const cur = this.getCurrentChallenge();
    const {
      currentStep,
      selectedLine,
      locatedCorrectly,
      explainSelected,
      explainCorrect,
      hintTier,
      userSource,
      lastExecResult,
      passed
    } = this.state;

    const formattedLines = this.getFormattedSourceLines();
    const candidateLines = cur.lineOptions || [cur.buggyLine];

    const esc = str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const steps = [
      { id: 'observe', label: '1. Observe', icon: '👁️', done: Boolean(selectedLine || explainSelected || passed) },
      { id: 'locate', label: '2. Locate', icon: '📍', done: Boolean(locatedCorrectly) },
      { id: 'explain', label: '3. Explain', icon: '🧠', done: Boolean(explainCorrect) },
      { id: 'fix', label: '4. Fix', icon: '✏️', done: Boolean(passed) },
      { id: 'verify', label: '5. Verify', icon: '✓', done: Boolean(passed) }
    ];

    return `
      <div class="micro-debug-card" data-debug-id="${cur.id}" role="region" aria-label="Micro-Debugging Exercise: ${cur.title}">
        <!-- Header -->
        <div class="debug-header">
          <div class="debug-badge-row">
            <span class="debug-badge">🛠️ MICRO DEBUGGING · ${esc(cur.category).toUpperCase()}</span>
            <span class="difficulty-tag">${cur.difficulty}</span>
            <span class="step-progress-tag">Challenge ${this.currentIndex + 1} of ${this.challenges.length}</span>
          </div>
          <h3>${esc(cur.title)}</h3>
          <p class="debug-problem-statement">${esc(cur.problem)}</p>
        </div>

        <!-- 5-Step Navigation Ladder -->
        <nav class="debug-stepper-bar" role="navigation" aria-label="5-Step Debugging Process">
          ${steps.map((stg) => {
            const isCurrent = currentStep === stg.id;
            return `
              <button class="stepper-step ${stg.id} ${isCurrent ? 'active' : ''} ${stg.done ? 'completed' : ''}"
                data-action="debug-step" data-step="${stg.id}" aria-current="${isCurrent ? 'step' : 'false'}">
                <span class="step-icon">${stg.done ? '✓' : stg.icon}</span>
                <span class="step-label">${stg.label}</span>
              </button>
            `;
          }).join('')}
        </nav>

        <!-- STEP 1: OBSERVE -->
        <div class="debug-section observe-section ${currentStep === 'observe' ? 'active' : ''}">
          <div class="section-title-row">
            <span class="section-num">Step 1</span>
            <h4>Observe Symptom & Diagnostics</h4>
          </div>
          <div class="symptom-card">
            <div class="symptom-tag">🚨 OBSERVED COMPILER / RUNTIME SYMPTOM</div>
            <pre class="symptom-output"><code>${esc(cur.symptom || 'Program produced unexpected output or compilation error.')}</code></pre>
          </div>
          <div class="code-inspection-panel">
            <span class="panel-label">Inspect the Code:</span>
            <div class="code-lines-display">
              ${formattedLines.map(line => `
                <div class="code-line-row ${selectedLine === line.lineNum ? (locatedCorrectly ? 'highlight-correct' : 'highlight-wrong') : ''}">
                  <span class="line-num">${line.lineNum}</span>
                  <code class="line-text">${esc(line.code)}</code>
                </div>
              `).join('')}
            </div>
          </div>
          ${currentStep === 'observe' ? `
            <div class="step-advance-row">
              <button class="step-next-btn" data-action="debug-step" data-step="locate">
                I have observed the symptom ➔ Next: Locate Buggy Line
              </button>
            </div>
          ` : ''}
        </div>

        <!-- STEP 2: LOCATE -->
        <div class="debug-section locate-section ${currentStep === 'locate' ? 'active' : ''}">
          <div class="section-title-row">
            <span class="section-num">Step 2</span>
            <h4>Locate the Error: Which line contains the defect?</h4>
          </div>
          <p class="section-prompt">Select the line number where the issue originates based on the compiler error or logic symptom above:</p>
          <div class="line-selector-buttons" role="group" aria-label="Line selection options">
            ${candidateLines.map(ln => {
              const isSelected = selectedLine === ln;
              let cls = 'line-opt-btn';
              if (isSelected) {
                cls += locatedCorrectly ? ' correct' : ' incorrect';
              }
              return `
                <button class="${cls}" data-action="debug-locate-line" data-line="${ln}">
                  Line ${ln} ${isSelected ? (locatedCorrectly ? '✓' : '✗') : ''}
                </button>
              `;
            }).join('')}
          </div>
          ${selectedLine !== null ? `
            <div class="locate-feedback ${locatedCorrectly ? 'feedback-success' : 'feedback-error'}">
              ${locatedCorrectly
                ? `✓ Exactly! Line ${cur.buggyLine} is where the mistake lives. Now explain why before touching the code.`
                : `💡 Not quite. Review the compiler feedback or output. Hint: focus around lines ${candidateLines.join(', ')}.`
              }
            </div>
          ` : ''}
        </div>

        <!-- STEP 3: EXPLAIN -->
        <div class="debug-section explain-section ${currentStep === 'explain' ? 'active' : ''}">
          <div class="section-title-row">
            <span class="section-num">Step 3</span>
            <h4>Explain: Why is this line wrong?</h4>
          </div>
          <p class="hypothesis-question">${esc(cur.explainQuestion || cur.scaffoldQuestion)}</p>
          <div class="hypothesis-options">
            ${(cur.explainOptions || cur.scaffoldOptions).map((opt, idx) => {
              let btnCls = 'hypothesis-btn';
              if (explainSelected !== null) {
                if (idx === cur.correctExplainIndex) btnCls += ' correct';
                else if (idx === explainSelected) btnCls += ' incorrect';
              } else if (idx === explainSelected) {
                btnCls += ' selected';
              }
              return `
                <button class="${btnCls}" data-action="debug-explain-opt" data-opt-idx="${idx}">
                  ${esc(opt)}
                </button>
              `;
            }).join('')}
          </div>
          ${explainSelected !== null ? `
            <div class="hypothesis-feedback ${explainCorrect ? 'feedback-success' : 'feedback-error'}">
              ${explainCorrect
                ? '✓ Spot-on diagnosis! You understand the cause. Now fix the code below.'
                : '💡 Hint: Reread the error message and think about what the compiler or logic expected.'
              }
            </div>
          ` : ''}
        </div>

        <!-- STEP 4: FIX & HINTS -->
        <div class="debug-section fix-section ${currentStep === 'fix' || currentStep === 'verify' ? 'active' : ''}">
          <div class="section-title-row">
            <span class="section-num">Step 4</span>
            <h4>Fix the Code</h4>
          </div>

          <!-- Progressive Hint Drawer (3 Tiers) -->
          <div class="progressive-hint-card">
            <div class="hint-tier-header">
              <span>💡 Progressive Hints (${hintTier} / 3 unlocked)</span>
              <button class="hint-unlock-btn" data-action="debug-hint-tier" ${hintTier >= 3 ? 'disabled' : ''}>
                ${hintTier === 0 ? 'Need a Hint? (Unlock Tier 1)' : hintTier === 1 ? 'Need More Help? (Unlock Tier 2)' : hintTier === 2 ? 'Show Fix Pattern (Tier 3)' : 'All 3 Hints Unlocked'}
              </button>
            </div>
            ${hintTier > 0 && cur.hints ? `
              <div class="hint-tier-body">
                ${cur.hints.slice(0, hintTier).map((h, i) => `
                  <div class="hint-tier-item">
                    <span class="tier-tag">Tier ${i + 1} (${i === 0 ? 'Concept' : i === 1 ? 'Target' : 'Pattern'}):</span>
                    <p class="tier-text">${esc(h)}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <div class="debug-editor-box">
            <div class="debug-editor-bar">
              <span>C++ Code Editor</span>
              <span class="editor-target-tag">Target Output: <code>${esc(cur.expectedOutput)}</code></span>
            </div>
            <textarea class="debug-textarea" data-debug-source spellcheck="false">${esc(userSource)}</textarea>
          </div>

          <!-- STEP 5: VERIFY -->
          <div class="debug-actions">
            <button class="debug-run-btn" data-action="debug-run">
              ▷ Compile & Verify Fix
            </button>

            ${passed ? `
              <div class="debug-success-banner" role="alert">
                <strong>🎉 Step 5 Verified: Bug Fixed Successfully!</strong>
                <p>Your program compiled cleanly and produced the expected output: <code>${esc(cur.expectedOutput)}</code></p>
                <button class="debug-next-btn" data-action="debug-next" ${this.currentIndex >= this.challenges.length - 1 ? 'disabled' : ''}>
                  Next Debug Challenge (${this.currentIndex + 2} of ${this.challenges.length}) →
                </button>
              </div>
            ` : lastExecResult ? `
              <div class="debug-fail-banner" role="alert">
                <strong>⚠️ Fix Incomplete</strong>
                <p>${lastExecResult.status === 'compile_error'
                  ? `Compilation Error: ${esc(lastExecResult.stderr || 'Check syntax, semicolons, and identifiers.')}`
                  : `Output did not match expected "${esc(cur.expectedOutput)}". Actual: "${esc(lastExecResult.stdout || '(empty)')}"`
                }</p>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
}
