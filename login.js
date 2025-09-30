// Login Page JavaScript
class AuthManager {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.checkExistingSession();
    }

    initializeElements() {
        // Forms
        this.loginForm = document.getElementById('login-form');
        this.signupForm = document.getElementById('signup-form');
        
        // Boxes
        this.loginBox = this.loginForm?.closest('.login-box');
        this.signupBox = document.getElementById('signup-box');
        
        // Buttons
        this.showSignupBtn = document.getElementById('show-signup');
        this.showLoginBtn = document.getElementById('show-login');
        this.demoAccessBtn = document.getElementById('demo-access');
        this.togglePasswordBtns = document.querySelectorAll('.toggle-password');
        
        // Social buttons
        this.googleBtn = document.querySelector('.google-btn');
        this.githubBtn = document.querySelector('.github-btn');
        
        // Password strength
        this.signupPassword = document.getElementById('signup-password');
        this.passwordStrength = document.getElementById('password-strength');
    }

    attachEventListeners() {
        // Form submissions
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (this.signupForm) {
            this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        
        // Toggle between login and signup
        if (this.showSignupBtn) {
            this.showSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignup();
            });
        }
        
        if (this.showLoginBtn) {
            this.showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLogin();
            });
        }
        
        // Demo access
        if (this.demoAccessBtn) {
            this.demoAccessBtn.addEventListener('click', () => this.handleDemoAccess());
        }
        
        // Password toggle
        this.togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', () => this.togglePasswordVisibility(btn));
        });
        
        // Social login
        if (this.googleBtn) {
            this.googleBtn.addEventListener('click', () => this.handleSocialLogin('google'));
        }
        
        if (this.githubBtn) {
            this.githubBtn.addEventListener('click', () => this.handleSocialLogin('github'));
        }
        
        // Password strength checker
        if (this.signupPassword && this.passwordStrength) {
            this.signupPassword.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }
    }

    checkExistingSession() {
        const user = localStorage.getItem('taskManagerUser');
        if (user) {
            // User is already logged in, redirect to app
            window.location.href = 'task-manager.html';
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, accept any email/password
            if (email && password) {
                const user = {
                    email: email,
                    name: email.split('@')[0],
                    loginTime: new Date().toISOString(),
                    rememberMe: rememberMe
                };
                
                localStorage.setItem('taskManagerUser', JSON.stringify(user));
                
                this.showSuccess('Login successful! Redirecting...');
                
                setTimeout(() => {
                    window.location.href = 'task-manager.html';
                }, 1000);
            } else {
                submitBtn.classList.remove('loading');
                this.showError('Please enter valid credentials');
            }
        }, 1000);
    }

    handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const terms = document.getElementById('terms').checked;
        
        if (!terms) {
            this.showError('Please accept the terms and conditions');
            return;
        }
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            const user = {
                name: name,
                email: email,
                loginTime: new Date().toISOString(),
                rememberMe: true
            };
            
            localStorage.setItem('taskManagerUser', JSON.stringify(user));
            
            this.showSuccess('Account created! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'task-manager.html';
            }, 1000);
        }, 1000);
    }

    handleDemoAccess() {
        const demoUser = {
            name: 'Demo User',
            email: 'demo@taskmanager.com',
            loginTime: new Date().toISOString(),
            isDemo: true
        };
        
        localStorage.setItem('taskManagerUser', JSON.stringify(demoUser));
        
        this.showSuccess('Accessing demo mode...');
        
        setTimeout(() => {
            window.location.href = 'task-manager.html';
        }, 800);
    }

    handleSocialLogin(provider) {
        this.showSuccess(`Connecting to ${provider}...`);
        
        // Simulate social login
        setTimeout(() => {
            const user = {
                name: `${provider} User`,
                email: `user@${provider}.com`,
                loginTime: new Date().toISOString(),
                provider: provider
            };
            
            localStorage.setItem('taskManagerUser', JSON.stringify(user));
            window.location.href = 'task-manager.html';
        }, 1500);
    }

    togglePasswordVisibility(btn) {
        const input = btn.previousElementSibling;
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        
        // Toggle icon (you can add different SVG for show/hide)
        btn.style.opacity = type === 'text' ? '1' : '0.6';
    }

    checkPasswordStrength(password) {
        if (!password) {
            this.passwordStrength.className = 'password-strength';
            return;
        }
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        // Set strength class
        if (strength <= 2) {
            this.passwordStrength.className = 'password-strength weak';
        } else if (strength <= 4) {
            this.passwordStrength.className = 'password-strength medium';
        } else {
            this.passwordStrength.className = 'password-strength strong';
        }
    }

    showSignup() {
        if (this.loginBox && this.signupBox) {
            this.loginBox.style.display = 'none';
            this.signupBox.style.display = 'block';
        }
    }

    showLogin() {
        if (this.loginBox && this.signupBox) {
            this.loginBox.style.display = 'block';
            this.signupBox.style.display = 'none';
        }
    }

    showError(message) {
        this.removeMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const activeForm = this.signupBox.style.display === 'none' ? this.loginForm : this.signupForm;
        activeForm.insertBefore(errorDiv, activeForm.firstChild);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }

    showSuccess(message) {
        this.removeMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const activeForm = this.signupBox.style.display === 'none' ? this.loginForm : this.signupForm;
        activeForm.insertBefore(successDiv, activeForm.firstChild);
    }

    removeMessages() {
        document.querySelectorAll('.error-message, .success-message').forEach(msg => msg.remove());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});
