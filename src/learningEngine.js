/**
 * Quick static source check for basic program scaffolding.
 * Note: Static source analysis is NOT equivalent to compilation;
 * full evaluation uses the real C++ execution pipeline.
 */
export const assessCppSource = (source) => {
  const text = (source || '').trim();
  if (!text) return { status: 'needs-work', message: 'Start by writing a few lines of C++.' };
  if (!/\bmain\s*\(/.test(text)) return { status: 'needs-work', message: 'Every complete C++ program needs a main() function to start.' };
  if (!/#include\s*<iostream>/.test(text)) return { status: 'needs-work', message: 'Add #include <iostream> so cout and cin are available.' };
  if (!/[;}]/.test(text)) return { status: 'needs-work', message: 'Check your braces and semicolons—C++ needs both.' };
  if (/cout/.test(text) && !/(std::cout|using namespace std)/.test(text)) return { status: 'needs-work', message: 'cout lives in std. Use std::cout or add using namespace std.' };
  return { status: 'ready', message: 'Learning check passed. Your program has the core structure needed to compile. Review the expected output, then keep improving it.' };
};

/**
 * Transforms raw C++ execution results into beginner-friendly UI feedback.
 */
export const formatExecutionFeedback = (execResult) => {
  if (!execResult) {
    return {
      status: 'needs-work',
      badge: 'Execution Error',
      passed: false,
      title: 'No execution result received',
      message: 'The execution runner did not return a valid result.',
      rawError: ''
    };
  }

  const { status, stdout, stderr, exitCode, executionTimeMs, diagnostics, friendlyExplanation, truncated } = execResult;

  if (status === 'success') {
    return {
      status: 'ready',
      badge: 'Success',
      passed: true,
      title: 'Program compiled and executed successfully',
      message: friendlyExplanation || 'Clean execution with exit code 0.',
      stdout: stdout || '(no output produced)',
      stderr: stderr || '',
      exitCode: 0,
      executionTimeMs: executionTimeMs || 0,
      truncated
    };
  }

  if (status === 'compile_error') {
    return {
      status: 'needs-work',
      badge: 'Compilation Error',
      passed: false,
      title: 'Compilation Failed',
      message: friendlyExplanation || 'The C++ compiler found errors preventing your code from compiling.',
      rawError: stderr || 'Compiler reported errors.',
      diagnostics: diagnostics || [],
      exitCode,
      executionTimeMs: executionTimeMs || 0,
      truncated
    };
  }

  if (status === 'runtime_error') {
    return {
      status: 'needs-work',
      badge: 'Runtime Error',
      passed: false,
      title: 'Program Crashed During Execution',
      message: friendlyExplanation || `Compilation succeeded, but your program encountered a runtime error (exit code: ${exitCode}).`,
      stdout: stdout || '',
      rawError: stderr || '',
      exitCode,
      executionTimeMs: executionTimeMs || 0,
      truncated
    };
  }

  if (status === 'timeout') {
    return {
      status: 'needs-work',
      badge: 'Execution Timeout',
      passed: false,
      title: 'Time Limit Exceeded',
      message: friendlyExplanation || 'Your program ran longer than the allowed time limit and was stopped.',
      stdout: stdout || '',
      rawError: stderr || 'Execution timed out.',
      exitCode,
      executionTimeMs: executionTimeMs || 0,
      truncated
    };
  }

  return {
    status: 'needs-work',
    badge: 'Runner Error',
    passed: false,
    title: 'Execution Service Error',
    message: friendlyExplanation || stderr || 'Could not compile or execute the code.',
    rawError: stderr || '',
    exitCode,
    executionTimeMs: executionTimeMs || 0
  };
};

import {
  eventBus,
  LEARNING_EVENTS
} from './eventBus.js';

import {
  MASTERY_LEVELS,
  ERROR_CATEGORIES,
  createConceptMastery,
  calculateMasteryLevel,
  classifyError,
  updateConceptMastery,
  getAdaptiveRecommendation,
  migrateProfile
} from './masteryEngine.js';

export {
  eventBus,
  LEARNING_EVENTS,
  MASTERY_LEVELS,
  ERROR_CATEGORIES,
  createConceptMastery,
  calculateMasteryLevel,
  classifyError,
  updateConceptMastery,
  getAdaptiveRecommendation,
  migrateProfile
};

/**
 * Formats multi-test assessment results into beginner-friendly UI presentation data.
 */
export const formatAssessmentFeedback = (assessmentResult, exercise = null) => {
  if (!assessmentResult) {
    return {
      status: 'needs-work',
      badge: 'Assessment Error',
      passed: false,
      title: 'No Assessment Result',
      message: 'Failed to obtain an assessment result from the runner.',
      testResults: [],
      summary: { total: 0, passed: 0, failed: 0 }
    };
  }

  const { status, passed, message, antiCheatWarning, conceptChecks, testResults = [], summary = {}, compilation } = assessmentResult;
  const classifiedError = !passed ? classifyError(assessmentResult, null, exercise) : null;

  if (status === 'compile_error') {
    return {
      status: 'needs-work',
      badge: 'Compilation Error',
      passed: false,
      title: 'Compilation Failed',
      message: compilation?.friendlyExplanation || message || 'Your program failed to compile.',
      rawError: compilation?.stderr || '',
      diagnostics: compilation?.diagnostics || [],
      classifiedError,
      testResults: [],
      summary
    };
  }

  if (passed) {
    return {
      status: 'ready',
      badge: 'All Tests Passed',
      passed: true,
      title: 'Exercise Completed Successfully!',
      message: message || `All ${summary.total || testResults.length} test cases passed!`,
      antiCheatWarning: null,
      conceptChecks,
      classifiedError: null,
      testResults,
      summary
    };
  }

  if (status === 'concept_warning') {
    return {
      status: 'needs-work',
      badge: 'Concept Check Failed',
      passed: false,
      title: 'Code Works, But Concept Check Failed',
      message: message || 'Your code produced the expected outputs, but failed required concept checks.',
      antiCheatWarning,
      conceptChecks,
      classifiedError,
      testResults,
      summary
    };
  }

  return {
    status: 'needs-work',
    badge: summary.passed > 0 ? `${summary.passed}/${summary.total} Passed` : 'Tests Failed',
    passed: false,
    title: summary.passed > 0 ? 'Partial Success' : 'Assessment Did Not Pass',
    message: message || `${summary.passed || 0} of ${summary.total || testResults.length} test cases passed.`,
    antiCheatWarning,
    conceptChecks,
    classifiedError,
    testResults,
    summary
  };
};

export const nextDifficulty = ({ misses = 0, wins = 0 }) => {
  if (misses >= 2) return 'support';
  if (wins >= 2) return 'medium';
  return 'easy';
};

export const updateLearnerProfile = (profile, topicId, passed, options = {}) => {
  const previous = profile.topics?.[topicId] || { wins: 0, misses: 0 };
  const attempt = passed ? { wins: previous.wins + 1, misses: 0 } : { wins: previous.wins, misses: previous.misses + 1 };
  const baseProfile = {
    ...profile,
    topics: { ...profile.topics, [topicId]: attempt },
    completed: passed && !profile.completed.includes(topicId) ? [...profile.completed, topicId] : profile.completed
  };

  // If exercise is provided, update concept mastery
  if (options.exercise) {
    const { updatedProfile } = updateConceptMastery(baseProfile, {
      exercise: options.exercise,
      passed,
      assessmentResult: options.assessmentResult,
      hintsUsedCount: options.hintsUsedCount || 0,
      solutionRevealed: options.solutionRevealed || false,
      isIndependent: options.isIndependent || false,
      isRetrieval: options.isRetrieval || false
    });
    return updatedProfile;
  }

  return baseProfile;
};

export const scrollToLearningWorkspace = (root = document) => {
  root.querySelector('.workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const getAdjacentLessonIds = (lessonIds, currentId) => {
  const index = lessonIds.indexOf(currentId);
  if (index === -1) return { previousId: null, nextId: null };
  return { previousId: lessonIds[index - 1] || null, nextId: lessonIds[index + 1] || null };
};

