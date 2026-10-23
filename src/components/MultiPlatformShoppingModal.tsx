import React, { useState, useEffect } from 'react';
import { GiftIdea, MatchedProduct } from '../types';
import { generateShoppingPlatforms, PlatformDeal } from '../utils/shoppingPlatforms';
import { useAuth } from '../context/AuthContext';
import {
  X,
  ExternalLink,
  ShoppingBag,
  TrendingDown,
  Truck,
  ShieldCheck,
  Star,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  BarChart2
} from 'lucide-react';

interface MultiPlatformShoppingModalProps {
  item: GiftIdea | MatchedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MultiPlatformShoppingModal: React.FC<MultiPlatformShoppingModalProps> = ({
  item,
  isOpen,
  onClose
}) => {
  const { formatPrice, addToast } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<
    'all' | 'best-price' | 'amazon' | 'flipkart' | 'meesho' | 'fast-delivery' | 'custom'
  >('all');

  // Close Key: Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const itemName = 'gift' in item ? item.gift : item.name;
  const itemImage = 'matchedProduct' in item ? item.matchedProduct?.image : item.image;
  const itemCategory = item.category || 'Curated Gift';
  const basePrice = 'priceNumeric' in item ? item.priceNumeric : item.price;

  const allPlatforms = generateShoppingPlatforms(item);

  // Find lowest price
  const lowestPrice = Math.min(...allPlatforms.map(p => p.price));
  const highestPrice = Math.max(...allPlatforms.map(p => p.price));

  const filteredPlatforms = allPlatforms.filter(p => {
    if (filterMode === 'best-price') return p.price === lowestPrice;
    if (filterMode === 'amazon') return p.platform === 'Amazon';
    if (filterMode === 'flipkart') return p.platform === 'Flipkart';
    if (filterMode === 'meesho') return p.platform === 'Meesho';
    if (filterMode === 'fast-delivery') return p.deliverySpeed.includes('1-Day') || p.deliverySpeed.includes('2-Day');
    if (filterMode === 'custom') return p.platform === 'Etsy';
    return true;
  });

  const handleCopyLink = (deal: PlatformDeal) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(deal.url);
      setCopiedId(deal.id);
      addToast(`Copied ${deal.platform} shopping link!`, 'success');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] glass-panel rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-lg shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Multi-Platform Retail Hub
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline">• Live Comparison</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white font-['Outfit'] truncate mt-0.5">
                {itemName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition cursor-pointer shrink-0 ml-2 group shadow-sm active:scale-95"
            title="Close (Press Esc key)"
          >
            <span className="text-xs font-bold">Close</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-extrabold bg-white/20 text-white rounded border border-white/30 group-hover:bg-rose-500/40 transition">
              Esc
            </kbd>
            <X className="w-4 h-4 text-rose-400 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Recommendation Highlight Banner */}
          {(() => {
            const bestDeal = allPlatforms.find(p => p.price === lowestPrice) || allPlatforms[0];
            const savings = highestPrice - lowestPrice;
            return (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-blue-950/60 border border-emerald-400/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                        Recommended Website
                      </span>
                      <span className="text-xs font-bold text-white">
                        Lowest Price on {bestDeal.platform}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 mt-0.5">
                      Buy for <strong className="text-emerald-400 text-sm">{formatPrice(lowestPrice)}</strong>
                      {savings > 0 && (
                        <span> — Saves you <strong className="text-emerald-300">{formatPrice(savings)}</strong> ({Math.round((savings / highestPrice) * 100)}% cheaper than {allPlatforms.find(p => p.price === highestPrice)?.platform || 'other stores'})</span>
                      )}
                    </p>
                  </div>
                </div>

                <a
                  href={bestDeal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white transition flex items-center justify-center gap-2 shadow-md hover:brightness-110 shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: bestDeal.brandColor === '#FF9900' ? '#E67E00' : bestDeal.brandColor
                  }}
                >
                  <span>Open {bestDeal.platform} Deal ({formatPrice(bestDeal.price)})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })()}

          {/* Top Product Card & Price Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Thumbnail preview */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl glass-card border border-white/10 md:col-span-1">
              {itemImage ? (
                <img
                  src={itemImage}
                  alt={itemName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/15"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
              )}
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  {itemCategory}
                </span>
                <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {itemName}
                </p>
                <span className="text-xs font-extrabold text-emerald-400 mt-1 block">
                  Est. Base: {formatPrice(basePrice)}
                </span>
              </div>
            </div>

            {/* Price Range & Best Deal Stat */}
            <div className="p-3.5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                <span>Best Available Price</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> Save up to {formatPrice(highestPrice - lowestPrice)}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400 font-['Outfit']">
                  {formatPrice(lowestPrice)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(Math.round(lowestPrice * 1.25))}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Compared across {allPlatforms.length} verified online shopping destinations
              </p>
            </div>

            {/* Fast Logistics Stat */}
            <div className="p-3.5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                <span>Fastest Delivery</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Tomorrow
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Truck className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-bold text-white">
                  Prime & Fast Express Eligible
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Free shipping available on qualifying basket sizes
              </p>
            </div>
          </div>

          {/* Visual Platform Price Comparison Bar */}
          <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-rose-400" />
                Live Cross-Platform Price Breakdown
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Click any bar or platform to open direct store search
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {allPlatforms.map(p => {
                const isLowest = p.price === lowestPrice;
                return (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-xl border transition-all hover:scale-[1.02] flex flex-col justify-between text-left group cursor-pointer ${
                      isLowest
                        ? 'bg-emerald-500/15 border-emerald-400/40 shadow-sm'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold" style={{ color: p.textColor }}>
                        {p.platform}
                      </span>
                      {isLowest && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500 text-white uppercase tracking-wider">
                          Lowest
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-black text-white">
                      {formatPrice(p.price)}
                    </p>
                    <span className="text-[10px] text-slate-300 mt-1 group-hover:text-white flex items-center gap-1">
                      Visit store <ArrowRight className="w-2.5 h-2.5 opacity-70" />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'glass-chip text-slate-300 hover:bg-white/20'
                }`}
              >
                All Platforms ({allPlatforms.length})
              </button>
              <button
                onClick={() => setFilterMode('best-price')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  filterMode === 'best-price'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'glass-chip text-emerald-400 hover:bg-white/20'
                }`}
              >
                🔥 Lowest Price Deal
              </button>
              <button
                onClick={() => setFilterMode('amazon')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  filterMode === 'amazon'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'glass-chip text-amber-300 hover:bg-white/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#FF9900]" />
                Amazon
              </button>
              <button
                onClick={() => setFilterMode('flipkart')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  filterMode === 'flipkart'
                    ? 'bg-blue-600 text-white font-black shadow-md'
                    : 'glass-chip text-blue-300 hover:bg-white/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#2874F0]" />
                Flipkart
              </button>
              <button
                onClick={() => setFilterMode('meesho')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  filterMode === 'meesho'
                    ? 'bg-pink-600 text-white font-black shadow-md'
                    : 'glass-chip text-pink-300 hover:bg-white/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#9B205D]" />
                Meesho
              </button>
              <button
                onClick={() => setFilterMode('fast-delivery')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  filterMode === 'fast-delivery'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'glass-chip text-slate-300 hover:bg-white/20'
                }`}
              >
                ⚡ Fast Express Delivery
              </button>
              <button
                onClick={() => setFilterMode('custom')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  filterMode === 'custom'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'glass-chip text-slate-300 hover:bg-white/20'
                }`}
              >
                🎨 Handmade & Artisanal
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredPlatforms.length} options
            </span>
          </div>

          {/* Detailed Platform Cards List */}
          <div className="space-y-3">
            {filteredPlatforms.map(deal => {
              const isLowest = deal.price === lowestPrice;

              return (
                <div
                  key={deal.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isLowest
                      ? 'bg-emerald-950/20 border-emerald-400/30 hover:border-emerald-400/50'
                      : 'glass-card hover:bg-white/10'
                  }`}
                >
                  {/* Platform Identity & Tagline */}
                  <div className="space-y-1 sm:max-w-[42%]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg border uppercase tracking-wider"
                        style={{
                          backgroundColor: deal.bgColor,
                          borderColor: deal.textColor + '40',
                          color: deal.textColor
                        }}
                      >
                        {deal.platform}
                      </span>
                      {deal.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/10">
                          {deal.badge}
                        </span>
                      )}
                      {isLowest && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500 text-white shadow-sm">
                          Lowest Price
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white pt-0.5">
                      {deal.displayName}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {deal.tagline}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <div className="flex items-center text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                        <span>{deal.rating}</span>
                        <span className="text-slate-400 font-normal ml-0.5">
                          ({deal.reviewsCount.toLocaleString()})
                        </span>
                      </div>
                      <span>•</span>
                      <span className="text-slate-300">{deal.seller}</span>
                    </div>
                  </div>

                  {/* Delivery & Assurance Info */}
                  <div className="space-y-1.5 text-xs text-slate-300 sm:border-l sm:border-white/10 sm:pl-4">
                    <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                      <Truck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{deal.deliverySpeed}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Est. Arrival by: <b className="text-white">{deal.deliveryDate}</b></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{deal.returnPolicy}</span>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <div className="text-left sm:text-right">
                      <div className="flex items-baseline sm:justify-end gap-1.5">
                        <span className="text-lg sm:text-xl font-extrabold text-white font-['Outfit']">
                          {formatPrice(deal.price)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(deal.originalPrice)}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 block">
                        {deal.discountPercent}% OFF List Price
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(deal)}
                        className="p-2 rounded-xl glass-chip hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Copy direct product search link"
                      >
                        {copiedId === deal.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <a
                        href={deal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md hover:brightness-110 cursor-pointer"
                        style={{
                          backgroundColor: deal.brandColor === '#FF9900' ? '#E67E00' : deal.brandColor
                        }}
                      >
                        <span>Buy on {deal.platform}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>
            💡 Prices and stock availability update in real-time on merchant checkout.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl glass-chip hover:bg-white/20 text-white font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
