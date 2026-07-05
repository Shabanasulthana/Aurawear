import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import axios from 'axios';
import { Heart, Loader, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const { token } = useAuthStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist');
    }
    setLoading(false);
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API_URL}/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    const result = await addToCart(token, productId, 1, '', '');

    if (result.success) {
      alert('✅ Added to cart!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
    setAddingToCart(prev => ({ ...prev, [productId]: false }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={32} className="animate-spin text-secondary" />
      </div>
    );
  }

  if (!wishlist?.products || wishlist.products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-6">Add items to your wishlist to save for later!</p>
          <Link to="/products" className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.products.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="aspect-square bg-gray-200 overflow-hidden relative">
              {item.productId?.images?.[0] ? (
                <img
                  src={item.productId.images[0]}
                  alt={item.productId.name}
                  className="w-full h-full object-cover hover:scale-110 transition"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <button
                onClick={() => handleRemoveFromWishlist(item.productId._id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-red-100 transition"
              >
                <Heart size={20} className="text-red-600 fill-red-600" />
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 truncate">{item.productId?.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.productId?.description}</p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-secondary">
                  ${item.productId?.discountPrice || item.productId?.price}
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  to={`/product/${item.productId._id}`}
                  className="block w-full bg-primary text-white text-center py-2 rounded-lg font-bold hover:bg-gray-800 transition"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToCart(item.productId._id)}
                  disabled={addingToCart[item.productId._id]}
                  className="w-full border-2 border-secondary text-secondary py-2 rounded-lg font-bold hover:bg-secondary hover:text-primary transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <ShoppingCart size={16} />
                  <span>{addingToCart[item.productId._id] ? 'Adding...' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
