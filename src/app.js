import { lessons, modules, mastery, masteryExercises } from './courseData.js';
import { exerciseCatalog, getExerciseById } from './exerciseData.js';
import {
  assessCppSource,
  formatExecutionFeedback,
  formatAssessmentFeedback,
  getAdjacentLessonIds,
  nextDifficulty,
  scrollToLearningWorkspace,
  updateLearnerProfile,
  getAdaptiveRecommendation,
  migrateProfile,
  eventBus,
  LEARNING_EVENTS
} from './learningEngine.js';
import { companionController, initPikachuCompanion } from './companion/index.js';
import { ConceptVisualizer } from './visualization/index.js';
import { GamificationEngine, GamificationUI } from './gamification/index.js';
import { getUnseenBenchmarkProblem, benchmarkBattery } from './benchmark/index.js';
import { storageManager } from './storageManager.js';
import {
  OnboardingEngine,
  MentalModelsEngine,
  VocabularyEngine,
  WhyExplanationEngine,
  PredictEngine,
  DebugEngine,
  DecompositionEngine,
  ScaffoldingEngine,
  BeginnerUI,
  INPUT_LAB_SNIPPETS,
  LESSON_WORKED_EXAMPLES,
  getTransferBenchmarkForLesson
} from './beginner/index.js';

const app = typeof document !== 'undefined' ? document.querySelector('#app') : null;
const migratedStored = storageManager.getProfile();
const savedTheme = storageManager.getTheme(
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
);

export const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

const practicePool = [
  exerciseCatalog['cpp-basics-hard'],
  exerciseCatalog['functions-mini'],
  exerciseCatalog['keywords-medium'],
  exerciseCatalog['combined-classes-constructors']
].filter(Boolean);

const challengePool = [
  exerciseCatalog['keywords-hard'],
  exerciseCatalog['classes-mini'],
  exerciseCatalog['constructors-mini'],
  exerciseCatalog['combined-classes-arrays'],
  exerciseCatalog['combined-inheritance-virtual']
].filter(Boolean);

const getCompletedList = () => {
  try {
    return state?.profile?.completed || migratedStored?.completed || [];
  } catch (_e) {
    return migratedStored?.completed || [];
  }
};

const selectFromPool = (pool, completedList) => {
  if (!pool || pool.length === 0) return null;
  const completed = Array.isArray(completedList) ? completedList : getCompletedList();
  const unseen = pool.filter(ex => !completed.includes(ex.id));
  const candidates = unseen.length > 0 ? unseen : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
};

const getIndependentExercise = (mode) => {
  if (mode === 'benchmark') {
    return getUnseenBenchmarkProblem(getCompletedList()) || benchmarkBattery[0];
  }
  if (mode === 'mastery') {
    return selectFromPool(masteryExercises) || exerciseCatalog['mastery-student-manager'];
  }
  if (mode === 'challenge') return selectFromPool(challengePool);
  return selectFromPool(practicePool);
};

const state = {
  profile: migratedStored,
  theme: savedTheme,
  lessonId: 'cpp-basics',
  mode: (migratedStored?.completed?.length === 0 && !migratedStored?.beginner?.onboarding?.completed && !migratedStored?.beginner?.onboarding?.skipped) ? 'beginner' : 'course',
  previousMode: 'course',
  source: lessons[0].example,
  stdin: '',
  showStdin: false,
  feedback: null,
  assessmentFeedback: null,
  executing: false,
  assessing: false,
  executionStage: 'idle',
  hintIndex: 0,
  showSolution: false,
  exercise: 'mini',
  jumpToWorkspace: false,
  currentIndependentExercise: getIndependentExercise('practice'),
  currentIsRetrieval: false,
  showVisualizer: false,
  beginnerTab: 'onboarding',
  onboardingEngine: new OnboardingEngine({
    initialStep: migratedStored?.beginner?.onboarding?.currentStep || 0,
    completed: migratedStored?.beginner?.onboarding?.completed || false,
    skipped: migratedStored?.beginner?.onboarding?.skipped || false,
    eventBus
  }),
  predictEngine: new PredictEngine({ eventBus }),
  debugEngine: new DebugEngine({ eventBus }),
  decompositionEngine: new DecompositionEngine({ eventBus }),
  scaffoldingEngine: new ScaffoldingEngine({ eventBus }),
  contextualToken: null,
  inputLab: {
    snippetKey: 'doubler',
    inputValue: '7',
    executing: false,
    output: null,
    history: []
  },
  scaffoldStage: 'worked',
  workedRunOutput: null,
  workedExecuting: false,
  refPatternOpen: false,
  activeDecompositionPlan: null,
  activeWorkspaceDebug: false
};

let visualizer = null;
if (typeof document !== 'undefined') {
  visualizer = new ConceptVisualizer({
    onLoadDemo: (code) => {
      state.source = code;
      render();
      addLessonNavigation();
    },
    onClose: () => {
      state.showVisualizer = false;
      render();
      addLessonNavigation();
    }
  });
}

export const gamificationEngine = new GamificationEngine({
  state: migratedStored.gamification,
  eventBus,
  onSave: (gamificationState) => {
    state.profile.gamification = gamificationState;
    save();
  }
});

// Sync initial level and level name to companion controller
if (gamificationEngine.state?.level) {
  companionController.setLevel(gamificationEngine.state.level, gamificationEngine.state.levelName);
}


let gamificationUI = null;
if (typeof document !== 'undefined') {
  gamificationUI = new GamificationUI({ engine: gamificationEngine, eventBus });

  // Update header pill in place on progress updates
  gamificationEngine.subscribe((snapshot) => {
    const slot = document.querySelector('.progression-pill-slot');
    if (slot) {
      slot.innerHTML = GamificationUI.renderHeaderPill(snapshot);
    }
  });

  // Transition companion to ultimate mastery on curriculum completion
  eventBus.on(LEARNING_EVENTS.CURRICULUM_COMPLETED, () => {
    companionController.transitionTo('ULTIMATE_MASTERY', {
      sourceEvent: LEARNING_EVENTS.CURRICULUM_COMPLETED
    });
  });
}

const current = () => lessons.find(l => l.id === state.lessonId);
const currentExercise = () => {
  const l = current();
  if (l && l.exercises && l.exercises[state.exercise]) {
    return l.exercises[state.exercise];
  }
  return null;
};

export const detectCin = (source, exercise) => {
  const codeHasCin = typeof source === 'string' && /\bcin\b/.test(source);
  const exHasCin = exercise && (
    (Array.isArray(exercise.concepts) && exercise.concepts.includes('cin')) ||
    (typeof exercise.problemStatement === 'string' && /\bcin\b/.test(exercise.problemStatement)) ||
    (typeof exercise.starterCode === 'string' && /\bcin\b/.test(exercise.starterCode)) ||
    (typeof exercise.inputFormat === 'string' && !/none/i.test(exercise.inputFormat) && exercise.inputFormat.trim().length > 0)
  );
  return Boolean(codeHasCin || exHasCin);
};

export const checkAndAutoOpenStdin = () => {
  const ex = state.mode === 'course' ? currentExercise() : state.currentIndependentExercise;
  if (detectCin(state.source, ex)) {
    state.showStdin = true;
  }
};

const save = () => {
  if (gamificationEngine) {
    state.profile.gamification = gamificationEngine.state;
  }
  if (!state.profile.beginner) {
    state.profile.beginner = {
      onboarding: { completed: false, currentStep: 0, skipped: false },
      mentalModelsViewed: [],
      predictionsCompleted: 0,
      predictionsCorrect: 0,
      debugsCompleted: 0,
      decompositionsCompleted: 0,
      scaffoldHistory: {}
    };
  }
  state.profile.beginner.onboarding = {
    completed: state.onboardingEngine.completed,
    currentStep: state.onboardingEngine.currentStep,
    skipped: state.onboardingEngine.skipped
  };
  state.profile.beginner.mentalModelsViewed = Array.isArray(state.profile.beginner.mentalModelsViewed)
    ? state.profile.beginner.mentalModelsViewed
    : [];
  state.profile.beginner.predictionsCompleted = Number(state.profile.beginner.predictionsCompleted) || 0;
  state.profile.beginner.predictionsCorrect = Number(state.profile.beginner.predictionsCorrect) || 0;
  state.profile.beginner.debugsCompleted = Number(state.profile.beginner.debugsCompleted) || 0;
  state.profile.beginner.decompositionsCompleted = Number(state.profile.beginner.decompositionsCompleted) || 0;
  state.profile.beginner.scaffoldHistory = (state.profile.beginner.scaffoldHistory && typeof state.profile.beginner.scaffoldHistory === 'object')
    ? state.profile.beginner.scaffoldHistory
    : {};

  storageManager.saveProfile(state.profile);
};
const esc = value => (value || '').replace(/[&<>]/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[x]));

