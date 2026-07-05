import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, X, ShoppingCart, Loader } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const API_URL = import.meta.env.VITE_API_URL;

export default function Lookbook() {
  const [selectedLook, setSelectedLook] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [addingAll, setAddingAll] = useState(false);
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  const lookbooks = [
    {
      id: 1,
      title: "Office Chic",
      description: "Professional yet stylish looks for the workplace",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a775?w=800&h=600&fit=crop",
      items: [
        { name: "Classic White Blouse", category: "Tops" },
        { name: "Pencil Skirt", category: "Bottoms" },
        { name: "Wool Cardigan", category: "Outerwear" },
        { name: "Leather Belt", category: "Accessories" }
      ],
      colors: ["White", "Black", "Gray"],
      tags: ["Professional", "Neutral", "Elegant"]
    },
    {
      id: 2,
      title: "Casual Everyday",
      description: "Comfortable yet put-together casual style",
      image: "https://images.unsplash.com/photo-1608232183373-a5b9d4e1d2c0?w=800&h=600&fit=crop",
      items: [
        { name: "Striped Long-Sleeve Top", category: "Tops" },
        { name: "Premium Denim Jeans", category: "Bottoms" },
        { name: "Denim Jacket", category: "Outerwear" },
        { name: "White Sneakers", category: "Accessories" }
      ],
      colors: ["Navy", "Blue", "White"],
      tags: ["Casual", "Comfortable", "Timeless"]
    },
    {
      id: 3,
      title: "Weekend Brunch",
      description: "Effortlessly chic for your weekend outings",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop",
      items: [
        { name: "Floral Summer Dress", category: "Dresses" },
        { name: "Silk Scarf", category: "Accessories" },
        { name: "Strappy Sandals", category: "Accessories" }
      ],
      colors: ["Floral", "Pastel"],
      tags: ["Summer", "Floral", "Relaxed"]
    },
    {
      id: 4,
      title: "Night Out",
      description: "Stunning looks for special evenings",
      image: "https://images.unsplash.com/photo-1595777707802-cbd5e7213984?w=800&h=600&fit=crop",
      items: [
        { name: "Elegant Evening Dress", category: "Dresses" },
        { name: "Statement Earrings", category: "Accessories" },
        { name: "Heels", category: "Accessories" }
      ],
      colors: ["Black", "Gold", "Red"],
      tags: ["Formal", "Elegant", "Evening"]
    },
    {
      id: 5,
      title: "Boho Vibes",
      description: "Free-spirited and artistic fashion",
      image: "https://images.unsplash.com/photo-1595607774223-ef52624120d2?w=800&h=600&fit=crop",
      items: [
        { name: "Bohemian Maxi Dress", category: "Dresses" },
        { name: "Silk Scarf", category: "Accessories" },
        { name: "Fringe Bag", category: "Accessories" }
      ],
      colors: ["Multicolor", "Earth Tones"],
      tags: ["Boho", "Artistic", "Festival"]
    },
    {
      id: 6,
      title: "Edgy Street Style",
      description: "Bold and confident urban fashion",
      image: "https://images.unsplash.com/photo-1548844519-f7cfcd3b0f3e?w=800&h=600&fit=crop",
      items: [
        { name: "Oversized Sweatshirt", category: "Tops" },
        { name: "Leather Pants", category: "Bottoms" },
        { name: "Black Leather Jacket", category: "Outerwear" },
        { name: "Combat Boots", category: "Accessories" }
      ],
      colors: ["Black", "Gray"],
      tags: ["Edgy", "Bold", "Street Style"]
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Fashion Lookbook</h1>
          <p className="text-xl text-gray-300">
            Discover curated style inspiration and shop complete outfits
          </p>
        </div>
      </div>

      {/* Lookbooks Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lookbooks.map((look) => (
            <div
              key={look.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-96 cursor-pointer" onClick={() => setSelectedLook(look)}>
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-center justify-center">
                  <button className="bg-white text-primary px-6 py-2 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0 shadow-lg">
                    View Look
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold">{look.title}</h3>
                  <button className="text-gray-400 hover:text-red-500 transition">
                    <Heart size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{look.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {look.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Items */}
                <details className="mb-4">
                  <summary className="cursor-pointer font-bold text-primary hover:text-secondary flex items-center space-x-2">
                    <span>Items in this look ({look.items.length})</span>
                    <ArrowRight size={16} />
                  </summary>
                  <div className="mt-3 space-y-2 pl-4 border-l-2 border-secondary">
                    {look.items.map((item, idx) => (
                      <div key={idx} className="text-gray-700">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500"> · {item.category}</span>
                      </div>
                    ))}
                  </div>
                </details>

                {/* Color Palette */}
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-sm text-gray-600">Colors:</span>
                  <div className="flex space-x-2">
                    {look.colors.map((color, idx) => {
                      const colorMap = {
                        "Black": "#000000",
                        "White": "#FFFFFF",
                        "Gray": "#808080",
                        "Navy": "#000080",
                        "Blue": "#0000FF",
                        "Gold": "#FFD700",
                        "Red": "#FF0000",
                        "Floral": "#FF69B4",
                        "Pastel": "#FFB6C1",
                        "Multicolor": "#FF6347",
                        "Earth Tones": "#8B4513"
                      };
                      return (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: colorMap[color] || "#CCCCCC" }}
                          title={color}
                        />
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLook(look)}
                  className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Shop This Look
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Tips */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Style Tips</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="text-4xl mb-4">👕</div>
              <h3 className="text-xl font-bold mb-3">Mix & Match</h3>
              <p className="text-gray-600">
                Take pieces from different looks and mix them to create your unique style combinations.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3">Color Coordination</h3>
              <p className="text-gray-600">
                Use the color palettes shown to ensure your outfits are well-coordinated and cohesive.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-3">Accessorize</h3>
              <p className="text-gray-600">
                Don't forget accessories! They can transform a basic outfit into something special.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-secondary to-yellow-500 text-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-lg mb-6">
            Use our Outfit Builder to create and save your own looks
          </p>
          <Link
            to="/outfit-builder"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition"
          >
            Build Your Outfit
          </Link>
        </div>
      </div>

      {/* Look Detail Modal */}
      {selectedLook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedLook(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <button onClick={() => setSelectedLook(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100">
                <X size={20} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-96 md:h-auto">
                  <img src={selectedLook.image} alt={selectedLook.title} className="w-full h-full object-cover rounded-l-2xl" />
                </div>
                <div className="p-8">
                  <h2 className="text-3xl font-bold mb-2">{selectedLook.title}</h2>
                  <p className="text-gray-600 mb-6">{selectedLook.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedLook.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Items with Add to Cart */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Items in this Look</h3>
                    <div className="space-y-2">
                      {selectedLook.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <button
                            onClick={async () => {
                              if (!isAuthenticated) {
                                navigate('/login');
                                return;
                              }
                              setAddingToCart(prev => ({ ...prev, [idx]: true }));
                              try {
                                const response = await axios.get(`${API_URL}/products?search=${encodeURIComponent(item.name)}&limit=1`);
                                const product = response.data.products[0];
                                if (product) {
                                  await addToCart(token, product._id, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
                                  alert(`${item.name} added to cart!`);
                                } else {
                                  alert('Product not found. Please search in products page.');
                                }
                              } catch {
                                alert('Failed to add item');
                              }
                              setAddingToCart(prev => ({ ...prev, [idx]: false }));
                            }}
                            disabled={addingToCart[idx]}
                            className="text-white bg-primary hover:bg-gray-800 px-4 py-1.5 rounded-lg font-bold text-sm transition disabled:opacity-50 flex items-center gap-1"
                          >
                            {addingToCart[idx] ? <Loader size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
                            {addingToCart[idx] ? 'Adding...' : 'Add'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="mb-6">
                    <p className="text-sm font-bold mb-2">Color Palette</p>
                    <div className="flex gap-2">
                      {selectedLook.colors.map((color, idx) => {
                        const colorMap = {
                          "Black": "#000000", "White": "#FFFFFF", "Gray": "#808080",
                          "Navy": "#000080", "Blue": "#0000FF", "Gold": "#FFD700",
                          "Red": "#FF0000", "Floral": "#FF69B4", "Pastel": "#FFB6C1",
                          "Multicolor": "#FF6347", "Earth Tones": "#8B4513"
                        };
                        return (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-full border border-gray-300"
                            style={{ backgroundColor: colorMap[color] || "#CCCCCC" }}
                            title={color}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        if (!isAuthenticated) {
                          navigate('/login');
                          return;
                        }
                        setAddingAll(true);
                        let addedCount = 0;
                        for (const item of selectedLook.items) {
                          try {
                            const response = await axios.get(`${API_URL}/products?search=${encodeURIComponent(item.name)}&limit=1`);
                            const product = response.data.products[0];
                            if (product) {
                              await addToCart(token, product._id, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
                              addedCount++;
                            }
                          } catch {
                            // continue adding others
                          }
                        }
                        alert(`Added ${addedCount} items to cart!`);
                        setAddingAll(false);
                        setSelectedLook(null);
                        navigate('/cart');
                      }}
                      disabled={addingAll}
                      className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {addingAll ? <Loader size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
                      {addingAll ? 'Adding...' : 'Add All to Cart'}
                    </button>
                    <Link
                      to="/products"
                      onClick={() => setSelectedLook(null)}
                      className="flex-1 border-2 border-gray-300 text-primary py-3 rounded-lg font-bold hover:border-secondary transition text-center"
                    >
                      Browse Products
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}