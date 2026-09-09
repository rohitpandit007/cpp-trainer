/**
 * Progressive Scaffolding & Worked->Faded->Independent Engine for CodeBloom.
 * Manages 8 progressive assistance levels and the 5-stage pedagogical ladder:
 * Worked Example -> Faded Example -> Guided Practice -> Independent Practice -> Transfer.
 */

import { LEARNING_EVENTS } from '../eventBus.js';
import { lessons } from '../courseData.js';
import { exerciseCatalog } from '../exerciseData.js';
import { benchmarkBattery } from '../benchmark/benchmarkData.js';

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

export const SCAFFOLD_STAGES = {
  WORKED: 'worked',
  FADED: 'faded',
  GUIDED: 'guided',
  INDEPENDENT: 'independent',
  TRANSFER: 'transfer'
};

export const STAGE_CONFIG = {
  [SCAFFOLD_STAGES.WORKED]: {
    id: 'worked',
    levelNumber: 1,
    name: 'Worked Example',
    icon: '📖',
    assistance: 'High',
    description: 'Complete working code with line-by-line explanation of every component.'
  },
  [SCAFFOLD_STAGES.FADED]: {
    id: 'faded',
    levelNumber: 3,
    name: 'Faded Example',
    icon: '✏️',
    assistance: 'Medium-High',
    description: 'Key operations or tokens are removed for you to reconstruct the pattern.'
  },
  [SCAFFOLD_STAGES.GUIDED]: {
    id: 'guided',
    levelNumber: 7,
    name: 'Guided Practice',
    icon: '🧭',
    assistance: 'Medium',
    description: 'Problem decomposition, constraints, and pseudocode plan guide implementation.'
  },
  [SCAFFOLD_STAGES.INDEPENDENT]: {
    id: 'independent',
    levelNumber: 8,
    name: 'Independent Problem',
    icon: '🛡️',
    assistance: 'Low / None',
    description: 'Problem specifications only. No templates, zero solution leakage.'
  },
  [SCAFFOLD_STAGES.TRANSFER]: {
    id: 'transfer',
    levelNumber: 9,
    name: 'Transfer Benchmark',
    icon: '🔬',
    assistance: 'Zero',
    description: 'Novel, unseen problem domain testing true conceptual independence.'
  }
};

export class ScaffoldingEngine {
  constructor(options = {}) {
    this.eventBus = options.eventBus || null;
  }

  getScaffoldLevel(levelNumber) {
    return SCAFFOLD_LEVELS[levelNumber] || SCAFFOLD_LEVELS[1];
  }

  /**
   * Evaluates multiple choice recognition (Level 1).
   */
  evaluateRecognition(selectedOption, correctOption) {
    const isCorrect = selectedOption === correctOption;
    if (isCorrect && this.eventBus) {
      this.eventBus.emit(LEARNING_EVENTS.SCAFFOLD_COMPLETED, {
        level: 1,
        type: 'recognition'
      });
    }
    return isCorrect;
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
    if (Array.isArray(userAnswer)) {
      const targets = Array.isArray(expectedAnswers) ? expectedAnswers : [expectedAnswers];
      if (userAnswer.length !== targets.length) return false;
      const isCorrect = userAnswer.every((ans, idx) => (ans || '').trim() === (targets[idx] || '').trim());
      if (isCorrect && this.eventBus) {
        this.eventBus.emit(LEARNING_EVENTS.SCAFFOLD_COMPLETED, {
          level: 3,
          type: 'fill_blank'
        });
      }
      return isCorrect;
    }

    const clean = (userAnswer || '').trim();
    const targets = Array.isArray(expectedAnswers) ? expectedAnswers : [expectedAnswers];
    const isCorrect = targets.some(t => (t || '').trim() === clean);

    if (isCorrect && this.eventBus) {
      this.eventBus.emit(LEARNING_EVENTS.SCAFFOLD_COMPLETED, {
        level: 3,
        type: 'fill_blank'
      });
    }
    return isCorrect;
  }

