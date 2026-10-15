import React, { useState, useEffect, useRef } from 'react';
import { ActiveCallState, SimCard } from '../types/phone';
import { audioToneService } from '../services/audioTones';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  PhoneOff, 
  Grid, 
  CircleDot, 
  Pause, 
  Play, 
  UserPlus, 
  Video,
  ChevronDown
} from 'lucide-react';

interface ActiveCallScreenProps {
  call: ActiveCallState;
  simCards: SimCard[];
  onEndCall: (durationSeconds: number, isRecorded: boolean) => void;
  onUpdateCall: (updater: (prev: ActiveCallState) => ActiveCallState) => void;
}

export const ActiveCallScreen: React.FC<ActiveCallScreenProps> = ({
  call,
  simCards,
  onEndCall,
  onUpdateCall,
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [showInCallKeypad, setShowInCallKeypad] = useState<boolean>(false);
  const [keypadInput, setKeypadInput] = useState<string>('');
  const stopRingbackRef = useRef<(() => void) | null>(null);

  const activeSim = simCards.find(s => s.id === call.simId) || simCards[0];

  // Manage call status (dialing -> connected) and audio ringback tone
  useEffect(() => {
    if (call.status === 'dialing' || call.status === 'ringing') {
      audioToneService.playDialTone(0.8);
      const timerRing = setTimeout(() => {
        stopRingbackRef.current = audioToneService.playRingbackTone();
      }, 900);

      // Connect after 3.5 seconds simulate recipient answer
      const connectTimer = setTimeout(() => {
        if (stopRingbackRef.current) {
          stopRingbackRef.current();
          stopRingbackRef.current = null;
        }
        audioToneService.playConnectedTone();
        onUpdateCall(prev => ({ ...prev, status: 'connected', startTime: Date.now() }));
      }, 3800);

      return () => {
        clearTimeout(timerRing);
        clearTimeout(connectTimer);
        if (stopRingbackRef.current) {
          stopRingbackRef.current();
          stopRingbackRef.current = null;
        }
      };
    }
  }, [call.status, onUpdateCall]);

  // Duration timer
  useEffect(() => {
    if (call.status === 'connected') {
      const interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [call.status]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEnd = () => {
    if (stopRingbackRef.current) {
      stopRingbackRef.current();
      stopRingbackRef.current = null;
    }
    audioToneService.playCallEndTone();
    onEndCall(seconds, call.isRecording);
  };

  const handleDtmfInCall = (char: string) => {
    audioToneService.playDtmf(char);
    setKeypadInput(prev => prev + char);
  };

  const wallpaper = call.wallpaper;

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between overflow-hidden text-white select-none">
      {/* Background Layer with Wallpaper */}
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
              background: wallpaper.gradientCss || 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            }}
          />
        )}
        {/* Subtle dark gradient overlay for crystal clear contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/85" />
      </div>

      {/* Top Bar: SIM and status */}
      <header className="relative z-10 pt-8 px-6 flex flex-col items-center">
        {/* SIM Indicator Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium mb-3">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: activeSim.color }}
          />
          <span>{activeSim.carrierName}</span>
          <span className="text-white/40">|</span>
          <span className="text-white/80">{call.simId === 'sim1' ? 'شريحة 1' : 'شريحة 2'}</span>
          <span className="text-emerald-400 font-mono text-[10px]">{activeSim.networkType}</span>
        </div>

        {/* Security & HD Voice Indicator */}
        <div className="flex items-center gap-2 text-[11px] text-white/70">
          <span>مكالمة عالية الدقة VoLTE</span>
          <span aria-hidden="true">·</span>
          <span>مشفرة من طرف لطرف</span>
        </div>
      </header>

      {/* Center Zone: Caller Details & Live Avatar */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center -mt-6">
        {/* Animated Avatar / Ripple Circle */}
        <div className="relative mb-6">
          {call.status === 'connected' && !call.isHold && (
            <div className="absolute -inset-4 rounded-full border border-emerald-500/30 animate-ping opacity-30" />
          )}
          {call.status === 'connected' && call.isRecording && (
            <div className="absolute -inset-3 rounded-full border-2 border-red-500/60 animate-pulse" />
          )}

          <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700/80 p-1 shadow-2xl border-2 border-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden">
            {call.contact?.avatar ? (
              <img
                src={call.contact.avatar}
                alt={call.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-pink-500/40 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
                {call.name.slice(0, 2)}
              </div>
            )}
          </div>
        </div>

        {/* Contact Name & Number */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md mb-1.5 max-w-xs truncate">
          {call.name}
        </h1>
        <p className="text-base text-white/80 font-mono tracking-wider tabular-nums mb-3 dir-ltr">
          {call.number}
        </p>

        {/* Call State / Duration */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {call.status === 'dialing' || call.status === 'ringing' ? (
              <div className="flex items-center gap-2 text-sm text-amber-300 font-medium bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>جاري الرنين والاتصال عبر {activeSim.carrierName}...</span>
              </div>
            ) : call.isHold ? (
              <div className="flex items-center gap-2 text-sm text-yellow-300 font-medium bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                <Pause className="w-3.5 h-3.5" />
                <span>المكالمة معلقة</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-semibold tracking-wider font-mono bg-emerald-500/20 text-emerald-300 px-3.5 py-1 rounded-full border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{formatTimer(seconds)}</span>
              </div>
            )}

            {/* Recording Badge */}
            {call.isRecording && (
              <div className="flex items-center gap-1.5 text-xs text-red-300 bg-red-500/25 px-2.5 py-1 rounded-full border border-red-500/30 animate-pulse">
                <CircleDot className="w-3 h-3 text-red-400" />
                <span>تسجيل جاري</span>
              </div>
            )}
          </div>

          {/* Real Native Phone Line & WhatsApp Shortcuts */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => {
                window.location.href = `tel:${call.number}`;
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg border border-emerald-400/40 backdrop-blur-md transition-all active:scale-95"
              title="فتح تطبيق الهاتف الفعلي والاتصال عبر شريحة جوال"
            >
              <span>فتح خط جوال الفعلي (تطبيق الهاتف) 📱</span>
            </button>

            <button
              onClick={() => {
                let clean = call.number.replace(/\D/g, '');
                if (clean.startsWith('059') || clean.startsWith('056')) clean = '970' + clean.slice(1);
                window.open(`https://wa.me/${clean}`, '_blank');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 text-xs font-bold border border-emerald-500/30 backdrop-blur-md transition-all"
              title="مكالمة واتساب"
            >
              <span>واتساب 💬</span>
            </button>
          </div>
        </div>
      </main>

      {/* In-Call Keypad Overlay (if triggered) */}
      {showInCallKeypad && (
        <div className="relative z-20 mx-auto w-full max-w-xs bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-3xl p-4 shadow-2xl mb-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <span className="text-xs text-white/70">لوحة المفاتيح أثناء المكالمة</span>
            <button
              onClick={() => setShowInCallKeypad(false)}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              aria-label="إغلاق لوحة المفاتيح"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="h-8 mb-2 flex items-center justify-center font-mono text-xl tracking-widest text-emerald-400 overflow-x-auto">
            {keypadInput || '—'}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleDtmfInCall(digit)}
                className="h-11 rounded-xl bg-white/10 hover:bg-white/20 active:bg-emerald-500/30 font-semibold text-lg flex items-center justify-center transition-colors"
              >
                {digit}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* In-Call Actions Bottom Bar */}
      <footer className="relative z-10 pb-10 px-6 max-w-sm mx-auto w-full">
        {/* 6 Grid Control Buttons */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-6 mb-8 text-center">
          {/* Mute */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onUpdateCall(prev => ({ ...prev, isMuted: !prev.isMuted }))}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                call.isMuted
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
              }`}
              title="كتم الصوت"
            >
              {call.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <span className="text-xs mt-1.5 text-white/80">
              {call.isMuted ? 'مكتوم' : 'كتم'}
            </span>
          </div>

          {/* Keypad */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowInCallKeypad(!showInCallKeypad)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                showInCallKeypad
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
              }`}
              title="لوحة الأرقام"
            >
              <Grid className="w-6 h-6" />
            </button>
            <span className="text-xs mt-1.5 text-white/80">لوحة المفاتيح</span>
          </div>

          {/* Speaker */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onUpdateCall(prev => ({ ...prev, isSpeaker: !prev.isSpeaker }))}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                call.isSpeaker
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
              }`}
              title="مكبر الصوت"
            >
              {call.isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
            <span className="text-xs mt-1.5 text-white/80">
              {call.isSpeaker ? 'مكبر الصوت' : 'سماعة الهاتف'}
            </span>
          </div>

          {/* Record */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                audioToneService.triggerHaptic(30);
                onUpdateCall(prev => ({ ...prev, isRecording: !prev.isRecording }));
              }}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                call.isRecording
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/40 animate-pulse'
                  : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
              }`}
              title="تسجيل المكالمة"
            >
              <CircleDot className="w-6 h-6" />
            </button>
            <span className="text-xs mt-1.5 text-white/80">
              {call.isRecording ? 'إيقاف التسجيل' : 'تسجيل المكالمة'}
            </span>
          </div>

          {/* Hold */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onUpdateCall(prev => ({ ...prev, isHold: !prev.isHold }))}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                call.isHold
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
              }`}
              title="تعليق المكالمة"
            >
              {call.isHold ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </button>
            <span className="text-xs mt-1.5 text-white/80">
              {call.isHold ? 'استئناف' : 'تعليق'}
            </span>
          </div>

          {/* Add Call */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                alert('ميزة إضافة مكالمة جماعية متاحة عبر دمج الخطوط');
              }}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-all"
              title="إضافة مكالمة"
            >
              <UserPlus className="w-6 h-6" />
            </button>
            <span className="text-xs mt-1.5 text-white/80">إضافة</span>
          </div>
        </div>

        {/* Big End Call Red Button */}
        <div className="flex justify-center">
          <button
            onClick={handleEnd}
            className="w-18 h-18 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-red-600/40 transition-all border border-red-400/30"
            aria-label="إنهاء المكالمة"
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        </div>
      </footer>
    </div>
  );
};
