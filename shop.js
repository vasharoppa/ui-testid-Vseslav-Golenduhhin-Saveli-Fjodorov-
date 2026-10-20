// MiniShop v2 – client-side web shop used as the system under test for UI tests.
// All state lives in memory (reload = fresh start). No backend.
//
// Changes in v2 (the developer's release notes):
//   - "Add to cart" buttons are now labelled "Buy" (accessible name "Buy <product>").
//   - "Cart" is now "Basket"; on narrow screens only the badge is shown (aria-label "Basket").
//   - Basket rows have a quantity input (min 1); changing it updates line total and total.
//   - Sort select on the products page: Name / Price: low to high / Price: high to low.
//   - Discount code in the basket: SAVE10 gives 10 % off the whole basket; unknown code → "Invalid code".
//   - v1 defects (search case, total × qty, email format) are fixed.
//
// NOTE: v2 contains THREE new intentional defects. Your UI tests should find them.

const PRODUCTS = [
  { id: 1, name: 'Laptop Stand', category: 'Accessories', price: 29.90 },
  { id: 2, name: 'USB-C Hub', category: 'Accessories', price: 39.00 },
  { id: 3, name: 'Mechanical Keyboard', category: 'Input', price: 89.00 },
  { id: 4, name: 'Wireless Mouse', category: 'Input', price: 24.50 },
  { id: 5, name: 'Monitor 27"', category: 'Displays', price: 249.00 },
  { id: 6, name: 'Webcam HD', category: 'Video', price: 54.90 },
];

const cart = new Map(); // productId -> qty
let discountRate = 0;
let orderNo = 1000;

const $ = (sel) => document.querySelector(sel);
const money = (n) => n.toFixed(2) + ' €';


function renderProducts() {
  const q = $('#search').value.toLowerCase();
  const visible = MiniShopLogic.sortProducts(MiniShopLogic.filterProducts(PRODUCTS, q), $('#sort').value);
  $('#product-grid').innerHTML = visible.map((p) => `
    <article class="card" data-testid="product" data-id="${p.id}">
      <h3>${p.name}</h3>
      <div class="cat">${p.category}</div>
      <div class="price" data-testid="price">${money(p.price)}</div>
      <button type="button" data-add="${p.id}" aria-label="Buy ${p.name}">Buy</button>
    </article>`).join('');
  $('#result-count').textContent = `${visible.length} products`;
}

function renderCart() {
  const rows = [...cart.entries()].map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === id), qty }));
  $('#cart-count').textContent = rows.reduce((s, r) => s + r.qty, 0);
  if (rows.length === 0) {
    $('#cart-body').innerHTML = '<p class="empty" data-testid="cart-empty">Your basket is empty</p>';
    return;
  }
  const totals = MiniShopLogic.cartTotals(rows.map((r) => ({ price: r.p.price, qty: r.qty })), discountRate);
  const { subtotal, discount, total } = totals;
  $('#cart-body').innerHTML = `
    <table aria-label="Basket items">
      <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Line total</th><th></th></tr></thead>
      <tbody>${rows.map((r) => `
        <tr data-testid="cart-row" data-id="${r.p.id}">
          <td>${r.p.name}</td><td>${money(r.p.price)}</td>
          <td><input type="number" value="${r.qty}" data-qty="${r.p.id}" aria-label="Quantity for ${r.p.name}"></td>
          <td data-testid="line-total">${money(MiniShopLogic.lineTotal(r.p.price, r.qty))}</td>
          <td><button type="button" class="secondary" data-remove="${r.p.id}" aria-label="Remove ${r.p.name}">Remove</button></td>
        </tr>`).join('')}
      </tbody>
      <tfoot>
        <tr><td colspan="3">Subtotal</td><td data-testid="cart-subtotal">${money(subtotal)}</td><td></td></tr>
        <tr><td colspan="3">Discount</td><td data-testid="cart-discount">−${money(discount)}</td><td></td></tr>
        <tr><td colspan="3">Total</td><td data-testid="cart-total">${money(total)}</td><td></td></tr>
      </tfoot>
    </table>`;
}

function showView(hash) {
  const cartView = hash === '#cart';
  $('#products').hidden = cartView;
  $('#cart').hidden = !cartView;
  if (cartView) { $('#nav-cart').setAttribute('aria-current', 'page'); $('#nav-products').removeAttribute('aria-current'); }
  else { $('#nav-products').setAttribute('aria-current', 'page'); $('#nav-cart').removeAttribute('aria-current'); }
}

function validate(form) {
  return MiniShopLogic.validateCheckout({ name: form.name.value, email: form.email.value, address: form.address.value });
}

document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  if (add) { const id = Number(add.dataset.add); cart.set(id, (cart.get(id) || 0) + 1); renderCart(); }
  const rm = e.target.closest('[data-remove]');
  if (rm) { cart.delete(Number(rm.dataset.remove)); renderCart(); }
});

document.addEventListener('change', (e) => {
  const q = e.target.closest('[data-qty]');
  if (q) {
    const qty = MiniShopLogic.normalizeQuantity(q.value);
    cart.set(Number(q.dataset.qty), qty);
    renderCart();
  }
});

$('#apply-discount').addEventListener('click', () => {
  const code = $('#discount').value.trim().toUpperCase();
  const msg = $('#discount-message');
  const rate = MiniShopLogic.discountRateFor(code);
  if (rate > 0) { discountRate = rate; msg.className = 'ok'; msg.textContent = `Code ${code} applied`; }
  else { discountRate = 0; msg.className = 'error'; msg.textContent = 'Invalid code'; }
  renderCart();
});

$('#search').addEventListener('input', renderProducts);
$('#sort').addEventListener('change', renderProducts);
window.addEventListener('hashchange', () => showView(location.hash));

$('#checkout').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const errors = validate(form);
  for (const f of ['name', 'email', 'address']) $(`#${f}-error`).textContent = errors[f] || '';
  if (Object.keys(errors).length) return;
  if (cart.size === 0) { $('#order-result').innerHTML = '<div class="error" role="alert">Your basket is empty</div>'; return; }
  const name = form.name.value.trim();
  $('#order-result').innerHTML = '';
  setTimeout(() => {
    orderNo += 1;
    cart.clear(); discountRate = 0; renderCart(); form.reset();
    $('#order-result').innerHTML = `<div class="alert" role="status" data-testid="order-confirmation">Thank you, ${name}! Order #${orderNo} confirmed.</div>`;
  }, 300 + Math.random() * 900);   // the "server" takes 0.3–1.2 s – tests must wait for the result, not sleep
});

renderProducts();
renderCart();
showView(location.hash);