import React from 'react';
import { AppSettings } from '../utils/phoneStorage';
import { audioToneService } from '../services/audioTones';
import { 
  X, 
  Volume2, 
  Vibrate, 
  Music, 
  CircleDot, 
  Smartphone, 
  RotateCcw, 
  PhoneIncoming,
  Shield,
  Bell
} from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
  onTriggerTestCall: (delaySeconds: number) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onTriggerTestCall,
  onResetAllData,
}) => {
  const toggleSound = () => {
    const next = !settings.soundEnabled;
    audioToneService.setSoundEnabled(next);
    onUpdateSettings({ ...settings, soundEnabled: next });
  };

  const toggleHaptics = () => {
    const next = !settings.hapticsEnabled;
    audioToneService.setHapticsEnabled(next);
    if (next) audioToneService.triggerHaptic(40);
    onUpdateSettings({ ...settings, hapticsEnabled: next });
  };

  const setRingtone = (theme: 'marimba' | 'cosmic' | 'classic') => {
    onUpdateSettings({ ...settings, activeRingtone: theme });
    // Play short preview of melody
    const stop = audioToneService.startIncomingRingtone(theme);
    setTimeout(stop, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>إعدادات الهاتف والاتصال</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Sounds & Haptics */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200/60 dark:border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-500" />
              <span>الأصوات والاهتزاز</span>
            </h3>

            <div className="space-y-2.5">
              {/* Dialpad Tones */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    أصوات لوحة الاتصال (DTMF)
                  </p>
                  <p className="text-[10px] text-slate-400">
                    نغمات مدمجة تحاكي الهواتف الحقيقية
                  </p>
                </div>
                <button
                  onClick={toggleSound}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Vibration */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    الاهتزاز اللمسي (Haptic Feedback)
                  </p>
                  <p className="text-[10px] text-slate-400">
                    اهتزاز الجهاز عند الضغط على الأزرار
                  </p>
                </div>
                <button
                  onClick={toggleHaptics}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    settings.hapticsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.hapticsEnabled ? '-translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Ringtone Themes */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200/60 dark:border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Music className="w-4 h-4 text-emerald-500" />
              <span>نغمة رنين المكالمات الواردة</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'marimba', label: 'ماريمبا حديثة' },
                { id: 'cosmic', label: 'كوزميك فضائية' },
                { id: 'classic', label: 'هاتف كلاسيكي' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRingtone(r.id as typeof settings.activeRingtone)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    settings.activeRingtone === r.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Device Frame View Mode Switcher */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200/60 dark:border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-purple-500" />
              <span>وضع عرض التطبيق</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ ...settings, phoneFrameMode: true })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  settings.phoneFrameMode
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                إطار هاتف حقيقي (مُجسم)
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, phoneFrameMode: false })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  !settings.phoneFrameMode
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                شاشة عريضة متكيفة
              </button>
            </div>
          </div>

          {/* Test Incoming Call Simulator Bar */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 rounded-2xl p-4 border border-emerald-500/30 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-emerald-400">
                محاكي المكالمات الواردة (اختبار الخلفية والرنين)
              </h3>
            </div>
            <p className="text-[11px] text-white/70 mb-3">
              جرّب استقبال مكالمة واردة كاملة مع شاشة الاتصال بالخلفية ونغمة الرنين
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onTriggerTestCall(0);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                مكالمة واردة فورية
              </button>
              <button
                onClick={() => {
                  onClose();
                  onTriggerTestCall(5);
                }}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
              >
                بعد 5 ثوانٍ (مكالمة وهمية)
              </button>
            </div>
          </div>

          {/* Reset Data */}
          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                if (confirm('هل أنت متأكد من إعادة ضبط كافة البيانات وسجلات المكالمات؟')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط المصنع للبيانات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
