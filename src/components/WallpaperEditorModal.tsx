import React, { useState, useRef, useEffect } from 'react';
import { X, Sliders, Download, Check, RefreshCw, ZoomIn, ZoomOut, Sun, Contrast, Eye } from 'lucide-react';
import { Wallpaper } from '../types/wallpaper';

interface Props {
  wallpaper: Wallpaper | null;
  isOpen: boolean;
  onClose: () => void;
  onExport: (dataUrl: string, title: string) => void;
}

export const WallpaperEditorModal: React.FC<Props> = ({
  wallpaper,
  isOpen,
  onClose,
  onExport,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [blur, setBlur] = useState<number>(0);
  const [addTopClockScrim, setAddTopClockScrim] = useState<boolean>(true);
  const [addBottomDockScrim, setAddBottomDockScrim] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen || !wallpaper) return;
    renderCanvas();
  }, [isOpen, wallpaper, scale, brightness, contrast, blur, addTopClockScrim, addBottomDockScrim]);

  const renderCanvas = () => {
    if (!wallpaper || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = wallpaper.imageUrl;

    img.onload = () => {
      // 9:16 target canvas resolution (1080 x 1920)
      const targetW = 1080;
      const targetH = 1920;
      canvas.width = targetW;
      canvas.height = targetH;

      ctx.clearRect(0, 0, targetW, targetH);
      ctx.save();

      // Apply CSS-like filters on canvas
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`;

      // Draw image centered with zoom scale
      const imgAspect = img.width / img.height;
      const targetAspect = targetW / targetH;

      let drawW, drawH;
      if (imgAspect > targetAspect) {
        drawH = targetH * scale;
        drawW = drawH * imgAspect;
      } else {
        drawW = targetW * scale;
        drawH = drawW / imgAspect;
      }

      const offsetX = (targetW - drawW) / 2;
      const offsetY = (targetH - drawH) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      ctx.restore();

      // Draw Top Scrim gradient (for clock readability)
      if (addTopClockScrim) {
        const topGrad = ctx.createLinearGradient(0, 0, 0, 480);
        topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
        topGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
        topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, targetW, 480);
      }

      // Draw Bottom Dock Scrim gradient
      if (addBottomDockScrim) {
        const botGrad = ctx.createLinearGradient(0, targetH - 380, 0, targetH);
        botGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        botGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)');
        botGrad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        ctx.fillStyle = botGrad;
        ctx.fillRect(0, targetH - 380, targetW, 380);
      }
    };
  };

  const handleExportDownload = () => {
    if (!canvasRef.current || !wallpaper) return;
    setIsExporting(true);

    try {
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.95);
      const title = `${wallpaper.titleAr}_مخصصة`;

      // Trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onExport(dataUrl, title);
      onClose();
    } catch (err) {
      console.error('Failed to export edited wallpaper:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const resetFilters = () => {
    setScale(1);
    setBrightness(100);
    setContrast(100);
    setBlur(0);
    setAddTopClockScrim(true);
    setAddBottomDockScrim(false);
  };

  if (!isOpen || !wallpaper) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">تخصيص وتكييف الخلفية لمقاس جوالك</h2>
              <p className="text-xs text-slate-400">{wallpaper.titleAr}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body grid: Left canvas preview, Right controls */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          {/* Canvas Preview Area */}
          <div className="md:col-span-6 flex flex-col items-center justify-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="relative w-48 sm:w-56 aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700/80 bg-black">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
              />
              {/* Simulated Clock Overlay for checking readability */}
              <div className="absolute top-7 inset-x-0 flex flex-col items-center pointer-events-none text-white drop-shadow-md">
                <span className="text-xs text-slate-200 font-medium">الجمعة، 15 أكتوبر</span>
                <span className="text-3xl font-bold tracking-tight">09:41</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              معاينة حية لشاشة القفل مع تظليل الساعة
            </p>
          </div>

          {/* Controls Area */}
          <div className="md:col-span-6 space-y-5">
            {/* Zoom / Scale */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  نسبة التكبير (Zoom)
                </span>
                <span className="text-amber-400 font-mono">{Math.round(scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Brightness */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  السطوع (Brightness)
                </span>
                <span className="text-amber-400 font-mono">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-amber-400" />
                  التباين (Contrast)
                </span>
                <span className="text-amber-400 font-mono">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Blur */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  درجة الضبابية (Blur للشاشة الرئيسية)
                </span>
                <span className="text-amber-400 font-mono">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Special Overlays */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-colors">
                <span className="text-xs font-semibold text-white">
                  تظليل علوي ناعم (لوضوح الساعة 100%)
                </span>
                <input
                  type="checkbox"
                  checked={addTopClockScrim}
                  onChange={(e) => setAddTopClockScrim(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-colors">
                <span className="text-xs font-semibold text-white">
                  تظليل سفلي (لوضوح شريط التطبيقات والدوك)
                </span>
                <input
                  type="checkbox"
                  checked={addBottomDockScrim}
                  onChange={(e) => setAddBottomDockScrim(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
              </label>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة ضبط القيم الافتراضية</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleExportDownload}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/10 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'جارٍ التصدير...' : 'تصدير وتنزيل الخلفية المعدّلة (1080x1920)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
