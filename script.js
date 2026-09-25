// ==========================================
// GOOGLE APPS SCRIPT URL
// ==========================================
const scriptURL = "https://script.google.com/macros/s/AKfycbzcCQd7d0tu5J4msn0wR7025qvdSQbEILyf56e5j7ZYYlP3NJ7sNTvjPqZEj3hzE0rD/exec";

// ==========================================
// SPLASH SCREEN — hide after page loads
// ==========================================
(function () {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    const minDuration = 1200;
    const start = Date.now();

    window.addEventListener('load', () => {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, minDuration - elapsed);
        setTimeout(() => {
            splash.classList.add('hide');
            setTimeout(() => splash.remove(), 700);
        }, delay);
    });

    setTimeout(() => {
        if (splash && !splash.classList.contains('hide')) {
            splash.classList.add('hide');
            setTimeout(() => splash.remove(), 700);
        }
    }, 4000);
})();

// ==========================================
// PAGE NAVIGATION
// ==========================================
const pages = document.querySelectorAll('.page');
const pageNavBtns = document.querySelectorAll('.nav-btn[data-page]');
const allNavBtns = document.querySelectorAll('.nav-btn');

function showPage(pageName) {
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${pageName}`);
    if (target) {
        target.classList.add('active');
        target.scrollTop = 0;
    }

    allNavBtns.forEach(b => b.classList.remove('active'));
    pageNavBtns.forEach(btn => {
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });

    const navLinksEl = document.getElementById('navLinks');
    if (navLinksEl) navLinksEl.classList.remove('open');

    if (pageName === 'home') {
        history.replaceState(null, '', window.location.pathname);
    } else {
        history.replaceState(null, '', '#' + pageName);
    }
}

function goHome() { showPage('home'); }
function scrollToSection(id) { showPage(id); }

pageNavBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const page = this.dataset.page;
        if (page) showPage(page);
    });
});

// ==========================================
// HAMBURGER
// ==========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        navLinks.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.navbar')) navLinks.classList.remove('open');
    });
}

// ==========================================
// CHAT WIDGET
// ==========================================
const chatWindow = document.getElementById('chatWindow');
const chatBubble = document.getElementById('chatBubble');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const chatTyping = document.getElementById('chatTyping');
const quickReplies = document.getElementById('quickReplies');

let isChatOpen = false;
let chatTimeout = null;

function toggleChat() {
    isChatOpen = !isChatOpen;
    chatWindow.classList.toggle('open', isChatOpen);
    if (isChatOpen) {
        chatInput.focus();
        const badge = document.querySelector('.chat-bubble .badge');
        if (badge) badge.style.display = 'none';
    }
}
if (chatBubble) chatBubble.addEventListener('click', toggleChat);
if (chatClose) chatClose.addEventListener('click', toggleChat);

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';
    chatTyping.style.display = 'block';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    clearTimeout(chatTimeout);
    chatTimeout = setTimeout(() => {
        chatTyping.style.display = 'none';
        const reply = getBotReply(text);
        addMessage(reply, 'bot');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500 + Math.random() * 500);
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

if (quickReplies) {
    quickReplies.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            const q = e.target.dataset.q;
            if (q) { chatInput.value = q; sendMessage(); }
        }
    });
}
if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
    });
}
if (chatSend) chatSend.addEventListener('click', sendMessage);

// ==========================================
// SMART CHATBOT
// ==========================================
const BOT_KNOWLEDGE = [
    {
        keywords: ['price', 'cost', 'how much', 'magkano', 'presyo', 'pesos', '₱', 'bayad', 'rate', 'fee', 'cheap', 'expensive', 'mura', 'mahal', 'budget'],
        reply: "Our prices:\n\n🥭 Mango Lassi Classic — ₱79\n🍵 Matcha Mango — ₱89\n🍉 Watermelon Mango — ₱79\n🍫 Dark Chocolate Mango — ₱89\n🧀 Mango Cheesecake — ₱99\n\nAll are 16oz and 100% natural!"
    },
    {
        keywords: ['healthy', 'health', 'nutritious', 'masustansya', 'benefit', 'good for you', 'organic', 'natural', 'nutrients', 'vitamin', 'calories', 'sugar', 'diet', 'fiber'],
        reply: "Yes! 🌿 All TropiGo blends are packed with vitamins, minerals, and antioxidants. Naturally sweetened — no artificial additives!\n\nEach 16oz serving:\n• ~180 calories\n• 6g dietary fiber\n• 45% daily Vitamin C\n• 350mg potassium"
    },
    {
        keywords: ['signature', 'best', 'favorite', 'favourite', 'classic', 'recommend', 'suggest', 'bestseller', 'popular', 'top', 'famous', 'sikat', 'pinaka'],
        reply: "Our signature is the Mango Lassi Classic! 🥭\n\nMade with sweet ripe mangoes, creamy yogurt, and a touch of honey — it's our bestseller for a reason.\n\nWant to try it? Click Add on our Menu!"
    },
    {
        keywords: ['delivery', 'deliver', 'shipping', 'pickup', 'pick up', 'ship', 'lalamove', 'grab', 'courier', 'hatid', 'padala', 'door'],
        reply: "Yes, we deliver! 🚚\n\n📍 Pickup: Alcalde St. Kapasigan, Pasig City\n🚗 Delivery: Through partner couriers (Lalamove, Grab)\n\nOpen daily from 7:00 AM – 8:00 PM."
    },
    {
        keywords: ['menu', 'flavors', 'flavours', 'options', 'choices', 'variety', 'drinks', 'available', 'anong meron', 'ano meron', 'offer'],
        reply: "We have 5 delicious blends! 🍹\n\n1️⃣ Mango Lassi Classic — ₱79\n2️⃣ Matcha Mango — ₱89\n3️⃣ Watermelon Mango — ₱79\n4️⃣ Dark Chocolate Mango — ₱89\n5️⃣ Mango Cheesecake — ₱99\n\nAll 16oz, all natural!"
    },
    {
        keywords: ['vegan', 'plant-based', 'plant based', 'dairy-free', 'dairy free', 'milk', 'lactose', 'vegetarian', 'allergy', 'allergic'],
        reply: "🌱 Great news! All our fruit blends are plant-based and vegan-friendly.\n\nWe can use coconut or almond milk alternatives upon request — just let us know when you order!\n\nFor other allergies, please mention it in the Special Instructions box. 😊"
    },
    {
        keywords: ['hours', 'open', 'time', 'schedule', 'store', 'branch', 'location', 'where', 'saan', 'address', 'oras', 'bukas'],
        reply: "🕐 Store Hours: Daily, 7:00 AM – 8:00 PM\n📍 Location: Alcalde St. Kapasigan, Pasig City\n\nYou can also order online anytime through this website! 🛒"
    },
    {
        keywords: ['how to order', 'how do i order', 'order', 'buy', 'purchase', 'avail', 'umorder', 'bili', 'checkout', 'paano'],
        reply: "To order:\n\n1️⃣ Click Menu on the navigation\n2️⃣ Tap Add on your desired flavors\n3️⃣ Open the Cart (floating button)\n4️⃣ Click Proceed to Checkout\n5️⃣ Fill in your details and submit!\n\nWe'll confirm your order via text or call. 📱"
    },
    {
        keywords: ['payment', 'pay', 'gcash', 'cash', 'bank', 'card', 'credit', 'debit', 'bayad', 'mode of payment', 'mop'],
        reply: "We accept: 💳\n\n• Cash (on pickup/delivery)\n• GCash\n• Bank Transfer\n• Credit/Debit Card\n\nChoose your preferred method at checkout!"
    },
    {
        keywords: ['story', 'about', 'history', 'who', 'owner', 'founder', 'started', 'kwento', 'tungkol'],
        reply: "TropiGo was born from a love for rich, tropical flavors. 🇵🇭\n\nWe craft the ultimate Creamy Mango Lassi using real, sun-ripened mangoes from local farmers — no artificial fillers.\n\nRead our full story in the Story section! 📖"
    },
    {
        keywords: ['review', 'rating', 'feedback', 'testimonial', 'comment', 'sabi'],
        reply: "Our customers love us! ⭐⭐⭐⭐⭐\n\n\"The best mango lassi I've ever had!\" — Maria R.\n\"Healthy and delicious!\" — John C.\n\"Perfect refreshment on a hot day!\" — Lea S.\n\nCheck the Reviews page for more! 💛"
    },
    {
        keywords: ['hi', 'hello', 'hey', 'kumusta', 'kamusta', 'good morning', 'good afternoon', 'good evening', 'yo', 'sup'],
        reply: "Hi there! 👋 Welcome to TropiGo!\n\nI can help you with:\n💰 Prices\n🍹 Menu\n🚚 Delivery\n📝 How to Order\n\nWhat would you like to know?"
    },
    {
        keywords: ['thanks', 'thank you', 'salamat', 'ty', 'tnx', 'appreciate'],
        reply: "You're welcome! 😊 Enjoy your TropiGo blend! 🥭\n\nIf you need anything else, just ask!"
    },
    {
        keywords: ['bye', 'goodbye', 'paalam', 'see you', 'cya', 'ingat'],
        reply: "Goodbye! 👋 Hope to see you again soon at TropiGo!\n\nStay refreshed! 🥤"
    }
];

function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function getBotReply(input) {
    const text = input.toLowerCase().trim();
    const words = text.split(/\s+/);

    // 1. Exact substring
    for (const entry of BOT_KNOWLEDGE) {
        for (const kw of entry.keywords) {
            if (text.includes(kw)) return entry.reply;
        }
    }

    // 2. Fuzzy match (typo tolerance)
    let bestMatch = null;
    let bestScore = Infinity;

    for (const entry of BOT_KNOWLEDGE) {
        for (const kw of entry.keywords) {
            for (const w of words) {
                if (w.length < 3) continue;
                const dist = levenshtein(w, kw);
                const threshold = kw.length <= 4 ? 1 : 2;
                if (dist <= threshold && dist < bestScore) {
                    bestScore = dist;
                    bestMatch = entry;
                }
            }
        }
    }
    if (bestMatch) return bestMatch.reply;

    // 3. Fallback
    const suggestions = ['prices', 'menu', 'delivery', 'how to order', 'store hours'];
    const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
    return `Hmm, I'm not sure about that. 🤔\n\nI can help you with:\n• Prices 💰\n• Menu 🍹\n• Delivery 🚚\n• How to Order 📝\n• Store Hours 🕐\n\nTry asking about our ${pick}!`;
}

// ==========================================
// CHAT NAV BUTTON
// ==========================================
const chatNavBtn = document.getElementById('chatNavBtn');
if (chatNavBtn) {
    chatNavBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!isChatOpen) toggleChat();
        else chatInput.focus();
        if (navLinks) navLinks.classList.remove('open');
    });
}

// ==========================================
// ESC closes chat
// ==========================================
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isChatOpen) toggleChat();
});

// ==========================================
// LOGO → Home
// ==========================================
const logoArea = document.querySelector('.logo-area');
if (logoArea) logoArea.addEventListener('click', goHome);

// ==========================================
// INITIAL PAGE LOAD
// ==========================================
(function () {
    const validPages = ['home', 'menu', 'howto', 'story', 'reviews', 'faqs', 'socials'];
    const hash = window.location.hash.replace('#', '');
    if (hash && validPages.includes(hash)) {
        showPage(hash);
    } else {
        showPage('home');
        if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname);
        }
    }
})();

console.log('🍹 TropiGo loaded! Home is default. Chatbot ready.');