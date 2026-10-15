import React, { useState } from 'react';
import { Heart, Download, Eye, Smartphone, Sparkles, Check } from 'lucide-react';
import { Wallpaper } from '../types/wallpaper';

interface Props {
  wallpaper: Wallpaper;
  isFavorite: boolean;
  onPreview: (wallpaper: Wallpaper) => void;
  onDirectSet: (wallpaper: Wallpaper) => void;
  onToggleFavorite: (id: string) => void;
  onDownload: (wallpaper: Wallpaper) => void;
}

export const WallpaperCard: React.FC<Props> = ({
  wallpaper,
  isFavorite,
  onPreview,
  onDirectSet,
  onToggleFavorite,
  onDownload,
}) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(wallpaper);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(wallpaper.id);
  };

  const handleDirectSetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDirectSet(wallpaper);
  };

  return (
    <div
      onClick={() => onPreview(wallpaper)}
      className="group relative flex flex-col bg-slate-900/60 dark:bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 select-none"
    >
      {/* 9:16 Aspect Ratio Wallpaper Container */}
      <div className="relative w-full aspect-[9/16] bg-slate-950 overflow-hidden">
        {/* Placeholder / Fallback Gradient while image loads */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black transition-opacity duration-500 flex items-center justify-center ${
            imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
        </div>

        {/* Wallpaper Image */}
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.titleAr}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradient Scrim for readable overlay text */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/30 opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges: Dominant Color Dot + Favorite Button */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-white/90">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: wallpaper.dominantColor }}
            />
            <span>{wallpaper.resolution.split(' ')[0]}</span>
          </div>

          <button
            onClick={handleFavoriteClick}
            aria-label="إضافة للمفضلة"
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isFavorite
                ? 'bg-rose-500/30 text-rose-400 border border-rose-500/40'
                : 'bg-black/40 text-white/70 hover:text-white border border-white/10 hover:bg-black/60'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Center Hover Action (Live Phone Preview Trigger) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <div className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Smartphone className="w-4 h-4" />
            <span>معاينة واقعية</span>
          </div>
        </div>

        {/* Bottom Details & Quick Actions */}
        <div className="absolute bottom-0 inset-x-0 p-3 z-10 flex flex-col justify-end text-white">
          <h3 className="text-xs sm:text-sm font-bold truncate text-white drop-shadow">
            {wallpaper.titleAr}
          </h3>

          {/* Clean Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-0.5">
            <span>{wallpaper.category}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="font-mono tabular-nums">{(wallpaper.downloads).toLocaleString('ar-EG')} تنزيل</span>
          </div>

          {/* Quick Buttons row on hover / touch */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
            <button
              onClick={handleDirectSetClick}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm transition-colors active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>تعيين</span>
            </button>

            <button
              onClick={handleDownloadClick}
              aria-label="تنزيل وتحميل الخلفية"
              title="تحميل الصورة بدقة عالية"
              className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg border backdrop-blur-md text-[11px] font-bold transition-all active:scale-95 ${
                downloadSuccess
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : 'bg-black/60 hover:bg-black/80 text-amber-300 border-amber-400/40 hover:text-white'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تم!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>تحميل</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
