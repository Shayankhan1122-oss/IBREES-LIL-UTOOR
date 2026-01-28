// Calculate delivery charges based on order amount
    function calculateDeliveryCharges(subt// Checkout Page JavaScript - Pakistan Only Version
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

    // Calculate delivery charges based on order amount
    function calculateDeliveryCharges(subtotal) {
        if (subtotal < 500) {
            return 0; // Will be validated before checkout
        } else if (subtotal < 1000) {
            return 0; // FREE - Special Offer
        } else if (subtotal < 2000) {
            return 200;
        } else if (subtotal < 3000) {
            return 300;
        } else if (subtotal < 5000) {
            return 400;
        } else {
            return 500;
        }
    }

    // Calculate and display totals
    function calculateAndDisplayTotals() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = calculateDeliveryCharges(subtotal);
        const total = subtotal + shipping;
        
        const totalsContainer = document.getElementById('sidebar-order-totals');
        if (!totalsContainer) return;
        
        let shippingText = '';
        if (subtotal < 500) {
            shippingText = '<span style="color: #dc3545;">Minimum order: Rs 500</span>';
        } else if (subtotal < 1000) {
            shippingText = '<span style="color: #28a745; font-weight: 600;">FREE 🎉 Special Offer!</span>';
        } else {
            shippingText = `Rs ${shipping.toFixed(2)}`;
        }
        
        totalsContainer.innerHTML = `
            <div class="summary-row">
                <span>Subtotal</span>
                <span>Rs ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Delivery</span>
                <span>${shippingText}</span>
            </div>
            ${subtotal >= 500 && subtotal < 1000 ? '<div class="summary-row" style="color: #28a745; font-size: 12px;"><span colspan="2">🎉 Special offer: Free delivery for orders Rs 500-999!</span></div>' : ''}
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
            reviewPaymentContainer.innerHTML = `<p>💵 Cash on Delivery</p>`;
        }
        
        // Load order summary
        const reviewSummaryContainer = document.getElementById('review-order-summary');
        if (reviewSummaryContainer) {
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = calculateDeliveryCharges(subtotal);
            const total = subtotal + shipping;
            
            let shippingText = '';
            if (subtotal < 1000) {
                shippingText = 'FREE 🎉 (Special Offer)';
            } else {
                shippingText = 'Rs ' + shipping.toFixed(2);
            }
            
            reviewSummaryContainer.innerHTML = `
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>Rs ${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Delivery</span>
                    <span>${shippingText}</span>
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
        // Real-time email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                // Convert to lowercase automatically
                this.value = this.value.toLowerCase();
            });
            
            emailInput.addEventListener('blur', function() {
                const email = this.value.trim();
                const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
                if (email && !emailRegex.test(email)) {
                    this.setCustomValidity('Please enter a valid email address in lowercase');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
        
        // Real-time phone validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                // Remove any non-numeric characters except + at start
                let value = this.value;
                if (value.startsWith('+')) {
                    value = '+' + value.slice(1).replace(/\D/g, '');
                } else {
                    value = value.replace(/\D/g, '');
                }
                this.value = value;
            });
            
            phoneInput.addEventListener('blur', function() {
                const phone = this.value.trim().replace(/\s/g, '');
                const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
                if (phone && !phoneRegex.test(phone)) {
                    this.setCustomValidity('Enter valid Pakistani phone: +923XXXXXXXXX or 03XXXXXXXXX');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
        
        // Shipping form - Continue to Payment
        const continueToPayment = document.getElementById('continue-to-payment');
        if (continueToPayment) {
            continueToPayment.addEventListener('click', function() {
                // Check minimum order
                const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                if (subtotal < 500) {
                    alert('❌ Minimum order amount is Rs 500. Your current cart total is Rs ' + subtotal.toFixed(2) + '. Please add more items to proceed.');
                    return;
                }
                
                const form = document.getElementById('shipping-form');
                
                // Additional validation for email and phone
                const emailInput = document.getElementById('email');
                const phoneInput = document.getElementById('phone');
                
                // Validate email (must be lowercase and valid format)
                const email = emailInput.value.trim();
                const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
                if (!emailRegex.test(email)) {
                    alert('❌ Please enter a valid email address in lowercase format (e.g., john@example.com)');
                    emailInput.focus();
                    return;
                }
                
                // Validate phone (Pakistani format)
                const phone = phoneInput.value.trim().replace(/\s/g, '');
                const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
                if (!phoneRegex.test(phone)) {
                    alert('❌ Please enter a valid Pakistani phone number\nExamples: +923001234567 or 03001234567');
                    phoneInput.focus();
                    return;
                }
                
                if (form.checkValidity()) {
                    const formData = new FormData(form);
                    checkoutState.shippingInfo = {
                        firstName: formData.get('firstName').trim(),
                        lastName: formData.get('lastName').trim(),
                        email: email.toLowerCase(), // Force lowercase
                        phone: phone,
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
            
            // Final check for minimum order
            if (subtotal < 500) {
                throw new Error('Minimum order amount is Rs 500');
            }
            
            const shipping = calculateDeliveryCharges(subtotal);
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