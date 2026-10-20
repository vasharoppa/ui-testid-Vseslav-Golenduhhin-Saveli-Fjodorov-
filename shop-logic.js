// MiniShop business logic shared by Jest (Node.js) and the browser.
//
// Specification:
// REQ-L-01 filterProducts: case-insensitive substring match; empty query returns all.
// REQ-L-02 sortProducts: name A-Z; numeric price ascending/descending; do not mutate input.
// REQ-L-03 lineTotal: price * quantity, rounded to 2 decimal places.
// REQ-L-04 cartTotals: discount applies to the whole basket; empty basket totals are zero.
// REQ-L-05 normalizeQuantity: integer >= 1; invalid, blank, zero and negative become 1;
//             2.7 becomes 2 and '3' becomes 3.
// REQ-L-06 discountRateFor: SAVE10=10%, SAVE20=20%, case/space insensitive; unknown=0.
// REQ-L-07 validateCheckout: trimmed name >= 2 chars, email user@domain.tld, non-empty address.
//
// Four intentional defects for this assignment: D-L-01 price-desc compares strings;
// D-L-02 discount uses only the first cart row; D-L-03 quantity zero is accepted;
// D-L-04 email validation accepts a domain without a dot. Do not fix before documenting them.

function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function filterProducts(products = [], query = '') {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return [...products];
  return products.filter((product) => String(product.name ?? '').toLowerCase().includes(q));
}

function sortProducts(products = [], mode = 'name') {
  const result = [...products];
  if (mode === 'name') return result.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  if (mode === 'price-asc') return result.sort((a, b) => Number(a.price) - Number(b.price));
  if (mode === 'price-desc') {
    // D-L-01: intentional defect; string comparison misorders values such as 249 and 89.
    return result.sort((a, b) => String(b.price).localeCompare(String(a.price)));
  }
  return result;
}

function lineTotal(price, qty) {
  return round2(Number(price) * Number(qty));
}

function cartTotals(rows = [], discountRate = 0) {
  const subtotal = round2(rows.reduce((sum, row) => sum + lineTotal(row.price, row.qty), 0));
  // D-L-02: intentional defect; discount must use subtotal, not the first row only.
  const discount = round2(rows.length ? lineTotal(rows[0].price, rows[0].qty) * Number(discountRate) : 0);
  return { subtotal, discount, total: round2(subtotal - discount) };
}

function normalizeQuantity(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) return 1;
  // D-L-03: intentional defect; zero should be normalized to 1.
  return Math.floor(parsed);
}

function discountRateFor(code) {
  const normalized = String(code ?? '').trim().toUpperCase();
  if (normalized === 'SAVE10') return 0.1;
  if (normalized === 'SAVE20') return 0.2;
  return 0;
}

function validateCheckout({ name = '', email = '', address = '' } = {}) {
  const errors = {};
  if (String(name).trim().length < 2) errors.name = 'Enter your full name';
  // D-L-04: intentional defect; the domain must also contain a dot/TLD.
  if (!/^[^\s@]+@[^\s@]+$/.test(String(email).trim())) errors.email = 'Enter a valid email address';
  if (!String(address).trim()) errors.address = 'Enter a delivery address';
  return errors;
}

const MiniShopLogic = {
  filterProducts, sortProducts, lineTotal, cartTotals, normalizeQuantity,
  discountRateFor, validateCheckout,
};

if (typeof module !== 'undefined' && module.exports) module.exports = MiniShopLogic;
if (typeof window !== 'undefined') window.MiniShopLogic = MiniShopLogic;
