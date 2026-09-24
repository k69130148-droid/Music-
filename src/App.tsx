import React, { useState, useEffect } from 'react';
import { useNotes } from './hooks/useNotes';
import { NoteEditor } from './components/NoteEditor';
import { getSavedTheme, saveThemeToStorage } from './utils/storage';
import { getBackgroundById } from './data/backgrounds';
import {
  Plus,
  Moon,
  Sun,
  BookMarked,
  Trash2,
  Table as TableIcon,
  GitFork,
  CheckSquare,
  Coffee,
} from 'lucide-react';

export default function App() {
  const {
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNewNote,
    updateNote,
    deletePermanently,
    autoSaveStatus,
    isOnline,
  } = useNotes();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => getSavedTheme());
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Apply dark mode class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveThemeToStorage(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleCreateNewNote = () => {
    const newNote = createNewNote('عام', 'forest_mist');
    setActiveNoteId(newNote.id);
    setIsEditing(true);
  };

  const handleOpenNote = (id: string) => {
    setActiveNoteId(id);
    setIsEditing(true);
  };

  // If user is currently editing a note, show the full-screen Note Editor
  if (isEditing && activeNote) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <NoteEditor
          note={activeNote}
          onUpdateNote={updateNote}
          onDeleteNote={(id) => {
            deletePermanently(id);
            setIsEditing(false);
          }}
          onBack={() => setIsEditing(false)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          autoSaveStatus={autoSaveStatus}
        />
      </div>
    );
  }

  // ULTRA SIMPLE CLEAN HOME SCREEN (درب)
  return (
    <div
      className={`min-h-screen w-full transition-colors duration-200 dir-rtl ${
        theme === 'dark'
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Clean Top Header */}
      <header
        className={`px-4 sm:px-6 py-4 border-b transition-colors ${
          theme === 'dark'
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        } sticky top-0 z-10 backdrop-blur`}
      >
        <div className="max-w-xl mx-auto flex items-center justify-between">
          {/* Logo & App Name: دَرْب بأسلوب احترافي وفاخر */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/20 transition-transform hover:scale-105">
              <BookMarked className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl sm:text-3xl tracking-tight bg-gradient-to-l from-emerald-500 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
                  دَرْب
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 tracking-wider">
                  DARB
                </span>
              </div>
              <p
                className={`text-[11px] font-medium leading-tight ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                مساحتك الهادئة للتدوين والأفكار
              </p>
            </div>
          </div>

          {/* Theme Switcher Button (يعرض الوضع النشط حالياً) */}
          <button
            onClick={handleToggleTheme}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border font-bold text-xs transition active:scale-95 shadow-sm cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800/90 hover:bg-slate-700 text-emerald-400 border-slate-700 hover:border-emerald-500/40'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-amber-400/50 shadow-slate-200'
            }`}
            title="تبديل الوضع"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
                <span className="font-bold">الوضع الداكن</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500 fill-amber-500/30" />
                <span className="font-bold text-slate-800">الوضع الفاتح</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl mx-auto p-4 sm:p-6 space-y-6">
        {/* BIG CLEAN "ADD NOTE" PRIMARY BUTTON */}
        <div className="text-center pt-2">
          <button
            onClick={handleCreateNewNote}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition active:scale-98 group cursor-pointer"
          >
            <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
            <span>أضف ملاحظة جديدة ✍️</span>
          </button>
        </div>

        {/* Notes Section */}
        <div className="space-y-3">
          <div className="text-xs font-bold px-1">
            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
              ملاحظاتك ({notes.length}):
            </span>
          </div>

          {notes.length === 0 ? (
            /* Empty State */
            <div
              className={`py-16 px-4 rounded-3xl border text-center space-y-3 ${
                theme === 'dark'
                  ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                  : 'bg-white border-slate-200 text-slate-500 shadow-sm'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-2xl">
                📝
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                لا توجد أي ملاحظة بعد!
              </h3>
              <p className="text-xs max-w-xs mx-auto">
                اضغط على زر "أضف ملاحظة جديدة" بالأعلى للبدء فوراً في التدوين واختيار خلفيتك
                المفضلة.
              </p>
            </div>
          ) : (
            /* Clean Compact Note Cards List (بدون تسمية اسم الخلفية وبدون إظهار كامل المحتويات) */
            <div className="space-y-2.5">
              {notes.map((note) => {
                const bgConfig = getBackgroundById(note.backgroundId);
                const hasTables = (note.tables || []).length > 0;
                const hasBranches = (note.branchRoots || []).length > 0;
                const hasChecklists = (note.checklists || []).length > 0;
                const hasStickers = (note.stickers || []).length > 0;

                return (
                  <div
                    key={note.id}
                    onClick={() => handleOpenNote(note.id)}
                    style={bgConfig.inlineStyle}
                    className={`relative group p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98 overflow-hidden ${
                      bgConfig.containerClass
                    }`}
                  >
                    {/* Top Row: Date, Mini Feature Badges, and Delete Button (No Background Label as requested!) */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold opacity-80 ${
                            bgConfig.textColor === 'light'
                              ? 'text-slate-200'
                              : 'text-slate-700'
                          }`}
                        >
                          {new Date(note.updatedAt).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>

                        {/* Subtle indicators for extra features if present */}
                        {hasTables && (
                          <span
                            className="p-1 rounded-md bg-black/20 text-emerald-400"
                            title="تحتوي على جداول"
                          >
                            <TableIcon className="w-3 h-3" />
                          </span>
                        )}
                        {hasBranches && (
                          <span
                            className="p-1 rounded-md bg-black/20 text-emerald-400"
                            title="تحتوي على شبكة تفرعية"
                          >
                            <GitFork className="w-3 h-3 rotate-90" />
                          </span>
                        )}
                        {hasChecklists && (
                          <span
                            className="p-1 rounded-md bg-black/20 text-emerald-400"
                            title="تحتوي على قائمة مهام"
                          >
                            <CheckSquare className="w-3 h-3" />
                          </span>
                        )}
                        {hasStickers && (
                          <span
                            className="p-1 rounded-md bg-black/20 text-amber-400"
                            title="تحتوي على ملصقات إنتاجية"
                          >
                            <Coffee className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('هل تريد حذف هذه الملاحظة؟')) {
                            deletePermanently(note.id);
                          }
                        }}
                        className={`p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:text-rose-500 transition cursor-pointer ${
                          bgConfig.textColor === 'light'
                            ? 'text-slate-300'
                            : 'text-slate-600'
                        }`}
                        title="حذف الملاحظة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Note Title (Clear and Prominent) */}
                    <h3
                      className={`font-black text-base sm:text-lg line-clamp-1 ${
                        bgConfig.textColor === 'light'
                          ? 'text-white'
                          : 'text-slate-950 font-extrabold'
                      }`}
                    >
                      {note.title || 'ملاحظة بدون عنوان'}
                    </h3>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
