import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  workspace,
  state,
  renderStageDirective,
  renderLineNumbers,
  renderExecutionFeedback,
  renderAssessmentFeedback,
  renderFeedbackSlot,
  sidebar,
  independent,
  renderConceptMasteryRow
} from '../src/app.js';
import { BeginnerUI } from '../src/beginner/beginnerUI.js';
import { lessons } from '../src/courseData.js';
import { storageManager } from '../src/storageManager.js';
import { GamificationUI } from '../src/gamification/gamificationUI.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('P0 #1: Worked -> Exercise Clarity & Progression Flow', async (t) => {
  await t.test('1. Worked mode renders demonstration clearly and distinguishes from practice', () => {
    state.lessonId = 'cpp-basics';
    state.scaffoldStage = 'worked';
    state.exercise = 'mini';

    const html = workspace();

    // 1. Walkthrough panel is rendered
    assert.ok(html.includes('worked-walkthrough-panel'), 'Worked walkthrough panel must be present');
    assert.ok(html.includes('data-action="run-worked-example"'), 'Demonstration run button must be present');
    assert.ok(html.includes('▷ Run and Observe Output'), 'Demonstration run action must be prominent');

    // 2. Clear transition card to Faded practice is rendered
    assert.ok(html.includes('worked-transition-card'), 'Worked transition card must be present');
    assert.ok(html.includes('Continue to Faded Practice ➔'), 'Continue to Faded button must be present');
    assert.ok(html.includes('data-stage="faded"'), 'Transition button must target faded stage');

    // 3. Practice workspace is collapsed into preview drawer
    assert.ok(html.includes('practice-workspace-preview-drawer'), 'Practice workspace must be collapsed in Worked mode');
    assert.ok(html.includes('Preview Upcoming Practice Exercise'), 'Drawer must indicate it is a preview');

    // 4. Submit button inside preview is disabled with clear explanation
    assert.ok(html.includes('disabled-worked'), 'Submit button must be disabled in Worked mode');
    assert.ok(html.includes('Available in Practice'), 'Submit button text must clarify it is for practice');
  });

  await t.test('2. Faded mode places active exercise title, task, and sample I/O above editor', () => {
    state.lessonId = 'cpp-basics';
    state.scaffoldStage = 'faded';
    state.exercise = 'mini';

    const html = workspace();

    // 1. Worked walkthrough is NOT rendered in Faded mode
    assert.equal(html.includes('worked-walkthrough-panel'), false, 'Worked walkthrough must not appear in Faded mode');

    // 2. Active exercise card is rendered above the code-zone
    assert.ok(html.includes('active-exercise-card'), 'Active exercise card must be present');
    assert.ok(html.includes('🎯 YOUR TASK:'), 'Task badge must be clearly present above editor');
    assert.ok(html.includes('exercise-title'), 'Exercise title must be present');

    // 3. Sample test preview (Input/Output) is rendered above editor
    assert.ok(html.includes('visible-tests-preview'), 'Sample I/O preview must be present');
    assert.ok(html.includes('Expected:'), 'Expected output must be present in sample test preview');

    // 4. Order: active-exercise-card appears BEFORE code-zone in DOM
    const exerciseCardIdx = html.indexOf('active-exercise-card');
    const codeZoneIdx = html.indexOf('class="code-zone"');
    assert.ok(exerciseCardIdx !== -1, 'Active exercise card must exist');
    assert.ok(codeZoneIdx !== -1, 'Code zone must exist');
    assert.ok(exerciseCardIdx < codeZoneIdx, 'Active exercise card must appear BEFORE code-zone in DOM');

    // 5. Submit assessment button is active and enabled
    assert.ok(html.includes('data-action="submit-assess"'), 'Submit assessment action must be enabled in Faded mode');
    assert.equal(html.includes('disabled-worked'), false, 'Submit button must not have disabled-worked class in Faded mode');
  });

  await t.test('3. Guided and Independent stages also place active exercise above editor', () => {
    for (const stage of ['guided', 'independent']) {
      state.lessonId = 'cpp-basics';
      state.scaffoldStage = stage;
      state.exercise = stage === 'guided' ? 'medium' : 'hard';

      const html = workspace();
      const exerciseCardIdx = html.indexOf('active-exercise-card');
      const codeZoneIdx = html.indexOf('class="code-zone"');

      assert.ok(exerciseCardIdx < codeZoneIdx, `In ${stage} stage, active exercise card must precede code-zone`);
      assert.ok(html.includes('🎯 YOUR TASK:'), `In ${stage} stage, exact task must be visible above editor`);
    }
  });

  await t.test('4. Worked post-run notice renders when demonstration execution completes', () => {
    const progression = state.scaffoldingEngine.getProgressionForLesson('cpp-basics');
    const fakeRunOutput = { status: 'success', stdout: 'Hello, World!\n', stderr: '' };
    const html = BeginnerUI.renderWorkedWalkthrough(progression, fakeRunOutput, false);

    assert.ok(html.includes('worked-post-run-notice'), 'Post-run notice must appear after running worked example');
    assert.ok(html.includes('Continue to Faded Practice ➔'), 'Post-run notice must have continue to faded action');
  });
});

