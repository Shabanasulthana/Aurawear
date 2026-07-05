import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Menu, X, ShoppingCart, Heart, LogOut } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-secondary">
            AuraWear X
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/products" className="hover:text-secondary transition">
              Catalog
            </Link>
            <Link to="/style-quiz" className="hover:text-secondary transition text-sm">
              Quiz
            </Link>
            <Link to="/lookbook" className="hover:text-secondary transition text-sm">
              Lookbook
            </Link>
            <Link to="/wishlist" className="hover:text-secondary transition">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="hover:text-secondary transition">
              <ShoppingCart size={20} />
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user.name}</span>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-secondary hover:underline text-sm">
                    Admin
                  </Link>
                )}
                <Link to="/outfit-builder" className="hover:text-secondary transition text-sm">
                  Builder
                </Link>
                <Link to="/orders" className="hover:text-secondary transition text-sm">
                  Orders
                </Link>
                <button onClick={logout} className="hover:text-secondary transition">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="hover:text-secondary transition">
                  Login
                </Link>
                <Link to="/register" className="hover:text-secondary transition">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link to="/products" className="block hover:text-secondary transition">
              Catalog
            </Link>
            <Link to="/wishlist" className="block hover:text-secondary transition">
              Wishlist
            </Link>
            <Link to="/cart" className="block hover:text-secondary transition">
              Cart
            </Link>
            {user ? (
              <>
                <Link to="/orders" className="block hover:text-secondary transition">
                  Orders
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block hover:text-secondary transition">
                    Admin
                  </Link>
                )}
                <button onClick={logout} className="block w-full text-left hover:text-secondary transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-secondary transition">
                  Login
                </Link>
                <Link to="/register" className="block hover:text-secondary transition">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
