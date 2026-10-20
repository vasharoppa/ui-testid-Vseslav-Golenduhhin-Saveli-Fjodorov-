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
  test('UT-02 lowercase query matches product name', () => {
    expect(filterProducts(PRODUCTS, 'mouse').map(p => p.name)).toEqual(['Wireless Mouse']);
  });
  test('UT-03 query with no match returns an empty array', () => {
    expect(filterProducts(PRODUCTS, 'tablet')).toEqual([]);
  });
  test('UT-04 undefined query returns all products', () => {
    expect(filterProducts(PRODUCTS, undefined)).toHaveLength(5);
  });
});

describe('sortProducts — REQ-L-02', () => {
  test('UT-05 name mode sorts names A to Z', () => {
    expect(sortProducts(PRODUCTS, 'name').map(p => p.name)).toEqual([
      'Laptop Stand', 'Mechanical Keyboard', 'Monitor 27"', 'USB-C Hub', 'Wireless Mouse',
    ]);
  });
  test('UT-06 price-asc puts cheapest product first', () => {
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
  test('UT-09 calculates price times quantity', () => {
    expect(lineTotal(39, 2)).toBe(78);
  });
  test('UT-10 calculates a fractional price total', () => {
    expect(lineTotal(24.5, 3)).toBe(73.5);
  });
  test('UT-11 rounds floating-point results to cents', () => {
    expect(lineTotal(0.1, 3)).toBe(0.3);
  });
});

describe('cartTotals — REQ-L-04', () => {
  test('UT-12 calculates subtotal and no-discount total for all rows', () => {
    expect(cartTotals([{ price: 39, qty: 1 }, { price: 24.5, qty: 1 }], 0))
      .toEqual({ subtotal: 63.5, discount: 0, total: 63.5 });
    expect(cartTotals([{ price: 39, qty: 3 }], 0).total).toBe(117);
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
  test.each([[3, 3], ['3', 3], [2.7, 2], [1, 1]])(
    'UT-15 valid quantity %p becomes %p', (input, expected) => {
      expect(normalizeQuantity(input)).toBe(expected);
    }
  );
  test.each([[0, 1], [-5, 1], ['abc', 1], ['', 1], [null, 1]])(
    'UT-17 invalid quantity %p becomes 1', (input, expected) => {
      expect(normalizeQuantity(input)).toBe(expected);
    }
  );
});

describe('discountRateFor — REQ-L-06', () => {
  test('UT-16 SAVE10 returns 0.10', () => {
    expect(discountRateFor('SAVE10')).toBe(0.1);
  });
  test('UT-18 case and whitespace are ignored for SAVE20', () => {
    expect(discountRateFor(' save20 ')).toBe(0.2);
    expect(discountRateFor('save20')).toBe(0.2);
  });
  test('UT-19 unknown and empty codes return zero', () => {
    expect(discountRateFor('UNKNOWN')).toBe(0);
    expect(discountRateFor('')).toBe(0);
  });
});

describe('validateCheckout — REQ-L-07', () => {
  test('UT-20 valid checkout has no errors', () => {
    expect(validateCheckout({ name: 'Mari Maasikas', email: 'mari@example.com', address: 'Tallinn' })).toEqual({});
  });
  test('UT-21 empty checkout returns all three errors', () => {
    expect(Object.keys(validateCheckout({})).sort()).toEqual(['address', 'email', 'name']);
  });
  test('UT-22 one-character name is rejected', () => {
    expect(validateCheckout({ name: 'M', email: 'mari@example.com', address: 'Tallinn' })).toHaveProperty('name');
  });
  test('UT-23 two-character name is accepted', () => {
    expect(validateCheckout({ name: 'Ma', email: 'ma@example.com', address: 'Tallinn' })).not.toHaveProperty('name');
  });
  test.each(['mari', 'mari@', 'mari@example', 'mari maasikas@example.com'])(
    'UT-24 rejects malformed email %s', (email) => {
      expect(validateCheckout({ name: 'Mari', email, address: 'Tallinn' })).toHaveProperty('email');
    }
  );
  test('UT-25 whitespace-only address is rejected', () => {
    expect(validateCheckout({ name: 'Mari', email: 'mari@example.com', address: '   ' })).toHaveProperty('address');
  });
});
