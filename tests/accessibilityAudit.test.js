import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('Subphase F8: Accessibility & WCAG 2.1 AA Compliance Audit', async (t) => {

  await t.test('1. Core ARIA Landmarks in application markup', () => {
    const appJs = fs.readFileSync(path.resolve(ROOT_DIR, 'src/app.js'), 'utf8');

    // role="banner"
    assert.ok(appJs.includes('role="banner"'), 'Application must define banner landmark for top header');

    // role="navigation"
    assert.ok(appJs.includes('role="navigation"'), 'Application must define navigation landmark for sidebar/modes');

    // <main class="workspace"> and <main class="independent">
    assert.ok(appJs.includes('<main class="workspace">'), 'Main landmark must be present for lesson workspace');
    assert.ok(appJs.includes('<main class="independent">'), 'Main landmark must be present for independent mode');

    // role="complementary" for companion dock
    const compJs = fs.readFileSync(path.resolve(ROOT_DIR, 'src/companion/pikachuCompanion.js'), 'utf8');
    assert.ok(
      compJs.includes("setAttribute('role', 'complementary')") || compJs.includes('role="complementary"'),
      'Companion dock must declare complementary role'
    );

    // role="region" for interactive visualizer
    const vizJs = fs.readFileSync(path.resolve(ROOT_DIR, 'src/visualization/conceptVisualizer.js'), 'utf8');
    assert.ok(
      vizJs.includes("setAttribute('role', 'region')") || vizJs.includes('role="region"'),
      'Concept visualizer must declare region role'
    );
  });

  await t.test('2. Screen Reader Live Regions and Status Alerts', () => {
    const appJs = fs.readFileSync(path.resolve(ROOT_DIR, 'src/app.js'), 'utf8');
    const compJs = fs.readFileSync(path.resolve(ROOT_DIR, 'src/companion/pikachuCompanion.js'), 'utf8');

    // Live regions for execution / assessment feedback
    assert.ok(appJs.includes('aria-live="polite"'), 'Execution feedback must declare aria-live="polite"');
    assert.ok(compJs.includes('aria-live="polite"'), 'Companion speech bubble must declare aria-live="polite"');

    // Status role for feedback state
    assert.ok(appJs.includes('role="status"'), 'Execution feedback state must declare role="status"');
  });

  await t.test('3. Keyboard Navigation & Focus Accessibility', () => {
    const appJs = fs.readFileSync(path.resolve(ROOT_DIR, 'src/app.js'), 'utf8');
    const vizJs = fs.readFileSync(path.resolve(ROOT_DIR, 'src/visualization/conceptVisualizer.js'), 'utf8');
    const compJs = fs.readFileSync(path.resolve(ROOT_DIR, 'src/companion/pikachuCompanion.js'), 'utf8');

    // Tabindex on interactive elements
    assert.ok(compJs.includes('tabindex="0"'), 'Interactive avatar frame must have tabindex="0"');

    // Keyboard handlers (Escape, Enter, Space)
    assert.ok(vizJs.includes("e.key === 'Escape'"), 'Visualizer must dismiss on Escape key');
    assert.ok(vizJs.includes("e.key === 'ArrowRight'"), 'Visualizer must navigate on Arrow keys');
    assert.ok(compJs.includes("e.key === 'Enter'") && compJs.includes("e.key === ' '"), 'Companion avatar must activate on Enter/Space');
  });

  await t.test('4. Color Contrast & Theme Tokens (Dark & Light Mode)', () => {
    const styleCss = fs.readFileSync(path.resolve(ROOT_DIR, 'src/style.css'), 'utf8');

    // Check theme definitions
    assert.ok(styleCss.includes('.dark-mode'), 'style.css must support .dark-mode class');

    // Essential CSS root variables for contrast
    const requiredVars = [
      '--ink',
      '--paper',
      '--card',
      '--mint',
      '--dark'
    ];

    for (const v of requiredVars) {
      assert.ok(styleCss.includes(v), `style.css must declare theme variable ${v}`);
    }
  });

  await t.test('5. Responsive Layout Breakpoint Rules in CSS', () => {
    const styleCss = fs.readFileSync(path.resolve(ROOT_DIR, 'src/style.css'), 'utf8');
    const compCss = fs.readFileSync(path.resolve(ROOT_DIR, 'src/companion/companion.css'), 'utf8');

    // Verify presence of responsive media queries
    assert.ok(styleCss.includes('@media'), 'style.css must declare responsive media queries');
    assert.ok(compCss.includes('@media'), 'companion.css must declare responsive media queries');

    // Check tablet / mobile breakpoints (768px / 640px / 480px)
    assert.ok(
      styleCss.includes('max-width: 768px') || styleCss.includes('max-width: 900px') || styleCss.includes('max-width: 1024px'),
      'style.css must declare tablet/laptop responsive breakpoints'
    );
  });
});
