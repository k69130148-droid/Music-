import { analyzeBoardOffline } from './offlineOcrService';

export { analyzeBoardOffline };

export interface ScanBoardResult {
  title: string;
  subject: string;
  suggestedBackgroundId: string;
  content: string;
  summary?: string;
  tags?: string[];
  isOffline?: boolean;
}

/**
 * Resizes and compresses any camera/gallery image (even 20MB phone shots or HEIC/HEIF)
 * into a crisp, lightweight JPEG optimized for AI OCR reading.
 * Guaranteed to NEVER reject or throw an unhandled error.
 */
export function prepareImageForAi(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    const fallbackResponse = () => {
      // Create a dummy simple base64 image if reader completely failed
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 600, 400);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px sans-serif';
        ctx.fillText('صورة مرفوعة من الجهاز', 50, 200);
      }
      resolve({ base64: canvas.toDataURL('image/jpeg', 0.85), mimeType: 'image/jpeg' });
    };

    reader.onerror = () => fallbackResponse();

    reader.onload = (e) => {
      const resultData = e.target?.result as string;
      if (!resultData) return fallbackResponse();

      const img = new Image();
      img.onerror = () => {
        // If HTML Image element cannot parse format directly, return original dataUrl
        resolve({ base64: resultData, mimeType: file.type || 'image/jpeg' });
      };

      img.onload = () => {
        // Optimal balanced resolution (1024px): reduces payload by over 80% for near-instant upload
        // and lightning-fast AI vision inference while preserving clear text separation.
        const MAX_DIM = 1024;
        let width = img.width || 1024;
        let height = img.height || 768;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 100);
        canvas.height = Math.max(height, 100);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({ base64: resultData, mimeType: 'image/jpeg' });
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Quality 0.75 ensures fast transmission and instant vision model ingestion
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        resolve({ base64: compressed, mimeType: 'image/jpeg' });
      };

      img.src = resultData;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Smart Scanner:
 * Primary: High-intelligence Multimodal AI Vision Extraction for whiteboards, notebooks, and papers.
 * If device is offline, network fails, or quota is exceeded, seamlessly switches to 100% On-Device Offline OCR.
 */
export async function scanBoardOrPaper(
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  subjectHint?: string,
  forceOffline: boolean = false
): Promise<ScanBoardResult> {
  // Check if navigator is offline or force offline explicitly:
  if (forceOffline || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    const offlineRes = await analyzeBoardOffline(imageBase64);
    return {
      ...offlineRes,
      isOffline: true,
    };
  }

  // Primary AI Vision Extraction using server endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 seconds max limit for AI transcription sequence

    const response = await fetch('/api/scan-board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType,
        subjectHint,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const resJson = await response.json().catch(() => null);

    if (response.ok && resJson && resJson.success && resJson.data) {
      return {
        ...resJson.data,
        isOffline: false,
      };
    } else if (resJson && resJson.error) {
      throw new Error(resJson.error);
    } else {
      throw new Error('لم يكتمل فحص الصورة من خادم الذكاء الاصطناعي');
    }
  } catch (netErr: any) {
    console.warn('Network or API issue during scan, trying local OCR fallback:', netErr?.message || netErr);
    
    // Attempt local OCR extraction
    const offlineFallback = await analyzeBoardOffline(imageBase64);
    // If offline fallback extracted actual text from image, return it
    if (offlineFallback && offlineFallback.content && !offlineFallback.content.includes('ملاحظة تنظيمية')) {
      return {
        ...offlineFallback,
        isOffline: true,
      };
    }

    // If both failed to read real text, throw meaningful error
    throw new Error(
      netErr?.message && !netErr.message.includes('fetch')
        ? netErr.message
        : 'الخادم السحابي مشغول حالياً ومؤقتاً بالذكاء الاصطناعي. يرجى إعادة المحاولة بعد ثوانٍ بسيطة.'
    );
  }
}

/**
 * AI Assistant for explaining scanned concepts, generating quizzes, and translating notes.
 */
export async function requestAiAssist(
  action: 'explain' | 'quiz' | 'translate',
  content: string,
  noteTitle?: string,
  subject?: string
): Promise<string> {
  try {
    const response = await fetch('/api/ai-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        content,
        noteTitle,
        subject,
      }),
    });

    const resJson = await response.json();
    if (response.ok && resJson.success && resJson.result) {
      return resJson.result;
    } else {
      throw new Error(resJson.error || 'تعذر التواصل مع المساعد الذكي');
    }
  } catch (err: any) {
    console.error('AI Assist error:', err);
    throw new Error(err?.message || 'حدث خطأ أثناء معالجة الطلب');
  }
}
