/**
 * Live GCC Reference Solution Validation for Phase E7 Benchmark Battery.
 * Compiles and assesses all 8 benchmark reference solutions using real g++,
 * ensuring 100% compilation and testing correctness.
 * Also tests adversarial hardcoding detection on hidden tests.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assessSubmission } from '../server/assessor.js';
import { findCompiler } from '../server/executor.js';
import { benchmarkBattery, benchmarkBatteryMap } from '../src/benchmark/benchmarkData.js';

const compiler = findCompiler();
const describeWithCompiler = compiler ? describe : describe.skip;

describeWithCompiler('Live Benchmark Reference Solution & Adversarial GCC Verification', { concurrency: 1 }, () => {
  for (const bench of benchmarkBattery) {
    it(`compiles and passes all visible & hidden tests for benchmark: ${bench.id}`, async () => {
      assert.ok(bench.solution, `Benchmark ${bench.id} must have a reference solution`);
      assert.ok(bench.testCases.length >= 4, `Benchmark ${bench.id} must have >= 4 test cases`);

      const result = await assessSubmission(bench.solution, bench);

      assert.equal(
        result.status,
        'success',
        `Execution status must be success for ${bench.id}, got ${result.status} (stderr: ${result.compilation?.stderr || result.testResults?.find(t => !t.passed)?.message})`
      );
      assert.equal(
        result.passed,
        true,
        `All test cases must pass for reference solution in ${bench.id}`
      );
      assert.equal(
        result.summary.failed,
        0,
        `Expected 0 failed tests for ${bench.id}, got ${result.summary.failed}`
      );
      assert.equal(
        result.summary.passed,
        bench.testCases.length,
        `Expected all ${bench.testCases.length} tests to pass for ${bench.id}`
      );

      // Verify hidden test privacy protection
      for (const res of result.testResults) {
        if (res.isHidden) {
          assert.equal(res.input, undefined, `Hidden test input must not be leaked in result for ${bench.id}`);
          assert.equal(res.expectedOutput, undefined, `Hidden expectedOutput must not be leaked in result for ${bench.id}`);
        }
      }
    });
  }

  it('verifies that an adversarial hardcoded solution fails hidden tests for bench-sensor-telemetry', async () => {
    const bench = benchmarkBatteryMap['bench-sensor-telemetry'];
    // Hardcoded to only handle visible test 1
    const hardcodedCode = `#include <iostream>
#include <string>
using namespace std;

int main() {
  string id;
  int b, t;
  if (cin >> id >> b >> t) {
    if (id == "SN-101") {
      cout << "ALERT: Sensor SN-101 variance exceeded (32 vs baseline 25)\\n";
      cout << "Sensor SN-101: 2 readings, Baseline: 25, Current: 32";
    } else {
      cout << "ALERT: Sensor TMP-9 variance exceeded (-12 vs baseline 0)\\n";
      cout << "Sensor TMP-9: 3 readings, Baseline: 0, Current: -12";
    }
  }
  return 0;
}`;

    const result = await assessSubmission(hardcodedCode, bench);
    assert.equal(result.passed, false, 'Hardcoded visible test solution must fail overall assessment');
    assert.ok(result.summary.failed > 0, 'Must have at least 1 failed hidden test');
  });

  it('verifies that an unguided starter code fails assessment cleanly without crashing the test runner', async () => {
    const bench = benchmarkBatteryMap['bench-fleet-management'];
    const result = await assessSubmission(bench.starterCode, bench);
    assert.equal(result.passed, false, 'Empty starter code must not pass assessment');
  });
});
