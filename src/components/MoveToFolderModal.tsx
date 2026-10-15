import React, { useState } from 'react';
import { FolderInput, X, Folder, Check, FolderRoot } from 'lucide-react';
import { DriveFolder, DrivePhoto } from '../types/drive';
import { driveDb } from '../services/driveDb';

interface MoveToFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: DrivePhoto | null;
  selectedPhotoIds: string[];
  folders: DriveFolder[];
  onMoved: () => void;
}

export const MoveToFolderModal: React.FC<MoveToFolderModalProps> = ({
  isOpen,
  onClose,
  photo,
  selectedPhotoIds,
  folders,
  onMoved,
}) => {
  const [targetFolderId, setTargetFolderId] = useState<string>('root');
  const [isMoving, setIsMoving] = useState<boolean>(false);

  if (!isOpen) return null;

  const count = photo ? 1 : selectedPhotoIds.length;

  const handleMove = async () => {
    setIsMoving(true);
    try {
      if (photo) {
        await driveDb.updatePhoto(photo.id, {
          folderId: targetFolderId,
          isVault: targetFolderId === 'vault',
        });
      } else if (selectedPhotoIds.length > 0) {
        for (const id of selectedPhotoIds) {
          await driveDb.updatePhoto(id, {
            folderId: targetFolderId,
            isVault: targetFolderId === 'vault',
          });
        }
      }
      onMoved();
      onClose();
    } catch (err) {
      console.error('Move failed:', err);
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FolderInput className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              نقل {count === 1 ? 'الصورة' : `${count} صور`} إلى مجلد
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Folder List */}
        <div className="p-4 space-y-1.5 max-h-64 overflow-y-auto">
          {/* Root option */}
          <button
            type="button"
            onClick={() => setTargetFolderId('root')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-xs text-right cursor-pointer ${
              targetFolderId === 'root'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Folder className="w-4 h-4 text-slate-400" />
              <span>المجلد الرئيسي (ملفاتي)</span>
            </div>
            {targetFolderId === 'root' && <Check className="w-4 h-4 text-blue-600" />}
          </button>

          {/* User Folders */}
          {folders.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTargetFolderId(f.id)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-xs text-right cursor-pointer ${
                targetFolderId === f.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Folder className="w-4 h-4 shrink-0" style={{ color: f.color }} fill={targetFolderId === f.id ? f.color : 'none'} />
                <span className="truncate">{f.name}</span>
                {f.isVault && <span className="text-[10px] text-amber-500 font-normal">🔒 مقفل</span>}
              </div>
              {targetFolderId === f.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
            </button>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            إلغاء
          </button>
          <button
            onClick={handleMove}
            disabled={isMoving}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
          >
            تأكيد النقل هنا
          </button>
        </div>
      </div>
    </div>
  );
};
