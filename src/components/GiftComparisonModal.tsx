import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Scale, Star, Sparkles, ShoppingBag, ExternalLink, Trash2, Heart, TrendingDown } from 'lucide-react';
import { GiftIdea } from '../types';
import { generateShoppingPlatforms } from '../utils/shoppingPlatforms';
import { MultiPlatformShoppingModal } from './MultiPlatformShoppingModal';

export const GiftComparisonModal: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
    formatPrice,
    setPreviewProduct
  } = useAuth();

  const [activePlatformGift, setActivePlatformGift] = useState<GiftIdea | null>(null);

  // Close Key: Escape listener
  useEffect(() => {
    if (!isCompareModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCompareModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompareModalOpen, setIsCompareModalOpen]);

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] glass-panel rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl glass-chip text-amber-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white font-['Outfit']">
                Gift Comparison Matrix
              </h2>
              <p className="text-xs text-slate-300">
                Comparing {compareList.length} of 4 selected gifts side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition cursor-pointer group shadow-sm active:scale-95"
              title="Close Comparison (Press Esc key)"
            >
              <span className="text-xs font-bold">Close</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-extrabold bg-white/20 text-white rounded border border-white/30 group-hover:bg-rose-500/40 transition">
                Esc
              </kbd>
              <X className="w-4 h-4 text-rose-400 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-x-auto p-6">
          {compareList.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Scale className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
              <p className="text-sm font-semibold text-slate-200">No gifts added to comparison yet</p>
              <p className="text-xs mt-1 text-slate-400">Click the balance scale icon on any gift card to compare features and pricing.</p>
            </div>
          ) : (
            <div className="grid grid-flow-col auto-cols-[280px] sm:auto-cols-[300px] gap-4 min-w-full">
              {compareList.map(gift => (
                <div
                  key={gift.id}
                  className="glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4"
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md glass-chip text-rose-300">
                        {gift.category}
                      </span>
                      <button
                        onClick={() => removeFromCompare(gift.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {gift.matchedProduct?.image && (
                      <div className="relative mb-3 rounded-2xl overflow-hidden bg-white/5 border border-white/10 h-36">
                        <img
                          src={gift.matchedProduct.image}
                          alt={gift.gift}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setPreviewProduct(gift)}
                          className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur text-white text-[10px] font-bold flex items-center gap-1 hover:bg-black/80 transition cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          3D Stage
                        </button>
                      </div>
                    )}

                    <h3 className="text-base font-extrabold text-white font-['Outfit'] line-clamp-2">
                      {gift.gift}
                    </h3>
                  </div>

                  {/* Attributes Matrix */}
                  <div className="space-y-3 text-xs divide-y divide-white/10">
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-slate-400">Price:</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {formatPrice(gift.priceNumeric || 2500)}
                      </span>
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-slate-400">Surprise Score:</span>
                      <span className="font-bold text-rose-300 bg-rose-500/20 border border-rose-400/30 px-2 py-0.5 rounded-md">
                        {gift.surpriseScore}/10
                      </span>
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-slate-400">Emotional Value:</span>
                      <span className="font-bold text-purple-300">
                        {gift.emotionalValue}
                      </span>
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-slate-400">Ease of Buying:</span>
                      <span className="font-medium text-slate-200">
                        {gift.difficulty}
                      </span>
                    </div>

                    <div className="pt-2">
                      <span className="text-slate-400 block mb-1">Key Advantages:</span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {gift.pros?.map((pro, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Multi-Platform Availability Row */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                      <span>Store Availability:</span>
                      <button
                        onClick={() => setActivePlatformGift(gift)}
                        className="text-rose-300 hover:text-rose-200 text-[10px] font-bold hover:underline cursor-pointer"
                      >
                        All Platforms →
                      </button>
                    </div>

                    {/* Quick Amazon & Flipkart 1-Click Buttons */}
                    {(() => {
                      const platforms = generateShoppingPlatforms(gift);
                      const amazonDeal = platforms.find(p => p.platform === 'Amazon') || platforms[0];
                      const flipkartDeal = platforms.find(p => p.platform === 'Flipkart') || platforms[0];

                      return (
                        <div className="grid grid-cols-2 gap-1.5">
                          <a
                            href={amazonDeal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-2 rounded-xl text-[10px] font-black text-white bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 transition flex items-center justify-between cursor-pointer group/amz"
                            title="Direct Amazon store link"
                          >
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9900]" />
                              Amazon
                            </span>
                            <span className="text-amber-300 font-bold flex items-center gap-0.5">
                              {formatPrice(amazonDeal.price)}
                              <ExternalLink className="w-2 h-2 opacity-70 group-hover/amz:opacity-100" />
                            </span>
                          </a>

                          <a
                            href={flipkartDeal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-2 rounded-xl text-[10px] font-black text-white bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 transition flex items-center justify-between cursor-pointer group/fk"
                            title="Direct Flipkart store link"
                          >
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2874F0]" />
                              Flipkart
                            </span>
                            <span className="text-blue-300 font-bold flex items-center gap-0.5">
                              {formatPrice(flipkartDeal.price)}
                              <ExternalLink className="w-2 h-2 opacity-70 group-hover/fk:opacity-100" />
                            </span>
                          </a>
                        </div>
                      );
                    })()}

                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                      {generateShoppingPlatforms(gift).map(p => (
                        <a
                          key={p.id}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold border transition shrink-0"
                          style={{
                            backgroundColor: p.bgColor,
                            borderColor: p.textColor + '40',
                            color: p.textColor
                          }}
                          title={`Buy on ${p.platform}`}
                        >
                          {p.platform}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => setActivePlatformGift(gift)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-white transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Compare & Buy Across Stores</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Multi-Platform Shopping Modal */}
      <MultiPlatformShoppingModal
        item={activePlatformGift}
        isOpen={Boolean(activePlatformGift)}
        onClose={() => setActivePlatformGift(null)}
      />
    </div>
  );
};