const sidebar = () => {
  const stats = state.profile.stats || {};
  return `<aside role="navigation" aria-label="Course and mode navigation">
    <div class="brand"><span>✦</span> CodeBloom <b>C++</b></div>
    <button class="nav ${state.mode === 'course' ? 'active' : ''}" data-action="mode" data-mode="course">▦ &nbsp; Learning path</button>
    <button class="nav ${state.mode === 'beginner' ? 'active' : ''}" data-action="mode" data-mode="beginner">🌱 &nbsp; Beginner Hub</button>
    <button class="nav ${state.mode === 'practice' ? 'active' : ''}" data-action="mode" data-mode="practice">⌁ &nbsp; Practice lab</button>
    <button class="nav ${state.mode === 'challenge' ? 'active' : ''}" data-action="mode" data-mode="challenge">⚡ &nbsp; Challenge mode</button>
    <button class="nav ${state.mode === 'mastery' ? 'active' : ''}" data-action="mode" data-mode="mastery">🏆 &nbsp; Mastery test</button>
    <button class="nav ${state.mode === 'benchmark' ? 'active' : ''}" data-action="mode" data-mode="benchmark">🔬 &nbsp; Benchmark</button>
    <div class="divider"></div>
    <p class="overline">YOUR JOURNEY</p>
    <div class="progress-ring"><strong>${state.profile.completed.length}</strong><span>/ 20 lessons</span></div>
    <div class="sidebar-stats">
      <div class="stat-pill"><small>SOLUTIONS</small> <b>${stats.passedSubmissions || 0} passed</b></div>
      <div class="stat-pill"><small>RETRIEVAL QUEUE</small> <b>${(state.profile.retrievalQueue || []).length} due</b></div>
    </div>
    <p class="tiny">Every line you write is progress.</p>
  </aside>`;
};

const map = () => `<section class="map"><div class="eyebrow">YOUR LEARNING PATH</div><h1>Write C++. <em>Don’t just read it.</em></h1><p class="lead">Short lessons, real typing, automated assessment against test cases. Build the habit of turning questions into working programs.</p><div class="module-grid">${modules.map((m, i) => `<article class="module ${m.color}"><span>MODULE 0${i + 1} · LESSONS ${m.range}</span><h3>${m.name}</h3><p>${lessons.filter(l => l.module === m.name).map(l => l.title).join(' · ')}</p><button data-action="pick-module" data-module="${m.name}">Start module →</button></article>`).join('')}</div></section>`;

const lessonList = () => `<section class="lesson-list"><div class="list-top"><span class="eyebrow">LESSONS</span><span>${state.profile.completed.length}/20 complete</span></div>${lessons.map((l, i) => `<button class="lesson-item ${l.id === state.lessonId ? 'selected' : ''}" data-action="lesson" data-id="${l.id}"><span class="number">${String(i + 1).padStart(2,'0')}</span><span>${l.title}<small>${state.profile.completed.includes(l.id) ? 'Complete · ready to revisit' : l.module}</small></span>${state.profile.completed.includes(l.id) ? '<i>✓</i>' : ''}</button>`).join('')}</section>`;

const renderRecommendationBanner = () => {
  const rec = getAdaptiveRecommendation(state.profile, state.lessonId, exerciseCatalog);
  if (!rec || !rec.exercise) return '';

  return `
    <div class="recommendation-banner ${rec.type}">
      <div class="rec-icon">${rec.type === 'remediation' ? '🛠️' : rec.type === 'retrieval' ? '🔄' : rec.type === 'stretch' ? '🚀' : '🎯'}</div>
      <div class="rec-content">
        <div class="rec-top-row">
          <span class="rec-badge ${rec.type}">${rec.type.toUpperCase()} RECOMMENDATION</span>
          <strong class="rec-title">${esc(rec.exercise.title)}</strong>
        </div>
        <p class="rec-reason">${esc(rec.reason)}</p>
      </div>
      <button class="rec-btn" data-action="pick-recommended" data-exercise-id="${esc(rec.exerciseId)}">Practice This →</button>
    </div>
  `;
};

const renderConceptMasteryRow = (concepts = [], hide = false) => {
  if (hide || !concepts || concepts.length === 0) return '';
  return `
    <div class="concept-mastery-row">
      <span class="concept-row-label">Target Concepts:</span>
      <div class="concept-pill-list">
        ${concepts.map(c => {
          const m = state.profile.conceptMastery?.[c];
          const levelNum = m?.level || 1;
          const levelName = m?.levelName || 'Introduced';
          return `<span class="concept-pill level-${levelNum}" title="${m?.reason || 'Concept progress'}">
            <b>${esc(c)}</b>
            <small>L${levelNum}: ${esc(levelName)}</small>
          </span>`;
        }).join('')}
      </div>
    </div>
  `;
};

