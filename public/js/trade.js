// Trading page JavaScript
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

let currentOrderType = 'buy';
let currentPrices = {};

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        document.getElementById('authMessage').style.display = 'block';
        document.getElementById('tradeContent').style.display = 'none';
        return false;
    }
    
    // Update navigation
    document.getElementById('loginLink').style.display = 'none';
    document.getElementById('profileLink').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'block';
    
    return true;
}

// Fetch live market data
async function fetchLiveMarketData() {
    try {
        const response = await fetch(`${API_BASE_URL}/market/prices`);
        const data = await response.json();
        
        if (data.success) {
            displayLiveMarketData(data.data);
            // Update current prices object
            data.data.forEach(crypto => {
                currentPrices[crypto.id] = crypto.current_price;
            });
        }
    } catch (error) {
        console.error('Error fetching market data:', error);
    }
}

function displayLiveMarketData(cryptos) {
    const container = document.getElementById('liveMarketData');
    
    if (!cryptos || cryptos.length === 0) {
        container.innerHTML = '<p>No market data available</p>';
        return;
    }
    
    container.innerHTML = cryptos.map(crypto => {
        const changeClass = crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
        const changeSymbol = crypto.price_change_percentage_24h >= 0 ? '+' : '';
        
        return `
            <div class="market-item" data-crypto="${crypto.id}">
                <div>
                    <strong>${crypto.name}</strong> (${crypto.symbol.toUpperCase()})
                    <div class="change ${changeClass}">
                        ${changeSymbol}${crypto.price_change_percentage_24h.toFixed(2)}%
                    </div>
                </div>
                <div class="price">$${crypto.current_price.toLocaleString()}</div>
            </div>
        `;
    }).join('');
    
    // Add click handlers to market items
    document.querySelectorAll('.market-item').forEach(item => {
        item.addEventListener('click', () => {
            const cryptoId = item.dataset.crypto;
            document.getElementById('cryptocurrency').value = cryptoId;
            updatePrice();
        });
    });
}

// Trade form tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentOrderType = btn.dataset.type;
        document.getElementById('orderBtn').textContent = `Place ${currentOrderType.charAt(0).toUpperCase() + currentOrderType.slice(1)} Order`;
    });
});

// Update price when cryptocurrency is selected
document.getElementById('cryptocurrency').addEventListener('change', updatePrice);
document.getElementById('amount').addEventListener('input', updateTotal);

function updatePrice() {
    const cryptoId = document.getElementById('cryptocurrency').value;
    if (cryptoId && currentPrices[cryptoId]) {
        document.getElementById('price').value = currentPrices[cryptoId].toFixed(2);
        updateTotal();
    }
}

function updateTotal() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const price = parseFloat(document.getElementById('price').value) || 0;
    const total = amount * price;
    document.getElementById('totalAmount').textContent = total.toFixed(2);
}

// Handle order submission
document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to place orders');
        window.location.href = 'login.html';
        return;
    }
    
    const orderData = {
        type: currentOrderType,
        cryptocurrency: document.getElementById('cryptocurrency').value,
        amount: parseFloat(document.getElementById('amount').value),
        price: parseFloat(document.getElementById('price').value)
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/trading/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(`${currentOrderType.toUpperCase()} order placed successfully!`);
            document.getElementById('orderForm').reset();
            document.getElementById('totalAmount').textContent = '0.00';
            fetchOrderHistory();
        } else {
            alert(data.message || 'Failed to place order');
        }
    } catch (error) {
        console.error('Order error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Fetch order history
async function fetchOrderHistory() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/trading/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayOrderHistory(data.orders);
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

function displayOrderHistory(orders) {
    const container = document.getElementById('orderHistory');
    
    if (!orders || orders.length === 0) {
        container.innerHTML = '<p>No orders yet</p>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-item order-type-${order.type}">
            <div><strong>${order.type.toUpperCase()}</strong> ${order.cryptocurrency.toUpperCase()}</div>
            <div>Amount: ${order.amount}</div>
            <div>Price: $${order.price}</div>
            <div>Total: $${(order.amount * order.price).toFixed(2)}</div>
            <div>Status: <strong>${order.status}</strong></div>
            <div style="font-size: 0.9rem; color: #666;">${new Date(order.created_at).toLocaleString()}</div>
        </div>
    `).join('');
}

// Logout handler
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        fetchLiveMarketData();
        fetchOrderHistory();
        // Refresh market data every 30 seconds
        setInterval(fetchLiveMarketData, 30000);
    }
});
