import React, { useState, useRef } from 'react';
import { CallWallpaper } from '../types/phone';
import { 
  Sparkles, 
  Check, 
  Eye, 
  Upload, 
  Sliders, 
  Smartphone, 
  Shield, 
  Trash2,
  Play,
  RotateCcw
} from 'lucide-react';

interface WallpapersTabProps {
  wallpapers: CallWallpaper[];
  activeWallpaperId: string;
  onSelectActiveWallpaper: (id: string) => void;
  onAddCustomWallpaper: (wp: CallWallpaper) => void;
  onUpdateWallpaper: (wp: CallWallpaper) => void;
  onDeleteWallpaper?: (id: string) => void;
  onPreviewWallpaper: (wp: CallWallpaper) => void;
}

export const WallpapersTab: React.FC<WallpapersTabProps> = ({
  wallpapers,
  activeWallpaperId,
  onSelectActiveWallpaper,
  onAddCustomWallpaper,
  onUpdateWallpaper,
  onPreviewWallpaper,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWpForEdit, setSelectedWpForEdit] = useState<CallWallpaper | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', label: 'كافة الخلفيات' },
    { id: 'aurora', label: 'الشفق الكوني' },
    { id: 'luxury', label: 'فخامة وملكي' },
    { id: 'cyber', label: 'سايبر وتكنولوجيا' },
    { id: 'nature', label: 'طبيعة وغروب' },
    { id: 'gradient', label: 'تدرجات ثلاثية الأبعاد' },
    { id: 'custom', label: 'خلفياتي الخاصة' },
  ];

  const filteredWallpapers = wallpapers.filter((w) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'custom') return w.isCustom;
    return w.category === selectedCategory;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newWp: CallWallpaper = {
        id: 'custom_' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, '').slice(0, 15) || 'خلفيتي الخاصة',
        category: 'custom',
        imageSrc: dataUrl,
        blur: 0,
        darkness: 30,
        animationType: 'none',
        isCustom: true,
      };
      onAddCustomWallpaper(newWp);
      onSelectActiveWallpaper(newWp.id);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const activeWp = wallpapers.find(w => w.id === activeWallpaperId) || wallpapers[0];

  return (
    <div className="flex flex-col h-full px-4 pb-6 max-w-lg mx-auto w-full select-none">
      {/* Header */}
      <div className="pt-2 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>خلفيات الاتصال الفاخرة</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              اختر خلفية ملهمة ومذهلة تظهر أثناء المكالمات الواردة والصادرة
            </p>
          </div>

          {/* Upload Custom Wallpaper Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>رفع خلفية</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Wallpaper Hero Highlight */}
      <div className="mb-4 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent dark:from-indigo-950/40 p-3 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-16 rounded-xl overflow-hidden shadow-md border-2 border-indigo-500 shrink-0">
            {activeWp.imageSrc ? (
              <img src={activeWp.imageSrc} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: activeWp.gradientCss }} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>الخلفية النشطة حالياً</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {activeWp.title}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              تطبق على جميع المكالمات العامة
            </p>
          </div>
        </div>

        <button
          onClick={() => onPreviewWallpaper(activeWp)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-600" />
          <span>معاينة حية</span>
        </button>
      </div>

      {/* Wallpapers Grid (2 columns of 9:16 phone wallpapers) */}
      <div className="flex-1 overflow-y-auto pr-0.5">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {filteredWallpapers.map((wp) => {
            const isActive = wp.id === activeWallpaperId;
            return (
              <div
                key={wp.id}
                className={`group relative rounded-2xl overflow-hidden border-2 shadow-xs transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400/60'
                }`}
                style={{ height: '240px' }}
              >
                {/* Background Layer */}
                <div className="absolute inset-0">
                  {wp.imageSrc ? (
                    <img
                      src={wp.imageSrc}
                      alt={wp.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        filter: `blur(${wp.blur}px) brightness(${1 - (wp.darkness || 25) / 100})`,
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                      style={{ background: wp.gradientCss }}
                    />
                  )}
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                </div>

                {/* Top Badge: Active / Category */}
                <div className="relative z-10 p-2.5 flex items-center justify-between">
                  {isActive ? (
                    <span className="flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                      <Check className="w-3 h-3" />
                      <span>مفعلة</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/80 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full font-medium">
                      {wp.category}
                    </span>
                  )}

                  {/* Settings Trigger for custom blur/darkness */}
                  <button
                    onClick={() => setSelectedWpForEdit(wp)}
                    className="p-1 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
                    title="ضبط تأثيرات التمويه والتباين"
                  >
                    <Sliders className="w-3 h-3" />
                  </button>
                </div>

                {/* Simulated Caller Mock Badge in Center */}
                <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-xs font-bold text-white mb-1 shadow-sm">
                    📞
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow-sm">
                    شاشة الاتصال
                  </span>
                </div>

                {/* Bottom Actions: Title & Set Active / Preview */}
                <div className="relative z-10 p-2.5 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-xs font-bold text-white truncate mb-1.5">
                    {wp.title}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectActiveWallpaper(wp.id)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
                      }`}
                    >
                      {isActive ? 'الخلفية الحالية' : 'تعيين'}
                    </button>

                    <button
                      onClick={() => onPreviewWallpaper(wp)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition-colors"
                      title="معاينة شاشة الاتصال"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adjustment Drawer / Modal for Blur & Darkness */}
      {selectedWpForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              تخصيص تأثيرات: {selectedWpForEdit.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              اضبط نسبة التمويه والتعتيم لتسهيل قراءة أسماء المتصلين
            </p>

            {/* Live Mini Preview */}
            <div className="relative h-32 rounded-2xl overflow-hidden mb-4 border border-slate-300 dark:border-slate-700">
              {selectedWpForEdit.imageSrc ? (
                <img
                  src={selectedWpForEdit.imageSrc}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{
                    filter: `blur(${selectedWpForEdit.blur}px) brightness(${1 - (selectedWpForEdit.darkness || 30) / 100})`,
                  }}
                />
              ) : (
                <div className="w-full h-full" style={{ background: selectedWpForEdit.gradientCss }} />
              )}
              <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold bg-black/20">
                <span>نموذج اسم المتصل 0501234567</span>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3 mb-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>تمويه الخلفية (Blur)</span>
                  <span className="font-mono">{selectedWpForEdit.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="1"
                  value={selectedWpForEdit.blur}
                  onChange={(e) => {
                    const updated = { ...selectedWpForEdit, blur: Number(e.target.value) };
                    setSelectedWpForEdit(updated);
                    onUpdateWallpaper(updated);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>تعتيم الإضاءة (Darkness)</span>
                  <span className="font-mono">{selectedWpForEdit.darkness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="5"
                  value={selectedWpForEdit.darkness}
                  onChange={(e) => {
                    const updated = { ...selectedWpForEdit, darkness: Number(e.target.value) };
                    setSelectedWpForEdit(updated);
                    onUpdateWallpaper(updated);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedWpForEdit(null)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
