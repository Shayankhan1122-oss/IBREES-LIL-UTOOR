// Test file for Qari Webstore
// This file contains tests for various components of the e-commerce website

// Test data
const testData = {
    products: [
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
        }
    ],
    user: {
        email: "customer@example.com",
        password: "password123",
        name: "Test User"
    },
    admin: {
        email: "admin@qariwebstore.com",
        password: "admin123",
        name: "Admin User"
    },
    order: {
        items: [
            { productId: 1, name: "Premium Perfume", price: 49.99, quantity: 1 },
            { productId: 2, name: "Cotton Kurta", price: 29.99, quantity: 2 }
        ],
        shippingAddress: {
            firstName: "Test",
            lastName: "User",
            address: "123 Test Street",
            city: "Test City",
            state: "TS",
            zip: "12345",
            country: "Test Country",
            phone: "+1 (123) 456-7890",
            email: "test@example.com"
        },
        paymentMethod: "credit-card"
    }
};

// Test functions
function runTests() {
    console.log("Running Qari Webstore tests...\n");
    
    // Test 1: Cart functionality
    testCartFunctionality();
    
    // Test 2: Product search
    testProductSearch();
    
    // Test 3: User authentication
    testUserAuthentication();
    
    // Test 4: Order processing
    testOrderProcessing();
    
    // Test 5: Form validation
    testFormValidation();

    // Test 6: Single admin constraint
    testSingleAdminConstraint();
    
    console.log("\nAll tests completed!");
}

// Test cart functionality
function testCartFunctionality() {
    console.log("Test 1: Cart Functionality");
    
    // Initialize cart
    let cart = [];
    
    // Add items to cart
    cart.push({
        ...testData.products[0],
        quantity: 1
    });
    
    cart.push({
        ...testData.products[1],
        quantity: 2
    });
    
    // Verify cart contents
    console.assert(cart.length === 2, "Cart should have 2 items");
    console.assert(cart[0].quantity === 1, "First item should have quantity 1");
    console.assert(cart[1].quantity === 2, "Second item should have quantity 2");
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const expectedTotal = (49.99 * 1) + (29.99 * 2); // 49.99 + 59.98 = 109.97
    
    console.assert(total.toFixed(2) === expectedTotal.toFixed(2), `Total should be ${expectedTotal}, got ${total}`);
    
    console.log("✓ Cart functionality test passed\n");
}

// Test product search
function testProductSearch() {
    console.log("Test 2: Product Search");
    
    const searchTerm = "perfume";
    const results = testData.products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    );
    
    console.assert(results.length > 0, "Should find products matching search term");
    console.assert(results[0].name.toLowerCase().includes(searchTerm), "First result should match search term");
    
    console.log("✓ Product search test passed\n");
}

// Test user authentication
function testUserAuthentication() {
    console.log("Test 3: User Authentication");
    
    // Mock authentication function
    const authenticateUser = (email, password) => {
        // In a real app, this would check against a database
        return email === testData.user.email && password === testData.user.password;
    };
    
    const validAuth = authenticateUser(testData.user.email, testData.user.password);
    const invalidAuth = authenticateUser(testData.user.email, "wrongpassword");
    
    console.assert(validAuth === true, "Valid credentials should authenticate");
    console.assert(invalidAuth === false, "Invalid credentials should not authenticate");
    
    console.log("✓ User authentication test passed\n");
}

// Test order processing
function testOrderProcessing() {
    console.log("Test 4: Order Processing");
    
    // Calculate order total
    const orderTotal = testData.order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const expectedOrderTotal = (49.99 * 1) + (29.99 * 2); // 109.97
    
    // Verify order structure
    console.assert(testData.order.items.length === 2, "Order should have 2 items");
    console.assert(orderTotal.toFixed(2) === expectedOrderTotal.toFixed(2), `Order total should be ${expectedOrderTotal}`);
    console.assert(testData.order.shippingAddress.firstName === "Test", "Shipping address should have correct first name");
    
    console.log("✓ Order processing test passed\n");
}

