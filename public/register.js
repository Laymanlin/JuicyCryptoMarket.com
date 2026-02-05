// API URL - change this if backend is hosted elsewhere
const API_URL = window.location.origin;

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    hideMessage();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Client-side validation
    let hasError = false;
    
    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address');
        hasError = true;
    }
    
    // Password validation
    if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters long');
        hasError = true;
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // Disable submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';
    
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Save token to localStorage
            // NOTE: Using localStorage for token storage is simpler but vulnerable to XSS attacks.
            // For production, consider using httpOnly cookies or other secure storage methods.
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.user.email);
            
            showMessage('Registration successful! Redirecting to dashboard...', 'success');
            
            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage(data.message || 'Registration failed. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
});

// Password strength indicator
document.getElementById('password').addEventListener('input', (e) => {
    const password = e.target.value;
    const strengthDiv = document.getElementById('passwordStrength');
    
    if (password.length === 0) {
        strengthDiv.textContent = '';
        strengthDiv.className = 'password-strength';
        return;
    }
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) {
        strengthDiv.textContent = 'Weak password';
        strengthDiv.className = 'password-strength weak';
    } else if (strength <= 4) {
        strengthDiv.textContent = 'Medium password';
        strengthDiv.className = 'password-strength medium';
    } else {
        strengthDiv.textContent = 'Strong password';
        strengthDiv.className = 'password-strength strong';
    }
});

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function clearErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.textContent = '');
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
}

function hideMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = '';
    messageDiv.className = 'message';
}
