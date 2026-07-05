import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import sampleProducts from './seeds/products.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    await connectDB();

    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Database already has ${existingCount} products`);
      // Automatically clear for fresh seed
      await Product.deleteMany({});
      console.log('🗑️  Cleared existing products');
    }

    const created = await Product.insertMany(sampleProducts);
    console.log(`\n✅ Successfully added ${created.length} products!\n`);

    const categories = await Product.distinct('category');
    console.log('📂 Categories created:');
    categories.forEach(cat => console.log(`  • ${cat}`));

    const totalStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$stock' } } }
    ]);
    console.log(`\n📦 Total stock: ${totalStock[0]?.total || 0} items`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedProducts();
