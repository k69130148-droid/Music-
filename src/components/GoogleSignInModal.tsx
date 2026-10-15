import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Image as ImageIcon, 
  LogOut, 
  Mail, 
  User, 
  Sparkles,
  ArrowRight,
  Archive,
  Download
} from 'lucide-react';
import { AccountProfile } from '../types/drive';
import { driveDb } from '../services/driveDb';
import { triggerConfetti, downloadBlob } from '../utils/formatters';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AccountProfile | null;
  onProfileUpdated: () => void;
  userPhotosCount: number;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
  userPhotosCount,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<string>(
    profile?.email || 'k69130148@gmail.com'
  );
  const [customName, setCustomName] = useState<string>(
    profile?.name || 'k69130148'
  );
  const [isSwitchingAccount, setIsSwitchingAccount] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const isSignedIn = !!profile?.isSignedInWithGoogle;
  const currentEmail = profile?.email || 'k69130148@gmail.com';
  const currentName = profile?.name || 'k69130148';

  const handleSignIn = async (emailToUse: string, nameToUse?: string) => {
    setLoading(true);
    try {
      await driveDb.signInWithGoogleAccount(
        emailToUse,
        nameToUse || emailToUse.split('@')[0]
      );
      triggerConfetti();
      onProfileUpdated();
      setIsSwitchingAccount(false);
      setTimeout(() => {
        onClose();
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await driveDb.signOutGoogleAccount();
      onProfileUpdated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {/* Google G Logo SVG */}
            <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center p-1.5 shrink-0">
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <span>تسجيل الدخول بحساب Google</span>
              </h3>
              <p className="text-[11px] text-slate-500">حفظ صورك وإدارتها تحت حسابك الشخصي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isSignedIn && !isSwitchingAccount ? (
            /* Signed in view */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-100 dark:border-slate-700/80 space-y-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-blue-500/20 uppercase">
                    {currentEmail.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {currentName}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        <Check className="w-3 h-3" />
                        <span>نشط</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                      {currentEmail}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-100/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>الصور المحفوظة في هذا الحساب:</span>
                  </span>
                  <span className="font-bold font-mono text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-lg border border-blue-100 dark:border-slate-700">
                    {userPhotosCount} صورة
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>أمان وحفظ دائم</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  صورك محفوظة ومربوطة بحسابك هذا، مع طلب تثبيت التخزين الدائم لمنع المتصفح من مسحها تلقائياً.
                </p>
              </div>

              {/* Backup & Keep Safe Section */}
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200/70 dark:border-blue-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <Archive className="w-3.5 h-3.5 text-blue-600" />
                    <span>النسخ الاحتياطي وحماية الصور</span>
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">100% جودة كاملة</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  احتفظ بنسخة من صور حسابك كاملة بجودتها الأصلية لتضمن بقائها دائماً حتى بعد مسح بيانات الموقع أو تبديل جهازك.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const zipBlob = await driveDb.exportAllPhotosZip();
                      downloadBlob(zipBlob, `${currentEmail.split('@')[0]}_google_photos_backup.zip`);
                      triggerConfetti();
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading || userPhotosCount === 0}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل نسخة احتياطية كاملة لصور حسابك (ZIP)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSwitchingAccount(true)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>تبديل الحساب</span>
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign in form / account chooser */
            <div className="space-y-4">
              {/* Quick Google Account Card */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  اختر حساب Google للمتابعة:
                </label>

                {/* Primary Suggested Account */}
                <button
                  type="button"
                  onClick={() => handleSignIn('k69130148@gmail.com', 'k69130148')}
                  disabled={loading}
                  className="w-full text-right p-3.5 rounded-2xl border-2 border-blue-500/40 hover:border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      K
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>k69130148</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 rounded-md">حسابك</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        k69130148@gmail.com
                      </div>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center transition">
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </button>
              </div>

              {/* Or enter another Google account */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold">
                    أو تسجيل الدخول بحساب آخر
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    بريد حساب Google:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={selectedEmail}
                      onChange={(e) => setSelectedEmail(e.target.value)}
                      placeholder="username@gmail.com"
                      className="w-full text-xs font-mono bg-slate-100 dark:bg-slate-800 pr-9 pl-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    الاسم المعروض (اختياري):
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="اسمك أو كنيتك"
                      className="w-full text-xs bg-slate-100 dark:bg-slate-800 pr-9 pl-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Google Sign In Submit Button */}
                <button
                  type="button"
                  onClick={() => handleSignIn(selectedEmail, customName)}
                  disabled={loading || !selectedEmail.trim()}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 shadow-sm flex items-center justify-center gap-2.5 transition cursor-pointer disabled:opacity-50"
                >
                  <svg viewBox="0 0 48 48" className="w-4 h-4">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>تسجيل الدخول والمتابعة بحساب Google هذا</span>
                </button>
              </div>

              {isSwitchingAccount && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setIsSwitchingAccount(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                  >
                    إلغاء والعودة للحساب الحالي
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
