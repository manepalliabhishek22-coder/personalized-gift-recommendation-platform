import React, { useState } from 'react';
import { GiftIdea } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  Heart,
  Scale,
  ExternalLink,
  Box,
  Eye,
  CheckCircle2,
  Share2,
  ChevronDown,
  ShoppingBag,
  Star,
  FolderPlus,
  Package,
  TrendingDown,
  Tag
} from 'lucide-react';
import { generateShoppingPlatforms } from '../utils/shoppingPlatforms';
import { MultiPlatformShoppingModal } from './MultiPlatformShoppingModal';

interface RecommendationCardProps {
  gift: GiftIdea;
  rank: number;
  onSaveToggle?: (giftId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ gift, rank }) => {
  const {
    formatPrice,
    addToCompare,
    compareList,
    setPreviewProduct,
    addToast,
    user,
    currentRecordId,
    currentQuestionnaire
  } = useAuth();

  const [showTip, setShowTip] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [isMultiPlatformOpen, setIsMultiPlatformOpen] = useState(false);
  const [folders, setFolders] = useState<Array<{ id: string; name: string }>>([
    { id: '1', name: "Favorites" },
    { id: '2', name: "Birthday Ideas" },
    { id: '3', name: "Luxury Picks" }
  ]);
  const [newFolderName, setNewFolderName] = useState('');

  const isCompared = compareList.some(g => g.id === gift.id);

  const platforms = generateShoppingPlatforms(gift);
  const lowestPricePlatform = platforms.reduce((min, p) => p.price < min.price ? p : min, platforms[0]);

  const handleShare = () => {
    const text = `Check out this personalized gift idea: "${gift.gift}" (${formatPrice(gift.priceNumeric)}) - ${gift.reason}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      addToast('Gift details copied to clipboard!', 'success');
    }
  };

  const handleSaveClick = async (folderName?: string) => {
    setIsSaved(true);
    setShowFolderModal(false);
    if (currentRecordId) {
      try {
        await api.toggleSave(currentRecordId, folderName || 'Favorites');
      } catch {
        // saved locally
      }
    }
    addToast(`Saved "${gift.gift}" to ${folderName || 'Favorites'}!`, 'success');
  };

  const buyLink = gift.matchedProduct?.purchaseLink || platforms[0].url;

  // Surprise Score color
  const getSurpriseColor = (score: number) => {
    if (score >= 9) return 'from-rose-500 to-amber-500 text-rose-500';
    if (score >= 7) return 'from-indigo-500 to-purple-500 text-indigo-500';
    return 'from-emerald-500 to-teal-500 text-emerald-500';
  };

  return (
    <div className="relative glass-card-hover rounded-3xl p-5 sm:p-6 transition-all duration-300 group flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-7 h-7 rounded-xl bg-white/20 text-white font-extrabold text-xs flex items-center justify-center shadow-sm border border-white/20 backdrop-blur-md">
              #{rank}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 glass-chip px-2.5 py-1 rounded-lg">
              {gift.category}
            </span>
            {(gift.priceNumeric <= 500) && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1 shadow-sm">
                💰 Under ₹500
              </span>
            )}
            {(gift.priceNumeric > 500 && gift.priceNumeric <= 1500) && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center gap-1 shadow-sm">
                ✨ Pocket-Friendly
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* 3D Preview Button */}
            <button
              onClick={() => setPreviewProduct(gift)}
              className="p-2 rounded-xl text-slate-300 hover:text-indigo-300 hover:bg-white/10 transition cursor-pointer"
              title="Inspect in 3D Holographic Stage"
            >
              <Box className="w-4 h-4" />
            </button>

            {/* Compare Button */}
            <button
              onClick={() => addToCompare(gift)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isCompared
                  ? 'bg-amber-500/25 border border-amber-400/40 text-amber-300 shadow-sm'
                  : 'text-slate-300 hover:text-amber-300 hover:bg-white/10'
              }`}
              title="Add to Comparison"
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Share Gift Idea"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Heart Save */}
            <button
              onClick={() => setShowFolderModal(true)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isSaved
                  ? 'bg-rose-500/25 border border-rose-400/40 text-rose-300 shadow-sm'
                  : 'text-slate-300 hover:text-rose-300 hover:bg-white/10'
              }`}
              title="Save to Folder"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Estimated Price */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2.5">
          <h3 className="text-base sm:text-lg font-extrabold text-white font-['Outfit'] group-hover:text-rose-300 transition-colors">
            {gift.gift}
          </h3>
          <span className="text-base font-extrabold text-emerald-400 shrink-0">
            {formatPrice(gift.priceNumeric || 2500)}
          </span>
        </div>

        {/* Reasoning */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {gift.reason}
        </p>

        {/* Surprise Score & Emotional Value Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div>
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 mb-1">
              <span>Surprise Score</span>
              <span className="font-extrabold text-rose-400">{gift.surpriseScore}/10</span>
            </div>
            <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                style={{ width: `${(gift.surpriseScore / 10) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Emotional Value</div>
            <span
              className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                gift.emotionalValue === 'Priceless' || gift.emotionalValue === 'High'
                  ? 'bg-purple-500/20 border-purple-400/30 text-purple-200'
                  : 'bg-indigo-500/20 border-indigo-400/30 text-indigo-200'
              }`}
            >
              ❤️ {gift.emotionalValue}
            </span>
          </div>
        </div>

        {/* Pros Highlight tags */}
        {gift.pros && gift.pros.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {gift.pros.map((pro, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {pro}
              </span>
            ))}
          </div>
        )}

        {/* Presentation Tip & 3D Occasion Celebration Stage Trigger */}
        <div className="space-y-2.5 mb-4">
          {gift.presentationTip && (
            <div>
              <button
                onClick={() => setShowTip(!showTip)}
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>{showTip ? 'Hide Tip' : '✨ Presentation Tip'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showTip ? 'rotate-180' : ''}`} />
              </button>

              {showTip && (
                <div className="mt-2 p-3 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-xs text-amber-200 backdrop-blur-md animate-in fade-in duration-200">
                  {gift.presentationTip}
                </div>
              )}
            </div>
          )}

          {/* Real Product Visualizer Button */}
          <button
            onClick={() => setPreviewProduct(gift)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-950/60 via-slate-900/60 to-amber-950/60 hover:from-rose-900/80 hover:to-amber-900/80 border border-rose-400/30 text-rose-200 hover:text-white text-xs font-bold transition flex items-center justify-between cursor-pointer group shadow-sm"
            title="Inspect authentic product photography, macro materials, and true-to-life scale"
          >
            <span className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Inspect Real Product Visuals & Scale</span>
            </span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-lg font-medium flex items-center gap-1 group-hover:bg-rose-500/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Real View
            </span>
          </button>
        </div>
      </div>

      {/* Multi-Platform Retail Section */}
      <div className="mt-2 pt-3 border-t border-white/10 space-y-2.5">
        {/* Highlighted Lowest Price Website Suggestion Banner */}
        <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-blue-950/40 border border-emerald-400/30 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                Lowest Price Site
              </span>
              <span className="text-[11px] font-bold text-white truncate">
                {lowestPricePlatform.platform}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-extrabold text-emerald-400">
                {formatPrice(lowestPricePlatform.price)}
              </span>
              <span className="text-[10px] text-slate-400 line-through">
                {formatPrice(lowestPricePlatform.originalPrice)}
              </span>
              {lowestPricePlatform.savingsVsHighest && lowestPricePlatform.savingsVsHighest > 0 ? (
                <span className="text-[10px] font-semibold text-emerald-300">
                  (Save {formatPrice(lowestPricePlatform.savingsVsHighest)})
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={lowestPricePlatform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-white transition flex items-center gap-1 shadow-sm hover:brightness-110 cursor-pointer"
              style={{
                backgroundColor: lowestPricePlatform.brandColor === '#FF9900' ? '#E67E00' : lowestPricePlatform.brandColor
              }}
              title={`Direct link to lowest price store: ${lowestPricePlatform.platform}`}
            >
              <span>Buy on {lowestPricePlatform.platform}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>

            <button
              onClick={() => setIsMultiPlatformOpen(true)}
              className="px-2 py-1.5 rounded-xl text-xs font-semibold glass-chip hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
              title="Compare all stores"
            >
              Compare
            </button>
          </div>
        </div>

        {/* Matched Product or Top Deal Preview */}
        {gift.matchedProduct && (
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <img
              src={gift.matchedProduct.image}
              alt={gift.matchedProduct.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 object-cover rounded-xl shrink-0 border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-white truncate">
                {gift.matchedProduct.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center text-[10px] font-bold text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                  <span>{gift.matchedProduct.rating}</span>
                </div>
                <span className="text-[10px] font-medium text-slate-300">
                  Catalog Verified
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Direct 1-Click Platform Access for Amazon & Flipkart */}
        {(() => {
          const amazonDeal = platforms.find(p => p.platform === 'Amazon') || platforms[0];
          const flipkartDeal = platforms.find(p => p.platform === 'Flipkart') || platforms[0];

          return (
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <a
                href={amazonDeal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2.5 rounded-xl text-[11px] font-black text-white bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 transition flex items-center justify-between group/amz shadow-xs cursor-pointer hover:scale-[1.02]"
                title="Direct 1-click access to Amazon"
              >
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF9900]" />
                  <span>Amazon</span>
                </span>
                <span className="text-[10px] text-amber-300 font-bold flex items-center gap-0.5">
                  {formatPrice(amazonDeal.price)}
                  <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover/amz:opacity-100" />
                </span>
              </a>

              <a
                href={flipkartDeal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2.5 rounded-xl text-[11px] font-black text-white bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 transition flex items-center justify-between group/fk shadow-xs cursor-pointer hover:scale-[1.02]"
                title="Direct 1-click access to Flipkart"
              >
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#2874F0]" />
                  <span>Flipkart</span>
                </span>
                <span className="text-[10px] text-blue-300 font-bold flex items-center gap-0.5">
                  {formatPrice(flipkartDeal.price)}
                  <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover/fk:opacity-100" />
                </span>
              </a>
            </div>
          );
        })()}

        {/* Quick Online Shopping Platform Chips */}
        <div className="flex items-center justify-between gap-1.5 pt-0.5">
          <span className="text-[10px] font-semibold text-slate-400 shrink-0">
            All Stores ({platforms.length}):
          </span>
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {platforms.map(p => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition flex items-center gap-0.5 hover:scale-105 shrink-0 ${
                  p.id === lowestPricePlatform.id ? 'ring-1 ring-emerald-400' : ''
                }`}
                style={{
                  backgroundColor: p.bgColor,
                  borderColor: p.textColor + '40',
                  color: p.textColor
                }}
                title={`Open search on ${p.platform} (${formatPrice(p.price)})`}
              >
                <span>{p.platform} ({formatPrice(p.price)})</span>
                <ExternalLink className="w-2 h-2 opacity-70" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Platform Shopping Modal */}
      <MultiPlatformShoppingModal
        item={gift}
        isOpen={isMultiPlatformOpen}
        onClose={() => setIsMultiPlatformOpen(false)}
      />

      {/* Save to Folder Popup Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-white/20 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-rose-400" />
              Save to Collection Folder
            </h4>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {folders.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleSaveClick(f.name)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold glass-chip hover:bg-white/20 text-slate-200 transition cursor-pointer"
                >
                  📁 {f.name}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex gap-2">
              <input
                type="text"
                placeholder="New folder name..."
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl glass-input text-xs text-white focus:outline-none"
              />
              <button
                onClick={() => {
                  if (newFolderName.trim()) {
                    handleSaveClick(newFolderName.trim());
                  }
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
              >
                Save
              </button>
            </div>

            <button
              onClick={() => setShowFolderModal(false)}
              className="w-full text-center text-xs text-slate-400 hover:text-white pt-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
