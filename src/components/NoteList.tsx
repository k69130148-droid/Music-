import React from 'react';
import { Note, CategoryFilter } from '../types/note';
import { getBackgroundById } from '../data/backgrounds';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Plus,
  Search,
  Star,
  Pin,
  BookOpen,
  Trash2,
  Moon,
  Sun,
  BookMarked,
  Filter,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Tag,
  GraduationCap,
} from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: (subject?: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  availableSubjects: string[];
  activeCategory: CategoryFilter;
  onCategoryChange: (cat: CategoryFilter) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onRestoreFromTrash: (id: string) => void;
  onDeletePermanently: (id: string) => void;
  onEmptyTrash: () => void;
  isOnline: boolean;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  availableSubjects,
  activeCategory,
  onCategoryChange,
  theme,
  onToggleTheme,
  onRestoreFromTrash,
  onDeletePermanently,
  onEmptyTrash,
  isOnline,
}) => {
  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 dir-rtl select-none">
      {/* App Branding & Theme Header */}
      <div className="p-3.5 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-amber-500/20">
            <BookMarked className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                نحو الدرب
              </h1>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                الملاحظات
              </span>
            </div>
            <p className="text-[11px] text-slate-400">تدوين سريع وبلا إنترنت مع +٥٠ خلفية</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <PWAInstallButton />

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-90"
            title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon className="w-5 h-5 text-sky-400 fill-sky-400/20" />
            )}
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800/80 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالنص، العنوان، المادة أو الوسم..."
            className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              &times;
            </button>
          )}
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            الكل ({notes.filter((n) => !n.inTrash && !n.archived).length})
          </button>
          <button
            onClick={() => onCategoryChange('favorites')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1 transition ${
              activeCategory === 'favorites'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>المفضلة</span>
          </button>
          <button
            onClick={() => onCategoryChange('pinned')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1 transition ${
              activeCategory === 'pinned'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Pin className="w-3.5 h-3.5 fill-current" />
            <span>المثبتة</span>
          </button>
          <button
            onClick={() => onCategoryChange('trash')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1 transition ${
              activeCategory === 'trash'
                ? 'bg-rose-600 text-white font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>المهملات</span>
          </button>
        </div>

        {/* Subject Filter Bar */}
        {availableSubjects.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-[11px]">
            <span className="text-slate-400 font-bold flex items-center gap-0.5 flex-shrink-0">
              <GraduationCap className="w-3 h-3 text-amber-400" />
              المادة:
            </span>
            <button
              onClick={() => onSubjectChange('all')}
              className={`px-2 py-0.5 rounded-lg transition ${
                selectedSubject === 'all'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              جميع المواد
            </button>
            {availableSubjects.map((subj) => (
              <button
                key={subj}
                onClick={() => onSubjectChange(subj)}
                className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition ${
                  selectedSubject === subj
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Trash Empty Banner */}
      {activeCategory === 'trash' && (
        <div className="p-3 bg-rose-950/40 border-b border-rose-900/50 flex items-center justify-between text-xs text-rose-200">
          <span>سلة المهملات</span>
          <button
            onClick={onEmptyTrash}
            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition"
          >
            تفريغ السلة
          </button>
        </div>
      )}

      {/* Notes List Cards Scroll View */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800">
        {notes.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs space-y-2">
            <p className="font-semibold text-slate-400 text-sm">لا يوجد ملاحظات هنا بعد!</p>
            <p>اضغط على زر (+) في الأسفل لإنشاء أول ملاحظة لك.</p>
          </div>
        ) : (
          notes.map((note) => {
            const isActive = activeNoteId === note.id;
            const bgConfig = getBackgroundById(note.backgroundId);
            const totalTasks = note.checklists.length;
            const completedTasks = note.checklists.filter((c) => c.completed).length;

            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  isActive
                    ? 'ring-2 ring-amber-500 border-amber-400 shadow-xl bg-slate-800/95 scale-[1.01]'
                    : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 shadow-sm'
                }`}
              >
                {/* Background theme accent pill */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {note.subject || 'عام'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {bgConfig.nameAr}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {note.pinned && <Pin className="w-3.5 h-3.5 text-amber-400 fill-current" />}
                    {note.favorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-slate-100 line-clamp-1 mb-1">
                  {note.title || 'ملاحظة بدون عنوان'}
                </h3>

                {/* Content snippet */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2 font-sans">
                  {note.content || 'لا يوجد محتوى نصي...'}
                </p>

                {/* Bottom Meta & Trash controls */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-700/40">
                  <span className="font-medium">
                    {new Date(note.updatedAt).toLocaleDateString('ar-SA', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  {totalTasks > 0 && (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {completedTasks}/{totalTasks}
                    </span>
                  )}

                  {/* Trash controls if in trash */}
                  {note.inTrash && (
                    <div className="flex items-center gap-1 z-10" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onRestoreFromTrash(note.id)}
                        className="p-1 text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5"
                        title="استعادة"
                      >
                        <RotateCcw className="w-3 h-3" /> استعادة
                      </button>
                      <button
                        onClick={() => onDeletePermanently(note.id)}
                        className="p-1 text-rose-400 hover:text-rose-300 font-bold"
                        title="حذف نهائي"
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Plus Button for Mobile & Quick Create */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={() => onCreateNote(selectedSubject !== 'all' ? selectedSubject : undefined)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>إنشاء ملاحظة جديدة</span>
        </button>
      </div>
    </div>
  );
};
