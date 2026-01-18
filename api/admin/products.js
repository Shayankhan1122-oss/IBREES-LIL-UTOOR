// API endpoint for admin products management
// This works with Vercel Serverless Functions

// In-memory products storage (will reset on deployment)
// For production, replace with a real database
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
        sku: "PR-001",
        status: "active"
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
        sku: "CL-001",
        status: "active"
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
        sku: "AG-001",
        status: "active"
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
        sku: "HT-001",
        status: "active"
    }
];

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // GET - Fetch all products
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            products: products
        });
    }

    // POST - Add new product
    if (req.method === 'POST') {
        try {
            const newProduct = req.body;
            
            // Generate new ID
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            
            const product = {
                id: newId,
                name: newProduct.name,
                sku: newProduct.sku,
                category: newProduct.category,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
                status: newProduct.status || 'active',
                description: newProduct.description || '',
                image: newProduct.image || 'images/products/placeholder.jpg',
                rating: 0
            };
            
            products.push(product);
            
            return res.status(201).json({
                success: true,
                message: 'Product added successfully',
                product: product
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: 'Failed to add product',
                message: error.message
            });
        }
    }

    // PUT - Update existing product
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const updates = req.body;
            
            const index = products.findIndex(p => p.id === parseInt(id));
            
            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }
            
            // Update product
            products[index] = {
                ...products[index],
                ...updates,
                id: products[index].id, // Preserve ID
                price: parseFloat(updates.price),
                stock: parseInt(updates.stock)
            };
            
            return res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                product: products[index]
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: 'Failed to update product',
                message: error.message
            });
        }
    }

    // DELETE - Remove product
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            
            const index = products.findIndex(p => p.id === parseInt(id));
            
            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }
            
            const deletedProduct = products.splice(index, 1)[0];
            
            return res.status(200).json({
                success: true,
                message: 'Product deleted successfully',
                product: deletedProduct
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: 'Failed to delete product',
                message: error.message
            });
        }
    }

    return res.status(405).json({
        success: false,
        error: 'Method not allowed'
    });
}