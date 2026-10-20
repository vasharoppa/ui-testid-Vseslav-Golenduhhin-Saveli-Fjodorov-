const { applyDiscount } = require('./discount');

// Black-box tests: based on the published specification.
describe('applyDiscount — black-box tests', () => {
  test('no code returns the price unchanged', () => {
    expect(applyDiscount(100, undefined)).toBe(100);
  });

  test('unknown code returns the price unchanged', () => {
    expect(applyDiscount(100, 'NOTREAL')).toBe(100);
  });

  test('STUDENT10 reduces price by 10 percent', () => {
    expect(applyDiscount(100, 'STUDENT10')).toBe(90);
  });

  test('WELCOME subtracts 5 EUR when price is at least 20 EUR', () => {
    expect(applyDiscount(25, 'WELCOME')).toBe(20);
  });

  test('WELCOME does not apply below 20 EUR', () => {
    expect(applyDiscount(19.99, 'WELCOME')).toBe(19.99);
  });

  test('result is rounded to cents', () => {
    expect(applyDiscount(10.01, 'STUDENT10')).toBe(9.01);
  });
});

// White-box tests: exercise the branches identified during code inspection.
describe('applyDiscount — white-box tests', () => {
  test('handles the FREE branch according to the public discount rules', () => {
    expect(applyDiscount(100, 'FREE')).toBe(100);
  });

  test('applies a discount to a VIP customer', () => {
    expect(applyDiscount(100, undefined, { isVip: true })).toBe(80);
  });
});

// Grey-box test: checks interaction between a promotion and VIP pricing.
describe('applyDiscount — grey-box tests', () => {
  test('combines STUDENT10 and VIP discounts and rounds the result', () => {
    expect(applyDiscount(100, 'STUDENT10', { isVip: true })).toBe(72);
  });
});
