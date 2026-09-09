import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateReleaseManifest } from '../scripts/generateReleaseManifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('Subphase F1: Baseline Integrity & Release Manifest Audit', async (t) => {
  const manifest = await generateReleaseManifest();

  await t.test('manifest satisfies core curriculum and syllabus counts', () => {
    assert.equal(manifest.counts.modules, 5, 'Must have exactly 5 syllabus modules');
    assert.equal(manifest.counts.lessons, 20, 'Must have exactly 20 syllabus lessons');
    assert.equal(manifest.counts.lessonExerciseSlots, 60, 'Must have exactly 60 lesson exercise slots (mini/medium/hard)');
    assert.equal(manifest.counts.catalogExercises, 75, 'Catalog must be frozen at exactly 75 exercises');
    assert.equal(manifest.counts.benchmarkTransferProblems, 8, 'Benchmark battery must have exactly 8 transfer problems');
  });

  await t.test('manifest confirms all 12 companion assets exist on disk', () => {
    assert.equal(manifest.counts.companionAssets, 12, 'Must have exactly 12 illustration PNGs in assets/companion');
    for (const asset of manifest.verifiedAssets) {
      assert.equal(asset.exists, true, `Companion asset ${asset.filename} for state ${asset.state} must exist on disk`);
    }
  });

  await t.test('manifest records non-empty file hashes for critical core files', () => {
    for (const [filePath, hash] of Object.entries(manifest.fileHashes)) {
      assert.ok(hash && hash.length === 64, `File ${filePath} must have a valid 64-character SHA-256 hash`);
    }
  });

  await t.test('release-manifest.json is persisted and valid JSON', () => {
    const manifestPath = path.join(ROOT_DIR, 'release-manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'release-manifest.json must exist');
    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(content.releaseVersion, '1.0.0-rc1');
  });
});
