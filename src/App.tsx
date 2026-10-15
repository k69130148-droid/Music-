import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plus,
  FolderPlus,
  Search,
  Star,
  Pin,
  Trash2,
  Folder,
  Sun,
  Moon,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  RotateCcw,
  X,
  StickyNote,
  ArrowRight,
  Menu,
} from 'lucide-react';

import { Note, NoteFolder, CategoryFilter } from './types/note';
import { useNotes } from './hooks/useNotes';
import { NoteEditor } from './components/NoteEditor';

// Six harmonious pastel sticky note color themes
const STICKY_THEMES = [
  {
    bg: 'bg-amber-100 dark:bg-amber-950/70',
    border: 'border-amber-300 dark:border-amber-700/60',
    text: 'text-amber-950 dark:text-amber-100',
    subText: 'text-amber-900/80 dark:text-amber-200/70',
    badge: 'bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    tape: 'bg-amber-300/60 dark:bg-amber-700/40',
    reorderBg: 'bg-amber-200/90 dark:bg-amber-900/90 border-amber-300/80 dark:border-amber-700',
    reorderText: 'text-amber-900 hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-100',
  },
  {
    bg: 'bg-emerald-100 dark:bg-emerald-950/70',
    border: 'border-emerald-300 dark:border-emerald-700/60',
    text: 'text-emerald-950 dark:text-emerald-100',
    subText: 'text-emerald-900/80 dark:text-emerald-200/70',
    badge: 'bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    tape: 'bg-emerald-300/60 dark:bg-emerald-700/40',
    reorderBg: 'bg-emerald-200/90 dark:bg-emerald-900/90 border-emerald-300/80 dark:border-emerald-700',
    reorderText: 'text-emerald-900 hover:text-emerald-600 dark:text-emerald-200 dark:hover:text-emerald-100',
  },
  {
    bg: 'bg-sky-100 dark:bg-sky-950/70',
    border: 'border-sky-300 dark:border-sky-700/60',
    text: 'text-sky-950 dark:text-sky-100',
    subText: 'text-sky-900/80 dark:text-sky-200/70',
    badge: 'bg-sky-200/80 dark:bg-sky-900/80 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
    tape: 'bg-sky-300/60 dark:bg-sky-700/40',
    reorderBg: 'bg-sky-200/90 dark:bg-sky-900/90 border-sky-300/80 dark:border-sky-700',
    reorderText: 'text-sky-900 hover:text-sky-600 dark:text-sky-200 dark:hover:text-sky-100',
  },
  {
    bg: 'bg-rose-100 dark:bg-rose-950/70',
    border: 'border-rose-300 dark:border-rose-700/60',
    text: 'text-rose-950 dark:text-rose-100',
    subText: 'text-rose-900/80 dark:text-rose-200/70',
    badge: 'bg-rose-200/80 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
    tape: 'bg-rose-300/60 dark:bg-rose-700/40',
    reorderBg: 'bg-rose-200/90 dark:bg-rose-900/90 border-rose-300/80 dark:border-rose-700',
    reorderText: 'text-rose-900 hover:text-rose-600 dark:text-rose-200 dark:hover:text-rose-100',
  },
  {
    bg: 'bg-purple-100 dark:bg-purple-950/70',
    border: 'border-purple-300 dark:border-purple-700/60',
    text: 'text-purple-950 dark:text-purple-100',
    subText: 'text-purple-900/80 dark:text-purple-200/70',
    badge: 'bg-purple-200/80 dark:bg-purple-900/80 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    tape: 'bg-purple-300/60 dark:bg-purple-700/40',
    reorderBg: 'bg-purple-200/90 dark:bg-purple-900/90 border-purple-300/80 dark:border-purple-700',
    reorderText: 'text-purple-900 hover:text-purple-600 dark:text-purple-200 dark:hover:text-purple-100',
  },
  {
    bg: 'bg-orange-100 dark:bg-orange-950/70',
    border: 'border-orange-300 dark:border-orange-700/60',
    text: 'text-orange-950 dark:text-orange-100',
    subText: 'text-orange-900/80 dark:text-orange-200/70',
    badge: 'bg-orange-200/80 dark:bg-orange-900/80 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700',
    tape: 'bg-orange-300/60 dark:bg-orange-700/40',
    reorderBg: 'bg-orange-200/90 dark:bg-orange-900/90 border-orange-300/80 dark:border-orange-700',
    reorderText: 'text-orange-900 hover:text-orange-600 dark:text-orange-200 dark:hover:text-orange-100',
  },
];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nahwa_aldarb_theme_v1');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('nahwa_aldarb_theme_v1', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Notes Hook
  const {
    notes,
    folders,
    activeFolderId,
    setActiveFolderId,
    createFolder,
    filteredNotes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNewNote,
    updateNote,
    moveNoteInActiveView,
    moveNoteToTopInView,
    moveToTrash,
    restoreFromTrash,
    deletePermanently,
    emptyTrash,
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    availableSubjects,
    activeCategory,
    setActiveCategory,
    autoSaveStatus,
    toggleFavorite,
    togglePin,
  } = useNotes();

  // Dropdown Menu for Sticky Note Actions & Reordering (ثلاث شرطات)
  const [menuOpenNoteId, setMenuOpenNoteId] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      setMenuOpenNoteId(null);
    };
    if (menuOpenNoteId) {
      window.addEventListener('click', handleGlobalClick);
      return () => window.removeEventListener('click', handleGlobalClick);
    }
  }, [menuOpenNoteId]);

  // New Folder Modal
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderIcon, setNewFolderIcon] = useState('📁');
  const [newFolderColor, setNewFolderColor] = useState('#f59e0b');

  // Filter notes for the active view / folder
  const displayNotes = useMemo(() => {
    if (activeCategory === 'trash') {
      return notes.filter((n) => n.inTrash);
    }
    return filteredNotes.filter((n) => {
      if (activeFolderId === 'all') return true;
      return n.folderId === activeFolderId;
    });
  }, [filteredNotes, notes, activeCategory, activeFolderId]);

  // Reorder Note Handlers
  const handleMoveUp = useCallback(
    (index: number) => {
      if (index <= 0) return;
      moveNoteInActiveView(index, index - 1, displayNotes);
    },
    [displayNotes, moveNoteInActiveView]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index >= displayNotes.length - 1) return;
      moveNoteInActiveView(index, index + 1, displayNotes);
    },
    [displayNotes, moveNoteInActiveView]
  );

  const handleMoveToTop = useCallback(
    (index: number) => {
      if (index <= 0) return;
      moveNoteToTopInView(index, displayNotes);
    },
    [displayNotes, moveNoteToTopInView]
  );

  // Folder Creation Handler
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const folder = createFolder(newFolderName.trim(), newFolderIcon, newFolderColor);
    setNewFolderName('');
    setIsNewFolderModalOpen(false);
    setActiveFolderId(folder.id);
  };

  // If user is currently editing or viewing a specific note, show full NoteEditor
  if (activeNote) {
    return (
      <div className="fixed inset-0 h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans" dir="rtl">
        <NoteEditor
          note={activeNote}
          onUpdateNote={updateNote}
          onDeleteNote={moveToTrash}
          onBack={() => setActiveNoteId(null)}
          theme={theme}
          onToggleTheme={toggleTheme}
          autoSaveStatus={autoSaveStatus}
          folders={folders}
        />
      </div>
    );
  }

  // Otherwise, render the Clean Home Screen with Sticky Notes (الملصقات)
  return (
    <div
      className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none flex flex-col transition-colors selection:bg-emerald-500 selection:text-white"
      dir="rtl"
    >
      {/* Clean Green Top Header: فقط درب وتحتها مساحتك الهادئة للتفكير والكتابة باللون الأخضر */}
      <header className="sticky top-0 z-30 bg-emerald-50/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-200/80 dark:border-emerald-950 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Brand: فقط درب وتحتها مساحتك الهادئة للتفكير والكتابة */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-sans leading-none">
              درب
            </h1>
            <p className="text-xs sm:text-sm text-emerald-800/80 dark:text-emerald-300/80 font-medium mt-1">
              مساحتك الهادئة للتفكير والكتابة
            </p>
          </div>

          {/* Clean Top Action: فقط زر التبديل بين الوضع الداكن والفاتح */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-100/60 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-slate-700 transition active:scale-90 cursor-pointer shadow-xs"
              title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Home Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Search & Navigation Bar */}
        <div className="space-y-3.5">
          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الملاحظات، الأفكار، أو الكلمات..."
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                &times;
              </button>
            )}
          </div>

          {/* Folders Bar */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setActiveFolderId('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeFolderId === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <span>🌐 الكل</span>
                <span className="text-[10px] opacity-75">
                  ({notes.filter((n) => !n.inTrash).length})
                </span>
              </button>

              {folders.map((f) => {
                const count = notes.filter((n) => !n.inTrash && n.folderId === f.id).length;
                const isSelected = activeFolderId === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFolderId(f.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <span>{f.icon || '📁'}</span>
                    <span>{f.name}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsNewFolderModalOpen(true)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 transition whitespace-nowrap cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>مجلد جديد</span>
            </button>
          </div>

          {/* Category Tabs: الكل / المفضلة / المثبتة / المهملات */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto pb-0.5 scrollbar-none">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                جميع الملاحظات ({notes.filter((n) => !n.inTrash).length})
              </button>
              <button
                onClick={() => setActiveCategory('favorites')}
                className={`px-3 py-1 rounded-lg whitespace-nowrap flex items-center gap-1 transition cursor-pointer ${
                  activeCategory === 'favorites'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                المفضلة ({notes.filter((n) => !n.inTrash && n.favorite).length})
              </button>
              <button
                onClick={() => setActiveCategory('pinned')}
                className={`px-3 py-1 rounded-lg whitespace-nowrap flex items-center gap-1 transition cursor-pointer ${
                  activeCategory === 'pinned'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                <Pin className="w-3.5 h-3.5 fill-current" />
                المثبتة ({notes.filter((n) => !n.inTrash && n.pinned).length})
              </button>
              <button
                onClick={() => setActiveCategory('trash')}
                className={`px-3 py-1 rounded-lg whitespace-nowrap flex items-center gap-1 transition cursor-pointer ${
                  activeCategory === 'trash'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                المهملات ({notes.filter((n) => n.inTrash).length})
              </button>
            </div>

            {/* Trash Clear Button */}
            {activeCategory === 'trash' && (
              <button
                onClick={emptyTrash}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer"
              >
                تفريغ المهملات
              </button>
            )}
          </div>
        </div>

        {/* Action Bar at Notes: زر إضافة ملاحظة جديدة فقط */}
        <div className="flex items-center justify-start pt-1">
          <button
            onClick={() => createNewNote(selectedSubject !== 'all' ? selectedSubject : undefined)}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة ملاحظة جديدة</span>
          </button>
        </div>

        {/* Sticky Notes Grid (الملاحظات على شكل ملصقات) */}
        {displayNotes.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <StickyNote className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">
              لا توجد ملاحظات هنا بعد!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              اضغط على زر (إضافة ملاحظة جديدة) لتبدأ بتدوين فكرتك أو خاطرتك في مساحتك الهادئة 🌿
            </p>
            <button
              onClick={() => createNewNote(selectedSubject !== 'all' ? selectedSubject : undefined)}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة ملاحظة جديدة</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 pb-16">
            {displayNotes.map((note, index) => {
              // Assign a consistent pastel theme based on note index or id
              const themeIndex = Math.abs(
                note.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
              ) % STICKY_THEMES.length;
              const cardTheme = STICKY_THEMES[themeIndex];
              const totalTasks = note.checklists?.length || 0;
              const doneTasks = (note.checklists || []).filter((c) => c.completed).length;

              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`group relative p-4 rounded-2xl border ${cardTheme.bg} ${cardTheme.border} shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[190px] rotate-[-0.5deg] hover:rotate-0 hover:scale-[1.02]`}
                >
                  {/* Adhesive Scotch Tape Effect on Top */}
                  <div
                    className={`w-14 h-3.5 mx-auto -mt-5 mb-2 rounded-xs ${cardTheme.tape} backdrop-blur-xs border border-white/30 shadow-xs pointer-events-none rotate-[1deg]`}
                  />

                  {/* Top Header of Sticky Note */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cardTheme.badge}`}
                      >
                        {note.subject || 'عام'}
                      </span>

                      {/* Three Lines Menu Button & Signs Popup (ثلاث شرطات مع الإشارات فقط بدون كتابة) */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setMenuOpenNoteId(menuOpenNoteId === note.id ? null : note.id)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
                        >
                          <Menu className="w-4 h-4 stroke-[2.5]" />
                        </button>

                        {/* Signs Menu Popup: فقط الإشارات بدون أي كتابة */}
                        {menuOpenNoteId === note.id && (
                          <div
                            className="absolute left-0 top-8 z-50 flex items-center gap-1 bg-white dark:bg-slate-900 border border-emerald-300/80 dark:border-emerald-800 rounded-xl shadow-xl p-1 animate-in fade-in zoom-in-95 duration-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Move to Top Icon (سهم مزدوج لأعلى) */}
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => {
                                handleMoveToTop(index);
                                setMenuOpenNoteId(null);
                              }}
                              className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 hover:text-emerald-600 dark:hover:text-emerald-200 disabled:opacity-25 disabled:pointer-events-none transition cursor-pointer"
                            >
                              <ChevronsUp className="w-4 h-4 stroke-[2.5]" />
                            </button>

                            {/* Move Up Icon (سهم لأعلى) */}
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => {
                                handleMoveUp(index);
                                setMenuOpenNoteId(null);
                              }}
                              className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 hover:text-emerald-600 dark:hover:text-emerald-200 disabled:opacity-25 disabled:pointer-events-none transition cursor-pointer"
                            >
                              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                            </button>

                            {/* Move Down Icon (سهم لأسفل) */}
                            <button
                              type="button"
                              disabled={index === displayNotes.length - 1}
                              onClick={() => {
                                handleMoveDown(index);
                                setMenuOpenNoteId(null);
                              }}
                              className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 hover:text-emerald-600 dark:hover:text-emerald-200 disabled:opacity-25 disabled:pointer-events-none transition cursor-pointer"
                            >
                              <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Note Title */}
                    <h3
                      style={{ fontFamily: note.fontFamily || 'Cairo' }}
                      className={`font-black text-sm line-clamp-2 mb-1.5 leading-snug ${cardTheme.text}`}
                    >
                      {note.title || 'ملصقة بدون عنوان 📝'}
                    </h3>

                    {/* Note Body Text Preview */}
                    <p
                      className={`text-xs line-clamp-4 leading-relaxed font-sans ${cardTheme.subText}`}
                    >
                      {(note.content || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() ||
                        'اضغط هنا لبدء الكتابة في هذه الملصقة...'}
                    </p>
                  </div>

                  {/* Bottom Footer of Sticky Note */}
                  <div className="pt-2 mt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[10px]">
                    <span className={`font-semibold opacity-75 ${cardTheme.subText}`}>
                      {new Date(note.updatedAt).toLocaleDateString('ar-SA', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>

                    {totalTasks > 0 && (
                      <span className="font-bold flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        {doneTasks}/{totalTasks}
                      </span>
                    )}

                    {/* Trash Actions if in trash */}
                    {note.inTrash ? (
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => restoreFromTrash(note.id)}
                          className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5"
                          title="استعادة"
                        >
                          <RotateCcw className="w-3 h-3" /> استعادة
                        </button>
                        <button
                          onClick={() => deletePermanently(note.id)}
                          className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
                          title="حذف نهائي"
                        >
                          حذف
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveToTrash(note.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:text-rose-700 transition"
                        title="حذف للمهملات"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* New Folder Modal */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateFolder}
            className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-500" />
                إنشاء مجلد جديد
              </h3>
              <button
                type="button"
                onClick={() => setIsNewFolderModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                اسم المجلد
              </label>
              <input
                type="text"
                required
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="مثال: بحوث الجامعة، أفكار مشاريع..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Folder Icon / Emoji Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                أيقونة المجلد
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {['📁', '💼', '📚', '🎯', '✨', '💡', '🌿', '🚀', '🎨', '📝'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewFolderIcon(emoji)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition cursor-pointer ${
                      newFolderIcon === emoji
                        ? 'bg-amber-500/20 border-2 border-amber-500 scale-105'
                        : 'bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                إنشاء المجلد
              </button>
              <button
                type="button"
                onClick={() => setIsNewFolderModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
