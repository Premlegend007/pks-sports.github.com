// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const header = document.querySelector('header');
    if (header) {
        setupMobileMenu();
    }

    // Product Filters
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    if (priceSlider && priceValue) {
        setupPriceSlider();
    }

    // Add to Cart Buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    if (addToCartButtons.length > 0) {
        setupAddToCartButtons();
    }

    // Product Details Buttons
    const detailButtons = document.querySelectorAll('.btn-details');
    if (detailButtons.length > 0) {
        setupProductDetails();
    }

    // Filter Buttons
    const filterBtn = document.querySelector('.btn-filter');
    const clearBtn = document.querySelector('.btn-clear');
    if (filterBtn && clearBtn) {
        setupFilterButtons();
    }

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        setupNewsletterForm();
    }

    // Product Sort
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        setupProductSort();
    }
});

// Setup Mobile Menu
function setupMobileMenu() {
    // Check if we need to create a mobile menu button (only for smaller screens)
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Insert before nav in header
    document.querySelector('header .container').insertBefore(mobileMenuBtn, nav);
    
    // Add the mobile class to the nav for styling purposes
    nav.classList.add('mobile-nav');
    
    // Toggle mobile menu on click
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.innerHTML = nav.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !mobileMenuBtn.contains(event.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Setup Price Slider
function setupPriceSlider() {
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    
    // Update price value display
    priceSlider.addEventListener('input', function() {
        // Format with thousands separator
        let formattedPrice = parseInt(this.value).toLocaleString('en-IN');
        priceValue.textContent = '₹' + formattedPrice;
    });
}

// Setup Add to Cart Buttons
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product-card');
            const productName = product.querySelector('h3').textContent;
            const productPrice = product.querySelector('.price').textContent;
            const productImage = product.querySelector('img').src;
            
            // Add product to cart (localStorage for now)
            addProductToCart(productName, productPrice, productImage);
            
            // Show notification
            showNotification(`${productName} added to cart!`);
            
            // Update cart count
            updateCartCount();
        });
    });
}

// Add Product to Cart
function addProductToCart(name, price, image) {
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.name === name);
    
    if (existingProductIndex !== -1) {
        // Increment quantity if product already exists
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new product to cart
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    // Add notification to the DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update Cart Count
function updateCartCount() {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate total quantity
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart count display
    const cartIcon = document.querySelector('.header-icons a[href="cart.html"] i');
    
    if (cartIcon) {
        // Check if count element already exists
        let countElement = cartIcon.nextElementSibling;
        
        if (!countElement || !countElement.classList.contains('cart-count')) {
            // Create count element if it doesn't exist
            countElement = document.createElement('span');
            countElement.classList.add('cart-count');
            cartIcon.parentNode.appendChild(countElement);
        }
        
        // Update count
        countElement.textContent = totalItems;
        
        // Show/hide count based on total
        if (totalItems > 0) {
            countElement.style.display = 'inline-flex';
        } else {
            countElement.style.display = 'none';
        }
    }
}

// Setup Filter Buttons
function setupFilterButtons() {
    const filterBtn = document.querySelector('.btn-filter');
    const clearBtn = document.querySelector('.btn-clear');
    
    // Apply filters button
    filterBtn.addEventListener('click', function() {
        // Get selected categories
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(input => input.value);
        
        // Get selected brands
        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(input => input.value);
        
        // Get selected rating
        const selectedRating = document.querySelector('input[name="rating"]:checked')?.value;
        
        // Get price range
        const maxPrice = document.getElementById('price-slider').value;
        
        // Filter products
        filterProducts(selectedCategories, selectedBrands, selectedRating, maxPrice);
    });
    
    // Clear filters button
    clearBtn.addEventListener('click', function() {
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.checked = false;
        });
        
        // Uncheck all radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        
        // Reset price slider
        const priceSlider = document.getElementById('price-slider');
        if (priceSlider) {
            priceSlider.value = priceSlider.max;
            // Format with thousands separator for INR
            let formattedPrice = parseInt(priceSlider.max).toLocaleString('en-IN');
            document.getElementById('price-value').textContent = '₹' + formattedPrice;
        }
        
        // Show all products
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            product.style.display = 'block';
        });
        
        // Update product count
        updateProductCount(products.length);
    });
}

