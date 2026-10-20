import { test, expect } from '@playwright/test';

// The server starts with items id 1 (A-1, qty 5) and id 2 (B-2, qty 0).
// Reset before every test so one test cannot affect another.
test.beforeEach(async ({ request }) => {
  const reset = await request.post('/reset');
  expect(reset.status()).toBe(204);
});

// TC-01 · REQ-API-01 · list all inventory items
test('TC-01 GET /items returns 200 and two JSON records', async ({ request }) => {
  const res = await request.get('/items');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/json');
  expect(await res.json()).toEqual([
    { id: 1, sku: 'A-1', qty: 5 },
    { id: 2, sku: 'B-2', qty: 0 },
  ]);
});

// TC-02 · REQ-API-02 · known item ID
test('TC-02 GET /items/1 returns the matching item', async ({ request }) => {
  const res = await request.get('/items/1');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/json');
  expect(await res.json()).toEqual({ id: 1, sku: 'A-1', qty: 5 });
});

// TC-03 · REQ-API-02 · unknown ID should return 404 (intentional server defect)
test('TC-03 GET /items/999 returns 404 with error body', async ({ request }) => {
  const res = await request.get('/items/999');
  expect(res.status()).toBe(404);
  expect(res.headers()['content-type']).toContain('application/json');
  expect(await res.json()).toEqual({ error: 'not found' });
});

// TC-04 · REQ-API-03 / REQ-API-04 · valid item creation
test('TC-04 POST /items creates a valid item with status 201', async ({ request }) => {
  const res = await request.post('/items', { data: { sku: 'C-3', qty: 2 } });
  expect(res.status()).toBe(201);
  expect(res.headers()['content-type']).toContain('application/json');
  expect(await res.json()).toEqual({ id: 3, sku: 'C-3', qty: 2 });
});

// TC-05 · REQ-API-03 · quantity zero is a valid boundary value
test('TC-05 POST /items accepts quantity 0', async ({ request }) => {
  const res = await request.post('/items', { data: { sku: 'C-3', qty: 0 } });
  expect(res.status()).toBe(201);
  expect(res.headers()['content-type']).toContain('application/json');
  expect(await res.json()).toEqual({ id: 3, sku: 'C-3', qty: 0 });
});
