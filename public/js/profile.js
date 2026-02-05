// Profile page JavaScript
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Fetch profile data
async function fetchProfile() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayProfile(data.user);
        } else {
            document.getElementById('profileData').innerHTML = '<p class="error-message" style="display:block;">Failed to load profile</p>';
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        document.getElementById('profileData').innerHTML = '<p class="error-message" style="display:block;">Failed to load profile</p>';
    }
}

function displayProfile(user) {
    const container = document.getElementById('profileData');
    
    container.innerHTML = `
        <div class="profile-field">
            <label>Name</label>
            <div class="value">${user.name}</div>
        </div>
        <div class="profile-field">
            <label>Email</label>
            <div class="value">${user.email}</div>
        </div>
        <div class="profile-field">
            <label>Member Since</label>
            <div class="value">${new Date(user.created_at).toLocaleDateString()}</div>
        </div>
    `;
}

// Fetch transaction history
async function fetchTransactions() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/trading/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayTransactions(data.orders);
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

function displayTransactions(orders) {
    const container = document.getElementById('transactionHistory');
    
    if (!orders || orders.length === 0) {
        container.innerHTML = '<p>No transactions yet</p>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="transaction-item">
            <div><strong>${order.type.toUpperCase()}</strong> ${order.cryptocurrency.toUpperCase()}</div>
            <div>Amount: ${order.amount}</div>
            <div>Price: $${order.price}</div>
            <div>Total: $${(order.amount * order.price).toFixed(2)}</div>
            <div>Status: <strong>${order.status}</strong></div>
            <div class="transaction-date">${new Date(order.created_at).toLocaleString()}</div>
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
        fetchProfile();
        fetchTransactions();
    }
});
