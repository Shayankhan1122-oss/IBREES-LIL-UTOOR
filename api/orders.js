// API endpoint for orders
// This works with Vercel Serverless Functions

// Note: In serverless, data doesn't persist
// You'll need a database for production

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        const { items, shippingAddress, paymentMethod } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in order' });
        }
        
        // Calculate total
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Create order response
        const newOrder = {
            id: Date.now(),
            orderNumber: `QWS-2025-${String(Date.now()).slice(-6)}`,
            userId: 1,
            items,
            total,
            status: "processing",
            date: new Date().toISOString().split('T')[0],
            shippingAddress,
            paymentMethod
        };
        
        return res.status(201).json(newOrder);
    }

    if (req.method === 'GET') {
        // Return empty array (no database)
        return res.status(200).json([]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}