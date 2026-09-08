import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { findCompiler, parseCompilerDiagnostics, generateFriendlyExplanation, killProcessTree } from './executor.js';
import { spawn } from 'node:child_process';
import { getExerciseById } from '../src/exerciseData.js';

const DEFAULT_TEST_TIMEOUT_MS = 3000;
const DEFAULT_COMPILE_TIMEOUT_MS = 8000;
const DEFAULT_MAX_OUTPUT_BYTES = 64 * 1024;

/**
 * Normalizes text output for fair comparison:
 * - Unifies CRLF / LF line endings
 * - Strips trailing whitespace per line
 * - Strips leading/trailing empty lines
 */
export function normalizeOutput(text) {
  if (typeof text !== 'string') return '';
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const cleaned = lines.map(line => line.trimEnd());
  // Remove leading and trailing empty lines
  while (cleaned.length > 0 && cleaned[0] === '') {
    cleaned.shift();
  }
  while (cleaned.length > 0 && cleaned[cleaned.length - 1] === '') {
    cleaned.pop();
  }
  return cleaned.join('\n');
}

/**
 * Compares actual output to expected output with numeric and whitespace tolerance.
 */
export function compareOutputs(actualRaw, expectedRaw) {
  const actual = normalizeOutput(actualRaw);
  const expected = normalizeOutput(expectedRaw);

  if (actual === expected) return true;

  // Check if both are numeric (e.g. floating point representation variations)
  const actNum = parseFloat(actual);
  const expNum = parseFloat(expected);
  if (!Number.isNaN(actNum) && !Number.isNaN(expNum)) {
    // If string lengths are simple numbers, check with floating point tolerance
    const actTokens = actual.split(/\s+/);
    const expTokens = expected.split(/\s+/);
    if (actTokens.length === expTokens.length) {
      const allNumbersMatch = actTokens.every((tok, i) => {
        const n1 = parseFloat(tok);
        const n2 = parseFloat(expTokens[i]);
        if (!Number.isNaN(n1) && !Number.isNaN(n2)) {
          return Math.abs(n1 - n2) < 0.001 || tok.startsWith(expTokens[i]) || expTokens[i].startsWith(tok);
        }
        return tok === expTokens[i];
      });
      if (allNumbersMatch) return true;
    }
  }

  // Token-by-token comparison ignoring extra whitespace inside lines
  const actWords = actual.split(/\s+/).filter(Boolean);
  const expWords = expected.split(/\s+/).filter(Boolean);
  if (actWords.length === expWords.length && actWords.every((w, i) => w === expWords[i])) {
    return true;
  }

  return false;
}

/**
 * Performs concept verification checks on the source code.
 */
export function verifyConcepts(source, conceptChecks = []) {
  const results = [];
  let allPassed = true;

  for (const check of conceptChecks) {
    if (!check.pattern) continue;
    const regex = new RegExp(check.pattern, 'i');
    const matches = regex.test(source);
    if (!matches) {
      allPassed = false;
      results.push({
        id: check.id,
        description: check.description,
        passed: false,
        message: check.message || `Missing required concept: ${check.description}`
      });
    } else {
      results.push({
        id: check.id,
        description: check.description,
        passed: true,
        message: 'Concept verified.'
      });
    }
  }

  return { passed: allPassed, checks: results };
}

/**
 * Compiles learner C++ source code once and evaluates it against all test cases.
 *
 * @param {string} source - Learner C++ source code
 * @param {object|string} exerciseOrId - Exercise specification or ID
 * @param {object} options - Assessment options
 * @returns {Promise<object>} Structured assessment results
 */
