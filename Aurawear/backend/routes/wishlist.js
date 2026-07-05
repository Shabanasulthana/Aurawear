import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.userId })
      .populate('products.productId');
    
    if (!wishlist) {
      wishlist = { products: [] };
    }
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId: req.user.userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.userId, products: [] });
    }

    const productExists = wishlist.products.some(
      p => p.productId.toString() === productId
    );

    if (!productExists) {
      wishlist.products.push({ productId });
    }

    await wishlist.save();
    await wishlist.populate('products.productId');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.userId });
    wishlist.products = wishlist.products.filter(
      p => p.productId.toString() !== req.params.productId
    );
    await wishlist.save();
    await wishlist.populate('products.productId');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
