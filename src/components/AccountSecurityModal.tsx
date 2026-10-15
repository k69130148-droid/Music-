import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  Smartphone, 
  KeyRound, 
  Check, 
  Copy, 
  FileKey, 
  RefreshCw, 
  Lock, 
  Save, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { AccountProfile } from '../types/drive';
import { driveDb } from '../services/driveDb';
import { triggerConfetti } from '../utils/formatters';

interface AccountSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
}

export const AccountSecurityModal: React.FC<AccountSecurityModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+970');
  const [currentPin, setCurrentPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');

  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [isSendingTestSms, setIsSendingTestSms] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      const p = await driveDb.getAccountProfile();
      const pin = await driveDb.getSetting<string | null>('vault_pin', null);
      setProfile(p);
      setName(p.name);
      setEmail(p.email || '');
      setPhone(p.phone);
      setCountryCode(p.countryCode || '+970');
      setCurrentPin(pin || '');
    };

    loadData();
  }, [isOpen]);

  if (!isOpen || !profile) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(profile.recoveryKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSendTestSms = async () => {
    if (!phone.trim()) {
      setStatusMsg({ text: 'يرجى إدخال رقم الهاتف أولاً.', type: 'error' });
      return;
    }

    setIsSendingTestSms(true);
    try {
      const fullPhone = phone.startsWith('+') ? phone : `${countryCode}${phone}`;
      await driveDb.generatePhoneOtp(fullPhone);
      setStatusMsg({ text: 'تم إرسال رسالة SMS تجريبية إلى هاتفك بنجاح!', type: 'success' });
    } catch {
      setStatusMsg({ text: 'فشل إرسال الرسالة.', type: 'error' });
    } finally {
      setIsSendingTestSms(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await driveDb.saveAccountProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        countryCode,
        isPhoneVerified: true,
      });

      if (newPin.trim().length === 4) {
        await driveDb.setSetting('vault_pin', newPin.trim());
      }

      setStatusMsg({ text: 'تم حفظ إعدادات الأمان ورقم الهاتف بنجاح!', type: 'success' });
      triggerConfetti();
      onProfileUpdated();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch {
      setStatusMsg({ text: 'حدث خطأ أثناء الحفظ.', type: 'error' });
    }
  };

  const handleGenerateNewKey = async () => {
    const randomBlock = () => Math.floor(1000 + Math.random() * 9000).toString();
    const newKey = `DRIVE-${randomBlock()}-${randomBlock()}-${randomBlock()}`;
    const updated = await driveDb.saveAccountProfile({ recoveryKey: newKey });
    setProfile(updated);
    setStatusMsg({ text: 'تم إنشاء مفتاح استرداد جديد، تأكد من حفظه بمكان آمن!', type: 'success' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                أمان الحساب ورقم هاتف الاسترداد
              </h3>
              <p className="text-[11px] text-slate-500">حماية حسابك وصورك من الفقدان</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProfile} className="p-6 space-y-4 overflow-y-auto">
          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {statusMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Account Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اسم الحساب:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-slate-100 dark:bg-slate-800 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>

          {/* Account Email (Google / Display Email) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              البريد الإلكتروني للحساب (Google / Email):
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full text-xs bg-slate-100 dark:bg-slate-800 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
            />
          </div>

          {/* Recovery Phone Number */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>رقم هاتف الاسترداد:</span>
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>موثق للاسترداد</span>
              </span>
            </div>

            <div className="flex gap-2" dir="ltr">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-28 text-xs bg-slate-100 dark:bg-slate-800 py-2.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="+970">🇵🇸 +970</option>
                <option value="+972">🇵🇸 +972</option>
                <option value="+966">🇸🇦 +966</option>
                <option value="+20">🇪🇬 +20</option>
                <option value="+962">🇯🇴 +962</option>
                <option value="+971">🇦🇪 +971</option>
              </select>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="059xxxxxxx"
                className="flex-1 text-xs bg-slate-100 dark:bg-slate-800 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              في حال فقدان الحساب أو نسيان رمز PIN، ستصلك رسالة SMS فورية على هذا الرقم لاستعادة الحساب.
            </p>

            <button
              type="button"
              onClick={handleSendTestSms}
              disabled={isSendingTestSms}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 pt-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>إرسال رسالة SMS تجريبية إلى هاتفي</span>
            </button>
          </div>

          {/* Change PIN */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>رمز PIN لقفل الخزنة والحساب:</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">الرمز الحالي:</span>
                <input
                  type="text"
                  disabled
                  value={currentPin ? '••••' : 'لم يتم التعيين'}
                  className="w-full text-xs bg-slate-100 dark:bg-slate-800/50 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 font-mono text-center"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">تعيين رمز جديد (4 أرقام):</span>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="رمز جديد"
                  className="w-full text-xs bg-slate-100 dark:bg-slate-800 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Emergency Key */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileKey className="w-3.5 h-3.5 text-amber-500" />
                <span>مفتاح استرداد الطوارئ:</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateNewKey}
                className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                title="توليد مفتاح جديد"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>تحديث</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs">
              <span className="font-bold tracking-wider text-slate-800 dark:text-slate-200">
                {profile.recoveryKey}
              </span>
              <button
                type="button"
                onClick={handleCopyKey}
                className="p-1 text-slate-500 hover:text-blue-600 transition"
                title="نسخ مفتاح الطوارئ"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              احتفظ بهذا المفتاح، فهو يتيح لك استعادة الحساب والصور حتى بدون توفر شريحة الهاتف.
            </p>
          </div>

          {/* Footer Action */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
