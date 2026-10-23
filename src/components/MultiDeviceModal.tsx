import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Tablet,
  Laptop,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Share2,
  X,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MultiDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiDeviceModal: React.FC<MultiDeviceModalProps> = ({ isOpen, onClose }) => {
  const { user, addToast } = useAuth();
  const [copied, setCopied] = useState(false);

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

  if (!isOpen) return null;

  // Detect current URL or fallback to deployed URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-tswqbhvljafpiu2jt27utk-904244562291.asia-east1.run.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&color=0f172a&bgcolor=ffffff&data=${encodeURIComponent(currentUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    addToast('App URL copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GiftAI - Personalized Gift Recommendation Platform',
          text: 'Check out my AI-powered gift recommendations with 3D unboxing and personality matching!',
          url: currentUrl
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 border border-white/15">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-['Outfit']">
                Access on Any Device
              </h2>
              <p className="text-xs text-slate-300">
                Scan, copy, or sync your session on phone, tablet, or PC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition cursor-pointer group shadow-sm active:scale-95"
            title="Close (Press Esc key)"
          >
            <span className="text-xs font-bold">Close</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-extrabold bg-white/20 text-white rounded border border-white/30 group-hover:bg-rose-500/40 transition">
              Esc
            </kbd>
            <X className="w-4 h-4 text-rose-400 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Device Icons Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl glass-card text-center flex flex-col items-center">
              <Smartphone className="w-6 h-6 text-rose-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-200">Smartphones</span>
              <span className="text-[10px] text-slate-400">iOS & Android</span>
            </div>
            <div className="p-3 rounded-2xl glass-card text-center flex flex-col items-center">
              <Tablet className="w-6 h-6 text-amber-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-200">Tablets</span>
              <span className="text-[10px] text-slate-400">iPad & Galaxy Tab</span>
            </div>
            <div className="p-3 rounded-2xl glass-card text-center flex flex-col items-center">
              <Laptop className="w-6 h-6 text-emerald-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-200">Desktops</span>
              <span className="text-[10px] text-slate-400">Mac, PC & Linux</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="relative p-2 bg-white rounded-2xl shadow-xl shrink-0">
              <img
                src={qrCodeUrl}
                alt="Scan to open GiftAI on mobile"
                className="w-36 h-36 rounded-xl object-contain"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/20 uppercase tracking-widest whitespace-nowrap shadow">
                Scan with Camera
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Instant Mobile Experience
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Point your phone camera at this QR code to launch GiftAI instantly. Features touch-friendly 3D gift unboxing, voice dictation, and full offline-ready PWA responsiveness.
              </p>
              {user && (
                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Logged in as <b>{user.name}</b> (Syncs across devices)</span>
                </div>
              )}
            </div>
          </div>

          {/* URL Copy Bar */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Direct Application URL
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-200 font-mono truncate select-all">
                {currentUrl}
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 cursor-pointer shrink-0 border border-white/15"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-rose-400" />
            <span>Share Link</span>
          </button>

          <button
            onClick={() => window.open(currentUrl, '_blank')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/25 transition cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in New Tab</span>
          </button>
        </div>
      </div>
    </div>
  );
};
