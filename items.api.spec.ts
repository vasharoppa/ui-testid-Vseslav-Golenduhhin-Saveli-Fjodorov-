import { test, expect } from '@playwright/test';

// Restore deterministic fixture data before each test.
test.beforeEach(async ({ request }) => {
  await request.post('/reset');
});

// TC-01 · REQ-API-01 · GET /items returns the item list.
test('TC-01 GET /items returns 200 and two items', async ({ request }) => {
  const res = await request.get('/items');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body).toHaveLength(2);
  expect(body[0]).toMatchObject({ id: 1, sku: 'A-1', qty: 5 });
});

// TC-02 · REQ-API-02 · GET /health reports service status.
test('TC-02 GET /health returns status ok', async ({ request }) => {
  const res = await request.get('/health');
  expect(res.status()).toBe(200);
  await expect(res.json()).resolves.toEqual({ status: 'ok' });
});

// TC-03 · REQ-API-03 · GET /items/:id returns the requested item.
test('TC-03 GET /items/1 returns the matching item', async ({ request }) => {
  const res = await request.get('/items/1');
  expect(res.status()).toBe(200);
  await expect(res.json()).resolves.toEqual({ id: 1, sku: 'A-1', qty: 5 });
});

// TC-04 · REQ-API-04 · Unknown item IDs return 404.
test('TC-04 GET /items/999 returns 404 not found', async ({ request }) => {
  const res = await request.get('/items/999');
  expect(res.status()).toBe(404);
  await expect(res.json()).resolves.toEqual({ error: 'not found' });
});

// TC-05 · REQ-API-05 · POST /items creates a valid item.
test('TC-05 POST /items creates an item and returns 201', async ({ request }) => {
  const res = await request.post('/items', { data: { sku: 'NEW-1', qty: 4 } });
  expect(res.status()).toBe(201);
  await expect(res.json()).resolves.toEqual({ id: 3, sku: 'NEW-1', qty: 4 });
});

// TC-06 · REQ-API-06 · Invalid SKU values are rejected.
test('TC-06 POST /items rejects an invalid SKU', async ({ request }) => {
  const res = await request.post('/items', { data: { sku: 'invalid sku!', qty: 1 } });
  expect(res.status()).toBe(400);
  await expect(res.json()).resolves.toMatchObject({ error: 'invalid sku' });
});

// TC-07 · REQ-API-07 · Quantity must be a whole number greater than or equal to zero.
test('TC-07 POST /items rejects a negative quantity', async ({ request }) => {
  const res = await request.post('/items', { data: { sku: 'NEG-1', qty: -1 } });
  expect(res.status()).toBe(400);
  await expect(res.json()).resolves.toMatchObject({ error: 'invalid qty' });
});

// TC-08 · REQ-API-08 · PUT /items/:id updates a valid item.
test('TC-08 PUT /items/1 updates SKU and quantity', async ({ request }) => {
  const res = await request.put('/items/1', { data: { sku: 'A-1-NEW', qty: 7 } });
  expect(res.status()).toBe(200);
  await expect(res.json()).resolves.toEqual({ id: 1, sku: 'A-1-NEW', qty: 7 });
});

// TC-09 · REQ-API-09 · DELETE /items/:id returns 204 with no response body.
test('TC-09 DELETE /items/1 returns 204 and no body', async ({ request }) => {
  const res = await request.delete('/items/1');
  expect(res.status()).toBe(204);
  expect(await res.text()).toBe('');
});

// TC-10 · REQ-API-10 · Deleting an unknown item returns 404.
test('TC-10 DELETE /items/999 returns 404 not found', async ({ request }) => {
  const res = await request.delete('/items/999');
  expect(res.status()).toBe(404);
  await expect(res.json()).resolves.toEqual({ error: 'not found' });
});
