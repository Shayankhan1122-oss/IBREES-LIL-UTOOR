// Main JavaScript file for IBREES-LIL-UTOOR

// Sample product data
const products = [
    {
        id: 1,
        name: "Premium Perfume",
        price: 49.99,
        category: "fragrances",
        image: "images/products/perfume1.jpg",
        rating: 4.5
    },
    {
        id: 2,
        name: "Cotton Kurta",
        price: 29.99,
        category: "clothes",
        image: "images/products/kurta1.jpg",
        rating: 4.2
    },
    {
        id: 3,
        name: "Pure Desi Ghee",
        price: 19.99,
        category: "agricultural",
        image: "images/products/ghee1.jpg",
        rating: 4.8
    },
    {
        id: 4,
        name: "Prayer Mat",
        price: 39.99,
        category: "home-textiles",
        image: "images/products/mat1.jpg",
        rating: 4.3
    },
    {
        id: 5,
        name: "Attar Oil",
        price: 24.99,
        category: "fragrances",
        image: "images/products/attar1.jpg",
        rating: 4.7
    },
    {
        id: 6,
        name: "Women's Dupatta",
        price: 15.99,
        category: "clothes",
        image: "images/products/dupatta1.jpg",
        rating: 4.0
    },
    {
        id: 7,
        name: "Raw Honey",
        price: 12.99,
        category: "agricultural",
        image: "images/products/honey1.jpg",
        rating: 4.9
    },
    {
        id: 8,
        name: "Winter Blanket",
        price: 59.99,
        category: "home-textiles",
        image: "images/products/blanket1.jpg",
        rating: 4.6
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load featured products
    loadFeaturedProducts();
    
    // Initialize cart count
    updateCartCount();
    
    // Add event listeners
    setupEventListeners();
});

// Load featured products
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) return;
    
    // Get 8 featured products (or all if less than 8)
    const featuredProducts = products.slice(0, 8);
    
    featuredProductsContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">Rs. ${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="add-to-wishlist" data-id="${product.id}"><i class="fas fa-heart"></i></button>
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

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Toggle wishlist function
function toggleWishlist(productId) {
    // For demo purposes, just show notification
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    showNotification(`${product.name} ${isInWishlist(productId) ? 'removed from' : 'added to'} wishlist!`);
}

// Check if product is in wishlist
function isInWishlist(productId) {
    // For demo purposes, return random result
    return Math.random() > 0.5;
}

// Update cart count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (!cartCountElement) return;
    
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = count;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation style if not already added
    if (!document.querySelector('#notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            showNotification(`Thank you for subscribing with ${email}!`);
            this.reset();
        });
    }
}

// Perform search
function performSearch(query) {
    if (query.trim() === '') return;
    
    // For demo purposes, just show an alert
    alert(`Searching for: ${query}`);
    
    // In a real implementation, this would redirect to a search results page
    // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}

// Additional utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}