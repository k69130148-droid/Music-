import React, { useState, useRef, useEffect } from 'react';
import { Note, ArabicFont, NoteTable, BranchNode, NoteFolder } from '../types/note';
import { getBackgroundById } from '../data/backgrounds';
import { getRuledPaperConfig } from '../utils/ruledPaper';
import { BackgroundSelectorModal } from './BackgroundSelectorModal';
import { MathSymbolsBar } from './MathSymbolsBar';
import { NoteTableEditor } from './NoteTableEditor';
import { MindMapTree } from './MindMapTree';
import { EmojiPickerModal } from './EmojiPickerModal';
import { AddTaskModal } from './AddTaskModal';
import { ScanBoardModal } from './ScanBoardModal';
import {
  ArrowRight,
  ArrowUp,
  Palette,
  CheckSquare,
  Calculator,
  Type,
  Trash2,
  Copy,
  Plus,
  Minus,
  ChevronDown,
  Check,
  X,
  Table as TableIcon,
  GitFork,
  Upload,
  Sparkles,
  Folder,
} from 'lucide-react';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onBack: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  autoSaveStatus: 'saved' | 'saving' | 'offline';
  folders?: NoteFolder[];
}

export const FONTS: { id: ArabicFont; nameAr: string; desc: string; cssFamily: string }[] = [
  { id: 'Cairo', nameAr: 'خط القاهرة', desc: 'عصري وواضح للملاحظات', cssFamily: "'Cairo', sans-serif" },
  { id: 'Amiri', nameAr: 'خط أميري', desc: 'نسخ أصيل وأكاديمي', cssFamily: "'Amiri', serif" },
  { id: 'Almarai', nameAr: 'خط المراعي', desc: 'مطبوعات وكتب نظيفة', cssFamily: "'Almarai', sans-serif" },
  { id: 'Tajawal', nameAr: 'خط تجوال', desc: 'حديث ومتناسق ومريح', cssFamily: "'Tajawal', sans-serif" },
  { id: 'Readex Pro', nameAr: 'خط ريدكس برو', desc: 'تقني ودقيق هندسياً', cssFamily: "'Readex Pro', sans-serif" },
  { id: 'Aref Ruqaa', nameAr: 'خط الرقعة', desc: 'رقعة فني تراثي', cssFamily: "'Aref Ruqaa', serif" },
  { id: 'IBM Plex Sans Arabic', nameAr: 'خط آي بي إم', desc: 'للبحوث والمسائل العلمية', cssFamily: "'IBM Plex Sans Arabic', sans-serif" },
  { id: 'Marhey', nameAr: 'خط مرحي', desc: 'خط يدوي شبابي مرح', cssFamily: "'Marhey', cursive" },
  { id: 'Scheherazade New', nameAr: 'خط شهرزاد', desc: 'تراثي شرقي كلاسيكي', cssFamily: "'Scheherazade New', serif" },
];

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onUpdateNote,
  onDeleteNote,
  onBack,
  folders,
}) => {
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showMathSymbols, setShowMathSymbols] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [emojiTarget, setEmojiTarget] = useState<'title' | 'content'>('title');
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Local state for title and content to guarantee 100% 60fps instant typing without app re-render lag
  const [localTitle, setLocalTitle] = useState(note.title);
  const [localContent, setLocalContent] = useState(note.content);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ContentEditable DOM ref & selection management
  const contentEditorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [selectionInfo, setSelectionInfo] = useState<{
    isSelected: boolean;
    text: string;
    rect?: DOMRect;
  } | null>(null);
  const [showSelectTip, setShowSelectTip] = useState(false);
  const [selectionFontSize, setSelectionFontSize] = useState<number>(20);
  const [fontSizeInput, setFontSizeInput] = useState<string>('20');

  // Keep local state & DOM editor in sync when switching notes
  useEffect(() => {
    setLocalTitle(note.title);
    setLocalContent(note.content);
    if (contentEditorRef.current) {
      contentEditorRef.current.innerHTML = note.content || '';
    }
    setSelectionInfo(null);
    savedRangeRef.current = null;
  }, [note.id]);

  // Debounced push to storage
  const syncToStorage = (newTitle: string, newContent: string) => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      onUpdateNote(note.id, { title: newTitle, content: newContent });
    }, 250);
  };

  const handleTitleChange = (val: string) => {
    setLocalTitle(val);
    syncToStorage(val, localContent);
  };

  const handleContentEditableInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setLocalContent(html);
    syncToStorage(localTitle, html);
  };

  const flushSync = () => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    const finalHtml = contentEditorRef.current ? contentEditorRef.current.innerHTML : localContent;
    onUpdateNote(note.id, { title: localTitle, content: finalHtml });
  };

  // Inspect selection inside editor
  const handleSelectionCheck = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      if (contentEditorRef.current && contentEditorRef.current.contains(range.commonAncestorContainer)) {
        const text = sel.toString().trim();
        if (text.length > 0) {
          savedRangeRef.current = range.cloneRange();
          const rect = range.getBoundingClientRect();

          // Check if selection is already inside a font-sized span
          let currentSize = 20;
          let node: Node | null = range.commonAncestorContainer;
          if (node.nodeType === Node.TEXT_NODE) {
            node = node.parentElement;
          }
          while (node && node !== contentEditorRef.current) {
            const el = node as HTMLElement;
            if (el.style && el.style.fontSize) {
              const parsed = parseInt(el.style.fontSize, 10);
              if (!isNaN(parsed)) {
                currentSize = parsed;
                break;
              }
            }
            node = node.parentNode;
          }

          setSelectionFontSize(currentSize);
          setFontSizeInput(String(currentSize));
          setSelectionInfo({
            isSelected: true,
            text,
            rect,
          });
          return;
        }
      }
    }
  };

  // Click outside to clear floating selection
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !contentEditorRef.current?.contains(target) &&
        !target.closest('.font-size-controller') &&
        !target.closest('.floating-selection-bar')
      ) {
        setSelectionInfo(null);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  // Apply font size ONLY to the selected text
  const applyFontSizeToSelection = (targetSize: number) => {
    const sel = window.getSelection();
    let range = savedRangeRef.current;

    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const activeRange = sel.getRangeAt(0);
      if (contentEditorRef.current && contentEditorRef.current.contains(activeRange.commonAncestorContainer)) {
        range = activeRange;
      }
    }

    if (!range || range.collapsed) {
      setShowSelectTip(true);
      setTimeout(() => setShowSelectTip(false), 3500);
      return false;
    }

    if (!contentEditorRef.current || !contentEditorRef.current.contains(range.commonAncestorContainer)) {
      setShowSelectTip(true);
      setTimeout(() => setShowSelectTip(false), 3500);
      return false;
    }

    try {
      const clampedSize = Math.max(10, Math.min(54, targetSize));
      setSelectionFontSize(clampedSize);
      setFontSizeInput(String(clampedSize));

      // Extract contents and wrap in custom-sized span
      const extractedContents = range.extractContents();
      const span = document.createElement('span');
      span.style.fontSize = `${clampedSize}px`;
      span.style.lineHeight = '1.6';
      span.style.display = 'inline';
      span.appendChild(extractedContents);

      range.insertNode(span);

      // Re-select the styled span so user can continuously adjust size
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel?.removeAllRanges();
      sel?.addRange(newRange);
      savedRangeRef.current = newRange.cloneRange();

      // Sync updated HTML
      if (contentEditorRef.current) {
        const html = contentEditorRef.current.innerHTML;
        setLocalContent(html);
        syncToStorage(localTitle, html);
      }

      // Update floating toolbar position
      const rect = span.getBoundingClientRect();
      setSelectionInfo({
        isSelected: true,
        text: span.textContent || '',
        rect,
      });

      return true;
    } catch (err) {
      console.error('Error applying font size to selected text:', err);
      return false;
    }
  };

  const handleFontSizeInputBlurOrEnter = () => {
    const parsed = parseInt(fontSizeInput, 10);
    if (!isNaN(parsed) && parsed >= 10 && parsed <= 54) {
      applyFontSizeToSelection(parsed);
    } else {
      setFontSizeInput(String(selectionFontSize));
    }
  };

  const currentBaseFontSize = note.fontSize || 16;
  const activeFontObj = FONTS.find((f) => f.id === note.fontFamily) || FONTS[0];

  // AI Board Scan handler
  const handleApplyScanToNote = (data: {
    title: string;
    content: string;
    subject: string;
    backgroundId: string;
    mode: 'replace' | 'append';
  }) => {
    let finalTitle = data.title;
    if (data.mode === 'append' && localTitle && localTitle.trim()) {
      finalTitle = localTitle;
    }

    let finalContent = data.content;
    if (data.mode === 'append' && localContent && localContent.trim()) {
      finalContent = `${localContent}\n\n━━━━━━━━━━━━━━━━━━━━\n${data.content}`;
    }

    setLocalTitle(finalTitle);
    setLocalContent(finalContent);
    if (contentEditorRef.current) {
      contentEditorRef.current.innerHTML = finalContent;
    }

    // Immediately persist and sync
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    onUpdateNote(note.id, {
      title: finalTitle,
      content: finalContent,
      subject: data.subject || note.subject,
      backgroundId: data.backgroundId || note.backgroundId,
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 120);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bgConfig = getBackgroundById(note.backgroundId);
  const ruledConfig = getRuledPaperConfig(note.backgroundId);
  const isRuled = ruledConfig !== null;

  // Insert emoji directly into note (either title or content based on target)
  const handleInsertEmoji = (emoji: string, target?: 'title' | 'content') => {
    const dest = target || emojiTarget;
    if (dest === 'title') {
      const nextTitle = (localTitle ? localTitle + ' ' : '') + emoji;
      setLocalTitle(nextTitle);
      syncToStorage(nextTitle, localContent);
    } else {
      if (contentEditorRef.current) {
        contentEditorRef.current.focus();
        document.execCommand('insertText', false, emoji + ' ');
        const html = contentEditorRef.current.innerHTML;
        setLocalContent(html);
        syncToStorage(localTitle, html);
      } else {
        const nextContent = (localContent ? localContent + ' ' : '') + emoji + ' ';
        setLocalContent(nextContent);
        syncToStorage(localTitle, nextContent);
      }
    }
  };

  // Add new table from top toolbar at the top
  const handleAddTableFromToolbar = () => {
    const newTable: NoteTable = {
      id: `tbl_${Date.now()}`,
      title: '',
      headers: ['البيان / العنصر', 'التفاصيل', 'ملاحظات'],
      rows: [
        { id: `row_1`, cells: ['', '', ''] },
        { id: `row_2`, cells: ['', '', ''] },
      ],
    };
    onUpdateNote(note.id, { tables: [newTable, ...(note.tables || [])] });
  };

  // Open branch network tool from toolbar
  const handleOpenBranchModal = () => {
    if ((note.branchRoots || []).length === 0) {
      const newRoot: BranchNode = {
        id: `branch_${Date.now()}`,
        text: 'المحور الرئيسي',
        children: [
          {
            id: `branch_${Date.now()}_1`,
            text: 'فرع ١',
            children: [],
          },
          {
            id: `branch_${Date.now()}_2`,
            text: 'فرع ٢',
            children: [],
          },
        ],
      };
      onUpdateNote(note.id, {
        branchRoots: [newRoot],
      });
    }
    setIsBranchModalOpen(true);
  };

  // Insert symbol
  const handleInsertSymbol = (sym: string) => {
    if (contentEditorRef.current) {
      contentEditorRef.current.focus();
      document.execCommand('insertText', false, sym);
      const html = contentEditorRef.current.innerHTML;
      setLocalContent(html);
      syncToStorage(localTitle, html);
    } else {
      const nextContent = (localContent || '') + sym;
      setLocalContent(nextContent);
      syncToStorage(localTitle, nextContent);
    }
  };

  // Add checklist item from AddTaskModal
  const handleAddChecklist = (text: string) => {
    if (!text.trim()) return;
    const newItem = {
      id: `chk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      text: text.trim(),
      completed: false,
    };
    onUpdateNote(note.id, {
      checklists: [...(note.checklists || []), newItem],
    });
  };

  // Toggle checklist item
  const handleToggleChecklist = (itemId: string) => {
    const updated = (note.checklists || []).map((c) =>
      c.id === itemId ? { ...c, completed: !c.completed } : c
    );
    onUpdateNote(note.id, { checklists: updated });
  };

  // Delete checklist item
  const handleDeleteChecklist = (itemId: string) => {
    const updated = (note.checklists || []).filter((c) => c.id !== itemId);
    onUpdateNote(note.id, { checklists: updated });
  };

  // Copy or share note
  const handleCopyNote = () => {
    const text = `${localTitle || 'ملاحظة'}\n\n${localContent || ''}`;
    navigator.clipboard.writeText(text);
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 2000);
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full flex flex-col dir-rtl overflow-hidden bg-slate-950">
      {/* Top Main Navigation Bar */}
      <div className="px-3 sm:px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 z-20">
        {/* Back Button / سهم الرجوع بلون أخضر وبدون كلام */}
        <button
          onClick={() => {
            flushSync();
            onBack();
          }}
          className="p-2 sm:p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 transition active:scale-90 cursor-pointer flex items-center justify-center"
          title="رجوع"
        >
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Current Folder Selector */}
        {folders && folders.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">المجلد:</span>
            <select
              value={note.folderId || 'folder_general'}
              onChange={(e) => onUpdateNote(note.id, { folderId: e.target.value })}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400/40 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none cursor-pointer"
              title="تغيير مجلد الملاحظة"
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-white font-bold">
                  {f.icon || '📁'} {f.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Note Tools Bar (أدوات الملاحظة: الخلفيات + ملصقات الإيموجي + إضافة جدول + إضافة مهمة + رموز + خط) */}
      <div className="px-3 sm:px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none z-10 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Background Picker Button */}
          <button
            onClick={() => setIsBgModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20 active:scale-95 transition cursor-pointer"
          >
            <Palette className="w-4 h-4" />
            <span>الخلفيات (+٨٥)</span>
          </button>

          {/* Title Sticker Tool in Toolbar */}
          <button
            type="button"
            onClick={() => {
              setEmojiTarget('title');
              setIsEmojiModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border transition cursor-pointer bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:border-amber-400/50 shadow-sm"
            title="إضافة ملصق / إيموجي إلى عنوان الملاحظة"
          >
            <span className="text-base leading-none">✨</span>
            <span>ملصق للعنوان</span>
          </button>

          {/* Note Body Emoji Stickers Button */}
          <button
            type="button"
            onClick={() => {
              setEmojiTarget('content');
              setIsEmojiModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border transition cursor-pointer bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:border-emerald-400/50 hover:text-emerald-300 shadow-sm"
            title="ملصقات إيموجي لنص الملاحظة (قهوة، جيم، رياضة، عادات)"
          >
            <span className="text-base leading-none">☕</span>
            <span>ملصقات الملاحظة</span>
          </button>

          {/* Add Table Button in Top Toolbar */}
          <button
            onClick={handleAddTableFromToolbar}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold hover:border-emerald-500/50 hover:text-emerald-400 transition cursor-pointer shadow-sm"
            title="إضافة جدول بيانات للملاحظة"
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>إضافة جدول</span>
          </button>

          {/* Add Task / Checklist Button in Top Toolbar */}
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold hover:border-emerald-500/50 hover:text-emerald-400 transition cursor-pointer shadow-sm"
            title="إضافة مهام وتذكيرات للملاحظة"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>إضافة مهمة</span>
            {(note.checklists || []).length > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {(note.checklists || []).length}
              </span>
            )}
          </button>

          {/* Add / View Sub-Branches Tool in Top Toolbar */}
          <button
            type="button"
            onClick={handleOpenBranchModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold hover:border-emerald-500/50 hover:text-emerald-400 transition cursor-pointer shadow-sm text-xs"
            title="فتح أداة الشبكة التفرعية ومخطط الأفكار"
          >
            <GitFork className="w-3.5 h-3.5 text-emerald-400 rotate-90" />
            <span>شبكة تفرعية</span>
            {(note.branchRoots || []).length > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {(note.branchRoots || []).length}
              </span>
            )}
          </button>

          {/* Math & Study Symbols Toggle */}
          <button
            onClick={() => setShowMathSymbols(!showMathSymbols)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold border transition cursor-pointer ${
              showMathSymbols
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>الرموز</span>
          </button>

          {/* Font Selector Suite (قائمة اختيار نوع الخط) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFontMenu(!showFontMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition cursor-pointer shadow-sm hover:border-emerald-500/40"
              title="تغيير نوع الخط"
            >
              <Type className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs truncate max-w-[85px]">{activeFontObj.nameAr}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showFontMenu && (
              <div className="absolute top-10 right-0 z-40 w-60 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-black text-slate-400 border-b border-slate-800 flex items-center justify-between">
                  <span>نوع الخط ({FONTS.length} خطوط عربية)</span>
                  <span className="text-emerald-400">عربي أصيل</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-0.5 scrollbar-thin">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        onUpdateNote(note.id, { fontFamily: f.id });
                        setShowFontMenu(false);
                      }}
                      style={{ fontFamily: f.cssFamily }}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                        note.fontFamily === f.id
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                          : 'text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm leading-tight">{f.nameAr}</div>
                        <div
                          className={`text-[10px] leading-tight mt-0.5 ${
                            note.fontFamily === f.id ? 'text-slate-900/80 font-semibold' : 'text-slate-400'
                          }`}
                        >
                          {f.desc}
                        </div>
                      </div>
                      {note.fontFamily === f.id && <Check className="w-4 h-4 stroke-[3] flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Font Size Controller (التحكم بحجم النص المحدد فقط) */}
          <div
            className={`font-size-controller flex items-center gap-1 border rounded-xl px-1.5 py-1 shadow-sm transition ${
              selectionInfo?.isSelected
                ? 'bg-emerald-950/40 border-emerald-500/80 shadow-emerald-500/20'
                : 'bg-slate-900/90 border-slate-700'
            }`}
            title={
              selectionInfo?.isSelected
                ? `تغيير حجم النص المحدد: "${selectionInfo.text.slice(0, 20)}..."`
                : 'تغيير حجم النص المحدد (قم بتظليل النص أولاً)'
            }
          >
            <span className="text-[10px] font-black px-1 select-none flex items-center gap-1">
              {selectionInfo?.isSelected ? (
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  حجم المحدد
                </span>
              ) : (
                <span className="text-slate-400">حجم المحدد</span>
              )}
            </span>

            {/* Decrease Button (-) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFontSizeToSelection(selectionFontSize - 2)}
              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-90 cursor-pointer disabled:opacity-40"
              title="تصغير حجم النص المحدد (-)"
            >
              <Minus className="w-3 h-3 stroke-[2.5]" />
            </button>

            {/* Direct Input for Typing Font Size */}
            <div className="relative flex items-center">
              <input
                type="number"
                min={10}
                max={54}
                value={fontSizeInput}
                onChange={(e) => setFontSizeInput(e.target.value)}
                onBlur={handleFontSizeInputBlurOrEnter}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFontSizeInputBlurOrEnter();
                    e.currentTarget.blur();
                  }
                }}
                className="w-8 sm:w-9 text-center font-black text-xs text-emerald-400 bg-transparent border-none focus:outline-none focus:bg-slate-800 rounded py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-text"
                title="اكتب الحجم المطلوب للنص المحدد (مثلاً 24) ثم اضغط Enter"
              />
              <span className="text-[9px] font-bold text-slate-500 pointer-events-none select-none -mr-0.5">
                px
              </span>
            </div>

            {/* Increase Button (+) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFontSizeToSelection(selectionFontSize + 2)}
              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-90 cursor-pointer disabled:opacity-40"
              title="تكبير حجم النص المحدد (+)"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
            </button>

            {/* Quick Presets for 1-Tap Sizing */}
            <div className="hidden md:flex items-center gap-0.5 border-r border-slate-700 pr-1 mr-0.5">
              {[14, 18, 22, 28, 36].map((size) => (
                <button
                  key={size}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFontSizeToSelection(size)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                    selectionFontSize === size && selectionInfo?.isSelected
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={`تطبيق حجم ${size}px على النص المحدد`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleCopyNote}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
            title="نسخ الملاحظة"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Delete Button in note toolbar */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-bold transition active:scale-95 cursor-pointer shadow-sm text-xs"
            title="حذف الملاحظة نهائياً"
          >
            <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>حذف</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 shadow-2xl border bg-slate-900 border-slate-800 text-slate-100 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
              <Trash2 className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-100">
                حذف الملاحظة؟
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                هل أنت متأكد من حذف هذه الملاحظة نهائياً؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذفها فوراً.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  onDeleteNote(note.id);
                  onBack();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition cursor-pointer"
              >
                نعم، احذف الملاحظة
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Notification Toast */}
      {copyNotification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg animate-in fade-in">
          تم نسخ نص الملاحظة بنجاح!
        </div>
      )}

      {/* Quick Math Symbols Bar */}
      {showMathSymbols && <MathSymbolsBar onInsertSymbol={handleInsertSymbol} />}

      {/* Floating Quick Size Bar directly on selected text */}
      {selectionInfo && selectionInfo.isSelected && (
        <div
          style={{
            top: `${Math.max(12, (selectionInfo.rect?.top || 100) - 48)}px`,
            left: `${Math.min(
              typeof window !== 'undefined' ? window.innerWidth - 295 : 200,
              Math.max(12, (selectionInfo.rect?.left || 100) - 20)
            )}px`,
          }}
          className="floating-selection-bar fixed z-50 flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-emerald-500/70 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center gap-1 text-[11px] font-black text-emerald-400 pl-1 border-l border-slate-700 select-none">
            <Type className="w-3.5 h-3.5" />
            <span>حجم المحدد:</span>
          </div>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFontSizeToSelection(selectionFontSize - 2)}
            className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-90 cursor-pointer"
            title="تصغير النص المحدد"
          >
            <Minus className="w-3 h-3 stroke-[2.5]" />
          </button>

          <span className="text-xs font-black text-emerald-300 px-1 min-w-[34px] text-center select-none">
            {selectionFontSize}px
          </span>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFontSizeToSelection(selectionFontSize + 2)}
            className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-90 cursor-pointer"
            title="تكبير النص المحدد"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-1 border-r border-slate-700 pr-1.5 mr-0.5">
            {[14, 18, 24, 32].map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFontSizeToSelection(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-black transition cursor-pointer ${
                  selectionFontSize === s
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setSelectionInfo(null)}
            className="w-5 h-5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center text-xs ml-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Helpful Toast when clicking font size without selecting text */}
      {showSelectTip && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>يرجى تحديد أو تظليل النص الذي ترغب في تغيير حجمه أولاً ✍️</span>
        </div>
      )}

      {/* MAIN NOTE WRITING CANVAS WITH SELECTED BACKGROUND */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto p-4 sm:p-6 relative select-text overscroll-contain scroll-smooth ${bgConfig.containerClass}`}
        style={{
          fontFamily: activeFontObj.cssFamily,
          fontSize: `${currentBaseFontSize}px`,
          ...(isRuled
            ? {
                backgroundColor: ruledConfig.paperBg,
                backgroundImage: 'none',
              }
            : bgConfig.inlineStyle),
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Note Title Input */}
          <div
            className={isRuled ? 'pb-2 border-b-2' : ''}
            style={isRuled ? { borderColor: ruledConfig.marginColor } : undefined}
          >
            <input
              type="text"
              value={localTitle}
              onFocus={() => setEmojiTarget('title')}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={flushSync}
              placeholder={isRuled ? 'الموضوع / عنوان الملاحظة ✍️' : ''}
              style={{
                fontFamily: activeFontObj.cssFamily,
                fontSize: `${Math.round(currentBaseFontSize * 1.35)}px`,
                color: isRuled ? ruledConfig.textColor : undefined,
                paddingRight: isRuled ? '48px' : undefined,
              }}
              className={`w-full font-black bg-transparent border-none focus:outline-none ${
                !isRuled
                  ? bgConfig.textColor === 'light'
                    ? 'text-white'
                    : 'text-slate-950'
                  : ''
              }`}
            />
          </div>

          {/* Tables Section (الجداول تظهر بالأعلى فور إضافتها بدون أدوات حذف مزعجة) */}
          <NoteTableEditor
            tables={note.tables || []}
            onChangeTables={(updatedTables) =>
              onUpdateNote(note.id, { tables: updatedTables })
            }
            textColor={bgConfig.textColor}
          />

          {/* Note Body with Selected-Text Font Size Support & Exact Notebook Ruled Lines */}
          <div
            ref={contentEditorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentEditableInput}
            onMouseUp={handleSelectionCheck}
            onTouchEnd={handleSelectionCheck}
            onKeyUp={handleSelectionCheck}
            onSelect={handleSelectionCheck}
            onFocus={() => setEmojiTarget('content')}
            onBlur={flushSync}
            style={
              isRuled
                ? {
                    fontFamily: activeFontObj.cssFamily,
                    fontSize: '17px',
                    lineHeight: `${ruledConfig.lineHeight}px`,
                    backgroundImage: `linear-gradient(to bottom, transparent ${ruledConfig.baselinePos - 1}px, ${ruledConfig.lineColor} ${ruledConfig.baselinePos - 1}px, ${ruledConfig.lineColor} ${ruledConfig.baselinePos}px, transparent ${ruledConfig.baselinePos}px), linear-gradient(to left, transparent 38px, ${ruledConfig.marginColor} 38px, ${ruledConfig.marginColor} 39.5px, transparent 39.5px)`,
                    backgroundSize: `100% ${ruledConfig.lineHeight}px, 100% 100%`,
                    backgroundRepeat: 'repeat-y, no-repeat',
                    backgroundPosition: '0 0, 0 0',
                    color: ruledConfig.textColor,
                    paddingRight: '48px',
                    paddingLeft: '14px',
                    paddingTop: '0px',
                    paddingBottom: '40px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    minHeight: '65vh',
                  }
                : {
                    fontFamily: activeFontObj.cssFamily,
                    fontSize: `${currentBaseFontSize}px`,
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    minHeight: '45vh',
                  }
            }
            className={`w-full bg-transparent border-none focus:outline-none ${
              isRuled ? 'school-ruled-editor' : 'leading-relaxed'
            } ${
              !isRuled
                ? bgConfig.textColor === 'light'
                  ? 'text-slate-100'
                  : 'text-slate-950'
                : ''
            }`}
          />

          {/* 1. Checklists Section (قائمة المهام - تعرض فقط إذا كانت هناك مهام مضافة) */}
          {(note.checklists || []).length > 0 && (
            <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 opacity-90">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  <span>قائمة المهام والتذكيرات:</span>
                </span>
                <span className="opacity-70 text-[11px]">
                  {(note.checklists || []).filter((c) => c.completed).length} من{' '}
                  {(note.checklists || []).length} مكتمل
                </span>
              </div>

              {/* Checklists items list */}
              <div className="space-y-1.5">
                {(note.checklists || []).map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs backdrop-blur-sm transition ${
                      item.completed ? 'opacity-60 line-through' : ''
                    } ${
                      bgConfig.textColor === 'light'
                        ? 'bg-black/30 text-white'
                        : 'bg-white/80 text-slate-900 border border-slate-200'
                    }`}
                  >
                    <label className="flex items-center gap-2 flex-1 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleChecklist(item.id)}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer rounded"
                      />
                      <span>{item.text}</span>
                    </label>
                    <button
                      onClick={() => handleDeleteChecklist(item.id)}
                      className="p-1 hover:text-rose-500 opacity-60 hover:opacity-100 cursor-pointer"
                      title="حذف المهمة"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dedicated Mind-Map Branching Modal (أداة الشبكة التفرعية من الشريط) */}
      {isBranchModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsBranchModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-5 sm:p-6 shadow-2xl border bg-slate-900 border-slate-800 text-slate-100 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <GitFork className="w-5 h-5 rotate-90" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-100">
                    الشبكة التفرعية ومخطط الأفكار
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    أنشئ فروعاً ومحاور لتنظيم أفكارك وخرائطك الذهنية
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBranchModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-1 sm:p-2 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <MindMapTree
                branchRoots={note.branchRoots || []}
                onChangeBranches={(updatedRoots) =>
                  onUpdateNote(note.id, { branchRoots: updatedRoots })
                }
                textColor="light"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                يتم حفظ التعديلات تلقائياً في الملاحظة
              </span>
              <button
                type="button"
                onClick={() => setIsBranchModalOpen(false)}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition cursor-pointer"
              >
                ✅ تم وحفظ المخطط
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Selector Modal (+70 Backgrounds) */}
      <BackgroundSelectorModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        selectedBackgroundId={note.backgroundId}
        onSelectBackground={(bgId) => onUpdateNote(note.id, { backgroundId: bgId })}
      />

      {/* Emoji Stickers Modal (قهوة، جيم، رياضة، عادات) */}
      <EmojiPickerModal
        isOpen={isEmojiModalOpen}
        onClose={() => setIsEmojiModalOpen(false)}
        onSelectEmoji={handleInsertEmoji}
        activeTarget={emojiTarget}
        onChangeTarget={setEmojiTarget}
      />

      {/* Add Task / Checklist Modal */}
      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddChecklist}
        checklists={note.checklists || []}
        onToggleChecklist={handleToggleChecklist}
        onDeleteChecklist={handleDeleteChecklist}
      />

      {/* Floating Scroll to Top button for note writing canvas */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-30 p-3 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 shadow-2xl transition-all active:scale-90 flex items-center gap-1.5 font-bold text-xs backdrop-blur-md cursor-pointer animate-in fade-in zoom-in-90"
          title="الرجوع لأعلى الملاحظة"
        >
          <ArrowUp className="w-4 h-4 stroke-[3]" />
          <span>للأعلى ⬆️</span>
        </button>
      )}
    </div>
  );
};