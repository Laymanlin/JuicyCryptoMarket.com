// Application state
let currentUser = null;

// API base URL
const API_BASE = window.location.origin;

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailDisplay = document.getElementById('userEmail');
const balanceAmount = document.getElementById('balanceAmount');
const resetBalanceBtn = document.getElementById('resetBalanceBtn');
const buyForm = document.getElementById('buyForm');
const sellForm = document.getElementById('sellForm');
const tradeMessage = document.getElementById('tradeMessage');
const holdingsTable = document.getElementById('holdingsTable');
const transactionsTable = document.getElementById('transactionsTable');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('demoUser');
    if (savedUser) {
        try {
            const parsed = JSON.parse(savedUser);
            if (parsed && parsed.email) {
                currentUser = parsed;
                showDashboard();
            }
        } catch (e) {
            // Invalid data in localStorage, clear it
            localStorage.removeItem('demoUser');
        }
    }

    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    resetBalanceBtn.addEventListener('click', handleResetBalance);
    buyForm.addEventListener('submit', handleBuy);
    sellForm.addEventListener('submit', handleSell);
});

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Show error message
function showError(message) {
    loginError.textContent = message;
    loginError.classList.add('show');
    setTimeout(() => {
        loginError.classList.remove('show');
    }, 5000);
}

// Show trade message
function showTradeMessage(message, type = 'success') {
    tradeMessage.textContent = message;
    tradeMessage.className = `message show ${type}`;
    setTimeout(() => {
        tradeMessage.classList.remove('show');
    }, 5000);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    try {
        const response = await fetch(`${API_BASE}/api/demo-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.account;
            localStorage.setItem('demoUser', JSON.stringify(currentUser));
            showDashboard();
        } else {
            showError(data.error || 'Login failed');
        }
    } catch (error) {
        showError('Connection error. Please try again.');
        console.error('Login error:', error);
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('demoUser');
    loginPage.classList.remove('hidden');
    dashboardPage.classList.add('hidden');
    loginForm.reset();
}

// Show dashboard
async function showDashboard() {
    loginPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
    
    userEmailDisplay.textContent = currentUser.email;
    
    // Load account data
    await refreshAccountData();
}

// Refresh account data
async function refreshAccountData() {
    try {
        const response = await fetch(`${API_BASE}/api/get-balance?email=${encodeURIComponent(currentUser.email)}`);
        const data = await response.json();
        
        if (response.ok) {
            currentUser.balance = data.balance;
            currentUser.holdings = data.holdings;
            updateBalanceDisplay();
            updateHoldingsDisplay();
            await loadTransactions();
        }
    } catch (error) {
        console.error('Error refreshing account data:', error);
    }
}

// Update balance display
function updateBalanceDisplay() {
    balanceAmount.textContent = formatCurrency(currentUser.balance);
}

// Update holdings display
function updateHoldingsDisplay() {
    if (!currentUser.holdings || Object.keys(currentUser.holdings).length === 0) {
        holdingsTable.innerHTML = '<p class="empty-state">No holdings yet. Start trading to see your portfolio!</p>';
        return;
    }

    let tableHTML = '<table><thead><tr><th>Cryptocurrency</th><th>Amount</th></tr></thead><tbody>';
    
    for (const [crypto, amount] of Object.entries(currentUser.holdings)) {
        tableHTML += `<tr><td><strong>${crypto}</strong></td><td>${amount}</td></tr>`;
    }
    
    tableHTML += '</tbody></table>';
    holdingsTable.innerHTML = tableHTML;
}

// Load transactions
async function loadTransactions() {
    try {
        const response = await fetch(`${API_BASE}/api/transactions?email=${encodeURIComponent(currentUser.email)}`);
        const data = await response.json();
        
        if (response.ok && data.transactions && data.transactions.length > 0) {
            let tableHTML = '<table><thead><tr><th>Type</th><th>Crypto</th><th>Amount</th><th>Price</th><th>Total</th><th>Time</th></tr></thead><tbody>';
            
            data.transactions.reverse().forEach(tx => {
                const total = tx.totalCost || tx.totalValue;
                const typeClass = tx.type === 'buy' ? 'success' : 'danger';
                const typeEmoji = tx.type === 'buy' ? '📈' : '📉';
                const time = new Date(tx.timestamp).toLocaleString();
                
                tableHTML += `
                    <tr>
                        <td><span style="color: ${tx.type === 'buy' ? '#28a745' : '#dc3545'}">${typeEmoji} ${tx.type.toUpperCase()}</span></td>
                        <td><strong>${tx.crypto}</strong></td>
                        <td>${tx.amount}</td>
                        <td>${formatCurrency(tx.price)}</td>
                        <td>${formatCurrency(total)}</td>
                        <td>${time}</td>
                    </tr>
                `;
            });
            
            tableHTML += '</tbody></table>';
            transactionsTable.innerHTML = tableHTML;
        } else {
            transactionsTable.innerHTML = '<p class="empty-state">No transactions yet.</p>';
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Handle reset balance
async function handleResetBalance() {
    if (!confirm('Are you sure you want to reset your demo balance to $1 billion? This will clear all holdings and transactions.')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/reset-demo-balance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: currentUser.email })
        });

        const data = await response.json();

        if (data.success) {
            showTradeMessage(data.message, 'success');
            await refreshAccountData();
        } else {
            showTradeMessage(data.error || 'Reset failed', 'error');
        }
    } catch (error) {
        showTradeMessage('Connection error. Please try again.', 'error');
        console.error('Reset error:', error);
    }
}

// Handle buy
async function handleBuy(e) {
    e.preventDefault();
    
    const crypto = document.getElementById('buyCrypto').value;
    const amount = parseFloat(document.getElementById('buyAmount').value);
    const price = parseFloat(document.getElementById('buyPrice').value);
    
    if (!isFinite(amount) || !isFinite(price) || amount <= 0 || price <= 0) {
        showTradeMessage('Amount and price must be valid positive numbers', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/trade/buy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: currentUser.email,
                crypto,
                amount,
                price
            })
        });

        const data = await response.json();

        if (data.success) {
            showTradeMessage(data.message, 'success');
            buyForm.reset();
            await refreshAccountData();
        } else {
            showTradeMessage(data.error || 'Buy failed', 'error');
        }
    } catch (error) {
        showTradeMessage('Connection error. Please try again.', 'error');
        console.error('Buy error:', error);
    }
}

// Handle sell
async function handleSell(e) {
    e.preventDefault();
    
    const crypto = document.getElementById('sellCrypto').value;
    const amount = parseFloat(document.getElementById('sellAmount').value);
    const price = parseFloat(document.getElementById('sellPrice').value);
    
    if (!isFinite(amount) || !isFinite(price) || amount <= 0 || price <= 0) {
        showTradeMessage('Amount and price must be valid positive numbers', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/trade/sell`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: currentUser.email,
                crypto,
                amount,
                price
            })
        });

        const data = await response.json();

        if (data.success) {
            showTradeMessage(data.message, 'success');
            sellForm.reset();
            await refreshAccountData();
        } else {
            showTradeMessage(data.error || 'Sell failed', 'error');
        }
    } catch (error) {
        showTradeMessage('Connection error. Please try again.', 'error');
        console.error('Sell error:', error);
    }
}
