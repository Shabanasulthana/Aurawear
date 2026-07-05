import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import axios from 'axios';
import { Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const { items } = useCartStore();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'USA'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to load cart');
    }
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.zipcode) {
      setError('Please fill in all address fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_URL}/orders/create`,
        {
          shippingAddress,
          paymentMethod,
          couponCode: couponCode || undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderId = response.data._id;

      if (paymentMethod === 'card') {
        const paymentResponse = await axios.post(
          `${API_URL}/payments/stripe-checkout`,
          { orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        window.location.href = `https://checkout.stripe.com/pay/${paymentResponse.data.sessionId}`;
      } else {
        navigate(`/payment-success?orderId=${orderId}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
    }

    setLoading(false);
  };

  const getOrderTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.productId?.discountPrice || item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = getOrderTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={shippingAddress.name}
                onChange={handleAddressChange}
                className="border border-gray-300 rounded-lg p-3"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={shippingAddress.email}
                onChange={handleAddressChange}
                className="border border-gray-300 rounded-lg p-3"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={shippingAddress.phone}
                onChange={handleAddressChange}
                className="border border-gray-300 rounded-lg p-3 md:col-span-2"
              />

              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={shippingAddress.address}
                onChange={handleAddressChange}
                className="border border-gray-300 rounded-lg p-3 md:col-span-2"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                className="border border-gray-300 rounded-lg p-3"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={shippingAddress.state}
                onChange={handleAddressChange}
                className="border border-gray-300 rounded-lg p-3"
              />

              <input
                type="text"
                name="zipcode"
                placeholder="ZIP Code"
                value={shippingAddress.zipcode}
                onChange={handleAddressChange}
                className="border border-gray-300 rounded-lg p-3"
              />

              <select
                name="country"
                value={shippingAddress.country}
                onChange={handleAddressChange}
                className="border border-gray-300 rounded-lg p-3"
              >
                <option>USA</option>
                <option>Canada</option>
                <option>UK</option>
                <option>Australia</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

            <div className="space-y-3">
              {['card', 'upi', 'wallet'].map((method) => (
                <label key={method} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="capitalize font-bold">{method === 'card' ? 'Credit/Debit Card' : method.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 space-y-6">
            <h2 className="text-2xl font-bold">Order Summary</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart?.items?.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.productId?.name} x{item.quantity}</span>
                  <span>${((item.productId?.discountPrice || item.productId?.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading && <Loader size={20} className="animate-spin" />}
              <span>{loading ? 'Processing...' : 'Place Order'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
