const { bookingPrice } = require('./booking');

describe('bookingPrice', () => {
  test('one night and one guest costs 50 EUR', () => {
    expect(bookingPrice(1, 1)).toBe(50);
  });

  test('adds 10 EUR per night for each extra guest', () => {
    expect(bookingPrice(2, 3)).toBe(140);
  });

  test('accepts the maximum stay of 30 nights', () => {
    expect(bookingPrice(30, 1)).toBe(1500);
  });

  test('defaults to one guest when guests are omitted', () => {
    expect(bookingPrice(2)).toBe(100);
  });

  test('applies WEEKEND discount for a stay of at least two nights', () => {
    expect(bookingPrice(2, 1, 'WEEKEND')).toBe(85);
  });

  test('discount code is case-insensitive', () => {
    expect(bookingPrice(2, 1, 'weekend')).toBe(85);
  });

  test('rejects a stay shorter than one night', () => {
    expect(() => bookingPrice(0, 1)).toThrow(Error);
  });

  test('rejects more than four guests', () => {
    expect(() => bookingPrice(1, 5)).toThrow(Error);
  });

  test('rejects a non-integer number of nights', () => {
    expect(() => bookingPrice(1.5, 1)).toThrow(Error);
  });
});
