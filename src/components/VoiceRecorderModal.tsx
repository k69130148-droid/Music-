import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Play, Pause, Trash2, Check, X, Sparkles, AlertCircle } from 'lucide-react';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppendText: (text: string) => void;
  onSaveAudio: (audioDataUrl: string) => void;
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onAppendText,
  onSaveAudio,
}) => {
  const [activeTab, setActiveTab] = useState<'speech' | 'audio'>('speech');

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Audio Recording States
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!isOpen) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA'; // Arabic

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscribedText((prev) => {
          // avoid duplicating continuous results
          return currentTranscript;
        });
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle Speech Recognition
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Handle Speech Append
  const handleAppendSpeechText = () => {
    if (transcribedText.trim()) {
      onAppendText(transcribedText.trim());
      setTranscribedText('');
      onClose();
    }
  };

  // Start Audio Memo Recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioUrl(base64data);
        };
        // stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('تعذر الوصول إلى الميكروفون. يرجى السماح بالصلاحيات.');
    }
  };

  // Stop Audio Memo Recording
  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Save Audio Memo
  const handleSaveAudioMemo = () => {
    if (audioUrl) {
      onSaveAudio(audioUrl);
      onClose();
    }
  };

  // Format seconds mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md p-0 sm:p-4 animate-in fade-in dir-rtl">
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 text-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">التدوين والتسجيل الصوتي</h3>
              <p className="text-xs text-slate-400">تحدث بصوتك لتحويل الكلام إلى نص أو تسجيل مقطع</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('speech')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'speech'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎙️ تحويل الكلام لنص (إملاء)
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'audio'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔊 تسجيل ملاحظة صوتية
          </button>
        </div>

        {/* Tab 1: Speech to Text */}
        {activeTab === 'speech' && (
          <div className="flex flex-col gap-3 py-2">
            {!speechSupported ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>المتصفح لا يدعم خاصية التعرف على الكلام تلقائياً. يمكنك استخدام لوحة المفاتيح الصوتية في هاتفك.</span>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center py-4 gap-3">
                  <button
                    onClick={toggleListening}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-500/30 shadow-xl'
                        : 'bg-amber-500 text-slate-950 hover:scale-105 shadow-lg shadow-amber-500/20'
                    }`}
                  >
                    {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                  <p className="text-xs font-semibold text-slate-300">
                    {isListening ? 'جاري الاستماع... تحدث باللغة العربية الآن' : 'اضغط على الميكروفون للبدء بالإملاء الصوتي'}
                  </p>
                </div>

                {/* Transcribed text area */}
                <div className="min-h-[100px] max-h-[150px] overflow-y-auto p-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-100 font-sans">
                  {transcribedText ? (
                    transcribedText
                  ) : (
                    <span className="text-slate-500 text-xs italic">
                      سوف يظهر الكلام المنطوق هنا تلقائياً...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleAppendSpeechText}
                    disabled={!transcribedText.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm disabled:opacity-40 disabled:pointer-events-none hover:bg-amber-400 transition"
                  >
                    إضافة النص للملاحظة
                  </button>
                  <button
                    onClick={() => setTranscribedText('')}
                    disabled={!transcribedText}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
                    title="مسح"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Record Audio Memo */}
        {activeTab === 'audio' && (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col items-center justify-center py-4 gap-3">
              {isRecordingAudio ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center animate-pulse ring-8 ring-red-500/30">
                    <Square className="w-8 h-8 fill-current" />
                  </div>
                  <span className="text-xl font-mono font-bold text-red-400 dir-ltr">
                    {formatTime(recordingTime)}
                  </span>
                  <button
                    onClick={stopAudioRecording}
                    className="mt-1 px-4 py-1.5 rounded-xl bg-red-500 text-white font-bold text-xs"
                  >
                    إيقاف التسجيل
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={startAudioRecording}
                    className="w-20 h-20 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center hover:scale-105 shadow-xl shadow-amber-500/20"
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                  <span className="text-xs text-slate-300 font-semibold">
                    اضغط لتسجيل ملاحظة صوتية مقتطعة
                  </span>
                </div>
              )}
            </div>

            {/* Audio player preview */}
            {audioUrl && !isRecordingAudio && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <audio
                  ref={audioElementRef}
                  src={audioUrl}
                  controls
                  className="w-full h-9 rounded-lg"
                />
              </div>
            )}

            {audioUrl && !isRecordingAudio && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAudioMemo}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition"
                >
                  إرفاق التسجيل بالملاحظة
                </button>
                <button
                  onClick={() => setAudioUrl(null)}
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  title="حذف التسجيل"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
