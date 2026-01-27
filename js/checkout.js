// Checkout Page JavaScript - Pakistan Only Version
(function() {
    'use strict';

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
        paymentMethod: 'cash-on-delivery',
        orderPlaced: false
    };

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Check if cart is empty
        if (cart.length === 0) {
            alert('Your cart is empty!');
            window.location.href = 'category.html';
            return;
        }
        
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
                <div class="sidebar-item-info">
                    <span class="sidebar-item-name">${item.name}</span>
                    <span class="sidebar-item-qty">x${item.quantity}</span>
                </div>
                <span class="sidebar-item-price">Rs ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
        
        // Calculate and display totals
        calculateAndDisplayTotals();
    }

    // Calculate and display totals
    function calculateAndDisplayTotals() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal >= 5000 ? 0 : 200; // Free shipping over Rs 5000
        const total = subtotal + shipping;
        
        const totalsContainer = document.getElementById('sidebar-order-totals');
        if (!totalsContainer) return;
        
        totalsContainer.innerHTML = `
            <div class="summary-row">
                <span>Subtotal</span>
                <span>Rs ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'FREE' : 'Rs ' + shipping.toFixed(2)}</span>
            </div>
            ${subtotal >= 5000 ? '<div class="summary-row free-shipping"><span>🎉 You got free shipping!</span></div>' : ''}
            <div class="summary-row total">
                <span>Total</span>
                <span>Rs ${total.toFixed(2)}</span>
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
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.remove('active');
            if (stepNum === stepNumber) {
                step.classList.add('active');
            }
        });
        
        // Show step content
        document.querySelectorAll('.checkout-step').forEach(step => {
            step.classList.remove('active');
        });
        
        const currentStep = document.getElementById(`step-${stepNumber}`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
        
        // Update checkout state
        checkoutState.step = stepNumber;
        
        // Special handling for review step
        if (stepNumber === 3) {
            loadReviewData();
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Load review data
    function loadReviewData() {
        // Load order items
        const reviewItemsContainer = document.getElementById('review-order-items');
        if (reviewItemsContainer) {
            reviewItemsContainer.innerHTML = cart.map(item => `
                <div class="order-item">
                    <div class="order-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23ddd%22 width=%2280%22 height=%2280%22/%3E%3C/svg%3E'">
                    </div>
                    <div class="order-item-details">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-price">Rs ${item.price.toFixed(2)}</div>
                        <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                    </div>
                    <div class="order-item-total">Rs ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('');
        }
        
        // Load shipping address
        const reviewAddressContainer = document.getElementById('review-shipping-address');
        if (reviewAddressContainer && checkoutState.shippingInfo) {
            const info = checkoutState.shippingInfo;
            reviewAddressContainer.innerHTML = `
                <p><strong>${info.firstName} ${info.lastName}</strong></p>
                <p>${info.address}</p>
                <p>${info.city}, ${info.state}</p>
                ${info.zip ? `<p>Postal Code: ${info.zip}</p>` : ''}
                <p>Pakistan</p>
                <p>📱 ${info.phone}</p>
                <p>📧 ${info.email}</p>
            `;
        }
        
        // Load payment method
        const reviewPaymentContainer = document.getElementById('review-payment-method');
        if (reviewPaymentContainer) {
            let paymentText = '';
            switch(checkoutState.paymentMethod) {
                case 'cash-on-delivery':
                    paymentText = '💵 Cash on Delivery';
                    break;
                case 'bank-transfer':
                    paymentText = '🏦 Bank Transfer';
                    break;
                case 'jazzcash':
                    paymentText = '📱 JazzCash / EasyPaisa';
                    break;
                default:
                    paymentText = '💵 Cash on Delivery';
            }
            reviewPaymentContainer.innerHTML = `<p>${paymentText}</p>`;
        }
        
        // Load order summary
        const reviewSummaryContainer = document.getElementById('review-order-summary');
        if (reviewSummaryContainer) {
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = subtotal >= 5000 ? 0 : 200;
            const total = subtotal + shipping;
            
            reviewSummaryContainer.innerHTML = `
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>Rs ${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>${shipping === 0 ? 'FREE' : 'Rs ' + shipping.toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span><strong>Total Amount</strong></span>
                    <span><strong>Rs ${total.toFixed(2)}</strong></span>
                </div>
            `;
        }
    }

    // Setup checkout event listeners
    function setupCheckoutEventListeners() {
        // Shipping form - Continue to Payment
        const continueToPayment = document.getElementById('continue-to-payment');
        if (continueToPayment) {
            continueToPayment.addEventListener('click', function() {
                const form = document.getElementById('shipping-form');
                if (form.checkValidity()) {
                    const formData = new FormData(form);
                    checkoutState.shippingInfo = {
                        firstName: formData.get('firstName').trim(),
                        lastName: formData.get('lastName').trim(),
                        email: formData.get('email').trim(),
                        phone: formData.get('phone').trim(),
                        address: formData.get('address').trim(),
                        city: formData.get('city').trim(),
                        state: formData.get('state'),
                        zip: formData.get('zip').trim(),
                        country: 'Pakistan'
                    };
                    
                    showStep(2);
                } else {
                    form.reportValidity();
                }
            });
        }
        
        // Payment form - Continue to Review
        const continueToReview = document.getElementById('continue-to-review');
        if (continueToReview) {
            continueToReview.addEventListener('click', function() {
                const selectedPayment = document.querySelector('input[name="payment"]:checked');
                if (selectedPayment) {
                    checkoutState.paymentMethod = selectedPayment.value;
                }
                showStep(3);
            });
        }
        
        // Back buttons
        const backToShipping = document.getElementById('back-to-shipping');
        if (backToShipping) {
            backToShipping.addEventListener('click', () => showStep(1));
        }
        
        const backToPayment = document.getElementById('back-to-payment');
        if (backToPayment) {
            backToPayment.addEventListener('click', () => showStep(2));
        }
        
        // Place order button
        const placeOrderBtn = document.getElementById('place-order');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', function() {
                const termsCheckbox = document.getElementById('terms');
                if (!termsCheckbox.checked) {
                    alert('Please agree to the Terms & Conditions to proceed.');
                    return;
                }
                
                processOrder();
            });
        }
    }

    // Process order
    async function processOrder() {
        const placeOrderBtn = document.getElementById('place-order');
        const originalHTML = placeOrderBtn.innerHTML;
        
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        placeOrderBtn.disabled = true;
        
        try {
            // Prepare order data
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = subtotal >= 5000 ? 0 : 200;
            const total = subtotal + shipping;
            
            console.log('=== DEBUG: Order Processing ===');
            console.log('checkoutState.shippingInfo:', checkoutState.shippingInfo);
            console.log('firstName:', checkoutState.shippingInfo.firstName);
            console.log('lastName:', checkoutState.shippingInfo.lastName);
            
            // Validate shipping info exists
            if (!checkoutState.shippingInfo.firstName || !checkoutState.shippingInfo.email) {
                throw new Error('Shipping information is incomplete. Please go back and fill all required fields.');
            }
            
            const orderData = {
                orderId: 'ORD-' + Date.now(),
                trackingToken: Math.random().toString(36).substr(2, 9).toUpperCase(),
                customer: {
                    fullName: `${checkoutState.shippingInfo.firstName} ${checkoutState.shippingInfo.lastName}`,
                    email: checkoutState.shippingInfo.email,
                    phone: checkoutState.shippingInfo.phone,
                    address: checkoutState.shippingInfo.address,
                    city: checkoutState.shippingInfo.city,
                    state: checkoutState.shippingInfo.state,
                    zip: checkoutState.shippingInfo.zip,
                    country: 'Pakistan'
                },
                items: cart,
                paymentMethod: checkoutState.paymentMethod,
                subtotal: subtotal,
                shipping: shipping,
                total: total,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            
            console.log('Order data being sent:', orderData);
            console.log('Customer fullName:', orderData.customer.fullName);
            console.log('Customer email:', orderData.customer.email);
            
            // Send order to API
            const response = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            const result = await response.json();
            console.log('API Response:', result);
            
            if (result.success) {
                // Save order info for confirmation page
                localStorage.setItem('lastOrder', JSON.stringify({
                    orderId: orderData.orderId,
                    trackingToken: orderData.trackingToken,
                    total: total,
                    paymentMethod: checkoutState.paymentMethod
                }));
                
                // Clear cart
                localStorage.removeItem('cart');
                
                // Update checkout state
                checkoutState.orderPlaced = true;
                
                // Redirect to confirmation page
                window.location.href = 'order-confirmation.html';
            } else {
                throw new Error(result.error || 'Failed to place order');
            }
        } catch (error) {
            console.error('Order processing error:', error);
            alert('Failed to place order. Please try again or contact support.');
            placeOrderBtn.innerHTML = originalHTML;
            placeOrderBtn.disabled = false;
        }
    }
})();