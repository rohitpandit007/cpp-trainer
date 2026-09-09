import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawn, execSync } from 'node:child_process';

const DEFAULT_TIMEOUT_MS = 3000;
const DEFAULT_COMPILE_TIMEOUT_MS = 8000;
const DEFAULT_MAX_OUTPUT_BYTES = 64 * 1024; // 64 KB

/**
 * Robustly kills a process tree across Windows and POSIX.
 */
export async function killProcessTree(pid) {
  if (!pid) return;
  if (process.platform === 'win32') {
    try {
      execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
    } catch {
      // Process might have already terminated
    }
  } else {
    try {
      process.kill(-pid, 'SIGKILL');
    } catch {
      try {
        process.kill(pid, 'SIGKILL');
      } catch {
        // Process might have already terminated
      }
    }
  }
}

/**
 * Cleans orphaned temporary execution folders older than maxAgeMs.
 */
export function cleanStaleTempDirectories(maxAgeMs = 10 * 60 * 1000) {
  const tmpBase = os.tmpdir();
  try {
    const entries = fsSync.readdirSync(tmpBase, { withFileTypes: true });
    const now = Date.now();
    for (const entry of entries) {
      if (entry.isDirectory() && (entry.name.startsWith('cpp-trainer-') || entry.name.startsWith('cpp-assess-'))) {
        const fullPath = path.join(tmpBase, entry.name);
        try {
          const stats = fsSync.statSync(fullPath);
          if (now - stats.mtimeMs > maxAgeMs) {
            fsSync.rmSync(fullPath, { recursive: true, force: true });
          }
        } catch {}
      }
    }
  } catch {}
}

/**
 * Creates a sanitized environment object passing only minimal required OS runtime paths,
 * preventing arbitrary learner code from accessing host secrets or tokens.
 */
export function createCleanEnv(compilerDir) {
  const pathSep = process.platform === 'win32' ? ';' : ':';
  const cleanEnv = {};

  const SAFE_KEYS = process.platform === 'win32'
    ? ['SYSTEMROOT', 'WINDIR', 'TEMP', 'TMP', 'COMSPEC', 'PATHEXT']
    : ['TMPDIR', 'HOME'];

  for (const key of SAFE_KEYS) {
    if (process.env[key]) {
      cleanEnv[key] = process.env[key];
    }
  }

  const sys32 = process.env.SYSTEMROOT ? path.join(process.env.SYSTEMROOT, 'System32') : 'C:\\Windows\\System32';
  const windir = process.env.SYSTEMROOT || 'C:\\Windows';
  const basePaths = process.platform === 'win32'
    ? [compilerDir, sys32, windir]
    : [compilerDir, '/usr/local/bin', '/usr/bin', '/bin'];

  cleanEnv.PATH = basePaths.filter(Boolean).join(pathSep);
  return cleanEnv;
}

/**
 * Searches for an available C++ compiler.
 */
