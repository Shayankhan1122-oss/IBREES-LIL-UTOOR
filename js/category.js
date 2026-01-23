// Category Page JavaScript

let allProducts = [];
let filteredProducts = [];
let currentCategory = '';

document.addEventListener('DOMContentLoaded', async function() {
    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentCategory = urlParams.get('cat') || '';
    const searchQuery = urlParams.get('search') || '';
    
    // Load products
    await loadCategoryProducts(currentCategory, searchQuery);
    
    // Setup event listeners
    setupCategoryListeners();
});

async function loadCategoryProducts(category, search = '') {
    try {
        const response = await fetch('/api/admin/products');
        const data = await response.json();
        
        if (data.success && data.products) {
            allProducts = data.products;
        } else if (Array.isArray(data)) {
            allProducts = data;
        }
        
        // Filter by category
        if (category) {
            filteredProducts = allProducts.filter(p => p.category === category);
        } else if (search) {
            filteredProducts = allProducts.filter(p => 
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        } else {
            filteredProducts = allProducts;
        }
        
        // Update page title
        updateCategoryInfo(category);
        
        // Display products
        displayProducts(filteredProducts);
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('category-products').innerHTML = 
            '<p>Error loading products. Please try again.</p>';
    }
}

function updateCategoryInfo(category) {
    const categoryMap = {
        'fragrances': { name: 'Fragrances', desc: 'Premium Attar & Perfumes' },
        'clothes': { name: 'Clothes', desc: 'Male & Female Fashion' },
        'agricultural': { name: 'Agricultural Products', desc: 'Fresh Agricultural Products' },
        'home-textiles': { name: 'Home Textiles', desc: 'Quality Home Essentials' }
    };
    
    const info = categoryMap[category] || { name: 'All Products', desc: 'Browse our complete collection' };
    
    const titleEl = document.getElementById('category-title');
    const nameEl = document.getElementById('category-name');
    const descEl = document.getElementById('category-description');
    
    if (titleEl) titleEl.textContent = info.name;
    if (nameEl) nameEl.textContent = info.name;
    if (descEl) descEl.textContent = info.desc;
}

function displayProducts(products) {
    const container = document.getElementById('category-products');
    const resultsCount = document.getElementById('results-count');
    
    if (!container) return;
    
    if (resultsCount) {
        resultsCount.textContent = products.length;
    }
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px;">No products found</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22300%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E${product.name}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">Rs ${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <a href="product.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                </div>
            </div>
        </div>
    `).join('');
}

function setupCategoryListeners() {
    // Sort options
    const sortSelect = document.getElementById('sort-options');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
    
    // Price range filters
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    
    if (priceMin && priceMax) {
        priceMin.addEventListener('input', function() {
            document.getElementById('min-value').textContent = this.value;
            filterByPrice();
        });
        
        priceMax.addEventListener('input', function() {
            document.getElementById('max-value').textContent = this.value;
            filterByPrice();
        });
    }
}

function sortProducts(sortBy) {
    let sorted = [...filteredProducts];
    
    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sorted.sort((a, b) => b.id - a.id);
            break;
        case 'rating':
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        default:
            // Featured - keep original order
            break;
    }
    
    displayProducts(sorted);
}

function filterByPrice() {
    const min = parseInt(document.getElementById('price-min').value);
    const max = parseInt(document.getElementById('price-max').value);
    
    const filtered = allProducts.filter(p => {
        const matchesCategory = !currentCategory || p.category === currentCategory;
        const matchesPrice = p.price >= min && p.price <= max;
        return matchesCategory && matchesPrice;
    });
    
    displayProducts(filtered);
}