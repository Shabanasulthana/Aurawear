import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import { BarChart3, Users, ShoppingBag, TrendingUp, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuthStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics');
    }
    setLoading(false);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-red-600 font-bold">Access Denied</p>
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

  const stats = [
    {
      label: 'Total Orders',
      value: analytics?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Total Users',
      value: analytics?.totalUsers || 0,
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Total Products',
      value: analytics?.totalProducts || 0,
      icon: ShoppingBag,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Revenue',
      value: `$${(analytics?.totalRevenue || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <div className={`inline-block p-3 rounded-lg ${stat.color} mb-4`}>
                <Icon size={24} />
              </div>
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {analytics?.recentOrders?.map((order) => (
              <div key={order._id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-bold">{order.userId?.name}</p>
                  <p className="text-sm text-gray-600">{order.userId?.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-secondary">${order.finalPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{order.orderStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <p className="font-bold">Manage Products</p>
              <p className="text-sm text-gray-600">Add, edit, or delete products</p>
            </Link>
            <Link
              to="/admin/orders"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <p className="font-bold">Manage Orders</p>
              <p className="text-sm text-gray-600">Update order status and tracking</p>
            </Link>
            <Link
              to="/products"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <p className="font-bold">View Store</p>
              <p className="text-sm text-gray-600">Check how customers see the store</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