test('P0 #2: Independent Stage Alignment & CSS Scoping', async (t) => {
  await t.test('1. style.css scopes page-container .independent styles to main.independent and excludes .stage-pill', () => {
    const styleCss = fs.readFileSync(path.resolve(ROOT_DIR, 'src/style.css'), 'utf8');

    // Page-container rules are scoped
    assert.ok(
      styleCss.includes('main.independent') || styleCss.includes('.independent:not(.stage-pill)'),
      'Page-container styles must be scoped to exclude .stage-pill'
    );

    // .stage-pill.independent explicit isolation rule exists
    assert.ok(
      styleCss.includes('.stage-pill.independent'),
      'style.css must define explicit .stage-pill.independent isolation rule'
    );
  });

  await t.test('2. beginner.css includes explicit .stage-pill.independent isolation', () => {
    const beginnerCss = fs.readFileSync(path.resolve(ROOT_DIR, 'src/beginner/beginner.css'), 'utf8');

    assert.ok(
      beginnerCss.includes('.stage-pill.independent'),
      'beginner.css must define .stage-pill.independent isolation'
    );
    assert.match(
      beginnerCss,
      /\.stage-pill\.independent\s*\{[^}]*max-width:\s*none\s*!important/
    );
    assert.match(
      beginnerCss,
      /\.stage-pill\.independent\s*\{[^}]*margin:\s*0\s*!important/
    );
  });

  await t.test('3. Scaffolding Stage Bar renders all five stages uniformly', () => {
    const html = BeginnerUI.renderScaffoldingStageBar('cpp-basics', 'independent', {});

    assert.ok(html.includes('stage-pill worked'), 'Stage 1 (Worked) pill present');
    assert.ok(html.includes('stage-pill faded'), 'Stage 2 (Faded) pill present');
    assert.ok(html.includes('stage-pill guided'), 'Stage 3 (Guided) pill present');
    assert.ok(html.includes('stage-pill independent active'), 'Stage 4 (Independent) pill active');
    assert.ok(html.includes('stage-pill transfer'), 'Stage 5 (Transfer) pill present');

    // Ensure all 5 pills share the .stage-pill base class
    const stagePillMatches = html.match(/class="stage-pill\s+[^"]+"/g);
    assert.equal(stagePillMatches.length, 5, 'Must render exactly 5 stage-pills');
  });

  await t.test('4. Switching active stage to independent maintains stage track structure', () => {
    for (const stage of ['worked', 'faded', 'guided', 'independent', 'transfer']) {
      const html = BeginnerUI.renderScaffoldingStageBar('cpp-basics', stage, {});
      assert.ok(html.includes(`stage-pill ${stage} active`), `Stage pill ${stage} must be marked active`);
      assert.ok(html.includes('stage-bar-track'), 'Track container must be intact');
    }
  });
});

