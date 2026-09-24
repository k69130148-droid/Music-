import React, { useState } from 'react';
import { NOTE_BACKGROUNDS, BACKGROUND_CATEGORIES, NoteBackground } from '../data/backgrounds';
import { X, Check, Search } from 'lucide-react';

interface BackgroundSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBackgroundId: string;
  onSelectBackground: (backgroundId: string) => void;
  noteTitle?: string;
}

export const BackgroundSelectorModal: React.FC<BackgroundSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedBackgroundId,
  onSelectBackground,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredBackgrounds = NOTE_BACKGROUNDS.filter((bg) => {
    if (activeCategory !== 'all' && bg.category !== activeCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        bg.nameAr.toLowerCase().includes(q) ||
        bg.description.toLowerCase().includes(q) ||
        bg.categoryAr.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-150 dir-rtl">
      <div className="w-full sm:max-w-2xl max-h-[88vh] bg-slate-900 border border-slate-700 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎨</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">اختر خلفية الملاحظة (+٨٥ خلفية)</h2>
              <p className="text-xs text-slate-400">
                جداول وشبكات، نصوص مسطرة، دفاتر كلاسيكية، ألوان راقية، ومواد علمية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 space-y-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن خلفية (غروب، لافندر، قهوة، دفتر مسطر، رياضيات...)"
              className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {BACKGROUND_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  activeCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.nameAr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Backgrounds Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredBackgrounds.map((bg) => {
            const isSelected = selectedBackgroundId === bg.id;

            return (
              <button
                key={bg.id}
                onClick={() => {
                  onSelectBackground(bg.id);
                  onClose();
                }}
                style={bg.inlineStyle}
                className={`relative group flex flex-col justify-between p-3.5 rounded-2xl border transition-all text-right overflow-hidden min-h-[105px] shadow-md ${
                  isSelected
                    ? 'ring-4 ring-emerald-500 border-emerald-300 scale-[1.02]'
                    : 'hover:scale-[1.02] border-slate-700/80 hover:border-slate-500'
                }`}
              >
                {/* Selected Checkmark Badge (أخضر زمردي) */}
                {isSelected && (
                  <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                {/* Top Row: Emoji & Category */}
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="text-xl">{bg.emoji}</span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold backdrop-blur-sm ${
                      bg.textColor === 'light'
                        ? 'bg-black/40 text-slate-100 border border-white/10'
                        : 'bg-white/70 text-slate-900 border border-black/10'
                    }`}
                  >
                    {bg.categoryAr}
                  </span>
                </div>

                {/* Title & Desc */}
                <div className="mt-2 mb-1">
                  <h4
                    className={`font-black text-xs sm:text-sm line-clamp-1 ${
                      bg.textColor === 'light' ? 'text-white' : 'text-slate-950 font-extrabold'
                    }`}
                  >
                    {bg.nameAr}
                  </h4>
                  <p
                    className={`text-[10px] line-clamp-1 mt-0.5 font-medium ${
                      bg.textColor === 'light' ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {bg.description}
                  </p>
                </div>

                {/* Selection indicator */}
                <div
                  className={`text-[10px] font-bold text-left ${
                    bg.textColor === 'light' ? 'text-emerald-300' : 'text-emerald-800'
                  }`}
                >
                  {isSelected ? '✓ تم الاختيار' : 'اضغط للتطبيق'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>متوفر {NOTE_BACKGROUNDS.length} خلفية منتقاة</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
