/**
 * Subphase F7: Long-Session Performance & Stress Test Runner
 *
 * Runs 100 sequential compilation & execution cycles and 100 assessment cycles.
 * Measures latency, tracks heap growth, verifies zero temp directory leaks,
 * and ensures zero orphaned compiler or runner zombie processes.
 */

import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { executeCpp, cleanStaleTempDirectories } from '../server/executor.js';
import { assessSubmission } from '../server/assessor.js';

const ITERATIONS = parseInt(process.argv[2], 10) || 100;

console.log('================================================================================');
console.log(`CODEBLOOM PHASE F7: PERFORMANCE & LONG-SESSION STRESS TEST (${ITERATIONS} CYCLES)`);
console.log('================================================================================\n');

// Clean any pre-existing stale temp dirs before starting
cleanStaleTempDirectories(0);

const startHeap = process.memoryUsage().heapUsed;
const startTime = Date.now();

const sampleCode = `
#include <iostream>
using namespace std;
int main() {
    int sum = 0;
    for (int i = 1; i <= 10; ++i) {
        sum += i;
    }
    cout << "Sum: " << sum << endl;
    return 0;
}
`;

const sampleExerciseId = 'cpp-basics-mini';
const sampleSolution = `
#include <iostream>
using namespace std;
int main() {
    cout << "Hello, Alex!" << endl;
    return 0;
}
`;

console.log(`[Phase 1/2] Executing ${ITERATIONS} Sequential Compile & Run Cycles...`);
const compileLatencies = [];

for (let i = 1; i <= ITERATIONS; i++) {
  const t0 = Date.now();
  const res = await executeCpp(sampleCode, { timeoutMs: 3000 });
  const dt = Date.now() - t0;
  compileLatencies.push(dt);

  if (res.status !== 'success' || !res.stdout.includes('Sum: 55')) {
    console.error(`[FAIL] Compile iteration #${i} failed:`, res);
    process.exit(1);
  }

  if (i % 25 === 0 || i === ITERATIONS) {
    const avg = (compileLatencies.reduce((a, b) => a + b, 0) / compileLatencies.length).toFixed(1);
    console.log(`  - Completed ${i}/${ITERATIONS} cycles (Current avg: ${avg}ms/run)`);
  }
}

console.log(`\n[Phase 2/2] Executing ${ITERATIONS} Sequential Assessment Cycles...`);
const assessLatencies = [];

for (let i = 1; i <= ITERATIONS; i++) {
  const t0 = Date.now();
  const res = await assessSubmission(sampleSolution, sampleExerciseId, { testTimeoutMs: 3000 });
  const dt = Date.now() - t0;
  assessLatencies.push(dt);

  if (res.status !== 'success' || !res.passed) {
    console.error(`[FAIL] Assessment iteration #${i} produced unexpected error:`, res);
    process.exit(1);
  }

  if (i % 25 === 0 || i === ITERATIONS) {
    const avg = (assessLatencies.reduce((a, b) => a + b, 0) / assessLatencies.length).toFixed(1);
    console.log(`  - Completed ${i}/${ITERATIONS} cycles (Current avg: ${avg}ms/run)`);
  }
}

// -------------------------------------------------------------
// Memory Leak & Resource Verification
// -------------------------------------------------------------
if (global.gc) global.gc();

const endHeap = process.memoryUsage().heapUsed;
const heapGrowthMb = ((endHeap - startHeap) / (1024 * 1024)).toFixed(2);
const totalDurationSec = ((Date.now() - startTime) / 1000).toFixed(2);

// Check temporary directories in os.tmpdir()
const tmpEntries = fs.readdirSync(os.tmpdir(), { withFileTypes: true });
const leakedTempDirs = tmpEntries.filter(
  e => e.isDirectory() && (e.name.startsWith('cpp-trainer-') || e.name.startsWith('cpp-assess-'))
);

// Check zombie processes on Windows
let zombieProcesses = 0;
if (process.platform === 'win32') {
  try {
    const taskList = execSync('tasklist', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    const matches = taskList.match(/codebloom_[\w-]+\.exe/gi) || [];
    zombieProcesses = matches.length;
  } catch {}
}

const avgCompileMs = (compileLatencies.reduce((a, b) => a + b, 0) / compileLatencies.length).toFixed(1);
const avgAssessMs = (assessLatencies.reduce((a, b) => a + b, 0) / assessLatencies.length).toFixed(1);

console.log('\n================================================================================');
console.log('STRESS TEST RESULTS SUMMARY');
console.log('================================================================================');
console.log(`Total Cycles Run:              ${ITERATIONS * 2} (${ITERATIONS} compile + ${ITERATIONS} assess)`);
console.log(`Total Duration:                ${totalDurationSec}s`);
console.log(`Average Compile Latency:       ${avgCompileMs}ms`);
console.log(`Average Assessment Latency:    ${avgAssessMs}ms`);
console.log(`Process Heap Growth:           ${heapGrowthMb} MB (Limit: < 100 MB)`);
console.log(`Leaked Temp Directories:       ${leakedTempDirs.length} (Limit: 0)`);
console.log(`Zombie Runner Processes:       ${zombieProcesses} (Limit: 0)`);
console.log('--------------------------------------------------------------------------------');

let passed = true;
if (parseFloat(heapGrowthMb) > 100) {
  console.error('[FAIL] Heap growth exceeded 100 MB');
  passed = false;
}
if (leakedTempDirs.length > 0) {
  console.error(`[FAIL] Detected ${leakedTempDirs.length} leaked temporary directories!`);
  passed = false;
}
if (zombieProcesses > 0) {
  console.error(`[FAIL] Detected ${zombieProcesses} zombie runner processes!`);
  passed = false;
}

if (!passed) {
  console.error('\nSTATUS: FAILED (Resource Leak or Constraint Violation)');
  process.exit(1);
}

console.log('STATUS: PASSED (Zero Leaks, Bounded Memory, Responsive Turnaround)\n');
