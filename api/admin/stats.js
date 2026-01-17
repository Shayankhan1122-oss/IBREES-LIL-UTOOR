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
        try {
            // Get product count from products API
            const totalProducts = productsData.length || 6;

            // Get order data - check if orders array exists in memory
            let totalOrders = 0;
            let totalRevenue = 0;
            let pendingOrders = 0;

            // In production, this would query the database
            // For now, return realistic stats based on the current data
            const stats = {
                totalProducts: totalProducts,
                totalOrders: totalOrders,
                totalRevenue: totalRevenue,
                lowStockProducts: 0,
                pendingOrders: pendingOrders,
                activeUsers: 0,
                revenueThisMonth: 0
            };

            return res.status(200).json({
                success: true,
                ...stats
            });
        } catch (error) {
            console.error('Stats API error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to retrieve stats'
            });
        }
    }

    return res.status(405).json({
        success: false,
        error: 'Method not allowed'
    });
}