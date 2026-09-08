export const assessCppSource = (source) => {
  const text = source.trim();
  if (!text) return { status: 'needs-work', message: 'Start by writing a few lines of C++.' };
  if (!/\bmain\s*\(/.test(text)) return { status: 'needs-work', message: 'Every complete C++ program needs a main() function to start.' };
  if (!/#include\s*<iostream>/.test(text)) return { status: 'needs-work', message: 'Add #include <iostream> so cout and cin are available.' };
  if (!/[;}]/.test(text)) return { status: 'needs-work', message: 'Check your braces and semicolons—C++ needs both.' };
  if (/cout/.test(text) && !/(std::cout|using namespace std)/.test(text)) return { status: 'needs-work', message: 'cout lives in std. Use std::cout or add using namespace std.' };
  return { status: 'ready', message: 'Learning check passed. Your program has the core structure needed to compile. Review the expected output, then keep improving it.' };
};

export const nextDifficulty = ({ misses = 0, wins = 0 }) => {
  if (misses >= 2) return 'support';
  if (wins >= 2) return 'medium';
  return 'easy';
};

export const updateLearnerProfile = (profile, topicId, passed) => {
  const previous = profile.topics?.[topicId] || { wins: 0, misses: 0 };
  const attempt = passed ? { wins: previous.wins + 1, misses: 0 } : { wins: previous.wins, misses: previous.misses + 1 };
  return { ...profile, topics: { ...profile.topics, [topicId]: attempt }, completed: passed && !profile.completed.includes(topicId) ? [...profile.completed, topicId] : profile.completed };
};

export const scrollToLearningWorkspace = (root = document) => {
  root.querySelector('.workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
