import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  X, 
  ArrowRight, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Loader2,
  FileKey
} from 'lucide-react';
import { driveDb } from '../services/driveDb';
import { AccountProfile } from '../types/drive';
import { triggerConfetti } from '../utils/formatters';

interface AccountRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecoverySuccess: () => void;
}

export const AccountRecoveryModal: React.FC<AccountRecoveryModalProps> = ({
  isOpen,
  onClose,
  onRecoverySuccess,
}) => {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [step, setStep] = useState<'input_phone' | 'verify_otp' | 'set_new_pin' | 'use_key'>('input_phone');
  
  // Phone input
  const [countryCode, setCountryCode] = useState<string>('+970');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  
  // OTP input (6 digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New PIN input
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');

  // Emergency Key fallback
  const [recoveryKeyInput, setRecoveryKeyInput] = useState<string>('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load account profile on open
  useEffect(() => {
    if (!isOpen) {
      setStep('input_phone');
      setErrorMsg(null);
      setOtpDigits(['', '', '', '', '', '']);
      setNewPin('');
      setConfirmPin('');
      setRecoveryKeyInput('');
      return;
    }

    const loadProfile = async () => {
      const p = await driveDb.getAccountProfile();
      setProfile(p);
      if (p.phone) {
        setPhoneNumber(p.phone);
        setCountryCode(p.countryCode || '+970');
      }
    };

    loadProfile();
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Masked registered phone for hints
  const getMaskedPhone = () => {
    if (!profile?.phone) return '••••••';
    const clean = profile.phone;
    if (clean.length > 4) {
      return clean.slice(0, 3) + '••••' + clean.slice(-3);
    }
    return '••••';
  };

  // Step 1: Send SMS OTP
  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      setErrorMsg('يرجى إدخال رقم هاتفك المسجل.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const fullPhone = phoneNumber.startsWith('+') ? phoneNumber : `${countryCode}${phoneNumber}`;
      await driveDb.generatePhoneOtp(fullPhone);
      setResendCooldown(60);
      setStep('verify_otp');
      // Focus first OTP input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء إرسال رمز التحقق. يرجى المحاولة ثانية.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP cell input
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newArr = [...otpDigits];
    newArr[index] = digit;
    setOtpDigits(newArr);
    setErrorMsg(null);

    // Auto-focus next cell
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If filled 6 digits, auto submit
    if (digit && index === 5 && newArr.every((d) => d !== '')) {
      handleVerifyCode(newArr.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newArr = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newArr[i] = pasted[i];
    }
    setOtpDigits(newArr);

    if (pasted.length === 6) {
      handleVerifyCode(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleVerifyCode = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setErrorMsg('يرجى إدخال رمز التحقق المكون من 6 أرقام بالكامل.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const fullPhone = phoneNumber.startsWith('+') ? phoneNumber : `${countryCode}${phoneNumber}`;
    const isValid = await driveDb.verifyPhoneOtp(fullPhone, code);

    setIsLoading(false);
    if (isValid) {
      setStep('set_new_pin');
    } else {
      setErrorMsg('رمز التحقق غير صحيح أو انتهت صلاحيته. يرجى التأكد من الرمز المدخل.');
    }
  };

  // Step 3: Set New PIN
  const handleSetNewPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      setErrorMsg('رمز PIN الجديد يجب أن يتكون من 4 أرقام.');
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMsg('رمزا PIN غير متطابقين.');
      return;
    }

    setIsLoading(true);
    try {
      await driveDb.setSetting('vault_pin', newPin);
      await driveDb.saveAccountProfile({
        phone: phoneNumber,
        isPhoneVerified: true,
      });

      triggerConfetti();
      onRecoverySuccess();
      onClose();
    } catch (err) {
      setErrorMsg('فشل حفظ الرمز الجديد.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step Fallback: Emergency Key
  const handleRecoverWithKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryKeyInput.trim()) {
      setErrorMsg('يرجى إدخال مفتاح الطوارئ.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const res = await driveDb.recoverAccountWithKey(recoveryKeyInput);
    setIsLoading(false);

    if (res.success) {
      setStep('set_new_pin');
    } else {
      setErrorMsg(res.error || 'مفتاح الاسترداد غير صحيح.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                استرداد الحساب عبر التحقق برقم الهاتف
              </h3>
              <p className="text-[11px] text-slate-500">حماية واسترجاع الوصول لصورك بدون نت</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Switcher Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setStep('use_key');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              step === 'use_key'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileKey className="w-3.5 h-3.5" />
            <span>رمز الطوارئ (DRIVE-...)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('input_phone');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              step === 'input_phone' || step === 'verify_otp'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>التحقق برقم الهاتف (SMS)</span>
          </button>
        </div>

        {/* Content Stages */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STAGE 1: ENTER PHONE NUMBER */}
          {step === 'input_phone' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  تأكيد رقم الهاتف المسجل
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  أدخل رقم هاتفك لاستلام رمز تحقق فوري (SMS) وإثبات ملكية الحساب.
                </p>
              </div>

              {profile?.phone && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
                  <span className="font-bold">رقم الاسترداد المسجل مسبقاً:</span>{' '}
                  <span className="font-mono font-bold" dir="ltr">{getMaskedPhone()}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  رقم الهاتف:
                </label>
                <div className="flex gap-2" dir="ltr">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-28 text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="+970">🇵🇸 +970 (فلسطين)</option>
                    <option value="+972">🇵🇸 +972 (فلسطين/05)</option>
                    <option value="+966">🇸🇦 +966 (السعودية)</option>
                    <option value="+20">🇪🇬 +20 (مصر)</option>
                    <option value="+962">🇯🇴 +962 (الأردن)</option>
                    <option value="+971">🇦🇪 +971 (الإمارات)</option>
                    <option value="+964">🇮🇶 +964 (العراق)</option>
                    <option value="+961">🇱🇧 +961 (لبنان)</option>
                    <option value="+965">🇰🇼 +965 (الكويت)</option>
                  </select>

                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="059xxxxxxx"
                    className="flex-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                <span>إرسال رمز التحقق عبر SMS</span>
              </button>

              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep('use_key')}
                  className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
                >
                  فقدت رقم الهاتف؟ استرداد عبر مفتاح الطوارئ (Emergency Key)
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: ENTER OTP CODE */}
          {step === 'verify_otp' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  أدخل رمز التحقق (SMS)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  تم إرسال رمز تحقق مكون من 6 أرقام إلى هاتفك <span className="font-mono font-bold" dir="ltr">{phoneNumber}</span>
                </p>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2" dir="ltr" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 sm:w-12 h-12 text-center text-lg font-black bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                  />
                ))}
              </div>

              <button
                onClick={() => handleVerifyCode()}
                disabled={isLoading || otpDigits.some((d) => d === '')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>تحقق واسترداد الحساب</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep('input_phone')}
                  className="hover:text-slate-800 dark:hover:text-slate-200"
                >
                  تغيير رقم الهاتف
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={resendCooldown > 0 || isLoading}
                  className="font-bold text-blue-600 dark:text-blue-400 disabled:text-slate-400 cursor-pointer"
                >
                  {resendCooldown > 0 ? `إعادة الإرسال بعد (${resendCooldown} ثانية)` : 'إعادة إرسال الرمز'}
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: SET NEW PIN AFTER SUCCESSFUL VERIFICATION */}
          {step === 'set_new_pin' && (
            <form onSubmit={handleSetNewPin} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  تم التحقق من هويتك بنجاح!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  قم الآن بتعيين رمز قفل PIN جديد لحماية حسابك والخزنة السرية.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  رمز PIN الجديد (4 أرقام):
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  autoFocus
                  className="w-full text-center tracking-widest text-lg font-mono bg-slate-100 dark:bg-slate-800 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  تأكيد رمز PIN الجديد:
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full text-center tracking-widest text-lg font-mono bg-slate-100 dark:bg-slate-800 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || newPin.length !== 4 || newPin !== confirmPin}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>حفظ الرمز وفتح الحساب بالكامل</span>
              </button>
            </form>
          )}

          {/* STAGE 4: EMERGENCY KEY FALLBACK */}
          {step === 'use_key' && (
            <form onSubmit={handleRecoverWithKey} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2">
                  <FileKey className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  الاسترداد عبر مفتاح الطوارئ
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  أدخل مفتاح الاسترداد الخاص بحسابك (مثال: DRIVE-XXXX-XXXX-XXXX)
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={recoveryKeyInput}
                  onChange={(e) => setRecoveryKeyInput(e.target.value)}
                  placeholder="DRIVE-7492-8105-3921"
                  className="w-full text-center tracking-wider text-sm font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-purple-600 dark:text-purple-400"
                />
              </div>

              {/* Quick Click to Fill Key */}
              <button
                type="button"
                onClick={() => setRecoveryKeyInput('DRIVE-7492-8105-3921')}
                className="w-full py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-semibold border border-purple-200 dark:border-purple-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>استخدام الرمز الخاص بك:</span>
                <span className="font-mono font-bold">DRIVE-7492-8105-3921</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || !recoveryKeyInput.trim()}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>التحقق من المفتاح واستعادة الحساب وفتح الصور</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('input_phone')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold"
                >
                  العودة للتحقق برقم الهاتف (SMS)
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
