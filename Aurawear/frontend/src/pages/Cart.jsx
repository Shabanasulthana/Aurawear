import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ShoppingCart, Loader } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const { token, isAuthenticated } = useAuthStore();
  const { getCart, updateCartItem, removeFromCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    setLoading(true);
    const cartData = await getCart(token);
    setCart(cartData);
    setLoading(false);
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(token, itemId, newQuantity);
    await loadCart();
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(token, itemId);
    await loadCart();
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/coupons/validate`,
        { code: couponCode, totalAmount: getSubtotal() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCouponDiscount(response.data.discount);
      setAppliedCoupon(couponCode);
      setCouponCode('');
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid coupon');
    }
  };

  const getSubtotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.productId?.discountPrice || item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = getSubtotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = (subtotal - couponDiscount) * 0.1;
  const total = subtotal - couponDiscount + shipping + tax;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600 mb-4">Please login to view your cart</p>
        <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={32} className="animate-spin text-secondary" />
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add some items to get started!</p>
          <Link to="/products" className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6 flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                  {item.productId?.images?.[0] ? (
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{item.productId?.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && ' | '}
                    {item.color && `Color: ${item.color}`}
                  </p>
                  <p className="text-secondary font-bold text-lg mt-2">
                    ${item.productId?.discountPrice || item.productId?.price}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="font-bold">
                    ${((item.productId?.discountPrice || item.productId?.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/products" className="text-secondary hover:underline mt-6 inline-block font-bold">
            ← Continue Shopping
          </Link>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 space-y-6">
            <h2 className="text-2xl font-bold">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon ({appliedCoupon}):</span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="border-t-2 pt-3 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon"
                  className="flex-grow border border-gray-300 rounded-lg p-2"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-secondary text-primary px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition"
                >
                  Apply
                </button>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