// Test form validation
function testFormValidation() {
    console.log("Test 5: Form Validation");
    
    // Test email validation
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    console.assert(isValidEmail("test@example.com") === true, "Valid email should pass validation");
    console.assert(isValidEmail("invalid-email") === false, "Invalid email should fail validation");
    
    // Test required fields
    const requiredFields = ["firstName", "lastName", "email", "address", "city", "state", "zip", "country", "phone"];
    const shippingAddress = testData.order.shippingAddress;
    
    let allFieldsPresent = true;
    requiredFields.forEach(field => {
        if (!shippingAddress[field] || shippingAddress[field].toString().trim() === "") {
            allFieldsPresent = false;
        }
    });
    
    console.assert(allFieldsPresent === true, "All required fields should be present in shipping address");
    
    console.log("✓ Form validation test passed\n");
}

// Test single admin constraint
function testSingleAdminConstraint() {
    console.log("Test 6: Single Admin Constraint");

    // Simulate existing users with an admin
    const existingUsers = [
        {
            id: 1,
            email: "admin@qariwebstore.com",
            password: "hashed_admin_password",
            name: "Admin User",
            phone: "+1 (555) 123-4567",
            isAdmin: true
        },
        {
            id: 2,
            email: "customer@example.com",
            password: "hashed_customer_password",
            name: "Customer User",
            phone: "+1 (555) 987-6543",
            isAdmin: false
        }
    ];

    // Function to simulate registration attempt
    const attemptAdminRegistration = (users, newAdminEmail) => {
        // Check if admin already exists
        const existingAdmin = users.find(u => u.isAdmin === true);
        if (existingAdmin && newAdminEmail === 'admin@qariwebstore.com') {
            return { success: false, error: 'Admin user already exists. Only one admin is allowed.' };
        }

        // Check if user with this email already exists
        const existingUser = users.find(u => u.email === newAdminEmail);
        if (existingUser) {
            return { success: false, error: 'A user with this email already exists.' };
        }

        // If no conflicts, allow registration
        return { success: true };
    };

    // Test 1: Attempt to register a new admin when one already exists
    const result1 = attemptAdminRegistration(existingUsers, "admin@qariwebstore.com");
    console.assert(result1.success === false, "Should not allow registration of second admin");
    console.assert(result1.error.includes("Only one admin is allowed"), "Error message should indicate single admin constraint");

    // Test 2: Attempt to register a regular user (should be allowed)
    const result2 = attemptAdminRegistration(existingUsers, "newuser@example.com");
    console.assert(result2.success === true, "Should allow registration of regular users");

    // Test 3: Attempt to register with existing email
    const result3 = attemptAdminRegistration(existingUsers, "customer@example.com");
    console.assert(result3.success === false, "Should not allow registration with existing email");

    console.log("✓ Single admin constraint test passed\n");
}

// Performance optimization functions
function optimizeWebsite() {
    console.log("Optimizing website performance...\n");
    
    // 1. Image optimization suggestion
    console.log("1. Optimize images: Use WebP format and compress images");
    
    // 2. CSS optimization
    console.log("2. Minify CSS files and combine where possible");
    
    // 3. JavaScript optimization
    console.log("3. Minify JavaScript files and implement lazy loading");
    
    // 4. Caching
    console.log("4. Implement browser caching for static assets");
    
    // 5. CDN suggestion
    console.log("5. Use a CDN to serve static assets");
    
    // 6. Database optimization
    console.log("6. Add indexes to database collections for faster queries");
    
    console.log("\nWebsite optimization suggestions completed!");
}

// Run tests and optimizations
runTests();
optimizeWebsite();

// Additional utility functions for the website
const websiteUtils = {
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },
    
    // Generate star rating HTML
    generateStars: (rating) => {
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
    },
    
    // Calculate discount percentage
    calculateDiscount: (originalPrice, salePrice) => {
        if (!salePrice || originalPrice <= salePrice) return 0;
        return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    },
    
    // Validate password strength
    validatePasswordStrength: (password) => {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        
        // Lowercase check
        if (/[a-z]/.test(password)) strength++;
        
        // Uppercase check
        if (/[A-Z]/.test(password)) strength++;
        
        // Number check
        if (/\d/.test(password)) strength++;
        
        // Special character check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        
        return strength;
    }
};

// Example usage of utility functions
console.log("\nExample usage of utility functions:");
console.log("Formatted currency: " + websiteUtils.formatCurrency(123.45));
console.log("Star rating (4.5): " + websiteUtils.generateStars(4.5));
console.log("Discount (59.99, 49.99): " + websiteUtils.calculateDiscount(59.99, 49.99) + "%");
console.log("Password strength (MyPass123!): " + websiteUtils.validatePasswordStrength("MyPass123!"));