export async function assessSubmission(source, exerciseOrId, options = {}) {
  const exercise = typeof exerciseOrId === 'string'
    ? getExerciseById(exerciseOrId)
    : exerciseOrId;

  if (!exercise) {
    return {
      status: 'assessment_error',
      passed: false,
      message: `Unknown or unconfigured exercise: ${exerciseOrId}`,
      testResults: [],
      summary: { total: 0, passed: 0, failed: 0 }
    };
  }

  const {
    testTimeoutMs = DEFAULT_TEST_TIMEOUT_MS,
    compileTimeoutMs = DEFAULT_COMPILE_TIMEOUT_MS,
    maxOutputBytes = DEFAULT_MAX_OUTPUT_BYTES,
    compilerPath = null
  } = options;

  const trimmedSource = typeof source === 'string' ? source.trim() : '';
  if (!trimmedSource) {
    return {
      status: 'compile_error',
      passed: false,
      message: 'Source code is empty. Write your program before submitting.',
      compilation: {
        exitCode: 1,
        stderr: 'Source code is empty.',
        diagnostics: [{ line: 1, column: 1, severity: 'error', message: 'Source code is empty.' }],
        friendlyExplanation: 'No C++ code was provided. Please write your solution before submitting.'
      },
      testResults: [],
      summary: { total: exercise.testCases?.length || 0, passed: 0, failed: exercise.testCases?.length || 0 }
    };
  }

  const compiler = findCompiler(compilerPath);
  if (!compiler) {
    return {
      status: 'execution_error',
      passed: false,
      message: 'No C++ compiler found on the system.',
      compilation: {
        exitCode: null,
        stderr: 'No C++ compiler found in PATH or environment.',
        diagnostics: [],
        friendlyExplanation: 'The assessment system cannot find g++ or clang++ on the host machine.'
      },
      testResults: [],
      summary: { total: exercise.testCases?.length || 0, passed: 0, failed: exercise.testCases?.length || 0 }
    };
  }

  // Create isolated temporary workspace
  const runId = crypto.randomBytes(8).toString('hex');
  const tmpDir = path.join(os.tmpdir(), `cpp-assess-${runId}`);
  const sourcePath = path.join(tmpDir, 'solution.cpp');
  const exeName = process.platform === 'win32' ? 'solution.exe' : 'solution';
  const exePath = path.join(tmpDir, exeName);

  await fs.mkdir(tmpDir, { recursive: true });

  try {
    await fs.writeFile(sourcePath, source, 'utf8');

    // Step 1: Single Compilation Phase
    const compileResult = await compileSource({
      compiler,
      sourcePath,
      exePath,
      cwd: tmpDir,
      timeoutMs: compileTimeoutMs,
      maxOutputBytes
    });

    if (!compileResult.success) {
      const diagnostics = parseCompilerDiagnostics(compileResult.stderr);
      const friendlyExplanation = generateFriendlyExplanation(diagnostics, compileResult.stderr);

      return {
        status: compileResult.timedOut ? 'timeout' : 'compile_error',
        passed: false,
        message: compileResult.timedOut
          ? 'Compilation timed out.'
          : 'Your program could not be compiled. Check the compiler diagnostics below.',
        compilation: {
          exitCode: compileResult.exitCode,
          stderr: compileResult.stderr,
          diagnostics,
          friendlyExplanation
        },
        testResults: [],
        summary: { total: exercise.testCases?.length || 0, passed: 0, failed: exercise.testCases?.length || 0 }
      };
    }

    // Step 2: Multi-Test Execution Phase
    const testCases = exercise.testCases || [];
    const testResults = [];
    let passedCount = 0;
    let visiblePassed = 0;
    let visibleTotal = 0;
    let hiddenFailed = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const isHidden = Boolean(tc.isHidden);
      if (!isHidden) visibleTotal++;

      const runResult = await runBinary({
        exePath,
        stdin: tc.input || '',
        cwd: tmpDir,
        timeoutMs: testTimeoutMs,
        maxOutputBytes,
        compilerPath: compiler
      });

      if (runResult.timedOut) {
        if (isHidden) hiddenFailed++;
        testResults.push({
          id: tc.id || `test-${i + 1}`,
          description: isHidden ? `Test Case ${i + 1} (Hidden Test)` : (tc.description || `Test Case ${i + 1}`),
          isHidden,
          passed: false,
          status: 'timeout',
          message: `Execution timed out (> ${testTimeoutMs}ms). Check for infinite loops or waiting for more input.`,
          executionTimeMs: runResult.executionTimeMs
        });
        continue;
      }

      if (runResult.exitCode !== 0) {
        if (isHidden) hiddenFailed++;
        testResults.push({
          id: tc.id || `test-${i + 1}`,
          description: isHidden ? `Test Case ${i + 1} (Hidden Test)` : (tc.description || `Test Case ${i + 1}`),
          isHidden,
          passed: false,
          status: 'runtime_error',
          exitCode: runResult.exitCode,
          message: `Program crashed during execution (exit code: ${runResult.exitCode}).`,
          stderr: isHidden ? undefined : runResult.stderr,
          executionTimeMs: runResult.executionTimeMs
        });
        continue;
      }

      // Check output correctness
      const matches = compareOutputs(runResult.stdout, tc.expectedOutput || '');
      if (matches) {
        passedCount++;
        if (!isHidden) visiblePassed++;
        testResults.push({
          id: tc.id || `test-${i + 1}`,
          description: isHidden ? `Test Case ${i + 1} (Hidden Test)` : (tc.description || `Test Case ${i + 1}`),
          isHidden,
          passed: true,
          status: 'passed',
          message: 'Output matches expected result.',
          input: isHidden ? undefined : tc.input,
          expectedOutput: isHidden ? undefined : tc.expectedOutput,
          actualOutput: isHidden ? undefined : runResult.stdout,
          executionTimeMs: runResult.executionTimeMs
        });
      } else {
        if (isHidden) hiddenFailed++;
        testResults.push({
          id: tc.id || `test-${i + 1}`,
          description: isHidden ? `Test Case ${i + 1} (Hidden Test)` : (tc.description || `Test Case ${i + 1}`),
          isHidden,
          passed: false,
          status: 'wrong_output',
          message: isHidden
            ? 'Output did not match expected result on hidden test data.'
            : 'Output did not match expected result.',
          input: isHidden ? undefined : tc.input,
          expectedOutput: isHidden ? undefined : tc.expectedOutput,
          actualOutput: isHidden ? undefined : runResult.stdout,
          executionTimeMs: runResult.executionTimeMs
        });
      }
    }

    // Step 3: Concept Verification Checks
    const conceptEvaluation = verifyConcepts(source, exercise.conceptChecks || []);

    // Step 4: Anti-Cheat Hardcoding Detection
    let antiCheatWarning = null;
    if (visiblePassed > 0 && hiddenFailed > 0) {
      antiCheatWarning = 'Your solution passed visible sample tests but failed hidden test cases. Avoid hardcoding outputs—ensure your program dynamically computes results from input.';
    }

    const allBehaviorPassed = testCases.length > 0 && passedCount === testCases.length;
    const overallPassed = allBehaviorPassed && conceptEvaluation.passed;

    let overallStatus = 'success';
    let summaryMessage = '';

    if (overallPassed) {
      overallStatus = 'success';
      summaryMessage = `All ${testCases.length} test cases passed! Great job!`;
    } else if (allBehaviorPassed && !conceptEvaluation.passed) {
      overallStatus = 'concept_warning';
      summaryMessage = `Your code produced correct outputs, but did not satisfy the required concept check: ${conceptEvaluation.checks.find(c => !c.passed)?.message || ''}`;
    } else if (passedCount > 0) {
      overallStatus = 'partial_success';
      summaryMessage = `${passedCount} of ${testCases.length} test cases passed.`;
    } else {
      const allCrashed = testResults.every(r => r.status === 'runtime_error');
      const allTimedOut = testResults.every(r => r.status === 'timeout');
      if (allCrashed) {
        overallStatus = 'runtime_error';
        summaryMessage = 'Your program compiled successfully but crashed on all test cases.';
      } else if (allTimedOut) {
        overallStatus = 'timeout';
        summaryMessage = 'Your program timed out on all test cases.';
      } else {
        overallStatus = 'wrong_output';
        summaryMessage = 'Your program ran, but the result did not match the expected behavior.';
      }
    }

    return {
      status: overallStatus,
      passed: overallPassed,
      message: summaryMessage,
      antiCheatWarning,
      conceptChecks: conceptEvaluation.checks,
      testResults,
      summary: {
        total: testCases.length,
        passed: passedCount,
        failed: testCases.length - passedCount
      }
    };
  } finally {
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {
      setTimeout(async () => {
        try {
          await fs.rm(tmpDir, { recursive: true, force: true });
        } catch {}
      }, 500);
    }
  }
}

