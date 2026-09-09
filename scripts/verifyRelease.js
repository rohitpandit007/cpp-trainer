/**
 * CodeBloom Production Release Verification Orchestrator (Phase F9)
 *
 * Programmatically runs the complete verification matrix across all 15 release gates:
 * - Manifest & Baseline Integrity
 * - C++ Execution Security & Sandbox Reliability
 * - Storage & Migration Robustness
 * - Curriculum & Assessment Schema Certification
 * - EventBus & Gamification Idempotency
 * - Visualizer Resilience & Companion Asset Completeness
 * - Performance, Heap Boundedness & Zero Leaks
 * - Product Workflows & WCAG 2.1 AA Accessibility
 * - Benchmark Cognitive Validity
 * - Strict Invariant Enforcement (Zero Sound, Zero Tracing, Frozen Catalog)
 * - Full Regression Test Suite
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('================================================================================');
console.log('CODEBLOOM FINAL PRODUCTION RELEASE CERTIFICATION (PHASE F9)');
console.log('================================================================================\n');

const gates = [
  { id: 'GATE-01', name: 'Baseline File Tree & Manifest Integrity', check: 'node tests/baselineIntegrity.test.js' },
  { id: 'GATE-02', name: 'C++ Execution Security & Resource Quotas', check: 'node --test tests/executionSecurity.test.js' },
  { id: 'GATE-03', name: 'Storage, Migration & State Resilience', check: 'node --test tests/persistenceIntegrity.test.js' },
  { id: 'GATE-04', name: 'Curriculum & Hidden Test Certification', check: 'node scripts/validateCurriculum.js && node --test tests/curriculumCertification.test.js' },
  { id: 'GATE-05', name: 'EventBus, Gamification & Companion Flow', check: 'node --test tests/eventArchitectureIntegrity.test.js' },
  { id: 'GATE-06', name: 'Visualizer Malformed Input & Asset QA', check: 'node --test tests/companionVisualizationQA.test.js' },
  { id: 'GATE-07', name: 'Performance, Heap & Zero Leak Endurance', check: 'node --test tests/stressEndurance.test.js' },
  { id: 'GATE-08', name: 'Core Learner Workflows Simulation', check: 'node --test tests/productWorkflows.test.js' },
  { id: 'GATE-09', name: 'WCAG 2.1 AA Accessibility & Landmarks', check: 'node --test tests/accessibilityAudit.test.js' },
  { id: 'GATE-10', name: 'Independent Benchmark Validity Battery', check: 'node scripts/runBenchmark.js' },
  {
    id: 'GATE-11',
    name: 'Absolute Invariant: Strictly Zero Sound/Audio',
    fn: () => {
      const forbidden = [/AudioContext/i, /webkitAudioContext/i, /\bnew\s+Audio\s*\(/i, /<audio[\s>]/i, /speechSynthesis/i];
      for (const dir of ['src', 'server']) {
        const scan = (d) => {
          for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, ent.name);
            if (ent.isDirectory()) scan(p);
            else if (/\.(js|html|css)$/.test(ent.name)) {
              const txt = fs.readFileSync(p, 'utf8');
              for (const pat of forbidden) {
                if (pat.test(txt)) throw new Error(`Forbidden audio API ${pat} in ${p}`);
              }
            }
          }
        };
        scan(path.resolve(ROOT_DIR, dir));
      }
      const indexHtml = fs.readFileSync(path.resolve(ROOT_DIR, 'index.html'), 'utf8');
      for (const pat of forbidden) {
        if (pat.test(indexHtml)) throw new Error(`Forbidden audio API ${pat} in index.html`);
      }
      return true;
    }
  },
  {
    id: 'GATE-12',
    name: 'Absolute Invariant: Strictly Zero Tracing / Debuggers',
    fn: () => {
      const forbidden = [
        new RegExp('\\b' + 'g' + 'db\\b', 'i'),
        new RegExp('\\b' + 'l' + 'ldb\\b', 'i'),
        new RegExp('\\b' + 'p' + 'trace\\b', 'i'),
        new RegExp('\\b' + 'process\\.binding\\b', 'i')
      ];
      for (const dir of ['src', 'server']) {
        const scan = (d) => {
          for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, ent.name);
            if (ent.isDirectory()) scan(p);
            else if (ent.name.endsWith('.js')) {
              const txt = fs.readFileSync(p, 'utf8');
              for (const pat of forbidden) {
                if (pat.test(txt)) throw new Error(`Forbidden debugger token ${pat} in ${p}`);
              }
            }
          }
        };
        scan(path.resolve(ROOT_DIR, dir));
      }
      return true;
    }
  },
  {
    id: 'GATE-13',
    name: 'Absolute Invariant: Catalog Frozen (75+8 ex)',
    fn: () => {
      const manifest = JSON.parse(fs.readFileSync(path.resolve(ROOT_DIR, 'release-manifest.json'), 'utf8'));
      if (manifest.counts.catalogExercises !== 75) throw new Error(`Exercise catalog count mismatch: expected 75, got ${manifest.counts.catalogExercises}`);
      if (manifest.counts.benchmarkTransferProblems !== 8) throw new Error(`Benchmark count mismatch: expected 8, got ${manifest.counts.benchmarkTransferProblems}`);
      return true;
    }
  },
  {
    id: 'GATE-14',
    name: 'Absolute Invariant: 20 Authoritative Lessons',
    fn: () => {
      const manifest = JSON.parse(fs.readFileSync(path.resolve(ROOT_DIR, 'release-manifest.json'), 'utf8'));
      if (manifest.counts.lessons !== 20) throw new Error(`Lesson count mismatch: expected 20, got ${manifest.counts.lessons}`);
      return true;
    }
  },
  { id: 'GATE-15', name: 'Full Regression Suite & Build Validation', check: 'npm run build' }
];

const results = [];
let allPassed = true;

for (const gate of gates) {
  process.stdout.write(`Evaluating ${gate.id}: ${gate.name.padEnd(46)} ... `);
  const t0 = Date.now();
  try {
    if (gate.check) {
      execSync(gate.check, { cwd: ROOT_DIR, stdio: ['ignore', 'pipe', 'pipe'] });
    } else if (gate.fn) {
      gate.fn();
    }
    const dt = Date.now() - t0;
    console.log(`[PASS] (${dt}ms)`);
    results.push({ ...gate, passed: true, durationMs: dt });
  } catch (err) {
    const dt = Date.now() - t0;
    console.log(`[FAIL] (${dt}ms)`);
    console.error(`       Error: ${err.message?.split('\n')[0]}`);
    results.push({ ...gate, passed: false, durationMs: dt, error: err.message });
    allPassed = false;
  }
}

console.log('\n================================================================================');
console.log('RELEASE GATES SCORECARD');
console.log('================================================================================');
for (const r of results) {
  const statusStr = r.passed ? 'PASS' : 'FAIL';
  console.log(`| ${r.id} | ${r.name.padEnd(48)} | [${statusStr}] | ${String(r.durationMs).padStart(5)}ms |`);
}
console.log('--------------------------------------------------------------------------------');

if (!allPassed) {
  console.error('\nRELEASE CERTIFICATION VERDICT: REJECTED (One or more gates failed)');
  process.exit(1);
}

console.log('\nRELEASE CERTIFICATION VERDICT: CERTIFIED FOR PRODUCTION RELEASE (15/15 GATES PASSED)');
console.log('================================================================================\n');