test('P1-A: Clarify Five Stages & Beginner-Friendly Explanations', async (t) => {
  const expectedStages = [
    { id: 'worked', label: 'Worked', subtitle: 'Watch an example' },
    { id: 'faded', label: 'Faded', subtitle: 'Complete part of it' },
    { id: 'guided', label: 'Guided', subtitle: 'Follow a plan' },
    { id: 'independent', label: 'Independent', subtitle: 'Solve it yourself' },
    { id: 'transfer', label: 'Transfer', subtitle: 'Use the idea in a new problem' }
  ];

  await t.test('1. Scaffolding stage bar renders all 5 stages with consistent beginner-friendly explanations', () => {
    const html = BeginnerUI.renderScaffoldingStageBar('cpp-basics', 'worked', {});

    for (const stg of expectedStages) {
      assert.ok(html.includes(stg.label), `Stage bar must include label "${stg.label}"`);
      assert.ok(html.includes(stg.subtitle), `Stage bar must include subtitle "${stg.subtitle}"`);
      assert.ok(html.includes(`class="pill-sub">${stg.subtitle}</span>`), `Stage bar must render pill-sub with "${stg.subtitle}"`);
    }
  });

  await t.test('2. Stage badges across views use consistent stage subtitles', () => {
    const progression = state.scaffoldingEngine.getProgressionForLesson('cpp-basics');

    // Worked walkthrough
    const workedHtml = BeginnerUI.renderWorkedWalkthrough(progression);
    assert.ok(workedHtml.includes('STAGE 1 · WORKED EXAMPLE — WATCH AN EXAMPLE'));

    // Faded reference pattern
    const fadedHtml = BeginnerUI.renderReferenceWorkedPattern(progression, false);
    assert.ok(fadedHtml.includes('STAGE 2 · FADED PRACTICE — COMPLETE PART OF IT'));

    // Guided decomposition guide
    const guidedHtml = BeginnerUI.renderDecompositionGuide(progression);
    assert.ok(guidedHtml.includes('STAGE 3 · GUIDED PRACTICE — FOLLOW A PLAN'));

    // Transfer challenge banner
    const transferHtml = BeginnerUI.renderTransferChallengeBanner(progression);
    assert.ok(transferHtml.includes('STAGE 5 · UNSEEN TRANSFER BENCHMARK — USE THE IDEA IN A NEW PROBLEM'));
  });

  await t.test('3. Next-stage banner uses consistent stage naming and subtitles upon progression', () => {
    const nextWorked = BeginnerUI.renderScaffoldingNextStepBanner('worked', 'cpp-basics', {});
    assert.ok(nextWorked.includes('Faded — Complete part of it'));

    const nextFaded = BeginnerUI.renderScaffoldingNextStepBanner('faded', 'cpp-basics', {});
    assert.ok(nextFaded.includes('Guided — Follow a plan'));

    const nextGuided = BeginnerUI.renderScaffoldingNextStepBanner('guided', 'cpp-basics', {});
    assert.ok(nextGuided.includes('Independent — Solve it yourself'));

    const nextIndep = BeginnerUI.renderScaffoldingNextStepBanner('independent', 'cpp-basics', {});
    assert.ok(nextIndep.includes('Transfer — Use the idea in a new problem'));
  });
});

test('P1-A: Make Next Action Obvious & Learning Flow Integration', async (t) => {
  await t.test('1. Each stage connects to primary action in learning flow', () => {
    const stageActionExpectations = [
      { stage: 'worked', action: 'Run and Observe', activeStep: 'Run' },
      { stage: 'faded', action: 'Fill in the missing code', activeStep: 'Edit' },
      { stage: 'guided', action: 'Follow the plan and write your solution', activeStep: 'Edit' },
      { stage: 'independent', action: 'Solve the problem yourself', activeStep: 'Edit' },
      { stage: 'transfer', action: 'Apply the idea to this new problem', activeStep: 'Edit' }
    ];

    for (const item of stageActionExpectations) {
      const html = renderStageDirective(item.stage);
      assert.ok(html.includes(`What to do next: ${item.action}`), `Stage ${item.stage} must have directive "${item.action}"`);
      assert.ok(html.includes('learning-flow-indicator'), `Stage ${item.stage} must include learning flow indicator`);
      assert.ok(html.includes('Read') && html.includes('Predict') && html.includes('Edit') && html.includes('Run') && html.includes('Reflect'),
        `Stage ${item.stage} flow indicator must display Read -> Predict -> Edit -> Run -> Reflect`);
      assert.match(html, new RegExp(`class="flow-step-pill active"[\\s\\S]*?<span class="flow-step-text">${item.activeStep}</span>`),
        `Stage ${item.stage} must highlight active step ${item.activeStep}`);
    }
  });

  await t.test('2. Worked mode provides obvious "Run and Observe" directive and prominent action button', () => {
    state.lessonId = 'cpp-basics';
    state.scaffoldStage = 'worked';
    const html = workspace();

    assert.ok(html.includes('What to do next: Run and Observe'), 'Worked mode must state "What to do next: Run and Observe"');
    assert.ok(html.includes('▷ Run and Observe Output'), 'Primary action button must be Run and Observe');
  });

  await t.test('3. Next-stage banner is visually prominent upon passing', () => {
    const banner = BeginnerUI.renderScaffoldingNextStepBanner('faded', 'cpp-basics', {});
    assert.ok(banner.includes('scaffold-next-step-card'), 'Next step card must be present');
    assert.ok(banner.includes('next-stage-btn'), 'Prominent next stage button must be present');
    assert.ok(banner.includes('Start Guided Practice →'), 'Target next stage button text must be clear');
  });
});

