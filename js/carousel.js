// Modern Image Carousel Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page with the hero carousel
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Convert hero section to a carousel
    initHeroCarousel();
});

function initHeroCarousel() {
    const hero = document.querySelector('.hero');
    const container = hero.querySelector('.container');
    
    // Create carousel wrapper
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'carousel-wrapper';
    
    // Get existing hero content
    const heroContent = hero.querySelector('.hero-content');
    
    // Create carousel slides container
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'carousel-slides';
    
    // Define carousel slides
    const slides = [
        {
            image: 'images/Premium Basketall.webp',
            title: 'Elevate Your Game with Premium Sports Equipment',
            description: 'Discover top-quality gear designed for peak performance. PKS Sports equipment helps you train harder, play better, and achieve your athletic goals.',
            btnLink: 'products.html',
            btnText: 'Explore Collection'
        },
        {
            image: 'images/Tennis Racket Pro.jpg',
            title: 'Precision Engineered for Champions',
            description: 'Experience the perfect balance of power and control with our professional-grade equipment.',
            btnLink: 'categories.html#tennis',
            btnText: 'Shop Tennis'
        },
        {
            image: 'images/Football.jpg',
            title: 'Join the Winning Team',
            description: 'From amateur enthusiasts to professional athletes, our equipment is designed for success at every level.',
            btnLink: 'categories.html#football',
            btnText: 'Shop Football'
        }
    ];
    
    // Create slides
    slides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        slideElement.style.backgroundImage = `url('${slide.image}')`;
        
        const slideContent = document.createElement('div');
        slideContent.className = 'slide-content';
        
        slideContent.innerHTML = `
            <h2 class="text-reveal">${slide.title}</h2>
            <p class="fade-in">${slide.description}</p>
            <a href="${slide.btnLink}" class="btn fade-in">${slide.btnText}</a>
        `;
        
        slideElement.appendChild(slideContent);
        slidesContainer.appendChild(slideElement);
    });
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dotsContainer.appendChild(dot);
    });
    
    // Create navigation arrows
    const prevArrow = document.createElement('button');
    prevArrow.className = 'carousel-arrow prev';
    prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextArrow = document.createElement('button');
    nextArrow.className = 'carousel-arrow next';
    nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Assemble carousel
    carouselWrapper.appendChild(slidesContainer);
    carouselWrapper.appendChild(dotsContainer);
    carouselWrapper.appendChild(prevArrow);
    carouselWrapper.appendChild(nextArrow);
    
    // Replace hero content with carousel
    container.innerHTML = '';
    container.appendChild(carouselWrapper);
    
    // Initialize carousel functionality
    let currentSlide = 0;
    let slideInterval;
    const slideDelay = 5000;
    
    // Handle carousel navigation
    function goToSlide(index) {
        // Update slides
        const slides = document.querySelectorAll('.carousel-slide');
        slides.forEach(slide => slide.classList.remove('active'));
        
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        
        // Update dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
        
        // Reset text animation classes
        const textElements = slides[index].querySelectorAll('.text-reveal, .fade-in');
        textElements.forEach(element => {
            element.classList.remove('appear');
            void element.offsetWidth; // Trigger reflow
            element.classList.add('appear');
        });
        
        // Restart auto-rotation
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDelay);
    }
    
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        goToSlide(nextIndex);
    }
    
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        goToSlide(prevIndex);
    }
    
    // Event listeners
    nextArrow.addEventListener('click', () => {
        nextSlide();
    });
    
    prevArrow.addEventListener('click', () => {
        prevSlide();
    });
    
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('carousel-dot')) {
            const index = parseInt(e.target.dataset.index);
            goToSlide(index);
        }
    });
    
    // Start auto-rotation
    slideInterval = setInterval(nextSlide, slideDelay);
    
    // Pause on hover
    carouselWrapper.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // Resume on mouse leave
    carouselWrapper.addEventListener('mouseleave', () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDelay);
    });
    
    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide(); // Swipe left
        } else if (touchEndX > touchStartX + 50) {
            prevSlide(); // Swipe right
        }
    }
    
    // Initialize animations for first slide
    setTimeout(() => {
        const activeSlide = document.querySelector('.carousel-slide.active');
        if (activeSlide) {
            const textElements = activeSlide.querySelectorAll('.text-reveal, .fade-in');
            textElements.forEach(element => {
                element.classList.add('appear');
            });
        }
    }, 500);
} 