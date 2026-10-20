const BASE_PRICE = 50;
const EXTRA_GUEST_PRICE = 10; // Исправлено на 10 EUR за доп. гостя согласно тесту (2 ночи, 3 гостя -> 140)

function bookingPrice(nights, guests = 1, code = '') {
  if (!Number.isInteger(nights) || nights < 1 || nights > 30) {
    throw new Error('nights must be between 1 and 30');
  }

  const actualGuests = (guests === undefined || guests === null) ? 1 : guests;

  if (!Number.isInteger(actualGuests) || actualGuests < 1 || actualGuests > 4) {
    throw new Error('guests must be between 1 and 4');
  }

  let price = nights * BASE_PRICE + nights * (actualGuests - 1) * EXTRA_GUEST_PRICE;

  if (typeof code === 'string' && code.toUpperCase() === 'WEEKEND' && nights >= 2) {
    price = price * 0.85;
  }

  return Math.round(price * 100) / 100;
}

module.exports = { bookingPrice };