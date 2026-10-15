import React from 'react';
import { 
  X, 
  CheckSquare, 
  Square, 
  Star, 
  FolderInput, 
  Download, 
  Trash2, 
  RotateCw,
  Archive
} from 'lucide-react';

interface BatchActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelect: () => void;
  onBatchStar: () => void;
  onBatchMove: () => void;
  onBatchDownloadZip: () => void;
  onBatchTrash: () => void;
  isTrashView?: boolean;
  onBatchRestore?: () => void;
  onBatchPermanentDelete?: () => void;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelect,
  onBatchStar,
  onBatchMove,
  onBatchDownloadZip,
  onBatchTrash,
  isTrashView,
  onBatchRestore,
  onBatchPermanentDelete,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 inset-x-4 max-w-2xl mx-auto z-40 bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 animate-fade-in">
      {/* Selected Counter & Clear */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClearSelect}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="إلغاء التحديد"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-slate-200">
          تم تحديد {selectedCount} من {totalCount}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {selectedCount < totalCount ? (
          <button
            onClick={onSelectAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium transition cursor-pointer"
            title="تحديد جميع الصور"
          >
            <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">تحديد الكل</span>
          </button>
        ) : (
          <button
            onClick={onClearSelect}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium transition cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إلغاء الكل</span>
          </button>
        )}

        {!isTrashView ? (
          <>
            <button
              onClick={onBatchStar}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition cursor-pointer"
              title="تمييز بنجمة"
            >
              <Star className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={onBatchMove}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
              title="نقل إلى مجلد"
            >
              <FolderInput className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">نقل</span>
            </button>

            <button
              onClick={onBatchDownloadZip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              title="تنزيل الصور المحددة في ملف ZIP مضغوط"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>تحميل ZIP</span>
            </button>

            <button
              onClick={onBatchTrash}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 transition cursor-pointer"
              title="نقل للمهملات"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            {onBatchRestore && (
              <button
                onClick={onBatchRestore}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>استعادة المحددة</span>
              </button>
            )}
            {onBatchPermanentDelete && (
              <button
                onClick={onBatchPermanentDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف نهائي</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
