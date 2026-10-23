import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, GiftIdea, QuestionnaireData, RecommendationRecord } from '../types';
import { api } from '../services/api';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loadingUser: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  // Navigation View
  activeTab: 'landing' | 'questionnaire' | 'results' | 'catalog' | 'compare' | 'saved' | 'history' | 'admin';
  setActiveTab: (tab: 'landing' | 'questionnaire' | 'results' | 'catalog' | 'compare' | 'saved' | 'history' | 'admin') => void;
  // Auth Modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  // Currency & Theme
  currency: string;
  setCurrency: (c: string) => void;
  formatPrice: (inrAmount: number) => string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  // Comparison
  compareList: GiftIdea[];
  addToCompare: (gift: GiftIdea) => void;
  removeFromCompare: (giftId: string) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  // Current Recommendation Session
  currentQuestionnaire: QuestionnaireData | null;
  setCurrentQuestionnaire: (q: QuestionnaireData | null) => void;
  currentRecommendations: GiftIdea[];
  setCurrentRecommendations: (r: GiftIdea[]) => void;
  currentRecordId: string | null;
  setCurrentRecordId: (id: string | null) => void;
  // Toasts
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  // 3D/Real Product Stage Modal
  previewProduct: GiftIdea | null;
  setPreviewProduct: (gift: GiftIdea | null) => void;
  // Navigation Menu Drawer
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  catalogCategoryFilter: string;
  setCatalogCategoryFilter: (cat: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gift_token'));
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'landing' | 'questionnaire' | 'results' | 'catalog' | 'compare' | 'saved' | 'history' | 'admin'>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  
  const [currency, setCurrency] = useState<string>('₹');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('gift_theme') === 'dark';
  });

  const [compareList, setCompareList] = useState<GiftIdea[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<QuestionnaireData | null>(null);
  const [currentRecommendations, setCurrentRecommendations] = useState<GiftIdea[]>([]);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [previewProduct, setPreviewProduct] = useState<GiftIdea | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('All');

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  // Global Keyboard listener for Close Key (Escape) and Menu Key (M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close Key: Escape
      if (e.key === 'Escape') {
        if (previewProduct) {
          setPreviewProduct(null);
          return;
        }
        if (isMenuOpen) {
          setIsMenuOpen(false);
          return;
        }
        if (isAuthModalOpen) {
          setIsAuthModalOpen(false);
          return;
        }
        if (isCompareModalOpen) {
          setIsCompareModalOpen(false);
          return;
        }
      }

      // Shortcut: 'm' or 'M' to toggle navigation menu (when not typing in form field)
      const target = e.target as HTMLElement;
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      );
      if (!isInput && (e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsMenuOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewProduct, isMenuOpen, isAuthModalOpen, isCompareModalOpen]);

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gift_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gift_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        const u = await api.getMe();
        if (u) {
          setUser(u);
        } else {
          localStorage.removeItem('gift_token');
          setToken(null);
        }
      }
      setLoadingUser(false);
    };
    initAuth();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    localStorage.setItem('gift_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
    addToast(`Welcome back, ${res.user.name}!`, 'success');
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await api.register(name, email, pass);
    localStorage.setItem('gift_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
    addToast(`Account created! Welcome, ${res.user.name}!`, 'success');
  };

  const logout = () => {
    localStorage.removeItem('gift_token');
    setToken(null);
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const formatPrice = (inrAmount: number) => {
    if (currency === '$') {
      const usd = Math.round(inrAmount * 0.012);
      return `$${usd.toLocaleString()}`;
    }
    if (currency === '€') {
      const eur = Math.round(inrAmount * 0.011);
      return `€${eur.toLocaleString()}`;
    }
    return `₹${inrAmount.toLocaleString('en-IN')}`;
  };

  const addToCompare = (gift: GiftIdea) => {
    if (compareList.some(g => g.id === gift.id)) {
      addToast('Gift already in comparison list', 'info');
      return;
    }
    if (compareList.length >= 4) {
      addToast('You can compare up to 4 gifts at a time', 'error');
      return;
    }
    setCompareList(prev => [...prev, gift]);
    addToast(`Added "${gift.gift}" to comparison`, 'success');
  };

  const removeFromCompare = (giftId: string) => {
    setCompareList(prev => prev.filter(g => g.id !== giftId));
    addToast('Removed from comparison', 'info');
  };

  const clearCompare = () => setCompareList([]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loadingUser,
        login,
        register,
        logout,
        activeTab,
        setActiveTab,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        currency,
        setCurrency,
        formatPrice,
        isDarkMode,
        toggleDarkMode,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
        currentQuestionnaire,
        setCurrentQuestionnaire,
        currentRecommendations,
        setCurrentRecommendations,
        currentRecordId,
        setCurrentRecordId,
        toasts,
        addToast,
        removeToast,
        previewProduct,
        setPreviewProduct,
        isMenuOpen,
        setIsMenuOpen,
        toggleMenu,
        catalogCategoryFilter,
        setCatalogCategoryFilter
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
