import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { QuestionnaireData } from '../types';
import { VoiceInputButton } from './VoiceInputButton';
import {
  User,
  Heart,
  Calendar,
  DollarSign,
  Sparkles,
  Palette,
  Check,
  ArrowRight,
  ArrowLeft,
  Wand2,
  Sliders,
  HelpCircle,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const RELATIONSHIPS = [
  'Friend',
  'Wife',
  'Husband',
  'Girlfriend',
  'Boyfriend',
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Colleague',
  'Teacher',
  'Mentor',
  'Child',
  'Cousin',
  'Grandparent',
  'Boss'
];

const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Christmas',
  'Diwali',
  'Valentine\'s Day',
  'Wedding',
  'Graduation',
  'Mother\'s Day',
  'Father\'s Day',
  'Housewarming',
  'Promotion / Career',
  'Baby Shower',
  'Retirement',
  'Thank You / Gratitude',
  'Just Because / Surprise'
];

const PERSONALITY_TRAITS = [
  { id: 'Creative', label: 'Creative & Artistic', icon: '🎨' },
  { id: 'Tech Lover', label: 'Tech & Gadget Geek', icon: '💻' },
  { id: 'Introvert', label: 'Introvert & Homebody', icon: '☕' },
  { id: 'Extrovert', label: 'Extrovert & Socialite', icon: '🎉' },
  { id: 'Adventurous', label: 'Adventurous & Outdoorsy', icon: '🏕️' },
  { id: 'Book Lover', label: 'Bookworm & Thinker', icon: '📚' },
  { id: 'Fashion Enthusiast', label: 'Fashion & Style Icon', icon: '✨' },
  { id: 'Fitness Lover', label: 'Fitness & Health Nut', icon: '🏃' },
  { id: 'Gamer', label: 'Gamer & Streamer', icon: '🎮' },
  { id: 'Spiritual', label: 'Spiritual & Mindful', icon: '🧘' },
  { id: 'Foodie', label: 'Foodie & Gourmet Chef', icon: '🍷' },
  { id: 'Minimalist', label: 'Minimalist & Practical', icon: '🌿' },
  { id: 'Luxury Connoisseur', label: 'Luxury Connoisseur', icon: '👑' },
  { id: 'Eco-Conscious', label: 'Eco-Friendly & Green', icon: '🌱' }
];

const INTERESTS_LIST = [
  'Music & Concerts',
  'Cooking & Baking',
  'Reading & Literature',
  'Sports & Fitness',
  'Technology & AI',
  'Photography & Video',
  'Gardening & Plants',
  'Travel & Exploration',
  'Movies & Cinema',
  'Fine Art & Crafts',
  'Gaming & Esports',
  'Fashion & Apparel',
  'Yoga & Wellness',
  'Writing & Journaling',
  'Coffee & Mixology',
  'Astronomy & Science'
];

const COLOR_PRESETS = [
  { name: 'Rose Gold', hex: '#fb7185' },
  { name: 'Midnight Navy', hex: '#1e3a8a' },
  { name: 'Emerald Forest', hex: '#059669' },
  { name: 'Royal Purple', hex: '#7c3aed' },
  { name: 'Champagne Gold', hex: '#f59e0b' },
  { name: 'Matte Charcoal', hex: '#334155' },
  { name: 'Coral Sunset', hex: '#f97316' },
  { name: 'Pastel Lavender', hex: '#c084fc' }
];

