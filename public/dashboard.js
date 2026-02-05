// API URL - change this if backend is hosted elsewhere
const API_URL = window.location.origin;

// Check if user is authenticated on page load
async function checkAuth() {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!token) {
        // Redirect to login if no token
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Verify token with backend
        const response = await fetch(`${API_URL}/api/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Display user email
            document.getElementById('userEmail').textContent = data.user.email || userEmail;
        } else {
            // Token is invalid, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Auth verification error:', error);
        showMessage('Error verifying authentication. Please login again.', 'error');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            window.location.href = 'login.html';
        }, 2000);
    }
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    
    showMessage('Logging out...', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
});

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
}

// Run auth check on page load
checkAuth();
