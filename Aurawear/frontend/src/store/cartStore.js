import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useCartStore = create((set) => ({
  items: [],
  total: 0,

  getCart: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const items = Array.isArray(response.data?.items) ? response.data.items : [];
      set({ items });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  addToCart: async (token, productId, quantity, size, color) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/add`,
        { productId, quantity, size, color },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const items = Array.isArray(response.data?.items) ? response.data.items : [];
      set({ items });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add to cart' };
    }
  },

  updateCartItem: async (token, itemId, quantity) => {
    try {
      const response = await axios.put(
        `${API_URL}/cart/update/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ items: response.data.items || [] });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response.data.message };
    }
  },

  removeFromCart: async (token, itemId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/cart/remove/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ items: response.data.items || [] });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response.data.message };
    }
  },

  clearCart: async (token) => {
    try {
      await axios.delete(`${API_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ items: [] });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response.data.message };
    }
  }
}));