export const QuestionnaireForm: React.FC = () => {
  const {
    currency,
    formatPrice,
    setCurrentQuestionnaire,
    setCurrentRecommendations,
    setCurrentRecordId,
    setActiveTab,
    addToast
  } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPhase, setLoadingPhase] = useState<string>('');

  const [formData, setFormData] = useState<QuestionnaireData>({
    recipientName: '',
    recipientAge: 26,
    recipientGender: 'Female',
    relationship: 'Friend',
    occasion: 'Birthday',
    budgetMin: 1000,
    budgetMax: 15000,
    currency: currency || '₹',
    personalityTraits: ['Creative', 'Tech Lover'],
    interests: ['Music & Concerts', 'Technology & AI', 'Reading & Literature'],
    favoriteColor: '#fb7185',
    hobbies: '',
    additionalNotes: ''
  });

  const updateField = <K extends keyof QuestionnaireData>(field: K, value: QuestionnaireData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePersonality = (trait: string) => {
    setFormData(prev => {
      const exists = prev.personalityTraits.includes(trait);
      const updated = exists
        ? prev.personalityTraits.filter(t => t !== trait)
        : [...prev.personalityTraits, trait];
      return { ...prev, personalityTraits: updated };
    });
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      const updated = exists
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  const setBudgetPreset = (min: number, max: number) => {
    setFormData(prev => ({ ...prev, budgetMin: min, budgetMax: max }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.recipientName.trim()) {
      addToast('Please enter the recipient\'s name', 'error');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!formData.recipientName.trim()) {
      addToast('Please enter recipient name', 'error');
      setStep(1);
      return;
    }

    setLoading(true);
    setLoadingPhase('Analyzing personality & sentiment markers...');

    try {
      setTimeout(() => {
        setLoadingPhase('Scanning curated product catalog & luxury ideas...');
      }, 1200);

      setTimeout(() => {
        setLoadingPhase('Synthesizing top 10 ranked gift options with AI...');
      }, 2400);

      const res = await api.generateRecommendations({
        ...formData,
        currency: currency
      });

      setCurrentQuestionnaire(formData);
      setCurrentRecommendations(res.recommendations);
      setCurrentRecordId(res.recommendationRecord.id);

      addToast(`Generated 10 perfect gift ideas for ${formData.recipientName}!`, 'success');
      setActiveTab('results');
    } catch (err: any) {
      addToast(err.message || 'Failed to generate recommendations. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-chip text-xs font-bold text-rose-300 mb-3">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Interactive AI Gift Stylist</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
          Gift Discovery Questionnaire
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2">
          Tell us about the recipient, and our AI will curate 10 tailored gifts with surprise scores, emotional value, and retail matches.
        </p>

        {/* Step Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span className={step >= 1 ? 'text-rose-300' : ''}>1. Recipient</span>
            <span className={step >= 2 ? 'text-rose-300' : ''}>2. Occasion & Budget</span>
            <span className={step >= 3 ? 'text-rose-300' : ''}>3. Personality</span>
            <span className={step >= 4 ? 'text-rose-300' : ''}>4. Interests & Notes</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-white/20">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 blur-xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-white/30 backdrop-blur-xl flex items-center justify-center text-rose-400 shadow-2xl">
                <Gift className="w-10 h-10 animate-bounce text-rose-400" />
              </div>
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Curating Perfect Gifts for {formData.recipientName}
              </h3>
              <p className="text-xs text-rose-300 font-medium animate-pulse">
                {loadingPhase}
              </p>
              <div className="w-48 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full w-2/3 animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <AnimatePresence mode="wait">
              {/* STEP 1: Recipient Basics */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-rose-400" />
                      Step 1: Who are you gifting?
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Tell us the fundamental details about the recipient.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5">
                        Recipient Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya, John, Mom, David"
                        value={formData.recipientName}
                        onChange={e => updateField('recipientName', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl glass-input text-sm focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5">
                        Relationship to You
                      </label>
                      <select
                        value={formData.relationship}
                        onChange={e => updateField('relationship', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl glass-input text-sm cursor-pointer transition focus:outline-none"
                      >
                        {RELATIONSHIPS.map(rel => (
                          <option key={rel} value={rel} className="bg-slate-900 text-white">{rel}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold text-slate-200">
                          Approximate Age
                        </label>
                        <span className="text-xs font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-md">
                          {formData.recipientAge} Years Old
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={99}
                        value={formData.recipientAge}
                        onChange={e => updateField('recipientAge', Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer h-2 bg-white/15 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Toddler (1)</span>
                        <span>Adult (30)</span>
                        <span>Senior (99)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5">
                        Gender Identity
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Female', 'Male', 'Non-binary'] as const).map(gender => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => updateField('recipientGender', gender)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              formData.recipientGender === gender
                                ? 'bg-gradient-to-r from-rose-500 to-rose-600 border-rose-400 text-white shadow-md'
                                : 'glass-chip text-slate-200 hover:bg-white/15'
                            }`}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Occasion & Budget */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-rose-400" />
                      Step 2: Occasion & Budget Range
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Choose what you are celebrating and set your spending limits.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">
                      Gifting Occasion
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                      {OCCASIONS.map(occ => (
                        <button
                          key={occ}
                          type="button"
                          onClick={() => updateField('occasion', occ)}
                          className={`p-3 rounded-2xl text-xs font-bold text-left border transition flex items-center justify-between cursor-pointer ${
                            formData.occasion === occ
                              ? 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-md backdrop-blur-md'
                              : 'glass-chip text-slate-200 hover:bg-white/15'
                          }`}
                        >
                          <span>{occ}</span>
                          {formData.occasion === occ && <Check className="w-4 h-4 text-rose-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        Target Budget Range
                      </label>
                      <div className="text-sm font-extrabold text-white">
                        {formatPrice(formData.budgetMin)} – {formatPrice(formData.budgetMax)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Max Budget Limit:</span>
                          <span className="font-bold text-rose-400">{formatPrice(formData.budgetMax)}</span>
                        </div>
                        <input
                          type="range"
                          min={250}
                          max={50000}
                          step={250}
                          value={formData.budgetMax}
                          onChange={e => updateField('budgetMax', Number(e.target.value))}
                          className="w-full accent-rose-500 cursor-pointer h-2 bg-white/15 rounded-lg"
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[11px] text-slate-400 self-center mr-1">Quick Presets:</span>
                        <button
                          type="button"
                          onClick={() => setBudgetPreset(200, 500)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                            formData.budgetMax <= 500
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                              : 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30'
                          }`}
                        >
                          💰 Under {formatPrice(500)} (Affordable for Everyone)
                        </button>
                        <button
                          type="button"
                          onClick={() => setBudgetPreset(500, 1500)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                            formData.budgetMax === 1500
                              ? 'bg-teal-500 text-slate-950 font-bold'
                              : 'glass-chip text-teal-300 hover:bg-white/20'
                          }`}
                        >
                          ✨ {formatPrice(500)} - {formatPrice(1500)}
                        </button>
                        <button
                          type="button"
                          onClick={() => setBudgetPreset(1500, 5000)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                            formData.budgetMax === 5000
                              ? 'bg-rose-500 text-white font-bold'
                              : 'glass-chip text-slate-200 hover:bg-white/20'
                          }`}
                        >
                          🎁 {formatPrice(1500)} - {formatPrice(5000)}
                        </button>
                        <button
                          type="button"
                          onClick={() => setBudgetPreset(5000, 15000)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                            formData.budgetMax === 15000
                              ? 'bg-rose-500 text-white font-bold'
                              : 'glass-chip text-slate-200 hover:bg-white/20'
                          }`}
                        >
                          🌟 {formatPrice(5000)} - {formatPrice(15000)}
                        </button>
                        <button
                          type="button"
                          onClick={() => setBudgetPreset(15000, 50000)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                            formData.budgetMax === 50000
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'glass-chip text-slate-200 hover:bg-white/20'
                          }`}
                        >
                          👑 Luxury ({formatPrice(15000)}+)
                        </button>
                      </div>

                      {/* Store Price Suggestion Hint */}
                      <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-400/30 text-xs text-slate-300 flex items-center gap-2">
                        <span className="text-base">🏷️</span>
                        <span>
                          <strong>Lowest Price Recommendation:</strong> We automatically scan Flipkart, Amazon, and Google Shopping to identify the website with the lowest real-time price for every recommendation.
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Personality Archetypes */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      Step 3: Recipient's Personality
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Select all archetypes that describe {formData.recipientName || 'them'} best (select 2 or more).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {PERSONALITY_TRAITS.map(trait => {
                      const isSelected = formData.personalityTraits.includes(trait.id);
                      return (
                        <button
                          key={trait.id}
                          type="button"
                          onClick={() => togglePersonality(trait.id)}
                          className={`p-3.5 rounded-2xl text-xs font-bold text-left border transition-all duration-200 flex flex-col justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-br from-rose-500/25 to-amber-500/20 border-rose-400 text-rose-200 shadow-lg shadow-rose-500/15 scale-[1.02] backdrop-blur-md'
                              : 'glass-card text-slate-200 hover:bg-white/15'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xl">{trait.icon}</span>
                            {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                          </div>
                          <span>{trait.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Interests, Favorite Color, Hobbies & Voice Dictation */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-400" />
                      Step 4: Interests, Aesthetics & Special Notes
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Fine-tune recommendations with hobbies, favorite colors, and voice dictation.
                    </p>
                  </div>

                  {/* Interests Chips */}
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-2">
                      Key Interests (Multiple Select)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS_LIST.map(interest => {
                        const isSelected = formData.interests.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                              isSelected
                                ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-md backdrop-blur-md'
                                : 'glass-chip text-slate-200 hover:bg-white/15'
                            }`}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Favorite Color Picker */}
                  <div className="pt-3 border-t border-white/10">
                    <label className="block text-xs font-bold text-slate-200 mb-2">
                      Favorite Color / Aesthetic Tone
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {COLOR_PRESETS.map(color => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => updateField('favoriteColor', color.hex)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                            formData.favoriteColor === color.hex
                              ? 'border-white bg-white/20 shadow-md'
                              : 'glass-chip'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-slate-200">{color.name}</span>
                        </button>
                      ))}
                      <div className="flex items-center gap-1.5 pl-2">
                        <input
                          type="color"
                          value={formData.favoriteColor}
                          onChange={e => updateField('favoriteColor', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                          title="Custom Color Picker"
                        />
                        <span className="text-xs text-slate-400 font-mono">{formData.favoriteColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hobbies & Voice Dictation */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-200">
                        Specific Hobbies & Passions
                      </label>
                      <VoiceInputButton
                        onTranscript={text => {
                          const updated = formData.hobbies ? `${formData.hobbies} ${text}` : text;
                          updateField('hobbies', updated);
                          addToast('Voice transcribed to Hobbies field!', 'success');
                        }}
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="e.g. Loves manual film photography, brews pour-over coffee on weekends, plays badminton on Friday nights..."
                      value={formData.hobbies}
                      onChange={e => updateField('hobbies', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs focus:outline-none"
                    />
                  </div>

                  {/* Additional Notes & Voice Dictation */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-200">
                        Additional Notes / Dislikes / Constraints
                      </label>
                      <VoiceInputButton
                        onTranscript={text => {
                          const updated = formData.additionalNotes ? `${formData.additionalNotes} ${text}` : text;
                          updateField('additionalNotes', updated);
                          addToast('Voice transcribed to Notes field!', 'success');
                        }}
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="e.g. Already owns an iPad, allergic to scented perfumes, prefers sustainable packaging..."
                      value={formData.additionalNotes}
                      onChange={e => updateField('additionalNotes', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl glass-card hover:bg-white/15 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-sm font-extrabold shadow-xl shadow-rose-500/30 transition flex items-center gap-2 scale-105 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Top 10 Recommendations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
