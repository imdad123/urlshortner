import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createApp } from '../backend/src/app.js';

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('health endpoint reports that the API is ready', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('API supports browser cross-origin requests', async () => {
  const response = await fetch(`${baseUrl}/api/shorten`, {
    method: 'OPTIONS',
    headers: {
      origin: 'http://localhost:5173',
      'access-control-request-method': 'POST',
    },
  });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
});

test('shorten endpoint returns a link that redirects to its destination', async () => {
  const destinationUrl = 'https://example.com/articles/hello?source=test';
  const response = await fetch(`${baseUrl}/api/shorten`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ url: destinationUrl }),
  });

  assert.equal(response.status, 201);
  const result = await response.json();
  assert.match(result.code, /^[A-Za-z0-9_-]{1,32}$/);
  assert.equal(result.shortUrl, `${baseUrl}/${result.code}`);
  assert.equal(result.destinationUrl, destinationUrl);

  const redirect = await fetch(result.shortUrl, { redirect: 'manual' });
  assert.equal(redirect.status, 302);
  assert.equal(redirect.headers.get('location'), destinationUrl);
});

test('shorten endpoint rejects malformed, relative, and non-HTTP destinations', async () => {
  for (const url of ['not a URL', '/relative/path', 'ftp://example.com/file', '', 123, null]) {
    const response = await fetch(`${baseUrl}/api/shorten`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    assert.equal(response.status, 400, `expected ${String(url)} to be rejected`);
    assert.equal(typeof (await response.json()).error, 'string');
  }
});

test('unknown short codes return 404', async () => {
  const response = await fetch(`${baseUrl}/not-a-saved-code`);
  assert.equal(response.status, 404);
});

test('malformed JSON returns a client error', async () => {
  const response = await fetch(`${baseUrl}/api/shorten`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{invalid json',
  });
  assert.equal(response.status, 400);
  assert.equal(typeof (await response.json()).error, 'string');
});
