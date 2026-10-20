const {
  filterProducts,
  sortProducts,
  lineTotal,
  cartTotals,
  normalizeQuantity,
  discountRateFor,
  validateCheckout
} = require('./shop-logic');

const PRODUCTS = [
  { id: 1, name: 'Laptop Stand', price: 29.90 },
  { id: 2, name: 'USB-C Hub', price: 39.00 },
  { id: 3, name: 'Monitor 27"', price: 249.00 },
  { id: 4, name: 'Wireless Mouse', price: 24.50 },
];

describe('filterProducts', () => {
  test('UT-01 empty query returns all products', () => {
    expect(filterProducts(PRODUCTS, '')).toHaveLength(4);
  });

  test("UT-02 'mouse' (lower case) finds Wireless Mouse", () => {
    const res = filterProducts(PRODUCTS, 'mouse');
    expect(res).toHaveLength(1);
    expect(res[0].name).toBe('Wireless Mouse');
  });

  test('UT-03 no match returns empty array', () => {
    expect(filterProducts(PRODUCTS, 'tablet')).toEqual([]);
  });

  test('UT-04 undefined query behaves like empty', () => {
    expect(filterProducts(PRODUCTS, undefined)).toHaveLength(4);
  });
});

describe('sortProducts', () => {
  test('UT-05 name sorts A→Z', () => {
    const sorted = sortProducts(PRODUCTS, 'name');
    expect(sorted.map(p => p.name)).toEqual([
      'Laptop Stand',
      'Monitor 27"',
      'USB-C Hub',
      'Wireless Mouse'
    ]);
  });

  test('UT-06 price-asc puts cheapest first', () => {
    const sorted = sortProducts(PRODUCTS, 'price-asc');
    expect(sorted[0].price).toBe(24.50);
  });

  test('UT-07 price-desc puts most expensive first', () => {
    const sorted = sortProducts(PRODUCTS, 'price-desc');
    expect(sorted[0].price).toBe(249.00);
  });

  test('UT-08 does not mutate the input array', () => {
    const original = [...PRODUCTS];
    sortProducts(PRODUCTS, 'name');
    expect(PRODUCTS).toEqual(original);
  });
});

describe('lineTotal', () => {
  test('UT-09 price × qty', () => {
    expect(lineTotal(39.00, 2)).toBe(78.00);
  });

  test('UT-10 rounds to 2 decimals', () => {
    expect(lineTotal(24.50, 3)).toBe(73.50);
  });
});

describe('cartTotals', () => {
  const rows = [
    { price: 39.00, qty: 1 },
    { price: 24.50, qty: 1 }
  ];

  test('UT-11 subtotal sums all rows', () => {
    expect(cartTotals(rows).subtotal).toBe(63.50);
  });

  test('UT-12 no discount → total = subtotal', () => {
    const res = cartTotals(rows, 0);
    expect(res.total).toBe(63.50);
    expect(res.discount).toBe(0);
  });

  test('UT-13 10% discount applies to the whole basket', () => {
    const res = cartTotals(rows, 0.10);
    expect(res).toEqual({
      subtotal: 63.50,
      discount: 6.35,
      total: 57.15
    });
  });

  test('UT-14 empty basket → zeros', () => {
    expect(cartTotals([], 0.10)).toEqual({
      subtotal: 0,
      discount: 0,
      total: 0
    });
  });

  test('UT-15 quantity is respected', () => {
    const customRows = [{ price: 39.00, qty: 3 }];
    expect(cartTotals(customRows).subtotal).toBe(117.00);
  });
});

describe('normalizeQuantity', () => {
  test.each([
    [3, 3],
    ['3', 3],
    [2.7, 2],
    [1, 1]
  ])('UT-16 valid %p → %p', (input, expected) => {
    expect(normalizeQuantity(input)).toBe(expected);
  });

  test.each([
    [0, 1],
    [-5, 1],
    ['abc', 1],
    ['', 1],
    [null, 1]
  ])('UT-17 invalid %p → 1', (input, expected) => {
    expect(normalizeQuantity(input)).toBe(expected);
  });
});

describe('discountRateFor', () => {
  test('UT-18 SAVE10 → 0.10', () => {
    expect(discountRateFor('SAVE10')).toBe(0.10);
    expect(discountRateFor('SAVE20')).toBe(0.20);
  });

  test('UT-19 case-insensitive and trimmed', () => {
    expect(discountRateFor('  save10 ')).toBe(0.10);
  });

  test('UT-20 unknown → 0', () => {
    expect(discountRateFor('UNKNOWN')).toBe(0);
    expect(discountRateFor('')).toBe(0);
  });
});

describe('validateCheckout', () => {
  test('UT-21 valid input → no errors', () => {
    const valid = { name: 'Malle', email: 'malle@example.com', address: 'Tartu mnt 1' };
    expect(validateCheckout(valid)).toEqual({});
  });

  test('UT-22 empty input → three errors', () => {
    const errors = validateCheckout({ name: '', email: '', address: '' });
    expect(Object.keys(errors)).toHaveLength(3);
  });

  test('UT-23 name of 1 character is rejected, 2 accepted', () => {
    expect(validateCheckout({ name: 'A', email: 'a@b.ee', address: 'A' })).toHaveProperty('name');
    expect(validateCheckout({ name: 'Ab', email: 'a@b.ee', address: 'A' })).not.toHaveProperty('name');
  });

  test.each([
    ['mari'],
    ['mari@'],
    ['mari@example'],
    ['mari maasikas@example.com']
  ])('UT-24 email %p is rejected', (email) => {
    const errors = validateCheckout({ name: 'Malle', email, address: 'Tartu mnt 1' });
    expect(errors).toHaveProperty('email');
  });
});