document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding tab pane
            const tabID = button.getAttribute('data-tab');
            document.getElementById(tabID).classList.add('active');
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Basic validation
            if (!email || !password) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For now, we'll just simulate a successful login
            
            // Create login data object (would be sent to server)
            const loginData = {
                email: email,
                password: password,
                rememberMe: rememberMe
            };
            
            console.log('Login data:', loginData);
            
            // Simulate successful login
            simulateLogin(email);
        });
    }
    
    // Registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const termsAgree = document.getElementById('termsAgree').checked;
            
            // Basic validation
            if (!name || !email || !password || !confirmPassword) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Password validation
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters long.', 'error');
                return;
            }
            
            // Password match validation
            if (password !== confirmPassword) {
                showNotification('Passwords do not match.', 'error');
                return;
            }
            
            // Terms agreement validation
            if (!termsAgree) {
                showNotification('You must agree to the Terms & Conditions.', 'error');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For now, we'll just simulate a successful registration
            
            // Create registration data object (would be sent to server)
            const registrationData = {
                name: name,
                email: email,
                password: password
            };
            
            console.log('Registration data:', registrationData);
            
            // Simulate successful registration
            showNotification('Registration successful! You can now log in.');
            
            // Reset form
            registerForm.reset();
            
            // Switch to login tab
            tabButtons[0].click();
        });
    }
});

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simulate Login
function simulateLogin(email) {
    // In a real application, this would be handled by the server
    // Here we're just faking a successful login
    
    // Show success message
    showNotification('Login successful! Welcome back.');
    
    // In a real application, you would now:
    // 1. Receive authentication token from server
    // 2. Store token in localStorage/sessionStorage
    // 3. Redirect to dashboard or homepage
    
    // For demo purposes, we'll just redirect to the homepage after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Show Notification
function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('notification');
        document.body.appendChild(notification);
    }
    
    // Set notification type
    notification.className = 'notification'; // Reset classes
    if (type === 'error') {
        notification.classList.add('notification-error');
    }
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
} 