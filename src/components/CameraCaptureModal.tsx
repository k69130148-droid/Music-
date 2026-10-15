import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Folder, Loader2 } from 'lucide-react';
import { DriveFolder } from '../types/drive';
import { driveDb } from '../services/driveDb';
import { triggerConfetti } from '../utils/formatters';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: DriveFolder[];
  defaultFolderId?: string | null;
  onPhotoCaptured: () => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  folders,
  defaultFolderId,
  onPhotoCaptured,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [selectedFolder, setSelectedFolder] = useState<string>(defaultFolderId || 'root');
  const [photoTitle, setPhotoTitle] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedBlob(null);
      setCapturedPreview(null);
      setCameraError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: unknown) {
      console.error('Camera access failed:', err);
      setCameraError('تعذر فتح الكاميرا. يرجى التأكد من إعطاء المتصفح إذن الوصول للكاميرا.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, flip horizontally for mirror preview
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setCapturedBlob(blob);
        setCapturedPreview(canvas.toDataURL('image/jpeg', 0.85));
        setPhotoTitle(`صورة_كاميرا_${new Date().toISOString().slice(0, 10)}.jpg`);
      },
      'image/jpeg',
      0.92
    );
  };

  const handleRetake = () => {
    setCapturedBlob(null);
    setCapturedPreview(null);
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleSavePhoto = async () => {
    if (!capturedBlob) return;
    setIsSaving(true);
    try {
      const name = photoTitle.trim() || `صورة_كاميرا_${Date.now()}.jpg`;
      await driveDb.savePhoto(capturedBlob, name, {
        folderId: selectedFolder,
        isVault: selectedFolder === 'vault',
        tags: ['كاميرا'],
        note: 'صورة التقطت مباشرة بكاميرا درايف أوفلاين',
      });
      triggerConfetti();
      onPhotoCaptured();
      onClose();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">التقاط صورة بالكاميرا (أوفلاين)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Captured Preview */}
        <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-rose-400 text-xs">
              <p>{cameraError}</p>
              <button
                onClick={startCamera}
                className="mt-3 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : capturedPreview ? (
            <img
              src={capturedPreview}
              alt="لقطة الكاميرا"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
          )}

          {/* Quick flip camera button on viewfinder */}
          {!capturedPreview && !cameraError && (
            <button
              onClick={handleFlipCamera}
              className="absolute top-4 left-4 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm transition"
              title="تبديل الكاميرا الأمامية والخلفية"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controls / Options */}
        <div className="p-5 space-y-4">
          {capturedPreview ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">اسم الصورة:</label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="w-full text-xs bg-slate-800 text-white py-2 px-3 rounded-xl border border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <Folder className="w-3.5 h-3.5 text-blue-400" />
                  <span>المجلد المستهدف:</span>
                </label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full text-xs bg-slate-800 text-white py-2 px-3 rounded-xl border border-slate-700 focus:outline-none"
                >
                  <option value="root">المجلد الرئيسي (ملفاتي)</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleRetake}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition"
                >
                  إعادة الالتقاط
                </button>
                <button
                  onClick={handleSavePhoto}
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>حفظ في درايف أوفلاين</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-2">
              <button
                onClick={handleCapture}
                disabled={!!cameraError}
                className="w-16 h-16 rounded-full border-4 border-white bg-red-500 hover:bg-red-600 shadow-xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer disabled:opacity-50"
                title="التقاط الصورة الآن"
              >
                <div className="w-12 h-12 rounded-full border-2 border-slate-900"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
