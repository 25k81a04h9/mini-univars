import test from 'node:test';
import assert from 'node:assert/strict';
import { safeParseResponse } from './api';

test('safeParseResponse parses valid JSON success response', async () => {
  const res = new Response(JSON.stringify({ token: 'abc', user: { id: '1' } }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

  const parsed = await safeParseResponse(res);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.status, 200);
  assert.equal(parsed.data?.token, 'abc');
  assert.equal(parsed.error, undefined);
});

test('safeParseResponse handles JSON error response cleanly', async () => {
  const res = new Response(JSON.stringify({ error: 'An account with this email already exists' }), {
    status: 400,
    headers: { 'content-type': 'application/json' },
  });

  const parsed = await safeParseResponse(res);
  assert.equal(parsed.ok, false);
  assert.equal(parsed.status, 400);
  assert.equal(parsed.error, 'An account with this email already exists');
});

test('safeParseResponse handles Vercel plain-text 404 without throwing SyntaxError', async () => {
  const res = new Response('The page could not be found', {
    status: 404,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });

  const parsed = await safeParseResponse(res);
  assert.equal(parsed.ok, false);
  assert.equal(parsed.status, 404);
  assert.equal(parsed.data, null);
  assert.ok(parsed.error?.includes('API endpoint not found'));
  assert.ok(parsed.error?.includes('The page could not be found'));
});

test('safeParseResponse handles HTML 502 gateway error without throwing SyntaxError', async () => {
  const res = new Response('<html><body><h1>502 Bad Gateway</h1></body></html>', {
    status: 502,
    headers: { 'content-type': 'text/html' },
  });

  const parsed = await safeParseResponse(res);
  assert.equal(parsed.ok, false);
  assert.equal(parsed.status, 502);
  assert.ok(parsed.error?.includes('502 Bad Gateway'));
});
