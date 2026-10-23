import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RecommendationCard } from './RecommendationCard';
import {
  Sparkles,
  Download,
  Share2,
  RefreshCw,
  Filter,
  ArrowLeft,
  Scale,
  Award,
  Layers,
  Heart,
  ShoppingBag,
  Store,
  Box
} from 'lucide-react';
import jsPDF from 'jspdf';

export const ResultsView: React.FC = () => {
  const {
    currentRecommendations,
    currentQuestionnaire,
    previewProduct,
    setPreviewProduct,
    setActiveTab,
    compareList,
    setIsCompareModalOpen,
    addToast
  } = useAuth();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [minSurprise, setMinSurprise] = useState(0);

  if (!currentRecommendations || currentRecommendations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-rose-400 opacity-60 animate-pulse" />
        <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
          No Active Recommendations
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 mb-6">
          Start a new gift questionnaire to curate 10 personalized ideas.
        </p>
        <button
          onClick={() => setActiveTab('questionnaire')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition cursor-pointer"
        >
          Open Discovery Questionnaire
        </button>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(currentRecommendations.map(r => r.category)))];

  const filtered = currentRecommendations.filter(item => {
    const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchSurprise = item.surpriseScore >= minSurprise;
    return matchCat && matchSurprise;
  });

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(225, 29, 72);
      doc.rect(0, 0, 210, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('GiftAI Personalized Recommendation Dossier', 14, 15);
      doc.setFontSize(10);
      doc.text(`Recipient: ${currentQuestionnaire?.recipientName || 'Gift Recipient'} • Occasion: ${currentQuestionnaire?.occasion || 'Special Celebration'}`, 14, 22);

      let y = 38;
      currentRecommendations.forEach((gift, idx) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(11);
        doc.setTextColor(225, 29, 72);
        doc.text(`${idx + 1}. ${gift.gift} (${gift.price})`, 14, y);
        y += 5;

        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const lines = doc.splitTextToSize(`Reason: ${gift.reason}`, 180);
        doc.text(lines, 16, y);
        y += lines.length * 4.5;

        if (gift.presentationTip) {
          doc.setTextColor(180, 83, 9);
          const tip = doc.splitTextToSize(`Tip: ${gift.presentationTip}`, 180);
          doc.text(tip, 16, y);
          y += tip.length * 4.5;
        }
        y += 4;
      });

      doc.save(`GiftAI_Top10_${(currentQuestionnaire?.recipientName || 'Gifts').replace(/\s+/g, '_')}.pdf`);
      addToast('PDF downloaded successfully!', 'success');
    } catch {
      addToast('Failed to generate PDF.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 3D Interactive Showcase Banner */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold tracking-wider uppercase shadow-sm">
              Curated Dossier
            </span>
            <span className="text-xs font-bold text-slate-300">
              for {currentQuestionnaire?.recipientName} • {currentQuestionnaire?.occasion}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Top 10 Personalized Gifts
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Ranked by relevance, emotional resonance, and budget matching. Click any card to inspect in 3D, compare features, or save to your wishlist.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-white/90 text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Dossier</span>
            </button>

            <button
              onClick={() => setActiveTab('questionnaire')}
              className="px-4 py-2 rounded-xl glass-card hover:bg-white/15 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refine Questionnaire</span>
            </button>

            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Selected ({compareList.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Platform Availability & Realistic Visualizations Banner */}
      <div className="mb-6 p-4 rounded-2xl glass-panel border border-white/15 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-extrabold text-white">
                Multi-Store Shopping & Realistic 3D Visualizations
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                Live Pricing Active
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Compare prices across Amazon, Flipkart, Myntra, Etsy, Google Shopping & Tata CLiQ. Tap <Box className="w-2.5 h-2.5 inline text-amber-300 mx-0.5" /> to inspect items in real-time 3D lighting with celebratory occasion effects.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
          <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/15">Amazon</span>
          <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/15">Flipkart</span>
          <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/15">Myntra</span>
          <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/15">Etsy</span>
          <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/15">Google Shopping</span>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-slate-300 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'glass-chip text-slate-300 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">Min Surprise Score:</span>
          <select
            value={minSurprise}
            onChange={e => setMinSurprise(Number(e.target.value))}
            className="px-3 py-1 rounded-xl glass-input text-xs font-bold text-white cursor-pointer"
          >
            <option value={0} className="bg-slate-900 text-white">All Scores (1-10)</option>
            <option value={7} className="bg-slate-900 text-white">High Surprise (7+)</option>
            <option value={9} className="bg-slate-900 text-white">Max Surprise (9+)</option>
          </select>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((gift, index) => (
          <RecommendationCard
            key={gift.id || index}
            gift={gift}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};
