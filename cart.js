// ==========================================
// TROPIGO CART SYSTEM
// ==========================================
const CART_KEY = 'tropigo_cart';

function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
}
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}
function addToCart(name, price, qty = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty += qty;
    else cart.push({ name, price, qty });
    saveCart(cart);
    showToast(`Added ${qty} × ${name}`);
}
function removeFromCart(name) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== name);
    saveCart(cart);
    if (typeof renderCart === 'function') renderCart();
}
function updateQty(name, delta) {
    const cart = getCart();
    const item = cart.find(i => i.name === name);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(name); return; }
    saveCart(cart);
    if (typeof renderCart === 'function') renderCart();
}
function getCartCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
}
function getCartSubtotal() {
    return getCart().reduce((sum, i) => sum + (i.price * i.qty), 0);
}
function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = getCartCount();
    badges.forEach(b => {
        b.textContent = count;
        b.style.display = count > 0 ? 'flex' : 'none';
    });
}

function showToast(msg) {
    let toast = document.getElementById('tropigoToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'tropigoToast';
        toast.className = 'tropigo-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2200);
}

function renderCart() {
    const container = document.getElementById('cartContainer');
    const summary = document.getElementById('cartSummary');
    const empty = document.getElementById('cartEmpty');
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = '';
        summary.style.display = 'none';
        empty.style.display = 'block';
        updateCartBadge();
        return;
    }

    summary.style.display = 'block';
    empty.style.display = 'none';

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₱${item.price} each</p>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="updateQty('${item.name.replace(/'/g, "\\'")}', -1)">−</button>
                <span class="qty-display">${item.qty}</span>
                <button class="qty-btn" onclick="updateQty('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="cart-item-subtotal">₱${item.price * item.qty}</div>
        </div>
    `).join('');

    const subtotal = getCartSubtotal();
    document.getElementById('subtotal').textContent = '₱' + subtotal;
    document.getElementById('total').textContent = '₱' + subtotal;

    const btn = document.getElementById('checkoutBtn');
    if (btn) {
        btn.onclick = () => {
            sessionStorage.setItem('tropigo_checkout_total', subtotal);
            window.location.href = 'checkout.html';
        };
    }

    updateCartBadge();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cartContainer')) renderCart();
    updateCartBadge();
});