document.addEventListener('DOMContentLoaded', function() {
    initCart();
});

// Initialize the cart
function initCart() {
    // Get cart data from localStorage
    const cart = getCartData();
    
    // Show cart content or empty message based on cart contents
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartContent.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartContent.style.display = 'grid';
        
        // Render cart items
        renderCartItems(cart);
        
        // Initialize quantities
        initQuantityButtons();
        
        // Initialize remove buttons
        initRemoveButtons();
        
        // Calculate and display totals
        updateCartTotals();
        
        // Initialize checkout button
        initCheckoutButton();
        
        // Initialize promo code
        initPromoCode();
    }
}

// Get cart data from localStorage
function getCartData() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart data to localStorage
function saveCartData(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Render cart items in the DOM
function renderCartItems(cart) {
    const cartItemsContainer = document.getElementById('cart-items-container');
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price.replace('$', '')) * item.quantity;
        
        const cartItemHTML = `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-product">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-category">${getItemCategory(item.image)}</div>
                    </div>
                </div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-increase">+</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                <button class="cart-item-remove"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        
        cartItemsContainer.innerHTML += cartItemHTML;
    });
}

// Extract category from image path (this is a workaround since we don't have proper category data)
function getItemCategory(imagePath) {
    // Try to extract the category from the product name in the image path
    if (imagePath.includes('football')) {
        return 'Football';
    } else if (imagePath.includes('basketball')) {
        return 'Basketball';
    } else if (imagePath.includes('tennis')) {
        return 'Tennis';
    } else if (imagePath.includes('swimming')) {
        return 'Swimming';
    } else {
        return 'Sports Equipment';
    }
}

// Initialize quantity buttons
function initQuantityButtons() {
    // Decrease quantity
    document.querySelectorAll('.quantity-decrease').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const index = parseInt(cartItem.dataset.index);
            let cart = getCartData();
            
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                saveCartData(cart);
                
                // Update quantity display
                this.nextElementSibling.textContent = cart[index].quantity;
                
                // Update item total
                updateItemTotal(cartItem, cart[index]);
                
                // Update cart totals
                updateCartTotals();
                
                // Update cart count in the header
                updateCartCount();
            }
        });
    });
    
    // Increase quantity
    document.querySelectorAll('.quantity-increase').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const index = parseInt(cartItem.dataset.index);
            let cart = getCartData();
            
            cart[index].quantity += 1;
            saveCartData(cart);
            
            // Update quantity display
            this.previousElementSibling.textContent = cart[index].quantity;
            
            // Update item total
            updateItemTotal(cartItem, cart[index]);
            
            // Update cart totals
            updateCartTotals();
            
            // Update cart count in the header
            updateCartCount();
        });
    });
}

// Update item total price
function updateItemTotal(cartItem, item) {
    const itemTotal = parseFloat(item.price.replace('$', '')) * item.quantity;
    cartItem.querySelector('.cart-item-total').textContent = '$' + itemTotal.toFixed(2);
}

// Initialize remove buttons
function initRemoveButtons() {
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const index = parseInt(cartItem.dataset.index);
            let cart = getCartData();
            
            // Remove item from cart
            cart.splice(index, 1);
            saveCartData(cart);
            
            // Check if cart is empty
            if (cart.length === 0) {
                document.getElementById('cart-empty').style.display = 'block';
                document.getElementById('cart-content').style.display = 'none';
            } else {
                // Re-render cart
                renderCartItems(cart);
                initQuantityButtons();
                initRemoveButtons();
                updateCartTotals();
            }
            
            // Update cart count in the header
            updateCartCount();
        });
    });
}

// Update cart totals
function updateCartTotals() {
    const cart = getCartData();
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => {
        return total + (parseFloat(item.price.replace('$', '')) * item.quantity);
    }, 0);
    
    // Calculate shipping (free if subtotal > $100, otherwise $10)
    const shipping = subtotal > 100 ? 0 : 10;
    
    // Get discount from localStorage or default to 0
    const discount = parseFloat(localStorage.getItem('cartDiscount') || 0);
    
    // Calculate total
    const total = subtotal + shipping - discount;
    
    // Update DOM
    document.getElementById('cart-subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('cart-shipping').textContent = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2);
    document.getElementById('cart-discount').textContent = '-$' + discount.toFixed(2);
    document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
}

// Initialize checkout button
function initCheckoutButton() {
    const checkoutButton = document.querySelector('.btn-checkout');
    
    checkoutButton.addEventListener('click', function() {
        // This would normally redirect to a checkout page or initiate a checkout flow
        // For now, just show a notification
        showNotification('Checkout functionality will be implemented soon!');
    });
}

// Initialize promo code
function initPromoCode() {
    const promoCodeButton = document.querySelector('.btn-apply');
    
    promoCodeButton.addEventListener('click', function() {
        const promoCode = this.previousElementSibling.value.trim().toUpperCase();
        
        // Simple promo code logic (normally would be validated on the server)
        if (promoCode === 'DISCOUNT20') {
            // Calculate 20% discount on subtotal
            const cart = getCartData();
            const subtotal = cart.reduce((total, item) => {
                return total + (parseFloat(item.price.replace('$', '')) * item.quantity);
            }, 0);
            
            const discount = subtotal * 0.2;
            
            // Save discount to localStorage
            localStorage.setItem('cartDiscount', discount);
            
            // Update totals
            updateCartTotals();
            
            // Show success notification
            showNotification('Promo code applied successfully!');
        } else if (promoCode === 'FREESHIP') {
            // Free shipping (already calculated in updateCartTotals)
            localStorage.setItem('cartDiscount', 10);
            
            // Update totals
            updateCartTotals();
            
            // Show success notification
            showNotification('Free shipping promo code applied!');
        } else {
            // Invalid promo code
            showNotification('Invalid promo code. Please try again.', 'error');
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    if (type === 'error') {
        notification.classList.add('notification-error');
    }
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

// Update cart count in the header
function updateCartCount() {
    // Get cart from localStorage
    const cart = getCartData();
    
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