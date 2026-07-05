import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { Plus, Trash2, Save, Loader, Download } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function OutfitBuilder() {
  const [categories, setCategories] = useState({});
  const [outfit, setOutfit] = useState({
    name: '',
    tops: [],
    bottoms: [],
    outerwear: [],
    accessories: []
  });
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('builder');
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      loadSavedOutfits();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products?limit=50`);
      const productsByCategory = {
        tops: response.data.products.filter(p => p.category === 'Tops'),
        bottoms: response.data.products.filter(p => p.category === 'Bottoms'),
        outerwear: response.data.products.filter(p => p.category === 'Outerwear'),
        accessories: response.data.products.filter(p => p.category === 'Accessories'),
        dresses: response.data.products.filter(p => p.category === 'Dresses')
      };
      setCategories(productsByCategory);
    } catch (error) {
      console.error('Failed to fetch products');
    }
    setLoading(false);
  };

  const loadSavedOutfits = async () => {
    try {
      const response = await axios.get(`${API_URL}/outfits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedOutfits(response.data);
    } catch (error) {
      console.log('No saved outfits yet');
    }
  };

  const addToOutfit = (product, slot) => {
    const categoryKey = slot.toLowerCase();
    setOutfit(prev => ({
      ...prev,
      [categoryKey]: [...(prev[categoryKey] || []), product]
    }));
  };

  const removeFromOutfit = (index, slot) => {
    const categoryKey = slot.toLowerCase();
    setOutfit(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].filter((_, i) => i !== index)
    }));
  };

  const saveOutfit = async () => {
    if (!outfit.name) {
      alert('Please name your outfit');
      return;
    }

    setSaving(true);
    try {
      await axios.post(
        `${API_URL}/outfits`,
        {
          name: outfit.name,
          items: [
            ...outfit.tops,
            ...outfit.bottoms,
            ...outfit.outerwear,
            ...outfit.accessories
          ]
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Outfit saved!');
      setOutfit({
        name: '',
        tops: [],
        bottoms: [],
        outerwear: [],
        accessories: []
      });
      await loadSavedOutfits();
    } catch (error) {
      alert('Failed to save outfit');
    }
    setSaving(false);
  };

  const calculateTotal = () => {
    const allItems = [
      ...outfit.tops,
      ...outfit.bottoms,
      ...outfit.outerwear,
      ...outfit.accessories
    ];
    return allItems.reduce((total, item) => total + (item.discountPrice || item.price), 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={32} className="animate-spin text-secondary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600 mb-4">Please login to use Outfit Builder</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setView('builder')}
          className={`px-6 py-3 rounded-lg font-bold transition ${
            view === 'builder'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-primary hover:bg-gray-300'
          }`}
        >
          Create Outfit
        </button>
        <button
          onClick={() => setView('saved')}
          className={`px-6 py-3 rounded-lg font-bold transition ${
            view === 'saved'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-primary hover:bg-gray-300'
          }`}
        >
          Saved Outfits ({savedOutfits.length})
        </button>
      </div>

      {view === 'builder' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-8">Outfit Builder</h1>

            <div className="space-y-6">
              {['Tops', 'Bottoms', 'Outerwear', 'Accessories'].map(slot => (
                <div key={slot} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-2xl font-bold mb-4">{slot}</h3>

                  {outfit[slot.toLowerCase()]?.length > 0 && (
                    <div className="mb-6 space-y-3">
                      {outfit[slot.toLowerCase()].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-sm text-gray-600">${item.discountPrice || item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromOutfit(idx, slot)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <details className="bg-gray-50 rounded-lg">
                    <summary className="p-4 cursor-pointer font-bold flex items-center space-x-2">
                      <Plus size={20} />
                      <span>Add {slot}</span>
                    </summary>
                    <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                      {categories[slot.toLowerCase()]?.map(product => (
                        <button
                          key={product._id}
                          onClick={() => addToOutfit(product, slot)}
                          className="w-full text-left p-3 border border-gray-200 rounded hover:bg-yellow-50 transition"
                        >
                          <p className="font-bold">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            ${product.discountPrice || product.price}
                          </p>
                        </button>
                      ))}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Outfit Summary</h2>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-600">Outfit Name</h3>
                  <input
                    type="text"
                    value={outfit.name}
                    onChange={(e) => setOutfit({ ...outfit, name: e.target.value })}
                    placeholder="e.g., Office Chic"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold text-gray-600 mb-3">Selected Items</h3>
                  <div className="space-y-2 text-sm">
                    {outfit.tops.length > 0 && (
                      <p>Tops: {outfit.tops.length} item{outfit.tops.length > 1 ? 's' : ''}</p>
                    )}
                    {outfit.bottoms.length > 0 && (
                      <p>Bottoms: {outfit.bottoms.length} item{outfit.bottoms.length > 1 ? 's' : ''}</p>
                    )}
                    {outfit.outerwear.length > 0 && (
                      <p>Outerwear: {outfit.outerwear.length} item{outfit.outerwear.length > 1 ? 's' : ''}</p>
                    )}
                    {outfit.accessories.length > 0 && (
                      <p>Accessories: {outfit.accessories.length} item{outfit.accessories.length > 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="text-2xl font-bold text-secondary">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={saveOutfit}
                    disabled={saving || (outfit.tops.length === 0 && outfit.bottoms.length === 0)}
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>Save Outfit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOutfits.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">No saved outfits yet. Create one!</p>
            </div>
          ) : (
            savedOutfits.map(outfit => (
              <div key={outfit._id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">{outfit.name}</h3>
                <p className="text-gray-600 mb-4">
                  {outfit.items.length} items
                </p>
                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                  {outfit.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      • {item.name}
                    </p>
                  ))}
                </div>
                <button className="w-full border-2 border-secondary text-secondary py-2 rounded-lg font-bold hover:bg-secondary hover:text-primary transition">
                  Shop This Look
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
