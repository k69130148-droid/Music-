import React from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { CATEGORIES_LIST, COLOR_FILTERS } from '../data/wallpapers';
import { WallpaperCategory, WallpaperColor } from '../types/wallpaper';

interface Props {
  selectedCategory: WallpaperCategory;
  onSelectCategory: (cat: WallpaperCategory) => void;
  selectedColor: WallpaperColor;
  onSelectColor: (col: WallpaperColor) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'popular' | 'newest' | 'downloads' | 'favorites';
  onSortChange: (sort: 'popular' | 'newest' | 'downloads' | 'favorites') => void;
  totalCount: number;
}

export const CategoryFilterBar: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  selectedColor,
  onSelectColor,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalCount,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث عن اسم، لون، تصنيف (مثال: أموليد، ذهب، شفق، إسلامية، مطر)..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pr-10 pl-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <span className="text-xs text-slate-400 font-mono">
            {totalCount} خلفية متاحة
          </span>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => onSortChange('popular')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === 'popular'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الأكثر شيوعاً
            </button>
            <button
              onClick={() => onSortChange('downloads')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === 'downloads'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الأعلى تحميلاً
            </button>
            <button
              onClick={() => onSortChange('newest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === 'newest'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الأحدث
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Category Segmented Tab Buttons (Allowed as functional click controls per section 1.A) */}
      <div className="overflow-x-auto pb-1 scrollbar-none flex items-center gap-2">
        {CATEGORIES_LIST.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all border shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat.nameAr}
            </button>
          );
        })}
      </div>

      {/* Color Filter Dots Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap ml-1">
          فلترة حسب اللون:
        </span>
        {COLOR_FILTERS.map((col) => {
          const isSelected = selectedColor === col.id;
          return (
            <button
              key={col.id}
              onClick={() => onSelectColor(col.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border shrink-0 ${
                isSelected
                  ? 'bg-slate-800 border-amber-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {col.id !== 'all' && (
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/20"
                  style={{ backgroundColor: col.hex }}
                />
              )}
              <span>{col.nameAr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
