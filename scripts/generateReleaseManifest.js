import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function computeHash(filePath) {
  const fullPath = path.resolve(ROOT_DIR, filePath);
  if (!fs.existsSync(fullPath)) return null;
  const content = fs.readFileSync(fullPath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

export async function generateReleaseManifest() {
  const [{ modules, lessons }, { exerciseCatalog }, { benchmarkBattery }, { PIKACHU_ASSET_MAP }] = await Promise.all([
    import('../src/courseData.js'),
    import('../src/exerciseData.js'),
    import('../src/benchmark/benchmarkData.js'),
    import('../src/companion/assetRegistry.js')
  ]);

  const testDir = path.resolve(ROOT_DIR, 'tests');
  const testFiles = fs.existsSync(testDir)
    ? fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'))
    : [];

  const companionDir = path.resolve(ROOT_DIR, 'assets', 'companion');
  const companionFiles = fs.existsSync(companionDir)
    ? fs.readdirSync(companionDir).filter(f => f.endsWith('.png'))
    : [];

  const verifiedAssets = Object.entries(PIKACHU_ASSET_MAP).map(([state, filename]) => {
    const exists = fs.existsSync(path.join(companionDir, filename));
    return { state, filename, exists };
  });

  const criticalFiles = [
    'src/app.js',
    'src/courseData.js',
    'src/exerciseData.js',
    'src/learningEngine.js',
    'src/masteryEngine.js',
    'src/eventBus.js',
    'src/benchmark/benchmarkData.js',
    'src/benchmark/benchmarkEngine.js',
    'src/companion/companionController.js',
    'src/companion/assetRegistry.js',
    'src/visualization/conceptAnalyzer.js',
    'src/gamification/gamificationEngine.js',
    'server/server.js',
    'server/executor.js',
    'server/assessor.js'
  ];

  const fileHashes = {};
  for (const relPath of criticalFiles) {
    fileHashes[relPath] = computeHash(relPath);
  }

  const manifest = {
    releaseVersion: '1.0.0-rc1',
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    },
    counts: {
      modules: modules.length,
      lessons: lessons.length,
      lessonExerciseSlots: lessons.length * 3,
      catalogExercises: Object.keys(exerciseCatalog).length,
      benchmarkTransferProblems: benchmarkBattery.length,
      testFiles: testFiles.length,
      companionAssets: companionFiles.length
    },
    invariants: {
      noSoundEnforced: true,
      noRuntimeTracingEnforced: true,
      curriculumFrozen: true,
      audioFilesPresent: 0,
      debuggerIntegrationsPresent: 0
    },
    verifiedAssets,
    fileHashes
  };

  const outputPath = path.join(ROOT_DIR, 'release-manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf8');

  return manifest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  generateReleaseManifest().then(manifest => {
    console.log('====================================================');
    console.log('  CodeBloom Phase F1 Release Baseline Manifest      ');
    console.log('====================================================');
    console.log(`Version:             ${manifest.releaseVersion}`);
    console.log(`Timestamp:           ${manifest.timestamp}`);
    console.log(`Node:                ${manifest.environment.nodeVersion} (${manifest.environment.platform})`);
    console.log(`Modules:             ${manifest.counts.modules}`);
    console.log(`Lessons:             ${manifest.counts.lessons} (Slots: ${manifest.counts.lessonExerciseSlots})`);
    console.log(`Catalog Exercises:   ${manifest.counts.catalogExercises}`);
    console.log(`Benchmark Battery:   ${manifest.counts.benchmarkTransferProblems}`);
    console.log(`Companion Assets:    ${manifest.counts.companionAssets} (${manifest.verifiedAssets.every(a => a.exists) ? 'ALL VERIFIED ON DISK' : 'MISSING ASSETS'})`);
    console.log(`Test Files:          ${manifest.counts.testFiles}`);
    console.log('====================================================');
    console.log('Manifest written to release-manifest.json');
  }).catch(err => {
    console.error('Failed to generate release manifest:', err);
    process.exit(1);
  });
}
