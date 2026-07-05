import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        
        <p className="text-gray-600 mb-2">Thank you for your order</p>
        
        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: <span className="font-mono font-bold">{orderId}</span>
          </p>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/orders"
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <Package size={20} />
            View Orders
          </Link>
          <Link
            to="/products"
            className="w-full border border-gray-300 text-primary py-3 rounded-lg font-bold hover:border-secondary transition flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}