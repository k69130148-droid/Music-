import React from 'react';
import { Calendar, Check, Star, Download } from 'lucide-react';
import { DrivePhoto, DriveFolder } from '../types/drive';
import { formatBytes, downloadBlob } from '../utils/formatters';

interface DriveTimelineViewProps {
  photos: DrivePhoto[];
  folders: DriveFolder[];
  selectedPhotoIds: string[];
  onToggleSelect: (id: string) => void;
  onOpenPhoto: (photo: DrivePhoto) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
}

export const DriveTimelineView: React.FC<DriveTimelineViewProps> = ({
  photos,
  folders,
  selectedPhotoIds,
  onToggleSelect,
  onOpenPhoto,
  onToggleFavorite,
}) => {
  // Group photos by time bucket
  const groupPhotos = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;
    const thisWeek = today - 86400000 * 7;
    const thisMonth = today - 86400000 * 30;

    const groups: { title: string; subtitle: string; photos: DrivePhoto[] }[] = [
      { title: 'اليوم', subtitle: 'صور مضافة حديثاً', photos: [] },
      { title: 'أمس', subtitle: 'أمس', photos: [] },
      { title: 'هذا الأسبوع', subtitle: 'خلال الـ 7 أيام الماضية', photos: [] },
      { title: 'هذا الشهر', subtitle: 'خلال آخر 30 يوماً', photos: [] },
      { title: 'ذكريات سابقة', subtitle: 'أقدم من شهر', photos: [] },
    ];

    photos.forEach((photo) => {
      const t = photo.createdAt;
      if (t >= today) {
        groups[0].photos.push(photo);
      } else if (t >= yesterday) {
        groups[1].photos.push(photo);
      } else if (t >= thisWeek) {
        groups[2].photos.push(photo);
      } else if (t >= thisMonth) {
        groups[3].photos.push(photo);
      } else {
        groups[4].photos.push(photo);
      }
    });

    return groups.filter((g) => g.photos.length > 0);
  };

  const groups = groupPhotos();

  return (
    <div className="space-y-8">
      {groups.map((group, groupIdx) => (
        <div key={groupIdx} className="space-y-3">
          {/* Timeline Header */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                {group.title}
              </h3>
              <p className="text-[11px] text-slate-400">{group.photos.length} صورة</p>
            </div>
          </div>

          {/* Group Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {group.photos.map((photo) => {
              const isSelected = selectedPhotoIds.includes(photo.id);

              return (
                <div
                  key={photo.id}
                  onClick={() => onOpenPhoto(photo)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/30'
                      : 'border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Star Pill */}
                  {photo.isFavorite && (
                    <div className="absolute top-2 left-2 p-1 rounded-md bg-amber-400 text-slate-900 shadow-sm z-10">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}

                  {/* Small Download Button directly on the image */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadBlob(photo.blob, photo.name);
                    }}
                    className="absolute top-2 left-2 w-6 h-6 rounded-lg bg-black/60 hover:bg-emerald-600 text-white shadow-md backdrop-blur-xs flex items-center justify-center transition-all z-20 cursor-pointer opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                    style={{ left: photo.isFavorite ? '2rem' : '0.5rem' }}
                    title="تحميل وحفظ الصورة على جهازك"
                    aria-label="تحميل الصورة"
                  >
                    <Download className="w-3 h-3 stroke-[2.5]" />
                  </button>

                  {/* Selection Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(photo.id);
                    }}
                    className={`absolute top-2 right-2 w-6 h-6 rounded-lg flex items-center justify-center transition-all z-10 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-black/40 text-white opacity-0 group-hover:opacity-100 backdrop-blur-xs'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-75'}`} />
                  </button>

                  {/* Bottom Caption Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-6 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                    <span className="truncate max-w-[70%] font-semibold">{photo.name}</span>
                    <span className="opacity-80">{formatBytes(photo.size)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
