import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server/server.js';
import { findCompiler } from '../server/executor.js';

describe('HTTP Server & API Endpoints', () => {
  let server;
  let baseUrl;

  before(async () => {
    server = createServer();
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
  });

  it('GET /api/health returns server status and compiler metadata', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.ok(typeof data.compiler === 'object');
    assert.ok('available' in data.compiler);
  });

  it('GET / serves index.html with HTML Content-Type', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/html/);
    const text = await res.text();
    assert.match(text, /CodeBloom/);
  });

  it('GET /src/style.css serves stylesheet with CSS Content-Type', async () => {
    const res = await fetch(`${baseUrl}/src/style.css`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/css/);
  });

  it('GET /non-existent-file.xyz returns 404', async () => {
    const res = await fetch(`${baseUrl}/non-existent-file.xyz`);
    assert.equal(res.status, 404);
  });

  it('POST /api/execute rejects non-JSON or invalid payload', async () => {
    const res = await fetch(`${baseUrl}/api/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json'
    });
    assert.equal(res.status, 400);
  });

  it('POST /api/execute returns compile_error for empty source', async () => {
    const res = await fetch(`${baseUrl}/api/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: '' })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'compile_error');
  });

  it('POST /api/execute runs valid C++ code if compiler is available', async () => {
    const compiler = findCompiler();
    if (!compiler) return; // Skip if no compiler on host

    const res = await fetch(`${baseUrl}/api/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: '#include <iostream>\nint main() { std::cout << "API test ok"; return 0; }'
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'success');
    assert.match(data.stdout, /API test ok/);
  });

  it('GET /api/exercises returns sanitized exercise list', async () => {
    const res = await fetch(`${baseUrl}/api/exercises`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.exercises));
    assert.ok(data.exercises.length > 0);
    // Ensure hidden test cases are not leaked
    for (const ex of data.exercises) {
      assert.ok(ex.id);
      assert.ok(ex.title);
      assert.equal(ex.testCases, undefined);
    }
  });

  it('POST /api/assess runs exercise assessment against test cases', async () => {
    const compiler = findCompiler();
    if (!compiler) return;

    const res = await fetch(`${baseUrl}/api/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exerciseId: 'keywords-medium',
        source: '#include <iostream>\nusing namespace std;\nint main() { int a, b; if (cin >> a >> b) cout << a + b; return 0; }'
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'success');
    assert.equal(data.passed, true);
    assert.ok(data.summary.passed > 0);
  });
});
