/**
 * Hidden Lakes - Premium Estate Living
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initLotMap();
    initGallery();
    initLightbox();
    initContactForm();
    initScrollAnimations();
});

/* =====================================================
   NAVIGATION
   ===================================================== */

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Scroll effect for navbar
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =====================================================
   LOT MAP - Interactive Site Plan
   ===================================================== */

// Lot data - All 50 lots available. Lot sizes range 0.5 to 1.5 acres.
// NOTE: This data can be synced from a Google Sheet for real-time updates
const lotData = [
    { id: 1, status: 'available', size: '1.2 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Premium lakefront lot with stunning water views and mature trees.' },
    { id: 2, status: 'available', size: '0.8 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Beautiful lot overlooking the main lake with gentle slope.' },
    { id: 3, status: 'available', size: '1.5 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Secluded wooded lot offering maximum privacy.' },
    { id: 4, status: 'available', size: '1.4 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Expansive estate lot with panoramic lake views.' },
    { id: 5, status: 'available', size: '0.9 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Charming lot with mature hardwoods and privacy.' },
    { id: 6, status: 'available', size: '1.1 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Lake view lot with excellent building site.' },
    { id: 7, status: 'available', size: '1.3 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Corner lot with dual lake exposure.' },
    { id: 8, status: 'available', size: '0.7 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Cozy wooded lot perfect for a private retreat.' },
    { id: 9, status: 'available', size: '1.3 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Large lot with direct lake access potential.' },
    { id: 10, status: 'available', size: '1.5 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Premium estate lot with exceptional views.' },
    { id: 11, status: 'available', size: '1.0 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Peaceful setting surrounded by natural beauty.' },
    { id: 12, status: 'available', size: '1.4 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Excellent building site with lake views.' },
    { id: 13, status: 'available', size: '0.6 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Intimate wooded lot with great potential.' },
    { id: 14, status: 'available', size: '1.4 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Sweeping views of both lakes from elevated position.' },
    { id: 15, status: 'available', size: '1.2 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Wooded lot with privacy and natural beauty.' },
    { id: 16, status: 'available', size: '1.5 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'One of the largest lots with incredible lake exposure.' },
    { id: 17, status: 'available', size: '0.9 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Serene setting with natural landscaping.' },
    { id: 18, status: 'available', size: '1.1 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Popular lake view lot in prime location.' },
    { id: 19, status: 'available', size: '1.3 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Premium lot with outstanding views.' },
    { id: 20, status: 'available', size: '1.0 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Well-positioned lot with easy access.' },
    { id: 21, status: 'available', size: '1.3 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Excellent lake views and mature landscaping.' },
    { id: 22, status: 'available', size: '0.8 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Private wooded setting.' },
    { id: 23, status: 'available', size: '1.5 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Prime lake view homesite.' },
    { id: 24, status: 'available', size: '1.2 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Beautiful wooded homesite.' },
    { id: 25, status: 'available', size: '1.5 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Large estate lot with panoramic views.' },
    { id: 26, status: 'available', size: '0.9 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Tranquil wooded homesite.' },
    { id: 27, status: 'available', size: '1.4 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Beautiful lake exposure.' },
    { id: 28, status: 'available', size: '1.1 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Peaceful, private setting.' },
    { id: 29, status: 'available', size: '1.4 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Premium waterfront location.' },
    { id: 30, status: 'available', size: '1.3 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Gorgeous lake views.' },
    { id: 31, status: 'available', size: '0.7 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Charming wooded lot.' },
    { id: 32, status: 'available', size: '1.3 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Exceptional lake views.' },
    { id: 33, status: 'available', size: '1.0 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Natural beauty surrounds.' },
    { id: 34, status: 'available', size: '1.5 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Popular choice for lake lovers.' },
    { id: 35, status: 'available', size: '1.5 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'One of the largest available lots.' },
    { id: 36, status: 'available', size: '1.1 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Peaceful wooded homesite.' },
    { id: 37, status: 'available', size: '1.4 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Great lake exposure.' },
    { id: 38, status: 'available', size: '0.8 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Cozy woodland setting.' },
    { id: 39, status: 'available', size: '1.3 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Premium lakefront.' },
    { id: 40, status: 'available', size: '1.2 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Private and serene.' },
    { id: 41, status: 'available', size: '1.4 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Spectacular views.' },
    { id: 42, status: 'available', size: '1.0 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Natural setting.' },
    { id: 43, status: 'available', size: '1.3 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Lake view excellence.' },
    { id: 44, status: 'available', size: '0.9 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Wooded retreat.' },
    { id: 45, status: 'available', size: '1.4 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Premium location.' },
    { id: 46, status: 'available', size: '1.1 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Peaceful homesite.' },
    { id: 47, status: 'available', size: '1.5 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'The largest lake view lot available.' },
    { id: 48, status: 'available', size: '1.4 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Generous wooded lot.' },
    { id: 49, status: 'available', size: '1.3 acres', view: 'Lake View', price: 'Contact for Pricing', description: 'Outstanding water views.' },
    { id: 50, status: 'available', size: '1.0 acres', view: 'Wooded', price: 'Contact for Pricing', description: 'Natural beauty.' }
];

function initLotMap() {
    const lotDetailPanel = document.getElementById('lotDetailPanel');
    const panelClose = document.getElementById('panelClose');
    const sizeFilter = document.getElementById('lotSizeFilter');
    const viewFilter = document.getElementById('lotViewFilter');
    const sitePlanImage = document.getElementById('sitePlanImage');

    // Update quick stats
    updateLotStats();

    // Close panel
    panelClose.addEventListener('click', closeLotPanel);

    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
        if (lotDetailPanel.classList.contains('active') &&
            !lotDetailPanel.contains(e.target) &&
            !e.target.closest('.lot')) {
            closeLotPanel();
        }
    });

    // Filter handlers
    sizeFilter.addEventListener('change', filterLots);
    viewFilter.addEventListener('change', filterLots);

    // Make the site plan image clickable
    // In a real implementation, you would overlay an SVG with clickable lot polygons
    // For now, we'll create a simple click handler on the image
    sitePlanImage.addEventListener('click', function(e) {
        // This is a simplified implementation
        // In production, you'd map click coordinates to specific lot polygons
        showLotInfo(getRandomAvailableLot());
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lotDetailPanel.classList.contains('active')) {
            closeLotPanel();
        }
    });
}