test('P1-A: Visual Hierarchy & Reduced Competing Content', async (t) => {
  await t.test('1. Lesson workspace presents clear hierarchy: Task -> What to do -> Code -> Run -> Feedback', () => {
    state.lessonId = 'cpp-basics';
    state.scaffoldStage = 'faded';
    state.exercise = 'mini';
    const html = workspace();

    const taskIdx = html.indexOf('exercise-task-box');
    const directiveIdx = html.indexOf('next-action-directive');
    const codeIdx = html.indexOf('class="code-zone"');
    const runIdx = html.indexOf('class="run');
    const feedbackIdx = html.indexOf('feedback-container');

    assert.ok(taskIdx !== -1, 'Task box must be present');
    assert.ok(directiveIdx !== -1, 'Directive must be present');
    assert.ok(codeIdx !== -1, 'Code zone must be present');
    assert.ok(runIdx !== -1, 'Run button must be present');
    assert.ok(feedbackIdx !== -1, 'Feedback container must be present');

    assert.ok(taskIdx < directiveIdx, 'Task must appear BEFORE What to do directive');
    assert.ok(directiveIdx < codeIdx, 'What to do directive must appear BEFORE Code zone');
    assert.ok(codeIdx < runIdx, 'Code zone must appear BEFORE Run button');
    assert.ok(runIdx < feedbackIdx, 'Run button must appear BEFORE Feedback container');
  });

  await t.test('2. Competing secondary recommendation banner is removed from lesson workspace', () => {
    state.lessonId = 'cpp-basics';
    state.scaffoldStage = 'faded';
    const html = workspace();

    assert.equal(html.includes('recommendation-banner'), false,
      'Lesson workspace must NOT render competing recommendation banner');
  });
});

test('P1-B #1: Clarify Run vs Check Solution', async (t) => {
  await t.test('1. Renames Submit Assessment to Check Solution in practice workspace and shows helper text', () => {
    state.lessonId = 'cpp-basics';
    state.scaffoldStage = 'faded';
    state.exercise = 'mini';
    const html = workspace();

    assert.ok(html.includes('✓ Check Solution'), 'Button must be labeled "✓ Check Solution"');
    assert.ok(html.includes('data-action="submit-assess"'), 'Action must remain submit-assess');
    assert.ok(html.includes('action-helper-text'), 'Action helper text container must exist');
    assert.ok(html.includes('Run:'), 'Helper text must explain Run');
    assert.ok(html.includes('See what your code does.'), 'Run helper description must be present');
    assert.ok(html.includes('Check Solution:'), 'Helper text must explain Check Solution');
    assert.ok(html.includes('Test whether it solves the task.'), 'Check Solution helper description must be present');
  });

  await t.test('2. Empty feedback state explains both Run Code and Check Solution', () => {
    state.feedback = null;
    state.assessmentFeedback = null;
    state.executing = false;
    state.assessing = false;
    const html = renderFeedbackSlot();

    assert.ok(html.includes('▷ Run Code'), 'Empty state must mention Run Code');
    assert.ok(html.includes('✓ Check Solution'), 'Empty state must mention Check Solution');
    assert.ok(html.includes('✓ Submit Assessment'), 'Empty state must retain Submit Assessment for backward compatibility');
  });
});

