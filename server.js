// Backend API for Qari Webstore
// This is a simplified version for demonstration purposes

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory data storage (in a real application, you would use a database)
let products = [
    {
        id: 1,
        name: "Premium Perfume",
        price: 49.99,
        category: "fragrances",
        image: "images/products/perfume1.jpg",
        rating: 4.5,
        description: "Luxury perfume with long-lasting fragrance",
        stock: 25,
        sku: "PR-001"
    },
    {
        id: 2,
        name: "Cotton Kurta",
        price: 29.99,
        category: "clothes",
        image: "images/products/kurta1.jpg",
        rating: 4.2,
        description: "Comfortable cotton kurta for daily wear",
        stock: 15,
        sku: "CL-001"
    },
    {
        id: 3,
        name: "Pure Desi Ghee",
        price: 19.99,
        category: "agricultural",
        image: "images/products/ghee1.jpg",
        rating: 4.8,
        description: "Pure desi ghee made from cow milk",
        stock: 40,
        sku: "AG-001"
    },
    {
        id: 4,
        name: "Prayer Mat",
        price: 39.99,
        category: "home-textiles",
        image: "images/products/mat1.jpg",
        rating: 4.3,
        description: "Soft and comfortable prayer mat",
        stock: 8,
        sku: "HT-001"
    }
];

// Users database - ONLY ONE ADMIN ALLOWED
let users = [
    {
        id: 1,
        email: "huzaifamadani95@gmail.com",
        password: "636363", // In production, this should be hashed!
        name: "Admin User",
        phone: "+92 300 1234567",
        isAdmin: true
    }
    // Regular customers will be added through registration
];

let orders = [
    {
        id: 1,
        orderNumber: "QWS-2025-001234",
        userId: 1,
        items: [
            { productId: 1, name: "Premium Perfume", price: 49.99, quantity: 1 },
            { productId: 2, name: "Cotton Kurta", price: 29.99, quantity: 2 }
        ],
        total: 109.97,
        status: "delivered",
        date: "2024-12-28",
        shippingAddress: {
            firstName: "John",
            lastName: "Doe",
            address: "123 Main Street",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "United States",
            phone: "+1 (555) 123-4567",
            email: "customer@example.com"
        },
        paymentMethod: "Credit/Debit Card"
    }
];

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// Login endpoint - For both admin and regular users
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            error: 'Email and password are required' 
        });
    }

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ 
            success: false,
            error: 'Invalid credentials' 
        });
    }

    // Verify password
    if (user.password !== password) {
        return res.status(401).json({ 
            success: false,
            error: 'Invalid credentials' 
        });
    }

    // STRICT CHECK: Only the authorized admin can have isAdmin=true
    // If someone tries to login with admin credentials but isn't the authorized admin, deny
    const isAuthorizedAdmin = (user.email === 'huzaifamadani95@gmail.com' && user.isAdmin === true);
    
    // Return user data (NEVER send password back)
    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: isAuthorizedAdmin // Only true for the specific admin email
        }
    });
});

// Register endpoint - For regular customers only
app.post('/api/auth/register', (req, res) => {
    const { email, password, name, phone } = req.body;

    // Validate input
    if (!email || !password || !name) {
        return res.status(400).json({ 
            success: false,
            error: 'Email, password, and name are required' 
        });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ 
            success: false,
            error: 'User already exists with this email' 
        });
    }

    // Prevent registration with admin email
    if (email === 'huzaifamadani95@gmail.com') {
        return res.status(403).json({ 
            success: false,
            error: 'This email is reserved' 
        });
    }

    // Create new user (NOT admin)
    const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        email,
        password, // In production, hash this!
        name,
        phone: phone || '',
        isAdmin: false // Regular users are never admins
    };

    users.push(newUser);
    
    res.status(201).json({
        success: true,
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            isAdmin: false
        }
    });
});

// ============================================
// PUBLIC API ENDPOINTS
// ============================================

// Products API
app.get('/api/products', (req, res) => {
    const { category, search } = req.query;
    let filteredProducts = products;
    
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (search) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) || 
            p.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Categories API
app.get('/api/categories', (req, res) => {
    const categories = [
        { id: 'fragrances', name: 'Fragrances', description: 'Attar & Perfumes' },
        { id: 'clothes', name: 'Clothes', description: 'Male & Female' },
        { id: 'agricultural', name: 'Agricultural Products', description: 'Desi Ghee, Honey, Eggs' },
        { id: 'home-textiles', name: 'Home Textiles', description: 'Blankets, Prayer Mats' }
    ];
    res.json(categories);
});

// Orders API - Public (for customers)
app.post('/api/orders', (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No items in order' });
    }
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create new order
    const newOrder = {
        id: Math.max(...orders.map(o => o.id), 0) + 1,
        orderNumber: `QWS-2025-${String(Math.max(...orders.map(o => parseInt(o.orderNumber.split('-')[2])), 0) + 1).padStart(6, '0')}`,
        userId: 1, // In a real app, this would be from the authenticated user
        items,
        total,
        status: "processing",
        date: new Date().toISOString().split('T')[0],
        shippingAddress,
        paymentMethod
    };
    
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

app.get('/api/orders', (req, res) => {
    // In a real app, you would get orders for the authenticated user
    res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
});

// Cart API
app.get('/api/cart', (req, res) => {
    // In a real app, this would return the cart for the authenticated user
    res.json([]);
});

app.post('/api/cart', (req, res) => {
    // In a real app, this would add an item to the cart
    res.json({ success: true });
});

// ============================================
// ADMIN-ONLY API ENDPOINTS
// Note: In a real app, these would be protected with middleware
// that verifies the user is an admin via JWT tokens or sessions
// ============================================

// Admin Products Management
app.get('/api/admin/products', (req, res) => {
    // In production, verify admin authentication here
    res.json(products);
});

app.post('/api/admin/products', (req, res) => {
    // In production, verify admin authentication here
    const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        ...req.body
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', (req, res) => {
    // In production, verify admin authentication here
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    products[productIndex] = { ...products[productIndex], ...req.body };
    res.json(products[productIndex]);
});

app.delete('/api/admin/products/:id', (req, res) => {
    // In production, verify admin authentication here
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    products.splice(productIndex, 1);
    res.status(204).send();
});

// Admin Orders Management
app.get('/api/admin/orders', (req, res) => {
    // In production, verify admin authentication here
    res.json(orders);
});

app.put('/api/admin/orders/:id', (req, res) => {
    // In production, verify admin authentication here
    const orderId = parseInt(req.params.id);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    orders[orderIndex] = { ...orders[orderIndex], ...req.body };
    res.json(orders[orderIndex]);
});

// Admin Dashboard Stats
app.get('/api/admin/stats', (req, res) => {
    // In production, verify admin authentication here
    const stats = {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        lowStockProducts: products.filter(p => p.stock < 10).length,
        pendingOrders: orders.filter(o => o.status === 'processing').length
    };
    res.json(stats);
});

// ============================================
// SERVE STATIC FILES
// ============================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// START SERVER - FIXED FOR RAILWAY
// ============================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔐 Admin credentials: huzaifamadani95@gmail.com / 636363`);
    console.log(`📦 Ready to accept connections on 0.0.0.0:${PORT}`);
});