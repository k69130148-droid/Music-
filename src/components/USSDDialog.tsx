import React, { useState } from 'react';
import { USSDCode, SimCard } from '../types/phone';
import { Radio, X, Check, Copy } from 'lucide-react';

interface USSDDialogProps {
  ussd: {
    code: string;
    response: string;
    simId: 'sim1' | 'sim2';
  };
  simCards: SimCard[];
  onClose: () => void;
  onSendResponse?: (replyCode: string) => void;
}

export const USSDDialog: React.FC<USSDDialogProps> = ({
  ussd,
  simCards,
  onClose,
}) => {
  const [replyInput, setReplyInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([ussd.response]);
  const [copied, setCopied] = useState<boolean>(false);

  const activeSim = simCards.find(s => s.id === ussd.simId) || simCards[0];
  const isImei = ussd.code.includes('06');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    // Simulate telco response to choice
    const val = replyInput.trim();
    let replyFeedback = `تم استلام خيارك (${val}). الخدمة قيد المعالجة بنجاح وسوف تصلك رسالة تأكيد.`;
    if (val === '1') {
      replyFeedback = 'تم تنفيذ الخيار رقم 1: تجديد الباقة الشهرية بنجاح.';
    } else if (val === '2') {
      replyFeedback = 'قائمة الخدمات الإضافية: \n1. باقات التجوال \n2. نقاط المكافآت \n3. الدعم الفني';
    }

    setHistory(prev => [...prev, `> ${val}`, replyFeedback]);
    setReplyInput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(history[history.length - 1]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-sm w-full p-5 text-slate-100 overflow-hidden">
        {/* Carrier Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeSim.color }}
            />
            <span className="font-semibold text-sm text-slate-200">
              {activeSim.carrierName} ({ussd.simId === 'sim1' ? 'شريحة 1' : 'شريحة 2'})
            </span>
          </div>
          <span className="font-mono text-xs text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40 dir-ltr">
            {ussd.code}
          </span>
        </div>

        {/* Content Box */}
        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 mb-4 max-h-60 overflow-y-auto font-mono text-xs leading-relaxed whitespace-pre-line text-slate-200">
          {history.map((line, idx) => (
            <p key={idx} className={line.startsWith('>') ? 'text-amber-400 font-bold my-1' : 'text-slate-300'}>
              {line}
            </p>
          ))}

          {/* Barcode Graphic for IMEI */}
          {isImei && (
            <div className="mt-4 pt-3 border-t border-slate-800 text-center flex flex-col items-center">
              <div className="h-10 w-48 bg-white p-1 rounded flex items-center justify-center gap-0.5">
                {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2].map((w, i) => (
                  <span
                    key={i}
                    className="h-full bg-black inline-block"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-mono tracking-widest">
                VERIFIED IMEI REGISTRATION
              </span>
            </div>
          )}
        </div>

        {/* Interactive Response Input */}
        <form onSubmit={handleSend} className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="اكتب ردك أو رقم الخيار..."
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
            {replyInput && (
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-xl text-white transition-colors"
              >
                إرسال
              </button>
            )}
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-xs font-semibold text-slate-100 transition-colors"
          >
            موافق
          </button>
        </div>
      </div>
    </div>
  );
};
