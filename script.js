// Logo handling - SVG is preferred, with fallbacks
(function() {
    const logoExtensions = ['svg', 'png', 'jpg', 'jpeg'];
    let currentAttempt = 0;
    
    function tryNextLogo() {
        const logoImg = document.getElementById('logo-image');
        const logoText = document.getElementById('logo-text');
        
        if (!logoImg) return;
        
        if (currentAttempt < logoExtensions.length) {
            const extension = logoExtensions[currentAttempt];
            logoImg.src = `logo.${extension}`;
            currentAttempt++;
        } else {
            // All attempts failed, show text
            logoImg.style.display = 'none';
            if (logoText) {
                logoText.style.display = 'block';
            }
        }
    }
    
    // Set up error handler
    window.addEventListener('DOMContentLoaded', function() {
        const logoImg = document.getElementById('logo-image');
        if (logoImg) {
            // Logo is already set in HTML, just need error handler
            logoImg.onerror = tryNextLogo;
            // If src is empty or image fails, try fallbacks
            if (!logoImg.src || logoImg.complete && logoImg.naturalHeight === 0) {
                tryNextLogo();
            }
        }
    });
})();

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Get form values
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    // Simple validation (phone is optional)
    if (!name || !email || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Disable submit button
    submitButton.disabled = true;
    const originalButtonHTML = submitButton.innerHTML;
    submitButton.innerHTML = '<span>Sending...</span>';
    
    try {
        // Submit to Formspree with AJAX
        // Using Accept: application/json header tells Formspree to return JSON instead of redirecting
        const payload = new FormData();
        payload.append('name', name);
        payload.append('email', email);
        if (phone) {
            payload.append('phone', phone);
        }
        payload.append('message', message);
        
        const response = await fetch('https://formspree.io/f/myzlywnw', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: payload
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
            showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
        } else {
            const errorMsg = responseData.error || 
                           (responseData.errors && responseData.errors.map(err => err.message).join(', ')) || 
                           'Form submission failed. Please try again.';
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        const fallbackMessage = error.message && error.message !== 'Failed to fetch'
            ? error.message
            : 'Something went wrong. Please check your connection and try again.';
        showMessage(fallbackMessage, 'error');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
    }
});

function showMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    
    // Scroll to message smoothly
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 5 seconds for success, keep error visible
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.className = 'form-message';
        }, 5000);
    }
}

// Track if we're handling a click vs external navigation
let isInternalClick = false;

// Smooth scroll for anchor links (when clicking buttons on the page)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        isInternalClick = true;
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Update URL hash after smooth scroll starts
            window.history.pushState(null, null, this.getAttribute('href'));
        }
        // Reset flag after a short delay
        setTimeout(() => { isInternalClick = false; }, 1000);
    });
});

// Note: Initial hash navigation is handled by inline script in <head>
// This ensures it runs before Chrome applies default smooth scroll behavior

// Handle hash changes (browser back/forward, or direct URL changes)
// Only use instant scroll if it wasn't triggered by an internal click
window.addEventListener('hashchange', function() {
    if (!isInternalClick) {
        const hash = window.location.hash;
        const target = document.querySelector(hash);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            // Jump instantly without animation for external hash changes
            window.scrollTo({
                top: offsetPosition,
                behavior: 'auto'
            });
        }
    }
});

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});
