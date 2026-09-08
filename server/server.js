import http from 'node:http';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { executeCpp, findCompiler } from './executor.js';
import { assessSubmission } from './assessor.js';
import { exerciseCatalog } from '../src/exerciseData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const MAX_BODY_BYTES = 512 * 1024; // 512 KB

export function createServer() {
  return http.createServer(async (req, res) => {
    // CORS headers for local development convenience
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // API: Health check & compiler detection
    if (pathname === '/api/health' && req.method === 'GET') {
      const compiler = findCompiler();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        compiler: compiler ? { available: true, path: compiler } : { available: false, path: null },
        platform: process.platform,
        nodeVersion: process.version
      }));
      return;
    }

    // API: Execute C++ code
    if (pathname === '/api/execute' && req.method === 'POST') {
      let body = '';
      let overflow = false;

      req.on('data', chunk => {
        if (body.length + chunk.length > MAX_BODY_BYTES) {
          overflow = true;
          return;
        }
        body += chunk.toString('utf8');
      });

      req.on('end', async () => {
        if (overflow) {
          res.writeHead(413, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Payload too large. Maximum size is 512KB.' }));
          return;
        }

        let payload;
        try {
          payload = JSON.parse(body || '{}');
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON request payload.' }));
          return;
        }

        const { source, stdin = '', timeoutMs, compileTimeoutMs } = payload;

        if (typeof source !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing or invalid "source" parameter. Must be a string.' }));
          return;
        }

        try {
          const result = await executeCpp(source, { stdin, timeoutMs, compileTimeoutMs });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'execution_error',
            error: err.message || 'Internal server error during execution.'
          }));
        }
      });
      return;
    }

    // API: Assess exercise submission against test cases
    if (pathname === '/api/assess' && req.method === 'POST') {
      let body = '';
      let overflow = false;

      req.on('data', chunk => {
        if (body.length + chunk.length > MAX_BODY_BYTES) {
          overflow = true;
          return;
        }
        body += chunk.toString('utf8');
      });

      req.on('end', async () => {
        if (overflow) {
          res.writeHead(413, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Payload too large.' }));
          return;
        }

        let payload;
        try {
          payload = JSON.parse(body || '{}');
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON request payload.' }));
          return;
        }

        const { exerciseId, exercise, source, timeoutMs, compileTimeoutMs } = payload;
        if (typeof source !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing or invalid "source" parameter.' }));
          return;
        }

        const targetExercise = exercise || (exerciseId ? exerciseCatalog[exerciseId] : null);
        if (!targetExercise) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Exercise not found: ${exerciseId || 'unspecified'}` }));
          return;
        }

        try {
          const result = await assessSubmission(source, targetExercise, { testTimeoutMs: timeoutMs, compileTimeoutMs });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'assessment_error',
            error: err.message || 'Internal server error during assessment.'
          }));
        }
      });
      return;
    }

    // API: List exercise catalog metadata (sanitized of hidden expected outputs)
    if (pathname === '/api/exercises' && req.method === 'GET') {
      const sanitized = Object.values(exerciseCatalog).map(ex => ({
        id: ex.id,
        title: ex.title,
        concepts: ex.concepts,
        difficulty: ex.difficulty,
        level: ex.level,
        problemStatement: ex.problemStatement,
        constraints: ex.constraints,
        inputFormat: ex.inputFormat,
        outputFormat: ex.outputFormat,
        starterCode: ex.starterCode,
        visibleExamples: (ex.testCases || []).filter(tc => !tc.isHidden).map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          description: tc.description
        })),
        totalTestCases: (ex.testCases || []).length,
        hints: ex.hints
      }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ exercises: sanitized }));
      return;
    }

    // Static file serving
    if (req.method === 'GET' || req.method === 'HEAD') {
      let relativePath = pathname;
      if (relativePath === '/' || relativePath === '') {
        relativePath = '/index.html';
      }

      // Prevent directory traversal attacks
      const safePath = path.normalize(path.join(ROOT_DIR, relativePath));
      if (!safePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Access Forbidden');
        return;
      }

      try {
        const stats = await fs.stat(safePath);
        if (stats.isDirectory()) {
          const indexPath = path.join(safePath, 'index.html');
          if (fsSync.existsSync(indexPath)) {
            const content = await fs.readFile(indexPath);
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
            return;
          }
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('Directory listing forbidden');
          return;
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const content = await fs.readFile(safePath);

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('500 Internal Server Error');
        }
      }
      return;
    }

    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  });
}

export function startServer(port = process.env.PORT || 3000) {
  const server = createServer();
  return new Promise((resolve) => {
    server.listen(port, () => {
      const addr = server.address();
      const actualPort = typeof addr === 'object' && addr ? addr.port : port;
      console.log(`CodeBloom C++ Server listening on http://localhost:${actualPort}`);
      const compiler = findCompiler();
      if (compiler) {
        console.log(`Detected C++ compiler: ${compiler}`);
      } else {
        console.warn('Warning: No C++ compiler detected in PATH or standard directories.');
      }
      resolve(server);
    });
  });
}

// Auto-run when invoked directly
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  startServer(port);
}
