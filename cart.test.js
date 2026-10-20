const { calculateTotal, sendReceipt } = require('./cart');

describe('calculateTotal', () => {
  test('returns 0 for an empty cart', () => {
    expect(calculateTotal([])).toBe(0);
  });

  test('calculates price multiplied by quantity', () => {
    expect(calculateTotal([{ price: 10, qty: 3 }])).toBe(35);
  });

  test('applies STUDENT10 discount of 10 percent', () => {
    expect(calculateTotal([{ price: 100, qty: 1 }], 'STUDENT10')).toBe(90);
  });

  test('charges shipping below 100 EUR', () => {
    expect(calculateTotal([{ price: 20, qty: 2 }])).toBe(45);
  });

  test('does not charge shipping when subtotal is 100 EUR', () => {
    expect(calculateTotal([{ price: 50, qty: 2 }])).toBe(100);
  });

  test('throws TypeError when items is not an array', () => {
    expect(() => calculateTotal(null)).toThrow(TypeError);
  });

  test('rounds the final amount to cents', () => {
    expect(calculateTotal([{ price: 12.345, qty: 1 }])).toBe(17.35);
  });
});

describe('sendReceipt', () => {
  test('sends receipt to the order email and returns true', () => {
    const emailService = { send: jest.fn() };
    const order = { id: 42, email: 'anna@example.com', total: 105 };

    const result = sendReceipt(emailService, order);

    expect(result).toBe(true);
    expect(emailService.send).toHaveBeenCalledTimes(1);
    expect(emailService.send).toHaveBeenCalledWith(
      'anna@example.com',
      'Order 42: total 105 EUR'
    );
  });
});
