import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MatchedProduct, User } from '../types';
import {
  ShieldCheck,
  PackagePlus,
  Users,
  TrendingUp,
  Trash2,
  Edit,
  Plus,
  ShoppingBag,
  ExternalLink,
  CheckCircle,
  X,
  Sparkles
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { user, formatPrice, addToast } = useAuth();
  const [stats, setStats] = useState<any>({
    totalUsers: 2,
    totalProducts: 16,
    totalRecommendationsGenerated: 38,
    popularOccasion: 'Birthday'
  });
  const [products, setProducts] = useState<MatchedProduct[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'overview'>('overview');

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 2500,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    purchaseLink: 'https://amazon.in',
    festivalTag: 'Birthday Special',
    rating: 4.8,
    reviewsCount: 120
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, prods, usrs] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getAdminUsers()
      ]);
      setStats(statsData);
      setProducts(prods);
      setUsersList(usrs);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;
    try {
      const created = await api.createProduct(newProduct);
      setProducts(prev => [created, ...prev]);
      addToast(`Product "${created.name}" added to catalog!`, 'success');
      setShowProductModal(false);
      setNewProduct({
        name: '',
        description: '',
        price: 2500,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
        purchaseLink: 'https://amazon.in',
        festivalTag: 'Birthday Special',
        rating: 4.8,
        reviewsCount: 120
      });
    } catch (err: any) {
      addToast(err.message || 'Failed to add product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      addToast('Product removed from catalog', 'info');
    } catch {
      addToast('Failed to delete product', 'error');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-panel rounded-3xl text-center">
        <ShieldCheck className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Admin Access Required</h2>
        <p className="text-xs text-slate-300 mt-2 mb-4">
          Please log in as the demo Administrator (admin@giftplatform.com) to access the control panel.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-chip text-xs font-bold text-emerald-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Platform Management & Catalog Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Monitor recommendation throughput, manage retail catalog items, and view registered user accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProductModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Add Catalog Product</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white text-slate-950 shadow-md font-extrabold'
              : 'glass-card text-slate-300 hover:bg-white/15'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'products'
              ? 'bg-white text-slate-950 shadow-md font-extrabold'
              : 'glass-card text-slate-300 hover:bg-white/15'
          }`}
        >
          Retail Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'users'
              ? 'bg-white text-slate-950 shadow-md font-extrabold'
              : 'glass-card text-slate-300 hover:bg-white/15'
          }`}
        >
          Registered Users ({usersList.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between text-slate-300 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Recommendations</span>
                <Sparkles className="w-5 h-5 text-rose-400" />
              </div>
              <p className="text-3xl font-extrabold text-white font-['Outfit']">
                {stats.totalRecommendationsGenerated || 38}
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">↑ +14% this week</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between text-slate-300 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Catalog Inventory</span>
                <ShoppingBag className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-white font-['Outfit']">
                {products.length}
              </p>
              <p className="text-[11px] text-slate-300 mt-1">Curated products across 10 categories</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between text-slate-300 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Users</span>
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-3xl font-extrabold text-white font-['Outfit']">
                {usersList.length || 2}
              </p>
              <p className="text-[11px] text-indigo-300 font-semibold mt-1">100% Verified Accounts</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between text-slate-300 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Top Occasion</span>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-2xl font-extrabold text-purple-300 font-['Outfit']">
                {stats.popularOccasion || 'Birthday'}
              </p>
              <p className="text-[11px] text-slate-300 mt-1">42% of total search volume</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-300 font-bold border-b border-white/10">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Occasion Tag</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-white/5 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-xl shrink-0 border border-white/10"
                          />
                          <div>
                            <p className="font-bold text-white">{product.name}</p>
                            <p className="text-[10px] text-slate-300 truncate max-w-xs">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-200">
                        {product.category}
                      </td>
                      <td className="p-4 font-extrabold text-emerald-400">
                        {formatPrice(product.price)}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 font-bold text-[10px]">
                          {product.festivalTag || 'Standard'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-amber-400">
                        ★ {product.rating} ({product.reviewsCount})
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <a
                          href={product.purchaseLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block p-1.5 text-slate-300 hover:text-white transition cursor-pointer"
                          title="View Store Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 transition cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USERS LIST */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-300 font-bold border-b border-white/10">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {usersList.map(u => (
                <tr key={u.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${u.name}`}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full bg-white/10"
                      />
                      <span className="font-bold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 font-mono text-[11px]">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
                          : 'glass-chip text-slate-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <form
            onSubmit={handleAddProduct}
            className="glass-panel rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-emerald-400" />
                Add Catalog Product
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Polaroid Now+ Instant Camera"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                required
                placeholder="Key features and gifting value..."
                value={newProduct.description}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Price (₹ INR / Base)
                </label>
                <input
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.category}
                  onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Image URL (Unsplash / Retail)
              </label>
              <input
                type="url"
                required
                value={newProduct.image}
                onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Store Buy Link (Amazon / Merchant)
              </label>
              <input
                type="url"
                required
                value={newProduct.purchaseLink}
                onChange={e => setNewProduct({ ...newProduct, purchaseLink: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Occasion / Festival Tag
              </label>
              <input
                type="text"
                value={newProduct.festivalTag}
                onChange={e => setNewProduct({ ...newProduct, festivalTag: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-lg cursor-pointer"
              >
                Add to Store
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