export function findCompiler(preferred) {
  if (preferred && fsSync.existsSync(preferred)) {
    return preferred;
  }
  if (process.env.CPP_COMPILER && fsSync.existsSync(process.env.CPP_COMPILER)) {
    return process.env.CPP_COMPILER;
  }

  const candidates = process.platform === 'win32'
    ? ['g++', 'clang++', 'cl.exe']
    : ['g++', 'clang++'];

  for (const cmd of candidates) {
    try {
      const checkCmd = process.platform === 'win32' ? `where.exe ${cmd}` : `which ${cmd}`;
      const found = execSync(checkCmd, { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim()
        .split(/\r?\n/)[0];
      if (found && fsSync.existsSync(found)) {
        return found;
      }
    } catch {
      // Not in PATH
    }
  }

  // Check known WinGet package and standard directories on Windows
  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
    const searchRoots = [
      path.join(localAppData, 'Microsoft', 'WinGet', 'Packages'),
      path.join(localAppData, 'Programs'),
      'C:\\MinGW',
      'C:\\msys64\\mingw64\\bin',
      'C:\\msys64\\ucrt64\\bin',
      'C:\\Program Files\\LLVM\\bin'
    ];

    for (const root of searchRoots) {
      if (!fsSync.existsSync(root)) continue;

      // Recursive search up to depth 3 for g++.exe or clang++.exe
      const findExeInDir = (dir, depth = 0) => {
        if (depth > 3 || !fsSync.existsSync(dir)) return null;
        const directGpp = path.join(dir, 'g++.exe');
        const directClang = path.join(dir, 'clang++.exe');
        if (fsSync.existsSync(directGpp)) return directGpp;
        if (fsSync.existsSync(directClang)) return directClang;

        try {
          const entries = fsSync.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isDirectory()) {
              const res = findExeInDir(path.join(dir, entry.name), depth + 1);
              if (res) return res;
            }
          }
        } catch {}
        return null;
      };

      const found = findExeInDir(root);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Parses compiler stderr diagnostics.
 */
export function parseCompilerDiagnostics(stderr) {
  const diagnostics = [];
  if (!stderr) return diagnostics;

  const lines = stderr.split(/\r?\n/);
  // Match standard GCC / Clang diagnostic format: file:line:col: severity: message
  const diagRegex = /(?:[A-Za-z]:)?[^:\r\n]+:(\d+):(?:(\d+):)?\s*(fatal error|error|warning|note):\s*(.*)/i;

  for (const line of lines) {
    const match = line.match(diagRegex);
    if (match) {
      const lineNumber = parseInt(match[1], 10);
      const columnNumber = match[2] ? parseInt(match[2], 10) : null;
      const rawSev = match[3].toLowerCase();
      const severity = rawSev.includes('error') ? 'error' : rawSev.includes('warning') ? 'warning' : 'note';
      const message = match[4].trim();
      diagnostics.push({ line: lineNumber, column: columnNumber, severity, message, raw: line });
    }
  }
  return diagnostics;
}

/**
 * Translates compiler error messages into beginner-friendly explanations.
 */
export function generateFriendlyExplanation(diagnostics, rawStderr) {
  if (!diagnostics || diagnostics.length === 0) {
    if (/undefined reference to [`']main['`]/i.test(rawStderr) || /unresolved external symbol _?main/i.test(rawStderr)) {
      return "Your program is missing a main() function, or main is spelled incorrectly. Every C++ program starts execution in main().";
    }
    return "Compilation failed. Check the compiler error messages below to identify the issue.";
  }

  const firstError = diagnostics.find(d => d.severity === 'error') || diagnostics[0];
  const msg = firstError.message;
  const lineInfo = firstError.line ? ` (line ${firstError.line})` : '';

  if (/expected\s*['`;}]/i.test(msg) || /expected\s*';'/i.test(msg) || /semicolon/i.test(msg)) {
    return `Missing semicolon or closing delimiter${lineInfo}. In C++, every statement must end with a semicolon ';'.`;
  }
  if (/was not declared in this scope/i.test(msg) || /use of undeclared identifier/i.test(msg)) {
    const varMatch = msg.match(/['`"]([a-zA-Z0-9_]+)['`"]/);
    const identifier = varMatch ? `'${varMatch[1]}'` : 'This identifier';
    return `${identifier} was not declared${lineInfo}. Check spelling, ensure the variable or function is defined above this line, and include required headers.`;
  }
  if (/no match for ['`"]operator/i.test(msg) || /invalid operands to binary expression/i.test(msg)) {
    return `Invalid operator syntax${lineInfo}. For example, when printing with cout, use 'cout << value;' and verify that the types can be printed.`;
  }
  if (/cannot convert/i.test(msg) || /invalid conversion/i.test(msg) || /no viable conversion/i.test(msg)) {
    return `Type mismatch error${lineInfo}. The value provided does not match the expected type.`;
  }
  if (/No such file or directory/i.test(msg) || /file not found/i.test(msg)) {
    return `Header file not found${lineInfo}. Check your #include directives, e.g. '#include <iostream>'.`;
  }
  if (/redefinition of/i.test(msg)) {
    return `Duplicate definition${lineInfo}. A variable, class, or function with this name already exists.`;
  }

  return `Compiler reported an error on line ${firstError.line || 'unknown'}: "${firstError.message}".`;
}

/**
 * Compiles and runs C++ source code safely.
 *
 * @param {string} source - C++ source code
 * @param {object} options - Execution options
 * @returns {Promise<object>} Execution result
 */
export async function executeCpp(source, options = {}) {
  const {
    stdin = '',
    timeoutMs = DEFAULT_TIMEOUT_MS,
    compileTimeoutMs = DEFAULT_COMPILE_TIMEOUT_MS,
    maxOutputBytes = DEFAULT_MAX_OUTPUT_BYTES,
    compilerPath = null,
    abortSignal = null
  } = options;

  const trimmedSource = typeof source === 'string' ? source.trim() : '';

  if (!trimmedSource) {
    return {
      status: 'compile_error',
      stdout: '',
      stderr: 'Source code is empty.',
      exitCode: 1,
      executionTimeMs: 0,
      diagnostics: [{ line: 1, column: 1, severity: 'error', message: 'Source code is empty.' }],
      friendlyExplanation: 'No C++ code was provided. Write your program before running.'
    };
  }

  const compiler = findCompiler(compilerPath);
  if (!compiler) {
    return {
      status: 'execution_error',
      stdout: '',
      stderr: 'No C++ compiler found on the system. Please ensure g++ or clang++ is installed and accessible in PATH or via CPP_COMPILER environment variable.',
      exitCode: null,
      executionTimeMs: 0,
      diagnostics: [],
      friendlyExplanation: 'The execution service cannot find a C++ compiler on this system. Please check your compiler installation.'
    };
  }

  // Create isolated temporary directory
  const runId = crypto.randomBytes(8).toString('hex');
  const tmpDir = path.join(os.tmpdir(), `cpp-trainer-${runId}`);
  const sourcePath = path.join(tmpDir, 'solution.cpp');
  const exeName = process.platform === 'win32' ? 'solution.exe' : 'solution';
  const exePath = path.join(tmpDir, exeName);

  await fs.mkdir(tmpDir, { recursive: true });

  try {
    // Write source code
    await fs.writeFile(sourcePath, source, 'utf8');

    // Step 1: Compilation
    const compileStartTime = Date.now();
    const compileResult = await runCompilation({
      compiler,
      sourcePath,
      exePath,
      cwd: tmpDir,
      timeoutMs: compileTimeoutMs,
      maxOutputBytes,
      abortSignal
    });
    const compileTimeMs = Date.now() - compileStartTime;

    if (!compileResult.success) {
      const diagnostics = parseCompilerDiagnostics(compileResult.stderr);
      const friendlyExplanation = generateFriendlyExplanation(diagnostics, compileResult.stderr);

      return {
        status: compileResult.timedOut ? 'timeout' : 'compile_error',
        stdout: compileResult.stdout,
        stderr: compileResult.stderr,
        exitCode: compileResult.exitCode,
        executionTimeMs: compileTimeMs,
        diagnostics,
        friendlyExplanation,
        truncated: compileResult.truncated
      };
    }

    // Step 2: Execution
    const runStartTime = Date.now();
    const runResult = await runExecutable({
      exePath,
      stdin,
      cwd: tmpDir,
      timeoutMs,
      maxOutputBytes,
      compilerPath: compiler,
      abortSignal
    });
    const runTimeMs = Date.now() - runStartTime;

    if (runResult.timedOut) {
      return {
        status: 'timeout',
        stdout: runResult.stdout,
        stderr: runResult.stderr || `Execution timed out after ${timeoutMs}ms. The process was safely terminated. Check for infinite loops or unbuffered cin calls.`,
        exitCode: null,
        executionTimeMs: runTimeMs,
        diagnostics: [],
        friendlyExplanation: `Your program exceeded the allowed execution time limit (${timeoutMs}ms). Ensure your loops have a valid exit condition and you are not waiting indefinitely for input.`,
        truncated: runResult.truncated
      };
    }

    if (runResult.exitCode !== 0) {
      let runtimeMessage = `Process finished with non-zero exit code: ${runResult.exitCode}.`;
      if (runResult.signal) {
        runtimeMessage += ` Terminated by signal: ${runResult.signal}.`;
      }
      return {
        status: 'runtime_error',
        stdout: runResult.stdout,
        stderr: runResult.stderr ? `${runResult.stderr}\n${runtimeMessage}` : runtimeMessage,
        exitCode: runResult.exitCode,
        executionTimeMs: runTimeMs,
        diagnostics: [],
        friendlyExplanation: `Your program compiled successfully but crashed or exited with an error code (${runResult.exitCode}) during execution. Check for out-of-bounds array access, null pointer dereferencing, or division by zero.`,
        truncated: runResult.truncated
      };
    }

    return {
      status: 'success',
      stdout: runResult.stdout,
      stderr: runResult.stderr,
      exitCode: 0,
      executionTimeMs: runTimeMs,
      diagnostics: [],
      friendlyExplanation: 'Program executed successfully with clean exit code 0.',
      truncated: runResult.truncated
    };
  } finally {
    // Guaranteed cleanup of temp folder and artifacts
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {
      // In case Windows holds a file lock briefly, attempt deferred retry
      setTimeout(async () => {
        try {
          await fs.rm(tmpDir, { recursive: true, force: true });
        } catch {}
      }, 500);
    }
  }
}

/**
 * Runs the compiler process.
 */
function runCompilation({ compiler, sourcePath, exePath, cwd, timeoutMs, maxOutputBytes, abortSignal }) {
  return new Promise((resolve) => {
    // Safe compiler flags: C++17, optimization, warnings, no ANSI colors for clean parsing, no inline asm, pipe
    const args = ['-std=c++17', '-O2', '-Wall', '-Wextra', '-fdiagnostics-color=never', '-fno-asm', '-pipe'];
    if (process.platform === 'win32') {
      args.push('-static');
    }
    args.push('-o', exePath, sourcePath);

    const compilerDir = path.dirname(compiler);
    const env = createCleanEnv(compilerDir);

    let stdout = '';
    let stderr = '';
    let truncated = false;
    let timedOut = false;
    let finished = false;

    const proc = spawn(compiler, args, {
      cwd,
      env,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    if (abortSignal) {
      abortSignal.addEventListener('abort', async () => {
        timedOut = true;
        await killProcessTree(proc.pid);
        if (!finished) {
          finished = true;
          resolve({
            success: false,
            timedOut: true,
            stdout,
            stderr: stderr + '\nCompilation aborted by client.',
            exitCode: null,
            truncated
          });
        }
      });
    }

    const timer = setTimeout(async () => {
      timedOut = true;
      await killProcessTree(proc.pid);
      if (!finished) {
        finished = true;
        resolve({
          success: false,
          timedOut: true,
          stdout,
          stderr: stderr + `\nCompilation timed out after ${timeoutMs}ms.`,
          exitCode: null,
          truncated
        });
      }
    }, timeoutMs);

    proc.stdout.on('data', (chunk) => {
      if (Buffer.byteLength(stdout) + chunk.length > maxOutputBytes) {
        truncated = true;
        return;
      }
      stdout += chunk.toString('utf8');
    });

    proc.stderr.on('data', (chunk) => {
      if (Buffer.byteLength(stderr) + chunk.length > maxOutputBytes) {
        truncated = true;
        return;
      }
      stderr += chunk.toString('utf8');
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        resolve({
          success: false,
          timedOut: false,
          stdout,
          stderr: `${stderr}\nFailed to spawn compiler: ${err.message}`,
          exitCode: null,
          truncated
        });
      }
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        resolve({
          success: code === 0,
          timedOut: false,
          stdout,
          stderr,
          exitCode: code,
          truncated
        });
      }
    });
  });
}

/**
 * Executes the compiled binary.
 */
function runExecutable({ exePath, stdin, cwd, timeoutMs, maxOutputBytes, compilerPath, abortSignal }) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let truncated = false;
    let timedOut = false;
    let finished = false;

    const compilerDir = compilerPath ? path.dirname(compilerPath) : null;
    const env = createCleanEnv(compilerDir);

    const proc = spawn(exePath, [], {
      cwd,
      env,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    if (abortSignal) {
      abortSignal.addEventListener('abort', async () => {
        timedOut = true;
        await killProcessTree(proc.pid);
        if (!finished) {
          finished = true;
          resolve({
            timedOut: true,
            stdout,
            stderr: stderr + '\nExecution aborted by client.',
            exitCode: null,
            signal: 'SIGKILL',
            truncated
          });
        }
      });
    }

    const timer = setTimeout(async () => {
      timedOut = true;
      await killProcessTree(proc.pid);
      if (!finished) {
        finished = true;
        resolve({
          timedOut: true,
          stdout,
          stderr,
          exitCode: null,
          signal: 'SIGKILL',
          truncated
        });
      }
    }, timeoutMs);

    if (stdin && proc.stdin.writable) {
      proc.stdin.write(stdin);
    }
    if (proc.stdin.writable) {
      proc.stdin.end();
    }

    proc.stdout.on('data', (chunk) => {
      if (Buffer.byteLength(stdout) + chunk.length > maxOutputBytes) {
        truncated = true;
        return;
      }
      stdout += chunk.toString('utf8');
    });

    proc.stderr.on('data', (chunk) => {
      if (Buffer.byteLength(stderr) + chunk.length > maxOutputBytes) {
        truncated = true;
        return;
      }
      stderr += chunk.toString('utf8');
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        resolve({
          timedOut: false,
          stdout,
          stderr: `${stderr}\nExecution failure: ${err.message}`,
          exitCode: null,
          signal: null,
          truncated
        });
      }
    });

    proc.on('close', (code, signal) => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        resolve({
          timedOut,
          stdout,
          stderr,
          exitCode: code,
          signal,
          truncated
        });
      }
    });
  });
}
