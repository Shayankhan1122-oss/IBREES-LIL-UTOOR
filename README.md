# Qari Webstore - Complete E-Commerce Solution

## Project Overview

Qari Webstore is a complete e-commerce website for selling products across four main categories: Fragrances, Clothes, Agricultural Products, and Home Textiles.

## Features

### Frontend Features
- Responsive design (mobile-first approach)
- Modern UI/UX with smooth animations
- Product browsing and search functionality
- Shopping cart with add/remove/update functionality
- User account system (register, login, profile management)
- Product reviews and ratings
- Wishlist functionality
- Order tracking

### Backend Features
- RESTful API architecture
- User authentication and authorization
- Product management system
- Order management system
- Payment processing integration
- Inventory management
- Admin dashboard

### Categories
1. **Fragrances** - Attar & Perfumes
2. **Clothes** - Male & Female
3. **Agricultural Products** - Desi Ghee, Honey, Eggs
4. **Home Textiles** - Blankets, Prayer Mats

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design with CSS Grid and Flexbox
- Font Awesome for icons
- Client-side storage with localStorage

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- Stripe and PayPal for payment processing

### Additional Tools
- CORS for cross-origin requests
- Bcrypt for password hashing
- Multer for file uploads
- Dotenv for environment variables

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qari_webstore
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Public Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `GET /api/categories` - Get all categories
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Protected Routes (require authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

### Admin Routes (require admin authentication)
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## Project Structure

```
qari-webstore/
├── public/                 # Frontend files
│   ├── css/              # CSS files
│   ├── js/               # JavaScript files
│   ├── images/           # Image assets
│   ├── admin/            # Admin panel files
│   └── *.html            # HTML pages
├── src/                  # Backend source files
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Middleware functions
│   ├── controllers/      # Controller functions
│   ├── utils/            # Utility functions
│   └── config/           # Configuration files
├── server.js             # Main server file
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Admin Panel

The admin panel provides comprehensive management capabilities:

- Dashboard with sales analytics
- Product management (add, edit, delete)
- Category management
- Order management
- Customer management
- Inventory management
- Reports and analytics
- Settings management

## Security Features

- Password encryption with bcrypt
- JWT-based authentication
- Input validation and sanitization
- Protection against common vulnerabilities (XSS, CSRF)
- Secure payment processing
- Single admin user constraint (only one admin can be registered)

## Responsive Design

The website is fully responsive and works on:
- Mobile devices (smartphones)
- Tablets
- Desktop computers

## Payment Integration

The system supports multiple payment methods:
- Credit/Debit Cards (via Stripe)
- PayPal
- Cash on Delivery

## Deployment

For production deployment:
1. Set `NODE_ENV=production` in your environment variables
2. Use a process manager like PM2
3. Set up a reverse proxy with Nginx
4. Configure SSL with Let's Encrypt
5. Set up a proper MongoDB database (not local)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact us at info@qariwebstore.com