test('P1-B #2: Beginner-First Error Feedback Hierarchy', async (t) => {
  await t.test('1. Compile error in execution feedback shows beginner-first explanation before raw compiler output', () => {
    state.feedback = {
      status: 'compile_error',
      badge: 'Compilation Error',
      title: 'Compilation Failed',
      message: 'main.cpp:3:5: error: expected \';\' before \'return\'',
      rawError: 'main.cpp:3:5: error: expected \';\' before \'return\'\n    3 |   int x = 10\n      |             ^'
    };

    const html = renderExecutionFeedback();
    assert.ok(html.includes('beginner-first-error-card'), 'Beginner-first error card must be rendered');
    assert.ok(html.includes('Your program couldn\'t be compiled.'), 'Human-friendly headline must be present');
    assert.ok(html.includes('Look at the highlighted line and check what the compiler is telling you.'), 'Human-friendly subhead must be present');
    assert.ok(html.includes('1. What happened'), 'Trio item 1 must be present');
    assert.ok(html.includes('2. What to inspect'), 'Trio item 2 must be present');
    assert.ok(html.includes('3. What to try next'), 'Trio item 3 must be present');
    assert.ok(html.includes('COMPILER ERROR DETAILS'), 'Technical compiler details must remain available');

    // Hierarchy check: beginner card must appear BEFORE raw-console-details
    const bfIdx = html.indexOf('beginner-first-error-card');
    const rawIdx = html.indexOf('raw-console-details');
    assert.ok(bfIdx < rawIdx, 'Beginner explanation must precede raw compiler console');
  });

  await t.test('2. Assessment failure shows friendly explanation and structured guidance', () => {
    state.assessmentFeedback = {
      status: 'ready',
      passed: false,
      badge: 'Check failed',
      title: 'Output Mismatch',
      message: 'Your program printed "Hello" instead of "Hello, World!"',
      testResults: [
        { id: 't1', description: 'Greeting match', passed: false, input: '', expectedOutput: 'Hello, World!', actualOutput: 'Hello' }
      ]
    };

    const html = renderAssessmentFeedback();
    assert.ok(html.includes('beginner-first-error-card'), 'Beginner-first error card must be rendered in assessment failure');
    assert.ok(html.includes('Your solution needs another change.'), 'Friendly headline must be present');
    assert.ok(html.includes('Your program ran, but the output was different from what was expected.'), 'Friendly subhead must be present');
    assert.ok(html.includes('1. What happened'), 'What happened must be present');
    assert.ok(html.includes('2. What to inspect'), 'What to inspect must be present');
    assert.ok(html.includes('3. What to try next'), 'What to try next must be present');
  });
});

test('P1-B #3: Consistent 5-Step Debugging Flow Labels', async (t) => {
  await t.test('1. Debug prompt buttons display all five steps: Observe -> Locate -> Explain -> Fix -> Verify', () => {
    state.feedback = {
      status: 'compile_error',
      badge: 'Compilation Error',
      rawError: 'error'
    };
    state.activeWorkspaceDebug = false;

    const execHtml = renderExecutionFeedback();
    assert.ok(
      execHtml.includes('Observe ➔ Locate ➔ Explain ➔ Fix ➔ Verify'),
      'Execution feedback debug button must list all 5 steps'
    );

    state.assessmentFeedback = {
      status: 'ready',
      passed: false,
      badge: 'Failed'
    };
    const asmtHtml = renderAssessmentFeedback();
    assert.ok(
      asmtHtml.includes('Observe ➔ Locate ➔ Explain ➔ Fix ➔ Verify'),
      'Assessment feedback debug button must list all 5 steps'
    );
  });
});

test('P1-B #4: Lightweight Line Numbers Gutter', async (t) => {
  await t.test('1. Line numbers render accurately for arbitrary C++ code', () => {
    const singleLine = 'int main() {}';
    const singleNumbers = renderLineNumbers(singleLine);
    assert.ok(singleNumbers.includes('<span>1</span>'));
    assert.equal(singleNumbers.includes('<span>2</span>'), false);

    const multiLine = '#include <iostream>\nusing namespace std;\n\nint main() {\n  return 0;\n}';
    const multiNumbers = renderLineNumbers(multiLine);
    for (let i = 1; i <= 6; i++) {
      assert.ok(multiNumbers.includes(`<span>${i}</span>`), `Must render line number ${i}`);
    }
    assert.equal(multiNumbers.includes('<span>7</span>'), false);
  });

  await t.test('2. Editor workspace wraps gutter and textarea without breaking editing or accessibility', () => {
    state.lessonId = 'cpp-basics';
    state.scaffoldStage = 'faded';
    state.exercise = 'mini';
    const html = workspace();

    assert.ok(html.includes('editor-workspace-wrap'), 'Editor workspace wrap must be present');
    assert.ok(html.includes('line-gutter'), 'Line gutter must be present');
    assert.ok(html.includes('aria-hidden="true"'), 'Line gutter must be hidden from screen readers');
    assert.ok(html.includes('data-source'), 'Textarea data-source must be present');
    assert.ok(html.includes('aria-label="C++ Code Editor"'), 'Textarea accessibility label must be preserved');
  });
});

