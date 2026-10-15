import React, { useState } from 'react';
import { Voicemail, Contact, SimCard } from '../types/phone';
import { audioToneService } from '../services/audioTones';
import { 
  Voicemail as VoicemailIcon, 
  Play, 
  Pause, 
  Phone, 
  Trash2, 
  CheckCheck, 
  Volume2,
  Clock
} from 'lucide-react';

interface VoicemailTabProps {
  voicemails: Voicemail[];
  contacts: Contact[];
  simCards: SimCard[];
  onStartCall: (number: string, simId: 'sim1' | 'sim2', contact?: Contact) => void;
  onDeleteVoicemail: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

export const VoicemailTab: React.FC<VoicemailTabProps> = ({
  voicemails,
  contacts,
  simCards,
  onStartCall,
  onDeleteVoicemail,
  onMarkAsRead,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  const handlePlayToggle = (v: Voicemail) => {
    audioToneService.triggerHaptic(20);
    onMarkAsRead(v.id);

    if (playingId === v.id) {
      setPlayingId(null);
      setPlaybackProgress(0);
      return;
    }

    setPlayingId(v.id);
    setPlaybackProgress(0);

    // Simulate audio playback progress
    const duration = v.durationSeconds * 1000;
    const interval = 200;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPlaybackProgress(progress);

      if (elapsed >= duration) {
        clearInterval(timer);
        setPlayingId(null);
        setPlaybackProgress(0);
      }
    }, interval);
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full px-4 pb-6 max-w-lg mx-auto w-full select-none overflow-y-auto">
      {/* Header */}
      <div className="pt-2 mb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>البريد الصوتي والتسجيلات</span>
          <VoicemailIcon className="w-5 h-5 text-indigo-500" />
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          استمع للرسائل الصوتية الواردة واقرأ النصوص المحولة تلقائياً
        </p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {voicemails.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6">
            <VoicemailIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              صندوق البريد الصوتي فارغ
            </p>
            <p className="text-xs text-slate-400 mt-1">
              ستظهر هنا الرسائل الصوتية التي يتركها المتصلون عندما لا ترد
            </p>
          </div>
        ) : (
          voicemails.map((vm) => {
            const contact = contacts.find(c => c.phone.replace(/\D/g, '') === vm.callerNumber.replace(/\D/g, ''));
            const isPlaying = playingId === vm.id;

            return (
              <div
                key={vm.id}
                className={`bg-white dark:bg-slate-800/80 border rounded-2xl p-4 shadow-xs transition-all ${
                  !vm.isRead
                    ? 'border-indigo-500/80 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-700/60'
                }`}
              >
                {/* Top Info */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center justify-center">
                      {vm.callerName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                          {vm.callerName}
                        </h2>
                        {!vm.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 dir-ltr text-right block">
                        {vm.callerNumber}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    {formatTimestamp(vm.timestamp)}
                  </span>
                </div>

                {/* Transcript Text Box */}
                <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/60 dark:border-slate-800 mb-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <p className="font-medium italic">"{vm.transcript}"</p>
                </div>

                {/* Audio Player Bar */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePlayToggle(vm)}
                    className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  {/* Waveform / Progress bar */}
                  <div className="flex-1">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-200 rounded-full"
                        style={{ width: `${isPlaying ? playbackProgress : 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                      <span>{isPlaying ? 'جاري الاستماع...' : '00:00'}</span>
                      <span>00:{vm.durationSeconds.toString().padStart(2, '0')}</span>
                    </div>
                  </div>

                  {/* Actions: Call Back / Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onStartCall(vm.callerNumber, 'sim1', contact)}
                      className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                      title="معاودة الاتصال"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteVoicemail(vm.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
