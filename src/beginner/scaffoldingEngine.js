/**
 * Progressive Scaffolding & Worked->Faded->Independent Engine for CodeBloom.
 * Manages 8 progressive assistance levels and the 5-stage pedagogical ladder:
 * Worked Example -> Faded Example -> Guided Practice -> Independent Practice -> Transfer.
 */

import { LEARNING_EVENTS } from '../eventBus.js';
import { lessons } from '../courseData.js';
import { exerciseCatalog } from '../exerciseData.js';
import { benchmarkBattery } from '../benchmark/benchmarkData.js';
import { LESSON_WORKED_EXAMPLES } from './beginnerData.js';

export function getTransferBenchmarkForLesson(lessonId) {
  const map = {
    'cpp-basics': 'bench-sensor-telemetry',
    'keywords': 'bench-sensor-telemetry',
    'conditionals': 'bench-transaction-ledger',
    'loops': 'bench-flight-manifest',
    'functions': 'bench-flight-manifest',
    'classes': 'bench-sensor-telemetry',
    'constructors': 'bench-snapshot-buffer',
    'access': 'bench-sensor-telemetry',
    'member-functions': 'bench-sensor-telemetry',
    'object-flow': 'bench-flight-manifest',
    'static': 'bench-transaction-ledger',
    'friends': 'bench-transaction-ledger',
    'inheritance': 'bench-fleet-management',
    'runtime': 'bench-expression-ast',
    'abstract': 'bench-expression-ast',
    'derived-constructors': 'bench-fleet-management',
    'overloading': 'bench-matrix-combiner',
    'operators': 'bench-matrix-combiner',
    'memory': 'bench-snapshot-buffer',
    'destructors': 'bench-snapshot-buffer'
  };
  const targetId = map[lessonId] || 'bench-sensor-telemetry';
  return benchmarkBattery.find(b => b.id === targetId) || benchmarkBattery[0];
}

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
    const workedData = LESSON_WORKED_EXAMPLES[lesson.id] || {
      concept: lesson.title,
      problemStatement: lesson.mission,
      input: 'None (Direct Console Output)',
      expectedOutput: '',
      reasoningSteps: [],
      lineExplanations: [],
      fadingGuidance: ''
    };
    const miniEx = typeof lesson.exercises.mini === 'string' ? exerciseCatalog[lesson.exercises.mini] : lesson.exercises.mini;
    const mediumEx = typeof lesson.exercises.medium === 'string' ? exerciseCatalog[lesson.exercises.medium] : lesson.exercises.medium;
    const hardEx = typeof lesson.exercises.hard === 'string' ? exerciseCatalog[lesson.exercises.hard] : lesson.exercises.hard;

    // Associate mapped unseen benchmark transfer problem
    const transferProblem = getTransferBenchmarkForLesson(lesson.id);

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
          concept: workedData.concept,
          problemStatement: workedData.problemStatement,
          input: workedData.input,
          expectedOutput: workedData.expectedOutput,
          reasoningSteps: workedData.reasoningSteps,
          lineExplanations: workedData.lineExplanations,
          fadingGuidance: workedData.fadingGuidance,
          isWorkedExample: true,
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
          referencePattern: lesson.example,
          fadingGuidance: workedData.fadingGuidance,
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
          hints: mediumEx?.hints || [],
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
          benchmark: transferProblem,
          problemStatement: transferProblem?.problemStatement,
          transferPrompt: `Transfer Challenge: Apply your knowledge of ${lesson.title} to an unseen real-world problem domain with zero hints or templates.`,
          testCasesCount: transferProblem?.testCases?.length || 0,
          revealsSolution: false
        }
      }
    };
  }

  /**
   * Adapts the recommended scaffolding stage based on stage-specific learner signals:
   * - Recent struggle (solution revealed on current/recent attempt, consecutive failures, poor accuracy)
   *   -> Fall back to WORKED or FADED
   * - Transfer: strictly requires genuine independent success (history.independent_completed or concept.independentSuccesses > 0)
   * - Independent: strictly requires verified guided completion (history.guided_completed or difficultySuccessfullyCompleted.medium > 0)
   * - Guided: strictly requires verified faded completion (history.faded_completed or difficultySuccessfullyCompleted.easy > 0)
   * - Default: WORKED
   */
  getRecommendedStage(lessonId = 'cpp-basics', profile = {}) {
    const history = profile.beginner?.scaffoldHistory?.[lessonId] || {};
    const concept = profile.conceptMastery?.[lessonId] || {};

    // 1. Solution Reveal on current/recent attempt detection:
    // A historical reveal must NOT permanently trap the learner if later unassisted success occurred.
    let recentSolutionRevealed = false;
    if (typeof profile.recentSolutionRevealed === 'boolean') {
      recentSolutionRevealed = profile.recentSolutionRevealed;
    } else if (typeof concept.recentSolutionRevealed === 'boolean') {
      recentSolutionRevealed = concept.recentSolutionRevealed;
    } else if (profile.solutionRevealedCurrentAttempt || profile.solutionRevealed) {
      recentSolutionRevealed = true;
    } else if (Array.isArray(profile.history) && profile.history.length > 0) {
      // Find the most recent attempt for this specific lesson
      const lastAttemptForLesson = profile.history.slice().reverse().find(h =>
        h.exerciseId?.startsWith(lessonId) || (Array.isArray(h.concepts) && h.concepts.includes(lessonId))
      );
      if (lastAttemptForLesson) {
        recentSolutionRevealed = Boolean(lastAttemptForLesson.solutionRevealed);
      } else if (profile.history[profile.history.length - 1]?.solutionRevealed) {
        recentSolutionRevealed = true;
      }
    }

    // 2. Failure & Struggle Metrics (Lesson-specific)
    const recent = Array.isArray(concept.recentPerformance) ? concept.recentPerformance : [];
    let endConsecutiveFails = 0;
    for (let i = recent.length - 1; i >= 0; i--) {
      if (recent[i] === 'fail') endConsecutiveFails++;
      else break;
    }
    const consecutiveFailures = typeof profile.consecutiveFailures === 'number'
      ? profile.consecutiveFailures
      : endConsecutiveFails;

    const successfulAttempts = concept.successfulAttempts || 0;
    const failedAttempts = concept.failedAttempts || 0;
    const totalAttempts = successfulAttempts + failedAttempts;
    const recentAccuracy = typeof profile.recentAccuracy === 'number'
      ? profile.recentAccuracy
      : (totalAttempts > 0 ? successfulAttempts / totalAttempts : 1.0);

    // 3. Fallback on struggle:
    // Severe struggle: solution revealed on current attempt, >=2 consecutive failures, or very low accuracy
    if (recentSolutionRevealed || consecutiveFailures >= 2 || (failedAttempts >= 3 && successfulAttempts === 0) || (typeof profile.recentAccuracy === 'number' ? profile.recentAccuracy < 0.4 : (totalAttempts >= 3 && recentAccuracy < 0.4))) {
      return SCAFFOLD_STAGES.WORKED;
    }

    // Mild struggle: 1 consecutive failure at the end or accuracy < 0.6
    if (consecutiveFailures >= 1 || (typeof profile.recentAccuracy === 'number' ? profile.recentAccuracy < 0.6 : (totalAttempts >= 3 && recentAccuracy < 0.6))) {
      return SCAFFOLD_STAGES.FADED;
    }

    // 4. Progression ladder (Strictly Stage-Specific Evidence):
    // Stage 5: Transfer — strictly requires verified Independent success for this lesson
    const hasIndependent = Boolean(history.independent_completed) ||
      (typeof concept.independentSuccesses === 'number' && concept.independentSuccesses > 0);
    if (hasIndependent) {
      return SCAFFOLD_STAGES.TRANSFER;
    }

    // Stage 4: Independent — strictly requires verified Guided completion for this lesson
    const hasGuided = Boolean(history.guided_completed) ||
      ((concept.difficultySuccessfullyCompleted?.medium || 0) > 0);
    if (hasGuided) {
      return SCAFFOLD_STAGES.INDEPENDENT;
    }

    // Stage 3: Guided — strictly requires verified Faded completion for this lesson
    const hasFaded = Boolean(history.faded_completed) ||
      ((concept.difficultySuccessfullyCompleted?.easy || 0) > 0);
    if (hasFaded) {
      return SCAFFOLD_STAGES.GUIDED;
    }

    // Stage 1: Worked — default entry point
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
