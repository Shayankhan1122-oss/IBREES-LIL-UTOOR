// Checkout Page JavaScript

// Get cart data from localStorage
function getCartData() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Use real cart data
const cart = getCartData();

// Checkout state
let checkoutState = {
    step: 1,
    shippingInfo: {},
    shippingMethod: 'standard',
    paymentMethod: 'credit-card',
    orderPlaced: false
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load cart items in sidebar
    loadCartItemsInSidebar();
    
    // Initialize checkout steps
    initializeCheckoutSteps();
    
    // Setup event listeners
    setupCheckoutEventListeners();
});

// Load cart items in sidebar
function loadCartItemsInSidebar() {
    const sidebarItemsContainer = document.getElementById('sidebar-order-items');
    if (!sidebarItemsContainer) return;
    
    sidebarItemsContainer.innerHTML = cart.map(item => `
        <div class="sidebar-item">
            <span>${item.name} x${item.quantity}</span>
            <span>Rs. ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    // Calculate and display totals
    calculateAndDisplayTotals();
}

// Calculate and display totals
function calculateAndDisplayTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = checkoutState.shippingMethod === 'standard' ? (subtotal > 2500 ? 0 : 0) :
                    checkoutState.shippingMethod === 'express' ? 200 : 400;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    const totalsContainer = document.getElementById('sidebar-order-totals');
    if (!totalsContainer) return;
    
    totalsContainer.innerHTML = `
        <div class="summary-row">
            <span>Subtotal</span>
            <span>Rs. ${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>Rs. ${shipping.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Tax</span>
            <span>Rs. ${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>Rs. ${total.toFixed(2)}</span>
        </div>
    `;
}

// Initialize checkout steps
function initializeCheckoutSteps() {
    // Show first step
    showStep(1);
}

// Show specific step
function showStep(stepNumber) {
    // Update step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.getAttribute('data-step')) === stepNumber) {
            step.classList.add('active');
        }
    });
    
    // Show step content
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    // Update checkout state
    checkoutState.step = stepNumber;
    
    // Special handling for payment forms
    if (stepNumber === 3) {
        showPaymentForm();
    }
    
    // Special handling for review step
    if (stepNumber === 4) {
        loadReviewData();
    }
}

// Show payment form based on selected method
function showPaymentForm() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Hide all payment forms
    document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // Show selected payment form
    if (paymentMethod === 'credit-card') {
        document.getElementById('credit-card-form').classList.add('active');
    }
    
    // Update checkout state
    checkoutState.paymentMethod = paymentMethod;
}

// Load review data
function loadReviewData() {
    // Load order items
    const reviewItemsContainer = document.getElementById('review-order-items');
    if (reviewItemsContainer) {
        reviewItemsContainer.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">Rs. ${item.price.toFixed(2)}</div>
                    <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                </div>
            </div>
        `).join('');
    }
    
    // Load shipping address
    const reviewAddressContainer = document.getElementById('review-shipping-address');
    if (reviewAddressContainer && checkoutState.shippingInfo) {
        const info = checkoutState.shippingInfo;
        reviewAddressContainer.innerHTML = `
            <p>${info.firstName} ${info.lastName}</p>
            <p>${info.address}</p>
            <p>${info.city}, ${info.state} ${info.zip}</p>
            <p>${info.country}</p>
            <p>Phone: ${info.phone}</p>
            <p>Email: ${info.email}</p>
        `;
    }
    
    // Load payment method
    const reviewPaymentContainer = document.getElementById('review-payment-method');
    if (reviewPaymentContainer) {
        let paymentText = '';
        switch(checkoutState.paymentMethod) {
            case 'credit-card':
                paymentText = 'Credit/Debit Card';
                break;
            case 'paypal':
                paymentText = 'PayPal';
                break;
            case 'cash-on-delivery':
                paymentText = 'Cash on Delivery';
                break;
            default:
                paymentText = 'Credit/Debit Card';
        }
        reviewPaymentContainer.innerHTML = `<p>${paymentText}</p>`;
    }
    
    // Load order summary
    const reviewSummaryContainer = document.getElementById('review-order-summary');
    if (reviewSummaryContainer) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = checkoutState.shippingMethod === 'standard' ? (subtotal > 2500 ? 0 : 0) :
                        checkoutState.shippingMethod === 'express' ? 200 : 400;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;
        
        reviewSummaryContainer.innerHTML = `
            <div class="summary-row">
                <span>Subtotal</span>
                <span>Rs. ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>Rs. ${shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax</span>
                <span>Rs. ${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>Rs. ${total.toFixed(2)}</span>
            </div>
        `;
    }
}

// Setup checkout event listeners
function setupCheckoutEventListeners() {
    // Shipping form
    document.getElementById('continue-to-shipping').addEventListener('click', function() {
        // Validate form
        const form = document.getElementById('shipping-form');
        if (form.checkValidity()) {
            // Save shipping info
            const formData = new FormData(form);
            checkoutState.shippingInfo = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zip: formData.get('zip'),
                country: formData.get('country')
            };
            
            showStep(2);
        } else {
            form.reportValidity();
        }
    });
    
    // Shipping method form
    document.getElementById('continue-to-payment').addEventListener('click', function() {
        // Get selected shipping method
        const selectedMethod = document.querySelector('input[name="shipping"]:checked').value;
        checkoutState.shippingMethod = selectedMethod;
        
        // Update totals in sidebar
        calculateAndDisplayTotals();
        
        showStep(3);
    });
    
    document.getElementById('back-to-shipping').addEventListener('click', function() {
        showStep(1);
    });
    
    // Payment form
    document.getElementById('continue-to-review').addEventListener('click', function() {
        // Validate payment form if credit card is selected
        if (checkoutState.paymentMethod === 'credit-card') {
            const cardForm = document.getElementById('credit-card-form');
            if (cardForm.classList.contains('active') && !cardForm.checkValidity()) {
                cardForm.reportValidity();
                return;
            }
        }
        
        showStep(4);
    });
    
    document.getElementById('back-to-shipping-method').addEventListener('click', function() {
        showStep(2);
    });
    
    // Order review
    document.getElementById('place-order').addEventListener('click', function() {
        if (!document.getElementById('terms').checked) {
            alert('Please agree to the Terms & Conditions');
            return;
        }
        
        // Process order
        processOrder();
    });
    
    document.getElementById('back-to-payment').addEventListener('click', function() {
        showStep(3);
    });
    
    // Payment method selection
    document.querySelectorAll('input[name="payment"]').forEach(input => {
        input.addEventListener('change', function() {
            showPaymentForm();
        });
    });
    
    // Shipping method selection
    document.querySelectorAll('input[name="shipping"]').forEach(input => {
        input.addEventListener('change', function() {
            // Update totals in sidebar when shipping method changes
            calculateAndDisplayTotals();
        });
    });
}

// Process order
function processOrder() {
    // Show loading state
    const placeOrderBtn = document.getElementById('place-order');
    const originalText = placeOrderBtn.textContent;
    placeOrderBtn.textContent = 'Processing...';
    placeOrderBtn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        // Clear cart
        localStorage.removeItem('cart');
        
        // Update checkout state
        checkoutState.orderPlaced = true;
        
        // Redirect to confirmation page
        window.location.href = 'order-confirmation.html';
    }, 2000);
}

// Update cart count (inherited from main.js)
function updateCartCount() {
    // This function would be implemented in main.js
}