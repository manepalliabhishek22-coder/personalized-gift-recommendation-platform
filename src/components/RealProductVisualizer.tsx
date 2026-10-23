import React, { useState, useRef, useEffect } from 'react';
import { GiftIdea, MatchedProduct } from '../types';
import {
  X,
  ExternalLink,
  ShoppingBag,
  Ruler,
  Sun,
  Eye,
  CheckCircle2,
  Sparkles,
  Gift,
  Search,
  ZoomIn,
  Camera,
  ShieldCheck,
  Heart,
  Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generateShoppingPlatforms } from '../utils/shoppingPlatforms';
import { MultiPlatformShoppingModal } from './MultiPlatformShoppingModal';
import { getRealProductVisualData } from '../utils/realProductVisuals';

interface RealProductVisualizerProps {
  gift: GiftIdea | MatchedProduct;
  onClose: () => void;
}

type LightingPreset = 'studio' | 'golden' | 'twilight' | 'daylight';
type InspectorTab = 'gallery' | 'scale' | 'packaging';

export const RealProductVisualizer: React.FC<RealProductVisualizerProps> = ({ gift, onClose }) => {
  const { formatPrice, addToCompare, addToast } = useAuth();
  const visualData = getRealProductVisualData(gift);

  const [selectedAngleId, setSelectedAngleId] = useState<string>('hero');
  const [activeLighting, setActiveLighting] = useState<LightingPreset>('studio');
  const [activeTab, setActiveTab] = useState<InspectorTab>('gallery');
  const [isMultiPlatformOpen, setIsMultiPlatformOpen] = useState(false);

  // Optical Magnifier Loupe state
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  // Custom Gift Card Note Simulator State
  const [giftNoteText, setGiftNoteText] = useState('Wishing you unforgettable moments and pure joy with this thoughtful gift!');
  const [selectedPackaging, setSelectedPackaging] = useState<'crimson' | 'kraft' | 'obsidian'>('crimson');

  // Escape key listener for Close Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const platforms = generateShoppingPlatforms(gift);
  const bestDeal = platforms.reduce((min, p) => (p.price < min.price ? p : min), platforms[0]);

  const activeAngle = visualData.angles.find(a => a.id === selectedAngleId) || visualData.angles[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomCoords({ x, y });
  };

  const getLightingOverlayStyle = () => {
    switch (activeLighting) {
      case 'golden':
        return 'bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-transparent mix-blend-color-dodge';
      case 'twilight':
        return 'bg-gradient-to-b from-indigo-950/40 via-purple-900/20 to-amber-900/25 mix-blend-soft-light';
      case 'daylight':
        return 'bg-gradient-to-t from-sky-300/15 via-white/10 to-transparent mix-blend-overlay';
      case 'studio':
      default:
        return 'bg-transparent';
    }
  };

  const currentPrice = 'priceNumeric' in gift && gift.priceNumeric ? gift.priceNumeric : ('price' in gift ? gift.price : 2499);
  const surpriseScore = 'surpriseScore' in gift ? gift.surpriseScore : 9;
  const emotionalValue = 'emotionalValue' in gift ? gift.emotionalValue : 'High';
  const difficulty = 'difficulty' in gift ? gift.difficulty : 'In Stock';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] glass-panel rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/20 bg-slate-950/95">
        
        {/* Header with Authentic Badge */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-md shrink-0">
              <Camera className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] truncate max-w-[260px] sm:max-w-md">
                  {visualData.title}
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Verified Real Product
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span>{visualData.category}</span>
                <span>•</span>
                <span className="text-amber-300 font-semibold">Real High-Resolution Photography</span>
              </p>
            </div>
          </div>

          <button
            id="visualizer-close-key-btn"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition cursor-pointer shrink-0 group active:scale-95 shadow-sm"
            title="Close Visualizer (Keyboard key: Esc)"
          >
            <span className="text-xs font-bold">Close</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-extrabold bg-white/20 text-white rounded border border-white/30 group-hover:bg-rose-500/40 group-hover:border-rose-400/50 transition">
              Esc
            </kbd>
            <X className="w-4 h-4 text-rose-400 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* View Mode Tabs Bar */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Multi-Angle Loupe ({visualData.angles.length} Angles)</span>
            </button>

            <button
              onClick={() => setActiveTab('scale')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'scale'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Real-Life Scale & Dimensions</span>
            </button>

            <button
              onClick={() => setActiveTab('packaging')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'packaging'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Unboxing & Card Simulator</span>
            </button>
          </div>

          {/* Real Lighting Filter Control */}
          <div className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-xl border border-white/10 shrink-0">
            <Sun className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">Lighting:</span>
            <select
              value={activeLighting}
              onChange={e => setActiveLighting(e.target.value as LightingPreset)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="studio" className="bg-slate-900 text-white">Studio Clean (5500K)</option>
              <option value="golden" className="bg-slate-900 text-white">Golden Hour (3200K)</option>
              <option value="twilight" className="bg-slate-900 text-white">Velvet Night (2400K)</option>
              <option value="daylight" className="bg-slate-900 text-white">Bright Natural Day</option>
            </select>
          </div>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: MULTI-ANGLE REAL PHOTO GALLERY WITH OPTICAL LOUPE */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Primary Real Photo Stage with Optical Loupe */}
              <div
                ref={imageContainerRef}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-white/15 cursor-crosshair group select-none shadow-2xl"
              >
                {/* Standard Base Real Photo */}
                <img
                  src={activeAngle.url}
                  alt={activeAngle.label}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-300"
                />

                {/* Lighting Filter Ambient Overlay */}
                <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${getLightingOverlayStyle()}`} />

                {/* Interactive Optical Magnifier Loupe (Circular High-Resolution Lens) */}
                {isZooming && (
                  <div
                    className="absolute w-44 h-44 rounded-full pointer-events-none border-2 border-white/90 shadow-[0_0_25px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(255,255,255,0.3)] overflow-hidden hidden sm:block z-30"
                    style={{
                      left: `calc(${zoomCoords.x}% - 88px)`,
                      top: `calc(${zoomCoords.y}% - 88px)`,
                      backgroundImage: `url(${activeAngle.url})`,
                      backgroundPosition: `${zoomCoords.x}% ${zoomCoords.y}%`,
                      backgroundSize: '350%',
                      backgroundRepeat: 'no-repeat',
                      backdropFilter: 'blur(0px)'
                    }}
                  >
                    {/* Reticle Focus Ring */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border border-white/60 rounded-full" />
                      <div className="absolute w-full h-[1px] bg-white/25" />
                      <div className="absolute h-full w-[1px] bg-white/25" />
                    </div>
                  </div>
                )}

                {/* Top Overlay Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-rose-400" />
                    <span>{activeAngle.label}</span>
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <ZoomIn className="w-3 h-3 text-amber-300" />
                    <span className="hidden sm:inline">Hover to Zoom Micro-Textures (2.5×)</span>
                    <span className="sm:hidden">Authentic Photo</span>
                  </span>
                </div>

                {/* Bottom Photo Description Bar */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-xs text-slate-200 flex items-center justify-between">
                  <p className="line-clamp-1">{activeAngle.description}</p>
                  <span className="text-[10px] text-emerald-300 font-bold shrink-0 ml-2 hidden sm:block">
                    Physical Authentic Asset
                  </span>
                </div>
              </div>

              {/* Multi-Angle Real Photo Selector Strip */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                  <span>Select Real Product Angle:</span>
                  <span className="text-[11px] text-rose-300">{visualData.angles.length} Verified Perspectives</span>
                </div>
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {visualData.angles.map(angle => {
                    const isSelected = angle.id === selectedAngleId;
                    return (
                      <button
                        key={angle.id}
                        onClick={() => setSelectedAngleId(angle.id)}
                        className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all duration-200 cursor-pointer group ${
                          isSelected
                            ? 'border-rose-500 ring-2 ring-rose-500/40 bg-rose-500/10 shadow-lg scale-102'
                            : 'border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="h-14 sm:h-16 rounded-lg overflow-hidden bg-slate-900 mb-1">
                          <img
                            src={angle.url}
                            alt={angle.shortName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <p className={`text-[10px] font-bold truncate ${isSelected ? 'text-rose-300' : 'text-slate-300'}`}>
                          {angle.shortName}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REAL-LIFE SCALE & DIMENSIONS INSPECTOR */}
          {activeTab === 'scale' && (
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/15 space-y-4 bg-slate-900/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-emerald-400" />
                      <span>True-to-Life Proportions & Scale Comparison</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Never receive an unexpectedly small or oversized gift. Compare against standard real-world objects.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Net: {visualData.specs.weightGrams}g ({visualData.specs.weightOz})
                  </span>
                </div>

                {/* Visual Scale Comparison Arena */}
                <div className="relative rounded-2xl bg-slate-950 p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-around gap-6 min-h-[220px]">
                  {/* Reference Everyday Object */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-28 sm:w-20 sm:h-36 rounded-2xl border-2 border-dashed border-slate-600 bg-slate-900/80 flex flex-col items-center justify-center p-2 shadow-md">
                      <span className="text-[10px] font-bold text-slate-400">📱 iPhone 15</span>
                      <span className="text-[9px] font-mono text-slate-500">14.7 cm</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Reference Scale</span>
                  </div>

                  {/* Proportional Scale Divider Bar with Height Indicator */}
                  <div className="flex items-center gap-3">
                    <div className="h-28 w-[1px] bg-gradient-to-b from-transparent via-rose-500 to-transparent relative">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-rose-400 font-bold whitespace-nowrap">
                        {visualData.specs.dimensionsCm}
                      </span>
                    </div>
                  </div>

                  {/* Actual Real Product Image */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="h-32 sm:h-44 w-32 sm:w-44 rounded-2xl bg-white/5 border border-white/20 p-2 shadow-xl flex items-center justify-center overflow-hidden">
                      <img
                        src={visualData.heroImage}
                        alt={visualData.title}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-extrabold text-white">{visualData.title}</span>
                  </div>
                </div>

                {/* Dimension Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dimensions (Metric)</span>
                    <span className="text-xs sm:text-sm font-extrabold text-white font-mono">{visualData.specs.dimensionsCm}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dimensions (Imperial)</span>
                    <span className="text-xs sm:text-sm font-extrabold text-white font-mono">{visualData.specs.dimensionsInches}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weight</span>
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono">{visualData.specs.weightGrams} grams</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reference Match</span>
                    <span className="text-[11px] font-bold text-amber-300">{visualData.specs.scaleReference.comparisonItem}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                  <p className="font-semibold">💡 Scale Advice: {visualData.specs.scaleReference.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REAL LUXURY PACKAGING & HANDWRITTEN CARD SIMULATOR */}
          {activeTab === 'packaging' && (
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/15 space-y-4 bg-slate-900/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-400" />
                      <span>Realistic Gift Presentation & Unboxing Simulator</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Preview the unboxing experience down to the ribbon knot, wrapping texture, and personalized note card.
                    </p>
                  </div>
                </div>

                {/* Packaging Finishes Switcher */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedPackaging('crimson')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedPackaging === 'crimson'
                        ? 'border-rose-500 bg-rose-500/15 ring-1 ring-rose-500'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">🎀 Crimson Satin Silk Ribbon</span>
                    <span className="text-[11px] text-slate-300">Classic luxury gift box with handmade knot</span>
                  </button>

                  <button
                    onClick={() => setSelectedPackaging('kraft')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedPackaging === 'kraft'
                        ? 'border-amber-500 bg-amber-500/15 ring-1 ring-amber-500'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">🌿 Eco-Botanical Kraft</span>
                    <span className="text-[11px] text-slate-300">Recycled fiber wrap with dried sprigs & twine</span>
                  </button>

                  <button
                    onClick={() => setSelectedPackaging('obsidian')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedPackaging === 'obsidian'
                        ? 'border-purple-500 bg-purple-500/15 ring-1 ring-purple-500'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">✨ Obsidian Gold Foil & Wax Seal</span>
                    <span className="text-[11px] text-slate-300">Matte black rigid box with metallic monogram seal</span>
                  </button>
                </div>

                {/* Personalized Calligraphy Card Simulator */}
                <div className="p-4 sm:p-6 rounded-2xl bg-amber-50 text-slate-900 shadow-xl border border-amber-200 relative overflow-hidden">
                  <div className="absolute top-2 right-3 text-[10px] uppercase font-bold text-amber-800 tracking-widest">
                    Complimentary Gift Card
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-amber-950">To My Dearest Recipient,</p>
                    <p className="text-sm sm:text-base font-serif italic text-amber-900 leading-relaxed font-['Playfair_Display',serif]">
                      "{giftNoteText}"
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs text-amber-800 border-t border-amber-200/60">
                      <span>Personalized with ❤️</span>
                      <span className="font-bold">Includes Authentic Certificate</span>
                    </div>
                  </div>
                </div>

                {/* Editable Card Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Customize Your Gift Note Preview:</label>
                  <input
                    type="text"
                    value={giftNoteText}
                    onChange={e => setGiftNoteText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter personalized note text..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* REAL MATERIAL & BUILD DETAILS */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3 bg-white/5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Verified Physical Build & Materials
            </h4>
            <div className="flex flex-wrap gap-2">
              {visualData.specs.materials.map((mat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs text-slate-200 font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {mat}
                </span>
              ))}
            </div>

            {/* In The Box Strip */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-slate-300 flex-wrap">
              <span className="font-bold text-white">Included in Box:</span>
              {visualData.specs.inTheBox.map((item, i) => (
                <span key={i} className="text-slate-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/10 text-[11px]">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* PRICE & RETAIL STORES PURCHASE BAR */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/40 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Verified Real Market Price
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
                  {difficulty}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-white font-['Outfit']">
                  {formatPrice(currentPrice)}
                </span>
                <span className="text-xs text-slate-400">Best price on {bestDeal.platform}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <a
                href={platforms.find(p => p.platform === 'Amazon')?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-105"
                title="Direct Amazon Product Search"
              >
                <span className="w-2 h-2 rounded-full bg-[#FF9900]" />
                <span>Amazon</span>
                <ExternalLink className="w-3 h-3 text-amber-300" />
              </a>

              <a
                href={platforms.find(p => p.platform === 'Flipkart')?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-105"
                title="Direct Flipkart Product Search"
              >
                <span className="w-2 h-2 rounded-full bg-[#2874F0]" />
                <span>Flipkart</span>
                <ExternalLink className="w-3 h-3 text-blue-300" />
              </a>

              <button
                onClick={() => setIsMultiPlatformOpen(true)}
                className="px-3.5 py-2 rounded-xl glass-card hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/15 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-rose-300" />
                <span>All {platforms.length} Stores</span>
              </button>

              <a
                href={bestDeal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:brightness-110 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Cheapest Deal ({bestDeal.platform})</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Multi-Platform Comparison Modal */}
      <MultiPlatformShoppingModal
        item={gift}
        isOpen={isMultiPlatformOpen}
        onClose={() => setIsMultiPlatformOpen(false)}
      />
    </div>
  );
};
