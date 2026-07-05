import express from 'express';
import Product from '../models/Product.js';
import bulkProducts from '../seeds/bulk-import.js';
import extendedProducts from '../seeds/extended-catalog.js';
import premiumProducts from '../seeds/premium-catalog.js';
import eliteProducts from '../seeds/elite-catalog.js';
import ultraProducts from '../seeds/ultra-catalog.js';
import premiumPlusProducts from '../seeds/premium-plus-catalog.js';
import premiumDeluxeProducts from '../seeds/premium-deluxe-catalog.js';
import premiumLuxuryProducts from '../seeds/premium-luxury-catalog.js';
import premiumEliteProducts from '../seeds/premium-elite-catalog.js';
import premiumUltimateProducts from '../seeds/premium-ultimate-catalog.js';
import premiumFinalProducts from '../seeds/premium-final-catalog.js';
import premiumExtendedProducts from '../seeds/premium-extended-catalog.js';

const router = express.Router();

router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all/list', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) filter.category = category;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({
      products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/debug/status', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const categories = await Product.distinct('category');
    const sampleProduct = await Product.findOne();
    res.json({
      totalProducts: count,
      categories: categories.length > 0 ? categories : [],
      sampleProduct: sampleProduct ? {
        name: sampleProduct.name,
        category: sampleProduct.category,
        hasImages: sampleProduct.images && sampleProduct.images.length > 0,
        imageCount: sampleProduct.images ? sampleProduct.images.length : 0
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, category, sortBy, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;

    let sortOptions = {};
    if (sortBy === 'price-low') sortOptions.price = 1;
    if (sortBy === 'price-high') sortOptions.price = -1;
    if (sortBy === 'rating') sortOptions.rating = -1;
    if (sortBy === 'newest') sortOptions.createdAt = -1;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/import/bulk', async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: 'Products must be an array' });
    }

    const inserted = await Product.insertMany(products, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} products`,
      count: inserted.length,
      products: inserted
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate SKU found', error: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/default', async (req, res) => {
  try {
    const inserted = await Product.insertMany(bulkProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} default products`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/extended', async (req, res) => {
  try {
    const inserted = await Product.insertMany(extendedProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} extended products (IDs 100-170)`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/premium', async (req, res) => {
  try {
    const inserted = await Product.insertMany(premiumProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} premium products (IDs 180-250)`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/elite', async (req, res) => {
  try {
    const inserted = await Product.insertMany(eliteProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} elite products (IDs 251-320)`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/ultra', async (req, res) => {
  try {
    const inserted = await Product.insertMany(ultraProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} ultra products (IDs 321-370)`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/premium-plus', async (req, res) => {
  try {
    const inserted = await Product.insertMany(premiumPlusProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} premium plus products (IDs 421-500)`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/premium-deluxe', async (req, res) => {
  try {
    const inserted = await Product.insertMany(premiumDeluxeProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} premium deluxe products (IDs 501-550)`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/premium-luxury', async (req, res) => {
  try {
    const inserted = await Product.insertMany(premiumLuxuryProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} premium luxury products (IDs 551-620)`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/premium-elite', async (req, res) => {
  try {
    const inserted = await Product.insertMany(premiumEliteProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} premium elite products (IDs 621-697)`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/premium-ultimate', async (req, res) => {
  try {
    const inserted = await Product.insertMany(premiumUltimateProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} premium ultimate products (IDs 700-750)`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/premium-final', async (req, res) => {
  try {
    const inserted = await Product.insertMany(premiumFinalProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} premium final products (IDs 780-830)`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/import/premium-extended', async (req, res) => {
  try {
    const inserted = await Product.insertMany(premiumExtendedProducts, { ordered: false });
    res.status(201).json({
      message: `Successfully imported ${inserted.length} premium extended products (IDs 893-955)`,
      count: inserted.length
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some products already exist' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/admin/reseed-all', async (req, res) => {
  try {
    // Combine all products
    const allProducts = [
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

    // Clear existing products
    await Product.deleteMany({});
    console.log('✅ Cleared old products');

    // Insert all products with duplicate handling
    const inserted = await Product.insertMany(allProducts, { ordered: false });
    const categories = await Product.distinct('category');

    res.status(201).json({
      message: `✅ Successfully reseeded database with all products`,
      inserted: inserted.length,
      total: await Product.countDocuments(),
      categories: categories
    });
  } catch (error) {
    if (error.code === 11000) {
      const count = await Product.countDocuments();
      res.status(201).json({
        message: 'Seeded with some duplicates skipped',
        total: count
      });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

export default router;
