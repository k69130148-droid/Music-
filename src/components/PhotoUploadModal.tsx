import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  X, 
  Folder, 
  Tag, 
  FileText, 
  Sliders, 
  Check, 
  Loader2,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { DriveFolder } from '../types/drive';
import { driveDb } from '../services/driveDb';
import { triggerConfetti } from '../utils/formatters';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: DriveFolder[];
  defaultFolderId?: string | null;
  onUploadSuccess: () => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  folders,
  defaultFolderId,
  onUploadSuccess,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>(defaultFolderId || 'root');
  const [isCompressEnabled, setIsCompressEnabled] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>('');
  const [noteInput, setNoteInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [completed, setCompleted] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultFolderId) {
      setSelectedFolder(defaultFolderId);
    }
  }, [defaultFolderId]);

  // Support paste from clipboard (Ctrl+V) when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        handleProcessFiles(files);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen, selectedFolder, isCompressEnabled, tagInput, noteInput]);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length > 0) {
      handleProcessFiles(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleProcessFiles(files);
    }
  };

  const handleProcessFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await driveDb.savePhoto(file, file.name, {
          folderId: selectedFolder,
          isVault: selectedFolder === 'vault',
          tags,
          note: noteInput.trim(),
          compress: isCompressEnabled,
        });
        setUploadProgress({ current: i + 1, total: files.length });
      }

      setCompleted(true);
      triggerConfetti();
      setTimeout(() => {
        onUploadSuccess();
        onClose();
        setCompleted(false);
        setIsUploading(false);
      }, 1200);
    } catch (err) {
      console.error('Failed to upload photos:', err);
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                رفع صور في درايف أوفلاين
              </h3>
              <p className="text-xs text-slate-500">حفظ محلي فوري وآمن داخل هاتفك 100%</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/30 scale-[1.01]'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {completed ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-12 h-12 animate-bounce" />
                <p className="font-bold text-sm">تم الحفظ في درايف بنجاح!</p>
              </div>
            ) : isUploading ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    جاري التخزين محلياً... ({uploadProgress.current} من {uploadProgress.total})
                  </p>
                  <div className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden mx-auto">
                    <div
                      className="h-full bg-blue-600 transition-all duration-200"
                      style={{
                        width: `${uploadProgress.total ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    اسحب وأفلت الصور هنا، أو <span className="text-blue-600 underline">تصفح جهازك</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    يدعم جميع صيغ الصور (JPG, PNG, WebP, GIF) مع إمكانية لصق الصور مباشرة (Ctrl+V)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-4 pt-1">
            {/* Target Folder */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-blue-600" />
                <span>حفظ في مجلد:</span>
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="root">📁 المجلد الرئيسي (ملفاتي)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.isVault ? '🔒' : '📁'} {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Smart Compression Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                  <span>ضغط ذكي لتوفير مساحة التخزين</span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  تقليص حجم الصور الكبيرة مع الحفاظ على وضوحها لتخزين آلاف الصور
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCompressEnabled(!isCompressEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isCompressEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    isCompressEnabled ? 'left-1' : 'right-1'
                  }`}
                />
              </button>
            </div>

            {/* Tags & Note (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>وسوم (مفصولة بفواصل):</span>
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="مثال: سفر, عائلة, ذكريات"
                  className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span>ملاحظة مرفقة:</span>
                </label>
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="وصف مختصر للصور..."
                  className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>جاهز للرفع أوفلاين</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>اختر الصور للرفع</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
