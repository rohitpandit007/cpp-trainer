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

const app = document.querySelector('#app');
const rawStored = JSON.parse(localStorage.getItem('codebloom-profile') || '{"completed":[],"topics":{}}');
const migratedStored = migrateProfile(rawStored);

const savedTheme = localStorage.getItem('codebloom-theme') || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

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

const getIndependentExercise = (mode) => {
  if (mode === 'mastery') {
    return masteryExercises[Math.floor(Math.random() * masteryExercises.length)] || exerciseCatalog['mastery-student-manager'];
  }
  if (mode === 'challenge') return challengePool[Math.floor(Math.random() * challengePool.length)];
  return practicePool[Math.floor(Math.random() * practicePool.length)];
};

const state = {
  profile: migratedStored,
  theme: savedTheme,
  lessonId: 'cpp-basics',
  mode: 'course',
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
  currentIsRetrieval: false
};

const current = () => lessons.find(l => l.id === state.lessonId);
const currentExercise = () => {
  const l = current();
  if (l && l.exercises && l.exercises[state.exercise]) {
    return l.exercises[state.exercise];
  }
  return null;
};

const save = () => localStorage.setItem('codebloom-profile', JSON.stringify(state.profile));
const esc = value => (value || '').replace(/[&<>]/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[x]));

const sidebar = () => {
  const stats = state.profile.stats || {};
  return `<aside>
    <div class="brand"><span>✦</span> CodeBloom <b>C++</b></div>
    <button class="nav ${state.mode === 'course' ? 'active' : ''}" data-action="mode" data-mode="course">▦ &nbsp; Learning path</button>
    <button class="nav ${state.mode === 'practice' ? 'active' : ''}" data-action="mode" data-mode="practice">⌁ &nbsp; Practice lab</button>
    <button class="nav ${state.mode === 'challenge' ? 'active' : ''}" data-action="mode" data-mode="challenge">⚡ &nbsp; Challenge mode</button>
    <button class="nav ${state.mode === 'mastery' ? 'active' : ''}" data-action="mode" data-mode="mastery">🏆 &nbsp; Mastery test</button>
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

const renderConceptMasteryRow = (concepts = []) => {
  if (!concepts || concepts.length === 0) return '';
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

const renderExecutionFeedback = () => {
  if (state.executing) {
    return `
      <div class="feedback running">
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
    <div class="feedback ${f.status}">
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
        <div class="output-console stderr-console">
          <div class="console-label">${f.badge === 'Compilation Error' ? 'COMPILER ERROR DETAILS' : 'ERROR OUTPUT (STDERR)'}</div>
          <pre><code>${esc(f.rawError)}</code></pre>
        </div>
      ` : ''}
    </div>
  `;
};

