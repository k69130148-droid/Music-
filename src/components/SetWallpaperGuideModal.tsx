import React, { useState } from 'react';
import { X, Smartphone, Apple, Monitor, CheckCircle, Download, Share2, HelpCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDownloadCurrent?: () => void;
  wallpaperTitle?: string;
}

export const SetWallpaperGuideModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onDownloadCurrent,
  wallpaperTitle,
}) => {
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'desktop'>('android');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">كيف تعيّن الخلفية على جوالك بسهولة؟</h2>
              <p className="text-xs text-slate-400">خطوات بسيطة وسريعة لتطبيق أي خلفية خلال ثوانٍ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center gap-2 p-1 bg-slate-800/80 rounded-xl">
            <button
              onClick={() => setActivePlatform('android')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activePlatform === 'android'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>سامسونج وأندرويد</span>
            </button>
            <button
              onClick={() => setActivePlatform('ios')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activePlatform === 'ios'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>آيفون (Apple iOS)</span>
            </button>
            <button
              onClick={() => setActivePlatform('desktop')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activePlatform === 'desktop'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>الكمبيوتر</span>
            </button>
          </div>
        </div>

        {/* Guide Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-300 text-sm">
          {activePlatform === 'android' && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ★
                </span>
                <div>
                  <h4 className="text-sm font-bold text-amber-400">الطريقة المباشرة الأسرع:</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    اضغط زر <strong className="text-white">«تعيين كخلفية مباشرة»</strong> في التطبيق. سيفتح هاتفك قائمة المشاركة وبها خيار نظام أندرويد المباشر: <strong className="text-amber-300">«تعيين كخلفية»</strong>!
                  </p>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-400 tracking-wider">أو الطريقة اليدوية (خطوتين فقط):</h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                    ١
                  </div>
                  <div>
                    <p className="font-semibold text-white">تنزيل الصورة إلى هاتفك</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      اضغط على زر «تنزيل 4K»، وسيتم حفظ الصورة في الاستوديو وتطبيق «الصور».
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                    ٢
                  </div>
                  <div>
                    <p className="font-semibold text-white">فتح الصورة وخيارات التعيين</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      افتح الصورة من الاستوديو، واضغط زر الخيارات الإضافية (⋮ أو المزيد) في الزاوية، ثم اختر: <strong className="text-amber-400">«الضبط كخلفية»</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                    ٣
                  </div>
                  <div>
                    <p className="font-semibold text-white">اختيار شاشة القفل أو الرئيسية</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      حدد ما إذا كنت تريد تطبيقها على (شاشة القفل) أو (الشاشة الرئيسية) أو كلتيهما معاً.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                💡 <strong>حيلة سريعة في سامسونج:</strong> اضغط مطولاً على أي مساحة فارغة في شاشتك الرئيسية، ثم اختر «الخلفية والنمط» &larr; «تغيير الخلفيات» &larr; «الاستوديو».
              </div>
            </div>
          )}

          {activePlatform === 'ios' && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ★
                </span>
                <div>
                  <h4 className="text-sm font-bold text-amber-400">طريقة آبل آيفون السريعة:</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    اضغط زر <strong className="text-white">«تنزيل 4K»</strong> لحفظ الخلفية في تطبيق <strong className="text-white">«الصور» (Photos)</strong> بجودة كاملة.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                    ١
                  </div>
                  <div>
                    <p className="font-semibold text-white">فتح تطبيق «الصور» (Photos)</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      افتح الصورة المحفوظة واضغط على أيقونة المشاركة مربع بها سهم لأعلى (Share) في الزاوية السفلية.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                    ٢
                  </div>
                  <div>
                    <p className="font-semibold text-white">اختر «استخدام كخلفية شاشة»</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      مرر للأسفل واضغط على <strong className="text-amber-400">«استخدام كخلفية شاشة» (Use as Wallpaper)</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                    ٣
                  </div>
                  <div>
                    <p className="font-semibold text-white">تخصيص الساعة والضغط على «إضافة»</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      يمكنك تعديل لون الخط وحجم الساعة وإضافة ودجات ثم الضغط على «تعيين كزوج خلفيات» أو تخصيص الشاشة الرئيسية.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                💡 <strong>حيلة شاشة القفل:</strong> في شاشة قفل الآيفون، اضغط مطولاً في أي مكان ثم اضغط علامة (+) لإضافة خلفية جديدة مباشرة من الصور.
              </div>
            </div>
          )}

          {activePlatform === 'desktop' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                    ١
                  </div>
                  <div>
                    <p className="font-semibold text-white">تنزيل الصورة بأعلى دقة</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      اضغط زر التنزيل لحفظ ملف الخلفية في مجلد التنزيلات (Downloads).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                    ٢
                  </div>
                  <div>
                    <p className="font-semibold text-white">تعيين كخلفية لسطح المكتب</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      انقر بالزر الأيمن للفأرة (Right-Click) على الصورة المحفوظة واختر <strong className="text-amber-400">«Set as desktop background» (تعيين كخلفية لسطح المكتب)</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            إغلاق الدليل
          </button>
          {onDownloadCurrent && (
            <button
              onClick={() => {
                onDownloadCurrent();
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/10 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تنزيل {wallpaperTitle || 'الخلفية'} الآن</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
