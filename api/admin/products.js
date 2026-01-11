// API endpoint for admin products management
// This works with Vercel Serverless Functions

const products = [
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

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        return res.status(200).json(products);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}