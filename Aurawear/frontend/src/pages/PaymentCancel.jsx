import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, Home } from 'lucide-react';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={48} className="text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
        
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. Your cart is still saved and you can try again.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/checkout"
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            Return to Checkout
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