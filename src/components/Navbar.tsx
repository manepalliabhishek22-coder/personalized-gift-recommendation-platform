import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Gift,
  Sparkles,
  ShoppingBag,
  Heart,
  History,
  ShieldCheck,
  Scale,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Smartphone,
  QrCode
} from 'lucide-react';
import { MultiDeviceModal } from './MultiDeviceModal';

export const Navbar: React.FC = () => {
  const {
    user,
    logout,
    activeTab,
    setActiveTab,
    setIsAuthModalOpen,
    setAuthModalMode,
    currency,
    setCurrency,
    isDarkMode,
    toggleDarkMode,
    compareList,
    setIsCompareModalOpen,
    isMenuOpen,
    setIsMenuOpen,
    toggleMenu
  } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMultiDeviceOpen, setIsMultiDeviceOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Discover', icon: Sparkles },
    { id: 'questionnaire', label: 'Find Perfect Gift', icon: Gift, highlight: true },
    { id: 'catalog', label: 'Product Catalog', icon: ShoppingBag },
    { id: 'saved', label: 'Saved & Folders', icon: Heart },
    { id: 'history', label: 'History & PDF', icon: History },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: ShieldCheck }] : [])
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950/80 backdrop-blur-md rounded-[14px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-rose-400 group-hover:rotate-12 transition-transform duration-200" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent font-['Outfit']">
                GiftAI
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md">
                Personalized
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/20 shadow-md font-bold backdrop-blur-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  } ${item.highlight && !isActive ? 'border border-rose-400/40 text-rose-300 bg-rose-500/10' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* App Navigation Menu Trigger */}
            <button
              onClick={toggleMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white transition cursor-pointer text-xs font-bold group shadow-sm active:scale-95"
              title="Open Navigation Menu (Shortcut: M key / Esc to close)"
            >
              <Menu className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Menu</span>
              <kbd className="hidden lg:inline-block px-1 py-0.2 text-[9px] font-mono text-slate-400 bg-white/10 border border-white/20 rounded">
                M
              </kbd>
            </button>

            {/* Compare Matrix Button */}
            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-400/30 text-xs font-bold hover:scale-105 transition backdrop-blur-md"
                title="View Gift Comparison"
              >
                <Scale className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compare</span>
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Multi-Device QR / Share */}
            <button
              onClick={() => setIsMultiDeviceOpen(true)}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-white/15 transition flex items-center gap-1.5 cursor-pointer"
              title="Access on Phone / Multi-Device Sync"
            >
              <Smartphone className="w-4 h-4 text-rose-400" />
              <span className="hidden lg:inline text-xs font-semibold text-slate-200">Mobile Sync</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="appearance-none bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-bold py-1.5 pl-2.5 pr-6 rounded-xl cursor-pointer hover:bg-white/15 transition focus:outline-none"
              >
                <option value="₹" className="bg-slate-900 text-white">₹ INR</option>
                <option value="$" className="bg-slate-900 text-white">$ USD</option>
                <option value="€" className="bg-slate-900 text-white">€ EUR</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-white/15 transition"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/15 transition border border-white/15"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-lg bg-rose-500/20"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-slate-200 max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isProfileOpen && (
                  <div
                    onMouseLeave={() => setIsProfileOpen(false)}
                    className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-slate-100 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 capitalize">
                        {user.role} Account
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('saved');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 flex items-center gap-2 transition"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      Saved Recommendations
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('history');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 flex items-center gap-2 transition"
                    >
                      <History className="w-3.5 h-3.5 text-indigo-400" />
                      Recommendation History
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 flex items-center gap-2 transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-white/10 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/25 transition"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-xl bg-white/10 border border-white/10 text-slate-300 hover:text-white transition flex items-center gap-1.5"
              title="Open Navigation Menu"
            >
              {isMenuOpen ? <X className="w-4 h-4 text-rose-400" /> : <Menu className="w-4 h-4" />}
              <span className="text-xs font-bold">Menu</span>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => {
                setIsMultiDeviceOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-white/5 hover:bg-white/10"
            >
              <Smartphone className="w-4 h-4 text-rose-400" />
              <span>Access on Phone (QR Code)</span>
            </button>
          </div>
        )}
      </div>

      <MultiDeviceModal
        isOpen={isMultiDeviceOpen}
        onClose={() => setIsMultiDeviceOpen(false)}
      />
    </header>
  );
};
