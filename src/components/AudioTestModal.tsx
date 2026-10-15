import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Play, Square, CheckCircle2, AlertCircle } from 'lucide-react';
import { audioToneService } from '../services/audioTones';

interface AudioTestModalProps {
  onClose: () => void;
}

export const AudioTestModal: React.FC<AudioTestModalProps> = ({ onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Request real microphone access
  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setHasPermission(true);

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setAudioLevel(Math.min(average * 1.5, 100));
        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn('Microphone permission error:', err);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    startMicTest();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleStartRecord = () => {
    if (!mediaStreamRef.current) return;
    audioToneService.triggerHaptic(40);
    audioChunksRef.current = [];

    try {
      const recorder = new MediaRecorder(mediaStreamRef.current);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      const timer = setInterval(() => {
        setRecordSeconds(prev => {
          if (prev >= 4) {
            clearInterval(timer);
            recorder.stop();
            setIsRecording(false);
            return 5;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn(err);
    }
  };

  const handlePlayRecording = () => {
    if (!recordedAudioUrl) return;
    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(recordedAudioUrl);
    audioPlayerRef.current = audio;
    audio.onended = () => setIsPlaying(false);
    audio.play();
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              اختبار الميكروفون والصوت الحقيقي
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission status */}
        {hasPermission === false ? (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 mb-4 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              يرجى السماح بالوصول إلى الميكروفون في المتصفح لاختبار التقاط الصوت الفعلي لجهازك.
            </p>
          </div>
        ) : hasPermission === true ? (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 mb-4 text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>الميكروفون الفعلي للجهاز متصل وجاهز للمكالمات!</span>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 text-[11px] text-slate-500 flex items-center gap-2">
            <span>جاري فحص الميكروفون...</span>
          </div>
        )}

        {/* Live Audio VU Level Meter */}
        <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-4 mb-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
            تحدث الآن لمشاهدة استجابة صوتك الحقيقية:
          </p>

          {/* Animated Waveform Bars */}
          <div className="flex items-center justify-center gap-1.5 h-14 mb-2">
            {[20, 40, 65, 85, 100, 85, 65, 40, 20].map((heightPct, idx) => {
              const activeHeight = Math.max(10, (audioLevel / 100) * heightPct);
              return (
                <span
                  key={idx}
                  className="w-2 rounded-full transition-all duration-75 bg-emerald-500"
                  style={{
                    height: `${activeHeight}%`,
                    opacity: audioLevel > 10 ? 1 : 0.4,
                  }}
                />
              );
            })}
          </div>

          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            مستوى الصوت: {Math.round(audioLevel)}%
          </span>
        </div>

        {/* Record & Echo Playback test */}
        <div className="space-y-2 mb-4">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            تجربة تسجيل واستماع صدى صوتك (Echo Test):
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartRecord}
              disabled={isRecording || !hasPermission}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecording ? `جاري التسجيل (${recordSeconds} ث)...` : 'تسجيل مقطع صوتي تجريبي'}</span>
            </button>

            {recordedAudioUrl && (
              <button
                onClick={handlePlayRecording}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1"
                title="الاستماع للمقطع"
              >
                {isPlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isPlaying ? 'إيقاف' : 'استماع'}</span>
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
        >
          تم، إغلاق الفحص
        </button>
      </div>
    </div>
  );
};
