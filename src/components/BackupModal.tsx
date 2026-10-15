import React, { useState } from 'react';
import { 
  Archive, 
  X, 
  Download, 
  Upload, 
  HardDrive, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  FolderArchive,
  RefreshCw
} from 'lucide-react';
import JSZip from 'jszip';
import { StorageStats, DriveFolder } from '../types/drive';
import { driveDb } from '../services/driveDb';
import { formatBytes, downloadBlob, triggerConfetti } from '../utils/formatters';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageStats: StorageStats;
  folders: DriveFolder[];
  onDataRestored: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  storageStats,
  folders,
  onDataRestored,
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importCount, setImportCount] = useState<number>(0);
  const [restoreSuccess, setRestoreSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExportZip = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const zipBlob = await driveDb.exportAllPhotosZip((percent) => {
        setExportProgress(percent);
      });

      const dateStr = new Date().toISOString().slice(0, 10);
      downloadBlob(zipBlob, `نسخة_درايف_أوفلاين_${dateStr}.zip`);
      triggerConfetti();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setIsImporting(true);
    setImportProgress(0);
    setRestoreSuccess(false);

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);

      // Check for backup_metadata.json
      let metadata: any = null;
      const metaFile = loadedZip.file('backup_metadata.json');
      if (metaFile) {
        const text = await metaFile.async('text');
        try {
          metadata = JSON.parse(text);
        } catch {
          // ignore
        }
      }

      // Restore folders if metadata exists
      const folderMap = new Map<string, string>();
      if (metadata && Array.isArray(metadata.folders)) {
        for (const f of metadata.folders) {
          const created = await driveDb.createFolder(f.name, f.color);
          folderMap.set(f.id, created.id);
        }
      }

      // Iterate through files
      const fileKeys = Object.keys(loadedZip.files).filter(
        (key) => !loadedZip.files[key].dir && key !== 'backup_metadata.json'
      );

      let imported = 0;
      for (let i = 0; i < fileKeys.length; i++) {
        const key = fileKeys[i];
        const zipObj = loadedZip.files[key];
        const blob = await zipObj.async('blob');

        // Extract filename from path
        const filename = key.split('/').pop() || 'photo.jpg';

        await driveDb.savePhoto(blob, filename, {
          folderId: 'root',
          tags: ['مستعادة من نسخة احتياطية'],
        });

        imported++;
        setImportProgress(Math.round(((i + 1) / fileKeys.length) * 100));
      }

      setImportCount(imported);
      setRestoreSuccess(true);
      triggerConfetti();
      onDataRestored();
    } catch (err) {
      console.error('Import failed:', err);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                النسخ الاحتياطي وإدارة التخزين
              </h3>
              <p className="text-[11px] text-slate-500">حفظ ونقل صورك بدون إنترنت</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Storage Overview */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-500" />
                <span>حالة التخزين المحلي</span>
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {formatBytes(storageStats.usedBytes)} مستخدمة
              </span>
            </div>

            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${Math.max(8, storageStats.usagePercent || 8)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <div>• {storageStats.photoCount} صورة محفوظة</div>
              <div>• {folders.length} مجلدات نشطة</div>
              <div>• {storageStats.trashCount} صور بالمهملات</div>
              <div>• أمان محلي 100%</div>
            </div>
          </div>

          {/* Action 1: Export as ZIP */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  تصدير جميع الصور كملف ZIP
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  حفظ نسخة احتياطية من مكتبة صورك مقسمة في مجلداتها، للتحميل على جهاز الكمبيوتر أو الذاكرة الخارجية
                </p>
              </div>
            </div>

            {isExporting ? (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>جاري ضغط الملفات...</span>
                  <span>{exportProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={handleExportZip}
                disabled={storageStats.photoCount === 0}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>تحميل النسخة الاحتياطية (ZIP)</span>
              </button>
            )}
          </div>

          {/* Action 2: Restore from ZIP */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  استعادة صور من ملف ZIP
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  استيراد الصور والمجلدات من نسخة احتياطية سابقة مباشرة بدون إنترنت
                </p>
              </div>
            </div>

            {restoreSuccess ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>تمت استعادة {importCount} صورة بنجاح إلى درايف!</span>
              </div>
            ) : isImporting ? (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>جاري فك الضغط والاستيراد...</span>
                  <span>{importProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <label className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer">
                <FolderArchive className="w-4 h-4 text-emerald-500" />
                <span>اختر ملف ZIP للاستعادة</span>
                <input
                  type="file"
                  accept=".zip,application/zip"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
