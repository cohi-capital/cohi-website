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

// ============================================================================
// CONFIGURATION - Update these with your credentials
// ============================================================================

// Google Apps Script Web App URL (for Google Drive/Sheets integration)
// Get this URL after setting up your Google Apps Script (see SETUP_INSTRUCTIONS.md)
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6xTgNPpejP6x955tdCxHyoU6QrDWkX46ubhhZPL7t1fFB3Ui_jTOojVPl30wWix4x/exec';

// Reddit Conversion API Configuration
const REDDIT_PIXEL_ID = 'a2_i2p2iw6fy3ri'; // Your Reddit Pixel ID
const REDDIT_API_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjo0OTE5OTY0MjIzLjQ5OTc5NCwiaWF0IjoxNzY0MjA0MjIzLjQ5OTc5NCwianRpIjoiS3Z5WDBGSnFWNllDdFlLRlQxZWpxbTVZLXRxeU5BIiwiY2lkIjoiMVExRU96VFBXbll2ZXJocHR2Z1dzUSIsImxpZCI6InQyXzIydGJ1azRsZGYiLCJhaWQiOiJ0Ml8yMnRidWs0bGRmIiwiYXQiOjUsImxjYSI6MTc2NDIwNDIyMTg5MSwic2NwIjoiZUp5S1ZrcE1LVTdPenl0TExTck96TThyVm9vRkJBQUFfXzlCRmdidSIsImZsbyI6MTAsImxsIjp0cnVlfQ.rdVm0Ao4HG9X9f9kbLmJbkkloHwN1A60obuukByeN1MqHbcn_dFRDNGPGZC47-Pm-baWlmfe5rIm2MAdpvNom8orQQDIt_MnYhUOVKMcTXhb141qYgqza1U86oF4dMHDJtnTt5KO7LphQPBpBWDsgpQgBZ19IsIDpr09v3yEHDTuolkWSjay1FvskBGitRc1J6220YEhI06uP4rW44apUtWVX4trDwf5DN8otNG7ZxJRJ0sfCu6w7UGKUMkjQEbOWlKnJz2stvbE3b0RMASJ4o-pEI1TAgjpT1dMJf8t3PEcSxzq1EpVP2iITTNSwEek32uM-mQl7h3pLR1uAUpcVA'; // Reddit Conversion API access token
const REDDIT_API_ENDPOINT = 'https://ads-api.reddit.com/api/v3/pixels/a2_i2p2iw6fy3ri/conversion_events';
const REDDIT_CUSTOM_EVENT_NAME = 'Contact Form Submission'; // Custom event name (must match what you set up in Reddit Ads)

// Optional: Keep Formspree as backup (set to null to disable)
// Set to null to use only Google Sheets for form recording
const FORMSPREE_ENDPOINT = null; // Disabled - using Google Sheets instead

