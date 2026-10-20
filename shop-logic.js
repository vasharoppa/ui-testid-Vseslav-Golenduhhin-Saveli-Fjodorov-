function filterProducts(products, query) {
  if (!query) return products;
  const q = query.toLowerCase().trim();
  return products.filter(p => p.name.toLowerCase().includes(q));
}

function sortProducts(products, mode) {
  const list = [...products];
  if (mode === 'name') {
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (mode === 'price-asc') {
    return list.sort((a, b) => Number(a.price) - Number(b.price));
  }
  if (mode === 'price-desc') {
    return list.sort((a, b) => Number(b.price) - Number(a.price));
  }
  return list;
}

function lineTotal(price, qty) {
  return Math.round(price * qty * 100) / 100;
}

function cartTotals(rows, discountRate = 0) {
  const subtotal = rows.reduce((sum, r) => sum + r.price * r.qty, 0);
  const discount = Math.round(subtotal * discountRate * 100) / 100;
  const total = Math.round((subtotal - discount) * 100) / 100;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount,
    total
  };
}

function normalizeQuantity(val) {
  const parsed = parseInt(val, 10);
  if (isNaN(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

function discountRateFor(code) {
  if (!code) return 0;
  const c = code.trim().toUpperCase();
  if (c === 'SAVE10') return 0.10;
  if (c === 'SAVE20') return 0.20;
  return 0;
}

function validateCheckout(data) {
  const errors = {};
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Invalid email address';
  }
  if (!data.address || data.address.trim().length === 0) {
    errors.address = 'Address is required';
  }
  return errors;
}

module.exports = {
  filterProducts,
  sortProducts,
  lineTotal,
  cartTotals,
  normalizeQuantity,
  discountRateFor,
  validateCheckout
};