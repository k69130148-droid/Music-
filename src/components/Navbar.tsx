import React from 'react';
import { Sparkles, Shuffle, HelpCircle, Heart, Sun, Moon } from 'lucide-react';

interface Props {
  activeView: 'home' | 'favorites' | 'popular' | 'downloads' | 'generator';
  onSelectView: (view: 'home' | 'favorites' | 'popular' | 'downloads' | 'generator') => void;
  onOpenGuide: () => void;
  onSurpriseMe: () => void;
  favoritesCount: number;
  downloadsCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeView,
  onSelectView,
  onOpenGuide,
  onSurpriseMe,
  favoritesCount,
  downloadsCount,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          onClick={() => onSelectView('home')}
          className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/10">
            ر
          </span>
          <span>رَوْنَق لخلفيات الجوال</span>
        </button>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectView('home')}
            className={`transition-colors hover:text-white whitespace-nowrap ${
              activeView === 'home' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            الرئيسية
          </button>

          <button
            onClick={() => onSelectView('popular')}
            className={`transition-colors hover:text-white whitespace-nowrap ${
              activeView === 'popular' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            الأكثر تحميلاً
          </button>

          <button
            onClick={() => onSelectView('favorites')}
            className={`flex items-center gap-1.5 transition-colors hover:text-white whitespace-nowrap ${
              activeView === 'favorites' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <span>المفضلة</span>
            {favoritesCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectView('downloads')}
            className={`flex items-center gap-1.5 transition-colors hover:text-white whitespace-nowrap ${
              activeView === 'downloads' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <span>التنزيلات</span>
            {downloadsCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                {downloadsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectView('generator')}
            className={`transition-colors hover:text-white whitespace-nowrap ${
              activeView === 'generator' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            استوديو التصميم
          </button>

          <button
            onClick={onOpenGuide}
            className="transition-colors hover:text-amber-400 text-slate-400 whitespace-nowrap"
          >
            دليل التعيين
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSurpriseMe}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95 whitespace-nowrap"
            title="خلفية عشوائية مميزة"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>خلفية عشوائية</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/10 active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>كيف أعيّن الخلفية؟</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="تبديل المظهر"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
