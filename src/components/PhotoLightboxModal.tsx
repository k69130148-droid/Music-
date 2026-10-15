import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  Download, 
  Share2, 
  Trash2, 
  Star, 
  Sliders, 
  Info, 
  Play, 
  Pause, 
  Save, 
  Tag, 
  FileText, 
  Folder, 
  Check, 
  Maximize2,
  Minimize2,
  RefreshCw,
  Copy
} from 'lucide-react';
import { DrivePhoto, DriveFolder } from '../types/drive';
import { formatBytes, formatFullDate, downloadBlob, triggerConfetti } from '../utils/formatters';
import { driveDb } from '../services/driveDb';

interface PhotoLightboxModalProps {
  photo: DrivePhoto | null;
  allPhotos: DrivePhoto[];
  folders: DriveFolder[];
  onClose: () => void;
  onNavigate: (photo: DrivePhoto) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
  onMoveToTrash: (id: string) => void;
  onPhotoUpdated: () => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  photo,
  allPhotos,
  folders,
  onClose,
  onNavigate,
  onToggleFavorite,
  onMoveToTrash,
  onPhotoUpdated,
}) => {
  const [photoBlobUrl, setPhotoBlobUrl] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [isOriginalSize, setIsOriginalSize] = useState<boolean>(false);
  const [showInfoSidebar, setShowInfoSidebar] = useState<boolean>(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);

  // Filters state
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [sepia, setSepia] = useState<number>(0);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);

  // Slideshow
  const [isSlideshowRunning, setIsSlideshowRunning] = useState<boolean>(false);

  // Editable note & tags
  const [note, setNote] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [isSavingMeta, setIsSavingMeta] = useState<boolean>(false);
  const [metaSavedSuccess, setMetaSavedSuccess] = useState<boolean>(false);

  // Load high-res blob url
  useEffect(() => {
    if (!photo) return;
    let objectUrl: string | null = null;
    try {
      if (photo.blob && photo.blob instanceof Blob && photo.blob.size > 0) {
        objectUrl = URL.createObjectURL(photo.blob);
        setPhotoBlobUrl(objectUrl);
      } else if (photo.thumbnailUrl) {
        setPhotoBlobUrl(photo.thumbnailUrl);
      }
    } catch (e) {
      console.warn('Could not create object URL for photo blob:', e);
      if (photo.thumbnailUrl) {
        setPhotoBlobUrl(photo.thumbnailUrl);
      }
    }

    setZoomLevel(1);
    setRotation(0);
    setFlipH(false);
    setIsOriginalSize(false);
    resetFilters();
    setNote(photo.note || '');
    setTags(photo.tags || []);

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [photo?.id]);

  // Slideshow timer
  useEffect(() => {
    if (!isSlideshowRunning || !photo) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [isSlideshowRunning, photo, allPhotos]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handlePrev(); // RTL
      if (e.key === 'ArrowLeft') handleNext();  // RTL
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, allPhotos]);

  if (!photo) return null;

  const displayImageSrc = photoBlobUrl || photo.thumbnailUrl || '';
  const currentIndex = Math.max(0, allPhotos.findIndex((p) => p.id === photo.id));
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allPhotos.length - 1;

  const handlePrev = () => {
    if (hasPrev) onNavigate(allPhotos[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(allPhotos[currentIndex + 1]);
    } else if (isSlideshowRunning) {
      // Loop back to start in slideshow
      onNavigate(allPhotos[0]);
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSepia(0);
    setGrayscale(0);
    setBlur(0);
  };

  const hasFilterChanges =
    brightness !== 100 ||
    contrast !== 100 ||
    saturation !== 100 ||
    sepia !== 0 ||
    grayscale !== 0 ||
    blur !== 0 ||
    rotation !== 0 ||
    flipH;

  const filterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px)`,
    transform: isOriginalSize
      ? `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`
      : `scale(${zoomLevel}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
    transition: 'transform 0.15s ease-out, filter 0.15s ease-out',
    imageRendering: 'auto' as const,
  };

  // Save edited image back to IndexedDB
  const handleSaveEditedImage = async (saveAsCopy: boolean) => {
    const srcToUse = photoBlobUrl || photo.thumbnailUrl;
    if (!srcToUse) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = srcToUse;
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const isRotated90 = Math.abs(rotation % 180) === 90;
      canvas.width = isRotated90 ? img.naturalHeight : img.naturalWidth;
      canvas.height = isRotated90 ? img.naturalWidth : img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Apply CSS filters in 2d context
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px)`;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      if (flipH) ctx.scale(-1, 1);
      ctx.drawImage(
        img,
        -img.naturalWidth / 2,
        -img.naturalHeight / 2,
        img.naturalWidth,
        img.naturalHeight
      );
      ctx.restore();

      canvas.toBlob(
        async (b) => {
          if (!b) return;
          if (saveAsCopy) {
            const copyName = `معدلة_${photo.name}`;
            await driveDb.savePhoto(b, copyName, {
              folderId: photo.folderId,
              tags: [...photo.tags, 'معدلة'],
              note: photo.note,
            });
          } else {
            // Overwrite existing photo blob and dimensions
            const thumbCanvas = document.createElement('canvas');
            thumbCanvas.width = 300;
            thumbCanvas.height = Math.round((300 * canvas.height) / canvas.width);
            const tctx = thumbCanvas.getContext('2d');
            if (tctx) tctx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
            const thumbUrl = thumbCanvas.toDataURL('image/jpeg', 0.7);

            await driveDb.updatePhoto(photo.id, {
              blob: b,
              size: b.size,
              width: canvas.width,
              height: canvas.height,
              thumbnailUrl: thumbUrl,
            });
          }

          triggerConfetti();
          onPhotoUpdated();
          setShowFiltersPanel(false);
          resetFilters();
        },
        'image/jpeg',
        0.9
      );
    };
  };

  const handleSaveMeta = async () => {
    setIsSavingMeta(true);
    try {
      await driveDb.updatePhoto(photo.id, {
        note: note.trim(),
        tags,
      });
      setMetaSavedSuccess(true);
      setTimeout(() => setMetaSavedSuccess(false), 2000);
      onPhotoUpdated();
    } finally {
      setIsSavingMeta(false);
    }
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleShare = async () => {
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([photo.blob], photo.name, { type: photo.type })] })) {
      try {
        await navigator.share({
          files: [new File([photo.blob], photo.name, { type: photo.type })],
          title: photo.name,
        });
      } catch {
        // user cancelled
      }
    } else {
      downloadBlob(photo.blob, photo.name);
    }
  };

  const currentFolder = folders.find((f) => f.id === photo.folderId);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col text-white select-none animate-fade-in">
      {/* Top Action Bar */}
      <div className="h-14 px-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between shrink-0 z-20">
        {/* Left: Close & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="إغلاق (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="truncate max-w-xs sm:max-w-md">
            <h3 className="font-bold text-sm text-slate-100 truncate">{photo.name}</h3>
            <p className="text-[11px] text-slate-400">
              {currentIndex + 1} من {allPhotos.length}
            </p>
          </div>
        </div>

        {/* Center / Right Tool Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Original 100% Resolution Size Toggle Button */}
          <button
            onClick={() => setIsOriginalSize(!isOriginalSize)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              isOriginalSize
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title={isOriginalSize ? 'ملاءمة حجم الشاشة' : 'عرض الصورة بمقاسها وجودتها الأصلية 100%'}
          >
            {isOriginalSize ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isOriginalSize ? 'ملاءمة الشاشة' : 'المقاس الأصلي 100%'}</span>
          </button>

          {/* Zoom controls */}
          <button
            onClick={() => {
              setIsOriginalSize(false);
              setZoomLevel((z) => Math.min(3, z + 0.25));
            }}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition hidden sm:block cursor-pointer"
            title="تكبير"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsOriginalSize(false);
              setZoomLevel((z) => Math.max(0.5, z - 0.25));
            }}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition hidden sm:block cursor-pointer"
            title="تصغير"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Rotate & Flip */}
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="تدوير مع عقارب الساعة"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFlipH(!flipH)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition hidden sm:block cursor-pointer"
            title="انعكاس أفقي"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>

          {/* Edit / Filters Toggle */}
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              showFiltersPanel ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="تعديل وتأثيرات الصورة"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Slideshow button */}
          <button
            onClick={() => setIsSlideshowRunning(!isSlideshowRunning)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isSlideshowRunning ? 'bg-emerald-600 text-white animate-pulse' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={isSlideshowRunning ? 'إيقاف عرض الشرائح' : 'بدء عرض الشرائح تلقائياً'}
          >
            {isSlideshowRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Star Toggle */}
          <button
            onClick={() => onToggleFavorite(photo.id, photo.isFavorite)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              photo.isFavorite ? 'text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="المفضلة"
          >
            <Star className={`w-4 h-4 ${photo.isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Download Original */}
          <button
            onClick={() => downloadBlob(photo.blob, photo.name)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="تنزيل الصورة"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="مشاركة الصورة"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Info toggle */}
          <button
            onClick={() => setShowInfoSidebar(!showInfoSidebar)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              showInfoSidebar ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="معلومات وتفاصيل الصورة"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Move to trash */}
          <button
            onClick={() => {
              onMoveToTrash(photo.id);
              onClose();
            }}
            className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-slate-800 transition cursor-pointer"
            title="نقل للمهملات"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Area: Image Stage + Floating Nav + Drawers */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Navigation Buttons */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white backdrop-blur-md flex items-center justify-center transition shadow-lg cursor-pointer"
            title="السابق (السهم الأيمن)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white backdrop-blur-md flex items-center justify-center transition shadow-lg cursor-pointer"
            title="التالي (السهم الأيسر)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Central Image Viewport */}
        <div
          className={`flex-1 flex p-4 transition-all ${
            isOriginalSize
              ? 'overflow-auto items-start justify-center cursor-zoom-out'
              : 'overflow-hidden items-center justify-center cursor-zoom-in'
          }`}
          onClick={(e) => {
            // Clicking directly on image or container background toggles original size / fit
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG' || target === e.currentTarget) {
              setIsOriginalSize(!isOriginalSize);
            }
          }}
        >
          <div className="relative inline-block m-auto">
            <img
              src={displayImageSrc}
              alt={photo.name}
              style={{
                ...filterStyle,
                width: isOriginalSize && photo.width ? `${photo.width}px` : undefined,
                height: isOriginalSize && photo.height ? `${photo.height}px` : undefined,
              }}
              className={`${
                isOriginalSize
                  ? 'max-w-none max-h-none rounded-lg shadow-2xl'
                  : 'max-w-full max-h-full object-contain rounded-lg shadow-2xl'
              } pointer-events-auto transition-all duration-200 select-none`}
              title={isOriginalSize ? 'انقر للتصغير لملاءمة الشاشة' : 'انقر لعرض الصورة بمقاسها وجودتها الأصلية 100%'}
            />

            {/* Pill notification badge when in original size mode */}
            {isOriginalSize && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-black/85 text-white text-xs px-4 py-2 rounded-full border border-slate-700/80 backdrop-blur-md shadow-2xl flex items-center gap-2 pointer-events-none animate-fade-in">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>المقاس الأصلي الكامل: {photo.width || 'طبيعي'} × {photo.height || 'طبيعي'} بكسل (جودة 100%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters & Adjustments Floating Panel */}
        {showFiltersPanel && (
          <div className="absolute bottom-4 right-4 z-30 w-80 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-2xl space-y-3.5 text-xs animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold flex items-center gap-1.5 text-blue-400">
                <Sliders className="w-4 h-4" />
                <span>تعديل وضبط الصورة</span>
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>إعادة ضبط</span>
              </button>
            </div>

            {/* Slider Bars */}
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>السطوع (Brightness)</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-slate-700 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>التباين (Contrast)</span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-slate-700 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>تشبع الألوان (Saturation)</span>
                  <span>{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-slate-700 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>أبيض وأسود (Grayscale)</span>
                  <span>{grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grayscale}
                  onChange={(e) => setGrayscale(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-slate-700 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>سيبيا دافئ (Sepia)</span>
                  <span>{sepia}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sepia}
                  onChange={(e) => setSepia(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-slate-700 rounded-lg"
                />
              </div>
            </div>

            {/* Save Buttons */}
            {hasFilterChanges && (
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => handleSaveEditedImage(true)}
                  className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center text-xs font-bold transition"
                >
                  حفظ كنسخة جديدة
                </button>
                <button
                  onClick={() => handleSaveEditedImage(false)}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-center text-xs font-medium transition"
                >
                  استبدال الأصلية
                </button>
              </div>
            )}
          </div>
        )}

        {/* Info & Notes Sidebar */}
        {showInfoSidebar && (
          <div className="w-80 bg-slate-900 border-r border-slate-800 p-5 space-y-5 overflow-y-auto text-xs z-30 shrink-0 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span>معلومات وتفاصيل الصورة</span>
              </span>
              <button
                onClick={() => setShowInfoSidebar(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* File Specifications */}
            <div className="space-y-2.5 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">الحجم:</span>
                <span className="font-mono">{formatBytes(photo.size)}</span>
              </div>

              {photo.width && photo.height && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">الأبعاد:</span>
                  <span className="font-mono">
                    {photo.width} × {photo.height} بكسل
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">صيغة الملف:</span>
                <span>{photo.type || 'image/jpeg'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">تاريخ الإضافة:</span>
                <span>{formatFullDate(photo.createdAt)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60 items-center">
                <span className="text-slate-400">المجلد:</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-200">
                  <Folder className="w-3 h-3 text-blue-400" />
                  <span>{currentFolder ? currentFolder.name : 'ملفاتي'}</span>
                </span>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-2 pt-2">
              <label className="block text-slate-400 font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                <span>الوسوم والتصنيفات:</span>
              </label>

              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[11px]"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="أضف وسماً..."
                  className="flex-1 bg-slate-800 text-white py-1.5 px-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold"
                >
                  إضافة
                </button>
              </div>
            </div>

            {/* Note Section */}
            <div className="space-y-2 pt-2">
              <label className="block text-slate-400 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>ملاحظات ووصف الصورة:</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="اكتب أي ملاحظة أو ذكرى متعلقة بهذه الصورة..."
                rows={3}
                className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none resize-none"
              />
            </div>

            {/* Save metadata button */}
            <button
              onClick={handleSaveMeta}
              disabled={isSavingMeta}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition"
            >
              {metaSavedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
              <span>{metaSavedSuccess ? 'تم حفظ التعديلات!' : 'حفظ الملاحظات والوسوم'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