// Filter Products
function filterProducts(categories, brands, rating, maxPrice) {
    const products = document.querySelectorAll('.product-card');
    let visibleProducts = 0;
    
    products.forEach(product => {
        // Get product category
        const productCategory = product.querySelector('.product-category').textContent.toLowerCase();
        
        // Get product brand (add data-brand attribute to product cards)
        const productBrand = product.getAttribute('data-brand') || '';
        
        // Get product rating
        const productRatingStars = product.querySelectorAll('.product-rating i.fas.fa-star, .product-rating i.fas.fa-star-half-alt').length;
        
        // Get product price
        const productPrice = parseFloat(product.querySelector('.price').textContent.replace('₹', '').replace(',', ''));
        
        // Check if product matches filters
        const matchesCategory = categories.length === 0 || categories.includes(productCategory);
        const matchesBrand = brands.length === 0 || brands.includes(productBrand);
        const matchesRating = !rating || productRatingStars >= parseInt(rating);
        const matchesPrice = productPrice <= parseFloat(maxPrice);
        
        // Show/hide product based on filters
        if (matchesCategory && matchesBrand && matchesRating && matchesPrice) {
            product.style.display = 'block';
            visibleProducts++;
        } else {
            product.style.display = 'none';
        }
    });
    
    // Update product count
    updateProductCount(visibleProducts);
}

// Update Product Count
function updateProductCount(count) {
    const productsCount = document.querySelector('.products-count span:first-child');
    if (productsCount) {
        productsCount.textContent = count;
    }
}

// Setup Newsletter Form
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email) {
            // Here you would normally send this to your server
            // For now, we'll just show a success message
            showNotification('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        }
    });
}

// Setup Product Sort
function setupProductSort() {
    const sortSelect = document.getElementById('sort-by');
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const productGrid = document.querySelector('.product-grid');
        const products = Array.from(productGrid.querySelectorAll('.product-card'));
        
        // Sort products based on selected option
        products.sort((a, b) => {
            if (sortValue === 'price-low') {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('₹', '').replace(',', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('₹', '').replace(',', ''));
                return priceA - priceB;
            } else if (sortValue === 'price-high') {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('₹', '').replace(',', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('₹', '').replace(',', ''));
                return priceB - priceA;
            } else if (sortValue === 'rating') {
                const ratingA = a.querySelectorAll('.fas.fa-star, .fas.fa-star-half-alt').length;
                const ratingB = b.querySelectorAll('.fas.fa-star, .fas.fa-star-half-alt').length;
                return ratingB - ratingA;
            }
            // Default to newest (no real logic here since we don't have date info)
            return 0;
        });
        
        // Re-append sorted products to the grid
        products.forEach(product => {
            productGrid.appendChild(product);
        });
    });
}

// Setup Product Details
function setupProductDetails() {
    const detailButtons = document.querySelectorAll('.btn-details');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the product card
            const productCard = this.closest('.product-card');
            
            // Toggle details active class
            productCard.classList.toggle('details-active');
            
            // Update button text
            if (productCard.classList.contains('details-active')) {
                this.textContent = 'Hide Details';
            } else {
                this.textContent = 'View Details';
            }
            
            // Close other open details
            document.querySelectorAll('.product-card.details-active').forEach(card => {
                if (card !== productCard) {
                    card.classList.remove('details-active');
                    card.querySelector('.btn-details').textContent = 'View Details';
                }
            });
        });
    });
    
    // Close details when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.product-card') && !e.target.classList.contains('btn-details')) {
            document.querySelectorAll('.product-card.details-active').forEach(card => {
                card.classList.remove('details-active');
                card.querySelector('.btn-details').textContent = 'View Details';
            });
        }
    });
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
}); 