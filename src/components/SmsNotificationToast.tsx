import React, { useState, useEffect } from 'react';
import { MessageSquare, Copy, Check, X, ShieldAlert } from 'lucide-react';

interface SmsData {
  sender: string;
  phone: string;
  code: string;
  text: string;
  timestamp: number;
}

export const SmsNotificationToast: React.FC = () => {
  const [sms, setSms] = useState<SmsData | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const handleSms = (e: Event) => {
      const customEvent = e as CustomEvent<SmsData>;
      if (customEvent.detail) {
        setSms(customEvent.detail);
        setCopied(false);
      }
    };

    window.addEventListener('drive:sms_received', handleSms);
    return () => window.removeEventListener('drive:sms_received', handleSms);
  }, []);

  useEffect(() => {
    if (!sms) return;
    const timer = setTimeout(() => {
      setSms(null);
    }, 18000);
    return () => clearTimeout(timer);
  }, [sms]);

  if (!sms) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(sms.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed top-4 inset-x-4 sm:right-6 sm:left-auto sm:w-96 z-50 animate-fade-in">
      <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white p-4 rounded-2xl shadow-2xl border border-blue-500/40 backdrop-blur-md">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-tight">رسالة SMS من Google Drive</span>
              <span className="text-[10px] text-blue-400 block -mt-0.5">رمز استرداد الحساب</span>
            </div>
          </div>
          <button
            onClick={() => setSms(null)}
            className="p-1 rounded-md text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Body */}
        <div className="space-y-2 text-xs">
          <p className="text-slate-300 leading-relaxed">
            رمز التحقق لاسترداد حسابك في درايف هو:
          </p>

          <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-xl border border-slate-700/60">
            <span className="font-mono text-lg font-black text-amber-400 tracking-widest">
              {sms.code}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-[11px] font-bold transition active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرمز'}</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
            <span>صالح للاستخدام لمرة واحدة لمدة 10 دقائق</span>
          </p>
        </div>
      </div>
    </div>
  );
};
