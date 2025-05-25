// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const notification = document.getElementById('notification');

// Form Validation
class FormValidator {
    constructor(form) {
        this.form = form;
        this.errors = [];
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    validatePassword(password) {
        return password.length >= 6;
    }

    showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = document.createElement('small');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error-color)';
        errorElement.style.display = 'block';
        errorElement.style.marginTop = '5px';
        errorElement.style.fontSize = '0.8rem';
        
        // Remove existing error if any
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            formGroup.removeChild(existingError);
        }
        
        formGroup.appendChild(errorElement);
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }

    clearError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
    }

    validate() {
        this.errors = [];
        
        // Email validation
        if (!this.validateEmail(emailInput.value)) {
            this.errors.push('Please enter a valid email address');
            this.showError(emailInput, 'Please enter a valid email address');
        } else {
            this.clearError(emailInput);
        }
        
        // Password validation
        if (!this.validatePassword(passwordInput.value)) {
            this.errors.push('Password must be at least 6 characters');
            this.showError(passwordInput, 'Password must be at least 6 characters');
        } else {
            this.clearError(passwordInput);
        }
        
        return this.errors.length === 0;
    }
}

// Auth Service
class AuthService {
    constructor() {
        this.auth = firebase.auth();
    }

    async login(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    async sendPasswordResetEmail(email) {
        try {
            await this.auth.sendPasswordResetEmail(email);
            return true;
        } catch (error) {
            throw error;
        }
    }
}

// Notification Service
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Event Listeners
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const validator = new FormValidator(loginForm);
    if (!validator.validate()) return;
    
    const authService = new AuthService();
    
    try {
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        await authService.login(emailInput.value, passwordInput.value);
        
        // Redirect to dashboard after successful login
        showNotification('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } catch (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
        
        let errorMessage = 'Login failed. Please try again.';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No user found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Account temporarily locked.';
                break;
        }
        
        showNotification(errorMessage, 'error');
    }
});

// Initialize Firebase
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            window.location.href = 'dashboard.html';
        }
    });
});