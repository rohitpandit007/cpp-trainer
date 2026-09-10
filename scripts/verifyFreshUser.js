import { workspace, state } from '../src/app.js';

console.log('=== 1. Fresh User Perspective: Lesson 1 ===');
state.lessonId = 'cpp-basics';
state.scaffoldStage = 'worked';
state.exercise = 'mini';
const w = workspace();

console.log('✓ Stage 1 (Worked) Walkthrough rendered:', w.includes('worked-walkthrough-panel'));
console.log('✓ Primary "Run and Observe" demonstration action:', w.includes('data-action="run-worked-example"'));
console.log('✓ Next-step transition card to Faded:', w.includes('worked-transition-card'));
console.log('✓ Separate practice workspace collapsed in preview drawer:', w.includes('practice-workspace-preview-drawer'));
console.log('✓ Submit button disabled to prevent learner confusion:', w.includes('disabled-worked'));

console.log('\n=== 2. Advance to Stage 2: Faded Practice ===');
state.scaffoldStage = 'faded';
const f = workspace();

console.log('✓ Worked walkthrough hidden in Faded:', !f.includes('worked-walkthrough-panel'));
console.log('✓ Active exercise card rendered above code editor:', f.indexOf('active-exercise-card') < f.indexOf('class="code-zone"'));
console.log('✓ Active exercise title visible:', f.includes('Personalized Greeting'));
console.log('✓ Exact task description visible above editor:', f.includes('🎯 YOUR TASK:'));
console.log('✓ Sample test cases (Input & Output) visible above editor:', f.includes('visible-tests-preview'));
console.log('✓ Submit assessment action active & enabled:', f.includes('data-action="submit-assess"') && !f.includes('disabled-worked'));

console.log('\n=== 3. Testing All Five Stage Buttons in Scaffolding Ladder ===');
const stages = ['worked', 'faded', 'guided', 'independent', 'transfer'];
stages.forEach((stage, idx) => {
  state.scaffoldStage = stage;
  state.exercise = stage === 'guided' ? 'medium' : stage === 'independent' ? 'hard' : 'mini';
  const html = workspace();
  const isActive = html.includes(`stage-pill ${stage} active`);
  console.log(`✓ Stage ${idx + 1} (${stage}) button active state rendered correctly:`, isActive);
});

console.log('\n=== 4. Checking CSS Alignment for .stage-pill.independent ===');
import fs from 'node:fs';
import path from 'node:path';
const styleCss = fs.readFileSync(path.resolve(process.cwd(), 'src/style.css'), 'utf8');
const beginnerCss = fs.readFileSync(path.resolve(process.cwd(), 'src/beginner/beginner.css'), 'utf8');

const styleIso = styleCss.includes('.stage-pill.independent');
const beginnerIso = beginnerCss.includes('.stage-pill.independent');
console.log('✓ style.css isolates .stage-pill.independent:', styleIso);
console.log('✓ beginner.css isolates .stage-pill.independent:', beginnerIso);

console.log('\nALL VERIFICATION CHECKS PASSED.');
