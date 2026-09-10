/**
 * Beginner UI Presentation Layer for CodeBloom.
 * Unifies the Beginner Hub view and provides contextual beginner drawers in the workspace.
 */

import { MentalModelsEngine } from './mentalModels.js';
import { VocabularyEngine } from './vocabularyEngine.js';
import { WhyExplanationEngine } from './whyExplanations.js';
import { ScaffoldingEngine } from './scaffoldingEngine.js';
import { INPUT_LAB_SNIPPETS, LESSON_WORKED_EXAMPLES } from './beginnerData.js';

export class BeginnerUI {
  /**
   * Renders the comprehensive Beginner Hub view.
   */
  static renderHub(activeTab = 'onboarding', engines = {}, options = {}) {
    const { onboarding, predict, debug, decompose } = engines;
    const previousMode = options.previousMode || 'course';
    const previousModeLabel = previousMode === 'practice'
      ? 'Practice Lab'
      : previousMode === 'challenge'
      ? 'Challenge Mode'
      : previousMode === 'mastery'
      ? 'Mastery Test'
      : previousMode === 'benchmark'
      ? 'Benchmark'
      : 'Learning Path';

    const tabs = [
      { id: 'onboarding', label: '🚀 Zero-to-C++', icon: '🚀' },
      { id: 'models', label: '💡 Mental Models', icon: '💡' },
      { id: 'vocab', label: '📖 Vocabulary & Why', icon: '📖' },
      { id: 'predict', label: '🔬 Predict & Run', icon: '🔬' },
      { id: 'debug', label: '🛠️ Micro Debug', icon: '🛠️' },
      { id: 'decompose', label: '🧩 Deconstruct', icon: '🧩' },
      { id: 'scaffold', label: '📈 Scaffolding Ladder', icon: '📈' }
    ];

    let contentHtml = '';
    if (activeTab === 'onboarding') {
      contentHtml = onboarding ? onboarding.render() : '<p>Loading Onboarding...</p>';
    } else if (activeTab === 'models') {
      const models = new MentalModelsEngine().getAllModels();
      contentHtml = `
        <div class="models-collection">
          ${BeginnerUI.renderHandsOnInputLab(options.inputLab)}
          <div class="collection-header">
            <h2>The 5 Universal Mental Models of Programming</h2>
            <p>Master these 5 patterns and you can understand virtually any computer program.</p>
          </div>
          <div class="models-grid">
            ${models.map(m => MentalModelsEngine.renderCard(m)).join('')}
          </div>
        </div>
      `;
    } else if (activeTab === 'vocab') {
      contentHtml = `
        <div class="vocab-and-why-container">
          <section class="hub-section">
            <h2>Contextual C++ Vocabulary</h2>
            <p>Plain-English explanations for keywords, operators, and syntax marks.</p>
            ${VocabularyEngine.renderGlossaryExplorer()}
          </section>
          <section class="hub-section">
            <h2>Why Am I Writing This?</h2>
            <p>Understand the exact reason behind every line of C++ boilerplate.</p>
            ${WhyExplanationEngine.renderAccordion()}
          </section>
        </div>
      `;
    } else if (activeTab === 'predict') {
      contentHtml = predict ? predict.render() : '<p>Loading Predict Engine...</p>';
    } else if (activeTab === 'debug') {
      contentHtml = debug ? debug.render() : '<p>Loading Debug Engine...</p>';
    } else if (activeTab === 'decompose') {
      contentHtml = decompose ? decompose.render() : '<p>Loading Decomposition Trainer...</p>';
    } else if (activeTab === 'scaffold') {
      const scaffoldEng = new ScaffoldingEngine();
      contentHtml = `
        <div class="scaffold-hub-collection">
          ${scaffoldEng.renderInteractiveLadder(options.currentLessonId || 'cpp-basics', null, options.profile || {})}
          ${ScaffoldingEngine.renderProgressionOverview()}
        </div>
      `;
    }

    return `
      <main class="beginner-hub" role="region" aria-label="Beginner Learning Hub">
        <div class="hub-top-bar">
          <div class="hub-nav-row">
            <button class="hub-back-btn" data-action="beginner-back" title="Go back to ${previousModeLabel}" aria-label="Go back to ${previousModeLabel}">
              ← Back to ${previousModeLabel}
            </button>
          </div>
          <div class="hub-brand">
            <span class="hub-badge">BEGINNER LEARNING LAYER</span>
            <h1>Zero-to-C++ Foundation & Mental Models</h1>
          </div>
          <p class="hub-subtitle">Gentle, step-by-step guidance designed specifically for someone with zero prior programming experience.</p>
          
          <nav class="hub-tabs-nav" role="tablist" aria-label="Beginner Hub features">
            ${tabs.map(t => `
              <button class="hub-tab-btn ${activeTab === t.id ? 'active' : ''}" data-action="beginner-tab" data-tab-id="${t.id}" role="tab" aria-selected="${activeTab === t.id}">
                ${t.label}
              </button>
            `).join('')}
          </nav>
        </div>

        <div class="hub-tab-content">
          ${contentHtml}
        </div>
      </main>
    `;
  }