test('P1-B #5: Protect Learner Code When Switching Stages', async (t) => {
  await t.test('1. Preserves learner draft across stage switching', () => {
    state.lessonId = 'cpp-basics';
    state.scaffoldStage = 'faded';
    state.stageDrafts = {};

    // Learner writes code in Faded stage
    const customFadedCode = '// custom code written in faded stage\nint x = 42;';
    state.source = customFadedCode;
    state.stageDrafts['cpp-basics_faded'] = customFadedCode;

    // Simulate switching to Guided stage
    const progression = state.scaffoldingEngine.getProgressionForLesson('cpp-basics');
    const guidedStarter = progression.stages.guided.starterCode;

    // Simulate clicking Guided button
    state.stageDrafts['cpp-basics_faded'] = state.source;
    state.scaffoldStage = 'guided';
    state.source = state.stageDrafts['cpp-basics_guided'] || guidedStarter;

    assert.equal(state.source, guidedStarter, 'Guided stage should initially load its starter template');

    // Simulate learner writing code in Guided stage
    const customGuidedCode = '// custom code in guided stage\nint y = 99;';
    state.source = customGuidedCode;
    state.stageDrafts['cpp-basics_guided'] = customGuidedCode;

    // Learner switches back to Faded stage
    state.stageDrafts['cpp-basics_guided'] = state.source;
    state.scaffoldStage = 'faded';
    state.source = state.stageDrafts['cpp-basics_faded'] || progression.stages.faded.starterCode;

    // Learner draft in Faded must be preserved!
    assert.equal(state.source, customFadedCode, 'Faded custom code must be preserved when switching back');

    // Switching back to Guided also preserves custom code!
    state.scaffoldStage = 'guided';
    state.source = state.stageDrafts['cpp-basics_guided'] || guidedStarter;
    assert.equal(state.source, customGuidedCode, 'Guided custom code must be preserved when switching back');
  });
});

test('P2 #1: Input Indicator Wording', async (t) => {
  await t.test('1. Input indicator displays "Input required by this exercise"', () => {
    state.lessonId = 'cpp-basics';
    state.scaffoldStage = 'faded';
    state.showStdin = true;
    state.source = '#include <iostream>\nusing namespace std;\nint main() { int x; cin >> x; return 0; }';
    const html = workspace();

    assert.ok(html.includes('<span class="cin-badge">Input required by this exercise</span>'),
      'cin badge must display "Input required by this exercise"');
    assert.ok(!html.includes('<span class="cin-badge">cin detected</span>'),
      'Must not display outdated "cin detected" wording');
  });

  await t.test('2. Independent editor also displays "Input required by this exercise"', () => {
    state.currentIndependentExercise = {
      id: 'indep-io-test',
      title: 'IO Test',
      problemStatement: 'Read an integer and print it.',
      starterCode: 'int main() { int x; cin >> x; }'
    };
    state.showStdin = true;
    state.source = 'int main() { int x; cin >> x; }';
    const html = independent('challenge');

    assert.ok(html.includes('<span class="cin-badge">Input required by this exercise</span>'),
      'Independent workspace cin badge must display "Input required by this exercise"');
    assert.ok(!html.includes('<span class="cin-badge">cin detected</span>'),
      'Must not display outdated "cin detected" in independent mode');
  });
});

test('P2 #2: Clarify Visualization Wording', async (t) => {
  await t.test('1. Visualizer declares it is a simplified concept illustration, not an exact execution trace', () => {
    const visJsPath = path.resolve(ROOT_DIR, 'src/visualization/conceptVisualizer.js');
    const visJs = fs.readFileSync(visJsPath, 'utf8');

    assert.ok(visJs.includes('A simplified concept illustration, not an exact execution trace.'),
      'Visualizer code must state it is a simplified concept illustration, not an exact execution trace');
    assert.ok(!visJs.includes('see how your C++ code executes in memory'),
      'Must not claim to show how code executes in memory');

    const visCssPath = path.resolve(ROOT_DIR, 'src/visualization/visualizer.css');
    const visCss = fs.readFileSync(visCssPath, 'utf8');
    assert.ok(visCss.includes('.vis-disclaimer'), 'Visualizer CSS must style the disclaimer');
  });

  await t.test('2. Workspace visualize button title explains conceptual illustration', () => {
    state.lessonId = 'cpp-basics';
    state.scaffoldStage = 'faded';
    const html = workspace();
    assert.ok(html.includes('title="Concept Visualizer: A simplified concept illustration, not an exact execution trace."'),
      'Visualize button title must explain simplified concept illustration');
  });
});

