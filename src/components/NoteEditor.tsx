import React, { useState } from 'react';
import { Note, ArabicFont, NoteTable, BranchNode } from '../types/note';
import { getBackgroundById } from '../data/backgrounds';
import { BackgroundSelectorModal } from './BackgroundSelectorModal';
import { MathSymbolsBar } from './MathSymbolsBar';
import { NoteTableEditor } from './NoteTableEditor';
import { MindMapTree } from './MindMapTree';
import { EmojiPickerModal } from './EmojiPickerModal';
import { AddTaskModal } from './AddTaskModal';
import {
  ArrowRight,
  Palette,
  CheckSquare,
  Calculator,
  Type,
  Trash2,
  Copy,
  Plus,
  X,
  Table as TableIcon,
} from 'lucide-react';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onBack: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  autoSaveStatus: 'saved' | 'saving' | 'offline';
}

const FONTS: { id: ArabicFont; nameAr: string }[] = [
  { id: 'Cairo', nameAr: 'خط القاهرة' },
  { id: 'Tajawal', nameAr: 'خط تجول' },
  { id: 'Readex Pro', nameAr: 'خط ريدكس' },
  { id: 'Amiri', nameAr: 'خط أميري' },
];

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onUpdateNote,
  onDeleteNote,
  onBack,
}) => {
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showMathSymbols, setShowMathSymbols] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);

  const bgConfig = getBackgroundById(note.backgroundId);

  // Insert emoji directly into note
  const handleInsertEmoji = (emoji: string) => {
    onUpdateNote(note.id, {
      content: (note.content ? note.content + ' ' : '') + emoji + ' ',
    });
  };

  // Add new table from top toolbar
  const handleAddTableFromToolbar = () => {
    const newTable: NoteTable = {
      id: `tbl_${Date.now()}`,
      title: 'جدول البيانات',
      headers: ['البيان / العنصر', 'التفاصيل', 'ملاحظات'],
      rows: [
        { id: `row_1`, cells: ['', '', ''] },
        { id: `row_2`, cells: ['', '', ''] },
      ],
    };
    onUpdateNote(note.id, { tables: [...(note.tables || []), newTable] });
  };

  // Insert symbol
  const handleInsertSymbol = (sym: string) => {
    onUpdateNote(note.id, {
      content: (note.content || '') + sym,
    });
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
    const text = `${note.title || 'ملاحظة'}\n\n${note.content || ''}`;
    navigator.clipboard.writeText(text);
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 2000);
  };

  return (
    <div className="h-screen w-screen flex flex-col dir-rtl overflow-hidden bg-slate-950 select-none">
      {/* Top Main Navigation Bar */}
      <div className="px-3 sm:px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 z-20">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs sm:text-sm transition active:scale-95 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          <span>رجوع للملاحظات</span>
        </button>
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

          {/* Emoji Stickers Button */}
          <button
            onClick={() => setIsEmojiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border transition cursor-pointer bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:border-amber-400/50 hover:text-amber-300 shadow-sm"
            title="ملصقات إيموجي (قهوة، جيم، رياضة، عادات)"
          >
            <span className="text-base leading-none">☕</span>
            <span>ملصقات الإيموجي</span>
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

          {/* Font Selector */}
          <div className="relative">
            <button
              onClick={() => setShowFontMenu(!showFontMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-emerald-400" />
              <span>الخط</span>
            </button>

            {showFontMenu && (
              <div className="absolute top-9 right-0 z-30 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onUpdateNote(note.id, { fontFamily: f.id });
                      setShowFontMenu(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      note.fontFamily === f.id
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {f.nameAr}
                  </button>
                ))}
              </div>
            )}
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

          <button
            onClick={() => {
              if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
                onDeleteNote(note.id);
                onBack();
              }
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-rose-400 hover:text-white cursor-pointer"
            title="حذف الملاحظة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Copy Notification Toast */}
      {copyNotification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg animate-in fade-in">
          تم نسخ نص الملاحظة بنجاح!
        </div>
      )}

      {/* Quick Math Symbols Bar */}
      {showMathSymbols && <MathSymbolsBar onInsertSymbol={handleInsertSymbol} />}

      {/* MAIN NOTE WRITING CANVAS WITH SELECTED BACKGROUND */}
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-6 transition-all duration-200 relative select-text ${bgConfig.containerClass}`}
        style={{
          fontFamily: note.fontFamily || 'Cairo',
          ...bgConfig.inlineStyle,
        }}
      >
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Note Title Input */}
          <input
            type="text"
            value={note.title}
            onChange={(e) => onUpdateNote(note.id, { title: e.target.value })}
            placeholder="عنوان الملاحظة..."
            className={`w-full text-xl sm:text-2xl font-black bg-transparent border-none focus:outline-none placeholder:opacity-40 ${
              bgConfig.textColor === 'light'
                ? 'text-white placeholder:text-slate-300'
                : 'text-slate-950 placeholder:text-slate-600'
            }`}
          />

          {/* Note Body Textarea */}
          <textarea
            value={note.content}
            onChange={(e) => onUpdateNote(note.id, { content: e.target.value })}
            placeholder="اكتب ملاحظاتك، أفكارك، خواطرك، أو مهامك اليومية هنا..."
            rows={10}
            className={`w-full bg-transparent border-none focus:outline-none resize-none text-sm sm:text-base leading-relaxed placeholder:opacity-40 ${
              bgConfig.textColor === 'light'
                ? 'text-slate-100 placeholder:text-slate-300'
                : 'text-slate-950 placeholder:text-slate-600'
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

          {/* 2. Tables Section (الجداول) */}
          <NoteTableEditor
            tables={note.tables || []}
            onChangeTables={(updatedTables) =>
              onUpdateNote(note.id, { tables: updatedTables })
            }
            textColor={bgConfig.textColor}
          />

          {/* 3. Mind-Map Sub-branching Section (الشبكة التفرعية) */}
          <MindMapTree
            branchRoots={note.branchRoots || []}
            onChangeBranches={(updatedRoots) =>
              onUpdateNote(note.id, { branchRoots: updatedRoots })
            }
            textColor={bgConfig.textColor}
          />
        </div>
      </div>

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
    </div>
  );
};
