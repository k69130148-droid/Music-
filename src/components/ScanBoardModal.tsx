import React, { useState, useRef } from 'react';
import {
  Upload,
  Sparkles,
  X,
  FileText,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Lightbulb,
  AlertCircle,
  Replace,
  PlusCircle,
  Check,
  ArrowRight,
  BookOpen,
  Brain,
  HelpCircle,
  Languages,
} from 'lucide-react';
import { scanBoardOrPaper, prepareImageForAi, ScanBoardResult, analyzeBoardOffline, requestAiAssist } from '../services/aiVisionService';

interface ScanBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToNote: (data: {
    title: string;
    content: string;
    subject: string;
    backgroundId: string;
    mode: 'replace' | 'append';
  }) => void;
}

export const ScanBoardModal: React.FC<ScanBoardModalProps> = ({
  isOpen,
  onClose,
  onApplyToNote,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanBoardResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [applyMode, setApplyMode] = useState<'replace' | 'append'>('replace');
  const [hasAutoApplied, setHasAutoApplied] = useState<boolean>(false);
  const [aiAssistLoading, setAiAssistLoading] = useState<string | null>(null);
  const [aiAssistResult, setAiAssistResult] = useState<{ type: string; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAiAssistAction = async (action: 'explain' | 'quiz' | 'translate') => {
    if (!scanResult || !scanResult.content) return;
    setAiAssistLoading(action);
    try {
      const resultText = await requestAiAssist(
        action,
        scanResult.content,
        scanResult.title,
        scanResult.subject
      );
      
      setAiAssistResult({ type: action, text: resultText });

      // Append AI assist insights directly to note content
      const updatedContent = `${scanResult.content}\n\n──────────────\n${
        action === 'explain' ? '🧠 **الشرح والتبسيط العلمي:**' : action === 'quiz' ? '📝 **أسئلة واختبارات المراجعة الذاتية:**' : '🌐 **الترجمة المزدوجة:**'
      }\n${resultText}`;

      setScanResult({
        ...scanResult,
        content: updatedContent,
      });

      onApplyToNote({
        title: scanResult.title,
        content: updatedContent,
        subject: scanResult.subject,
        backgroundId: scanResult.suggestedBackgroundId,
        mode: 'replace',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'تعذر الحصول على المساعدة من الذكاء الاصطناعي');
    } finally {
      setAiAssistLoading(null);
    }
  };

  // Process file upload or camera capture: Real AI Vision OCR with Auto Organization and Note Insertion
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setScanResult(null);
    setHasAutoApplied(false);
    setIsScanning(true);

    try {
      // 1. Prepare and optimize image preserving crisp text for AI OCR
      const { base64, mimeType } = await prepareImageForAi(file);
      setSelectedImage(base64);

      // 2. Run real AI Vision extraction & organization (with offline fallback built-in)
      const res = await scanBoardOrPaper(base64, mimeType);
      setScanResult(res);

      // 3. Immediately apply to note with organized content
      onApplyToNote({
        title: res.title || 'ملاحظة اللوح المدرسي',
        content: res.content || '',
        subject: res.subject || 'عام',
        backgroundId: res.suggestedBackgroundId || 'math',
        mode: applyMode,
      });
      setHasAutoApplied(true);
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMsg(
        err?.message || 'تعذر استخراج النصوص من الصورة حالياً. يرجى التأكد من وضوح الصورة وإعادة المحاولة.'
      );
    } finally {
      setIsScanning(false);
      if (e.target) e.target.value = '';
    }
  };

  // Generate quick sample document & text images via Canvas for immediate 1-tap testing
  const generateSampleImageAndScan = async (type: 'book' | 'notes' | 'math' | 'quiz') => {
    setErrorMsg(null);
    setScanResult(null);
    setHasAutoApplied(false);
    setIsScanning(true);

    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsScanning(false);
      return;
    }

    let detectedHint = 'عام';

    if (type === 'book') {
      ctx.fillStyle = '#faf8f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#e2d9cc';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      ctx.fillStyle = '#292524';
      ctx.font = 'bold 34px serif';
      ctx.textAlign = 'right';
      ctx.direction = 'rtl';
      ctx.fillText('الفصل الرابع: قوة التركيز وبناء العادات اليومية', 840, 85);

      ctx.font = '22px serif';
      ctx.fillStyle = '#44403c';
      ctx.fillText('إن النجاح الحقيقي لا يتحقق بضربة واحدة، بل هو تراكم لقرارات صغيرة تتكرر كل يوم.', 840, 150);
      ctx.fillText('حين تجعل القراءة والتعلم عادة يومية ثابتة، فإن أثرها التراكمي يغير مجرى حياتك.', 840, 200);
      
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 24px serif';
      ctx.fillText('« السر في مستقبلك مخبأ في روتينك اليومي »', 840, 280);

      ctx.fillStyle = '#44403c';
      ctx.font = '22px serif';
      ctx.fillText('• الخطوة الأولى: حدد هدفاً واضحاً ومكتوباً بدقة.', 840, 350);
      ctx.fillText('• الخطوة الثانية: قسّم الهدف الكبير إلى خطوات صغيرة لا تتجاوز ربع ساعة.', 840, 400);
      ctx.fillText('• الخطوة الثالثة: حافظ على الاستمرارية وتجنب الانقطاع ليومين متتاليين.', 840, 450);

      detectedHint = 'كتب وقراءة';
    } else if (type === 'notes') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 8;
      ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'right';
      ctx.direction = 'rtl';
      ctx.fillText('مفكرة المهام الأسبوعية وخطة الإنجاز ✍️', 840, 80);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '24px sans-serif';
      ctx.fillText('١. إكمال مراجعة المشروع وإرسال التقرير النهائي قبل الساعة ٤ مساءً.', 840, 150);
      ctx.fillText('٢. حضور الاجتماع مع الفريق لمناقشة أهداف الربع القادم.', 840, 210);
      ctx.fillText('٣. قراءة ٢٠ صفحة من كتاب «التفكير السريع والبطيء».', 840, 270);
      ctx.fillText('٤. شراء المستلزمات المكتبية ومراجعة قائمة المصاريف.', 840, 330);
      ctx.fillText('٥. ممارسة الرياضة لمدة ٤٥ دقيقة وشرب لترين من الماء.', 840, 390);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('ملاحظة هامة: التركيز على المهمة الأولى أولاً دون تشتت.', 840, 470);

      detectedHint = 'مهام ومشاريع';
    } else if (type === 'math') {
      ctx.fillStyle = '#0f3822';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1e5235';
      ctx.lineWidth = 14;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'right';
      ctx.direction = 'rtl';
      ctx.fillText('معادلات وقوانين علمية: التفاضل والطاقة', 840, 75);

      ctx.font = '24px sans-serif';
      ctx.fillText('١. قانون مشتقة الدالة الأسية: d/dx (xⁿ) = n · xⁿ⁻¹', 840, 145);
      ctx.fillText('٢. طاقة الحركة الكلية: KE = ½ · m · v²', 840, 205);
      ctx.fillText('٣. طاقة الوضع الثقالية: PE = m · g · h (حيث g = 9.8 m/s²)', 840, 265);
      ctx.fillText('٤. مثال محلول: مشتقة f(x) = 4x³ + 2x - 5 هي 12x² + 2', 840, 330);
      ctx.fillText('٥. تذكير: ثابت الجاذبية الأرضية والكسور تظل كما هي دون تقريب.', 840, 400);

      detectedHint = 'الرياضيات';
    } else {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#3730a3';
      ctx.lineWidth = 10;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'right';
      ctx.direction = 'rtl';
      ctx.fillText('ورقة اختبار ومراجعة: أسئلة اختيار من متعدد', 840, 75);

      ctx.fillStyle = '#ffffff';
      ctx.font = '23px sans-serif';
      ctx.fillText('س١: ما هي عاصمة الدولة الأموية في الأندلس؟', 840, 140);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText('    (أ) غرناطة      (ب) قرطبة      (ج) إشبيلية      (د) طليطلة', 840, 185);

      ctx.fillStyle = '#ffffff';
      ctx.fillText('س٢: أي من العناصر التالية يعتبر فلزاً قلوياً؟', 840, 260);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText('    (أ) الصوديوم Na   (ب) الكلور Cl   (ج) الأكسجين O   (د) النيتروجين N', 840, 305);

      ctx.fillStyle = '#ffffff';
      ctx.fillText('س٣: وحدة قياس القوة في النظام الدولي هي:', 840, 380);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText('    (أ) الجول      (ب) الواط      (ج) النيوتن      (د) الباسكال', 840, 425);

      detectedHint = 'عام';
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
    setSelectedImage(dataUrl);

    try {
      const res = await scanBoardOrPaper(dataUrl, 'image/jpeg', detectedHint);
      setScanResult(res);

      onApplyToNote({
        title: res.title || 'ملاحظة مفرغة',
        content: res.content || '',
        subject: res.subject || 'عام',
        backgroundId: res.suggestedBackgroundId || 'notebook_paper',
        mode: applyMode,
      });
      setHasAutoApplied(true);
    } catch (err: any) {
      console.error('Sample scan error:', err);
      setErrorMsg(err.message || 'تعذر تحليل النموذج بالذكاء الاصطناعي.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyNow = () => {
    if (!scanResult) return;
    onApplyToNote({
      title: scanResult.title || 'ملاحظة مفرغة',
      content: scanResult.content || '',
      subject: scanResult.subject || 'عام',
      backgroundId: scanResult.suggestedBackgroundId || 'notebook_paper',
      mode: applyMode,
    });
    setHasAutoApplied(true);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setScanResult(null);
    setErrorMsg(null);
    setIsScanning(false);
    setHasAutoApplied(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 dir-rtl">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
              <Upload className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-100 text-sm sm:text-base">
                  قارئ ومفرغ الصور والمستندات الذكي
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>لكافة الصور والنصوص</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                استخراج فوري للنصوص بدقة فائقة: سبورة ولوح، صفحات كتب ومراجع، لافتات وجدران، أوراق ومذكرات
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-slate-200 text-sm scrollbar-none">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold">{errorMsg}</p>
                <p className="text-[10.5px] text-red-300/80 mt-0.5">
                  يرجى التأكد من وضوح الصورة لتفريغ النص بدقة عالية.
                </p>
              </div>
            </div>
          )}

          {/* STEP 1: Select Image from Studio / Device */}
          {!selectedImage && !isScanning && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-800/90 via-slate-850 to-slate-800 border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 text-slate-100 flex flex-col items-center justify-center gap-3 text-center transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/10 active:scale-[0.99] cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
                  <Upload className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-lg sm:text-xl text-white">
                    رفع أي صورة تحتوي على نصوص أو كتابة
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm">
                    صفحات كتب، مقالات، مذكرات بخط اليد، أوراق، دفاتر، فواتير، اقتباسات، أو لوحات
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    يدعم JPG, PNG, WEBP, HEIC
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-700/60 text-slate-300 border border-slate-600/50">
                    دقة وقراءة حرفية فورية
                  </span>
                </div>
              </button>

              {/* Hidden Input for Gallery Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* One-Tap Instant Test Samples */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-300">
                    أو جرّب التحليل والتفريغ الفوري على نماذج متنوعة:
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => generateSampleImageAndScan('book')}
                    className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-750 border border-slate-700/80 hover:border-amber-500/50 text-center transition active:scale-95 cursor-pointer text-xs"
                  >
                    <span className="text-xl block mb-1">📖</span>
                    <span className="font-bold text-slate-200">صفحة كتاب / مقال</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">عناوين واقتباسات</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => generateSampleImageAndScan('notes')}
                    className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-750 border border-slate-700/80 hover:border-cyan-500/50 text-center transition active:scale-95 cursor-pointer text-xs"
                  >
                    <span className="text-xl block mb-1">✍️</span>
                    <span className="font-bold text-slate-200">مذكرة / مهام</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">نقاط وخطوات</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => generateSampleImageAndScan('math')}
                    className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-750 border border-slate-700/80 hover:border-emerald-500/50 text-center transition active:scale-95 cursor-pointer text-xs"
                  >
                    <span className="text-xl block mb-1">📐</span>
                    <span className="font-bold text-slate-200">معادلات وقوانين</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">أسس وكسور ورموز</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => generateSampleImageAndScan('quiz')}
                    className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-750 border border-slate-700/80 hover:border-purple-500/50 text-center transition active:scale-95 cursor-pointer text-xs"
                  >
                    <span className="text-xl block mb-1">📝</span>
                    <span className="font-bold text-slate-200">اختبار وأسئلة</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">خيارات (أ، ب، ج، د)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Live Scanning In Progress */}
          {isScanning && (
            <div className="space-y-4 text-center py-6">
              {selectedImage && (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-black/60 aspect-[16/10] max-h-48 mx-auto flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Scanning"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-emerald-500/15 flex flex-col items-center justify-center pointer-events-none">
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_20px_#10b981] animate-bounce" />
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
                <h4 className="font-black text-slate-100 text-sm sm:text-base">
                  جاري قراءة وتفريغ نصوص الصورة بدقة وترتيبها...
                </h4>
                <p className="text-xs text-slate-400">
                  قراءة حرفية أمينة لكافة النصوص والكلمات والأرقام والتنسيقات
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Scan Complete - Review & Confirm */}
          {scanResult && !isScanning && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Success Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between gap-2.5 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0 font-black">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className="font-black text-sm text-emerald-300">
                      تم تفريغ وترتيب محتوى الصورة بدقة في ملاحظتك!
                    </h5>
                    <p className="text-[11px] text-emerald-400/90 mt-0.5">
                      نقل حرفي لكامل الكلمات، العناوين، الأرقام، والرموز باللغة الأصلية دون تعديل.
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black flex-shrink-0 ${
                  scanResult.isOffline
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {scanResult.isOffline ? '⚡ بدون نت (أوفلاين)' : '✨ أحدث ذكاء اصطناعي'}
                </span>
              </div>

              {/* Extracted Note Details */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      العنوان المنظم:
                    </span>
                    <h4 className="font-black text-slate-100 text-sm sm:text-base">
                      {scanResult.title}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-800 text-cyan-300 border border-slate-700 flex-shrink-0">
                    {scanResult.subject}
                  </span>
                </div>

                {/* Content Box */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">
                    المحتوى المنظم المكتوب في ملاحظتك:
                  </span>
                  <div className="max-h-52 overflow-y-auto p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans select-text scrollbar-thin">
                    {scanResult.content}
                  </div>
                </div>

                {/* AI Study Assistant Tools Toolbar */}
                <div className="pt-1 border-t border-slate-800/80">
                  <span className="text-[10.5px] font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                    <Brain className="w-3.5 h-3.5 text-emerald-400" />
                    <span>مساعد الذكاء الاصطناعي للملاحظة:</span>
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled={!!aiAssistLoading}
                      onClick={() => handleAiAssistAction('explain')}
                      className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-750 hover:border-emerald-500/50 text-slate-200 hover:text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {aiAssistLoading === 'explain' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      ) : (
                        <Brain className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>🧠 اشرح الشرح</span>
                    </button>

                    <button
                      type="button"
                      disabled={!!aiAssistLoading}
                      onClick={() => handleAiAssistAction('quiz')}
                      className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-750 hover:border-purple-500/50 text-slate-200 hover:text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {aiAssistLoading === 'quiz' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                      ) : (
                        <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span>📝 أسئلة اختبار</span>
                    </button>

                    <button
                      type="button"
                      disabled={!!aiAssistLoading}
                      onClick={() => handleAiAssistAction('translate')}
                      className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-750 hover:border-cyan-500/50 text-slate-200 hover:text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {aiAssistLoading === 'translate' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      ) : (
                        <Languages className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                      <span>🌐 ترجمة الملاحظة</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Insertion Mode Option */}
              <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">طريقة كتابة المحتوى بالملاحظة:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setApplyMode('replace');
                      onApplyToNote({
                        title: scanResult.title,
                        content: scanResult.content,
                        subject: scanResult.subject,
                        backgroundId: scanResult.suggestedBackgroundId,
                        mode: 'replace',
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1 text-[11px] ${
                      applyMode === 'replace'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-700/70 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Replace className="w-3.5 h-3.5" />
                    <span>تفريغ كامل للملاحظة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setApplyMode('append');
                      onApplyToNote({
                        title: scanResult.title,
                        content: scanResult.content,
                        subject: scanResult.subject,
                        backgroundId: scanResult.suggestedBackgroundId,
                        mode: 'append',
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1 text-[11px] ${
                      applyMode === 'append'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-slate-700/70 text-slate-300 hover:text-white'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>إضافة لنهاية الملاحظة</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-xl shadow-emerald-500/25 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>تم! عرض الملاحظة والكتابة ✍️</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  صورة أخرى
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
