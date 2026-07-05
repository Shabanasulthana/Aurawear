import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import wishlistRoutes from './routes/wishlist.js';
import couponRoutes from './routes/coupons.js';
import paymentRoutes from './routes/payments.js';
import analyticsRoutes from './routes/analytics.js';
import outfitRoutes from './routes/outfits.js';
import Product from './models/Product.js';
import sampleProducts from './seeds/products.js';
import aurawearProducts from './seeds/aurawear-products.js';
import bulkProducts from './seeds/bulk-import.js';
import extendedProducts from './seeds/extended-catalog.js';
import premiumProducts from './seeds/premium-catalog.js';
import eliteProducts from './seeds/elite-catalog.js';
import ultraProducts from './seeds/ultra-catalog.js';
import premiumPlusProducts from './seeds/premium-plus-catalog.js';
import premiumDeluxeProducts from './seeds/premium-deluxe-catalog.js';
import premiumLuxuryProducts from './seeds/premium-luxury-catalog.js';
import premiumEliteProducts from './seeds/premium-elite-catalog.js';
import premiumUltimateProducts from './seeds/premium-ultimate-catalog.js';
import premiumFinalProducts from './seeds/premium-final-catalog.js';
import premiumExtendedProducts from './seeds/premium-extended-catalog.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

connectDB();

// Auto-seed database if empty or if count is less than expected
const seedDatabaseIfEmpty = async () => {
  try {
    // Wait for connection to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    const productCount = await Product.countDocuments();

    // Combine all product catalogs
    const allProducts = [
      ...sampleProducts,
      ...aurawearProducts,
      ...bulkProducts,
      ...extendedProducts,
      ...premiumProducts,
      ...eliteProducts,
      ...ultraProducts,
      ...premiumPlusProducts,
      ...premiumDeluxeProducts,
      ...premiumLuxuryProducts,
      ...premiumEliteProducts,
      ...premiumUltimateProducts,
      ...premiumFinalProducts,
      ...premiumExtendedProducts
    ];

    const expectedCount = allProducts.length;

    if (productCount === 0) {
      console.log('📦 Database is empty. Seeding all products...');
      try {
        await Product.insertMany(allProducts, { ordered: false });
        const categories = await Product.distinct('category');
        console.log(`✅ Successfully seeded ${allProducts.length} products!`);
        console.log('📂 Categories created:');
        categories.forEach(cat => console.log(`  • ${cat}`));
      } catch (insertError) {
        if (insertError.code === 11000) {
          console.log('⚠️  Some duplicate products found, skipping duplicates...');
        } else {
          throw insertError;
        }
      }
    } else if (productCount < expectedCount) {
      console.log(`⚠️  Database has ${productCount} products, expected ${expectedCount}. Adding missing products...`);
      try {
        await Product.insertMany(allProducts, { ordered: false });
        const newCount = await Product.countDocuments();
        const categories = await Product.distinct('category');
        console.log(`✅ Total products in database: ${newCount}`);
        console.log('📂 Categories:');
        categories.forEach(cat => console.log(`  • ${cat}`));
      } catch (insertError) {
        if (insertError.code === 11000) {
          const newCount = await Product.countDocuments();
          console.log(`✅ Inserted missing products. Total in database: ${newCount}`);
        } else {
          throw insertError;
        }
      }
    } else {
      console.log(`✅ Database has ${productCount} products (expected ${expectedCount})`);
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
};

seedDatabaseIfEmpty();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/outfits', outfitRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AuraWear server running on port ${PORT}`);
});
