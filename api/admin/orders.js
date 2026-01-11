// API endpoint for admin orders management
// This works with Vercel Serverless Functions

const demoOrders = [
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
        date: "2024-12-28"
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
        return res.status(200).json(demoOrders);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}