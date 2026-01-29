// API endpoint for guest orders
// Handles order creation and retrieval with admin notification

// In-memory order storage (use database in production)
const orders = [];

// Admin email for notifications
const ADMIN_EMAIL = 'huzaifamadani95@gmail.com';

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // POST - Create new order
    if (req.method === 'POST') {
        try {
            const orderData = req.body;
            
            // Validate required fields
            if (!orderData.orderId || !orderData.customer || !orderData.items) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required order information'
                });
            }
            
            // Validate customer info
            if (!orderData.customer.email || !orderData.customer.fullName) {
                return res.status(400).json({
                    success: false,
                    error: 'Customer name and email are required'
                });
            }
            
            // Add order to storage
            orders.push(orderData);
            
            // Log order for admin (in production, this would send email/notification)
            console.log('=== NEW ORDER RECEIVED ===');
            console.log('Order ID:', orderData.orderId);
            console.log('Customer:', orderData.customer.fullName);
            console.log('Email:', orderData.customer.email);
            console.log('Phone:', orderData.customer.phone);
            console.log('Total:', orderData.total);
            console.log('Items:', orderData.items.length);
            console.log('Payment Method:', orderData.paymentMethod);
            console.log('Status: PENDING - Awaiting admin confirmation');
            console.log('========================');
            
            // In production, send email notification to admin here
            // Example: sendAdminNotificationEmail(orderData);
            
            // Return success with order details
            return res.status(200).json({
                success: true,
                orderId: orderData.orderId,
                trackingToken: orderData.trackingToken,
                message: 'Order placed successfully. Admin has been notified.',
                trackingUrl: `/track-order.html?order=${orderData.orderId}&token=${orderData.trackingToken}`,
                adminNotified: true,
                note: 'Your order is pending admin confirmation. You will receive updates via email.'
            });
            
        } catch (error) {
            console.error('Order creation error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to process order'
            });
        }
    }
    
    // GET - Retrieve orders (for admin dashboard)
    if (req.method === 'GET') {
        // Return all orders sorted by newest first
        const sortedOrders = orders.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        return res.status(200).json({
            success: true,
            orders: sortedOrders,
            totalOrders: sortedOrders.length,
            pendingOrders: sortedOrders.filter(o => o.status === 'pending').length
        });
    }
    
    // PUT - Update order status
    if (req.method === 'PUT') {
        try {
            const { orderId, status } = req.body;
            
            // Validate required fields
            if (!orderId || !status) {
                return res.status(400).json({
                    success: false,
                    error: 'Order ID and status are required'
                });
            }
            
            // Find order
            const orderIndex = orders.findIndex(o => o.orderId === orderId);
            
            if (orderIndex === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Order not found'
                });
            }
            
            // Update order status
            orders[orderIndex].status = status;
            orders[orderIndex].updatedAt = new Date().toISOString();
            
            // Log status change
            console.log('=== ORDER STATUS UPDATED ===');
            console.log('Order ID:', orderId);
            console.log('New Status:', status);
            console.log('Updated At:', orders[orderIndex].updatedAt);
            console.log('==========================');
            
            // Return success
            return res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                order: orders[orderIndex]
            });
            
        } catch (error) {
            console.error('Order update error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to update order status'
            });
        }
    }
    
    // Method not allowed
    return res.status(405).json({
        success: false,
        error: 'Method not allowed'
    });
}