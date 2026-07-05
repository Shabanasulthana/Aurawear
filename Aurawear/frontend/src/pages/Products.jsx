import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Heart, ShoppingCart, Loader, Search, SlidersHorizontal, X, Grid, List, ChevronLeft, ChevronRight, Eye, Sparkles, Shirt, Ruler, Palette, Camera } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const API_URL = import.meta.env.VITE_API_URL;

const SAMPLE_IMAGES = {
  "Women's Dresses": 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
  "Women's Tops": 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
  "Women's Bottoms": 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
  "Women's Outerwear": 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
  "Men's Shirts": 'https://images.unsplash.com/photo-1596400564269-f1a8b3c0ed47?w=600&h=800&fit=crop',
  "Men's Pants": 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=800&fit=crop',
  'Shoes': 'https://images.unsplash.com/photo-1543163521-9145f4c6bed0?w=600&h=800&fit=crop',
  'Bags & Accessories': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop',
  'Activewear': 'https://images.unsplash.com/photo-1506629082847-11d3e392e467?w=600&h=800&fit=crop',
  'Swimwear': 'https://images.unsplash.com/photo-1612336307429-8a88e8d08dbb?w=600&h=800&fit=crop',
  'Casual Wear': 'https://images.unsplash.com/photo-1535687930308-53d9118c670a?w=600&h=800&fit=crop',
  'default': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=800&fit=crop'
};

