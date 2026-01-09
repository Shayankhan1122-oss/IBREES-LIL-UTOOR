// Product Detail Page JavaScript

// Sample product data
const product = {
    id: 1,
    name: "Premium Perfume",
    price: 49.99,
    originalPrice: 59.99,
    category: "fragrances",
    sku: "PR-001",
    rating: 4.5,
    reviewCount: 128,
    stock: 5,
    description: "Experience the finest fragrance with our premium perfume. Made with natural ingredients and long-lasting scent.",
    features: [
        "Long-lasting fragrance (up to 12 hours)",
        "Made with natural ingredients",
        "Available in multiple sizes",
        "Eco-friendly packaging",
        "Cruelty-free and vegan"
    ],
    specifications: {
        Brand: "Qari Fragrances",
        "Scent Type": "Floral, Citrus",
        "Top Notes": "Bergamot, Lemon",
        "Middle Notes": "Jasmine, Rose",
        "Base Notes": "Vanilla, Musk",
        Volume: "50ml, 100ml, 150ml",
        Gender: "Unisex",
        Occasion: "Daily, Evening, Special Occasions"
    },
    images: [
        "images/products/perfume1.jpg",
        "images/products/perfume1-2.jpg",
        "images/products/perfume1-3.jpg",
        "images/products/perfume1-4.jpg"
    ],
    sizes: ["50ml", "100ml", "150ml"],
    colors: ["clear", "gold", "silver"],
    relatedProducts: [
        {
            id: 5,
            name: "Attar Oil",
            price: 24.99,
            image: "images/products/attar1.jpg",
            rating: 4.7
        },
        {
            id: 9,
            name: "Rose Perfume",
            price: 34.99,
            image: "images/products/rose-perfume.jpg",
            rating: 4.3
        },
        {
            id: 10,
            name: "Jasmine Attar",
            price: 29.99,
            image: "images/products/jasmine-attar.jpg",
            rating: 4.6
        },
        {
            id: 17,
            name: "Sandalwood Perfume",
            price: 42.99,
            image: "images/products/sandalwood-perfume.jpg",
            rating: 4.4
        }
    ]
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load product data
    loadProductData();
    
    // Initialize cart count
    updateCartCount();
    
    // Setup event listeners
    setupProductEventListeners();
});

// Load product data
function loadProductData() {
    // Update product information
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-rating').textContent = product.rating;
    document.querySelector('.current-price').textContent = `$${product.price.toFixed(2)}`;
    document.querySelector('.original-price').textContent = `$${product.originalPrice.toFixed(2)}`;
    document.querySelector('.discount').textContent = `${Math.round((1 - product.price/product.originalPrice)*100)}% off`;
    document.querySelector('.items-left').textContent = `Only ${product.stock} left in stock`;
    document.querySelector('.short-description').textContent = product.description;
    
    // Update stock status
    const stockStatus = document.querySelector('.in-stock');
    if (product.stock > 0) {
        stockStatus.textContent = "In Stock";
        stockStatus.style.color = "#28a745";
    } else {
        stockStatus.textContent = "Out of Stock";
        stockStatus.style.color = "#dc3545";
    }
    
    // Load product images
    loadProductImages();
    
    // Load related products
    loadRelatedProducts();
    
    // Load product specifications
    loadSpecifications();
}

// Load product images
function loadProductImages() {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Set the first image as main
    mainImage.src = product.images[0];
    
    // Add event listeners to thumbnails
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            // Update main image
            mainImage.src = product.images[index];
            
            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Load related products
function loadRelatedProducts() {
    const relatedProductsContainer = document.getElementById('related-products');
    if (!relatedProductsContainer) return;
    
    relatedProductsContainer.innerHTML = product.relatedProducts.map(p => `
        <div class="product-card">
            <div class="product-image">
                <img src="${p.image}" alt="${p.name}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="product-price">$${p.price.toFixed(2)}</div>
                <div class="product-rating">
                    ${generateStars(p.rating)}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
                    <button class="add-to-wishlist" data-id="${p.id}"><i class="fas fa-heart"></i></button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            toggleWishlist(productId);
        });
    });
}

// Load product specifications
function loadSpecifications() {
    const specTable = document.querySelector('.spec-table');
    if (!specTable) return;
    
    // Clear existing rows
    specTable.innerHTML = '';
    
    // Add specifications
    for (const [key, value] of Object.entries(product.specifications)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${key}</td>
            <td>${value}</td>
        `;
        specTable.appendChild(row);
    }
}

// Setup product page event listeners
function setupProductEventListeners() {
    // Size selector
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Color selector
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Quantity selector
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < product.stock) {
            quantityInput.value = value + 1;
        }
    });
    
    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value);
            addToCart(product.id, quantity);
        });
    }
    
    // Add to wishlist button
    const addToWishlistBtn = document.querySelector('.add-to-wishlist');
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', function() {
            toggleWishlist(product.id);
        });
    }
    
    // Product tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show active content
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Star rating for reviews
    const ratingStars = document.querySelectorAll('.rating-input i');
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            
            // Update active stars
            ratingStars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active', 'fas');
                    s.classList.remove('far');
                } else {
                    s.classList.remove('active', 'fas');
                    s.classList.add('far');
                }
            });
        });
    });
    
    // Review form submission
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Review submitted successfully!');
            this.reset();
            
            // Reset stars
            ratingStars.forEach(s => {
                s.classList.remove('active', 'fas');
                s.classList.add('far');
            });
        });
    }
    
    // Share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.querySelector('i').className.split(' ')[1].split('-')[1];
            alert(`Sharing on ${platform}!`);
        });
    });
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star" style="color: #ffc107;"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt" style="color: #ffc107;"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star" style="color: #ffc107;"></i>';
    }
    
    return stars;
}

// Add to cart function (inherited from main.js)
function addToCart(productId, quantity = 1) {
    // This function would be implemented in main.js
    // For now, just show an alert
    alert(`Product ${productId} added to cart with quantity ${quantity}!`);
}

// Toggle wishlist function (inherited from main.js)
function toggleWishlist(productId) {
    // This function would be implemented in main.js
    // For now, just show an alert
    alert(`Product ${productId} toggled in wishlist!`);
}

// Update cart count (inherited from main.js)
function updateCartCount() {
    // This function would be implemented in main.js
}