import React from 'react';
import { 
  Star, 
  Download, 
  Trash2, 
  FolderInput, 
  RotateCw, 
  Folder, 
  Check, 
  Eye 
} from 'lucide-react';
import { DrivePhoto, DriveFolder } from '../types/drive';
import { formatBytes, formatDate, downloadBlob } from '../utils/formatters';

interface DriveListViewProps {
  photos: DrivePhoto[];
  folders: DriveFolder[];
  selectedPhotoIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelect: () => void;
  onOpenPhoto: (photo: DrivePhoto) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
  onMoveToTrash: (id: string) => void;
  onOpenMoveModal: (photo: DrivePhoto) => void;
  isTrashView?: boolean;
  onRestorePhoto?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
}

export const DriveListView: React.FC<DriveListViewProps> = ({
  photos,
  folders,
  selectedPhotoIds,
  onToggleSelect,
  onSelectAll,
  onClearSelect,
  onOpenPhoto,
  onToggleFavorite,
  onMoveToTrash,
  onOpenMoveModal,
  isTrashView,
  onRestorePhoto,
  onPermanentDelete,
}) => {
  const allSelected = photos.length > 0 && selectedPhotoIds.length === photos.length;

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
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          {/* Table Header */}
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-3 px-3 w-10 text-center">
                <button
                  type="button"
                  onClick={allSelected ? onClearSelect : onSelectAll}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                    allSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                  }`}
                >
                  {allSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </th>
              <th className="py-3 px-3">الاسم والملف</th>
              <th className="py-3 px-3">المجلد</th>
              <th className="py-3 px-3">الحجم</th>
              <th className="py-3 px-3">تاريخ الإضافة</th>
              <th className="py-3 px-3 text-center">إجراءات</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-200">
            {photos.map((photo) => {
              const isSelected = selectedPhotoIds.includes(photo.id);
              const folderName = getFolderName(photo.folderId);
              const folderColor = getFolderColor(photo.folderId);

              return (
                <tr
                  key={photo.id}
                  className={`group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-700/40 ${
                    isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleSelect(photo.id)}
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  </td>

                  {/* Thumbnail & Name */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => onOpenPhoto(photo)}
                        className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700"
                      >
                        <img
                          src={photo.thumbnailUrl}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate max-w-xs sm:max-w-md">
                        <p
                          onClick={() => onOpenPhoto(photo)}
                          className="font-bold text-slate-800 dark:text-slate-100 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {photo.name}
                        </p>
                        {photo.tags && photo.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            {photo.tags.slice(0, 2).map((t, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-500"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Folder */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-medium">
                      <Folder className="w-3 h-3" style={{ color: folderColor }} />
                      <span>{folderName}</span>
                    </span>
                  </td>

                  {/* Size */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono">
                    {formatBytes(photo.size)}
                  </td>

                  {/* Date Added */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {formatDate(photo.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {/* Star Button */}
                      {!isTrashView && (
                        <button
                          onClick={() => onToggleFavorite(photo.id, photo.isFavorite)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            photo.isFavorite
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                          }`}
                          title="المفضلة"
                        >
                          <Star className={`w-4 h-4 ${photo.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      )}

                      {/* View Button */}
                      <button
                        onClick={() => onOpenPhoto(photo)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="معاينة"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Download */}
                      <button
                        onClick={() => downloadBlob(photo.blob, photo.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="تنزيل"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {!isTrashView ? (
                        <>
                          <button
                            onClick={() => onOpenMoveModal(photo)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="نقل لمجلد"
                          >
                            <FolderInput className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onMoveToTrash(photo.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="نقل للمهملات"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          {onRestorePhoto && (
                            <button
                              onClick={() => onRestorePhoto(photo.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="استعادة"
                            >
                              <RotateCw className="w-4 h-4" />
                            </button>
                          )}
                          {onPermanentDelete && (
                            <button
                              onClick={() => onPermanentDelete(photo.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="حذف نهائي"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