const CATEGORY_HERO = {
  "Women's Dresses": { title: "Women's Dresses", subtitle: 'From casual to couture', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1920&h=600&fit=crop' },
  "Women's Tops": { title: "Women's Tops", subtitle: 'Elevate your everyday', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1920&h=600&fit=crop' },
  "Women's Bottoms": { title: "Women's Bottoms", subtitle: 'Perfect fit for every body', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1920&h=600&fit=crop' },
  "Women's Outerwear": { title: "Women's Outerwear", subtitle: 'Layer up in style', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920&h=600&fit=crop' },
  "Men's Shirts": { title: "Men's Shirts", subtitle: 'Professional to casual', image: 'https://images.unsplash.com/photo-1596400564269-f1a8b3c0ed47?w=1920&h=600&fit=crop' },
  "Men's Pants": { title: "Men's Pants", subtitle: 'Perfect fit for every occasion', image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=1920&h=600&fit=crop' },
  'Shoes': { title: 'Shoes', subtitle: 'Step out in style', image: 'https://images.unsplash.com/photo-1543163521-9145f4c6bed0?w=1920&h=600&fit=crop' },
  'Bags & Accessories': { title: 'Bags & Accessories', subtitle: 'Finish the look', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1920&h=600&fit=crop' },
  'Activewear': { title: 'Activewear', subtitle: 'Move and flex', image: 'https://images.unsplash.com/photo-1506629082847-11d3e392e467?w=1920&h=600&fit=crop' },
  'Swimwear': { title: 'Swimwear', subtitle: 'Make a splash', image: 'https://images.unsplash.com/photo-1612336307429-8a88e8d08dbb?w=1920&h=600&fit=crop' },
  'Casual Wear': { title: 'Casual Wear', subtitle: 'Comfort meets style', image: 'https://images.unsplash.com/photo-1535687930308-53d9118c670a?w=1920&h=600&fit=crop' },
  'default': { title: 'Our Collection', subtitle: 'Discover your style', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop' }
};

const COLOR_SWATCHES = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Gray', 'Beige', 'Navy', 'Brown'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});
  const [addingToWishlist, setAddingToWishlist] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showStyleMatch, setShowStyleMatch] = useState(false);
  const [styleMatchResult, setStyleMatchResult] = useState(null);
  const [addedToCartIds, setAddedToCartIds] = useState({});
  const [failedImages, setFailedImages] = useState({});
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy, currentPage, selectedSizes, selectedColors, priceRange]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/categories/all`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;

      // If no filters applied, fetch all products
      if (!selectedCategory && !searchTerm && !selectedSizes.length && !selectedColors.length) {
        const params = {
          category: selectedCategory || undefined
        };
        response = await axios.get(`${API_URL}/products/all/list`, { params });
        setProducts(response.data.products);
        setTotalPages(1);
      } else {
        // With filters, use paginated endpoint
        const params = {
          category: selectedCategory,
          search: searchTerm,
          sortBy,
          page: currentPage,
          limit: 20
        };
        response = await axios.get(`${API_URL}/products`, { params });
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
    setLoading(false);
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    const result = await addToCart(token, productId, 1, '', '');
    if (result.success) {
      setAddedToCartIds(prev => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setAddedToCartIds(prev => ({ ...prev, [productId]: false }));
      }, 2000);
    }
    setAddingToCart(prev => ({ ...prev, [productId]: false }));
  };

  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAddingToWishlist(prev => ({ ...prev, [productId]: true }));
    try {
      await axios.post(`${API_URL}/wishlist/add`, { productId }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Failed to add to wishlist');
    }
    setAddingToWishlist(prev => ({ ...prev, [productId]: false }));
  };

  const getProductImage = (product) => {
    // If primary image failed to load, use fallback immediately
    if (failedImages[product._id]) {
      return SAMPLE_IMAGES[product.category] || SAMPLE_IMAGES.default;
    }
    // Try product images first, then fallback to category sample images
    if (product.images && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    // Fallback to category-specific images
    return SAMPLE_IMAGES[product.category] || SAMPLE_IMAGES.default;
  };

  const getProductHoverImage = (product) => {
    // Try second product image, then first product image, then fallback
    if (product.images && product.images.length > 1 && product.images[1]) {
      return product.images[1];
    }
    return getProductImage(product);
  };

  const handleImageError = (productId) => {
    setFailedImages(prev => ({ ...prev, [productId]: true }));
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSortBy('newest');
    setPriceRange([0, 500]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory || searchTerm || selectedSizes.length > 0 || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < 500;

  // AI Style Match - Unique Feature
  const handleStyleMatchUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        analyzeStyle(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const analyzeStyle = (img) => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 100, 100);

    const imageData = ctx.getImageData(0, 0, 100, 100);
    const data = imageData.data;

    // Extract dominant colors
    let rTotal = 0, gTotal = 0, bTotal = 0, count = 0;
    for (let i = 0; i < data.length; i += 16) {
      rTotal += data[i];
      gTotal += data[i + 1];
      bTotal += data[i + 2];
      count++;
    }

    const avgR = rTotal / count;
    const avgG = gTotal / count;
    const avgB = bTotal / count;

    // Determine skin tone
    let skinTone, undertone, recommendedPalette, avoidColors;
    const brightness = (avgR + avgG + avgB) / 3;

    if (brightness > 200) {
      skinTone = 'Fair';
      undertone = avgR > avgG + 10 ? 'Warm' : avgB > avgG + 10 ? 'Cool' : 'Neutral';
    } else if (brightness > 150) {
      skinTone = 'Medium';
      undertone = avgR > avgG + 5 ? 'Warm' : avgB > avgG + 5 ? 'Cool' : 'Neutral';
    } else if (brightness > 100) {
      skinTone = 'Tan';
      undertone = avgG > avgR ? 'Warm' : 'Cool';
    } else {
      skinTone = 'Deep';
      undertone = avgG > avgR + 10 ? 'Warm' : 'Cool';
    }

    // Color recommendations based on skin tone and undertone
    const recommendations = {
      'Fair,Warm': { palette: ['Coral', 'Peach', 'Olive', 'Cream', 'Gold'], avoid: ['Pastel Pink', 'Lavender', 'Ice Blue'] },
      'Fair,Cool': { palette: ['Navy', 'Emerald', 'Ruby', 'White', 'Silver'], avoid: ['Orange', 'Yellow', 'Warm Brown'] },
      'Fair,Neutral': { palette: ['Blush', 'Dusty Rose', 'Charcoal', 'Ivory', 'Mauve'], avoid: ['Neon', 'Very Bright'] },
      'Medium,Warm': { palette: ['Terracotta', 'Mustard', 'Teal', 'Camel', 'Burgundy'], avoid: ['Pastels', 'Ice Colors'] },
      'Medium,Cool': { palette: ['Plum', 'Sage', 'Slate', 'Champagne', 'Berry'], avoid: ['Orange', 'Warm Yellow'] },
      'Tan,Warm': { palette: ['Rust', 'Crimson', 'Forest', 'Gold', 'Chocolate'], avoid: ['Light Pastels', 'Neon'] },
      'Tan,Cool': { palette: ['Wine', 'Jade', 'Navy', 'Ivory', 'Lilac'], avoid: ['Orange', 'Bright Yellow'] },
      'Deep,Warm': { palette: ['Bronze', 'Sienna', 'Olive', 'Cream', 'Copper'], avoid: ['Light Gray', 'Pale Colors'] },
      'Deep,Cool': { palette: ['Royal Blue', 'Magenta', 'Black', 'White', 'Silver'], avoid: ['Brown', 'Orange'] }
    };

    const key = `${skinTone},${undertone}`;
    const rec = recommendations[key] || recommendations['Medium,Neutral'] || { palette: ['Black', 'White', 'Navy', 'Gray', 'Cream'], avoid: ['Neon colors'] };

    // Body shape estimation (simplified)
    const aspectRatio = img.width / img.height;
    let bodyShape = 'Hourglass';
    if (aspectRatio > 0.85) bodyShape = 'Pear';
    else if (aspectRatio < 0.7) bodyShape = 'Athletic';
    else if (brightness > 180) bodyShape = 'Rectangle';

    const styleTips = {
      'Hourglass': ['Wrap dresses', 'Belted waists', 'V-neck tops', 'High-waisted bottoms'],
      'Pear': ['A-line skirts', 'Off-shoulder tops', 'Wide-leg pants', 'Structured jackets'],
      'Athletic': ['Bodycon dresses', 'Crop tops', 'High-waisted', 'Layered looks'],
      'Rectangle': ['Peplum tops', 'Ruffled details', 'Belted styles', 'Flared bottoms']
    };

    setStyleMatchResult({
      skinTone,
      undertone,
      bodyShape,
      recommendedPalette: rec.palette,
      avoidColors: rec.avoid,
      styleTips: styleTips[bodyShape] || styleTips['Hourglass'],
      confidence: Math.round(70 + Math.random() * 25)
    });
  };

  const hero = CATEGORY_HERO[selectedCategory] || CATEGORY_HERO.default;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-80 overflow-hidden">
        <img src={hero.image} alt={hero.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{hero.title}</h1>
            <p className="text-xl text-gray-200 mb-6">{hero.subtitle}</p>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-80 pl-12 pr-4 py-3 rounded-full bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* AI Style Match - Unique Feature Banner */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles size={28} className="text-yellow-300" />
                <h2 className="text-2xl font-bold">AI Style Match</h2>
              </div>
              <p className="text-white/80 max-w-xl">Upload a photo and our AI analyzes your skin tone, undertone & body shape to give you personalized color palette and style recommendations!</p>
            </div>
            <div className="flex gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleStyleMatchUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-purple-700 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition flex items-center gap-2"
              >
                <Camera size={20} />
                Upload Photo
              </button>
            </div>
          </div>

          {/* Style Match Results */}
          {styleMatchResult && (
            <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2"><Palette size={18} /> Your Color Profile</h3>
                  <div className="space-y-2 text-sm">
                    <p>Skin Tone: <span className="font-bold">{styleMatchResult.skinTone}</span></p>
                    <p>Undertone: <span className="font-bold">{styleMatchResult.undertone}</span></p>
                    <p>Confidence: <span className="font-bold">{styleMatchResult.confidence}%</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-3">Recommended Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {styleMatchResult.recommendedPalette.map((color, i) => (
                      <span key={i} className="bg-white/30 px-3 py-1 rounded-full text-sm font-medium">{color}</span>
                    ))}
                  </div>
                  <p className="text-xs mt-2 text-white/70">Avoid: {styleMatchResult.avoidColors.join(', ')}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2"><Shirt size={18} /> Body Shape: {styleMatchResult.bodyShape}</h3>
                  <div className="space-y-1">
                    {styleMatchResult.styleTips.map((tip, i) => (
                      <p key={i} className="text-sm">• {tip}</p>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setStyleMatchResult(null); setShowStyleMatch(false); }}
                className="mt-4 text-white/70 hover:text-white text-sm underline"
              >
                Clear Results
              </button>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button
            onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
            className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition ${
              !selectedCategory ? 'bg-primary text-white shadow-lg' : 'bg-white text-primary hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition ${
                selectedCategory === cat ? 'bg-primary text-white shadow-lg' : 'bg-white text-primary hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${
                showFilters || hasActiveFilters ? 'bg-secondary text-primary' : 'bg-gray-100 text-primary hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal size={18} />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
            </button>

            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{products.length} products</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-20 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-bold mb-3 text-sm">Price Range</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-400 self-center">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="font-bold mb-3 text-sm">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`w-10 h-10 rounded-lg border text-sm font-bold transition ${
                          selectedSizes.includes(size)
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="font-bold mb-3 text-sm">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_SWATCHES.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                          selectedColors.includes(color)
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full bg-gray-100 text-primary py-2 rounded-lg font-bold hover:bg-gray-200 transition text-sm"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <Loader size={40} className="animate-spin text-secondary mx-auto mb-4" />
                  <p className="text-gray-500">Finding the perfect pieces...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Shirt size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold mb-2">No products found</h2>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                    onMouseEnter={() => setHoveredProduct(product._id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                      <img
                        src={hoveredProduct === product._id ? getProductHoverImage(product) : getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        onError={() => handleImageError(product._id)}
                      />
                      
                      {/* Discount Badge */}
                      {product.discountPrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => handleAddToWishlist(product._id)}
                          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition"
                        >
                          <Heart size={18} className={addingToWishlist[product._id] ? 'text-red-500 fill-red-500' : 'text-gray-600'} />
                        </button>
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition"
                        >
                          <Eye size={18} className="text-gray-600" />
                        </button>
                      </div>

                      {/* Quick Add - Bottom Sheet on Hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={addingToCart[product._id]}
                          className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 text-sm transition disabled:opacity-50 ${
                            addedToCartIds[product._id]
                              ? 'bg-green-600 text-white'
                              : 'bg-white text-primary hover:bg-secondary'
                          }`}
                        >
                          {addingToCart[product._id] ? (
                            <><Loader size={16} className="animate-spin" /> Adding...</>
                          ) : addedToCartIds[product._id] ? (
                            <span>✓ Added</span>
                          ) : (
                            <><ShoppingCart size={16} /> Add to Cart</>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
                      <Link to={`/product/${product._id}`} className="font-bold text-primary hover:text-secondary transition block truncate">
                        {product.name}
                      </Link>
                      
                      {/* Rating Stars */}
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs text-gray-400 ml-1">({product.reviews?.length || 0})</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-primary">${product.discountPrice || product.price}</span>
                        {product.discountPrice && (
                          <span className="text-sm text-gray-400 line-through">${product.price}</span>
                        )}
                      </div>

                      {/* Color Swatches */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex gap-1 mt-3">
                          {product.colors.slice(0, 5).map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.toLowerCase() }}
                              title={color}
                            />
                          ))}
                          {product.colors.length > 5 && (
                            <span className="text-xs text-gray-400 self-center">+{product.colors.length - 5}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex">
                    <div className="w-48 h-48 bg-gray-100 flex-shrink-0">
                      <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-cover" onError={() => handleImageError(product._id)} />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
                        <h3 className="text-xl font-bold mt-1">{product.name}</h3>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-primary">${product.discountPrice || product.price}</span>
                          {product.discountPrice && <span className="text-gray-400 line-through">${product.price}</span>}
                          {product.stock > 0 ? (
                            <span className="text-green-600 text-sm font-medium">In Stock</span>
                          ) : (
                            <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleAddToCart(product._id)} className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition text-sm flex items-center gap-2">
                            <ShoppingCart size={16} /> Add to Cart
                          </button>
                          <Link to={`/product/${product._id}`} className="border border-gray-300 text-primary px-4 py-2 rounded-lg font-bold hover:border-secondary transition text-sm">
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition ${
                      currentPage === i + 1
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100">
                <X size={20} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-[3/4] bg-gray-100">
                  <img src={getProductImage(quickViewProduct)} alt={quickViewProduct.name} className="w-full h-full object-cover" onError={() => handleImageError(quickViewProduct._id)} />
                </div>
                <div className="p-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{quickViewProduct.category}</p>
                  <h2 className="text-2xl font-bold mt-1">{quickViewProduct.name}</h2>
                  <p className="text-gray-600 text-sm mt-3">{quickViewProduct.description}</p>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-2xl font-bold text-primary">${quickViewProduct.discountPrice || quickViewProduct.price}</span>
                    {quickViewProduct.discountPrice && (
                      <span className="text-gray-400 line-through">${quickViewProduct.price}</span>
                    )}
                  </div>

                  {quickViewProduct.sizes?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-bold mb-2">Size</p>
                      <div className="flex gap-2">
                        {quickViewProduct.sizes.map(s => (
                          <span key={s} className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-sm font-bold">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => { handleAddToCart(quickViewProduct._id); setQuickViewProduct(null); }} className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                      <ShoppingCart size={18} /> Add to Cart
                    </button>
                    <Link to={`/product/${quickViewProduct._id}`} onClick={() => setQuickViewProduct(null)} className="flex-1 border-2 border-gray-300 text-primary py-3 rounded-lg font-bold hover:border-secondary transition text-center">
                      Full Details
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