// ============================================================================
// Contact form handling
// ============================================================================
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Get form values
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone') || '';
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
    
    // Prepare form data
    const formSubmission = {
        name: name,
        email: email,
        phone: phone,
        message: message,
        timestamp: new Date().toISOString(),
        source: 'website_contact_form'
    };
    
    const submissionPromises = [];
    let hasError = false;
    let errorMessage = '';
    
    try {
        // 1. Submit to Google Apps Script (Google Drive/Sheets)
        if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            submissionPromises.push(
                fetch(GOOGLE_APPS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Required for Google Apps Script (can't read response)
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formSubmission)
                }).then(() => {
                    console.log('Form data sent to Google Sheets:', formSubmission);
                }).catch(err => {
                    console.error('Google Apps Script submission failed:', err);
                    // Don't fail the form if Google submission fails
                })
            );
        } else {
            console.warn('Google Apps Script URL not configured!');
        }
        
        // 2. Reddit Conversion Tracking
        // Note: Conversion API requires server-side proxy due to CORS restrictions
        // Pixel tracking (client-side) is working and sufficient for Reddit ads optimization
        // The pixel tracking happens in the success block below via rdt('track', 'Lead')
        
        // Conversion API call is disabled due to CORS - would need server-side proxy
        // Uncomment below if you set up a server-side proxy endpoint:
        /*
        if (REDDIT_PIXEL_ID && REDDIT_PIXEL_ID !== 'YOUR_REDDIT_PIXEL_ID_HERE' && 
            REDDIT_API_TOKEN && REDDIT_API_TOKEN !== 'YOUR_REDDIT_API_TOKEN_HERE') {
            submissionPromises.push(
                sendRedditConversion(formSubmission).catch(err => {
                    console.warn('Reddit Conversion API failed (requires server-side proxy):', err);
                })
            );
        }
        */
        
        // 3. Optional: Submit to Formspree as backup
        if (FORMSPREE_ENDPOINT) {
            const formspreePayload = new FormData();
            formspreePayload.append('name', name);
            formspreePayload.append('email', email);
            if (phone) {
                formspreePayload.append('phone', phone);
            }
            formspreePayload.append('message', message);
            
            submissionPromises.push(
                fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formspreePayload
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Formspree submission failed');
                    }
                    return response.json();
                }).catch(err => {
                    console.warn('Formspree submission failed:', err);
                    // Don't fail the form if Formspree fails
                })
            );
        }
        
        // Wait for all submissions (at least one should succeed)
        await Promise.allSettled(submissionPromises);
        
        // If we have at least Google Apps Script or Formspree configured, show success
        const hasConfiguredEndpoint = 
            (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') ||
            FORMSPREE_ENDPOINT;
        
        if (hasConfiguredEndpoint) {
            // Track Reddit conversion via Pixel (client-side)
            if (typeof rdt !== 'undefined') {
                try {
                    // Track as 'Lead' conversion event via pixel
                    rdt('track', 'Lead', {
                        conversionId: 'contact_form_submission_' + Date.now()
                    });
                    console.log('✅ Reddit Pixel conversion tracked: Lead');
                } catch (err) {
                    console.warn('Reddit pixel conversion tracking error:', err);
                }
            }
            
            // Also send via Conversion API (server-side tracking)
            // This is already queued in submissionPromises above
            console.log('✅ Form submitted successfully - Conversion API call should be in progress');
            
            showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
        } else {
            throw new Error('No form submission endpoints configured. Please set up Google Apps Script or Formspree.');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        errorMessage = error.message && error.message !== 'Failed to fetch'
            ? error.message
            : 'Something went wrong. Please check your connection and try again.';
        showMessage(errorMessage, 'error');
        hasError = true;
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
    }
});

// ============================================================================
// Reddit Conversion API Helper Function
// ============================================================================
async function sendRedditConversion(formData) {
    if (!REDDIT_PIXEL_ID || !REDDIT_API_TOKEN) {
        return;
    }
    
    // Prepare Reddit conversion event according to Reddit's API format (Custom Event)
    const redditEvent = {
        data: {
            events: [
                {
                    event_at: Date.now(), // Unix epoch timestamp in milliseconds
                    action_source: "website", // Source of conversion
                    type: {
                        tracking_type: "CUSTOM", // Custom conversion event
                        custom_event_name: REDDIT_CUSTOM_EVENT_NAME // Event name (must match what you set up in Reddit Ads)
                    }
                }
            ]
        }
    };
    
    console.log('Reddit Conversion API request:', {
        endpoint: REDDIT_API_ENDPOINT,
        event: redditEvent
    });
    
    try {
        const response = await fetch(REDDIT_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${REDDIT_API_TOKEN}`
            },
            body: JSON.stringify(redditEvent)
        });
        
        console.log('Reddit API response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Reddit API error response:', errorText);
            throw new Error(`Reddit API error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Reddit Conversion API success:', result);
        return result;
    } catch (error) {
        console.error('Reddit conversion API error:', error);
        throw error;
    }
}

// Helper: Get user's IP address (client-side approximation)
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.warn('Could not fetch IP address:', error);
        return null;
    }
}

// Helper: Hash email for privacy (simple hash, for production use SHA-256)
function hashEmail(email) {
    // Simple hash function - in production, use crypto.subtle.digest for SHA-256
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
}

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

// Add scroll effect to header (if header exists)
let lastScroll = 0;
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}
