const { restock, pick, findDuplicateSkus } = require('./inventory');

// Functional tests (stage 1a)
describe('restock', () => {
  test('REQ-01 adds delivered quantity to an existing SKU', () => {
    expect(restock({ 'A-1': 5 }, [{ sku: 'A-1', qty: 3 }])).toEqual({ 'A-1': 8 });
  });

  test('adds a previously unknown SKU', () => {
    expect(restock({}, [{ sku: 'NEW-1', qty: 2 }])).toEqual({ 'NEW-1': 2 });
  });

  test('does not mutate the original stock', () => {
    const stock = { 'A-1': 5 };
    const result = restock(stock, [{ sku: 'A-1', qty: 2 }]);
    expect(stock).toEqual({ 'A-1': 5 });
    expect(result).not.toBe(stock);
  });
});

describe('pick', () => {
  test('removes quantity from stock and returns a new object', () => {
    const stock = { 'A-1': 5 };
    const result = pick(stock, 'A-1', 2);
    expect(result).toEqual({ 'A-1': 3 });
    expect(result).not.toBe(stock);
    expect(stock).toEqual({ 'A-1': 5 });
  });

  test('rejects picking more than the available quantity', () => {
    expect(() => pick({ 'A-1': 2 }, 'A-1', 3)).toThrow('not enough stock');
  });

  test('rejects an unknown SKU', () => {
    expect(() => pick({}, 'A-1', 1)).toThrow('unknown sku');
  });
});

// Performance test (stage 1b)
test('findDuplicateSkus processes 20,000 items in under 100 ms', () => {
  const items = Array.from({ length: 20000 }, (_, i) => ({
    sku: i % 100 === 0 ? `DUP-${i % 10}` : `SKU-${i}`,
  }));

  const start = process.hrtime.bigint();
  const duplicates = findDuplicateSkus(items);
  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;

  expect(duplicates.length).toBeGreaterThan(0);
  expect(elapsedMs).toBeLessThan(100);
});

// Security tests (stage 1c): invalid SKU strings must be rejected.
describe('SKU validation (REQ-07)', () => {
  test.each([
    ['contains a space', 'A 1'],
    ['contains punctuation', 'A_1'],
    ['contains an injection-like symbol', 'A;DROP'],
    ['is empty', ''],
    ['is longer than 20 characters', 'A'.repeat(21)],
    ['is not a string', 123],
  ])('rejects SKU that %s', (_reason, sku) => {
    expect(() => restock({}, [{ sku, qty: 1 }])).toThrow('invalid sku');
  });
});

// Reliability test (REQ-08): a failed operation must leave original stock untouched.
test('failed restock leaves original stock unchanged', () => {
  const stock = { 'A-1': 5 };
  expect(() => restock(stock, [
    { sku: 'A-1', qty: 2 },
    { sku: 'BAD SKU', qty: 1 },
  ])).toThrow('invalid sku');
  expect(stock).toEqual({ 'A-1': 5 });
});
