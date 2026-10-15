import React, { useState } from 'react';
import { Sparkles, Wand2, Download, Eye, Check, Smartphone, RefreshCw, Palette } from 'lucide-react';
import { Wallpaper } from '../types/wallpaper';

interface Props {
  onSaveToLibrary: (wallpaper: Wallpaper) => void;
  onPreview: (wallpaper: Wallpaper) => void;
  onDirectSet: (wallpaper: Wallpaper) => void;
}

const PRESET_RECIPES = [
  {
    id: 'molten_gold_dark',
    title: 'سائل الذهب المنصهر الفاخر',
    category: 'amoled' as const,
    dominantColor: '#f59e0b',
    colorCategory: 'gold' as const,
    tags: ['أموليد', 'ذهب', 'فخامة', '3D'],
    description: 'تموجات ثلاثية الأبعاد من الذهب السائل على خلفية سوداء عميقة موفرة للبطارية.',
    generator: () => {
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#78350f" />
      <stop offset="30%" stop-color="#b45309" />
      <stop offset="60%" stop-color="#fbbf24" />
      <stop offset="85%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="#040404" />
  <circle cx="540" cy="960" r="500" fill="url(#centerGlow)" />
  <path d="M-100,600 C300,200 700,1000 1180,600 L1180,900 C700,1300 300,500 -100,900 Z" fill="url(#goldG)" opacity="0.9" />
  <path d="M-100,1000 C300,600 700,1400 1180,1000 L1180,1300 C700,1700 300,900 -100,1300 Z" fill="url(#goldG)" opacity="0.75" />
  <circle cx="540" cy="960" r="380" fill="none" stroke="rgba(251,191,36,0.3)" stroke-width="1.5" stroke-dasharray="10 15" />
</svg>`)}`;
    }
  },
  {
    id: 'cyber_cyan_pulse',
    title: 'نبض السايبر والنيون الفيروزي',
    category: 'cyberpunk' as const,
    dominantColor: '#06b6d4',
    colorCategory: 'blue' as const,
    tags: ['سايبر', 'نيون', 'مستقبل', 'أزرق'],
    description: 'شبكة ألياف ضوئية نيونية متوهجة بألوان الفيروزي والأزرق الفضائي.',
    generator: () => {
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <radialGradient id="cyanRad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#0891b2" stop-opacity="0.8" />
      <stop offset="60%" stop-color="#0e1b30" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#020617" stop-opacity="1" />
    </radialGradient>
    <filter id="neonGlow">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="1080" height="1920" fill="#020617" />
  <rect width="1080" height="1920" fill="url(#cyanRad)" />
  <g filter="url(#neonGlow)">
    <circle cx="540" cy="760" r="240" fill="none" stroke="#22d3ee" stroke-width="3" />
    <polygon points="540,560 713,860 367,860" fill="none" stroke="#38bdf8" stroke-width="2" />
    <line x1="540" y1="200" x2="540" y2="1720" stroke="#06b6d4" stroke-width="1.5" opacity="0.6" stroke-dasharray="15 20" />
  </g>
  <path d="M-100,1400 Q540,1100 1180,1400 L1180,1920 L-100,1920 Z" fill="#030b1e" />
</svg>`)}`;
    }
  },
  {
    id: 'violet_cosmic_serenity',
    title: 'سحر المجرة الأرجوانية وسديم الأحلام',
    category: 'space' as const,
    dominantColor: '#a855f7',
    colorCategory: 'purple' as const,
    tags: ['فضاء', 'سديم', 'بنفسجي', 'نجوم'],
    description: 'سديم كوني ناعم مع تدرجات الأرجواني والوردي وهالات النجوم الساطعة.',
    generator: () => {
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <radialGradient id="vCosmic" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.8" />
      <stop offset="40%" stop-color="#6b21a8" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#090514" stop-opacity="1" />
    </radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="#090514" />
  <rect width="1080" height="1920" fill="url(#vCosmic)" />
  <circle cx="540" cy="580" r="180" fill="#f472b6" opacity="0.3" filter="blur(30px)" />
  <g fill="#ffffff">
    <circle cx="200" cy="300" r="3" opacity="0.9" />
    <circle cx="780" cy="400" r="2.5" opacity="0.8" />
    <circle cx="450" cy="780" r="3.5" opacity="0.95" />
    <circle cx="680" cy="1100" r="2" opacity="0.7" />
    <circle cx="290" cy="1400" r="3" opacity="0.85" />
    <circle cx="850" cy="1600" r="2.5" opacity="0.9" />
  </g>
  <path d="M-50,1100 Q540,850 1150,1100 L1150,1920 L-50,1920 Z" fill="#130924" />
</svg>`)}`;
    }
  },
  {
    id: 'emerald_nature_zen',
    title: 'واحة الزمرد والسكينة الخضراء',
    category: 'nature' as const,
    dominantColor: '#10b981',
    colorCategory: 'emerald' as const,
    tags: ['طبيعة', 'زمرد', 'هدوء', 'راحة'],
    description: 'تدرجات الزمرد المهدئة للأعصاب والمريحة للعينين في الاستخدام الليلي.',
    generator: () => {
      return `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="emZen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#022c22" />
      <stop offset="50%" stop-color="#064e3b" />
      <stop offset="80%" stop-color="#047857" />
      <stop offset="100%" stop-color="#065f46" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#emZen)" />
  <circle cx="540" cy="700" r="260" fill="none" stroke="#34d399" stroke-width="2" opacity="0.4" />
  <circle cx="540" cy="700" r="180" fill="none" stroke="#6ee7b7" stroke-width="1.5" opacity="0.3" stroke-dasharray="8 12" />
  <path d="M-50,1350 Q540,1150 1150,1350 L1150,1920 L-50,1920 Z" fill="#011b15" />
</svg>`)}`;
    }
  }
];

export const AiWallpaperStudio: React.FC<Props> = ({
  onSaveToLibrary,
  onPreview,
  onDirectSet,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState(PRESET_RECIPES[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedWallpaper, setGeneratedWallpaper] = useState<Wallpaper | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleGenerateRecipe = (recipe: typeof PRESET_RECIPES[0]) => {
    setSelectedRecipe(recipe);
    setIsGenerating(true);

    setTimeout(() => {
      const imageUrl = recipe.generator();
      const newWp: Wallpaper = {
        id: `custom-recipe-${Date.now()}`,
        titleAr: recipe.title,
        titleEn: recipe.id,
        category: recipe.category,
        imageUrl: imageUrl,
        dominantColor: recipe.dominantColor,
        colorCategory: recipe.colorCategory,
        tags: [...recipe.tags, 'استوديو الذكاء'],
        views: 1,
        downloads: 0,
        likes: 1,
        resolution: 'Ultra HD 4K (Vector Engine)',
        aspectRatio: '9:16',
        descriptionAr: recipe.description,
        descriptionEn: 'Custom generated wallpaper via Rawnaq Studio.',
        credit: 'استوديو رَوْنَق الإبداعي',
      };

      setGeneratedWallpaper(newWp);
      setIsGenerating(false);
    }, 400);
  };

  const handleSave = () => {
    if (!generatedWallpaper) return;
    onSaveToLibrary(generatedWallpaper);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in" dir="rtl">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>استوديو رَوْنَق لتوليد الخلفيات الذكية</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          ابتكر خلفية فريدة تناسب ذوقك وشاشتك
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          اختر نمطاً فنياً مخصصاً لمقاس الجوال 9:16 مع إمكانية المعاينة الواقعية والتعيين الفوري.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Presets and Customizer Column */}
        <div className="md:col-span-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <span>اختر النمط الفني المفضل:</span>
          </h3>

          <div className="space-y-3">
            {PRESET_RECIPES.map((recipe) => {
              const isSelected = selectedRecipe.id === recipe.id;
              return (
                <div
                  key={recipe.id}
                  onClick={() => handleGenerateRecipe(recipe)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: recipe.dominantColor }}
                      />
                      <h4 className="text-sm font-bold text-white">{recipe.title}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400">{recipe.category}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => handleGenerateRecipe(selectedRecipe)}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/15 transition-all active:scale-98 disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4" />
            <span>{isGenerating ? 'جارٍ توليد وتجهيز الخلفية...' : 'توليد الخلفية الآن بدقة 4K'}</span>
          </button>
        </div>

        {/* Live Preview Display Card */}
        <div className="md:col-span-6 flex flex-col items-center justify-center bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
          <div className="relative w-52 sm:w-60 aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-black">
            {isGenerating ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-amber-400 text-xs font-semibold">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>جارٍ الابتكار الفني...</span>
              </div>
            ) : generatedWallpaper ? (
              <>
                <img
                  src={generatedWallpaper.imageUrl}
                  alt={generatedWallpaper.titleAr}
                  className="w-full h-full object-cover"
                />
                {/* Overlay Clock */}
                <div className="absolute top-8 inset-x-0 text-center text-white drop-shadow">
                  <span className="text-xs font-medium text-slate-200">الجمعة، 15 أكتوبر</span>
                  <div className="text-3xl font-bold tracking-tight">09:41</div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 text-xs">
                <Smartphone className="w-8 h-8 mb-2 opacity-50" />
                <span>اضغط «توليد الخلفية» لرؤية المعاينة الحية فوراً</span>
              </div>
            )}
          </div>

          {generatedWallpaper && !isGenerating && (
            <div className="w-full max-w-xs mt-5 space-y-2">
              <button
                onClick={() => onDirectSet(generatedWallpaper)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>تعيين كخلفية لهاتفي مباشرة</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onPreview(generatedWallpaper)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>معاينة حية</span>
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  {saveSuccess ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{saveSuccess ? 'تم الحفظ!' : 'حفظ بالمكتبة'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