/**
 * Compiles C++ source with optimization and static linking.
 */
function compileSource({ compiler, sourcePath, exePath, cwd, timeoutMs, maxOutputBytes }) {
  return new Promise((resolve) => {
    const args = ['-std=c++17', '-O2', '-Wall', '-Wextra', '-fdiagnostics-color=never'];
    if (process.platform === 'win32') {
      args.push('-static');
    }
    args.push('-o', exePath, sourcePath);

    const compilerDir = path.dirname(compiler);
    const pathSep = process.platform === 'win32' ? ';' : ':';
    const env = { ...process.env, PATH: compilerDir + pathSep + (process.env.PATH || '') };

    let stdout = '';
    let stderr = '';
    let truncated = false;
    let timedOut = false;
    let finished = false;

    const proc = spawn(compiler, args, { cwd, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });

    const timer = setTimeout(async () => {
      timedOut = true;
      await killProcessTree(proc.pid);
      if (!finished) {
        finished = true;
        resolve({ success: false, timedOut: true, stdout, stderr, exitCode: null, truncated });
      }
    }, timeoutMs);

    proc.stdout.on('data', chunk => {
      if (Buffer.byteLength(stdout) + chunk.length > maxOutputBytes) {
        truncated = true;
        return;
      }
      stdout += chunk.toString('utf8');
    });

    proc.stderr.on('data', chunk => {
      if (Buffer.byteLength(stderr) + chunk.length > maxOutputBytes) {
        truncated = true;
        return;
      }
      stderr += chunk.toString('utf8');
    });

    proc.on('error', err => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        resolve({ success: false, timedOut: false, stdout, stderr: `${stderr}\nCompiler spawn error: ${err.message}`, exitCode: null, truncated });
      }
    });

    proc.on('close', code => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        resolve({ success: code === 0, timedOut: false, stdout, stderr, exitCode: code, truncated });
      }
    });
  });
}