const renderAssessmentFeedback = () => {
  if (state.assessing) {
    return `
      <div class="feedback running assessing">
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
    <div class="assessment-panel ${a.status}">
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
          <div class="diag-header">🔍 ERROR DIAGNOSIS: ${esc(a.classifiedError.category.toUpperCase().replace(/_/g, ' '))}</div>
          <p class="diag-desc">${esc(a.classifiedError.description)}</p>
          <div class="diag-remedy"><b>Recommended Action:</b> ${esc(a.classifiedError.remedy)}</div>
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
          <span class="summary-title">Test Results (${a.summary?.passed || 0}/${a.summary?.total || a.testResults.length} Passed)</span>
          <div class="test-cases-drawer">
            ${a.testResults.map((tc, idx) => `
              <div class="test-case-card ${tc.passed ? 'passed' : 'failed'}">
                <div class="tc-top">
                  <span class="tc-badge ${tc.passed ? 'pass' : 'fail'}">${tc.passed ? 'PASS' : 'FAIL'}</span>
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
        <div class="output-console stderr-console">
          <div class="console-label">COMPILER / RUNTIME DETAILS</div>
          <pre><code>${esc(a.rawError)}</code></pre>
        </div>
      ` : ''}
    </div>
  `;
};

const renderTestPreview = (exercise) => {
  if (!exercise || !exercise.testCases) return '';
  const visible = exercise.testCases.filter(t => !t.isHidden);
  if (visible.length === 0) return '';

  return `
    <div class="visible-tests-preview">
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

      ${state.hintIndex >= exercise.hints.length && !state.showSolution && state.mode !== 'mastery' ? `
        <div class="solution-reveal-prompt">
          <button class="reveal-btn" data-action="reveal-solution">Reveal Reference Solution (Forfeits Mastery Credit on this attempt)</button>
        </div>
      ` : ''}

      ${state.showSolution ? `
        <div class="revealed-solution-box">
          <div class="sol-header">📖 CANONICAL REFERENCE SOLUTION</div>
          <pre><code>${esc(exercise.solution || '// Solution')}</code></pre>
        </div>
      ` : ''}
    </div>
  `;
};

const workspace = () => {
  const l = current();
  const topic = state.profile.topics[l.id] || {};
  const difficulty = nextDifficulty(topic);
  const ex = currentExercise();
  const prompt = ex ? ex.problemStatement : (state.exercise === 'mini' ? l.mini : state.exercise === 'medium' ? l.medium : l.hard);

  return `<main class="workspace">
    <div class="crumb">${l.module} <span>/</span> Lesson ${lessons.indexOf(l) + 1}</div>
    <h2>${l.title}</h2>
    ${renderRecommendationBanner()}
    <div class="lesson-body">
      <section class="teach">
        <div class="mission"><span>YOUR MISSION</span><strong>${l.mission}</strong></div>
        <h3>In plain language</h3>
        <p>${l.explanation}</p>
        <div class="line-card">
          <b>How to read the example</b>
          <ol>
            <li><code>#include &lt;iostream&gt;</code> brings in screen input and output tools.</li>
            <li><code>main()</code> is where every complete program begins.</li>
            <li><code>cout</code> prints the value after it.</li>
            <li><code>return 0;</code> says the program finished successfully.</li>
          </ol>
        </div>
        <div class="adaptive ${difficulty}">
          <b>${difficulty === 'support' ? 'Let’s make this smaller' : difficulty === 'medium' ? 'You’re ready to stretch' : 'Start small, then grow'}</b>
          <span>${difficulty === 'support' ? 'You have had a few tough attempts. Use the easy task and hint first.' : difficulty === 'medium' ? 'You have been solving confidently. Try a medium task next.' : 'Finish the easy task, then level up.'}</span>
        </div>
      </section>
      <section class="code-zone">
        <div class="editor-top">
          <span><i></i> main.cpp</span>
          <button data-action="reset">Reset example</button>
        </div>
        <textarea spellcheck="false" data-source>${esc(state.source)}</textarea>
        ${state.showStdin ? `
          <div class="stdin-box">
            <div class="stdin-label">Standard Input (stdin for cin)</div>
            <textarea data-stdin placeholder="Values to pass to cin (space or newline separated)...">${esc(state.stdin)}</textarea>
          </div>
        ` : ''}
        <div class="editor-actions">
          <div class="action-left">
            <button class="hint" data-action="hint">${state.hintIndex === 0 ? 'Need a hint?' : state.hintIndex < (ex?.hints?.length || 3) ? `Next hint (${state.hintIndex}/${ex?.hints?.length || 3})` : 'All hints shown'}</button>
            <button class="stdin-toggle ${state.showStdin ? 'active' : ''}" data-action="toggle-stdin">${state.showStdin ? 'Hide stdin ✕' : 'Add stdin ⌨'}</button>
          </div>
          <div class="action-right">
            <button class="run ${state.executing ? 'running' : ''}" data-action="run" ${state.executing || state.assessing ? 'disabled' : ''}>${state.executing ? '⏳ Running...' : '▷ Run Code'}</button>
            <button class="submit-assess ${state.assessing ? 'running' : ''}" data-action="submit-assess" ${state.executing || state.assessing ? 'disabled' : ''}>${state.assessing ? '⚡ Grading...' : '✓ Submit Assessment'}</button>
          </div>
        </div>
        ${renderExecutionFeedback()}
        ${renderAssessmentFeedback()}
      </section>
    </div>
    <section class="exercise">
      <div>
        <div class="exercise-header-row">
          <span class="eyebrow">TRY IT YOURSELF</span>
          ${ex?.level ? `<span class="level-badge">Level ${ex.level}: ${ex.level === 1 ? 'Fill-in' : ex.level === 2 ? 'Function' : ex.level === 3 ? 'Class' : ex.level === 4 ? 'Scaffolded' : 'Independent'}</span>` : ''}
        </div>
        <h3>${ex?.title || (state.exercise === 'mini' ? 'Easy Win' : state.exercise === 'medium' ? 'Build It Up' : 'Independent Build')}</h3>
        ${renderConceptMasteryRow(ex?.concepts)}
        <p>${prompt}</p>
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
  const ex = state.currentIndependentExercise || getIndependentExercise(type);
  const question = ex ? ex.problemStatement : (type === 'mastery' ? mastery[0] : lessons[0].hard);

  return `<main class="independent">
    <div class="eyebrow">${type === 'mastery' ? 'C++ PROGRAMMING MASTERY TEST' : type === 'challenge' ? 'CHALLENGE MODE' : 'PRACTICE LAB'}</div>
    <h1>${type === 'mastery' ? 'No hints. Just your craft.' : type === 'challenge' ? 'Solve it from the question.' : 'A fresh question is waiting.'}</h1>
    ${renderRecommendationBanner()}
    <article class="problem">
      <div class="problem-meta-top">
        <span>PROGRAMMING QUESTION</span>
        ${ex?.level ? `<span class="level-badge">Level ${ex.level}</span>` : ''}
      </div>
      <h3>${ex?.title || question}</h3>
      ${renderConceptMasteryRow(ex?.concepts)}
      <p>${question}</p>
      ${renderTestPreview(ex)}
      ${type !== 'mastery' ? renderProgressiveHints(ex) : ''}
    </article>
    <div class="independent-editor">
      <div class="editor-top">
        <span><i></i> solution.cpp</span>
        <button data-action="new-question">New question ↻</button>
      </div>
      <textarea data-source spellcheck="false">${esc(state.source)}</textarea>
      ${state.showStdin ? `
        <div class="stdin-box">
          <div class="stdin-label">Standard Input (stdin for cin)</div>
          <textarea data-stdin placeholder="Values to pass to cin...">${esc(state.stdin)}</textarea>
        </div>
      ` : ''}
      <div class="editor-actions">
        <div class="action-left">
          ${type !== 'mastery' ? `
            <button class="hint" data-action="hint">${state.hintIndex === 0 ? 'Need a hint?' : state.hintIndex < (ex?.hints?.length || 3) ? `Next hint (${state.hintIndex}/${ex?.hints?.length || 3})` : 'All hints shown'}</button>
          ` : '<span class="mastery-no-hint-tag">🔒 No hints in mastery</span>'}
          <button class="stdin-toggle ${state.showStdin ? 'active' : ''}" data-action="toggle-stdin">${state.showStdin ? 'Hide stdin ✕' : 'Add stdin ⌨'}</button>
        </div>
        <div class="action-right">
          <button class="run ${state.executing ? 'running' : ''}" data-action="run" ${state.executing || state.assessing ? 'disabled' : ''}>${state.executing ? '⏳ Running...' : '▷ Run Code'}</button>
          <button class="submit-assess ${state.assessing ? 'running' : ''}" data-action="submit-assess" ${state.executing || state.assessing ? 'disabled' : ''}>${state.assessing ? '⚡ Grading...' : '✓ Submit Assessment'}</button>
        </div>
      </div>
      ${renderExecutionFeedback()}
      ${renderAssessmentFeedback()}
    </div>
  </main>`;
};

const render = () => {
  app.innerHTML = `<div class="shell">${sidebar()}<div class="content"><header><div>${state.mode === 'course' ? 'Good to see you, coder.' : state.mode === 'mastery' ? 'Final assessment' : 'Keep your hands on the keyboard.'}</div><div class="header-right"><button class="theme-toggle-btn" data-action="toggle-theme" title="Toggle night mode">${state.theme === 'dark' ? '☀️ Light' : '🌙 Night'}</button><span>🔥 ${(state.profile.stats?.passedSubmissions || state.profile.completed.length) * 3} XP</span><span class="avatar">R</span></div></header>${state.mode === 'course' ? `<div class="course">${map()}${lessonList()}${workspace()}</div>` : independent(state.mode)}</div></div>`;
  if (state.jumpToWorkspace) {
    state.jumpToWorkspace = false;
    scrollToLearningWorkspace(app);
  }
};

const addLessonNavigation = () => {
  const workspaceElement = app.querySelector('.workspace');
  if (!workspaceElement) return;
  const adjacent = getAdjacentLessonIds(lessons.map(lesson => lesson.id), state.lessonId);
  const navigation = document.createElement('nav');
  navigation.className = 'lesson-navigation';
  navigation.setAttribute('aria-label', 'Lesson navigation');
  navigation.innerHTML = `<button data-action="previous-lesson" ${adjacent.previousId ? '' : 'disabled'}>← Previous lesson</button><span>Lesson ${lessons.findIndex(lesson => lesson.id === state.lessonId) + 1} of ${lessons.length}</span><button data-action="next-lesson" ${adjacent.nextId ? '' : 'disabled'}>Next lesson →</button>`;
  workspaceElement.append(navigation);
};

app.addEventListener('input', e => {
  if (e.target.matches('[data-source]')) state.source = e.target.value;
  if (e.target.matches('[data-stdin]')) state.stdin = e.target.value;
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

  if (action === 'lesson') {
    state.lessonId = el.dataset.id;
    state.source = current().example;
    state.feedback = null;
    state.assessmentFeedback = null;
    state.hintIndex = 0;
    state.showSolution = false;
    state.mode = 'course';
    render();
    addLessonNavigation();
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
      render();
      addLessonNavigation();
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
    render();
    addLessonNavigation();
    return;
  }

  if (action === 'mode') {
    state.mode = el.dataset.mode;
    state.feedback = null;
    state.assessmentFeedback = null;
    state.hintIndex = 0;
    state.showSolution = false;
    state.currentIndependentExercise = getIndependentExercise(state.mode);
    state.source = state.currentIndependentExercise?.starterCode || starterTemplate;
    render();
    addLessonNavigation();
    return;
  }

  if (action === 'exercise') {
    state.exercise = el.dataset.level;
    state.feedback = null;
    state.assessmentFeedback = null;
    state.hintIndex = 0;
    state.showSolution = false;
    const ex = currentExercise();
    if (ex && ex.starterCode) {
      state.source = ex.starterCode;
    }
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
    render();
    addLessonNavigation();
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
    render();
    addLessonNavigation();
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
        eventBus.emit(LEARNING_EVENTS.TEST_PASSED, { exerciseId: curEx?.id });
        eventBus.emit(LEARNING_EVENTS.EXERCISE_COMPLETED, { exerciseId: curEx?.id });
      } else {
        eventBus.emit(LEARNING_EVENTS.TEST_FAILED, {
          exerciseId: curEx?.id,
          classifiedError: state.assessmentFeedback.classifiedError
        });
      }

      // Update learner profile and mastery records
      state.profile = updateLearnerProfile(state.profile, current()?.id || 'general', state.assessmentFeedback.passed, {
        exercise: curEx,
        assessmentResult,
        hintsUsedCount: state.hintIndex,
        solutionRevealed: state.showSolution,
        isIndependent: state.mode !== 'course' || curEx?.level >= 4,
        isRetrieval: state.currentIsRetrieval || false
      });
      save();

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

const starterTemplate = `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!";\n  return 0;\n}`;

applyTheme(state.theme);
render();
addLessonNavigation();