export const renderProblemSpecs = (exercise) => {
  if (!exercise) return '';
  const hasConstraints = exercise.constraints && exercise.constraints.length > 0;
  const hasInputFormat = Boolean(exercise.inputFormat);
  const hasOutputFormat = Boolean(exercise.outputFormat);
  if (!hasConstraints && !hasInputFormat && !hasOutputFormat) return '';

  return `
    <div class="problem-specs">
      ${hasConstraints ? `
        <div class="spec-group">
          <span class="spec-label">Constraints</span>
          <ul class="spec-list">
            ${exercise.constraints.map(c => `<li>${esc(c)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      ${hasInputFormat || hasOutputFormat ? `
        <div class="spec-group io-spec">
          ${hasInputFormat ? `<div><span class="spec-label">Input:</span> <span>${esc(exercise.inputFormat)}</span></div>` : ''}
          ${hasOutputFormat ? `<div><span class="spec-label">Output:</span> <span>${esc(exercise.outputFormat)}</span></div>` : ''}
        </div>
      ` : ''}
    </div>
  `;
};

export const renderExecutionFeedback = () => {
  if (state.executing) {
    return `
      <div class="feedback running" role="status" aria-label="Program executing">
        <div class="pipeline-flow">
          <div class="pipeline-step ${state.executionStage === 'compiling' ? 'active' : 'completed'}">
            <span class="step-badge">1</span>
            <span class="step-label">Compile</span>
          </div>
          <span class="pipeline-arrow">➔</span>
          <div class="pipeline-step ${state.executionStage === 'running' ? 'active' : ''}">
            <span class="step-badge">2</span>
            <span class="step-label">Execute</span>
          </div>
          <span class="pipeline-arrow">➔</span>
          <div class="pipeline-step">
            <span class="step-badge">3</span>
            <span class="step-label">Result</span>
          </div>
        </div>
        <p class="pipeline-status-text">${state.executionStage === 'compiling' ? 'Compiling C++ source...' : 'Running program binary...'}</p>
      </div>
    `;
  }

  if (!state.feedback) return '';

  const f = state.feedback;
  const isSuccess = f.status === 'ready';
  const badgeClass = f.badge ? f.badge.toLowerCase().replace(/[^a-z0-9]+/g, '-') : (isSuccess ? 'success' : 'error');

  return `
    <div class="feedback ${f.status}" role="region" aria-label="Execution feedback">
      <div class="feedback-head">
        <span class="badge ${badgeClass}">${esc(f.badge || (isSuccess ? 'Success' : 'Check failed'))}</span>
        <b>${esc(f.title || (isSuccess ? 'Looking good' : 'One thing to fix'))}</b>
        ${f.executionTimeMs !== undefined && f.executionTimeMs !== null ? `<span class="execution-time">${f.executionTimeMs}ms</span>` : ''}
      </div>
      <p class="feedback-explanation">${esc(f.message || '')}</p>
      ${f.stdout ? `
        <div class="output-console stdout-console">
          <div class="console-label">STANDARD OUTPUT (STDOUT)</div>
          <pre><code>${esc(f.stdout)}</code></pre>
        </div>
      ` : ''}
      ${f.rawError ? `
        <details class="raw-console-details" ${!isSuccess ? 'open' : ''}>
          <summary class="console-label-summary">
            <span>${f.badge === 'Compilation Error' ? 'COMPILER ERROR DETAILS' : 'ERROR OUTPUT (STDERR)'}</span>
            <span class="details-chevron">▸ Click to toggle raw compiler output</span>
          </summary>
          <pre><code>${esc(f.rawError)}</code></pre>
        </details>
      ` : ''}
      ${!isSuccess && !state.activeWorkspaceDebug ? `
        <div class="workspace-debug-prompt">
          <button class="workspace-debug-trigger-btn" data-action="start-workspace-debug">
            🛠️ Walk Through 5-Step Debug Reasoning (Observe ➔ Locate ➔ Explain ➔ Fix)
          </button>
        </div>
      ` : ''}
    </div>
  `;
};

export const renderAssessmentFeedback = () => {
  if (state.assessing) {
    return `
      <div class="feedback running assessing" role="status" aria-label="Assessment running">
        <div class="pipeline-flow">
          <div class="pipeline-step completed">
            <span class="step-badge">1</span>
            <span class="step-label">Compile</span>
          </div>
          <span class="pipeline-arrow">➔</span>
          <div class="pipeline-step active">
            <span class="step-badge">2</span>
            <span class="step-label">Run Tests</span>
          </div>
          <span class="pipeline-arrow">➔</span>
          <div class="pipeline-step">
            <span class="step-badge">3</span>
            <span class="step-label">Assess</span>
          </div>
        </div>
        <p class="pipeline-status-text">Evaluating submission against visible and hidden test cases...</p>
      </div>
    `;
  }

  if (!state.assessmentFeedback) return '';

  const a = state.assessmentFeedback;
  const isSuccess = a.passed;
  const badgeClass = a.badge ? a.badge.toLowerCase().replace(/[^a-z0-9]+/g, '-') : (isSuccess ? 'success' : 'error');

  return `
    <div class="assessment-panel ${a.status}" role="region" aria-label="Assessment results">
      <div class="assessment-head">
        <span class="badge ${badgeClass}">${esc(a.badge)}</span>
        <b>${esc(a.title)}</b>
      </div>
      <p class="assessment-explanation">${esc(a.message)}</p>

      ${a.antiCheatWarning ? `
        <div class="anti-cheat-alert">
          <b>⚠️ Guidance Warning:</b> ${esc(a.antiCheatWarning)}
        </div>
      ` : ''}

      ${a.classifiedError ? `
        <div class="error-diagnosis-card">
          <div class="diag-header">🔍 WHAT TO INSPECT: ${esc(a.classifiedError.category.toUpperCase().replace(/_/g, ' '))}</div>
          <p class="diag-desc">${esc(a.classifiedError.description)}</p>
          <div class="diag-remedy"><b>Suggested Direction:</b> ${esc(a.classifiedError.remedy)}</div>
        </div>
      ` : ''}

      ${a.conceptChecks && a.conceptChecks.length > 0 ? `
        <div class="concept-checks-block">
          <span class="concept-checks-title">Concept Verification</span>
          <ul class="concept-checks-list">
            ${a.conceptChecks.map(c => `
              <li class="${c.passed ? 'check-passed' : 'check-failed'}">
                <span class="check-icon">${c.passed ? '✓' : '✕'}</span>
                <span>${esc(c.description)}</span>
                ${!c.passed ? `<small class="check-msg">${esc(c.message)}</small>` : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      ${a.testResults && a.testResults.length > 0 ? `
        <div class="test-suite-summary">
          <div class="test-suite-header">
            <span class="summary-title">Test Results (${a.summary?.passed || 0}/${a.summary?.total || a.testResults.length} Passed)</span>
            <span class="summary-badge ${a.passed ? 'all-passed' : 'has-failures'}">${a.passed ? 'ALL PASSED' : `${(a.summary?.total || a.testResults.length) - (a.summary?.passed || 0)} FAILED`}</span>
          </div>
          <div class="test-cases-drawer">
            ${a.testResults.map((tc, idx) => `
              <div class="test-case-card ${tc.passed ? 'passed' : 'failed'}">
                <div class="tc-top">
                  <span class="tc-badge ${tc.passed ? 'pass' : 'fail'}">${tc.passed ? '✓ PASS' : '✗ FAIL'}</span>
                  <span class="tc-name">Test ${idx + 1}: ${esc(tc.description)}</span>
                  ${tc.durationMs ? `<span class="tc-time">${tc.durationMs}ms</span>` : ''}
                </div>
                ${tc.isHidden ? `
                  <div class="tc-hidden-note">🔒 Hidden test case (inputs and outputs masked to verify genuine logic)</div>
                ` : `
                  <div class="tc-io-details">
                    <div><b>Input:</b> <code>${esc(tc.input || '(no input)')}</code></div>
                    <div><b>Expected:</b> <code>${esc(tc.expectedOutput)}</code></div>
                    <div><b>Your Output:</b> <code>${esc(tc.actualOutput || '(none)')}</code></div>
                  </div>
                `}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${a.rawError ? `
        <details class="raw-console-details" ${!isSuccess && !a.classifiedError ? 'open' : ''}>
          <summary class="console-label-summary">
            <span>COMPILER / RUNTIME DETAILS</span>
            <span class="details-chevron">▸ Click to toggle raw diagnostics</span>
          </summary>
          <pre><code>${esc(a.rawError)}</code></pre>
        </details>
      ` : ''}

      ${!isSuccess && !state.activeWorkspaceDebug ? `
        <div class="workspace-debug-prompt">
          <button class="workspace-debug-trigger-btn" data-action="start-workspace-debug">
            🛠️ Walk Through 5-Step Debug Reasoning (Observe ➔ Locate ➔ Explain ➔ Fix)
          </button>
        </div>
      ` : ''}

      ${isSuccess ? BeginnerUI.renderScaffoldingNextStepBanner(
        state.scaffoldStage || (state.mode === 'benchmark' ? 'transfer' : state.exercise === 'mini' ? 'faded' : state.exercise === 'medium' ? 'guided' : 'independent'),
        state.mode === 'course' ? (current()?.id || state.lessonId) : state.lessonId,
        state.profile
      ) : ''}
    </div>
  `;
};

export const renderFeedbackSlot = () => {
  if (state.activeWorkspaceDebug && state.debugEngine.isWorkspaceActive) {
    return BeginnerUI.renderWorkspaceDebugBridge(state.debugEngine);
  }
  if (state.executing) return renderExecutionFeedback();
  if (state.assessing) return renderAssessmentFeedback();
  if (state.assessmentFeedback) return renderAssessmentFeedback();
  if (state.feedback) return renderExecutionFeedback();

  return `
    <div class="feedback-empty-state" role="status" aria-label="Execution feedback ready">
      <div class="empty-state-icon">💡</div>
      <div class="empty-state-text">
        <strong>Ready to run your code</strong>
        <p>Click <b>▷ Run Code</b> to compile and test output, or <b>✓ Submit Assessment</b> to grade against test cases.</p>
      </div>
    </div>
  `;
};

export const renderTestPreview = (exercise) => {
  if (!exercise || !exercise.testCases) return '';
  const visible = exercise.testCases.filter(t => !t.isHidden);
  if (visible.length === 0) return '';

  return `
    <div class="visible-tests-preview" role="region" aria-label="Sample test cases">
      <span class="preview-title">Sample Test Cases (${visible.length} visible, ${exercise.testCases.length - visible.length} hidden)</span>
      <div class="sample-test-list">
        ${visible.map((t, idx) => `
          <div class="sample-test-item">
            <span class="sample-badge">Sample ${idx + 1}</span>
            <span class="sample-io">Input: <code>${esc(t.input || '(none)')}</code></span>
            <span class="sample-arrow">➔</span>
            <span class="sample-io">Expected: <code>${esc(t.expectedOutput)}</code></span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

const renderProgressiveHints = (exercise) => {
  if (!exercise || !exercise.hints || exercise.hints.length === 0) return '';
  if (state.hintIndex === 0) return '';

  const activeHints = exercise.hints.slice(0, state.hintIndex);

  return `
    <div class="hints-accordion">
      <div class="hints-accordion-header">
        <span>💡 Progressive Hints (${activeHints.length} of ${exercise.hints.length} revealed)</span>
      </div>
      <div class="hint-step-list">
        ${activeHints.map((hintText, idx) => `
          <div class="hint-step-item">
            <span class="hint-num">Hint ${idx + 1}</span>
            <span class="hint-content">${esc(hintText)}</span>
          </div>
        `).join('')}
      </div>

      ${state.hintIndex >= exercise.hints.length && !state.showSolution && state.mode !== 'mastery' && state.mode !== 'benchmark' && state.scaffoldStage !== 'independent' && state.exercise !== 'hard' && !exercise.isIndependent ? `
        <div class="solution-reveal-prompt">
          <button class="reveal-btn" data-action="reveal-solution">Reveal Reference Solution (Forfeits Mastery Credit on this attempt)</button>
        </div>
      ` : ''}

      ${state.showSolution && state.scaffoldStage !== 'independent' && state.exercise !== 'hard' && !exercise.isIndependent && state.mode !== 'benchmark' ? `
        <div class="revealed-solution-box">
          <div class="sol-header">📖 CANONICAL REFERENCE SOLUTION</div>
          <pre><code>${esc(exercise.solution || '// Solution')}</code></pre>
        </div>
      ` : ''}
    </div>
  `;
};

const renderDynamicLineCard = (lesson) => {
  const workedData = LESSON_WORKED_EXAMPLES[lesson.id];
  const explanations = workedData?.lineExplanations || [
    { line: '#include <iostream>', explanation: 'brings in screen input and output tools.' },
    { line: 'main()', explanation: 'is where every complete program begins.' },
    { line: 'cout', explanation: 'prints the value after it.' },
    { line: 'return 0;', explanation: 'says the program finished successfully.' }
  ];
  return `
    <div class="line-card">
      <b>How to read this ${esc(lesson.title)} example</b>
      <ol>
        ${explanations.map(e => `<li><code>${esc(e.line)}</code> ${esc(e.explanation)}</li>`).join('')}
      </ol>
    </div>
  `;
};

const workspace = () => {
  const l = current();
  const topic = state.profile.topics[l.id] || {};
  const difficulty = nextDifficulty(topic);
  const ex = currentExercise();
  const prompt = ex ? ex.problemStatement : (state.exercise === 'mini' ? l.mini : state.exercise === 'medium' ? l.medium : l.hard);

  const isBrandNewLearner = (state.profile.completed?.length === 0) &&
    !state.profile.beginner?.onboarding?.completed &&
    !state.profile.beginner?.onboarding?.skipped;

  const progression = state.scaffoldingEngine.getProgressionForLesson(l.id);
  const currentStage = state.scaffoldStage || (state.exercise === 'mini' ? 'faded' : state.exercise === 'medium' ? 'guided' : 'independent');

  return `<main class="workspace">
    <div class="crumb">${l.module} <span>/</span> Lesson ${lessons.indexOf(l) + 1}</div>
    <h2>${l.title}</h2>
    ${isBrandNewLearner ? BeginnerUI.renderWorkspaceBeginnerBanner(false) : ''}
    ${renderRecommendationBanner()}
    ${BeginnerUI.renderScaffoldingStageBar(l.id, currentStage, state.profile)}
    ${currentStage === 'worked' ? BeginnerUI.renderWorkedWalkthrough(progression, state.workedRunOutput, state.workedExecuting) : ''}
    <div class="lesson-body">
      <section class="teach">
        <div class="mission"><span>YOUR MISSION</span><strong>${l.mission}</strong></div>
        <h3>In plain language</h3>
        <p>${l.explanation}</p>
        ${renderDynamicLineCard(l)}
        <div class="adaptive ${difficulty}">
          <b>${difficulty === 'support' ? 'Let’s make this smaller' : difficulty === 'medium' ? 'You’re ready to stretch' : 'Start small, then grow'}</b>
          <span>${difficulty === 'support' ? 'You have had a few tough attempts. Use the easy task and hint first.' : difficulty === 'medium' ? 'You have been solving confidently. Try a medium task next.' : 'Finish the easy task, then level up.'}</span>
        </div>
        <details class="contextual-syntax-details" ${state.contextualToken ? 'open' : ''}>
          <summary class="syntax-guide-summary">💡 Need help with C++ syntax? Quick "What & Why" Inspector</summary>
          ${BeginnerUI.renderContextualSyntaxBar(state.contextualToken)}
        </details>
      </section>
      <section class="code-zone">
        ${BeginnerUI.renderDataFlowIndicator(detectCin(state.source, ex), Boolean(state.feedback || state.assessmentFeedback))}
        <div class="editor-top">
          <span><i></i> main.cpp</span>
          <button data-action="reset" aria-label="Reset starter code" title="Reset code to starter template">Reset example</button>
        </div>
        <textarea spellcheck="false" data-source aria-label="C++ Code Editor">${esc(state.source)}</textarea>
        ${state.showStdin ? `
          <div class="stdin-box ${detectCin(state.source, ex) ? 'cin-highlight' : ''}">
            <div class="stdin-label">
              <span>Standard Input (stdin for cin)</span>
              ${detectCin(state.source, ex) ? '<span class="cin-badge">cin detected</span>' : ''}
            </div>
            <textarea data-stdin aria-label="Standard input console" placeholder="Values to pass to cin (space or newline separated)...">${esc(state.stdin)}</textarea>
          </div>
        ` : ''}
        <div class="editor-actions">
          <div class="action-left">
            <button class="visualize-btn ${state.showVisualizer ? 'active' : ''}" data-action="visualize" aria-label="Toggle Concept Visualizer" title="Visualize C++ concepts in action">🔍 Visualize</button>
            <button class="hint" data-action="hint" aria-label="Request progressive hint">${state.hintIndex === 0 ? 'Need a hint?' : state.hintIndex < (ex?.hints?.length || 3) ? `Next hint (${state.hintIndex}/${ex?.hints?.length || 3})` : 'All hints shown'}</button>
            <button class="stdin-toggle ${state.showStdin ? 'active' : ''}" data-action="toggle-stdin" aria-label="Toggle standard input">${state.showStdin ? 'Hide stdin ✕' : 'Add stdin ⌨'}</button>
          </div>
          <div class="action-right">
            <button class="run ${state.executing ? 'running' : ''}" data-action="run" aria-label="Run Code" ${state.executing || state.assessing ? 'disabled' : ''}>${state.executing ? '⏳ Running...' : '▷ Run Code'}</button>
            <button class="submit-assess ${state.assessing ? 'running' : ''}" data-action="submit-assess" aria-label="Submit Assessment" ${state.executing || state.assessing ? 'disabled' : ''}>${state.assessing ? '⚡ Grading...' : '✓ Submit Assessment'}</button>
          </div>
        </div>
        <div id="concept-visualizer-slot"></div>
        <div class="feedback-container" aria-live="polite" aria-atomic="true">
          ${renderFeedbackSlot()}
        </div>
      </section>
    </div>
    <section class="exercise">
      <div>
        <div class="exercise-header-row">
          <span class="eyebrow">TRY IT YOURSELF</span>
          ${ex?.level ? `<span class="level-badge">Level ${ex.level}: ${ex.level === 1 ? 'Fill-in' : ex.level === 2 ? 'Function' : ex.level === 3 ? 'Class' : ex.level === 4 ? 'Scaffolded' : 'Independent'}</span>` : ''}
        </div>
        <h3>${ex?.title || (state.exercise === 'mini' ? 'Easy Win' : state.exercise === 'medium' ? 'Build It Up' : 'Independent Build')}</h3>
        ${renderConceptMasteryRow(ex?.concepts, Boolean(ex?.isIndependent))}
        ${currentStage === 'faded' ? BeginnerUI.renderReferenceWorkedPattern(progression, state.refPatternOpen) : ''}
        ${currentStage === 'guided' ? BeginnerUI.renderDecompositionGuide(progression, ex, state.activeDecompositionPlan || DecompositionEngine.createPlanFromExercise(ex)) : ''}
        <p>${prompt}</p>
        ${renderProblemSpecs(ex)}
        ${renderTestPreview(ex)}
        ${renderProgressiveHints(ex)}
      </div>
      <div class="levels">
        <button class="${state.exercise === 'mini' ? 'selected' : ''}" data-action="exercise" data-level="mini">Easy</button>
        <button class="${state.exercise === 'medium' ? 'selected' : ''}" data-action="exercise" data-level="medium">Medium</button>
        <button class="${state.exercise === 'hard' ? 'selected' : ''}" data-action="exercise" data-level="hard">Hard</button>
      </div>
    </section>
  </main>`;
};

const independent = (type) => {
  const isBenchmark = type === 'benchmark';
  const ex = state.currentIndependentExercise || getIndependentExercise(type);
  const question = ex ? ex.problemStatement : (type === 'mastery' ? mastery[0] : lessons[0].hard);

  return `<main class="independent">
    <div class="eyebrow">${isBenchmark ? 'INDEPENDENT CODING PROFICIENCY BENCHMARK' : type === 'mastery' ? 'C++ PROGRAMMING MASTERY TEST' : type === 'challenge' ? 'CHALLENGE MODE' : 'PRACTICE LAB'}</div>
    <h1>${isBenchmark ? 'Unseen transfer evaluation. No hints, no templates.' : type === 'mastery' ? 'No hints. Just your craft.' : type === 'challenge' ? 'Solve it from the question.' : 'A fresh question is waiting.'}</h1>
    ${renderRecommendationBanner()}
    ${isBenchmark ? BeginnerUI.renderTransferChallengeBanner(state.scaffoldingEngine.getProgressionForLesson(state.lessonId)) : ''}
    <article class="problem">
      <div class="problem-meta-top">
        <span>${isBenchmark ? 'UNSEEN TRANSFER CHALLENGE' : 'PROGRAMMING QUESTION'}</span>
        ${ex?.level ? `<span class="level-badge">Level ${ex.level}</span>` : ''}
      </div>
      <h3>${ex?.title || question}</h3>
      ${renderConceptMasteryRow(ex?.concepts, true)}
      <p>${question}</p>
      ${renderProblemSpecs(ex)}
      ${renderTestPreview(ex)}
      ${type !== 'mastery' && !isBenchmark ? renderProgressiveHints(ex) : ''}
    </article>
    <div class="independent-editor">
      ${BeginnerUI.renderDataFlowIndicator(detectCin(state.source, ex), Boolean(state.feedback || state.assessmentFeedback))}
      <div class="editor-top">
        <span><i></i> solution.cpp</span>
        <button data-action="new-question" aria-label="Load a fresh question" title="Load a new random question">New question ↻</button>
      </div>
      <textarea data-source spellcheck="false" aria-label="C++ Solution Editor">${esc(state.source)}</textarea>
      ${state.showStdin ? `
        <div class="stdin-box ${detectCin(state.source, ex) ? 'cin-highlight' : ''}">
          <div class="stdin-label">
            <span>Standard Input (stdin for cin)</span>
            ${detectCin(state.source, ex) ? '<span class="cin-badge">cin detected</span>' : ''}
          </div>
          <textarea data-stdin aria-label="Standard input console" placeholder="Values to pass to cin...">${esc(state.stdin)}</textarea>
        </div>
      ` : ''}
      <div class="editor-actions">
        <div class="action-left">
          <button class="visualize-btn ${state.showVisualizer ? 'active' : ''}" data-action="visualize" aria-label="Toggle Concept Visualizer" title="Visualize C++ concepts in action">🔍 Visualize</button>
          ${type !== 'mastery' && !isBenchmark ? `
            <button class="hint" data-action="hint" aria-label="Request progressive hint">${state.hintIndex === 0 ? 'Need a hint?' : state.hintIndex < (ex?.hints?.length || 3) ? `Next hint (${state.hintIndex}/${ex?.hints?.length || 3})` : 'All hints shown'}</button>
          ` : isBenchmark ? '<span class="mastery-no-hint-tag">🔒 No hints in benchmark</span>' : '<span class="mastery-no-hint-tag">🔒 No hints in mastery</span>'}
          <button class="stdin-toggle ${state.showStdin ? 'active' : ''}" data-action="toggle-stdin" aria-label="Toggle standard input">${state.showStdin ? 'Hide stdin ✕' : 'Add stdin ⌨'}</button>
        </div>
        <div class="action-right">
          <button class="run ${state.executing ? 'running' : ''}" data-action="run" aria-label="Run Code" ${state.executing || state.assessing ? 'disabled' : ''}>${state.executing ? '⏳ Running...' : '▷ Run Code'}</button>
          <button class="submit-assess ${state.assessing ? 'running' : ''}" data-action="submit-assess" aria-label="Submit Assessment" ${state.executing || state.assessing ? 'disabled' : ''}>${state.assessing ? '⚡ Grading...' : '✓ Submit Assessment'}</button>
        </div>
      </div>
      <div id="concept-visualizer-slot"></div>
      <div class="feedback-container" aria-live="polite" aria-atomic="true">
        ${renderFeedbackSlot()}
      </div>
    </div>
  </main>`;
};

const renderBeginnerHub = () => {
  return BeginnerUI.renderHub(state.beginnerTab, {
    onboarding: state.onboardingEngine,
    predict: state.predictEngine,
    debug: state.debugEngine,
    decompose: state.decompositionEngine
  }, {
    previousMode: state.previousMode || 'course',
    currentLessonId: state.lessonId || 'cpp-basics',
    profile: state.profile,
    inputLab: state.inputLab
  });
};

const render = () => {
  if (!app) return;
  const gamificationPillHtml = gamificationEngine ? GamificationUI.renderHeaderPill(gamificationEngine.getSnapshot()) : '';
  const headerSubtitle = state.mode === 'course'
    ? 'Good to see you, coder.'
    : state.mode === 'benchmark'
    ? 'Independent proficiency benchmark'
    : state.mode === 'mastery'
    ? 'Final assessment'
    : state.mode === 'beginner'
    ? 'Beginner learning hub'
    : 'Keep your hands on the keyboard.';

  const mainContent = state.mode === 'course'
    ? `<div class="course">${map()}${lessonList()}${workspace()}</div>`
    : state.mode === 'beginner'
    ? renderBeginnerHub()
    : independent(state.mode);

  app.innerHTML = `<div class="shell">${sidebar()}<div class="content"><header role="banner"><div>${headerSubtitle}</div><div class="header-right"><div class="progression-pill-slot">${gamificationPillHtml}</div><button class="theme-toggle-btn" data-action="toggle-theme" title="Toggle night mode">${state.theme === 'dark' ? '☀️ Light' : '🌙 Night'}</button><span class="avatar">R</span></div></header>${mainContent}</div></div>`;
  if (state.jumpToWorkspace) {
    state.jumpToWorkspace = false;
    scrollToLearningWorkspace(app);
  }
  if (visualizer) {
    const slot = app.querySelector('#concept-visualizer-slot');
    if (slot) {
      visualizer.mount(slot);
      if (state.showVisualizer) {
        visualizer.show();
      } else {
        visualizer.hide(false);
      }
    }
  }
};

const addLessonNavigation = () => {
  if (!app) return;
  const workspaceElement = app.querySelector('.workspace');
  if (!workspaceElement) return;
  const adjacent = getAdjacentLessonIds(lessons.map(lesson => lesson.id), state.lessonId);
  const navigation = document.createElement('nav');
  navigation.className = 'lesson-navigation';
  navigation.setAttribute('aria-label', 'Lesson navigation');
  navigation.innerHTML = `<button data-action="previous-lesson" ${adjacent.previousId ? '' : 'disabled'}>← Previous lesson</button><span>Lesson ${lessons.findIndex(lesson => lesson.id === state.lessonId) + 1} of ${lessons.length}</span><button data-action="next-lesson" ${adjacent.nextId ? '' : 'disabled'}>Next lesson →</button>`;
  workspaceElement.append(navigation);
};

if (app) {
app.addEventListener('input', e => {
  if (e.target.matches('[data-source]')) {
    state.source = e.target.value;
    companionController.notifyTyping();
    const curEx = state.mode === 'course' ? currentExercise() : state.currentIndependentExercise;
    if (!state.showStdin && detectCin(state.source, curEx)) {
      state.showStdin = true;
      render();
    }
  }
  if (e.target.matches('[data-stdin]')) state.stdin = e.target.value;
  if (e.target.matches('[data-onboarding-source]')) {
    state.onboardingEngine.updateSource(e.target.value);
  }
  if (e.target.matches('[data-onboarding-stdin]')) {
    state.onboardingEngine.updateStdin(e.target.value);
  }
  if (e.target.matches('[data-input-lab-val]')) {
    state.inputLab.inputValue = e.target.value;
  }
  if (e.target.matches('[data-debug-source]')) {
    state.debugEngine.updateUserSource(e.target.value);
  }
  if (e.target.matches('[data-decomp-input]')) {
    state.decompositionEngine.updateField(e.target.dataset.decompInput, e.target.value);
  }
});

app.addEventListener('click', async e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  if (action === 'toggle-theme') {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('codebloom-theme', state.theme);
    } catch (e) {}
    applyTheme(state.theme);
    render();
    addLessonNavigation();
    return;
  }

  if (action === 'open-achievements') {
    if (gamificationUI) {
      gamificationUI.openModal();
    }
    return;
  }

  if (action === 'visualize') {
    state.showVisualizer = !state.showVisualizer;
    render();
    addLessonNavigation();
    if (state.showVisualizer && visualizer) {
      visualizer.loadSource(state.source, current()?.id);
    }
    return;
  }

  if (action === 'lesson') {
    state.lessonId = el.dataset.id;
    state.source = current().example;
    state.feedback = null;
    state.assessmentFeedback = null;
    state.hintIndex = 0;
    state.showSolution = false;
    state.mode = 'course';
    checkAndAutoOpenStdin();
    render();
    addLessonNavigation();
    if (state.showVisualizer && visualizer) {
      visualizer.loadSource(state.source, state.lessonId);
    }
    return;
  }

  if (action === 'previous-lesson' || action === 'next-lesson') {
    const adjacent = getAdjacentLessonIds(lessons.map(lesson => lesson.id), state.lessonId);
    const targetId = action === 'previous-lesson' ? adjacent.previousId : adjacent.nextId;
    if (targetId) {
      state.lessonId = targetId;
      state.source = current().example;
      state.feedback = null;
      state.assessmentFeedback = null;
      state.hintIndex = 0;
      state.showSolution = false;
      state.jumpToWorkspace = true;
      checkAndAutoOpenStdin();
      render();
      addLessonNavigation();
      if (state.showVisualizer && visualizer) {
        visualizer.loadSource(state.source, state.lessonId);
      }
    }
    return;
  }

  if (action === 'pick-module') {
    state.lessonId = lessons.find(l => l.module === el.dataset.module).id;
    state.source = current().example;
    state.feedback = null;
    state.assessmentFeedback = null;
    state.hintIndex = 0;
    state.showSolution = false;
    state.jumpToWorkspace = true;
    checkAndAutoOpenStdin();
    render();
    addLessonNavigation();
    return;
  }

  if (action === 'mode') {
    if (state.mode !== el.dataset.mode) {
      state.previousMode = state.mode;
    }
    state.mode = el.dataset.mode;
    state.feedback = null;
    state.assessmentFeedback = null;
    state.hintIndex = 0;
    state.showSolution = false;
    if (state.mode === 'beginner') {
      state.source = starterTemplate;
    } else if (state.mode === 'course') {
      state.source = current().example;
    } else {
      state.currentIndependentExercise = getIndependentExercise(state.mode);
      state.source = state.currentIndependentExercise?.starterCode || starterTemplate;
    }
    checkAndAutoOpenStdin();
    render();
    if (state.mode === 'course') {
      addLessonNavigation();
    }
    return;
  }

  if (action === 'beginner-back') {
    state.mode = state.previousMode || 'course';
    state.feedback = null;
    state.assessmentFeedback = null;
    state.hintIndex = 0;
    state.showSolution = false;
    if (state.mode === 'course') {
      state.source = current().example;
    } else {
      state.currentIndependentExercise = getIndependentExercise(state.mode);
      state.source = state.currentIndependentExercise?.starterCode || starterTemplate;
    }
    checkAndAutoOpenStdin();
    render();
    if (state.mode === 'course') {
      addLessonNavigation();
    }
    return;
  }

  if (action === 'beginner-tab') {
    state.beginnerTab = el.dataset.tabId;
    render();
    return;
  }

  if (action === 'start-scaffold-stage') {
    const lessonId = el.dataset.lessonId || state.lessonId || 'cpp-basics';
    const stage = el.dataset.stage;
    const progression = state.scaffoldingEngine.getProgressionForLesson(lessonId);
    const stgData = progression.stages[stage];

    state.lessonId = lessonId;
    state.scaffoldStage = stage;
    state.previousMode = 'beginner';
    state.feedback = null;
    state.assessmentFeedback = null;
    state.hintIndex = 0;

    if (stage === 'worked') {
      state.mode = 'course';
      state.source = stgData?.code || current().example;
      state.exercise = 'mini';
      state.workedRunOutput = null;
      state.workedExecuting = false;
      state.activeDecompositionPlan = null;
      state.activeWorkspaceDebug = false;
    } else if (stage === 'faded') {
      state.mode = 'course';
      state.exercise = 'mini';
      const ex = currentExercise();
      state.source = stgData?.starterCode || ex?.starterCode || starterTemplate;
      state.showSolution = false;
      state.activeDecompositionPlan = null;
      state.activeWorkspaceDebug = false;
    } else if (stage === 'guided') {
      state.mode = 'course';
      state.exercise = 'medium';
      const ex = currentExercise();
      state.source = stgData?.starterCode || ex?.starterCode || starterTemplate;
      state.showSolution = false;
      state.activeWorkspaceDebug = false;
      if (!state.activeDecompositionPlan) {
        state.activeDecompositionPlan = DecompositionEngine.createPlanFromExercise(ex);
      }
    } else if (stage === 'independent') {
      state.mode = 'course';
      state.exercise = 'hard';
      const ex = currentExercise();
      state.source = stgData?.starterCode || ex?.starterCode || starterTemplate;
      state.showSolution = false;
      state.activeDecompositionPlan = null;
      state.activeWorkspaceDebug = false;
    } else if (stage === 'transfer') {
      state.mode = 'benchmark';
      state.currentIndependentExercise = getTransferBenchmarkForLesson(lessonId);
      state.source = state.currentIndependentExercise?.starterCode || starterTemplate;
      state.showSolution = false;
      state.activeDecompositionPlan = null;
      state.activeWorkspaceDebug = false;
    }

    if (state.profile.beginner) {
      if (!state.profile.beginner.scaffoldHistory[lessonId]) {
        state.profile.beginner.scaffoldHistory[lessonId] = {};
      } else if (typeof state.profile.beginner.scaffoldHistory[lessonId] === 'string') {
        state.profile.beginner.scaffoldHistory[lessonId] = { current: state.profile.beginner.scaffoldHistory[lessonId] };
      }
      state.profile.beginner.scaffoldHistory[lessonId].current = stage;
    }
    save();
    checkAndAutoOpenStdin();
    render();
    if (state.mode === 'course') {
      addLessonNavigation();
    }
    return;
  }

  if (action === 'run-worked-example') {
    state.workedExecuting = true;
    render();
    const l = current();
    const progression = state.scaffoldingEngine.getProgressionForLesson(l.id);
    const workedCode = progression?.stages?.worked?.code || l.example;
    const rawInput = progression?.stages?.worked?.input;
    const inputVal = (rawInput && rawInput.includes('None')) ? '' : (rawInput || '');

    fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: workedCode, stdin: inputVal })
    })
      .then(r => r.json())
      .then(data => {
        state.workedRunOutput = data;
        state.workedExecuting = false;
        render();
        if (state.mode === 'course') addLessonNavigation();
      })
      .catch(err => {
        state.workedRunOutput = { status: 'error', stderr: err.message };
        state.workedExecuting = false;
        render();
        if (state.mode === 'course') addLessonNavigation();
      });
    return;
  }

  if (action === 'onboarding-continue') {
    const cur = state.onboardingEngine.getCurrentStepData();
    let res;
    if (cur.requiresCodeEdit) {
      res = state.onboardingEngine.evaluateStep();
      if (!res) {
        render();
        return;
      }
    } else if (cur.requiresRun) {
      if (!state.onboardingEngine.stepFeedback?.passed) {
        state.onboardingEngine.stepFeedback = { passed: false, message: 'Please run the code successfully before continuing.' };
        render();
        return;
      }
      res = state.onboardingEngine.advanceStep();
    } else {
      res = state.onboardingEngine.advanceStep();
    }
    if (res && res.completed) {
      state.mode = 'course';
      save();
      render();
      addLessonNavigation();
    } else {
      save();
      render();
    }
    return;
  }

  if (action === 'onboarding-skip') {
    state.onboardingEngine.skipOnboarding();
    state.mode = 'course';
    save();
    render();
    addLessonNavigation();
    return;
  }

  if (action === 'onboarding-run') {
    const btn = el;
    btn.disabled = true;
    btn.textContent = '⏳ Compiling...';
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: state.onboardingEngine.source, stdin: state.onboardingEngine.stdin || '' })
      });
      const execResult = await res.json();
      state.onboardingEngine.evaluateStep(execResult);
      save();
      render();
    } catch (err) {
      state.onboardingEngine.stepFeedback = { passed: false, message: `Runner error: ${err.message}` };
      render();
    }
    return;
  }

  if (action === 'run-input-lab') {
    state.inputLab.executing = true;
    render();
    try {
      const snippet = INPUT_LAB_SNIPPETS[state.inputLab.snippetKey] || INPUT_LAB_SNIPPETS.doubler;
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: snippet.code,
          stdin: state.inputLab.inputValue || ''
        })
      });
      const execResult = await res.json();
      state.inputLab.executing = false;
      state.inputLab.output = execResult;
      state.inputLab.history.push({
        input: state.inputLab.inputValue,
        output: (execResult.stdout || execResult.stderr || '').trim()
      });
      if (state.inputLab.history.length > 5) state.inputLab.history.shift();
    } catch (err) {
      state.inputLab.executing = false;
      state.inputLab.output = { status: 'error', stderr: `Execution error: ${err.message}` };
    }
    render();
    return;
  }

  if (action === 'input-lab-snippet') {
    const key = el.dataset.snippetKey;
    if (INPUT_LAB_SNIPPETS[key]) {
      state.inputLab.snippetKey = key;
      state.inputLab.inputValue = INPUT_LAB_SNIPPETS[key].defaultInput;
      state.inputLab.output = null;
      render();
    }
    return;
  }

  if (action === 'mm-check-opt') {
    const modelId = el.dataset.modelId;
    const optIdx = Number(el.dataset.optIdx);
    const model = new MentalModelsEngine().getModel(modelId);
    if (model) {
      if (state.profile.beginner && !state.profile.beginner.mentalModelsViewed.includes(modelId)) {
        state.profile.beginner.mentalModelsViewed.push(modelId);
        save();
      }
      const card = el.closest('.mental-model-card');
      if (card) {
        card.outerHTML = MentalModelsEngine.renderCard(model, {
          selectedCheck: optIdx,
          checkEvaluated: true
        });
      }
    }
    return;
  }

  if (action === 'syntax-token-inspect') {
    const tok = el.dataset.token;
    state.contextualToken = state.contextualToken === tok ? null : tok;
    render();
    return;
  }

  if (action === 'pick-vocab') {
    const termKey = el.dataset.termKey;
    const explorer = el.closest('.vocab-explorer');
    if (explorer) {
      explorer.outerHTML = VocabularyEngine.renderGlossaryExplorer(termKey);
    }
    return;
  }

  if (action === 'predict-select') {
    state.predictEngine.selectOption(Number(el.dataset.optIdx));
    render();
    return;
  }

  if (action === 'predict-submit') {
    const challenge = state.predictEngine.getCurrentChallenge();
    const btn = el;
    btn.disabled = true;
    btn.textContent = '⏳ Running C++...';
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: challenge.code, stdin: '' })
      });
      const execResult = await res.json();
      state.predictEngine.submitPrediction(execResult);
      if (state.profile.beginner) {
        state.profile.beginner.predictionsCompleted = (state.profile.beginner.predictionsCompleted || 0) + 1;
        if (state.predictEngine.state.isCorrect) {
          state.profile.beginner.predictionsCorrect = (state.profile.beginner.predictionsCorrect || 0) + 1;
        }
      }
      save();
      render();
    } catch (err) {
      state.predictEngine.submitPrediction({ status: 'execution_error', error: err.message, stderr: 'Execution request failed' });
      if (state.profile.beginner) {
        state.profile.beginner.predictionsCompleted = (state.profile.beginner.predictionsCompleted || 0) + 1;
      }
      save();
      render();
    }
    return;
  }

  if (action === 'predict-next') {
    state.predictEngine.setChallengeIndex(state.predictEngine.currentChallengeIndex + 1);
    render();
    return;
  }

  if (action === 'predict-retry') {
    state.predictEngine.resetState();
    render();
    return;
  }

  if (action === 'debug-step') {
    state.debugEngine.setStep(el.dataset.step);
    render();
    return;
  }

  if (action === 'debug-locate-line') {
    state.debugEngine.selectLine(Number(el.dataset.line));
    render();
    return;
  }

  if (action === 'debug-explain-opt') {
    state.debugEngine.selectExplainOption(Number(el.dataset.optIdx));
    render();
    return;
  }

  if (action === 'debug-scaffold-opt') {
    state.debugEngine.selectScaffoldOption(Number(el.dataset.optIdx));
    render();
    return;
  }

  if (action === 'debug-hint-tier') {
    state.debugEngine.unlockNextHint();
    render();
    return;
  }

  if (action === 'debug-toggle-hint') {
    state.debugEngine.toggleHint();
    render();
    return;
  }

  if (action === 'debug-run') {
    const btn = el;
    btn.disabled = true;
    btn.textContent = '⏳ Compiling...';
    try {
      const endpoint = '/api/run';
      let res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: state.debugEngine.state.userSource, stdin: '' })
      });
      if (!res.ok) {
        // Fallback to /api/execute if /api/run is not available
        res = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source: state.debugEngine.state.userSource, stdin: '' })
        });
      }
      const execResult = await res.json();
      const passed = state.debugEngine.evaluateFix(execResult);
      if (passed && state.debugEngine.isWorkspaceActive) {
        state.source = state.debugEngine.state.userSource;
      }
      if (passed && state.profile.beginner) {
        state.profile.beginner.debugsCompleted = (state.profile.beginner.debugsCompleted || 0) + 1;
      }
      save();
      render();
      if (state.mode === 'course') addLessonNavigation();
    } catch (err) {
      state.debugEngine.evaluateFix({ status: 'execution_error', error: err.message });
      render();
    }
    return;
  }

  if (action === 'start-workspace-debug') {
    const curEx = state.mode === 'course' ? currentExercise() : state.currentIndependentExercise;
    const lastDiag = state.feedback?.rawError || state.assessmentFeedback?.rawError || state.feedback?.message || '';
    const classified = state.feedback?.classifiedError || state.assessmentFeedback?.classifiedError || null;
    const testRes = state.assessmentFeedback?.testResults?.find(t => !t.passed);
    const expected = testRes?.expectedOutput || '';
    const actual = testRes?.actualOutput || '';

    state.debugEngine.initFromWorkspaceError({
      source: state.source,
      diagnostic: lastDiag,
      classifiedError: classified,
      testResult: testRes,
      expectedOutput: expected,
      actualOutput: actual,
      exerciseTitle: curEx?.title || current()?.title || 'Current Code'
    });
    state.activeWorkspaceDebug = true;
    render();
    if (state.mode === 'course') addLessonNavigation();
    return;
  }

  if (action === 'workspace-debug-close') {
    state.debugEngine.exitWorkspaceDebug();
    state.activeWorkspaceDebug = false;
    render();
    if (state.mode === 'course') addLessonNavigation();
    return;
  }

  if (action === 'debug-next') {
    state.debugEngine.setChallengeIndex(state.debugEngine.currentIndex + 1);
    render();
    return;
  }

  if (action === 'decomp-scaffold') {
    state.decompositionEngine.setScaffoldLevel(el.dataset.lvl);
    render();
    return;
  }

  if (action === 'decomp-complete') {
    const ok = state.decompositionEngine.completeDecomposition();
    if (!ok) {
      render();
      return;
    }
    if (state.profile.beginner) {
      state.profile.beginner.decompositionsCompleted = (state.profile.beginner.decompositionsCompleted || 0) + 1;
    }
    state.activeDecompositionPlan = state.decompositionEngine.getStructuredPlan();
    state.source = state.decompositionEngine.userFields.code;
    state.mode = 'course';
    state.exercise = 'medium';
    state.scaffoldStage = 'guided';
    state.activeWorkspaceDebug = false;
    save();
    render();
    addLessonNavigation();
    return;
  }

  if (action === 'decomp-next') {
    state.decompositionEngine.setTemplateIndex(state.decompositionEngine.currentIndex + 1);
    render();
    return;
  }

  if (action === 'exercise') {
    state.exercise = el.dataset.level;
    state.scaffoldStage = el.dataset.level === 'mini' ? 'faded' : el.dataset.level === 'medium' ? 'guided' : 'independent';
    state.feedback = null;
    state.assessmentFeedback = null;
    state.hintIndex = 0;
    state.showSolution = false;
    state.activeWorkspaceDebug = false;
    const ex = currentExercise();
    if (state.scaffoldStage === 'guided') {
      if (!state.activeDecompositionPlan) {
        state.activeDecompositionPlan = DecompositionEngine.createPlanFromExercise(ex);
      }
    } else {
      state.activeDecompositionPlan = null;
    }
    if (ex && ex.starterCode) {
      state.source = ex.starterCode;
    }
    checkAndAutoOpenStdin();
    render();
    addLessonNavigation();
    return;
  }

  if (action === 'hint') {
    const curEx = state.mode === 'course' ? currentExercise() : state.currentIndependentExercise;
    const maxHints = curEx?.hints?.length || 3;
    if (state.hintIndex < maxHints) {
      state.hintIndex += 1;
      eventBus.emit(LEARNING_EVENTS.HINT_USED, {
        exerciseId: curEx?.id,
        hintIndex: state.hintIndex,
        totalHints: maxHints
      });
    }
    render();
    addLessonNavigation();
    return;
  }

  if (action === 'reveal-solution') {
    const curEx = state.mode === 'course' ? currentExercise() : state.currentIndependentExercise;
    if (state.scaffoldStage === 'independent' || curEx?.isIndependent || (state.mode === 'course' && state.exercise === 'hard') || state.mode === 'benchmark' || state.mode === 'mastery') {
      return;
    }
    state.showSolution = true;
    eventBus.emit(LEARNING_EVENTS.SOLUTION_REVEALED, {
      exerciseId: curEx?.id
    });
    render();
    addLessonNavigation();
    return;
  }

  if (action === 'pick-recommended') {
    const exerciseId = el.dataset.exerciseId;
    const ex = getExerciseById(exerciseId);
    if (ex) {
      state.mode = 'practice';
      state.currentIndependentExercise = ex;
      state.source = ex.starterCode || starterTemplate;
      state.feedback = null;
      state.assessmentFeedback = null;
      state.hintIndex = 0;
      state.showSolution = false;
      checkAndAutoOpenStdin();
      render();
      addLessonNavigation();
    }
    return;
  }

  if (action === 'toggle-stdin') {
    state.showStdin = !state.showStdin;
    render();
    addLessonNavigation();
    return;
  }

  if (action === 'reset') {
    const ex = currentExercise();
    state.source = ex?.starterCode || current().example;
    state.stdin = '';
    state.feedback = null;
    state.assessmentFeedback = null;
    state.hintIndex = 0;
    state.showSolution = false;
    checkAndAutoOpenStdin();
    render();
    addLessonNavigation();
    if (state.showVisualizer && visualizer) {
      visualizer.loadSource(state.source, current()?.id);
    }
    return;
  }

  if (action === 'new-question') {
    state.currentIndependentExercise = getIndependentExercise(state.mode);
    state.source = state.currentIndependentExercise?.starterCode || starterTemplate;
    state.stdin = '';
    state.feedback = null;
    state.assessmentFeedback = null;
    state.hintIndex = 0;
    state.showSolution = false;
    checkAndAutoOpenStdin();
    render();
    addLessonNavigation();
    if (state.showVisualizer && visualizer) {
      visualizer.loadSource(state.source, state.currentIndependentExercise?.id);
    }
    return;
  }

  // --- Run Code (Single execution) ---
  if (action === 'run') {
    if (state.executing || state.assessing) return;
    state.executing = true;
    state.executionStage = 'compiling';
    state.feedback = null;
    state.assessmentFeedback = null;
    render();
    addLessonNavigation();

    eventBus.emit(LEARNING_EVENTS.CODE_STARTED, { mode: state.mode });

    const stageTimer = setTimeout(() => {
      if (state.executing) {
        state.executionStage = 'running';
        render();
        addLessonNavigation();
      }
    }, 350);

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: state.source, stdin: state.stdin || '' })
      });

      clearTimeout(stageTimer);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server HTTP ${res.status}`);
      }

      const execResult = await res.json();
      state.feedback = formatExecutionFeedback(execResult);

      if (execResult.status === 'compile_error') {
        eventBus.emit(LEARNING_EVENTS.COMPILE_FAILED, { diagnostics: execResult.diagnostics });
      } else if (execResult.status === 'runtime_error' || execResult.status === 'timeout') {
        eventBus.emit(LEARNING_EVENTS.RUNTIME_FAILED, { exitCode: execResult.exitCode });
      } else if (execResult.status === 'success') {
        eventBus.emit(LEARNING_EVENTS.COMPILE_SUCCESS, { exerciseId: current()?.id });
        if (state.showVisualizer && visualizer) {
          visualizer.loadSource(state.source, current()?.id);
        }
      }
    } catch (err) {
      clearTimeout(stageTimer);
      state.feedback = {
        status: 'needs-work',
        badge: 'Connection Error',
        passed: false,
        title: 'Cannot Connect to C++ Execution Runner',
        message: 'Could not communicate with the local execution server. Ensure "npm start" is running.',
        rawError: err.message
      };
    } finally {
      state.executing = false;
      render();
      addLessonNavigation();
    }
    return;
  }

  // --- Submit Assessment (Multi-test grading) ---
  if (action === 'submit-assess') {
    if (state.assessing || state.executing) return;
    state.assessing = true;
    state.feedback = null;
    state.assessmentFeedback = null;
    render();
    addLessonNavigation();

    const curEx = state.mode === 'course'
      ? currentExercise()
      : state.currentIndependentExercise;

    eventBus.emit(LEARNING_EVENTS.CODE_STARTED, { exerciseId: curEx?.id, mode: state.mode });

    try {
      const res = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: state.source,
          exerciseId: curEx?.id,
          exercise: curEx
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server HTTP ${res.status}`);
      }

      const assessmentResult = await res.json();
      state.assessmentFeedback = formatAssessmentFeedback(assessmentResult, curEx);

      if (state.assessmentFeedback.passed) {
        // Update learner profile and mastery records first
        state.profile = updateLearnerProfile(state.profile, current()?.id || 'general', true, {
          exercise: curEx,
          assessmentResult,
          hintsUsedCount: state.hintIndex,
          solutionRevealed: state.showSolution,
          isIndependent: Boolean(curEx?.isIndependent) || (state.mode === 'mastery' && curEx?.level >= 5) || (state.mode === 'benchmark'),
          isRetrieval: state.currentIsRetrieval || false
        });

        eventBus.emit(LEARNING_EVENTS.TEST_PASSED, { exerciseId: curEx?.id });
        eventBus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, {
          exerciseId: curEx?.id,
          exercise: curEx,
          difficulty: curEx?.difficulty || (state.mode === 'mastery' ? 'mastery' : 'easy'),
          concepts: curEx?.concepts || (curEx?.concept ? [curEx.concept] : []),
          hintsUsed: state.hintIndex,
          solutionRevealed: state.showSolution,
          mode: state.mode,
          completedLessons: state.profile.completed,
          totalLessonsCompleted: state.profile.completed.length,
          conceptMastery: state.profile.conceptMastery
        });

        if (state.profile.beginner) {
          const lId = state.mode === 'course' ? (current()?.id || state.lessonId) : state.lessonId;
          if (lId) {
            if (!state.profile.beginner.scaffoldHistory[lId] || typeof state.profile.beginner.scaffoldHistory[lId] !== 'object') {
              const oldVal = state.profile.beginner.scaffoldHistory[lId];
              state.profile.beginner.scaffoldHistory[lId] = typeof oldVal === 'string' ? { current: oldVal } : {};
            }
            const stg = state.scaffoldStage || (state.mode === 'benchmark' ? 'transfer' : state.exercise === 'mini' ? 'faded' : state.exercise === 'medium' ? 'guided' : 'independent');
            state.profile.beginner.scaffoldHistory[lId][stg + '_completed'] = true;
          }
        }
        save();
      } else {
        if (assessmentResult.status === 'compile_error') {
          eventBus.emit(LEARNING_EVENTS.COMPILE_FAILED, {
            exerciseId: curEx?.id,
            classifiedError: state.assessmentFeedback.classifiedError,
            rawError: assessmentResult.rawError
          });
        } else if (assessmentResult.status === 'runtime_error' || assessmentResult.status === 'timeout') {
          eventBus.emit(LEARNING_EVENTS.RUNTIME_FAILED, {
            exerciseId: curEx?.id,
            classifiedError: state.assessmentFeedback.classifiedError,
            rawError: assessmentResult.rawError
          });
        } else {
          eventBus.emit(LEARNING_EVENTS.TEST_FAILED, {
            exerciseId: curEx?.id,
            classifiedError: state.assessmentFeedback.classifiedError
          });
        }

        state.profile = updateLearnerProfile(state.profile, current()?.id || 'general', false, {
          exercise: curEx,
          assessmentResult,
          hintsUsedCount: state.hintIndex,
          solutionRevealed: state.showSolution,
          isIndependent: Boolean(curEx?.isIndependent) || (state.mode === 'mastery' && curEx?.level >= 5) || (state.mode === 'benchmark'),
          isRetrieval: state.currentIsRetrieval || false
        });
        save();
      }

    } catch (err) {
      state.assessmentFeedback = {
        status: 'needs-work',
        badge: 'Connection Error',
        passed: false,
        title: 'Cannot Connect to Assessment Runner',
        message: 'Could not communicate with the assessment server. Ensure "npm start" is running.',
        rawError: err.message,
        testResults: [],
        summary: { total: 0, passed: 0, failed: 0 }
      };
    } finally {
      state.assessing = false;
      render();
      addLessonNavigation();
    }
    return;
  }
});
}

const starterTemplate = `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!";\n  return 0;\n}`;

if (typeof document !== 'undefined' && app) {
  applyTheme(state.theme);
  checkAndAutoOpenStdin();
  render();
  addLessonNavigation();
  initPikachuCompanion(document.body, companionController);
}
