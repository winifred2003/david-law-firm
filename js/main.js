// ==========================================
// DOM LOADED
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initMobileMenu();
    initSmoothScroll();
    initFormSubmission(); // Sends emails to Davidattorney2001@gmail.com
    initScrollEffects();
    initStickyHeader();
});

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('mainNav');
    if (!mobileMenuToggle || !navMenu) return;
    
    const navMenuList = navMenu.querySelector('.nav-menu');
    
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navMenuList.classList.toggle('active');
        document.body.style.overflow = navMenuList.classList.contains('active') ? 'hidden' : '';
    });
    
    navMenuList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenuList.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!navMenuList.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenuList.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                window.scrollTo({
                    top: target.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// FORM SUBMISSION TO EMAIL
// ==========================================
function initFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        company: document.getElementById('company'),
        service: document.getElementById('service'),
        message: document.getElementById('message'),
        privacy: document.getElementById('privacy')
    };
    
    const errorFields = {
        name: document.getElementById('nameError'),
        email: document.getElementById('emailError'),
        service: document.getElementById('serviceError'),
        message: document.getElementById('messageError'),
        privacy: document.getElementById('privacyError')
    };
    
    // Validation functions
    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        if (!field) return;
        field.addEventListener('blur', () => validateField(fieldName));
        field.addEventListener('input', () => clearError(fieldName));
    });
    
    // Form submit handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        Object.keys(formFields).forEach(fieldName => {
            if (!validateField(fieldName)) isValid = false;
        });
        
        if (isValid) {
            submitButton.textContent = 'Sending Message...';
            submitButton.disabled = true;
            
            // Send via FormSubmit.co to Davidattorney2001@gmail.com
            fetch('https://formsubmit.co/ajax/Davidattorney2001@gmail.com', {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showFormStatus('success', 'Thank you! Your message has been sent. We will respond within 24 hours.');
                    contactForm.reset();
                } else {
                    showFormStatus('error', 'Failed to send message. Please try again or call +1 (313) 213-8960.');
                }
            })
            .catch(error => {
                showFormStatus('error', 'Network error. Please call us directly: +1 (313) 213-8960.');
                console.error('FormSubmit error:', error);
            })
            .finally(() => {
                setTimeout(() => {
                    submitButton.textContent = 'Send Message';
                    submitButton.disabled = false;
                    hideFormStatus();
                }, 4000);
            });
        } else {
            showFormStatus('error', 'Please correct the errors above.');
        }
    });
    
    function validateField(fieldName) {
        const field = formFields[fieldName];
        const errorField = errorFields[fieldName];
        if (!field || !errorField) return true;
        
        const value = field.value.trim();
        clearError(fieldName);
        
        switch(fieldName) {
            case 'name':
                if (value.length < 2) {
                    showError(fieldName, 'Name must be at least 2 characters long');
                    return false;
                }
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    showError(fieldName, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'service':
                if (!value) {
                    showError(fieldName, 'Please select a service');
                    return false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    showError(fieldName, 'Message must be at least 10 characters long');
                    return false;
                }
                break;
            case 'privacy':
                if (!field.checked) {
                    showError(fieldName, 'You must agree to the privacy policy');
                    return false;
                }
                break;
        }
        return true;
    }
    
    function showError(fieldName, message) {
        const errorField = errorFields[fieldName];
        if (errorField) {
            errorField.textContent = message;
            formFields[fieldName].classList.add('error');
        }
    }
    
    function clearError(fieldName) {
        const errorField = errorFields[fieldName];
        if (errorField) {
            errorField.textContent = '';
            formFields[fieldName].classList.remove('error');
        }
    }
    
    function showFormStatus(type, message) {
        const status = document.getElementById('formStatus');
        if (status) {
            status.className = `form-status ${type}`;
            status.textContent = message;
            status.style.display = 'block';
        }
    }
    
    function hideFormStatus() {
        const status = document.getElementById('formStatus');
        if (status) status.style.display = 'none';
    }
}

// ==========================================
// SCROLL EFFECTS & HEADER
// ==========================================
function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animate-in');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.area-card, .benefit-item, .award-card, .timeline-item, .service-features, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    const style = document.createElement('style');
    style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
}

function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        header.style.boxShadow = window.pageYOffset > 100 
            ? '0 4px 20px rgba(27, 54, 93, 0.15)' 
            : '0 2px 10px rgba(27, 54, 93, 0.1)';
    });
}