import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, ShieldCheck, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already running as an installed standalone PWA app on device, hide
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span className="hidden md:inline">مثبت كتطبيق محلي</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
        title="تثبيت التطبيق على جهازك للعمل بدون إنترنت نهائياً"
      >
        <Download className="w-3.5 h-3.5" />
        <span>تثبيت تطبيق درايف</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowGuideModal(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold transition-all cursor-pointer"
        title="طريقة تثبيت درايف على الهاتف للعمل بدون نت"
      >
        {isIOS ? <Smartphone className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
        <span>تثبيت على الهاتف</span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>تثبيت درايف أوفلاين على الشاشة الرئيسية</span>
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 mb-6">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">⚡ ميزة التطبيق المثبت:</p>
                <p>يعمل 100% دون الحاجة إلى أي اتصال بالإنترنت، ويفتح كنافذة مستقلة وسريعة مثل تطبيقات النظام الأصلية.</p>
              </div>

              {isIOS ? (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                    <p>في متصفح Safari، اضغط على زر <strong>المشاركة (Share) ⎋</strong> أسفل الشاشة.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                    <p>اختر من القائمة <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen) ➕</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                    <p>اضغط <strong>"إضافة" (Add)</strong>، وسيظهر لك أيقونة درايف على شاشة هاتفك مباشرة.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                    <p>اضغط على قائمة المتصفح <strong>(ثلاث نقاط ⋮)</strong> في أعلى أو أسفل الشاشة.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                    <p>اختر <strong>"تثبيت التطبيق" (Install App)</strong> أو <strong>"إضافة للشاشة الرئيسية"</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                    <p>أكد التثبيت، وسيفتح معك التطبيق مباشرة في وضع الأوفلاين في أي وقت!</p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              فهمت، شكراً لك
            </button>
          </div>
        </div>
      )}
    </>
  );
};
