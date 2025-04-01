// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initScrollAnimations();
    initBackToTop();
    initSmoothScroll();
    initTextReveal();
    initProductImageHover();
    initScrollProgressIndicator();
    
    // Optional: Add loading spinner for slow connections
    showLoadingState();
});

// Scroll animations handler
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);
    
    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });
}

// Back to top button functionality
function initBackToTop() {
    // Add back to top button to DOM
    const backToTopButton = document.createElement('a');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.classList.add('back-to-top');
    backToTopButton.setAttribute('href', '#');
    document.body.appendChild(backToTopButton);
    
    // Show button after scrolling down
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top smoothly when clicked
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scroll for all anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not(.back-to-top)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Character-by-character text reveal animation
function initTextReveal() {
    const textElements = document.querySelectorAll('.text-reveal');
    
    textElements.forEach(element => {
        // Split text into characters with spans
        let text = element.textContent;
        let html = '';
        
        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                html += ' ';
            } else {
                html += `<span class="char" style="transition-delay: ${i * 0.03}s">${text[i]}</span>`;
            }
        }
        
        element.innerHTML = html;
    });
    
    // Observe elements to trigger animation
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    textElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Enhanced product image hover effects
function initProductImageHover() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const img = card.querySelector('img');
        if (!img) return;
        
        card.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.08)';
            img.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        card.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

// Show loading state for slow connections
function showLoadingState() {
    // Only show loading spinner if page takes more than 300ms to load
    const loadingTimeout = setTimeout(() => {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.style.position = 'fixed';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100%';
        loadingOverlay.style.height = '100%';
        loadingOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.zIndex = '9999';
        
        const spinner = document.createElement('div');
        spinner.classList.add('loading-spinner');
        loadingOverlay.appendChild(spinner);
        
        document.body.appendChild(loadingOverlay);
    }, 300);
    
    // Remove loading overlay once page is fully loaded
    window.addEventListener('load', () => {
        clearTimeout(loadingTimeout);
        const existingOverlay = document.querySelector('.loading-spinner')?.parentElement;
        if (existingOverlay) {
            existingOverlay.style.opacity = '0';
            existingOverlay.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                existingOverlay.remove();
            }, 500);
        }
    });
}

// Add parallax scroll effect to sections with 'parallax' class
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.3;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

// Enhancement for product card transitions when in view
function enhanceProductCardAnimations() {
    const productGrids = document.querySelectorAll('.product-grid');
    
    productGrids.forEach(grid => {
        grid.classList.add('stagger-fade-in');
        
        // Ensure children have proper fade styles
        const cards = grid.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.style.transitionProperty = 'opacity, transform';
            card.style.transitionDuration = '0.6s, 0.6s';
            card.style.transitionTimingFunction = 'ease-out, ease-out';
        });
    });
}

// Scroll progress indicator
function initScrollProgressIndicator() {
    // Create the progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Update progress bar width on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // Calculate scroll percentage
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        // Update progress bar width
        progressBar.style.width = `${scrollPercent}%`;
    });
} 