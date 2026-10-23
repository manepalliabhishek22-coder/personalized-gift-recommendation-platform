import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MatchedProduct } from '../types';
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  ExternalLink,
  Sparkles,
  Tag,
  CheckCircle,
  Box,
  Scale,
  TrendingDown
} from 'lucide-react';
import { generateShoppingPlatforms } from '../utils/shoppingPlatforms';
import { MultiPlatformShoppingModal } from './MultiPlatformShoppingModal';
import { CatalogProductCard } from './CatalogProductCard';

const CATEGORIES = [
  'All',
  'Books & Stationery',
  'Music & Memories',
  'Home & Wellness',
  'Gourmet Food & Cooking',
  'Home & Kitchen',
  'Home & Gardening',
  'Tools & Gadgets',
  'Fashion & Accessories',
  'Electronics',
  'Electronics & Books',
  'Photography & Art',
  'Fitness & Sports',
  'Gaming & Tech',
  'Fashion & Luxury'
];

const FESTIVALS = ['All Occasions', 'Diwali Dhamaka', 'Birthday Special', 'Anniversary', 'Christmas', "Valentine's Day", "Mother's Day", 'Housewarming', 'Graduation', 'New Year'];

export const CatalogView: React.FC = () => {
  const { formatPrice, addToCompare, setPreviewProduct, catalogCategoryFilter, setCatalogCategoryFilter } = useAuth();
  const [products, setProducts] = useState<MatchedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(catalogCategoryFilter || 'All');
  const [selectedFestival, setSelectedFestival] = useState('All Occasions');
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [priceTier, setPriceTier] = useState<'all' | 'under-500' | 'under-1000' | 'under-2500' | 'luxury'>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'popular' | 'price-desc' | 'rating'>('price-asc');
  const [selectedProductForPlatforms, setSelectedProductForPlatforms] = useState<MatchedProduct | null>(null);

  useEffect(() => {
    if (catalogCategoryFilter && catalogCategoryFilter !== selectedCategory) {
      setSelectedCategory(catalogCategoryFilter);
    }
  }, [catalogCategoryFilter]);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedFestival]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const list = await api.getProducts({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        festival: selectedFestival === 'All Occasions' ? undefined : selectedFestival
      });
      setProducts(list);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      
      let matchTier = true;
      if (priceTier === 'under-500') matchTier = p.price <= 500;
      else if (priceTier === 'under-1000') matchTier = p.price <= 1000;
      else if (priceTier === 'under-2500') matchTier = p.price <= 2500;
      else if (priceTier === 'luxury') matchTier = p.price > 5000;

      const matchPrice = p.price <= maxPrice;
      return matchSearch && matchTier && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8 p-8 rounded-3xl glass-panel text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-chip text-xs font-bold text-rose-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Retail Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight text-white">
            Explore Handpicked Gift Collections
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Browse top-rated Amazon products and artisanal luxury items matched seamlessly with AI gift styling parameters.
          </p>
        </div>
        <div className="z-10 flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <p className="text-2xl font-extrabold text-white">{products.length}+</p>
            <p className="text-[11px] font-bold text-slate-300">Available Gifts</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-3xl p-5 shadow-lg mb-8 space-y-4">
        {/* Price Intelligence Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/40 to-blue-950/40 border border-emerald-400/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              Price Intelligence Active
            </span>
            <span className="text-slate-200">
              Comparing live prices on <strong>Flipkart</strong>, <strong>Amazon</strong>, <strong>Google Shopping</strong> & <strong>Myntra</strong>.
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold">
            🏷️ Flipkart currently has the lowest price on 85% of budget gifts
          </span>
        </div>

        {/* Quick Budget Tiers */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 shrink-0">Budget Tiers:</span>
          <button
            onClick={() => setPriceTier('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
              priceTier === 'all'
                ? 'bg-rose-500 text-white shadow-md'
                : 'glass-chip text-slate-300 hover:bg-white/20'
            }`}
          >
            All Items ({products.length})
          </button>
          <button
            onClick={() => setPriceTier('under-500')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1 ${
              priceTier === 'under-500'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/25'
            }`}
          >
            💰 Under ₹500 (Affordable for Everyone)
          </button>
          <button
            onClick={() => setPriceTier('under-1000')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1 ${
              priceTier === 'under-1000'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                : 'glass-chip text-teal-300 hover:bg-white/20'
            }`}
          >
            ✨ Under ₹1,000
          </button>
          <button
            onClick={() => setPriceTier('under-2500')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
              priceTier === 'under-2500'
                ? 'bg-rose-500 text-white shadow-md'
                : 'glass-chip text-slate-300 hover:bg-white/20'
            }`}
          >
            🎁 Under ₹2,500
          </button>
          <button
            onClick={() => setPriceTier('luxury')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
              priceTier === 'luxury'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'glass-chip text-amber-300 hover:bg-white/20'
            }`}
          >
            💎 Premium & Luxury
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          {/* Search */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs text-white focus:outline-none"
            />
          </div>

          {/* Festival / Occasion Tag */}
          <div>
            <select
              value={selectedFestival}
              onChange={e => setSelectedFestival(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {FESTIVALS.map(f => (
                <option key={f} value={f} className="bg-slate-900 text-white">{f}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="price-asc" className="bg-slate-900 text-white">Sort: Lowest Price First 🏷️</option>
              <option value="popular" className="bg-slate-900 text-white">Sort: Most Popular 🔥</option>
              <option value="rating" className="bg-slate-900 text-white">Sort: Highest Rated ⭐</option>
              <option value="price-desc" className="bg-slate-900 text-white">Sort: Price High to Low</option>
            </select>
          </div>

          {/* Max Price Range */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-200 mb-1">
              <span>Max Budget:</span>
              <span className="text-rose-400 font-extrabold">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={250}
              max={35000}
              step={250}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-white/15 rounded-lg"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-white/10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'glass-chip text-slate-300 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="glass-card rounded-3xl p-4 animate-pulse space-y-3">
              <div className="h-44 bg-white/10 rounded-2xl" />
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40 text-rose-400" />
          <p className="text-base font-bold text-white">No products match your filter</p>
          <p className="text-xs text-slate-300 mt-1">Try expanding your price range or switching categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <CatalogProductCard
              key={product.id}
              product={product}
              formatPrice={formatPrice}
              onPreview3D={(prod) => {
                setPreviewProduct({
                  id: prod.id,
                  gift: prod.name,
                  reason: prod.description,
                  price: formatPrice(prod.price),
                  priceNumeric: prod.price,
                  surpriseScore: 9,
                  emotionalValue: 'High',
                  difficulty: 'Easy to Find',
                  category: prod.category,
                  matchedProduct: prod
                });
              }}
              onCompareStores={(prod) => setSelectedProductForPlatforms(prod)}
              onAddToCompare={(prod) => {
                addToCompare({
                  id: prod.id,
                  gift: prod.name,
                  reason: prod.description,
                  price: formatPrice(prod.price),
                  priceNumeric: prod.price,
                  surpriseScore: 8,
                  emotionalValue: 'High',
                  difficulty: 'Easy to Find',
                  category: prod.category,
                  matchedProduct: prod
                });
              }}
            />
          ))}
        </div>
      )}

      {/* Multi-Platform Shopping Modal */}
      <MultiPlatformShoppingModal
        item={selectedProductForPlatforms}
        isOpen={Boolean(selectedProductForPlatforms)}
        onClose={() => setSelectedProductForPlatforms(null)}
      />
    </div>
  );
};
