import express from 'express';
import Outfit from '../models/Outfit.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const outfits = await Outfit.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(outfits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, items } = req.body;

    if (!name || !items || items.length === 0) {
      return res.status(400).json({ message: 'Name and items are required' });
    }

    const outfit = new Outfit({
      userId: req.user.userId,
      name,
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.discountPrice || item.price,
        category: item.category,
        image: item.images?.[0] || ''
      }))
    });

    await outfit.save();
    res.status(201).json(outfit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const outfit = await Outfit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }
    res.json({ message: 'Outfit deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;