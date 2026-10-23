import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Gift,
  Wand2,
  Zap,
  Box,
  Download,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Heart,
  Smile,
  CheckCircle2,
  ShoppingBag,
  Mic,
  Eye,
  Sun,
  Moon,
  Sunset,
  Layers,
  Star,
  Check,
  ExternalLink
} from 'lucide-react';
import { RealProductVisualizer } from './RealProductVisualizer';
import { GiftIdea } from '../types';
import luxuryHeroImg from '../assets/images/luxury_gift_hero_1789029003441.jpg';
import realisticLifestyleImg from '../assets/images/realistic_gift_unboxing_1789029025587.jpg';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsAuthModalOpen, setAuthModalMode, formatPrice } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedGiftIdx, setSelectedGiftIdx] = useState<number>(0);
  const [lightingMode, setLightingMode] = useState<'day' | 'golden' | 'midnight'>('golden');
  const [packagingStyle, setPackagingStyle] = useState<'crimson' | 'kraft' | 'obsidian'>('crimson');
  const [inspectingGift, setInspectingGift] = useState<GiftIdea | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<number>(0);

  const realisticShowcaseGifts: GiftIdea[] = [
    {
      id: 'showcase-1',
      gift: 'Sony WH-1000XM5 Studio Noise Canceling Headphones',
      reason: 'Ultra-plush synthetic leather earcups, 30-hour playback, and industry-benchmark acoustic precision for audiophiles and travelers.',
      price: '₹28,990',
      priceNumeric: 28990,
      surpriseScore: 9,
      emotionalValue: 'High',
      difficulty: 'Easy to Find',
      category: 'Electronics',
      pros: ['30h Battery Life', 'High-Res LDAC Audio', 'Multi-Device Pairing'],
      presentationTip: 'Present in a matte obsidian box with silver satin ribbon and a personalized Spotify code card.',
      matchedProduct: {
        id: 'prod-2',
        name: 'Sony WH-1000XM5 Wireless Headphones',
        price: 28990,
        currency: '₹',
        rating: 4.9,
        reviewsCount: 1890,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        purchaseLink: 'https://www.amazon.in/dp/B09XS7JWHH',
        description: 'Engineered to perfection with 30-hour battery life and crystal clear hands-free calling.',
        inStock: true
      }
    },
    {
      id: 'showcase-2',
      gift: 'Fujifilm Instax Mini 12 Instant Camera & Film Bundle',
      reason: 'Captures physical memories instantly with automatic exposure control, close-up lens, and retro pastel charm.',
      price: '₹6,499',
      priceNumeric: 6499,
      surpriseScore: 9,
      emotionalValue: 'Priceless',
      difficulty: 'Easy to Find',
      category: 'Photography & Art',
      pros: ['Instant Physical Prints', 'Built-in Selfie Mirror', 'Auto Flash Control'],
      presentationTip: 'Include a custom mini photo album and colored metallic gel pens inside the gift box.',
      matchedProduct: {
        id: 'prod-3',
        name: 'Fujifilm Instax Mini 12 Instant Camera Bundle',
        price: 6499,
        currency: '₹',
        rating: 4.8,
        reviewsCount: 4210,
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
        category: 'Photography & Art',
        purchaseLink: 'https://www.amazon.in/dp/B0BYZTRK18',
        description: 'Compact instant camera with automatic exposure and built-in selfie mirror.',
        inStock: true
      }
    },
    {
      id: 'showcase-3',
      gift: 'Artisanal Ceramic Pour-Over Dripper & Single-Origin Roast',
      reason: 'Handcrafted stoneware cone with brass dripper stand and single-origin Chikmagalur estate beans for morning mindfulness.',
      price: '₹2,450',
      priceNumeric: 2450,
      surpriseScore: 8,
      emotionalValue: 'High',
      difficulty: 'Custom / Made-to-Order',
      category: 'Gourmet Food & Cooking',
      pros: ['Handcrafted Stoneware', 'Estate Arabica Beans', 'Slow-Drip Rich Crema'],
      presentationTip: 'Tie with natural jute twine and a sprig of dried eucalyptus alongside tasting notes.',
      matchedProduct: {
        id: 'prod-4',
        name: 'Handcrafted Ceramic Pour-Over Set',
        price: 2450,
        currency: '₹',
        rating: 4.7,
        reviewsCount: 680,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        category: 'Gourmet Food & Cooking',
        purchaseLink: 'https://www.amazon.in/dp/B09COFFEE1',
        description: 'Artisanal speckled ceramic pour-over cone paired with single-origin beans.',
        inStock: true
      }
    },
    {
      id: 'showcase-4',
      gift: 'Amazon Kindle Paperwhite (16 GB) Glare-Free Warm Display',
      reason: 'Reads like real paper even under blazing direct sunlight with adjustable warm light and waterproof chassis for bath & beach reading.',
      price: '₹13,999',
      priceNumeric: 13999,
      surpriseScore: 8,
      emotionalValue: 'High',
      difficulty: 'Easy to Find',
      category: 'Electronics & Books',
      pros: ['300 ppi Glare-Free Screen', 'IPX8 Waterproof', 'Up to 10 Weeks Battery'],
      presentationTip: 'Pair with an embossed vintage Italian leather sleeve with custom initials.',
      matchedProduct: {
        id: 'prod-1',
        name: 'Amazon Kindle Paperwhite (16 GB)',
        price: 13999,
        currency: '₹',
        rating: 4.8,
        reviewsCount: 3420,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics & Books',
        purchaseLink: 'https://www.amazon.in/dp/B08N3TCP2F',
        description: 'Flush-front design and 300 ppi glare-free display that reads like real paper.',
        inStock: true
      }
    }
  ];

  const currentHeroGift = realisticShowcaseGifts[selectedGiftIdx];

  const lifestyleHotspots = [
    {
      id: 0,
      title: 'Artisanal Pour-Over Dripper',
      desc: 'Hand-thrown speckled ceramic cone with precision spiral ribs for balanced extraction.',
      price: '₹2,450',
      x: '28%',
      y: '68%',
      giftIndex: 2
    },
    {
      id: 1,
      title: 'Retro Instant Film Camera',
      desc: 'Instant tangible prints with vintage pastel aesthetics and automated flash.',
      price: '₹6,499',
      x: '46%',
      y: '32%',
      giftIndex: 1
    },
    {
      id: 2,
      title: 'Botanical Amber Soy Candle',
      desc: 'Hand-poured 100% natural soy wax scented with cedarwood, bergamot & amber.',
      price: '₹1,250',
      x: '74%',
      y: '48%',
      giftIndex: 0
    }
  ];

  const faqs = [
    {
      q: 'How does the AI personalize gift recommendations?',
      a: 'GiftAI combines Google Gemini’s deep semantic reasoning with our proprietary gift-matching matrix. It analyzes the recipient’s age, relationship dynamics, occasion, budget limits, personality archetypes, and voice-dictated hobbies to produce ranked ideas with psychological emotional value and surprise scores.'
    },
    {
      q: 'Can I directly purchase the recommended gifts?',
      a: 'Yes! Every recommendation is mapped directly to authentic retail products on Amazon and top partner stores with live pricing, star ratings, and direct buy links.'
    },
    {
      q: 'Is the service completely free to use?',
      a: 'Yes! You can run unlimited gift discovery sessions, save ideas into custom collection folders, inspect gifts in interactive 3D, and download styled PDF dossiers at zero cost.'
    },
    {
      q: 'What if I have unique or niche hobbies to describe?',
      a: 'You can use our built-in Speech-to-Text Voice Dictation button in the questionnaire to describe subtle quirks, inside jokes, specific color aesthetics, or constraints like allergies in natural voice.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-chip text-xs font-bold text-rose-300">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Next-Gen AI Gifting Assistant • Powered by Gemini</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-['Outfit'] tracking-tight leading-[1.12]">
                Find the <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">Perfect Gift</span> for Any Person, Any Occasion.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                Stop guessing. Our AI analyzes personality traits, passions, budget, and sentiment to deliver 10 tailored gifts with emotional impact scores, 3D interactive stages, and direct retail checkout.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setActiveTab('questionnaire')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Find the Perfect Gift</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl glass-panel hover:bg-white/15 text-slate-200 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-rose-400" />
                  <span>Browse Catalog</span>
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-2xl font-extrabold text-white font-['Outfit']">50,000+</p>
                  <p className="text-xs text-slate-400">Gifts Discovered</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-rose-400 font-['Outfit']">98.4%</p>
                  <p className="text-xs text-slate-400">Recipient Delight</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-amber-400 font-['Outfit']">&lt;30 Sec</p>
                  <p className="text-xs text-slate-400">AI Curation Speed</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Realistic Gift Visualizer */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div
                className={`w-full max-w-md p-5 sm:p-6 glass-panel rounded-3xl backdrop-blur-2xl border shadow-2xl relative overflow-hidden transition-all duration-500 ${
                  lightingMode === 'golden'
                    ? 'border-amber-400/35 shadow-amber-500/10 bg-amber-950/20'
                    : lightingMode === 'midnight'
                    ? 'border-indigo-400/35 shadow-indigo-500/10 bg-slate-950/40'
                    : 'border-white/20 shadow-rose-500/10 bg-white/5'
                }`}
              >
                {/* Header: Badge & Rating */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-rose-400" />
                      Realistic Studio Preview
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                    <Star className="w-3 h-3 fill-rose-400 text-rose-400" />
                    <span>99.4% Match</span>
                  </div>
                </div>

                {/* Realistic Image Showcase with Lighting & Packaging Simulation */}
                <div className="relative mt-3 group overflow-hidden rounded-2xl border border-white/15 aspect-[4/3] bg-slate-950">
                  <img
                    src={selectedGiftIdx === 0 ? luxuryHeroImg : currentHeroGift.matchedProduct?.image || luxuryHeroImg}
                    alt={currentHeroGift.gift}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Ambient Lighting Overlay */}
                  <div
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                      lightingMode === 'golden'
                        ? 'bg-gradient-to-t from-amber-950/80 via-amber-600/15 to-transparent'
                        : lightingMode === 'midnight'
                        ? 'bg-gradient-to-t from-slate-950/90 via-indigo-950/25 to-transparent'
                        : 'bg-gradient-to-t from-black/75 via-transparent to-transparent'
                    }`}
                  />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-panel backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{currentHeroGift.category}</span>
                  </div>

                  {/* Packaging Style Pill */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg glass-panel backdrop-blur-md text-[10px] font-bold border border-white/20 text-slate-200">
                    <Gift className="w-3 h-3 text-rose-400" />
                    <span>
                      {packagingStyle === 'crimson' ? 'Crimson Satin Box' : packagingStyle === 'kraft' ? 'Eco Kraft Wrap' : 'Velvet Obsidian Box'}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-3 inset-x-3 flex items-end justify-between">
                    <div className="min-w-0 pr-2">
                      <p className="text-sm font-extrabold text-white truncate drop-shadow-md font-['Outfit']">
                        {currentHeroGift.gift}
                      </p>
                      <p className="text-[11px] font-extrabold text-emerald-400 drop-shadow">
                        {currentHeroGift.price} • Amazon Verified
                      </p>
                    </div>

                    <button
                      onClick={() => setInspectingGift(currentHeroGift)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 text-white font-bold text-[11px] shadow-lg flex items-center gap-1.5 shrink-0 transition cursor-pointer hover:scale-105"
                      title="Inspect in Real Studio Visualizer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Real Studio View</span>
                    </button>
                  </div>
                </div>

                {/* Studio Lighting Mood Switcher Controls */}
                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Studio Lighting:</span>
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setLightingMode('day')}
                      className={`px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer font-bold ${
                        lightingMode === 'day' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sun className="w-3 h-3 text-amber-300" />
                      <span>Daylight</span>
                    </button>
                    <button
                      onClick={() => setLightingMode('golden')}
                      className={`px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer font-bold ${
                        lightingMode === 'golden' ? 'bg-amber-500/30 text-amber-200' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sunset className="w-3 h-3 text-amber-400" />
                      <span>Golden</span>
                    </button>
                    <button
                      onClick={() => setLightingMode('midnight')}
                      className={`px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer font-bold ${
                        lightingMode === 'midnight' ? 'bg-indigo-500/30 text-indigo-200' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Moon className="w-3 h-3 text-indigo-300" />
                      <span>Midnight</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Product Selector Pills */}
                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                    Click to Inspect Curated Gifts:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {realisticShowcaseGifts.map((g, idx) => (
                      <button
                        key={g.id}
                        onClick={() => setSelectedGiftIdx(idx)}
                        className={`p-1.5 rounded-xl border text-left transition cursor-pointer flex flex-col items-center text-center ${
                          selectedGiftIdx === idx
                            ? 'bg-rose-500/20 border-rose-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] font-bold line-clamp-1">
                          {idx === 0 ? 'Headphones' : idx === 1 ? 'Camera' : idx === 2 ? 'Coffee Set' : 'Kindle'}
                        </span>
                        <span className="text-[9px] text-emerald-400 font-extrabold mt-0.5">
                          {idx === 0 ? '₹28.9k' : idx === 1 ? '₹6.4k' : idx === 2 ? '₹2.4k' : '₹13.9k'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Action CTAs */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('questionnaire')}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-xs shadow-md hover:brightness-110 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Get Personalized Gifts</span>
                  </button>
                  <button
                    onClick={() => setInspectingGift(currentHeroGift)}
                    className="px-3.5 py-3 rounded-xl glass-panel hover:bg-white/15 text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-white/15"
                    title="Launch 3D WebGL Studio"
                  >
                    <Box className="w-4 h-4 text-amber-400" />
                    <span>3D</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / KEY FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-chip text-xs font-bold text-amber-300">
            <Zap className="w-3.5 h-3.5" />
            <span>Intelligent Magic</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            Designed for Heartfelt Moments
          </h2>
          <p className="text-sm text-slate-400">
            Experience the most delightful gift-discovery workflow ever built.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card-hover rounded-3xl p-8 group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-white mb-2 font-['Outfit']">
              Semantic Personality Engine
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We translate 14+ psychological archetypes, hobbies, aesthetic color tones, and voice notes into precision matching queries.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card-hover rounded-3xl p-8 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-white mb-2 font-['Outfit']">
              3D WebGL Holograms
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inspect your gift ideas inside a futuristic 3D holographic podium powered by Three.js with realistic lighting and particle aura.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card-hover rounded-3xl p-8 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-white mb-2 font-['Outfit']">
              Export Styled PDF Dossiers
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate downloadable PDF gift reports with custom presentation wrapping suggestions, budget summaries, and direct links.
            </p>
          </div>
        </div>
      </section>

      {/* DEDICATED REALISTIC VISUALIZATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-chip text-xs font-bold text-rose-300 border border-rose-500/30">
            <Eye className="w-3.5 h-3.5 text-rose-400" />
            <span>Realistic Visualizations That Attract & Inspire</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            See Every Gift in Real Life Before Deciding
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Eliminate gifting anxiety. Explore authentic lifestyle arrangements, 360° interactive 3D occasion stages, and luxury packaging finishes designed to make your gift truly unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Lifestyle Scene with Hotspots */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-6 border border-white/15 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Interactive Lifestyle Arrangement</span>
              </div>
              <span className="text-[11px] text-amber-300 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Tap Hotspots on Photo
              </span>
            </div>

            {/* Realistic Lifestyle Photo with Clickable Radar Pins */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] group bg-slate-950">
              <img
                src={realisticLifestyleImg}
                alt="Realistic Gifting Lifestyle Scene"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Hotspot Markers */}
              {lifestyleHotspots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot.id)}
                  style={{ left: spot.x, top: spot.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group/pin z-20 cursor-pointer focus:outline-none"
                  title={spot.title}
                >
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        activeHotspot === spot.id ? 'bg-rose-400' : 'bg-amber-400'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white shadow-lg items-center justify-center text-[9px] font-black text-white ${
                        activeHotspot === spot.id ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                    >
                      {spot.id + 1}
                    </span>
                  </span>
                </button>
              ))}

              {/* Ambient Vignette */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
            </div>

            {/* Active Hotspot Detail Card */}
            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                    {lifestyleHotspots[activeHotspot].id + 1}
                  </span>
                  <h4 className="text-sm font-extrabold text-white truncate">
                    {lifestyleHotspots[activeHotspot].title}
                  </h4>
                  <span className="text-xs font-black text-emerald-400">
                    {lifestyleHotspots[activeHotspot].price}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {lifestyleHotspots[activeHotspot].desc}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    setInspectingGift(realisticShowcaseGifts[lifestyleHotspots[activeHotspot].giftIndex])
                  }
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Real Product</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Key Attraction Pillars */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Pillar 1 */}
            <div className="glass-panel p-5 rounded-2xl border border-white/15 space-y-2 hover:border-amber-400/30 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white font-['Outfit']">
                    Authentic Multi-Angle Real Product Visuals
                  </h3>
                  <span className="text-[10px] text-amber-300 font-bold">Ultra-HD Real Photography & Optical Loupe</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inspect authentic physical products with 2.5× optical loupe magnification on real material grain, true-to-life physical scale comparisons, and unboxing simulations.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="glass-panel p-5 rounded-2xl border border-white/15 space-y-2 hover:border-amber-400/30 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white font-['Outfit']">
                    Physically-Accurate Material Lighting
                  </h3>
                  <span className="text-[10px] text-emerald-300 font-bold">Daylight • Golden Hour • Midnight</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Preview how brushed aluminum, handcrafted ceramics, top-grain leather, and satin sheen respond to realistic lighting conditions before purchase.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="glass-panel p-5 rounded-2xl border border-white/15 space-y-2 hover:border-amber-400/30 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white font-['Outfit']">
                    Luxury Presentation Wrapping Preview
                  </h3>
                  <span className="text-[10px] text-purple-300 font-bold">Satin Ribbon • Botanical Kraft • Wax Seal</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                See exactly how the finished unboxing experience looks with tailored greeting card notes, premium wrapping paper, and custom ribbon knots.
              </p>
            </div>

            {/* Interactive Demo Action */}
            <div className="pt-2">
              <button
                onClick={() => setInspectingGift(realisticShowcaseGifts[0])}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-110 text-white font-extrabold text-xs shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Box className="w-4 h-4" />
                <span>Launch Interactive 3D Occasion Stage Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PERSONA TEASERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-white/20">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Instant Inspiration
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit']">
              Try a Quick Scenario
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Click any sample recipient persona below to jump-start recommendations with pre-filled traits!
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => setActiveTab('questionnaire')}
                className="px-4 py-2 rounded-xl glass-chip hover:bg-white/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>☕ Mindful Yoga Mom (Birthday)</span>
              </button>
              <button
                onClick={() => setActiveTab('questionnaire')}
                className="px-4 py-2 rounded-xl glass-chip hover:bg-white/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>🎮 Tech Gamer Colleague (Promotion)</span>
              </button>
              <button
                onClick={() => setActiveTab('questionnaire')}
                className="px-4 py-2 rounded-xl glass-chip hover:bg-white/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>✈️ Adventurous Partner (Anniversary)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Everything you need to know about GiftAI.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-100 hover:text-rose-300 transition cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-rose-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden border border-white/20 bg-gradient-to-r from-rose-600/30 via-purple-600/30 to-amber-600/30">
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit']">
              Ready to Give the Best Gift Ever?
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Launch our 4-step discovery questionnaire right now and unwrap personalized ideas in seconds.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('questionnaire')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl transition-transform duration-200 hover:scale-105 cursor-pointer"
              >
                Start Free Gift Questionnaire
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 pt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white font-bold shadow-md shadow-rose-500/20">
                <Gift className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white font-['Outfit']">
                GiftAI
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Personalized Gift Recommendation Platform powered by modern Google Gemini AI and real-time 3D WebGL visuals.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('landing')} className="hover:text-rose-400">Home</button></li>
              <li><button onClick={() => setActiveTab('questionnaire')} className="hover:text-rose-400">Find Gifts</button></li>
              <li><button onClick={() => setActiveTab('catalog')} className="hover:text-rose-400">Product Catalog</button></li>
              <li><button onClick={() => setActiveTab('saved')} className="hover:text-rose-400">Saved Wishlists</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Gifting Occasions</h4>
            <ul className="space-y-2 text-[11px]">
              <li>Birthdays & Anniversaries</li>
              <li>Diwali & Holiday Specials</li>
              <li>Graduations & Weddings</li>
              <li>Corporate & Mentor Gratitude</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Technology</h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              React 18 • Three.js 3D WebGL • Node.js Express • Google Gemini 2.5 • Tailwind CSS.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Personalized Gift Recommendation Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> for thoughtful givers worldwide.
          </p>
        </div>
      </footer>

      {/* Real Product Visualizer Modal */}
      {inspectingGift && (
        <RealProductVisualizer
          gift={inspectingGift}
          onClose={() => setInspectingGift(null)}
        />
      )}
    </div>
  );
};
