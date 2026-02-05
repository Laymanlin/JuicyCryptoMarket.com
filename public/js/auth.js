// Authentication JavaScript for login and register pages
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Register form handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        const errorMsg = document.getElementById('errorMessage');
        const successMsg = document.getElementById('successMessage');
        
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        
        // Validate passwords match
        if (password !== confirmPassword) {
            errorMsg.textContent = 'Passwords do not match';
            errorMsg.style.display = 'block';
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                successMsg.textContent = 'Registration successful! Redirecting to login...';
                successMsg.style.display = 'block';
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                errorMsg.textContent = data.message || 'Registration failed';
                errorMsg.style.display = 'block';
            }
        } catch (error) {
            console.error('Registration error:', error);
            errorMsg.textContent = 'An error occurred. Please try again.';
            errorMsg.style.display = 'block';
        }
    });
}

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const errorMsg = document.getElementById('errorMessage');
        const successMsg = document.getElementById('successMessage');
        
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                successMsg.textContent = 'Login successful! Redirecting...';
                successMsg.style.display = 'block';
                setTimeout(() => {
                    window.location.href = 'trade.html';
                }, 1000);
            } else {
                errorMsg.textContent = data.message || 'Login failed';
                errorMsg.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMsg.textContent = 'An error occurred. Please try again.';
            errorMsg.style.display = 'block';
        }
    });
}
