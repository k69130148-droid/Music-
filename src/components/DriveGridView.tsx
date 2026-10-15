import React, { useState } from 'react';
import { 
  Star, 
  MoreVertical, 
  Download, 
  FolderInput, 
  Trash2, 
  Eye, 
  Info, 
  Tag, 
  Check, 
  RotateCw,
  Folder
} from 'lucide-react';
import { DrivePhoto, DriveFolder } from '../types/drive';
import { formatBytes, formatDate, downloadBlob } from '../utils/formatters';

interface DriveGridViewProps {
  photos: DrivePhoto[];
  folders: DriveFolder[];
  selectedPhotoIds: string[];
  onToggleSelect: (id: string) => void;
  onOpenPhoto: (photo: DrivePhoto) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
  onMoveToTrash: (id: string) => void;
  onOpenMoveModal: (photo: DrivePhoto) => void;
  isTrashView?: boolean;
  onRestorePhoto?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
}

export const DriveGridView: React.FC<DriveGridViewProps> = ({
  photos,
  folders,
  selectedPhotoIds,
  onToggleSelect,
  onOpenPhoto,
  onToggleFavorite,
  onMoveToTrash,
  onOpenMoveModal,
  isTrashView,
  onRestorePhoto,
  onPermanentDelete,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getFolderName = (folderId: string) => {
    if (folderId === 'root') return 'ملفاتي';
    const f = folders.find((item) => item.id === folderId);
    return f ? f.name : 'مجلد';
  };

  const getFolderColor = (folderId: string) => {
    const f = folders.find((item) => item.id === folderId);
    return f?.color || '#4285f4';
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 p-1">
      {photos.map((photo) => {
        const isSelected = selectedPhotoIds.includes(photo.id);
        const folderName = getFolderName(photo.folderId);
        const folderColor = getFolderColor(photo.folderId);

        return (
          <div
            key={photo.id}
            className={`group relative bg-white dark:bg-slate-800/90 rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col hover:shadow-md ${
              isSelected
                ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md bg-blue-50/20 dark:bg-blue-900/10'
                : 'border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {/* Thumbnail Box */}
            <div
              onClick={() => onOpenPhoto(photo)}
              className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900/60 overflow-hidden cursor-pointer"
            >
              <img
                src={photo.thumbnailUrl}
                alt={photo.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Selection Checkbox */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect(photo.id);
                }}
                className={`absolute top-2 right-2 w-6 h-6 rounded-lg flex items-center justify-center transition-all z-10 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm scale-100 opacity-100'
                    : 'bg-black/40 text-white hover:bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-xs'
                }`}
              >
                <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-75'}`} />
              </button>

              {/* Star Button (Top Left) */}
              {!isTrashView && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(photo.id, photo.isFavorite);
                  }}
                  className={`absolute top-2 left-2 p-1.5 rounded-lg transition-all z-10 cursor-pointer ${
                    photo.isFavorite
                      ? 'bg-amber-400 text-slate-900 shadow-sm opacity-100'
                      : 'bg-black/40 text-white hover:bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-xs'
                  }`}
                  title={photo.isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              )}

              {/* Hover Quick View Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 shadow-lg">
                  <Eye className="w-4 h-4" />
                </span>
              </div>

              {/* Small Download Button directly on the image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadBlob(photo.blob, photo.name);
                }}
                className="absolute bottom-2 left-2 w-7 h-7 rounded-lg bg-black/60 hover:bg-emerald-600 text-white shadow-md backdrop-blur-xs flex items-center justify-center transition-all z-20 cursor-pointer opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                title="تحميل وحفظ الصورة على جهازك"
                aria-label="تحميل الصورة"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Photo Card Footer */}
            <div className="p-2.5 flex flex-col justify-between flex-1">
              {/* Title & Three Dots Menu */}
              <div className="flex items-start justify-between gap-1 relative">
                <p
                  onClick={() => onOpenPhoto(photo)}
                  className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                  title={photo.name}
                >
                  {photo.name}
                </p>

                {/* Dropdown Menu Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === photo.id ? null : photo.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {/* Dropdown popup */}
                  {activeMenuId === photo.id && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setActiveMenuId(null)}
                      />
                      <div className="absolute left-0 top-full mt-1 z-30 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 text-xs animate-fade-in">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            onOpenPhoto(photo);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-right text-slate-700 dark:text-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>عرض وتعديل</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            downloadBlob(photo.blob, photo.name);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-right text-slate-700 dark:text-slate-200"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-500" />
                          <span>تنزيل للجهاز</span>
                        </button>

                        {!isTrashView ? (
                          <>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onOpenMoveModal(photo);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-right text-slate-700 dark:text-slate-200"
                            >
                              <FolderInput className="w-3.5 h-3.5 text-amber-500" />
                              <span>نقل إلى مجلد</span>
                            </button>

                            <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onMoveToTrash(photo.id);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 text-right"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>نقل للمهملات</span>
                            </button>
                          </>
                        ) : (
                          <>
                            {onRestorePhoto && (
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onRestorePhoto(photo.id);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 text-right"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>استعادة الصورة</span>
                              </button>
                            )}

                            {onPermanentDelete && (
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onPermanentDelete(photo.id);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 text-right"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف نهائي</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sub-info: Folder & Size */}
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1 truncate max-w-[70%]">
                  <Folder className="w-2.5 h-2.5 shrink-0" style={{ color: folderColor }} />
                  <span className="truncate">{folderName}</span>
                </span>
                <span>{formatBytes(photo.size)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
