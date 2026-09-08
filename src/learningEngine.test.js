import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assessCppSource, getAdjacentLessonIds, nextDifficulty, scrollToLearningWorkspace, updateLearnerProfile } from './learningEngine.js';

describe('learning feedback', () => {
  it('flags a program without an entry point', () => {
    const result = assessCppSource('#include <iostream>\nusing namespace std;');
    assert.equal(result.status, 'needs-work');
    assert.match(result.message, /main/);
  });

  it('accepts a complete minimal C++ program', () => {
    const result = assessCppSource('#include <iostream>\nint main() { std::cout << "Hi"; return 0; }');
    assert.equal(result.status, 'ready');
  });
});

describe('adaptive path', () => {
  it('offers support after repeated attempts', () => {
    assert.equal(nextDifficulty({ misses: 2, wins: 0 }), 'support');
  });

  it('raises the level after confident success', () => {
    assert.equal(nextDifficulty({ misses: 0, wins: 2 }), 'medium');
  });

  it('records a topic attempt without losing previous progress', () => {
    const next = updateLearnerProfile({ completed: ['cpp-basics'], topics: {} }, 'functions', false);
    assert.deepEqual(next.completed, ['cpp-basics']);
    assert.equal(next.topics.functions.misses, 1);
  });
});

describe('course navigation', () => {
  it('finds the previous and next lesson without going past the course boundaries', () => {
    const ids = ['basics', 'classes', 'constructors'];
    assert.deepEqual(getAdjacentLessonIds(ids, 'classes'), { previousId: 'basics', nextId: 'constructors' });
    assert.deepEqual(getAdjacentLessonIds(ids, 'basics'), { previousId: null, nextId: 'classes' });
    assert.deepEqual(getAdjacentLessonIds(ids, 'constructors'), { previousId: 'classes', nextId: null });
  });

  it('smoothly brings the selected lesson workspace into view', () => {
    let received;
    const root = { querySelector: () => ({ scrollIntoView: options => { received = options; } }) };
    scrollToLearningWorkspace(root);
    assert.deepEqual(received, { behavior: 'smooth', block: 'start' });
  });
});
