import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Smartphone, 
  Lock, 
  LayoutGrid, 
  Eye, 
  Download, 
  Sparkles, 
  Sliders, 
  Heart, 
  HelpCircle, 
  Volume2, 
  Wifi, 
  Battery, 
  Flashlight, 
  Camera, 
  Phone, 
  MessageSquare, 
  Compass, 
  Settings, 
  Search, 
  Mic, 
  Share2,
  Check
} from 'lucide-react';
import { Wallpaper, PreviewScreenMode, PhoneFrameType, ClockCustomization } from '../types/wallpaper';
import { toArabicDigits, getLiveArabicDates, shareOrSetAsWallpaper, downloadWallpaperDirect } from '../utils/setWallpaperHelper';

interface Props {
  wallpaper: Wallpaper | null;
  isOpen: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenEditor: () => void;
  onOpenGuide: () => void;
}

export const PhoneSimulatorModal: React.FC<Props> = ({
  wallpaper,
  isOpen,
  isFavorite,
  onClose,
  onToggleFavorite,
  onOpenEditor,
  onOpenGuide,
}) => {
  const [screenMode, setScreenMode] = useState<PreviewScreenMode>('lock');
  const [frameType, setFrameType] = useState<PhoneFrameType>('iphone');
  const [numeralType, setNumeralType] = useState<'western' | 'arabic'>('western');
  const [homeDim, setHomeDim] = useState<number>(0);
  const [homeBlur, setHomeBlur] = useState<number>(0);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [applyToast, setApplyToast] = useState<string | null>(null);

  // Live Time state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Parallax 3D tilt
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / (rect.height / 2)) * -10,
      y: (x / (rect.width / 2)) * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  if (!isOpen || !wallpaper) return null;

  // Format time
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const rawTimeString = `${hours}:${minutes}`;
  const displayTime = numeralType === 'arabic' ? toArabicDigits(rawTimeString) : rawTimeString;

  const { gregorianDay, gregorianDate, hijriDate } = getLiveArabicDates();

  const handleDirectSetWallpaper = async () => {
    setIsApplying(true);
    setApplyToast(null);

    const result = await shareOrSetAsWallpaper(wallpaper.imageUrl, wallpaper.titleAr);
    setIsApplying(false);

    if (result.method === 'native-share') {
      setApplyToast('تم فتح قائمة المشاركة لتعيين الخلفية مباشرة!');
    } else {
      setApplyToast('تم تنزيل الخلفية بنجاح! راجع دليل التعيين البسيط');
      setTimeout(() => {
        onOpenGuide();
      }, 900);
    }

    setTimeout(() => {
      setApplyToast(null);
    }, 4000);
  };

  const handleDownload = () => {
    downloadWallpaperDirect(wallpaper.imageUrl, wallpaper.titleAr);
    setApplyToast('جاري حفظ الصورة بدقة فائقة...');
    setTimeout(() => setApplyToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[96vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">{wallpaper.titleAr}</h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>{wallpaper.resolution}</span>
                <span aria-hidden="true">·</span>
                <span>{wallpaper.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(wallpaper.id)}
              className={`p-2 rounded-xl transition-all ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="إضافة للمفضلة"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {applyToast && (
          <div className="bg-amber-500 text-slate-950 text-xs font-bold py-2 px-4 text-center animate-fade-in flex items-center justify-center gap-2 shadow-inner">
            <Check className="w-4 h-4" />
            <span>{applyToast}</span>
          </div>
        )}

        {/* Content Body: Left Controls, Center Phone Simulation */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-5 order-2 lg:order-1">
            {/* Screen Mode Switcher */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">نوع المعاينة الحية</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <button
                  onClick={() => setScreenMode('lock')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    screenMode === 'lock'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>شاشة القفل</span>
                </button>
                <button
                  onClick={() => setScreenMode('home')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    screenMode === 'home'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>الرئيسية</span>
                </button>
                <button
                  onClick={() => setScreenMode('clean')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    screenMode === 'clean'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>نقية</span>
                </button>
              </div>
            </div>

            {/* Phone Style & Clock Digit type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">طراز الهاتف</label>
                <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
                  <button
                    onClick={() => setFrameType('iphone')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      frameType === 'iphone' ? 'bg-slate-700 text-white' : 'text-slate-400'
                    }`}
                  >
                    آيفون
                  </button>
                  <button
                    onClick={() => setFrameType('android')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      frameType === 'android' ? 'bg-slate-700 text-white' : 'text-slate-400'
                    }`}
                  >
                    أندرويد
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">أرقام الساعة</label>
                <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
                  <button
                    onClick={() => setNumeralType('western')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      numeralType === 'western' ? 'bg-slate-700 text-white' : 'text-slate-400'
                    }`}
                  >
                    12:45
                  </button>
                  <button
                    onClick={() => setNumeralType('arabic')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      numeralType === 'arabic' ? 'bg-slate-700 text-white' : 'text-slate-400'
                    }`}
                  >
                    ١٢:٤٥
                  </button>
                </div>
              </div>
            </div>

            {/* Home Screen Readability Sliders (When on Home screen mode) */}
            {screenMode === 'home' && (
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3 animate-fade-in">
                <span className="text-xs font-bold text-amber-400 block">اختبار وضوح الأيقونات فوق الخلفية</span>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>عتامة الخلفية (Dim)</span>
                    <span>{homeDim}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={homeDim}
                    onChange={(e) => setHomeDim(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-700 rounded-lg h-1.5 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>تأثير الضبابية (Blur)</span>
                    <span>{homeBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={homeBlur}
                    onChange={(e) => setHomeBlur(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-700 rounded-lg h-1.5 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDirectSetWallpaper}
                disabled={isApplying}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isApplying ? 'جارٍ المعالجة...' : 'تعيين كخلفية شاشة الآن'}</span>
              </button>

              {/* Download High Res Options */}
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <span className="text-xs font-bold text-slate-200 block text-center">
                  تحميل وحفظ الصورة في جهازك:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 font-bold text-xs border border-amber-500/30 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل 4K أصلي</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-600 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-300" />
                    <span>تحميل Full HD</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onOpenEditor}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>تعديل وتكييف المقاس</span>
                </button>
                <button
                  onClick={onOpenGuide}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>دليل التعيين</span>
                </button>
              </div>
            </div>
          </div>

          {/* Phone Simulation Preview Area */}
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-8 flex items-center justify-center py-2 order-1 lg:order-2 perspective-[1200px]"
          >
            {/* Phone Bezel */}
            <div 
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.15s ease-out',
              }}
              className="relative w-[280px] sm:w-[320px] aspect-[9/19.5] bg-slate-950 rounded-[46px] p-3 shadow-2xl ring-1 ring-slate-800 border-[6px] border-slate-800 select-none overflow-hidden"
            >
              {/* Wallpaper Screen Surface */}
              <div className="relative w-full h-full rounded-[36px] overflow-hidden bg-black flex flex-col justify-between">
                {/* Background Image */}
                <img
                  src={wallpaper.imageUrl}
                  alt={wallpaper.titleAr}
                  className="absolute inset-0 w-full h-full object-cover transition-all"
                  style={{
                    filter: screenMode === 'home' ? `blur(${homeBlur}px)` : 'none',
                    transform: 'scale(1.02)',
                  }}
                />

                {/* Dimming overlay for home screen */}
                {screenMode === 'home' && homeDim > 0 && (
                  <div 
                    className="absolute inset-0 bg-black pointer-events-none transition-opacity"
                    style={{ opacity: homeDim / 100 }}
                  />
                )}

                {/* Subtle top scrim for clock legibility in Lock mode */}
                {screenMode === 'lock' && (
                  <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />
                )}

                {/* Top Status Bar & Camera Island */}
                <div className="relative z-20 px-6 pt-3 flex items-center justify-between text-white text-[12px] font-semibold">
                  <span className="font-mono tracking-tight">{displayTime}</span>

                  {/* Island / Punch hole */}
                  {frameType === 'iphone' ? (
                    <div className="w-24 h-5 bg-black rounded-full mx-auto flex items-center justify-end px-2 gap-1.5 shadow-md">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                    </div>
                  ) : (
                    <div className="w-3.5 h-3.5 bg-black rounded-full mx-auto border border-slate-800" />
                  )}

                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    <Battery className="w-4 h-4 fill-white" />
                  </div>
                </div>

                {/* MODE 1: LOCK SCREEN CONTENT */}
                {screenMode === 'lock' && (
                  <div className="relative z-20 flex-1 flex flex-col justify-between p-5 pt-8 animate-fade-in text-white text-center">
                    {/* Date and Clock */}
                    <div>
                      <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-200 drop-shadow-md">
                        <span>{gregorianDay}،</span>
                        <span>{gregorianDate}</span>
                        <span className="mx-1">·</span>
                        <span className="text-amber-300/90">{hijriDate}</span>
                      </div>
                      <div className="text-6xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-lg font-sans mt-0.5">
                        {displayTime}
                      </div>
                    </div>

                    {/* Lock Screen Notification Card simulation */}
                    <div className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-3 text-right shadow-xl">
                      <div className="flex items-center justify-between text-[10px] text-slate-300 mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] text-white">
                            ✓
                          </div>
                          <span className="font-bold">واتساب</span>
                        </div>
                        <span className="text-slate-400">الآن</span>
                      </div>
                      <p className="text-xs font-semibold text-white">أحمد الرشيد</p>
                      <p className="text-[11px] text-slate-200 truncate">ما شاء الله الخلفية الجديدة فخمة جداً! من وين نزلتها؟</p>
                    </div>

                    {/* Bottom Shortcuts (Flashlight, Camera, Swipe Home Indicator) */}
                    <div>
                      <div className="flex items-center justify-between px-3">
                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                          <Flashlight className="w-4 h-4" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                          <Camera className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Swipe Home Indicator Bar */}
                      <div className="w-28 h-1 bg-white/70 rounded-full mx-auto mt-4" />
                    </div>
                  </div>
                )}

                {/* MODE 2: HOME SCREEN APPS GRID */}
                {screenMode === 'home' && (
                  <div className="relative z-20 flex-1 flex flex-col justify-between p-4 pt-6 animate-fade-in text-white">
                    {/* Search Widget */}
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2 px-3 flex items-center justify-between border border-white/25 shadow-lg">
                      <div className="flex items-center gap-2 text-xs text-white/90">
                        <Search className="w-3.5 h-3.5 text-white/70" />
                        <span>بحث...</span>
                      </div>
                      <Mic className="w-3.5 h-3.5 text-white/80" />
                    </div>

                    {/* App Icons Grid */}
                    <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center my-auto">
                      {[
                        { name: 'الهاتف', icon: Phone, color: 'bg-emerald-500' },
                        { name: 'الرسائل', icon: MessageSquare, color: 'bg-blue-500' },
                        { name: 'الصور', icon: Camera, color: 'bg-amber-500' },
                        { name: 'الطقس', icon: Sparkles, color: 'bg-sky-400' },
                        { name: 'المتصفح', icon: Compass, color: 'bg-indigo-500' },
                        { name: 'الإعدادات', icon: Settings, color: 'bg-slate-600' },
                        { name: 'الرَوْنَق', icon: Sparkles, color: 'bg-gradient-to-tr from-amber-500 to-rose-500' },
                        { name: 'الملاحظات', icon: MessageSquare, color: 'bg-yellow-500' },
                      ].map((app, idx) => {
                        const Icon = app.icon;
                        return (
                          <div key={idx} className="flex flex-col items-center gap-1">
                            <div className={`w-11 h-11 rounded-2xl ${app.color} shadow-lg flex items-center justify-center text-white`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-medium drop-shadow-md text-white/95 truncate max-w-[50px]">
                              {app.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Dock */}
                    <div>
                      <div className="bg-white/20 backdrop-blur-xl border border-white/25 rounded-3xl p-2 flex items-center justify-around shadow-xl">
                        {[
                          { icon: Phone, color: 'bg-emerald-500' },
                          { icon: MessageSquare, color: 'bg-green-500' },
                          { icon: Compass, color: 'bg-sky-500' },
                          { icon: Camera, color: 'bg-slate-700' },
                        ].map((d, i) => {
                          const DIcon = d.icon;
                          return (
                            <div key={i} className={`w-11 h-11 rounded-2xl ${d.color} shadow-md flex items-center justify-center text-white`}>
                              <DIcon className="w-5 h-5" />
                            </div>
                          );
                        })}
                      </div>

                      {/* Home Indicator */}
                      <div className="w-28 h-1 bg-white/70 rounded-full mx-auto mt-3" />
                    </div>
                  </div>
                )}

                {/* MODE 3: CLEAN FULL BLEED */}
                {screenMode === 'clean' && (
                  <div className="relative z-20 flex-1 flex flex-col justify-end p-4 animate-fade-in">
                    <div className="bg-black/50 backdrop-blur-md rounded-xl p-2 text-center text-[11px] text-white">
                      معاينة نقية بدقة فائقة 9:16
                    </div>
                    <div className="w-28 h-1 bg-white/70 rounded-full mx-auto mt-3" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: wallpaper.dominantColor }} />
            <span>اللون المتناسق: {wallpaper.colorCategory}</span>
          </div>
          <span>حرك مؤشر الفأرة لاختبار تأثير الميلان ثلاثي الأبعاد (Parallax 3D)</span>
        </div>
      </div>
    </div>
  );
};
