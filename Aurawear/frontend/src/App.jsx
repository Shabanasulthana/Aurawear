import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import VirtualTryOn from './pages/VirtualTryOn';
import StyleQuiz from './pages/StyleQuiz';
import OutfitBuilder from './pages/OutfitBuilder';
import Lookbook from './pages/Lookbook';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

export default function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      useAuthStore.setState({ token: savedToken, isLoading: false });

      // Validate stored token in background (non-blocking)
      const validateToken = async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` },
            timeout: 5000
          });
          if (response.data && response.data._id) {
            useAuthStore.setState({
              user: response.data,
              token: savedToken,
              isAuthenticated: true
            });
          } else {
            localStorage.removeItem('token');
            useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
          }
        } catch (error) {
          localStorage.removeItem('token');
          useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
        }
      };

      validateToken();
    } else {
      useAuthStore.setState({ isAuthenticated: false, isLoading: false });
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navigation />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/try-on/:id" element={<VirtualTryOn />} />
            <Route path="/style-quiz" element={<StyleQuiz />} />
            <Route path="/outfit-builder" element={isAuthenticated ? <OutfitBuilder /> : <Navigate to="/login" />} />
            <Route path="/lookbook" element={<Lookbook />} />
            <Route path="/wishlist" element={isAuthenticated ? <Wishlist /> : <Navigate to="/login" />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />} />
            <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />

            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

            <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/admin/products" element={isAuthenticated ? <AdminProducts /> : <Navigate to="/login" />} />
            <Route path="/admin/orders" element={isAuthenticated ? <AdminOrders /> : <Navigate to="/login" />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
