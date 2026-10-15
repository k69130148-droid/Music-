import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound, ShieldAlert, Check, Delete } from 'lucide-react';
import { driveDb } from '../services/driveDb';

interface VaultPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: () => void;
  onForgotPassword: () => void;
}

export const VaultPinModal: React.FC<VaultPinModalProps> = ({
  isOpen,
  onClose,
  onUnlocked,
  onForgotPassword,
}) => {
  const [pin, setPin] = useState<string>('');
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [isSettingMode, setIsSettingMode] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setErrorMsg(null);
      return;
    }

    const checkPin = async () => {
      const stored = await driveDb.getSetting<string | null>('vault_pin', null);
      setSavedPin(stored);
      setIsSettingMode(!stored);
    };

    checkPin();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMsg(null);

      if (nextPin.length === 4) {
        verifyOrSavePin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const verifyOrSavePin = async (candidate: string) => {
    if (isSettingMode) {
      // Save new PIN
      await driveDb.setSetting('vault_pin', candidate);
      setSavedPin(candidate);
      setIsSettingMode(false);
      onUnlocked();
      onClose();
    } else {
      // Verify against saved PIN
      if (candidate === savedPin) {
        onUnlocked();
        onClose();
      } else {
        setErrorMsg('رمز PIN غير صحيح. يرجى المحاولة مرة أخرى.');
        setTimeout(() => setPin(''), 600);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="w-6" />
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            {isSettingMode ? 'تعيين رمز قفل الخزنة' : 'خزنة الصور السرية'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isSettingMode
              ? 'اختر رمز PIN مكون من 4 أرقام لحماية صورك الخاصة'
              : 'أدخل رمز PIN لفتح الصور المحمية'}
          </p>
        </div>

        {/* 4 Dots indicator */}
        <div className="flex items-center justify-center gap-3 py-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                pin.length > index
                  ? 'bg-purple-600 scale-110 shadow-sm shadow-purple-500/50'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-500 font-medium animate-pulse">{errorMsg}</p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[200px] mx-auto pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-white font-bold text-lg transition-transform active:scale-90 flex items-center justify-center shadow-xs cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-white font-bold text-lg transition-transform active:scale-90 flex items-center justify-center shadow-xs cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 font-bold transition-transform active:scale-90 flex items-center justify-center shadow-xs cursor-pointer"
            title="حذف"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Forgot PIN / Recover Account link */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onForgotPassword();
            }}
            className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center justify-center gap-1.5 mx-auto transition"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>نسيت الرمز أو فقدت الحساب؟ التحقق برقم الهاتف</span>
          </button>
        </div>
      </div>
    </div>
  );
};
