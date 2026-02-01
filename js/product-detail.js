// Product Detail Page JavaScript

document.addEventListener('DOMContentLoaded', async function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Wait for products to load
    await loadProduct(productId);
    
    // Setup quantity controls
    setupQuantityControls();
    
    // Setup tabs
    setupTabs();
    
    // Setup image gallery
    setupImageGallery();
});

async function loadProduct(productId) {
    try {
        const response = await fetch('/api/admin/products');
        const data = await response.json();
        
        let products = [];
        if (data.success && data.products) {
            products = data.products;
        } else if (Array.isArray(data)) {
            products = data;
        }
        
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            alert('Product not found!');
            window.location.href = 'index.html';
            return;
        }
        
        // Update page with product data
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-name').textContent = product.name;
        document.querySelector('.current-price').textContent = `Rs ${product.price.toFixed(2)}`;
        document.querySelector('.short-description').textContent = product.description || 'Premium quality product';
        
        // Update main image
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) {
            mainImage.src = product.image;
            mainImage.alt = product.name;
        }
        
        // Update add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.setAttribute('data-id', product.id);
        }

        // Update Order Now button (add to cart and go to checkout)
        const orderNowBtn = document.querySelector('.btn-order-now');
        if (orderNowBtn) {
            orderNowBtn.setAttribute('data-id', product.id);
            orderNowBtn.addEventListener('click', function() {
                // Add product to cart
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existing = cart.find(i => i.id === product.id);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                // Redirect to checkout
                window.location.href = 'checkout.html';
            });
        }

        // Setup size/measure options based on category
        const sizeSelector = document.querySelector('.size-selector');
        const sizeOptionWrap = document.querySelector('.size-option-wrap');
        if (sizeSelector && sizeOptionWrap) {
            // Clear existing
            sizeSelector.innerHTML = '';

            if (product.category === 'fragrances') {
                // show ml options
                const sizes = [30, 50, 100];
                sizes.forEach((s, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'size-option' + (idx === 0 ? ' active' : '');
                    btn.setAttribute('data-value', s);
                    btn.textContent = s + ' ml';
                    btn.addEventListener('click', function() {
                        document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                    });
                    sizeSelector.appendChild(btn);
                });
                sizeOptionWrap.style.display = '';
            } else if (product.category === 'agricultural') {
                // show gram options
                const sizes = [250, 500, 1000];
                sizes.forEach((s, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'size-option' + (idx === 0 ? ' active' : '');
                    btn.setAttribute('data-value', s);
                    btn.textContent = s + ' gm';
                    btn.addEventListener('click', function() {
                        document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                    });
                    sizeSelector.appendChild(btn);
                });
                sizeOptionWrap.style.display = '';
            } else {
                // clothes or home-textiles: hide entire size option wrapper
                sizeOptionWrap.style.display = 'none';
            }
        }

        // Override Add to Cart on product page to include selected size if any
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const selectedSizeBtn = document.querySelector('.size-option.active');
                const selectedSize = selectedSizeBtn ? selectedSizeBtn.getAttribute('data-value') : null;

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existing = cart.find(i => i.id === product.id && i.size === selectedSize);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    const item = {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    };
                    if (selectedSize) item.size = selectedSize;
                    cart.push(item);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                // Update cart count if function available
                if (window.updateCartCount) window.updateCartCount();
                // Show confirmation
                if (window.showNotification) {
                    window.showNotification(`${product.name} added to cart!`, 'success');
                }
            });
        }
        
        // Load related products
        loadRelatedProducts(products, product.category, product.id);
        
    } catch (error) {
        console.error('Error loading product:', error);
        alert('Error loading product. Please try again.');
    }
}

function loadRelatedProducts(allProducts, category, currentId) {
    const relatedContainer = document.getElementById('related-products');
    if (!relatedContainer) return;
    
    const related = allProducts
        .filter(p => p.category === category && p.id !== currentId)
        .slice(0, 4);
    
    if (related.length === 0) {
        relatedContainer.innerHTML = '<p>No related products found</p>';
        return;
    }
    
    relatedContainer.innerHTML = related.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3C/svg%3E'">
            <h3>${product.name}</h3>
            <p class="price">Rs ${product.price.toFixed(2)}</p>
            <a href="product.html?id=${product.id}" class="btn">View Details</a>
        </div>
    `).join('');
}

function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    if (minusBtn) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
    }
    
    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });
    }
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function setupImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const newSrc = this.getAttribute('data-src');
            
            if (mainImage && newSrc) {
                mainImage.src = newSrc;
            }
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}