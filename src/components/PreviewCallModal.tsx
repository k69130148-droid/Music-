import React, { useState } from 'react';
import { CallWallpaper, Contact, SimCard } from '../types/phone';
import { X, Play, Phone, PhoneOff, Sliders, Smartphone } from 'lucide-react';

interface PreviewCallModalProps {
  wallpaper: CallWallpaper;
  simCards: SimCard[];
  sampleContact?: Contact;
  onClose: () => void;
  onSetDefault: (id: string) => void;
  isDefault: boolean;
  onTestCall: (wallpaper: CallWallpaper) => void;
}

export const PreviewCallModal: React.FC<PreviewCallModalProps> = ({
  wallpaper,
  simCards,
  sampleContact,
  onClose,
  onSetDefault,
  isDefault,
  onTestCall,
}) => {
  const [mode, setMode] = useState<'incoming' | 'outgoing'>('incoming');

  const contactName = sampleContact?.name || 'الوالدة الغالية ❤️';
  const contactPhone = sampleContact?.phone || '0505123456';
  const sim = simCards[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-w-sm w-full h-[85vh] max-h-[700px]">
        {/* Top Header */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setMode('incoming')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                mode === 'incoming' ? 'bg-indigo-600 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              شاشة واردة
            </button>
            <button
              onClick={() => setMode('outgoing')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                mode === 'outgoing' ? 'bg-indigo-600 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              شاشة جارية
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Call Viewport with Wallpaper */}
        <div className="relative flex-1 flex flex-col justify-between p-6 overflow-hidden">
          {/* Wallpaper background */}
          <div className="absolute inset-0 z-0">
            {wallpaper.imageSrc ? (
              <img
                src={wallpaper.imageSrc}
                alt={wallpaper.title}
                className="w-full h-full object-cover"
                style={{
                  filter: `blur(${wallpaper.blur}px) brightness(${1 - (wallpaper.darkness || 30) / 100})`,
                }}
              />
            ) : (
              <div className="w-full h-full" style={{ background: wallpaper.gradientCss }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </div>

          {/* Simulated Carrier / SIM badge */}
          <div className="relative z-10 pt-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] text-white/90 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>{sim.carrierName}</span>
              <span className="text-white/40">·</span>
              <span>شريحة 1</span>
            </div>
          </div>

          {/* Caller Details */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center -mt-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-3xl font-bold text-white shadow-2xl mb-3">
              {contactName.slice(0, 2)}
            </div>

            <h2 className="text-2xl font-bold text-white drop-shadow-md mb-1">
              {contactName}
            </h2>
            <p className="text-sm text-white/80 font-mono tracking-wider dir-ltr">
              {contactPhone}
            </p>

            <span className="mt-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-0.5 rounded-full">
              {mode === 'incoming' ? 'مكالمة واردة...' : '00:14 (متصل)'}
            </span>
          </div>

          {/* Bottom Controls Mock */}
          <div className="relative z-10 pb-4 flex items-center justify-around">
            {mode === 'incoming' ? (
              <>
                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                  <PhoneOff className="w-6 h-6" />
                </div>
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                  <Phone className="w-6 h-6" />
                </div>
              </>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                <PhoneOff className="w-7 h-7" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="relative z-30 p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={() => onSetDefault(wallpaper.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              isDefault
                ? 'bg-slate-800 text-slate-400 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isDefault ? 'الخلفية الافتراضية الحالية' : 'تعيين كخلفية رئيسية'}
          </button>

          <button
            onClick={() => {
              onClose();
              onTestCall(wallpaper);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            title="بدء تجربة مكالمة فورية بهذه الخلفية"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>تجربة اتصال</span>
          </button>
        </div>
      </div>
    </div>
  );
};
