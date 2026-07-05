# AuraWear X - Enterprise Fashion Commerce Platform

Complete e-commerce platform with virtual try-on AR feature, secure payments, and admin management.

## Project Structure

```
AuraWear/
├── backend/          # Node.js + Express + MongoDB
│   ├── config/       # Database and configuration
│   ├── middleware/   # Authentication middleware
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   └── server.js     # Main server file
└── frontend/         # React + Vite + TailwindCSS
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── store/         # Zustand state management
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js
```

## Features Implemented

### 1. Authentication
- Email/Password registration and login
- Google OAuth integration (API setup required)
- OTP-based authentication
- JWT token management
- Protected routes

### 2. Product Management
- Browse and search products
- Filter by category
- Sort by price, rating, newest
- Product details with reviews
- Stock management
- Admin product CRUD operations

### 3. Shopping Experience
- Add to cart / Remove from cart
- Update quantities
- Wishlist management
- Cart persistence

### 4. Virtual Try-On (Unique Feature)
- 2D AR using HTML5 Canvas
- Real-time camera access
- Clothing overlay simulation
- Capture and download preview images
- Size and color selection

### 5. Checkout & Payments
- Multi-step checkout process
- Shipping address management
- Multiple payment methods (Card, UPI, Wallet)
- Stripe integration (set API keys)
- Order summary with calculations

### 6. Order Management
- Order history
- Order tracking
- Status updates
- Admin order management dashboard

### 7. Coupon System
- Apply discount codes
- Percentage and fixed discounts
- Usage limits and date ranges
- Admin coupon management

### 8. Admin Dashboard
- Analytics and statistics
- Order management
- Product management
- Revenue tracking
- Recent orders overview

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Environment Variables**
Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aurawear
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

NODE_ENV=development
```

3. **Start MongoDB**
```bash
# Make sure MongoDB is running on your system
# For local development:
mongod
```

4. **Run Backend**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Environment Variables**
Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

3. **Run Development Server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google authentication
- `POST /api/auth/otp-send` - Send OTP
- `POST /api/auth/otp-verify` - Verify OTP
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `GET /api/products/categories/all` - Get all categories

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders/create` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin)
- `PUT /api/orders/:id/payment` - Update payment status (admin)
- `GET /api/orders/admin/all` - Get all orders (admin)

### Coupons
- `GET /api/coupons` - Get available coupons
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons` - Create coupon (admin)
- `PUT /api/coupons/:id` - Update coupon (admin)
- `DELETE /api/coupons/:id` - Delete coupon (admin)

### Payments
- `POST /api/payments/stripe-checkout` - Create Stripe session
- `POST /api/payments/upi-payment` - Process UPI payment
- `POST /api/payments/verify-payment` - Verify payment

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats (admin)
- `GET /api/analytics/sales` - Sales data (admin)
- `GET /api/analytics/top-products` - Top products (admin)
- `GET /api/analytics/category-sales` - Category sales (admin)

## Default Admin Credentials

To create an admin account, you need to manually update the user role in MongoDB or modify the backend to include a registration flag.

```javascript
// In MongoDB, update a user:
db.users.updateOne(
  { email: "admin@aurawear.com" },
  { $set: { role: "admin" } }
)
```

## Testing the Application

### Test Account
1. Register a new account
2. Or use OTP login (any 6-digit code works in development)

### Test Products
Add sample products in Admin > Manage Products:
- Dresses, Tops, Bottoms, Outerwear
- Include multiple colors and sizes
- Add descriptions and prices

### Test Virtual Try-On
1. Go to any product
2. Click "Try On" button
3. Allow camera access
4. Select size/color
5. Click "Start Camera"
6. Position yourself and click "Capture & Download"

### Test Payments
Use Stripe test cards:
- `4242 4242 4242 4242` - Visa (success)
- `5555 5555 5555 4444` - Mastercard (success)
- Any future expiry date and CVC

## Key Technologies

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Stripe** - Payments

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Framer Motion** - Animations

## Features Details

### Virtual Try-On (2D AR)
- Uses HTML5 Canvas API for image processing
- Captures camera feed in real-time
- Applies color overlay to simulate clothing
- Downloads preview as PNG image
- No external AR library required

### Security
- Password hashing with bcryptjs
- JWT tokens for authentication
- Protected routes and admin endpoints
- CORS enabled for frontend
- Environment variables for sensitive data

### Responsive Design
- Mobile-first approach
- Tailwind CSS for responsive layouts
- Works on desktop, tablet, and mobile
- Touch-friendly buttons and inputs

## Deployment

### Backend Deployment (Heroku example)
```bash
heroku login
heroku create aurawear-backend
git push heroku main
```

### Frontend Deployment (Vercel example)
```bash
npm install -g vercel
vercel
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify firewall settings

### CORS Error
- Ensure `VITE_API_URL` matches backend URL
- Check CORS configuration in backend

### Payment Not Working
- Verify Stripe API keys
- Check Stripe webhook configuration
- Use test cards for testing

### Virtual Try-On Camera Access Denied
- Check browser permissions
- Use HTTPS in production
- Ensure camera is available

## Future Enhancements
- 3D AR model try-on
- Video tutorials
- Live chat support
- Loyalty program
- Recommendation engine
- Mobile app (React Native)
- Advanced analytics
- Email notifications

## Support
For issues or questions, contact: hello@aurawear.com

## License
MIT License - Feel free to use this project

---

**Built with ❤️ for Fashion Commerce**
