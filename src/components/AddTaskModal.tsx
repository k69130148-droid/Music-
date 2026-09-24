import React, { useState } from 'react';
import { ChecklistItem } from '../types/note';
import { X, CheckSquare, Plus, Trash2, Check } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (text: string) => void;
  checklists: ChecklistItem[];
  onToggleChecklist: (id: string) => void;
  onDeleteChecklist: (id: string) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  checklists,
  onToggleChecklist,
  onDeleteChecklist,
}) => {
  const [taskText, setTaskText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      setTaskText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 dir-rtl">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">إضافة مهام وتذكيرات</h2>
              <p className="text-xs text-slate-400">
                أضف مهامك لتظهر في أسفل الملاحظة للتنظيم
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

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="اكتب المهمة أو التذكير هنا واضغط إضافة..."
              autoFocus
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!taskText.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة</span>
            </button>
          </div>
        </form>

        {/* Existing Tasks List */}
        <div className="flex-1 max-h-64 overflow-y-auto p-4 space-y-2">
          {checklists.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-1">
              <p className="text-xs font-semibold">لا توجد مهام مضافة بعد في هذه الملاحظة</p>
              <p className="text-[11px] text-slate-500">اكتب مهمتك بالأعلى ثم اضغط إضافة</p>
            </div>
          ) : (
            checklists.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs border transition ${
                  item.completed
                    ? 'bg-slate-800/40 border-slate-800 text-slate-400 line-through'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onToggleChecklist(item.id)}
                  className="flex items-center gap-2 flex-1 text-right cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                      item.completed
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : 'border-slate-500 hover:border-emerald-400'
                    }`}
                  >
                    {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-medium">{item.text}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteChecklist(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  title="حذف المهمة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            المهام المكتملة: {checklists.filter((c) => c.completed).length} من {checklists.length}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};
