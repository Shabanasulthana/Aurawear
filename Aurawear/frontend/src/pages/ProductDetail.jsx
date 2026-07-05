import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import axios from 'axios';
import { Heart, ShoppingCart, Loader, Star } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { token, isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
      if (response.data.sizes?.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
      if (response.data.colors?.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }
    } catch (error) {
      console.error('Failed to fetch product');
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedSize && product.sizes?.length > 0) {
      alert('Please select a size');
      return;
    }

    if (!selectedColor && product.colors?.length > 0) {
      alert('Please select a color');
      return;
    }

    setAdding(true);
    const result = await addToCart(token, id, quantity, selectedSize, selectedColor);

    if (result.success) {
      alert('✅ Added to cart! View your cart to checkout.');
      setQuantity(1);
    } else {
      alert(result.error || 'Failed to add to cart');
    }
    setAdding(false);
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/wishlist/add`,
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('❤️ Added to wishlist!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={32} className="animate-spin text-secondary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-secondary hover:underline font-bold"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-200 rounded-lg aspect-square mb-4 overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx}`}
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>

          {product.rating > 0 && (
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews?.length || 0} reviews)</span>
            </div>
          )}

          <p className="text-gray-600 mb-6 text-lg">{product.description}</p>

          <div className="flex items-baseline space-x-4 mb-6">
            <span className="text-4xl font-bold text-secondary">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-xl text-gray-500 line-through">
                ${product.price}
              </span>
            )}
          </div>

          {product.stock > 0 ? (
            <p className="text-green-600 font-bold mb-6">In Stock</p>
          ) : (
            <p className="text-red-600 font-bold mb-6">Out of Stock</p>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-lg font-bold transition ${
                      selectedSize === size
                        ? 'border-secondary bg-secondary text-primary'
                        : 'border-gray-300 hover:border-secondary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-lg font-bold transition ${
                      selectedColor === color
                        ? 'border-secondary bg-secondary text-primary'
                        : 'border-gray-300 hover:border-secondary'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-bold mb-3">Quantity</label>
            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-6 py-2 font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
            </button>
            <button
              onClick={handleAddToWishlist}
              className="flex-1 border-2 border-secondary text-secondary py-3 rounded-lg font-bold hover:bg-secondary hover:text-primary transition flex items-center justify-center space-x-2"
            >
              <Heart size={20} />
              <span>Wishlist</span>
            </button>
          </div>

          {product.material && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-bold mb-2">Material</h3>
              <p className="text-gray-600">{product.material}</p>
            </div>
          )}

          {product.careInstructions && (
            <div className="mt-6">
              <h3 className="font-bold mb-2">Care Instructions</h3>
              <p className="text-gray-600">{product.careInstructions}</p>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => navigate(`/try-on/${product._id}`)}
              className="w-full bg-secondary text-primary py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
            >
              Try On With AR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
