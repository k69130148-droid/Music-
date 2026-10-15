import React, { useState } from 'react';
import { FolderPlus, X, Folder, Check } from 'lucide-react';
import { driveDb } from '../services/driveDb';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderCreated: () => void;
}

const GOOGLE_DRIVE_COLORS = [
  '#4285f4', // Google Blue
  '#ea4335', // Google Red
  '#fbbc05', // Google Yellow
  '#34a853', // Google Green
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#64748b', // Slate
];

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onFolderCreated,
}) => {
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(GOOGLE_DRIVE_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setIsCreating(true);
    try {
      await driveDb.createFolder(folderName.trim(), selectedColor);
      setFolderName('');
      onFolderCreated();
      onClose();
    } catch (err) {
      console.error('Failed to create folder:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              إنشاء مجلد جديد
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              اسم المجلد:
            </label>
            <div className="relative flex items-center">
              <Folder
                className="w-4 h-4 absolute right-3 pointer-events-none"
                style={{ color: selectedColor }}
              />
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="مثال: صور الصيف، وثائق العمل، لقطات الشاشة"
                autoFocus
                className="w-full pl-3 pr-9 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              لون المجلد (على غرار Google Drive):
            </label>
            <div className="grid grid-cols-5 gap-2">
              {GOOGLE_DRIVE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                >
                  {selectedColor === color && (
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!folderName.trim() || isCreating}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
            >
              إنشاء المجلد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
