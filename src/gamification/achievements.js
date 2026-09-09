/**
 * Achievement Definitions and Evaluation Engine for CodeBloom C++ Trainer (Phase D4A).
 * All criteria are 100% deterministic, objective, and derived directly from
 * learner behavior and Phase C concept mastery records.
 */

export const ACHIEVEMENT_CATEGORIES = {
  MILESTONE: 'milestone',
  DEBUGGING: 'debugging',
  CRAFT: 'craft',
  STREAK: 'streak',
  CONCEPT: 'concept',
  SYNTHESIS: 'synthesis',
  CURRICULUM: 'curriculum'
};

export const ACHIEVEMENTS = {
  FIRST_COMPILE: {
    id: 'FIRST_COMPILE',
    title: 'First Valid Build',
    description: 'Successfully compiled your first C++ program without compiler errors.',
    category: ACHIEVEMENT_CATEGORIES.MILESTONE,
    icon: '⚡',
    xpReward: 50,
    check: (context) => Boolean(context.firstCompileSuccess) && !context.isSolutionRevealed
  },

  FIRST_SUCCESS: {
    id: 'FIRST_SUCCESS',
    title: 'Hello, C++ World!',
    description: 'Passed all automated test cases for your first C++ exercise.',
    category: ACHIEVEMENT_CATEGORIES.MILESTONE,
    icon: '🎯',
    xpReward: 50,
    check: (context) => (context.stats?.exercisesCompleted || 0) >= 1 && !context.isSolutionRevealed
  },

  BUG_HUNTER: {
    id: 'BUG_HUNTER',
    title: 'Bug Hunter',
    description: 'Diagnosed an error, fixed your logic, and achieved a passing solution.',
    category: ACHIEVEMENT_CATEGORIES.DEBUGGING,
    icon: '🔍',
    xpReward: 75,
    check: (context) => Boolean(context.recoveredFromFailure) && !context.isSolutionRevealed
  },

  NO_HELP_NEEDED: {
    id: 'NO_HELP_NEEDED',
    title: 'Self-Reliant Coder',
    description: 'Solved an exercise independently with zero hints and no solution revealed.',
    category: ACHIEVEMENT_CATEGORIES.CRAFT,
    icon: '🛡️',
    xpReward: 80,
    check: (context) => Boolean(context.isIndependentSolve)
  },

  INDEPENDENT_STREAK_3: {
    id: 'INDEPENDENT_STREAK_3',
    title: 'Independent Streak ×3',
    description: 'Solved 3 exercises independently in a row with no hints or revealed solutions.',
    category: ACHIEVEMENT_CATEGORIES.STREAK,
    icon: '🔥',
    xpReward: 150,
    check: (context) => (context.streaks?.currentIndependentStreak || 0) >= 3
  },

  INDEPENDENT_STREAK_5: {
    id: 'INDEPENDENT_STREAK_5',
    title: 'Independent Streak ×5',
    description: 'Solved 5 exercises independently in a row. Exceptional autonomy!',
    category: ACHIEVEMENT_CATEGORIES.STREAK,
    icon: '⚡',
    xpReward: 300,
    check: (context) => (context.streaks?.currentIndependentStreak || 0) >= 5
  },

  FUNCTION_BUILDER: {
    id: 'FUNCTION_BUILDER',
    title: 'Modular Mind',
    description: 'Demonstrated function mastery: parameters, pass-by-reference, and returns.',
    category: ACHIEVEMENT_CATEGORIES.CONCEPT,
    icon: '📦',
    xpReward: 150,
    check: (context) => {
      const mastery = context.conceptMastery?.['functions'];
      return (mastery?.level || 1) >= 4 || context.completedConcepts?.some(c => ['functions', 'function'].includes(c));
    }
  },

  MEMORY_EXPLORER: {
    id: 'MEMORY_EXPLORER',
    title: 'Memory Explorer',
    description: 'Managed dynamic memory on the heap with new, delete, and pointers.',
    category: ACHIEVEMENT_CATEGORIES.CONCEPT,
    icon: '🧠',
    xpReward: 180,
    check: (context) => {
      const memoryMastery = context.conceptMastery?.['memory'];
      return (memoryMastery?.successfulAttempts || 0) >= 1 || context.completedConcepts?.some(c => ['memory', 'pointers', 'pointer', 'heap', 'references', 'reference'].includes(c));
    }
  },

  OBJECT_BUILDER: {
    id: 'OBJECT_BUILDER',
    title: 'Object Architect',
    description: 'Modelled domain entities with C++ classes, access specifiers, and methods.',
    category: ACHIEVEMENT_CATEGORIES.CONCEPT,
    icon: '🏗️',
    xpReward: 200,
    check: (context) => {
      const classMastery = context.conceptMastery?.['classes'];
      return (classMastery?.level || 1) >= 4 || context.completedConcepts?.some(c => ['classes', 'class', 'objects', 'object'].includes(c));
    }
  },

  CONSTRUCTOR_CRAFT: {
    id: 'CONSTRUCTOR_CRAFT',
    title: 'Constructor Craft',
    description: 'Mastered object lifecycle and initialization with parameterized constructors.',
    category: ACHIEVEMENT_CATEGORIES.CONCEPT,
    icon: '🔨',
    xpReward: 200,
    check: (context) => {
      const ctorMastery = context.conceptMastery?.['constructors'];
      return (ctorMastery?.level || 1) >= 4 || context.completedConcepts?.some(c => ['constructors', 'constructor'].includes(c));
    }
  },

  INHERITANCE_UNLOCKED: {
    id: 'INHERITANCE_UNLOCKED',
    title: 'Inheritance Unlocked',
    description: 'Constructed derived class hierarchies with code reuse and base chaining.',
    category: ACHIEVEMENT_CATEGORIES.CONCEPT,
    icon: '🌳',
    xpReward: 250,
    check: (context) => {
      const inhMastery = context.conceptMastery?.['inheritance'];
      return (inhMastery?.level || 1) >= 4 || context.completedConcepts?.some(c => ['inheritance', 'derived'].includes(c));
    }
  },

  POLYMORPHISM_PRACTITIONER: {
    id: 'POLYMORPHISM_PRACTITIONER',
    title: 'Polymorphism Practitioner',
    description: 'Mastered virtual methods, overrides, and runtime dynamic dispatch.',
    category: ACHIEVEMENT_CATEGORIES.CONCEPT,
    icon: '🔮',
    xpReward: 300,
    check: (context) => {
      const polyMastery = context.conceptMastery?.['runtime'];
      return (polyMastery?.level || 1) >= 4 || context.completedConcepts?.some(c => ['runtime', 'polymorphism', 'virtual'].includes(c));
    }
  },

  MULTI_CONCEPT_SOLVER: {
    id: 'MULTI_CONCEPT_SOLVER',
    title: 'Synthesis Master',
    description: 'Successfully solved an advanced problem combining multiple C++ concepts.',
    category: ACHIEVEMENT_CATEGORIES.SYNTHESIS,
    icon: '🧩',
    xpReward: 250,
    check: (context) => (context.stats?.multiConceptProblemsSolved || 0) >= 1
  },

  CURRICULUM_COMPLETE: {
    id: 'CURRICULUM_COMPLETE',
    title: 'C++ Grandmaster',
    description: 'Completed all 20 lessons and conquered a comprehensive C++ mastery test.',
    category: ACHIEVEMENT_CATEGORIES.CURRICULUM,
    icon: '👑',
    xpReward: 1000,
    check: (context) => {
      const totalLessons = (context.completedLessons || []).length;
      const masteryPassed = (context.stats?.masteryTestsPassed || 0) >= 1;
      return totalLessons >= 20 && masteryPassed;
    }
  }
};
