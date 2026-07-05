import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const completedOrders = await Order.countDocuments({ paymentStatus: 'completed' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$finalPrice' } } }
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/sales', verifyAdmin, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;

    let groupBy;
    if (period === 'daily') {
      groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (period === 'weekly') {
      groupBy = { $week: '$createdAt' };
    } else {
      groupBy = { $month: '$createdAt' };
    }

    const sales = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: {
        _id: groupBy,
        total: { $sum: '$finalPrice' },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/top-products', verifyAdmin, async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $unwind: '$items' },
      { $group: {
        _id: '$items.productId',
        name: { $first: '$items.name' },
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/category-sales', verifyAdmin, async (req, res) => {
  try {
    const categorySales = await Product.aggregate([
      { $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
        avgPrice: { $avg: '$price' }
      }}
    ]);

    res.json(categorySales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
