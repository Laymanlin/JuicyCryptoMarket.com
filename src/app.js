// Modal functionality
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const getStartedBtn = document.getElementById('getStartedBtn');

// Get all close buttons
const closeBtns = document.getElementsByClassName('close');

// Open login modal
loginBtn.onclick = function() {
    loginModal.style.display = 'block';
}

// Open signup modal
signupBtn.onclick = function() {
    signupModal.style.display = 'block';
}

// Get started button opens signup modal
getStartedBtn.onclick = function() {
    signupModal.style.display = 'block';
}

// Close modals when clicking X
Array.from(closeBtns).forEach(btn => {
    btn.onclick = function() {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target == signupModal) {
        signupModal.style.display = 'none';
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Basic validation (in production, this would connect to a backend)
    if (email && password) {
        alert('Login successful! Welcome to JuicyCryptoMarket.');
        loginModal.style.display = 'none';
        // Here you would typically send credentials to your backend
        console.log('Login attempt:', { email });
    }
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Basic validation (in production, this would connect to a backend)
    if (email && password) {
        alert('Account created successfully! Please verify your email.');
        signupModal.style.display = 'none';
        // Here you would typically send registration data to your backend
        console.log('Registration attempt:', { email });
    }
});

// Simulate real-time price updates
function updatePrices() {
    const priceElements = document.querySelectorAll('.price');
    const changeElements = document.querySelectorAll('.change');
    
    priceElements.forEach((element, index) => {
        // Simulate small price changes
        const currentPrice = parseFloat(element.textContent.replace(/\$/g, '').replace(/,/g, ''));
        const change = (Math.random() - 0.5) * 100; // Random change
        const newPrice = currentPrice + change;
        
        element.textContent = `$${newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    });
    
    changeElements.forEach((element) => {
        // Simulate percentage changes
        const changeValue = (Math.random() - 0.5) * 5; // Random percentage
        const sign = changeValue > 0 ? '+' : '';
        
        element.textContent = `${sign}${changeValue.toFixed(1)}%`;
        
        // Update class based on change
        element.classList.remove('positive', 'negative', 'neutral');
        if (changeValue > 0) {
            element.classList.add('positive');
        } else if (changeValue < 0) {
            element.classList.add('negative');
        } else {
            element.classList.add('neutral');
        }
    });
}

// Update prices every 5 seconds
setInterval(updatePrices, 5000);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Log initialization
console.log('JuicyCryptoMarket initialized');
console.log('Ready for trading!');
