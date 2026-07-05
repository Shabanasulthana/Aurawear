import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import { Plus, Edit2, Trash2, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    images: [],
    sizes: '',
    colors: '',
    stock: '',
    material: '',
    careInstructions: ''
  });
  const [editingId, setEditingId] = useState(null);

  const { token } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
      stock: parseInt(formData.stock),
      sizes: formData.sizes.split(',').map(s => s.trim()),
      colors: formData.colors.split(',').map(c => c.trim())
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/products/${editingId}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product updated successfully');
      } else {
        await axios.post(`${API_URL}/products`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product created successfully');
      }
      resetForm();
      await fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      discountPrice: product.discountPrice || '',
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || ''
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      discountPrice: '',
      images: [],
      sizes: '',
      colors: '',
      stock: '',
      material: '',
      careInstructions: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={32} className="animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Products</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3"
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3"
                required
              >
                <option value="">Select Category</option>
                <option value="Dresses">Dresses</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
              </select>

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3"
                step="0.01"
                required
              />

              <input
                type="number"
                name="discountPrice"
                placeholder="Discount Price (optional)"
                value={formData.discountPrice}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3"
                step="0.01"
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3"
                required
              />

              <input
                type="text"
                name="material"
                placeholder="Material (e.g., Cotton, Silk)"
                value={formData.material}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3"
              />

              <input
                type="text"
                name="sizes"
                placeholder="Sizes (comma-separated: XS, S, M, L, XL)"
                value={formData.sizes}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3 md:col-span-2"
              />

              <input
                type="text"
                name="colors"
                placeholder="Colors (comma-separated: Red, Blue, Black)"
                value={formData.colors}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3 md:col-span-2"
              />
            </div>

            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3 h-32"
              required
            />

            <textarea
              name="careInstructions"
              placeholder="Care Instructions"
              value={formData.careInstructions}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3 h-20"
            />

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
              >
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-primary py-3 rounded-lg font-bold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4 text-right">Stock</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4 text-right font-bold">${product.price}</td>
                <td className="p-4 text-right">{product.stock}</td>
                <td className="p-4 text-center space-x-2 flex justify-center">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-secondary hover:text-yellow-600 transition"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