function showLotInfo(lotId) {
    const lot = lotData.find(l => l.id === lotId);
    if (!lot) return;

    const panel = document.getElementById('lotDetailPanel');
    const lotNumber = document.getElementById('lotNumber');
    const lotStatus = document.getElementById('lotStatus');
    const lotSize = document.getElementById('lotSize');
    const lotView = document.getElementById('lotView');
    const lotPrice = document.getElementById('lotPrice');
    const lotDescription = document.getElementById('lotDescription');
    const inquiryBtn = document.querySelector('.lot-inquiry-btn');

    lotNumber.textContent = lot.id;
    lotStatus.textContent = lot.status.charAt(0).toUpperCase() + lot.status.slice(1);
    lotStatus.className = 'lot-detail-status ' + lot.status;
    lotSize.textContent = lot.size;
    lotView.textContent = lot.view;
    lotPrice.textContent = lot.price;
    lotDescription.textContent = lot.description;

    // Update inquiry button
    inquiryBtn.setAttribute('data-lot', lot.id);
    inquiryBtn.addEventListener('click', function() {
        document.getElementById('lotInterest').value = 'Lot ' + lot.id;
        document.getElementById('interest').value = 'lot';
    });

    panel.classList.add('active');
}

function closeLotPanel() {
    document.getElementById('lotDetailPanel').classList.remove('active');
}

function filterLots() {
    const sizeFilter = document.getElementById('lotSizeFilter').value;
    const viewFilter = document.getElementById('lotViewFilter').value;

    // This would filter the visual lot display
    // Implementation depends on how lots are rendered (SVG overlay, etc.)
    console.log('Filtering lots:', { size: sizeFilter, view: viewFilter });
}

function updateLotStats() {
    const availableCount = document.getElementById('availableCount');
    const lakeViewCount = document.getElementById('lakeViewCount');

    const available = lotData.filter(l => l.status === 'available').length;
    const lakeView = lotData.filter(l => l.view === 'Lake View' && l.status === 'available').length;

    if (availableCount) availableCount.textContent = available;
    if (lakeViewCount) lakeViewCount.textContent = lakeView;
}

function getRandomAvailableLot() {
    const available = lotData.filter(l => l.status === 'available');
    return available[Math.floor(Math.random() * available.length)].id;
}

/* =====================================================
   GALLERY
   ===================================================== */

function initGallery() {
    const tabs = document.querySelectorAll('.gallery-tab');
    const panels = document.querySelectorAll('.gallery-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update active panel
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab + '-panel') {
                    panel.classList.add('active');
                }
            });
        });
    });

    // Gallery item click for lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-item-overlay span');
            openLightbox(img.src, caption ? caption.textContent : '');
        });
    });
}

/* =====================================================
   LIGHTBOX
   ===================================================== */

let currentLightboxIndex = 0;
const galleryImages = [];

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // Collect all gallery images
    document.querySelectorAll('.gallery-item img').forEach((img, index) => {
        const caption = img.closest('.gallery-item').querySelector('.gallery-item-overlay span');
        galleryImages.push({
            src: img.src,
            caption: caption ? caption.textContent : ''
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
}

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');

    // Find current index
    currentLightboxIndex = galleryImages.findIndex(img => img.src === src);

    lightboxImage.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;

    if (currentLightboxIndex < 0) {
        currentLightboxIndex = galleryImages.length - 1;
    } else if (currentLightboxIndex >= galleryImages.length) {
        currentLightboxIndex = 0;
    }

    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');

    lightboxImage.src = galleryImages[currentLightboxIndex].src;
    lightboxCaption.textContent = galleryImages[currentLightboxIndex].caption;
}

/* =====================================================
   CONTACT FORM
   ===================================================== */

function initContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(e) {
        // Form will submit to Formspree (or other service)
        // Add validation here if needed

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;

        if (!firstName || !lastName || !email) {
            e.preventDefault();
            alert('Please fill in all required fields.');
            return;
        }

        // Optional: Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
    });

    // Pre-fill lot interest from lot panel inquiry button
    document.querySelectorAll('.lot-inquiry-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const lotId = this.getAttribute('data-lot');
            if (lotId) {
                document.getElementById('lotInterest').value = 'Lot ' + lotId;
                document.getElementById('interest').value = 'lot';
            }
            closeLotPanel();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */

function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.feature-card, .location-card, .section-header').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero (optional, subtle)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });
}

/* =====================================================
   UTILITY FUNCTIONS
   ===================================================== */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