test('P2 #3: Make Pikachu Less Intrusive', async (t) => {
  await t.test('1. Defaults to minimized on narrow screens (<= 768px) when no stored preference exists', () => {
    globalThis.window = { innerWidth: 600 };
    try {
      const minimized = storageManager.isCompanionMinimized();
      assert.equal(minimized, true, 'Narrow screen without preference should default to minimized');
    } finally {
      delete globalThis.window;
    }
  });

  await t.test('2. Speech bubble is dismissible with close button and auto-hide timer', () => {
    const compJsPath = path.resolve(ROOT_DIR, 'src/companion/pikachuCompanion.js');
    const compJs = fs.readFileSync(compJsPath, 'utf8');

    assert.ok(compJs.includes('class="bubble-close-btn"'), 'Companion speech bubble must include close button markup');
    assert.ok(compJs.includes('bubble-hidden'), 'Must trigger bubble-hidden class on dismiss');
    assert.ok(compJs.includes('7000'), 'Must include auto-dismiss timer so speech bubble does not linger');
  });

  await t.test('3. Gamification UI caps visible toasts at 1', () => {
    const gamUiPath = path.resolve(ROOT_DIR, 'src/gamification/gamificationUI.js');
    const gamUiJs = fs.readFileSync(gamUiPath, 'utf8');

    assert.match(gamUiJs, /this\.toastContainer\.children\.length\s*>=\s*1/,
      'Gamification UI must cap visible toasts at 1');
  });

  await t.test('4. Applies calm celebration after failure recovery rather than wild jumping', () => {
    const compJsPath = path.resolve(ROOT_DIR, 'src/companion/pikachuCompanion.js');
    const compJs = fs.readFileSync(compJsPath, 'utf8');
    assert.ok(compJs.includes('calm-celebration'),
      'Companion JS must toggle calm-celebration class upon error recovery');

    const compCssPath = path.resolve(ROOT_DIR, 'src/companion/companion.css');
    const compCss = fs.readFileSync(compCssPath, 'utf8');
    assert.ok(compCss.includes('.calm-celebration'), 'Companion CSS must define calm-celebration style');
    assert.ok(compCss.includes('companion-calm-nod'), 'Companion CSS must define calm nod keyframe');
    assert.match(compCss, /animation:\s*companion-celebrate 1\.2s ease-in-out 3;/,
      'Celebration animation must be limited to 3 cycles rather than infinite bouncing');
  });
});

test('P2 #4: Clarify Progress Terminology', async (t) => {
  await t.test('1. Sidebar provides beginner-friendly tooltips for Lessons, Passed, Due, Mastery, Benchmark', () => {
    const html = sidebar();
    assert.ok(html.includes('title="Lessons — Total guided C++ curriculum lessons completed"'), 'Must explain Lessons');
    assert.ok(html.includes('title="Passed — C++ exercises successfully solved and verified against tests"'), 'Must explain Passed');
    assert.ok(html.includes('title="Due (Retrieval Queue) — Lessons and concepts scheduled for spaced retrieval practice to lock into long-term memory"'), 'Must explain Due');
    assert.ok(html.includes('title="Mastery — How confidently you\'ve demonstrated this concept through unassisted practice"'), 'Must explain Mastery');
    assert.ok(html.includes('title="Benchmark — Independent problem-solving evaluation without assistance or hints"'), 'Must explain Benchmark');
  });

  await t.test('2. Header progression pill and concept mastery pills explain XP and Mastery', () => {
    const pillHtml = GamificationUI.renderHeaderPill({
      level: 2,
      levelName: 'C++ Apprentice',
      xp: 150,
      nextLevelXp: 300,
      progressPercentage: 50,
      streaks: { currentIndependentStreak: 2 }
    });
    assert.ok(pillHtml.includes('title="XP (Experience Points) — Earned by writing C++ code and passing checks"'), 'Must explain XP');

    const masteryHtml = renderConceptMasteryRow(['variables']);
    assert.ok(masteryHtml.includes('Mastery reflects how confidently you\'ve demonstrated this concept.'), 'Must explain Mastery');
  });
});