  /**
   * Maps an existing lesson from the curriculum to its 5-stage scaffolding trajectory:
   * Worked (lesson.example) -> Faded (mini) -> Guided (medium) -> Independent (hard) -> Transfer (benchmark).
   */
  getProgressionForLesson(lessonId = 'cpp-basics') {
    const lesson = lessons.find(l => l.id === lessonId) || lessons[0];
    const miniEx = typeof lesson.exercises.mini === 'string' ? exerciseCatalog[lesson.exercises.mini] : lesson.exercises.mini;
    const mediumEx = typeof lesson.exercises.medium === 'string' ? exerciseCatalog[lesson.exercises.medium] : lesson.exercises.medium;
    const hardEx = typeof lesson.exercises.hard === 'string' ? exerciseCatalog[lesson.exercises.hard] : lesson.exercises.hard;

    // Associate unseen benchmark transfer problem
    const transferProblem = benchmarkBattery.find(b => b.id.includes(lesson.module?.toLowerCase() || '') || b.id.includes(lesson.id)) || benchmarkBattery[0];

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      module: lesson.module,
      stages: {
        [SCAFFOLD_STAGES.WORKED]: {
          stage: SCAFFOLD_STAGES.WORKED,
          name: 'Worked Example',
          title: `Worked: ${lesson.title}`,
          assistance: 'Complete Solution + Walkthrough',
          code: lesson.example,
          explanation: lesson.explanation,
          mission: lesson.mission,
          revealsSolution: true
        },
        [SCAFFOLD_STAGES.FADED]: {
          stage: SCAFFOLD_STAGES.FADED,
          name: 'Faded Example',
          title: miniEx?.title || 'Fill-in Code',
          assistance: 'Faded Code with Missing Tokens/Lines',
          exerciseId: miniEx?.id,
          exercise: miniEx,
          problemStatement: miniEx?.problemStatement,
          starterCode: miniEx?.starterCode,
          level: miniEx?.level || 1,
          revealsSolution: false
        },
        [SCAFFOLD_STAGES.GUIDED]: {
          stage: SCAFFOLD_STAGES.GUIDED,
          name: 'Guided Practice',
          title: mediumEx?.title || 'Structured Build',
          assistance: 'Problem Decomposition & Structured Hints',
          exerciseId: mediumEx?.id,
          exercise: mediumEx,
          problemStatement: mediumEx?.problemStatement,
          starterCode: mediumEx?.starterCode,
          level: mediumEx?.level || 2,
          revealsSolution: false
        },
        [SCAFFOLD_STAGES.INDEPENDENT]: {
          stage: SCAFFOLD_STAGES.INDEPENDENT,
          name: 'Independent Problem',
          title: hardEx?.title || 'Independent Challenge',
          assistance: 'None (Pure Problem Specs)',
          exerciseId: hardEx?.id,
          exercise: hardEx,
          problemStatement: hardEx?.problemStatement,
          starterCode: hardEx?.starterCode,
          constraints: hardEx?.constraints || [],
          level: hardEx?.level || 5,
          revealsSolution: false // CRITICAL: Independent stage NEVER leaks solution
        },
        [SCAFFOLD_STAGES.TRANSFER]: {
          stage: SCAFFOLD_STAGES.TRANSFER,
          name: 'Transfer Benchmark',
          title: transferProblem?.title || 'Unseen Problem Domain',
          assistance: 'Zero Assistance / Unseen Domain',
          benchmarkId: transferProblem?.id,
          problemStatement: transferProblem?.problemStatement,
          testCasesCount: transferProblem?.testCases?.length || 0,
          revealsSolution: false
        }
      }
    };
  }

  /**
   * Adapts the recommended scaffolding stage based on objective learner signals:
   * - Consecutive failures or solution reveals -> Fall back to more scaffolding
   * - Successes at current level -> Advance to less scaffolding
   */
  getRecommendedStage(lessonId = 'cpp-basics', profile = {}) {
    const topic = profile.topics?.[lessonId] || {};
    const concept = profile.conceptMastery?.[lessonId] || {};
    const wins = typeof topic.wins === 'number' ? topic.wins : (concept.successfulAttempts || 0);
    const misses = typeof topic.misses === 'number' ? topic.misses : (concept.failedAttempts || 0);
    const solutionRevealed = Boolean(concept.solutionReveals > 0);
    const recent = Array.isArray(concept.recentPerformance) ? concept.recentPerformance : [];
    const recentFails = recent.slice(-3).filter(r => r === 'fail').length;

    const consecutiveFailures = typeof profile.consecutiveFailures === 'number'
      ? profile.consecutiveFailures
      : recentFails;
    const recentAccuracy = typeof profile.recentAccuracy === 'number'
      ? profile.recentAccuracy
      : (wins + misses > 0 ? wins / (wins + misses) : (wins > 0 ? 1.0 : 0.0));
    const streak = typeof profile.streak === 'number' ? profile.streak : wins;

    // 1. Fallback on struggle:
    if (solutionRevealed || consecutiveFailures >= 2 || recentAccuracy < 0.4 || (misses >= 3 && wins === 0)) {
      return SCAFFOLD_STAGES.WORKED;
    }
    if (consecutiveFailures >= 1 || recentAccuracy < 0.6) {
      return SCAFFOLD_STAGES.FADED;
    }

    // 2. High competence: independent successes or mastery level >= 5 or streak >= 5
    if (concept.independentSuccesses > 0 || (concept.level && concept.level >= 5) || streak >= 5) {
      return SCAFFOLD_STAGES.TRANSFER;
    }

    // 3. Medium-High competence: multiple wins or medium completed or streak >= 3
    if (wins >= 2 || (concept.difficultySuccessfullyCompleted?.medium > 0) || (streak >= 3 && recentAccuracy >= 0.8)) {
      return SCAFFOLD_STAGES.INDEPENDENT;
    }

    // 4. Basic competence: at least 1 win
    if (wins >= 1 || (concept.difficultySuccessfullyCompleted?.easy > 0) || streak >= 1) {
      return SCAFFOLD_STAGES.GUIDED;
    }

    // 5. Default starting stage
    return SCAFFOLD_STAGES.WORKED;
  }

  /**
   * Renders an interactive progression ladder for the Beginner Hub.
   */
  renderInteractiveLadder(lessonId = 'cpp-basics', currentStage = null, profile = {}) {
    const progression = this.getProgressionForLesson(lessonId);
    const recommended = currentStage || this.getRecommendedStage(lessonId, profile);

    return `
      <div class="scaffold-ladder-interactive" role="region" aria-label="Progressive scaffolding ladder">
        <div class="ladder-header">
          <span class="matrix-badge">PEDAGOGICAL PROGRESSION · ${progression.module}</span>
          <h3>${progression.lessonTitle}: Scaffolding Ladder</h3>
          <p>Assistance decreases as competence increases. Current recommended stage: <strong>${STAGE_CONFIG[recommended]?.name || recommended}</strong></p>
        </div>

        <div class="ladder-stages-grid">
          ${Object.values(SCAFFOLD_STAGES).map((stgKey, idx) => {
            const stg = progression.stages[stgKey];
            const cfg = STAGE_CONFIG[stgKey];
            const isCurrent = stgKey === recommended;

            return `
              <div class="ladder-stage-card ${stgKey} ${isCurrent ? 'recommended-stage' : ''}">
                <div class="stage-top">
                  <span class="stage-num">STAGE ${idx + 1}</span>
                  <span class="stage-badge">${cfg.assistance} Assistance</span>
                </div>
                <h4>${cfg.icon} ${cfg.name}</h4>
                <p class="stage-desc">${cfg.description}</p>
                <div class="stage-target-info">
                  <strong>Focus:</strong> ${stg.title}
                </div>
                ${isCurrent ? '<div class="stage-current-tag">👉 Recommended Next Step</div>' : ''}
                <button class="stage-action-btn" data-action="start-scaffold-stage" data-lesson-id="${progression.lessonId}" data-stage="${stgKey}">
                  Start ${cfg.name} →
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Renders the Worked -> Faded -> Independent trajectory card overview.
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
