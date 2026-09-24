import React, { useState, useMemo } from 'react';
import { EMOJI_CATEGORIES } from '../data/emojiData';
import { X, Search, Sparkles } from 'lucide-react';

interface EmojiPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
}

export const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectEmoji,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastInserted, setLastInserted] = useState<string | null>(null);

  // Filter emojis
  const displayedEmojis = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const allList = EMOJI_CATEGORIES.flatMap((c) =>
      selectedCatId === 'all' || c.id === selectedCatId ? c.emojis : []
    );

    if (!q) return allList;

    return allList.filter(
      (e) =>
        e.char.includes(q) ||
        e.nameAr.toLowerCase().includes(q) ||
        e.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [selectedCatId, searchQuery]);

  const handlePick = (char: string) => {
    onSelectEmoji(char);
    setLastInserted(char);
    setTimeout(() => setLastInserted(null), 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 dir-rtl">
      {/* Toast Alert */}
      {lastInserted && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs shadow-2xl flex items-center gap-2 animate-in zoom-in-95">
          <span className="text-base">{lastInserted}</span>
          <span>تمت الإضافة بنجاح إلى الملاحظة!</span>
        </div>
      )}

      <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center text-xl shadow-md shadow-amber-500/20">
              ☕
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>ملصقات الإيموجي</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  قهوة • جيم • رياضة • روتين
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                اضغط على أي إيموجي لإدراجه فوراً في ملاحظتك
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Tabs */}
        <div className="p-3.5 border-b border-slate-800 space-y-2.5 bg-slate-900/60">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن إيموجي (قهوة، جيم، كرة، ماء، كتاب...)"
              className="w-full pr-9 pl-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            <button
              onClick={() => setSelectedCatId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                selectedCatId === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>الكل</span>
            </button>
            {EMOJI_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                  selectedCatId === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameAr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Emojis Grid */}
        <div className="flex-1 overflow-y-auto p-4 select-none">
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-2.5">
            {displayedEmojis.map((emoji, idx) => (
              <button
                key={`${emoji.char}_${idx}`}
                type="button"
                onClick={() => handlePick(emoji.char)}
                title={emoji.nameAr}
                className="group relative flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-800/60 hover:bg-amber-500/20 border border-slate-700/60 hover:border-amber-500/60 active:scale-90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-125 filter drop-shadow">
                  {emoji.char}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-amber-300 line-clamp-1 mt-1 font-medium">
                  {emoji.nameAr}
                </span>
              </button>
            ))}
          </div>

          {displayedEmojis.length === 0 && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <p className="text-sm font-bold">لم نجد أي إيموجي يطابق بحثك!</p>
              <p className="text-xs">جرب البحث بكلمة أخرى مثل: قهوة، جيم، ماء، تمرين</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            اضغط على أي إيموجي لإضافته مباشرة في الملاحظة ✍️
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
