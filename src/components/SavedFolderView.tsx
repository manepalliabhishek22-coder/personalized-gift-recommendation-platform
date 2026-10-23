import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Folder, RecommendationRecord } from '../types';
import {
  Heart,
  FolderPlus,
  Folder as FolderIcon,
  Trash2,
  Edit2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Eye,
  Check,
  Calendar
} from 'lucide-react';

export const SavedFolderView: React.FC = () => {
  const { user, formatPrice, setPreviewProduct, addToast, setActiveTab } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([
    { id: '1', name: 'Birthday Favorites', description: 'Gifts saved for friends and family birthdays', giftIds: [] },
    { id: '2', name: 'Luxury & Tech', description: 'High-end gadget ideas', giftIds: [] }
  ]);
  const [savedRecords, setSavedRecords] = useState<RecommendationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>('All Saved');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');

  useEffect(() => {
    loadSavedData();
  }, [user]);

  const loadSavedData = async () => {
    setLoading(true);
    try {
      const [fList, recs] = await Promise.all([
        api.getFolders(),
        api.getRecommendationsHistory()
      ]);
      if (fList && fList.length > 0) {
        setFolders(fList);
      }
      setSavedRecords(recs.filter(r => r.isSaved || r.isFavorite));
    } catch {
      // Fallback local
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      const created = await api.createFolder(newFolderName.trim(), newFolderDesc.trim());
      setFolders(prev => [...prev, created]);
      addToast(`Folder "${created.name}" created!`, 'success');
      setShowNewFolderModal(false);
      setNewFolderName('');
      setNewFolderDesc('');
    } catch {
      const localFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        description: newFolderDesc.trim(),
        giftIds: []
      };
      setFolders(prev => [...prev, localFolder]);
      setShowNewFolderModal(false);
      addToast(`Folder "${localFolder.name}" created!`, 'success');
    }
  };

  const handleDeleteFolder = async (id: string, name: string) => {
    try {
      await api.deleteFolder(id);
    } catch {
      //
    }
    setFolders(prev => prev.filter(f => f.id !== id));
    if (selectedFolder === name) {
      setSelectedFolder('All Saved');
    }
    addToast(`Folder deleted`, 'info');
  };

  // Flatten saved gift ideas
  const allSavedGifts = savedRecords.flatMap(record =>
    (record.recommendations || []).map(gift => ({
      ...gift,
      recipientName: record.recipientName || record.recipient?.name || 'Gift Recipient',
      occasion: record.occasion,
      savedAt: record.createdAt,
      folderName: record.folderName || record.folder || 'Favorites'
    }))
  );

  const filteredGifts =
    selectedFolder === 'All Saved'
      ? allSavedGifts
      : allSavedGifts.filter(g => g.folderName === selectedFolder);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-chip text-xs font-bold text-rose-300 mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>Curated Collections</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Saved Gifts & Custom Folders
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Organize bookmarks by recipient, holiday, or gifting budget.
          </p>
        </div>

        <button
          onClick={() => setShowNewFolderModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-500/20 transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create New Folder</span>
        </button>
      </div>

      {/* Folders Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-white/10">
        <button
          onClick={() => setSelectedFolder('All Saved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            selectedFolder === 'All Saved'
              ? 'bg-white text-slate-950 shadow-md font-extrabold'
              : 'glass-card text-slate-300 hover:bg-white/15'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>All Saved ({allSavedGifts.length})</span>
        </button>

        {folders.map(folder => (
          <div key={folder.id} className="flex items-center gap-1">
            <button
              onClick={() => setSelectedFolder(folder.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedFolder === folder.name
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'glass-card text-slate-300 hover:bg-white/15'
              }`}
            >
              <FolderIcon className="w-3.5 h-3.5" />
              <span>{folder.name}</span>
            </button>
            <button
              onClick={() => handleDeleteFolder(folder.id, folder.name)}
              className="p-2 text-slate-400 hover:text-rose-400 transition cursor-pointer"
              title="Delete folder"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Grid of Saved Gifts */}
      {filteredGifts.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-3xl p-8">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-30 text-rose-400" />
          <h3 className="text-base font-bold text-white">
            No saved gifts in "{selectedFolder}" yet
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto mb-5">
            Use the discovery questionnaire to find gifts and click the heart icon on any recommendation card to save it here.
          </p>
          <button
            onClick={() => setActiveTab('questionnaire')}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold transition shadow-lg cursor-pointer"
          >
            Start Gift Questionnaire
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGifts.map((gift, idx) => (
            <div
              key={idx}
              className="glass-card-hover rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="font-bold text-rose-300 bg-rose-500/20 border border-rose-400/30 px-2 py-0.5 rounded-md">
                    For {gift.recipientName} ({gift.occasion})
                  </span>
                  <span className="font-semibold text-slate-300">{gift.category}</span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-base font-extrabold text-white font-['Outfit']">
                    {gift.gift}
                  </h3>
                  <span className="text-sm font-extrabold text-emerald-400 ml-2">
                    {formatPrice(gift.priceNumeric)}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {gift.reason}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewProduct(gift as any)}
                  className="p-2 rounded-xl text-slate-300 hover:bg-white/15 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Inspect authentic product photography & scale"
                >
                  <Eye className="w-4 h-4 text-rose-400" />
                  <span>Real View</span>
                </button>

                <a
                  href={gift.matchedProduct?.purchaseLink || `https://www.amazon.in/s?k=${encodeURIComponent(gift.gift)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <form
            onSubmit={handleCreateFolder}
            className="glass-panel rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-rose-400" />
              New Collection Folder
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Folder Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mom's 60th Birthday"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Curated jewelry & wellness picks"
                value={newFolderDesc}
                onChange={e => setNewFolderDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition cursor-pointer shadow-md"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