  /**
   * Renders a contextual assistant drawer / banner in the lesson workspace.
   */
  static renderWorkspaceBeginnerBanner(onboardingComplete = false) {
    if (onboardingComplete) return '';

    return `
      <div class="beginner-onboarding-banner" role="complementary" aria-label="Beginner onboarding invitation">
        <div class="banner-icon">🌱</div>
        <div class="banner-text">
          <strong>Brand new to programming?</strong>
          <span>Start with the interactive <b>Zero-to-C++ Onboarding</b> to master what code is, how to run it, and how to fix errors before starting Lesson 1.</span>
        </div>
        <button class="banner-btn" data-action="mode" data-mode="beginner">Start Onboarding →</button>
      </div>
    `;
  }

  /**
   * Renders a contextual syntax & "why am I writing this?" guide bar.
   */
  static renderContextualSyntaxBar(activeToken = null) {
    const commonTokens = [
      '#include', 'iostream', 'main', 'int', 'cout', 'cin', 'return',
      ';', '{}', '()', '<<', '>>', '=', '=='
    ];

    const vocabEngine = new VocabularyEngine();
    const whyEngine = new WhyExplanationEngine();
    const activeTerm = activeToken ? vocabEngine.getTerm(activeToken) : null;
    const activeWhy = activeToken ? whyEngine.getExplanation(activeToken) : null;

    return `
      <div class="contextual-syntax-guide" role="region" aria-label="Contextual C++ Syntax & Why Guide">
        <div class="syntax-guide-header">
          <span class="guide-badge">💡 CONTEXTUAL SYNTAX & WHY GUIDE</span>
          <span class="guide-hint">Click any token to inspect plain-English meaning and why it is needed:</span>
        </div>
        <div class="syntax-token-chips" role="toolbar" aria-label="C++ Syntax Tokens">
          ${commonTokens.map(tok => `
            <button class="syntax-chip ${tok === activeToken ? 'active' : ''}" data-action="syntax-token-inspect" data-token="${tok}" aria-label="Inspect ${tok}">
              <code>${tok}</code>
            </button>
          `).join('')}
        </div>
        ${activeTerm || activeWhy ? `
          <div class="syntax-inspector-drawer">
            ${activeTerm ? `
              <div class="inspector-col vocab-col">
                ${VocabularyEngine.renderTermCard(activeTerm)}
              </div>
            ` : ''}
            ${activeWhy ? `
              <div class="inspector-col why-col">
                ${WhyExplanationEngine.renderCard(activeWhy)}
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Renders the interactive Hands-On Input Lab.
   */
  static renderHandsOnInputLab(labState = {}) {
    const snippetKey = labState.snippetKey || 'doubler';
    const snippet = INPUT_LAB_SNIPPETS[snippetKey] || INPUT_LAB_SNIPPETS.doubler;
    const inputVal = labState.inputValue !== undefined ? labState.inputValue : snippet.defaultInput;
    const executing = Boolean(labState.executing);
    const output = labState.output;
    const history = labState.history || [];

    const esc = str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    return `
      <div class="hands-on-input-lab" role="region" aria-label="Hands-On Input (cin) Lab">
        <div class="lab-header">
          <div class="lab-title-row">
            <span class="lab-badge">HANDS-ON INPUT LAB</span>
            <h3>See <code>cin</code> in Action: Input ➔ Program ➔ Output</h3>
          </div>
          <p class="lab-desc">
            Computer programs are dynamic! Using <code>cin</code>, your program reads live data from the keyboard.
            Change the input value below and click <strong>Run Program with Input</strong> to observe how <em>different inputs produce different outputs</em> from the exact same C++ program.
          </p>
        </div>

        <div class="lab-snippet-selector" role="tablist" aria-label="Input Lab Examples">
          ${Object.values(INPUT_LAB_SNIPPETS).map(s => `
            <button class="lab-snippet-btn ${s.id === snippetKey ? 'active' : ''}" data-action="input-lab-snippet" data-snippet-key="${s.id}">
              ${s.title}
            </button>
          `).join('')}
        </div>

        <div class="input-lab-pipeline">
          <!-- 1. INPUT -->
          <div class="pipeline-box input-box">
            <div class="box-header">
              <span class="box-num">1</span>
              <span class="box-title">INPUT (cin)</span>
            </div>
            <p class="box-sub">Enter data to feed into the program:</p>
            <input type="text" class="lab-input-field" data-input-lab-val value="${esc(inputVal)}" placeholder="Type value here..." aria-label="Input value for cin" />
            <button class="lab-run-btn ${executing ? 'running' : ''}" data-action="run-input-lab" ${executing ? 'disabled' : ''}>
              ${executing ? '⏳ Running...' : '▷ Run Program with Input'}
            </button>
          </div>

          <div class="pipeline-arrow">➔</div>

          <!-- 2. PROGRAM -->
          <div class="pipeline-box program-box">
            <div class="box-header">
              <span class="box-num">2</span>
              <span class="box-title">PROGRAM (C++ Code)</span>
            </div>
            <p class="box-sub">${esc(snippet.description)}</p>
            <pre class="lab-code-preview"><code>${esc(snippet.code)}</code></pre>
          </div>

          <div class="pipeline-arrow">➔</div>

          <!-- 3. OUTPUT -->
          <div class="pipeline-box output-box">
            <div class="box-header">
              <span class="box-num">3</span>
              <span class="box-title">OUTPUT (Screen)</span>
            </div>
            <p class="box-sub">Result printed by <code>cout</code>:</p>
            <div class="lab-terminal-output" aria-live="polite">
              ${output ? `
                <pre class="lab-stdout ${output.status === 'compile_error' ? 'error' : ''}"><code>${esc(output.stdout || output.stderr || '(no output produced)')}</code></pre>
              ` : `
                <div class="lab-empty-terminal">
                  <span>Enter input on the left and click "Run Program with Input" to see live C++ output.</span>
                </div>
              `}
            </div>
          </div>
        </div>

        ${history.length > 1 ? `
          <div class="lab-observation-card">
            <div class="obs-title">🔬 Observation: Same Code, Different Data</div>
            <p class="obs-text">Look at your previous runs with this program. Notice how changing standard input changes the terminal output:</p>
            <div class="obs-runs">
              ${history.map((h, i) => `
                <div class="obs-run-item">
                  <span class="obs-tag">Run #${i + 1}</span>
                  <code>Input: "${esc(h.input)}"</code> ➔ <code>Output: "${esc(String(h.output).replace(/\n/g, ' '))}"</code>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Renders the 3-stage visual flow indicator for C++ execution.
   */
  static renderDataFlowIndicator(usesCin = false, hasFeedback = false) {
    return `
      <div class="data-flow-indicator" aria-label="C++ Execution Flow">
        <div class="flow-pill flow-input ${usesCin ? 'active' : ''}" title="Standard Input: Data passed via keyboard or cin">
          <span class="flow-icon">📥</span>
          <span class="flow-title">1. INPUT (cin)</span>
          ${usesCin ? '<span class="flow-active-dot" title="Active">●</span>' : ''}
        </div>
        <span class="flow-arrow">➔</span>
        <div class="flow-pill flow-code active" title="Program: C++ source code executing in main()">
          <span class="flow-icon">⚙️</span>
          <span class="flow-title">2. PROGRAM (Code)</span>
        </div>
        <span class="flow-arrow">➔</span>
        <div class="flow-pill flow-output ${hasFeedback ? 'active' : ''}" title="Standard Output: Text sent to terminal via cout">
          <span class="flow-icon">📤</span>
          <span class="flow-title">3. OUTPUT (Screen)</span>
          ${hasFeedback ? '<span class="flow-active-dot" title="Results ready">●</span>' : ''}
        </div>
      </div>
    `;
  }

  /**
   * Renders the 5-stage Scaffolding Navigation Bar for the lesson workspace.
   */
  static renderScaffoldingStageBar(lessonId, currentStage = 'worked', profile = {}) {
    const scaffoldHistory = profile.beginner?.scaffoldHistory?.[lessonId] || {};
    const stages = [
      { id: 'worked', num: 1, icon: '📖', label: 'Worked', subtitle: 'Watch an example' },
      { id: 'faded', num: 2, icon: '✏️', label: 'Faded', subtitle: 'Complete part of it' },
      { id: 'guided', num: 3, icon: '🧭', label: 'Guided', subtitle: 'Follow a plan' },
      { id: 'independent', num: 4, icon: '🛡️', label: 'Independent', subtitle: 'Solve it yourself' },
      { id: 'transfer', num: 5, icon: '🔬', label: 'Transfer', subtitle: 'Use the idea in a new problem' }
    ];

    return `
      <nav class="scaffold-stage-bar" role="navigation" aria-label="Pedagogical Scaffolding Ladder">
        <div class="stage-bar-label">
          <span class="stage-bar-badge">SCAFFOLDING LADDER</span>
          <span class="stage-bar-help">Five-stage learning progression:</span>
        </div>
        <div class="stage-bar-track">
          ${stages.map((stg, i) => {
            const isCurrent = currentStage === stg.id;
            const isCompleted = scaffoldHistory[stg.id + '_completed'] || (stg.id === 'worked' && scaffoldHistory.faded);
            return `
              ${i > 0 ? '<span class="stage-sep" aria-hidden="true">➔</span>' : ''}
              <button class="stage-pill ${stg.id} ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
                data-action="start-scaffold-stage"
                data-lesson-id="${lessonId}"
                data-stage="${stg.id}"
                aria-current="${isCurrent ? 'step' : 'false'}"
                title="Stage ${stg.num}: ${stg.label} — ${stg.subtitle}">
                <span class="pill-num">${isCompleted ? '✓' : stg.num}</span>
                <span class="pill-icon">${stg.icon}</span>
                <span class="pill-body">
                  <span class="pill-name">${stg.label}</span>
                  <span class="pill-sub">${stg.subtitle}</span>
                </span>
              </button>
            `;
          }).join('')}
        </div>
      </nav>
    `;
  }

  /**
   * Renders the comprehensive Worked Example Walkthrough view.
   */
  static renderWorkedWalkthrough(progression, runOutput = null, isExecuting = false) {
    const esc = str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const worked = progression?.stages?.worked || {};
    const lineExplanations = worked.lineExplanations || [];
    const reasoningSteps = worked.reasoningSteps || [];

    return `
      <div class="worked-walkthrough-panel" role="region" aria-label="Worked Example Walkthrough">
        <div class="worked-header">
          <div class="worked-badge-row">
            <span class="worked-badge">STAGE 1 · WORKED EXAMPLE — WATCH AN EXAMPLE</span>
            <span class="concept-badge">💡 Concept: ${esc(worked.concept || progression?.lessonTitle)}</span>
          </div>
          <h3>${esc(progression?.lessonTitle)}: Expert Walkthrough</h3>
          <p class="worked-lead">Observe how a complete C++ program solves this problem before attempting to write code yourself.</p>
        </div>

        <div class="next-action-directive worked-directive" role="region" aria-label="Next Action Directive">
          <div class="directive-header">
            <div class="directive-badge-row">
              <span class="directive-badge">STAGE 1 · WORKED</span>
              <span class="directive-flow-hint">Current Action</span>
            </div>
            <div class="directive-action-title">
              <span class="directive-icon" aria-hidden="true">👉</span>
              <strong>What to do next: Run and Observe</strong>
            </div>
            <p class="directive-instruction">Watch how the expert demonstration works. Click <strong>"▷ Run and Observe Output"</strong> below to inspect the program output.</p>
          </div>
          <div class="learning-flow-indicator" aria-label="Learning flow: Read, Predict, Edit, Run, Reflect">
            <span class="flow-step-pill"><span class="flow-step-num">1</span><span class="flow-step-text">Read</span></span>
            <span class="flow-step-arrow" aria-hidden="true">➔</span>
            <span class="flow-step-pill"><span class="flow-step-num">2</span><span class="flow-step-text">Predict</span></span>
            <span class="flow-step-arrow" aria-hidden="true">➔</span>
            <span class="flow-step-pill"><span class="flow-step-num">3</span><span class="flow-step-text">Edit</span></span>
            <span class="flow-step-arrow" aria-hidden="true">➔</span>
            <span class="flow-step-pill active"><span class="flow-step-num">4</span><span class="flow-step-text">Run</span></span>
            <span class="flow-step-arrow" aria-hidden="true">➔</span>
            <span class="flow-step-pill"><span class="flow-step-num">5</span><span class="flow-step-text">Reflect</span></span>
          </div>
        </div>

        <!-- 1. Problem & Expected Output -->
        <div class="worked-problem-card">
          <div class="problem-statement-section">
            <h4>📋 The Problem</h4>
            <p>${esc(worked.problemStatement || progression?.mission)}</p>
          </div>
          <div class="io-preview-row">
            <div class="io-item">
              <span class="io-tag">Input (stdin):</span>
              <code>${esc(worked.input || 'None (Direct Console Output)')}</code>
            </div>
            <div class="io-item">
              <span class="io-tag">Expected Output (cout):</span>
              <pre class="io-code"><code>${esc(worked.expectedOutput || '(observe live output below)')}</code></pre>
            </div>
          </div>
        </div>

        <!-- 2. Problem -> Reasoning -> Code Thought Process -->
        ${reasoningSteps.length > 0 ? `
          <div class="worked-reasoning-card">
            <h4>🧠 Programmer's Thought Process (Problem ➔ Reasoning ➔ Code)</h4>
            <div class="reasoning-steps-list">
              ${reasoningSteps.map((step, idx) => `
                <div class="reasoning-step-item">
                  <span class="reasoning-num">${idx + 1}</span>
                  <p class="reasoning-text">${esc(step)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 3. Line-by-Line Code Breakdown -->
        <div class="worked-code-card">
          <div class="code-card-header">
            <h4>💻 Complete Working Solution & Line Explanations</h4>
            <span class="code-badge">C++20 Clean Code</span>
          </div>
          <pre class="worked-code-display"><code>${esc(worked.code)}</code></pre>

          ${lineExplanations.length > 0 ? `
            <div class="line-explanations-list">
              <h5>Line-by-Line Breakdown:</h5>
              <div class="breakdown-grid">
                ${lineExplanations.map(item => `
                  <div class="breakdown-row">
                    <code class="breakdown-line">${esc(item.line)}</code>
                    <span class="breakdown-desc">${esc(item.explanation)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 4. Interactive Live Run & Output Verification -->
        <div class="worked-execution-section">
          <div class="exec-actions-bar">
            <button class="worked-run-btn ${isExecuting ? 'running' : ''}" data-action="run-worked-example" ${isExecuting ? 'disabled' : ''}>
              ${isExecuting ? '⏳ Compiling & Running...' : '▷ Run and Observe Output'}
            </button>
            <button class="worked-next-btn" data-action="start-scaffold-stage" data-lesson-id="${progression.lessonId}" data-stage="faded">
              Next: Continue to Faded Practice ➔
            </button>
          </div>

          <div class="worked-terminal" aria-live="polite">
            <div class="terminal-header">
              <span>🖥️ Terminal Output</span>
              ${runOutput ? '<span class="status-pill pass">Compiled with g++</span>' : ''}
            </div>
            ${runOutput ? `
              <pre class="terminal-stdout ${runOutput.status === 'compile_error' ? 'error' : ''}"><code>${esc(runOutput.stdout || runOutput.stderr || '(program exited cleanly with no output)')}</code></pre>
            ` : `
              <div class="terminal-empty">
                <span>Click <strong>"▷ Run and Observe Output"</strong> to compile and execute this worked solution in real time.</span>
              </div>
            `}
          </div>

          ${runOutput ? `
            <div class="worked-post-run-notice">
              <span>✓ Demonstration output verified. Ready to write code yourself?</span>
              <button class="worked-next-btn" data-action="start-scaffold-stage" data-lesson-id="${progression.lessonId}" data-stage="faded">
                Continue to Faded Practice ➔
              </button>
            </div>
          ` : ''}
        </div>

        ${worked.fadingGuidance ? `
          <div class="worked-bridge-card">
            <span class="bridge-tag">WHAT'S NEXT IN FADED PRACTICE</span>
            <p>${esc(worked.fadingGuidance)}</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Renders the Reference Worked Pattern callout for Faded Practice.
   */
  static renderReferenceWorkedPattern(progression, isOpen = false) {
    const esc = str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const workedCode = progression?.stages?.worked?.code || '';
    const guidance = progression?.stages?.faded?.fadingGuidance || '';

    return `
      <div class="faded-guidance-container" role="region" aria-label="Faded Practice Pattern Reference">
        ${guidance ? `
          <div class="faded-prompt-banner">
            <span class="faded-badge">STAGE 2 · FADED PRACTICE — COMPLETE PART OF IT</span>
            <strong>Pattern Completion Challenge:</strong>
            <span>${esc(guidance)}</span>
          </div>
        ` : ''}
        <details class="ref-pattern-details" ${isOpen ? 'open' : ''}>
          <summary class="ref-pattern-summary">
            <span>📖 Inspect Reference Worked Solution Pattern</span>
            <span class="ref-toggle-icon">▾</span>
          </summary>
          <div class="ref-pattern-content">
            <p class="ref-note">Compare your code with the pattern below to fill in the missing pieces:</p>
            <pre class="ref-code"><code>${esc(workedCode)}</code></pre>
          </div>
        </details>
      </div>
    `;
  }

  /**
   * Renders the Problem Decomposition & Guidance Guide for Guided Practice.
   * Connects the cognitive decomposition plan directly to the workspace without exposing full solution code.
   */
  static renderDecompositionGuide(progression, ex = null, activePlan = null) {
    const esc = str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const hints = ex?.hints || progression?.stages?.guided?.hints || [];
    const steps = activePlan?.pseudocodeSteps || (activePlan?.pseudocode ? activePlan.pseudocode.split(/\r?\n/).filter(s => s.trim().length > 0) : []);

    return `
      <div class="guided-decomposition-card" role="region" aria-label="Guided Practice Decomposition Plan">
        <div class="guided-header">
          <span class="guided-badge">STAGE 3 · GUIDED PRACTICE — FOLLOW A PLAN</span>
          <h4>🧭 Step-by-Step Problem Decomposition Plan</h4>
          <p>Use this structured breakdown to construct your C++ solution without cognitive overload:</p>
        </div>

        ${activePlan ? `
          <div class="guided-active-plan-drawer">
            <div class="plan-header-row">
              <span class="active-plan-tag">🧠 ACTIVE COMPUTATIONAL PLAN</span>
              <span class="plan-subtext">Derived from your problem decomposition</span>
            </div>
            <div class="active-plan-grid">
              <div class="plan-chip">
                <span class="chip-label">📥 Input (cin):</span>
                <span class="chip-val">${esc(activePlan.input || 'Standard Input values')}</span>
              </div>
              <div class="plan-chip">
                <span class="chip-label">📦 State / Memory:</span>
                <span class="chip-val">${esc(activePlan.memory || 'Intermediate variables & types')}</span>
              </div>
              <div class="plan-chip">
                <span class="chip-label">🔀 Decisions / Logic:</span>
                <span class="chip-val">${esc(activePlan.decisions || 'Conditional branch or operations')}</span>
              </div>
              <div class="plan-chip">
                <span class="chip-label">📤 Output (cout):</span>
                <span class="chip-val">${esc(activePlan.output || 'Formatted result printed to screen')}</span>
              </div>
            </div>

            ${steps.length > 0 ? `
              <div class="plan-steps-box">
                <span class="steps-title">📝 Step-by-Step Logic Steps:</span>
                <ol class="plan-steps-ordered-list">
                  ${steps.map(s => `<li>${esc(s)}</li>`).join('')}
                </ol>
              </div>
            ` : ''}

            <div class="plan-guidance-callout">
              <span class="callout-icon">💡</span>
              <span>Translate each step above into C++ in the editor. You are constructing the code — CodeBloom provides the plan, not the solution!</span>
            </div>
          </div>
        ` : `
          <div class="decomposition-steps-grid">
            <div class="decomp-step">
              <span class="step-num">Step 1</span>
              <strong>Inputs</strong>
              <p>${esc(ex?.inputFormat || 'Determine what variables or values enter the program.')}</p>
            </div>
            <div class="decomp-step">
              <span class="step-num">Step 2</span>
              <strong>Expected Output</strong>
              <p>${esc(ex?.outputFormat || 'Determine what text or values cout must display.')}</p>
            </div>
            <div class="decomp-step">
              <span class="step-num">Step 3</span>
              <strong>Storage & Types</strong>
              <p>Declare the appropriate types (int, double, string, or class objects) to hold intermediate state.</p>
            </div>
            <div class="decomp-step">
              <span class="step-num">Step 4</span>
              <strong>Algorithm Logic</strong>
              <p>Implement the core operations, conditions, or loops in logical order.</p>
            </div>
          </div>
        `}

        ${hints.length > 0 ? `
          <div class="guided-hints-preview">
            <span class="hints-label">💡 Strategy Hints Available:</span>
            <span>Use the <strong>"Need a hint?"</strong> button below to reveal progressive steps if you get stuck.</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Renders the 5-Step Debug Reasoning Bridge in the workspace when an error occurs.
   */
  static renderWorkspaceDebugBridge(debugEngine) {
    if (!debugEngine || !debugEngine.isWorkspaceActive) return '';
    const esc = str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const cur = debugEngine.getCurrentChallenge();

    return `
      <div class="workspace-debug-bridge-card" role="region" aria-label="5-Step Error Debug Reasoning">
        <div class="ws-debug-header">
          <div class="ws-debug-badge-row">
            <span class="ws-debug-badge">🛠️ 5-STEP DEBUGGING WORKFLOW</span>
            <span class="ws-debug-category">${esc(cur.category).toUpperCase()}</span>
          </div>
          <button class="ws-debug-close-btn" data-action="workspace-debug-close" title="Close Debug Assistant" aria-label="Close Debug Assistant">
            ✕ Exit Debugger
          </button>
        </div>
        ${debugEngine.render()}
      </div>
    `;
  }

  /**
   * Renders the Unseen Transfer Benchmark Challenge Banner.
   */
  static renderTransferChallengeBanner(progression) {
    const esc = str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const transfer = progression?.stages?.transfer || {};

    return `
      <div class="transfer-challenge-banner" role="region" aria-label="Unseen Transfer Benchmark Challenge">
        <div class="transfer-header-row">
          <span class="transfer-badge">STAGE 5 · UNSEEN TRANSFER BENCHMARK — USE THE IDEA IN A NEW PROBLEM</span>
          <span class="assistance-zero-tag">Zero Scaffolding Mode</span>
        </div>
        <h3>🔬 Transfer Challenge: True Conceptual Independence</h3>
        <p class="transfer-prompt">${esc(transfer.transferPrompt || 'Apply your knowledge to solve this completely unseen problem in a novel domain without templates or hints.')}</p>
        <div class="transfer-meta">
          <span>Target Benchmark: <strong>${esc(transfer.title || 'Novel Domain')}</strong></span>
          <span>· Hidden Test Cases: <strong>${transfer.testCasesCount || 3}+ rigorous checks</strong></span>
        </div>
      </div>
    `;
  }

  /**
   * Renders the Scaffolding Ladder Next-Step Banner upon passing an exercise.
   */
  static renderScaffoldingNextStepBanner(currentStage, lessonId, profile = {}) {
    const nextMap = {
      worked: { next: 'faded', label: 'Faded Practice', stageName: 'Faded', icon: '✏️', subtitle: 'Complete part of it', desc: 'Reconstruct the key parts of the worked pattern.' },
      faded: { next: 'guided', label: 'Guided Practice', stageName: 'Guided', icon: '🧭', subtitle: 'Follow a plan', desc: 'Build a more substantial solution with structured decomposition.' },
      guided: { next: 'independent', label: 'Independent Problem', stageName: 'Independent', icon: '🛡️', subtitle: 'Solve it yourself', desc: 'Write the complete solution with zero hints or templates.' },
      independent: { next: 'transfer', label: 'Unseen Transfer Benchmark', stageName: 'Transfer', icon: '🔬', subtitle: 'Use the idea in a new problem', desc: 'Prove true conceptual mastery on a novel real-world problem domain.' }
    };

    const target = nextMap[currentStage];
    if (!target) return '';

    return `
      <div class="scaffold-next-step-card" role="region" aria-label="Next Scaffolding Step Recommendation">
        <div class="next-step-icon">${target.icon}</div>
        <div class="next-step-info">
          <span class="next-badge">PEDAGOGICAL LADDER · NEXT STAGE</span>
          <strong>Advance to ${target.label} (${target.stageName} — ${target.subtitle})</strong>
          <p>${target.desc}</p>
        </div>
        <button class="next-stage-btn" data-action="start-scaffold-stage" data-lesson-id="${lessonId}" data-stage="${target.next}">
          Start ${target.label} →
        </button>
      </div>
    `;
  }

  /**
   * Renders the dynamic Line-by-Line Reading card for the given lesson.
   */
  static renderDynamicLineCard(lesson) {
    const esc = str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const workedData = LESSON_WORKED_EXAMPLES[lesson?.id];
    const explanations = workedData?.lineExplanations || [
      { line: '#include <iostream>', explanation: 'brings in screen input and output tools.' },
      { line: 'main()', explanation: 'is where every complete program begins.' },
      { line: 'cout', explanation: 'prints the value after it.' },
      { line: 'return 0;', explanation: 'says the program finished successfully.' }
    ];
    return `
      <div class="line-card">
        <b>How to read this ${esc(lesson?.title || '')} example</b>
        <ol>
          ${explanations.map(e => `<li><code>${esc(e.line)}</code> ${esc(e.explanation)}</li>`).join('')}
        </ol>
      </div>
    `;
  }
}