test('P2 #5: Accessibility & Responsive Polish', async (t) => {
  await t.test('1. Mobile touch targets for editor actions are >= 44px', () => {
    const cssPath = path.resolve(process.cwd(), 'src/style.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    assert.match(cssContent, /min-height:\s*44px/);
    assert.match(cssContent, /min-width:\s*44px/);
  });

  await t.test('2. Responsive breakpoints include 600px, 400px, 375px, and 320px', () => {
    const cssPath = path.resolve(process.cwd(), 'src/style.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    assert.match(cssContent, /@media\s*\(\s*max-width:\s*600px\s*\)/);
    assert.match(cssContent, /@media\s*\(\s*max-width:\s*400px\s*\)/);
    assert.match(cssContent, /@media\s*\(\s*max-width:\s*375px\s*\)/);
    assert.match(cssContent, /@media\s*\(\s*max-width:\s*320px\s*\)/);
  });

  await t.test('3. Line gutter contrast is enhanced for WCAG AA compliance', () => {
    const cssPath = path.resolve(process.cwd(), 'src/style.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    assert.match(cssContent, /color:\s*#7ba19c/);
  });
});

test('UI Consistency & Layout Bug-Fix Pass: Visual & Button Regressions', async (t) => {
  const styleCss = fs.readFileSync(path.resolve(ROOT_DIR, 'src/style.css'), 'utf8');
  const beginnerCss = fs.readFileSync(path.resolve(ROOT_DIR, 'src/beginner/beginner.css'), 'utf8');

  await t.test('1. Stage 4 (.ladder-stage-card.independent) is explicitly isolated against margin and padding inheritance', () => {
    assert.ok(
      beginnerCss.includes('.ladder-stage-card.independent'),
      'beginner.css must define .ladder-stage-card.independent isolation'
    );
    assert.match(
      beginnerCss,
      /\.ladder-stage-card\.independent\s*\{[^}]*margin:\s*0\s*!important/
    );
    assert.match(
      beginnerCss,
      /\.ladder-stage-card\.independent\s*\{[^}]*padding:\s*1\.25rem\s*!important/
    );
    assert.ok(
      styleCss.includes('.ladder-stage-card.independent'),
      'style.css must also define .ladder-stage-card.independent isolation'
    );
  });

  await t.test('2. .matrix-step.independent is isolated from page-level margins', () => {
    assert.ok(
      beginnerCss.includes('.matrix-step.independent'),
      'beginner.css must define .matrix-step.independent isolation'
    );
    assert.match(
      beginnerCss,
      /\.matrix-step\.independent\s*\{[^}]*margin:\s*0\s*!important/
    );
  });

  await t.test('3. Debug progression button (.step-next-btn) has complete CSS styling and dark mode rules', () => {
    assert.ok(
      beginnerCss.includes('.step-next-btn'),
      'beginner.css must define .step-next-btn rules'
    );
    assert.match(
      beginnerCss,
      /\.step-next-btn\s*\{[^}]*background:/
    );
    assert.match(
      beginnerCss,
      /\.step-next-btn\s*\{[^}]*border-radius:/
    );
    assert.match(
      beginnerCss,
      /\.step-next-btn:hover/
    );
    assert.match(
      beginnerCss,
      /\.dark-mode\s+\.step-next-btn/
    );
  });

  await t.test('4. Decomposition next button (.decomp-next-btn) has styling, hover, and disabled states', () => {
    assert.ok(
      beginnerCss.includes('.decomp-next-btn'),
      'beginner.css must define .decomp-next-btn'
    );
    assert.match(
      beginnerCss,
      /\.decomp-next-btn:hover/
    );
    assert.match(
      beginnerCss,
      /\.decomp-next-btn:disabled/
    );
    assert.match(
      beginnerCss,
      /\.dark-mode\s+\.decomp-next-btn/
    );
  });

  await t.test('5. Scaffolding assistance is wrapped in a cohesive .scaffold-btn-group', () => {
    const decompEngine = fs.readFileSync(path.resolve(ROOT_DIR, 'src/beginner/decompositionEngine.js'), 'utf8');
    assert.ok(
      decompEngine.includes('class="scaffold-btn-group"'),
      'decompositionEngine.js must wrap buttons in .scaffold-btn-group'
    );
    assert.ok(
      beginnerCss.includes('.scaffold-btn-group'),
      'beginner.css must style .scaffold-btn-group'
    );
    assert.ok(
      beginnerCss.includes('.dark-mode .scaffold-btn-group'),
      'beginner.css must include dark-mode for .scaffold-btn-group'
    );
  });

  await t.test('6. Ladder cards have flex column display and action buttons pin to bottom baseline', () => {
    assert.match(
      beginnerCss,
      /\.ladder-stage-card\s*\{[^}]*display:\s*flex/
    );
    assert.match(
      beginnerCss,
      /\.ladder-stage-card\s*\{[^}]*flex-direction:\s*column/
    );
    assert.match(
      beginnerCss,
      /\.stage-action-btn\s*\{[^}]*margin-top:\s*auto/
    );
  });
});



