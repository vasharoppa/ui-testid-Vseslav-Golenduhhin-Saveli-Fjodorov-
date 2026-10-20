const {
  filterProducts, sortProducts, lineTotal, cartTotals, normalizeQuantity,
  discountRateFor, validateCheckout,
} = require('./shop-logic');

const PRODUCTS = [
  { id: 1, name: 'Laptop Stand', price: 29.90 },
  { id: 2, name: 'USB-C Hub', price: 39.00 },
  { id: 3, name: 'Mechanical Keyboard', price: 89.00 },
  { id: 4, name: 'Wireless Mouse', price: 24.50 },
  { id: 5, name: 'Monitor 27"', price: 249.00 },
];

describe('filterProducts — REQ-L-01', () => {
  test('UT-01 empty query returns all products', () => {
    expect(filterProducts(PRODUCTS, '')).toHaveLength(5);
  });
  test('UT-02 search is case-insensitive', () => {
    expect(filterProducts(PRODUCTS, 'mouse').map(p => p.name)).toEqual(['Wireless Mouse']);
  });
  test('UT-03 no match returns an empty array', () => {
    expect(filterProducts(PRODUCTS, 'tablet')).toEqual([]);
  });
  test('UT-04 whitespace-only query returns all products', () => {
    expect(filterProducts(PRODUCTS, '   ')).toHaveLength(5);
  });
});

describe('sortProducts — REQ-L-02', () => {
  test('UT-05 name mode sorts A to Z', () => {
    expect(sortProducts(PRODUCTS, 'name').map(p => p.name)).toEqual([
      'Laptop Stand', 'Mechanical Keyboard', 'Monitor 27"', 'USB-C Hub', 'Wireless Mouse',
    ]);
  });
  test('UT-06 price-asc puts the cheapest item first', () => {
    expect(sortProducts(PRODUCTS, 'price-asc')[0].price).toBe(24.50);
  });
  test('UT-07 price-desc puts 249 before 89', () => {
    expect(sortProducts(PRODUCTS, 'price-desc')[0].price).toBe(249.00);
  });
  test('UT-08 sorting does not mutate the input array', () => {
    const original = [...PRODUCTS];
    sortProducts(PRODUCTS, 'price-asc');
    expect(PRODUCTS).toEqual(original);
  });
});

describe('lineTotal — REQ-L-03', () => {
  test('UT-09 calculates price multiplied by quantity', () => {
    expect(lineTotal(39, 2)).toBe(78);
  });
  test('UT-10 rounds a floating-point result to cents', () => {
    expect(lineTotal(0.1, 3)).toBe(0.3);
  });
  test('UT-11 zero price returns zero', () => {
    expect(lineTotal(0, 5)).toBe(0);
  });
});

describe('cartTotals — REQ-L-04', () => {
  test('UT-12 subtotal is the sum of every row', () => {
    expect(cartTotals([{ price: 39, qty: 1 }, { price: 24.5, qty: 1 }], 0))
      .toEqual({ subtotal: 63.5, discount: 0, total: 63.5 });
  });
  test('UT-13 discount is applied to the entire basket', () => {
    expect(cartTotals([{ price: 39, qty: 1 }, { price: 24.5, qty: 1 }], 0.1))
      .toEqual({ subtotal: 63.5, discount: 6.35, total: 57.15 });
  });
  test('UT-14 empty cart totals are all zero', () => {
    expect(cartTotals([], 0.2)).toEqual({ subtotal: 0, discount: 0, total: 0 });
  });
});

describe('normalizeQuantity — REQ-L-05', () => {
  test('UT-15 positive integer remains unchanged', () => {
    expect(normalizeQuantity(3)).toBe(3);
  });
  test('UT-16 numeric string is converted and decimal is floored', () => {
    expect(normalizeQuantity('3')).toBe(3);
    expect(normalizeQuantity(2.7)).toBe(2);
  });
  test('UT-17 zero quantity is normalized to one', () => {
    expect(normalizeQuantity(0)).toBe(1);
  });
  test('UT-18 negative, NaN and blank quantity normalize to one', () => {
    expect(normalizeQuantity(-2)).toBe(1);
    expect(normalizeQuantity(Number.NaN)).toBe(1);
    expect(normalizeQuantity('')).toBe(1);
  });
});

describe('discountRateFor — REQ-L-06', () => {
  test('UT-19 SAVE10 returns 0.10', () => {
    expect(discountRateFor('SAVE10')).toBe(0.1);
  });
  test('UT-20 SAVE20 returns 0.20', () => {
    expect(discountRateFor('SAVE20')).toBe(0.2);
  });
  test('UT-21 code is case-insensitive', () => {
    expect(discountRateFor('save10')).toBe(0.1);
  });
  test('UT-22 surrounding whitespace is ignored', () => {
    expect(discountRateFor(' save20 ')).toBe(0.2);
  });
  test('UT-23 unknown and empty codes return zero', () => {
    expect(discountRateFor('UNKNOWN')).toBe(0);
    expect(discountRateFor('')).toBe(0);
  });
});

describe('validateCheckout — REQ-L-07', () => {
  test('UT-24 email without a top-level domain is rejected', () => {
    expect(validateCheckout({ name: 'Mari Maasikas', email: 'mari@example', address: 'Tallinn' }))
      .toHaveProperty('email');
  });
  test('UT-25 valid checkout has no errors', () => {
    expect(validateCheckout({ name: 'Mari Maasikas', email: 'mari@example.com', address: 'Tallinn' })).toEqual({});
  });
  test('UT-26 empty checkout returns all three errors', () => {
    expect(Object.keys(validateCheckout({})).sort()).toEqual(['address', 'email', 'name']);
  });
  test('UT-27 one-character name is rejected', () => {
    expect(validateCheckout({ name: 'M', email: 'mari@example.com', address: 'Tallinn' })).toHaveProperty('name');
  });
  test('UT-28 two-character name is accepted', () => {
    expect(validateCheckout({ name: 'Ma', email: 'ma@example.com', address: 'Tallinn' })).not.toHaveProperty('name');
  });
  test.each([
    ['UT-29', 'plainaddress'],
    ['UT-30', 'mari@'],
  ])('%s rejects malformed email %s', (_id, email) => {
    expect(validateCheckout({ name: 'Mari', email, address: 'Tallinn' })).toHaveProperty('email');
  });
  test('UT-31 whitespace-only address is rejected', () => {
    expect(validateCheckout({ name: 'Mari', email: 'mari@example.com', address: '   ' })).toHaveProperty('address');
  });
  test('UT-32 whitespace around name is trimmed before validation', () => {
    expect(validateCheckout({ name: ' M ', email: 'mari@example.com', address: 'Tallinn' })).toHaveProperty('name');
  });
  test('UT-33 whitespace around a valid email is trimmed', () => {
    expect(validateCheckout({ name: 'Mari', email: ' mari@example.com ', address: 'Tallinn' })).toEqual({});
  });
  test('UT-34 missing email is rejected', () => {
    expect(validateCheckout({ name: 'Mari', address: 'Tallinn' })).toHaveProperty('email');
  });
  test('UT-35 missing address is rejected', () => {
    expect(validateCheckout({ name: 'Mari', email: 'mari@example.com' })).toHaveProperty('address');
  });
});
