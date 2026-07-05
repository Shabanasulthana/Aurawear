import mongoose from 'mongoose';

const outfitSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  name: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    category: String,
    image: String
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Outfit', outfitSchema);