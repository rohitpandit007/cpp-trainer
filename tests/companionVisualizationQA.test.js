import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeCppSource, CONCEPT_FAMILIES } from '../src/visualization/conceptAnalyzer.js';
import { TimelineModel } from '../src/visualization/timelineModel.js';
import { AssetRegistry, PIKACHU_ASSET_MAP } from '../src/companion/assetRegistry.js';
import { COMPANION_STATES } from '../src/companion/companionState.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('Subphase F6: Visualization & Companion Automated QA', async (t) => {

  await t.test('1. Malformed C++ input stress: 30 diverse syntax error patterns NEVER crash analyzer', () => {
    const malformedInputs = [
      '',                                                    // 1. Empty
      '   \n\t   ',                                          // 2. Whitespace only
      'int main() {',                                        // 3. Unclosed brace
      'int main() }',                                        // 4. Missing open brace
      'class { int x; };',                                   // 5. Nameless class
      'class A : public { int x; };',                        // 6. Broken inheritance syntax
      'virtual void = 0;',                                   // 7. Broken pure virtual outside class
      'int* p = ;',                                          // 8. Missing RHS in pointer
      'int& r = &x;',                                        // 9. Bad ref assignment
      'int x = 10; x === 20;',                               // 10. Corrupted JS triple equals in C++
      'void foo(int a, ) {}',                                // 11. Trailing comma in params
      'template <typename ...> class;',                      // 12. Fragmented variadic template
      '#define FOO(a, b) ((a) + (b) +++',                    // 13. Broken macro
      'int a = 1; /* unclosed comment',                     // 14. Unclosed comment
      'string s = "unclosed string literal;',               // 15. Unclosed string
      'char c = \'toolong\';',                               // 16. Multi-char literal
      'delete delete delete;',                               // 17. Keyword spam
      'struct S { S() : }',                                  // 18. Broken ctor initializer list
      'virtual virtual virtual override;',                   // 19. Repeated specifiers
      'int main() { return 0; } \0 extra null byte',        // 20. Null byte injection
      '🚀 ✨ 💻 int emo = 100;',                             // 21. Unicode emojis in code
      '\\u0000\\u001b[31mRed Code\\u001b[0m',               // 22. ANSI escape sequences
      'int 123invalid_ident = 42;',                          // 23. Invalid identifier
      'void main() { auto x = [](){ return [](){}; }; }',    // 24. Nested lambdas
      'class A { ~A(int x) {} };',                           // 25. Destructor with invalid parameter
      'int* p = new (std::nothrow) int[1000000000000ULL];',  // 26. Nothrow huge allocation
      'asm volatile ("nop");',                               // 27. Inline asm construct
      '__declspec(align(64)) struct CacheLine {};',          // 28. Compiler-specific attribute
      Array(200).fill('int x = 1;').join('\n'),              // 29. 200 variable declarations
      null,                                                  // 30. Null input
      undefined,                                             // 31. Undefined input
      { code: 'corrupted' }                                  // 32. Non-string object
    ];

    assert.ok(malformedInputs.length >= 30, 'Must test at least 30 malformed patterns');

    for (let i = 0; i < malformedInputs.length; i++) {
      const input = malformedInputs[i];
      let analysis;
      assert.doesNotThrow(() => {
        analysis = analyzeCppSource(input);
      }, `Analyzer threw unhandled exception on pattern #${i + 1}`);

      assert.ok(typeof analysis === 'object' && analysis !== null, `Pattern #${i + 1} must return object`);

      // Generate timeline on the analysis result must also never crash
      let timeline;
      assert.doesNotThrow(() => {
        timeline = TimelineModel.generateTimeline(analysis);
      }, `TimelineModel threw unhandled exception on pattern #${i + 1}`);

      assert.ok(typeof timeline === 'object' && timeline !== null, `Pattern #${i + 1} timeline must be valid`);
      assert.ok(Array.isArray(timeline.steps) && timeline.steps.length >= 1, `Pattern #${i + 1} must provide at least 1 timeline step`);
    }
  });

  await t.test('2. Timeline Model Step Clamping (Max 100 steps to prevent DOM explosion)', () => {
    // Construct an artificial analysis with 150 variables
    const fakeMeta = {
      variables: Array(150).fill(0).map((_, i) => ({
        name: `var_${i}`,
        type: 'int',
        initialValue: '0',
        lineNumber: i + 1,
        assignments: [{ value: '42', lineNumber: i + 2 }]
      }))
    };

    const fakeAnalysis = {
      supported: true,
      primaryConcept: CONCEPT_FAMILIES.VARIABLES,
      metadata: fakeMeta
    };

    const timeline = TimelineModel.generateTimeline(fakeAnalysis);
    assert.ok(Array.isArray(timeline.steps));
    assert.ok(timeline.steps.length <= 100, `Timeline steps must be clamped to <= 100 (got ${timeline.steps.length})`);
  });

  await t.test('3. Static Model Invariant Audit: Zero GDB / LLDB / hardware register references in visualizer', () => {
    const vizFiles = [
      path.resolve(ROOT_DIR, 'src/visualization/conceptAnalyzer.js'),
      path.resolve(ROOT_DIR, 'src/visualization/timelineModel.js'),
      path.resolve(ROOT_DIR, 'src/visualization/visualPrimitives.js'),
      path.resolve(ROOT_DIR, 'src/visualization/conceptVisualizer.js')
    ];

    const forbidden = [
      /\bgdb\b/i,
      /\blldb\b/i,
      /\bptrace\b/i,
      /\b(?:cpu|hardware)\s+registers?\b/i,
      /\b(eax|ebx|ecx|edx|rax|rbx|rcx|rdx|rip|rbp|rsp)\b/i
    ];

    for (const filePath of vizFiles) {
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf8');
      for (const pat of forbidden) {
        assert.equal(pat.test(content), false, `Forbidden hardware/debugger term ${pat} found in ${path.basename(filePath)}`);
      }
    }
  });

  await t.test('4. Companion Asset Registry: 12 verified Pikachu assets exist and resolve correctly', () => {
    const registry = new AssetRegistry();
    const character = registry.getCharacter('pikachu');

    assert.ok(character, 'Pikachu character pack must be registered');
    const assetMap = character.assetMap;

    const expectedStates = [
      COMPANION_STATES.IDLE,
      COMPANION_STATES.THINKING,
      COMPANION_STATES.CODING,
      COMPANION_STATES.TEST_PASSED,
      COMPANION_STATES.WRONG_OUTPUT,
      COMPANION_STATES.COMPILE_ERROR,
      COMPANION_STATES.RUNTIME_ERROR,
      COMPANION_STATES.TIRED,
      COMPANION_STATES.CELEBRATION,
      COMPANION_STATES.INDEPENDENT_SUCCESS,
      COMPANION_STATES.MASTERY,
      COMPANION_STATES.ULTIMATE_MASTERY
    ];

    assert.equal(expectedStates.length, 12, 'Must have exactly 12 semantic states');

    for (const state of expectedStates) {
      const filename = assetMap[state];
      assert.ok(filename, `State ${state} must have filename mapped`);
      const diskPath = path.resolve(ROOT_DIR, 'assets/companion', filename);
      assert.ok(fs.existsSync(diskPath), `Physical asset file for ${state} (${filename}) must exist on disk`);

      const resolvedUrl = registry.getAssetUrl(state);
      assert.ok(resolvedUrl.includes(encodeURIComponent(filename)) || resolvedUrl.includes(filename), `Asset URL for ${state} must resolve to filename`);
    }

    // Fallback on unknown state
    const fallbackUrl = registry.getAssetUrl('TOTALLY_UNKNOWN_STATE');
    assert.ok(fallbackUrl.endsWith('default.png'), 'Unknown state must safely fall back to default.png');
  });

  await t.test('5. Reduced-Motion & Accessibility CSS Invariants', () => {
    const compCssPath = path.resolve(ROOT_DIR, 'src/companion/companion.css');
    const vizCssPath = path.resolve(ROOT_DIR, 'src/visualization/visualizer.css');

    assert.ok(fs.existsSync(compCssPath), 'companion.css must exist');
    assert.ok(fs.existsSync(vizCssPath), 'visualizer.css must exist');

    const compCss = fs.readFileSync(compCssPath, 'utf8');
    const vizCss = fs.readFileSync(vizCssPath, 'utf8');

    // Verify prefers-reduced-motion media queries
    assert.ok(compCss.includes('prefers-reduced-motion'), 'companion.css must declare prefers-reduced-motion media query');
    assert.ok(vizCss.includes('prefers-reduced-motion'), 'visualizer.css must declare prefers-reduced-motion media query');

    // Verify transition: none or animation: none in reduced motion styles
    assert.ok(compCss.includes('animation: none') || compCss.includes('transition: none'), 'companion.css must disable animations under reduced motion');
    assert.ok(vizCss.includes('animation: none') || vizCss.includes('transition: none'), 'visualizer.css must disable animations under reduced motion');
  });

  await t.test('6. HTML & DOM Accessibility Attributes', () => {
    const pikachuComp = fs.readFileSync(path.resolve(ROOT_DIR, 'src/companion/pikachuCompanion.js'), 'utf8');

    // Check ARIA live region for screen readers
    assert.ok(pikachuComp.includes('aria-live="polite"'), 'Pikachu companion speech bubble must have aria-live="polite"');
    assert.ok(pikachuComp.includes("setAttribute('role', 'complementary')") || pikachuComp.includes('role="complementary"'), 'Companion dock must have role="complementary"');
    assert.ok(pikachuComp.includes('alt="Pikachu companion"'), 'Avatar image must have meaningful alt attribute');
  });
});
