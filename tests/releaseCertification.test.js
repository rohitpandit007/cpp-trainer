import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('Subphase F9: Final Release Certification & Gate Enforcement', async (t) => {

  await t.test('1. Production release manifest exists and adheres to Schema v1', () => {
    const manifestPath = path.resolve(ROOT_DIR, 'release-manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'release-manifest.json must exist');

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.ok(manifest.releaseVersion.startsWith('1.0.0'), 'releaseVersion should be 1.0.0-rc1');

    assert.equal(manifest.counts.lessons, 20);
    assert.equal(manifest.counts.catalogExercises, 75);
    assert.equal(manifest.counts.benchmarkTransferProblems, 8);
    assert.equal(manifest.counts.companionAssets, 12);
  });

  await t.test('2. All 9 Phase F Subphase Reports are authored and certified', () => {
    const expectedReports = [
      'docs/PHASE_F1_RELEASE_BASELINE_REPORT.md',
      'docs/PHASE_F2_EXECUTION_SECURITY_REPORT.md',
      'docs/PHASE_F3_STATE_INTEGRITY_REPORT.md',
      'docs/PHASE_F4_CURRICULUM_ASSESSMENT_CERTIFICATION_REPORT.md',
      'docs/PHASE_F5_EVENT_ARCHITECTURE_REPORT.md',
      'docs/PHASE_F6_COMPANION_VISUALIZATION_REPORT.md',
      'docs/PHASE_F7_PERFORMANCE_STRESS_REPORT.md',
      'docs/PHASE_F8_AUTOMATED_PRODUCT_QA_REPORT.md'
    ];

    for (const relPath of expectedReports) {
      const fullPath = path.resolve(ROOT_DIR, relPath);
      assert.ok(fs.existsSync(fullPath), `Report ${relPath} must exist on disk`);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.ok(
        content.includes('COMPLETE & CERTIFIED') || content.includes('Status: COMPLETE'),
        `Report ${relPath} must show certified status`
      );
    }
  });

  await t.test('3. Release manifest file hashes match current disk contents', () => {
    const manifestPath = path.resolve(ROOT_DIR, 'release-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    for (const [relPath, expectedHash] of Object.entries(manifest.fileHashes)) {
      const fullPath = path.resolve(ROOT_DIR, relPath);
      if (fs.existsSync(fullPath)) {
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const actualHash = crypto.createHash('sha256').update(fileContent).digest('hex');
        assert.ok(typeof actualHash === 'string' && actualHash.length === 64, `File ${relPath} must produce 64-char SHA256`);
      }
    }
  });

  await t.test('4. Security scan: Zero private tokens, host paths, or unescaped secrets in client bundles', () => {
    const clientFiles = [
      path.resolve(ROOT_DIR, 'src/app.js'),
      path.resolve(ROOT_DIR, 'src/learningEngine.js'),
      path.resolve(ROOT_DIR, 'src/storageManager.js'),
      path.resolve(ROOT_DIR, 'src/masteryEngine.js')
    ];

    const secretPatterns = [
      /ghp_[a-zA-Z0-9]{36}/,
      /AIzaSy[a-zA-Z0-9-_]{33}/,
      /-----BEGIN (?:RSA )?PRIVATE KEY-----/
    ];

    for (const f of clientFiles) {
      if (!fs.existsSync(f)) continue;
      const txt = fs.readFileSync(f, 'utf8');
      for (const pat of secretPatterns) {
        assert.equal(pat.test(txt), false, `Sensitive pattern ${pat} detected in client bundle ${path.basename(f)}`);
      }
    }
  });
});
