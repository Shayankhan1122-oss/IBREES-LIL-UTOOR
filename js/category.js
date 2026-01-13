// Category page JavaScript

// Sample category data
const categories = {
    fragrances: {
        name: "Fragrances",
        title: "Premium Fragrances",
        description: "Discover our collection of premium attars and perfumes",
        subcategories: ["Attar", "Perfumes", "Deodorants", "Body Mists"],
        products: [
            {
                id: 1,
                name: "Premium Perfume",
                price: 49.99,
                image: "images/products/perfume1.jpg",
                rating: 4.5,
                discount: 10
            },
            {
                id: 5,
                name: "Attar Oil",
                price: 24.99,
                image: "images/products/attar1.jpg",
                rating: 4.7,
                discount: 5
            },
            {
                id: 9,
                name: "Rose Perfume",
                price: 34.99,
                image: "images/products/rose-perfume.jpg",
                rating: 4.3,
                discount: 0
            },
            {
                id: 10,
                name: "Jasmine Attar",
                price: 29.99,
                image: "images/products/jasmine-attar.jpg",
                rating: 4.6,
                discount: 15
            }
        ]
    },
    clothes: {
        name: "Clothes",
        title: "Fashionable Clothes",
        description: "Explore our trendy collection of male and female clothing",
        subcategories: ["Male", "Female", "Kids", "Accessories"],
        products: [
            {
                id: 2,
                name: "Cotton Kurta",
                price: 29.99,
                image: "images/products/kurta1.jpg",
                rating: 4.2,
                discount: 0
            },
            {
                id: 6,
                name: "Women's Dupatta",
                price: 15.99,
                image: "images/products/dupatta1.jpg",
                rating: 4.0,
                discount: 20
            },
            {
                id: 11,
                name: "Men's Sherwani",
                price: 89.99,
                image: "images/products/sherwani.jpg",
                rating: 4.8,
                discount: 0
            },
            {
                id: 12,
                name: "Women's Abaya",
                price: 59.99,
                image: "images/products/abaya.jpg",
                rating: 4.4,
                discount: 25
            }
        ]
    },
    agricultural: {
        name: "Agricultural Products",
        title: "Fresh Agricultural Products",
        description: "Pure and organic agricultural products including desi ghee, honey, and eggs",
        subcategories: ["Desi Ghee", "Honey", "Eggs", "Spices"],
        products: [
            {
                id: 3,
                name: "Pure Desi Ghee",
                price: 19.99,
                image: "images/products/ghee1.jpg",
                rating: 4.8,
                discount: 0
            },
            {
                id: 7,
                name: "Raw Honey",
                price: 12.99,
                image: "images/products/honey1.jpg",
                rating: 4.9,
                discount: 0
            },
            {
                id: 13,
                name: "Organic Eggs",
                price: 8.99,
                image: "images/products/eggs.jpg",
                rating: 4.5,
                discount: 0
            },
            {
                id: 14,
                name: "Pure Spices",
                price: 14.99,
                image: "images/products/spices.jpg",
                rating: 4.3,
                discount: 10
            }
        ]
    },
    'home-textiles': {
        name: "Home Textiles",
        title: "Comfortable Home Textiles",
        description: "Quality blankets, prayer mats, and other home textiles",
        subcategories: ["Blankets", "Prayer Mats", "Cushions", "Carpets"],
        products: [
            {
                id: 4,
                name: "Prayer Mat",
                price: 39.99,
                image: "images/products/mat1.jpg",
                rating: 4.3,
                discount: 0
            },
            {
                id: 8,
                name: "Winter Blanket",
                price: 59.99,
                image: "images/products/blanket1.jpg",
                rating: 4.6,
                discount: 12
            },
            {
                id: 15,
                name: "Silk Cushions",
                price: 24.99,
                image: "images/products/cushions.jpg",
                rating: 4.1,
                discount: 0
            },
            {
                id: 16,
                name: "Persian Carpet",
                price: 199.99,
                image: "images/products/carpet.jpg",
                rating: 4.9,
                discount: 0
            }
        ]
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get category from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat') || 'fragrances';
    
    // Load category data
    loadCategoryData(category);
    
    // Initialize cart count
    updateCartCount();
    
    // Setup event listeners
    setupCategoryEventListeners();
});

// Load category data
function loadCategoryData(categoryKey) {
    const category = categories[categoryKey];
    if (!category) {
        console.error('Category not found');
        return;
    }
    
    // Update category information
    document.getElementById('category-name').textContent = category.name;
    document.getElementById('category-title').textContent = category.title;
    document.getElementById('category-description').textContent = category.description;
    
    // Load subcategories
    loadSubcategories(category.subcategories);
    
    // Load products
    loadCategoryProducts(category.products);
}

// Load subcategories
function loadSubcategories(subcategories) {
    const subcategoryList = document.getElementById('subcategory-list');
    if (!subcategoryList) return;
    
    subcategoryList.innerHTML = subcategories.map(subcat => `
        <li><label><input type="checkbox" value="${subcat.toLowerCase()}"> ${subcat}</label></li>
    `).join('');
}

// Load category products
function loadCategoryProducts(products) {
    const productsContainer = document.getElementById('category-products');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.discount > 0 ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
                <div class="quick-view">
                    <button class="btn-quick-view" data-id="${product.id}">Quick View</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    ${product.discount > 0 ? `<span class="original-price">$${(product.price / (1 - product.discount/100)).toFixed(2)}</span>` : ''}
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                </div>
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
    
    // Update results count
    document.getElementById('results-count').textContent = products.length;
}

// Setup category page event listeners
function setupCategoryEventListeners() {
    // Price range sliders
    const minPriceSlider = document.getElementById('price-min');
    const maxPriceSlider = document.getElementById('price-max');
    const minValueDisplay = document.getElementById('min-value');
    const maxValueDisplay = document.getElementById('max-value');
    
    if (minPriceSlider && maxPriceSlider) {
        minPriceSlider.addEventListener('input', function() {
            if (parseInt(this.value) > parseInt(maxPriceSlider.value)) {
                this.value = maxPriceSlider.value;
            }
            minValueDisplay.textContent = this.value;
        });
        
        maxPriceSlider.addEventListener('input', function() {
            if (parseInt(this.value) < parseInt(minPriceSlider.value)) {
                this.value = minPriceSlider.value;
            }
            maxValueDisplay.textContent = this.value;
        });
    }
    
    // Sort options
    const sortSelect = document.getElementById('sort-options');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // In a real implementation, this would sort the products
            console.log('Sorting by:', this.value);
        });
    }
    
    // View options
    const gridViewBtn = document.querySelector('.view-grid');
    const listViewBtn = document.querySelector('.view-list');
    
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            this.classList.add('active');
            listViewBtn.classList.remove('active');
            document.querySelector('.products-grid').classList.remove('list-view');
        });
        
        listViewBtn.addEventListener('click', function() {
            this.classList.add('active');
            gridViewBtn.classList.remove('active');
            document.querySelector('.products-grid').classList.add('list-view');
        });
    }
    
    // Pagination
    const pageButtons = document.querySelectorAll('.page');
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            pageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
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
function addToCart(productId) {
    // This function would be implemented in main.js
    // For now, just show an alert
    alert(`Product ${productId} added to cart!`);
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