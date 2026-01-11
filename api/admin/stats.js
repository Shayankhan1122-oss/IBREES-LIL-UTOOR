// API endpoint for admin dashboard stats
// This works with Vercel Serverless Functions

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
        // Return demo stats
        const stats = {
            totalProducts: 4,
            totalOrders: 1,
            totalRevenue: 109.97,
            lowStockProducts: 1,
            pendingOrders: 0
        };
        
        return res.status(200).json(stats);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}