/**
 * Runs the compiled binary against a specific stdin input.
 */
function runBinary({ exePath, stdin, cwd, timeoutMs, maxOutputBytes, compilerPath }) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let truncated = false;
    let timedOut = false;
    let finished = false;

    const compilerDir = compilerPath ? path.dirname(compilerPath) : null;
    const pathSep = process.platform === 'win32' ? ';' : ':';
    const env = compilerDir
      ? { ...process.env, PATH: compilerDir + pathSep + (process.env.PATH || '') }
      : process.env;

    const startTime = Date.now();
    const proc = spawn(exePath, [], { cwd, env, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });

    const timer = setTimeout(async () => {
      timedOut = true;
      await killProcessTree(proc.pid);
      if (!finished) {
        finished = true;
        resolve({ timedOut: true, stdout, stderr, exitCode: null, executionTimeMs: Date.now() - startTime, truncated });
      }
    }, timeoutMs);

    if (stdin && proc.stdin.writable) {
      proc.stdin.write(stdin);
    }
    if (proc.stdin.writable) {
      proc.stdin.end();
    }

    proc.stdout.on('data', chunk => {
      if (Buffer.byteLength(stdout) + chunk.length > maxOutputBytes) {
        truncated = true;
        return;
      }
      stdout += chunk.toString('utf8');
    });

    proc.stderr.on('data', chunk => {
      if (Buffer.byteLength(stderr) + chunk.length > maxOutputBytes) {
        truncated = true;
        return;
      }
      stderr += chunk.toString('utf8');
    });

    proc.on('error', err => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        resolve({ timedOut: false, stdout, stderr: `${stderr}\nExecution error: ${err.message}`, exitCode: null, executionTimeMs: Date.now() - startTime, truncated });
      }
    });

    proc.on('close', code => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        resolve({ timedOut, stdout, stderr, exitCode: code, executionTimeMs: Date.now() - startTime, truncated });
      }
    });
  });
}
