import React from 'react';
import { 
  Search, 
  X, 
  Grid3X3, 
  List, 
  Calendar, 
  Sun, 
  Moon, 
  HardDrive, 
  Menu,
  SlidersHorizontal,
  CloudOff,
  FolderPlus,
  UploadCloud,
  KeyRound,
  UserCheck,
  Image as ImageIcon
} from 'lucide-react';
import { DriveViewMode, SortOption, AccountProfile } from '../types/drive';

interface DriveHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: DriveViewMode;
  onViewModeChange: (mode: DriveViewMode) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenUpload: () => void;
  onOpenNewFolder: () => void;
  onToggleSidebarMobile: () => void;
  onOpenAccountSecurity: () => void;
  onOpenAccountRecovery: () => void;
  profile: AccountProfile | null;
  onOpenGoogleSignIn: () => void;
}

export const DriveHeader: React.FC<DriveHeaderProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  theme,
  onToggleTheme,
  onOpenUpload,
  onOpenNewFolder,
  onToggleSidebarMobile,
  onOpenAccountSecurity,
  onOpenAccountRecovery,
  profile,
  onOpenGoogleSignIn,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSidebarMobile}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="القائمة الجانبية"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Photos Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-0.5 shadow-md shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  الصور
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                  <span>جودة أصلية 100%</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                حفظ وإدارة الصور بحسابك بأعلى دقة
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث في الصور، الملاحظات، أو الوسوم..."
              className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions, View Controls & Theme */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick upload trigger on mobile header */}
          <button
            onClick={onOpenUpload}
            className="sm:hidden p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
            title="رفع صور"
          >
            <UploadCloud className="w-4 h-4" />
          </button>

          {/* Sort Selector */}
          <div className="relative hidden lg:flex items-center">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="date-desc">الأحدث أولاً</option>
              <option value="date-asc">الأقدم أولاً</option>
              <option value="name-asc">الاسم (أ - ي)</option>
              <option value="name-desc">الاسم (ي - أ)</option>
              <option value="size-desc">الحجم (الأكبر)</option>
              <option value="size-asc">الحجم (الأصغر)</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="عرض الشبكة (Google Drive Grid)"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="عرض القائمة (List View)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('timeline')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="عرض المخطط الزمني (Google Photos Timeline)"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          {/* Direct Account Recovery Button */}
          <button
            onClick={onOpenAccountRecovery}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="استرداد الحساب وفتح الصور عبر رمز الطوارئ أو رقم الهاتف"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">استرداد الحساب</span>
            <span className="sm:hidden">استرداد</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'الوضع المضيء' : 'الوضع الليلي'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Google Sign In / Account Chip */}
          {profile?.isSignedInWithGoogle ? (
            <button
              onClick={onOpenGoogleSignIn}
              className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition shadow-xs group cursor-pointer"
              title="إدارة حساب Google والصور المحفوظة"
            >
              {/* Google G SVG */}
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1 shadow-xs shrink-0">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              </div>

              {/* Email / Username label */}
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden md:inline truncate max-w-[130px]">
                {profile.email || profile.name}
              </span>

              {/* Avatar circle */}
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center uppercase shadow-xs">
                {(profile.email || profile.name).charAt(0)}
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenGoogleSignIn}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold shadow-xs transition cursor-pointer"
              title="تسجيل الدخول بحساب Google لحفظ صورك"
            >
              <svg viewBox="0 0 48 48" className="w-4 h-4">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>تسجيل الدخول</span>
            </button>
          )}

          {/* Account Security & Phone Recovery Avatar */}
          <button
            onClick={onOpenAccountSecurity}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="إعدادات أمان الحساب ورقم هاتف الاسترداد"
          >
            <KeyRound className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
