import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { VoiceInputButton } from './VoiceInputButton';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  ShoppingBag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

export const AIChatAssistant: React.FC = () => {
  const { currency, setActiveTab } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your AI Gifting Concierge. Tell me who you want to gift, what they love, or what your budget is, and I will find thoughtful ideas in real time!',
      timestamp: new Date(),
      suggestions: [
        'Best gift for coffee enthusiast under ₹3,000',
        'Unique anniversary surprise for my spouse',
        'Housewarming gift that feels luxurious'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Close Key: Escape listener for chat window
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await api.chat(query, historyPayload);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.reply,
        timestamp: new Date(),
        suggestions: res.suggestions
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'I recommend exploring our interactive questionnaire for an in-depth 10-gift ranking with 3D models and pricing filters!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-xl shadow-rose-500/30 transition-all duration-300 hover:scale-105"
        >
          <span className="p-1 rounded-full bg-white/20">
            <Sparkles className="w-4 h-4 animate-spin" />
          </span>
          <span className="text-xs font-extrabold tracking-wide">AI Gift Concierge</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] glass-panel rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-rose-500/80 via-pink-600/80 to-amber-500/80 backdrop-blur-md text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold font-['Outfit']">AI Gifting Concierge</h3>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Powered by Gemini
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer group active:scale-95"
              title="Close Chat (Press Esc key)"
            >
              <kbd className="px-1 py-0.2 text-[9px] font-mono font-bold bg-white/20 text-white rounded border border-white/30">
                Esc
              </kbd>
              <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg glass-chip text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-rose-500 text-white rounded-tr-xs font-medium shadow-md'
                      : 'glass-card text-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Dynamic Suggestions */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                        Suggested Inquiries:
                      </span>
                      {m.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(s)}
                          className="w-full text-left p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-rose-300 font-semibold transition flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">{s}</span>
                          <ChevronRight className="w-3 h-3 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-300 text-xs pl-2">
                <div className="w-5 h-5 rounded-lg glass-chip flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-rose-300 animate-spin" />
                </div>
                <span className="animate-pulse">Styling personalized gift ideas...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-2 mb-2">
              <VoiceInputButton
                onTranscript={text => {
                  setInput(text);
                }}
                className="py-1 px-2.5 text-[11px]"
              />
              <button
                onClick={() => {
                  setActiveTab('questionnaire');
                  setIsOpen(false);
                }}
                className="text-[11px] font-bold text-rose-300 hover:text-rose-200 hover:underline ml-auto cursor-pointer"
              >
                Launch 4-Step Questionnaire →
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about gifts, hobbies, or budgets..."
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition disabled:opacity-40 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
