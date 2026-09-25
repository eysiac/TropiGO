// ==========================================
// TROPIGO CHECKOUT
// ==========================================
const CART_KEY = 'tropigo_cart';
const ORDERS_KEY = 'tropigo_orders';
const scriptURL = "https://script.google.com/macros/s/AKfycbzcCQd7d0tu5J4msn0wR7025qvdSQbEILyf56e5j7ZYYlP3NJ7sNTvjPqZEj3hzE0rD/exec";

function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
}

// Render summary on load
(function renderSummary() {
    const box = document.getElementById('orderSummaryBox');
    if (!box) return;

    const cart = getCart();
    if (cart.length === 0) {
        box.innerHTML = '<p style="text-align:center; color:#888;">Your cart is empty. <a href="index.html#menu" style="color:#d9a441;">Go back to menu</a></p>';
        document.getElementById('checkoutForm').style.display = 'none';
        return;
    }

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

    box.innerHTML = `
        <h4 style="margin-bottom:10px; font-family:'Playfair Display',serif; color:#1e2b37;">Order Summary</h4>
        ${cart.map(item => `
            <div class="summary-item">
                <span>${item.qty} × ${item.name}</span>
                <span>₱${item.price * item.qty}</span>
            </div>
        `).join('')}
        <div class="summary-divider"></div>
        <div class="summary-item total"><span>Total</span><span>₱${subtotal}</span></div>
    `;
})();

// Form submit
const form = document.getElementById('checkoutForm');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const cart = getCart();
        const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

        const order = {
            orderId: 'TRP-' + Date.now().toString().slice(-8),
            name: document.getElementById('name').value.trim(),
            contact: document.getElementById('contact').value.trim(),
            delivery: document.getElementById('delivery').value,
            address: document.getElementById('address').value.trim(),
            payment: document.getElementById('payment').value,
            instructions: document.getElementById('instructions').value.trim(),
            items: cart.map(i => `${i.qty}× ${i.name} (₱${i.price})`).join(', '),
            total,
            timestamp: new Date().toLocaleString()
        };

        const msg = document.getElementById('orderMessage');
        msg.style.color = '#27ae60';
        msg.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Placing your order...`;

        // Save locally
        const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
        orders.push(order);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

        // Send to Google Sheets
        const formData = new FormData();
        Object.keys(order).forEach(k => formData.append(k, order[k]));

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(() => {
                msg.innerHTML = `
                    <div style="background:#e8f8ee; border:1px solid #27ae60; padding:14px; border-radius:14px; text-align:left; color:#1e2b37;">
                        <h4 style="color:#27ae60; margin-bottom:6px;"><i class="fas fa-check-circle"></i> Order Confirmed!</h4>
                        <p style="font-size:13px; margin-bottom:4px;">Thank you, <strong>${order.name}</strong>!</p>
                        <p style="font-size:13px; margin-bottom:4px;">Order ID: <strong>${order.orderId}</strong></p>
                        <p style="font-size:13px; margin-bottom:4px;">Total: <strong>₱${total}</strong></p>
                        <p style="font-size:12px; color:#888;">We'll contact you at ${order.contact} to confirm.</p>
                    </div>
                `;
                localStorage.removeItem(CART_KEY);
                form.style.display = 'none';
                setTimeout(() => window.location.href = 'index.html#menu', 5000);
            })
            .catch((err) => {
                console.error(err);
                msg.innerHTML = `
                    <div style="background:#fff4e5; border:1px solid #d9a441; padding:14px; border-radius:14px; color:#1e2b37;">
                        <h4 style="color:#d9a441;"><i class="fas fa-exclamation-triangle"></i> Order Saved Locally</h4>
                        <p style="font-size:13px;">Order ID: <strong>${order.orderId}</strong></p>
                        <p style="font-size:12px; color:#888;">Please contact us on Facebook to confirm.</p>
                    </div>
                `;
                localStorage.removeItem(CART_KEY);
                form.style.display = 'none';
            });
    });
}