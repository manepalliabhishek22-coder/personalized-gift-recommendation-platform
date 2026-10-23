import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Gift,
  Sparkles,
  ShoppingBag,
  Heart,
  History,
  ShieldCheck,
  Scale,
  Sun,
  Moon,
  Smartphone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  User,
  LogOut,
  Tag,
  Coffee,
  Watch,
  Smile,
  Camera,
  BookOpen,
  Activity,
  Calendar,
  Layers,
  Sparkle
} from 'lucide-react';

export const NavigationMenuDrawer: React.FC = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    activeTab,
    setActiveTab,
    user,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    currency,
    setCurrency,
    isDarkMode,
    toggleDarkMode,
    compareList,
    setIsCompareModalOpen,
    setCatalogCategoryFilter
  } = useAuth();

  // Escape key handler specifically for the menu drawer
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  if (!isMenuOpen) return null;

  const navItems = [
    {
      id: 'landing',
      label: 'Discover Gifts',
      desc: 'Curated showcase, spotlights & gifting advice',
      icon: Sparkles,
      color: 'text-rose-400',
      badge: 'Home'
    },
    {
      id: 'questionnaire',
      label: 'Find Perfect Gift',
      desc: '10-question AI matching engine & instant dossier',
      icon: Gift,
      color: 'text-amber-400',
      highlight: true,
      badge: 'AI Powered'
    },
    {
      id: 'catalog',
      label: 'Product Catalog',
      desc: 'Multi-store pricing, verified photography & scale',
      icon: ShoppingBag,
      color: 'text-emerald-400',
      badge: 'Verified Specs'
    },
    {
      id: 'saved',
      label: 'Saved & Folders',
      desc: 'Personal gift wishlists & occasion collections',
      icon: Heart,
      color: 'text-pink-400'
    },
    {
      id: 'history',
      label: 'History & PDF Dossiers',
      desc: 'Past AI generations, export printable reports',
      icon: History,
      color: 'text-indigo-400'
    },
    ...(user?.role === 'admin'
      ? [
          {
            id: 'admin',
            label: 'Admin Control Center',
            desc: 'System health, product editor & analytics',
            icon: ShieldCheck,
            color: 'text-cyan-400',
            badge: 'Admin'
          }
        ]
      : [])
  ];

  const quickCategories = [
    { name: 'Electronics', label: 'Tech & Gadgets', icon: Sparkle },
    { name: 'Gourmet Food & Cooking', label: 'Gourmet & Coffee', icon: Coffee },
    { name: 'Fashion & Luxury', label: 'Luxury & Watches', icon: Watch },
    { name: 'Home & Wellness', label: 'Wellness & Living', icon: Smile },
    { name: 'Photography & Art', label: 'Photography & Art', icon: Camera },
    { name: 'Electronics & Books', label: 'Books & Mind', icon: BookOpen },
    { name: 'Fitness & Sports', label: 'Fitness & Sports', icon: Activity }
  ];

  const occasionShortcuts = [
    'Birthday Special',
    'Anniversary',
    'Diwali Dhamaka',
    'Christmas',
    "Valentine's Day",
    'Graduation'
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId as any);
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (catName: string) => {
    setCatalogCategoryFilter(catName);
    setActiveTab('catalog');
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Slide-out Menu Panel */}
      <aside className="relative w-full max-w-md sm:max-w-lg bg-slate-900/95 border-r border-white/15 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200 text-slate-100 overflow-hidden">
        
        {/* Menu Top Bar: Branding & Prominent Close Key */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gift className="w-4 h-4 text-rose-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight font-['Outfit'] bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent">
                  GiftAI Menu
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Navigation
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Smart Gifting Platform</p>
            </div>
          </div>

          {/* Prominent Close Key button with visual [Esc] key badge */}
          <button
            id="menu-close-key-btn"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white transition cursor-pointer group shadow-sm active:scale-95"
            title="Close Menu (Keyboard key: Esc)"
          >
            <span className="text-xs font-bold">Close</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-extrabold bg-white/20 text-white rounded border border-white/30 shadow-inner group-hover:bg-rose-500/40 group-hover:border-rose-400/50 transition">
              Esc
            </kbd>
            <X className="w-4 h-4 text-rose-400 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Scrollable Menu Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 no-scrollbar">
          
          {/* Section 1: Main App Views */}
          <div>
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
              Explore & Tools
            </h4>
            <div className="space-y-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-rose-500/20 border border-rose-500/40 text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-300'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-500 ${isActive ? 'text-rose-400' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Quick Curated Categories */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Browse by Category
              </h4>
              <button
                onClick={() => {
                  setCatalogCategoryFilter('All');
                  setActiveTab('catalog');
                  setIsMenuOpen(false);
                }}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-bold"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickCategories.map(cat => {
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-left transition flex items-center gap-2 cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-white/10 text-rose-400 group-hover:scale-105 transition-transform">
                      <CatIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white truncate">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Popular Occasions */}
          <div>
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 px-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Gifts by Occasion</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {occasionShortcuts.map(occ => (
                <button
                  key={occ}
                  onClick={() => {
                    setActiveTab('catalog');
                    setIsMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-400/40 text-[11px] font-medium text-slate-300 hover:text-rose-200 transition cursor-pointer"
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Quick Settings & Preferences */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Preferences & Utilities
            </h4>

            {/* Currency selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Currency</span>
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                {(['₹', '$', '€'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      currency === c
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {c} {c === '₹' ? 'INR' : c === '$' ? 'USD' : 'EUR'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark/Light mode */}
            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <span className="text-xs font-semibold text-slate-300">Appearance</span>
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-slate-200 transition cursor-pointer"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-300" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Comparison Matrix Quick Trigger */}
            {compareList.length > 0 && (
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <span className="text-xs font-semibold text-slate-300">Active Comparison</span>
                <button
                  onClick={() => {
                    setIsCompareModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold hover:bg-amber-500/30 transition cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare ({compareList.length})</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 5: User Profile Status Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl bg-rose-500/20 border border-white/15"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-0.5 text-[9px] font-bold px-2 py-0.2 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 capitalize">
                      {user.role} Account
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setActiveTab('saved');
                      setIsMenuOpen(false);
                    }}
                    className="py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>Saved Lists</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="py-1.5 px-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-xs font-semibold text-rose-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-center">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Join Personalized Gift AI</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Save recommendations, build folders, and export PDF gift dossiers.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-200 transition cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-xs font-bold text-white shadow-md shadow-rose-500/25 transition cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Footer with Close Key shortcut guidance */}
        <div className="p-3.5 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-slate-400 text-[11px] shrink-0">
          <div className="flex items-center gap-1.5">
            <span>Shortcut:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[10px] text-slate-200 font-bold">
              Esc
            </kbd>
            <span>closes menu</span>
          </div>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition cursor-pointer"
          >
            <span>Close Key</span>
            <kbd className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-[10px] font-mono text-rose-200 font-bold">
              Esc
            </kbd>
          </button>
        </div>
      </aside>
    </div>
  );
};
