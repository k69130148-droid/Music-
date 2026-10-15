import React, { useState, useEffect } from 'react';
import { ActiveCallState, SimCard } from '../types/phone';
import { audioToneService } from '../services/audioTones';
import { QUICK_SMS_REPLIES } from '../data/phoneData';
import { Phone, PhoneOff, MessageSquare, VolumeX, ShieldCheck, X } from 'lucide-react';

interface IncomingCallScreenProps {
  call: ActiveCallState;
  simCards: SimCard[];
  onAnswer: () => void;
  onDecline: (reason?: string) => void;
  ringtoneTheme?: 'marimba' | 'cosmic' | 'classic';
}

export const IncomingCallScreen: React.FC<IncomingCallScreenProps> = ({
  call,
  simCards,
  onAnswer,
  onDecline,
  ringtoneTheme = 'marimba',
}) => {
  const [showSmsModal, setShowSmsModal] = useState<boolean>(false);
  const [customSms, setCustomSms] = useState<string>('');
  const [isMutedRingtone, setIsMutedRingtone] = useState<boolean>(false);

  const activeSim = simCards.find(s => s.id === call.simId) || simCards[0];
  const wallpaper = call.wallpaper;

  useEffect(() => {
    // Start ringtone
    const stopAudio = audioToneService.startIncomingRingtone(ringtoneTheme);
    return () => {
      stopAudio();
    };
  }, [ringtoneTheme]);

  const handleMuteRing = () => {
    audioToneService.stopIncomingRingtone();
    setIsMutedRingtone(true);
  };

  const handleDeclineWithSms = (smsText: string) => {
    audioToneService.stopIncomingRingtone();
    audioToneService.playCallEndTone();
    onDecline(`تم الرد برسالة: "${smsText}"`);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between overflow-hidden text-white select-none">
      {/* Background Wallpaper */}
      <div className="absolute inset-0 z-0">
        {wallpaper.imageSrc ? (
          <img
            src={wallpaper.imageSrc}
            alt={wallpaper.title}
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
            style={{
              filter: `blur(${wallpaper.blur}px) brightness(${1 - (wallpaper.darkness || 30) / 100})`,
            }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: wallpaper.gradientCss || 'linear-gradient(135deg, #09090e 0%, #1e1b4b 100%)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/85" />
      </div>

      {/* Top Banner: Carrier & SIM Info */}
      <header className="relative z-10 pt-10 px-6 flex flex-col items-center">
        {/* SIM Indicator Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-xs font-medium mb-3">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: activeSim.color }}
          />
          <span>مكالمة واردة على {call.simId === 'sim1' ? 'الشريحة 1' : 'الشريحة 2'}</span>
          <span className="text-white/40">·</span>
          <span className="text-white/90">{activeSim.carrierName}</span>
        </div>

        {/* Security & Verified Caller ID */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>هوية متصل موثوقة ومحمية من الاحتيال</span>
        </div>
      </header>

      {/* Center Zone: Caller Identity */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center -mt-8">
        {/* Pulsing Avatar */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full border-2 border-white/30 animate-ping opacity-35" />
          <div className="absolute -inset-8 rounded-full border border-white/15 animate-pulse opacity-25" />

          <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 p-1 shadow-2xl border-2 border-white/30 backdrop-blur-md flex items-center justify-center overflow-hidden">
            {call.contact?.avatar ? (
              <img
                src={call.contact.avatar}
                alt={call.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500/50 via-purple-600/40 to-pink-500/40 flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                {call.name.slice(0, 2)}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md mb-2 max-w-xs truncate">
          {call.name}
        </h1>

        {/* Phone */}
        <p className="text-lg text-white/85 font-mono tracking-wider tabular-nums mb-3 dir-ltr">
          {call.number}
        </p>

        {call.contact?.company && (
          <p className="text-sm text-white/70 max-w-xs truncate">
            {call.contact.company}
          </p>
        )}

        {/* Mute Ringtone Quick Trigger */}
        {!isMutedRingtone && (
          <button
            onClick={handleMuteRing}
            className="mt-4 flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>كتم نغمة الرنين</span>
          </button>
        )}
      </main>

      {/* Bottom Section: Quick SMS & Answer / Decline Controls */}
      <footer className="relative z-10 pb-12 px-8 max-w-md mx-auto w-full">
        {/* Quick Message Trigger */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowSmsModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-medium text-white backdrop-blur-md transition-all border border-white/10"
          >
            <MessageSquare className="w-4 h-4 text-amber-300" />
            <span>إرسال رسالة سريعة ورفض</span>
          </button>
        </div>

        {/* Dual Primary Answer/Decline Buttons */}
        <div className="flex items-center justify-around">
          {/* Decline (Red) */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                audioToneService.stopIncomingRingtone();
                audioToneService.playCallEndTone();
                onDecline();
              }}
              className="w-18 h-18 rounded-full bg-red-600 hover:bg-red-700 active:scale-90 text-white flex items-center justify-center shadow-xl shadow-red-600/40 transition-all border border-red-400/40"
              aria-label="رفض المكالمة"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
            <span className="text-xs font-medium mt-2 text-white/90">رفض</span>
          </div>

          {/* Answer (Green with Pulse) */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                audioToneService.stopIncomingRingtone();
                audioToneService.playConnectedTone();
                onAnswer();
              }}
              className="w-18 h-18 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-90 text-white flex items-center justify-center shadow-xl shadow-emerald-500/50 transition-all border border-emerald-300/40 animate-bounce"
              style={{ animationDuration: '2s' }}
              aria-label="الرد على المكالمة"
            >
              <Phone className="w-8 h-8" />
            </button>
            <span className="text-xs font-medium mt-2 text-white/90">رد</span>
          </div>
        </div>
      </footer>

      {/* Quick SMS Bottom Sheet Modal */}
      {showSmsModal && (
        <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-slate-900 border-t border-white/15 rounded-t-3xl p-6 text-white max-w-md mx-auto w-full shadow-2xl">
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h2 className="text-base font-bold text-white">
                اختر رسالة سريعة للرد والرفض
              </h2>
              <button
                onClick={() => setShowSmsModal(false)}
                className="p-1 rounded-full text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {QUICK_SMS_REPLIES.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleDeclineWithSms(reply)}
                  className="w-full text-right p-3 rounded-xl bg-white/5 hover:bg-white/15 active:bg-indigo-600/30 text-sm font-medium transition-all text-white/90 border border-white/5"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Custom Reply */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <input
                type="text"
                placeholder="أو اكتب رسالة مخصصة..."
                value={customSms}
                onChange={(e) => setCustomSms(e.target.value)}
                className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-400"
              />
              <button
                disabled={!customSms.trim()}
                onClick={() => handleDeclineWithSms(customSms.trim())}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-semibold text-white transition-colors"
              >
                إرسال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
