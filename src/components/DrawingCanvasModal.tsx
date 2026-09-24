import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Eraser, RotateCcw, Check, X, Palette, Download } from 'lucide-react';

interface DrawingCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDrawing: (dataUrl: string) => void;
  existingDrawing?: string;
}

const COLORS = ['#38bdf8', '#34d399', '#f59e0b', '#f43f5e', '#a78bfa', '#ffffff', '#000000'];

export const DrawingCanvasModal: React.FC<DrawingCanvasModalProps> = ({
  isOpen,
  onClose,
  onSaveDrawing,
  existingDrawing,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#38bdf8');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set internal dimensions
      canvas.width = canvas.parentElement?.clientWidth || 360;
      canvas.height = 300;

      // Background fill
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Load existing image if any
      if (existingDrawing) {
        const img = new Image();
        img.src = existingDrawing;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, existingDrawing]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = isEraser ? '#020617' : color;
    ctx.lineWidth = isEraser ? lineWidth * 4 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // redraw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSaveDrawing(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in dir-rtl">
      <div className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 text-slate-100 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">لوحة الرسم والرسم اليدوي</h3>
              <p className="text-xs text-slate-400">ارسم المسائل والأشكال التوضيحية بإصبعك</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas area */}
        <div className="w-full h-[300px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 touch-none shadow-inner relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair"
          />
        </div>

        {/* Tools bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-1">
          {/* Colors */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                }}
                className={`w-6 h-6 rounded-full border transition-all ${
                  !isEraser && color === c ? 'scale-125 border-white ring-2 ring-amber-500' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Eraser & Clear */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition ${
                isEraser ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Eraser className="w-4 h-4" />
              <span>محاية</span>
            </button>
            <button
              onClick={clearCanvas}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1"
              title="مسح الكانفاس"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تفريغ</span>
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition"
          >
            حفظ الرسمة وإدراجها
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
