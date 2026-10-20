const { isValidPassword } = require('./password');

describe('isValidPassword', () => {
  test('accepts a password with exactly 8 characters', () => {
    expect(isValidPassword('abcdefgh')).toBe(true);
  });

  test('accepts a password longer than 8 characters', () => {
    expect(isValidPassword('abcdefghi')).toBe(true);
  });

  test('rejects a password shorter than 8 characters', () => {
    expect(isValidPassword('abc123')).toBe(false);
  });

  test('rejects an empty password', () => {
    expect(isValidPassword('')).toBe(false);
  });

  test('rejects a password made only of spaces', () => {
    expect(isValidPassword('         ')).toBe(false);
  });

  test('rejects non-string values', () => {
    expect(isValidPassword(12345678)).toBe(false);
  });
});
