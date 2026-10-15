/**
 * Helper to handle setting wallpaper directly, sharing to native OS wallpaper menu,
 * and high-resolution direct download.
 */

export async function shareOrSetAsWallpaper(
  imageUrl: string,
  title: string
): Promise<{ success: boolean; method: 'native-share' | 'download-guide' | 'fallback' }> {
  try {
    // 1. Fetch image data and convert to blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const filename = `${title.replace(/\s+/g, '_')}_wallpaper.jpg`;
    const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

    // 2. Check if Web Share API with files is supported
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: title,
        text: 'تعيين هذه الصورة كخلفية لهاتفك الجوال',
      });
      return { success: true, method: 'native-share' };
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      // User cancelled share dialog
      return { success: false, method: 'native-share' };
    }
    console.warn('Web Share API not fully supported or failed:', err);
  }

  // Fallback: Trigger direct high-res download
  downloadWallpaperDirect(imageUrl, `${title}_4K`);
  return { success: true, method: 'download-guide' };
}

export function downloadWallpaperDirect(imageUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `${filename.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_')}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Convert numbers to Arabic-Indic digits if requested (١٢:٣٤)
export function toArabicDigits(str: string | number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(str).replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

// Get live Islamic Hijri date and Gregorian date formatted in Arabic
export function getLiveArabicDates(): {
  gregorianDay: string;
  gregorianDate: string;
  hijriDate: string;
} {
  const now = new Date();
  
  // Gregorian Arabic
  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const gregorianDay = dayNames[now.getDay()];
  const gregorianDate = `${now.getDate()} ${monthNames[now.getMonth()]}`;

  // Hijri approximation / Intl
  let hijriDate = '';
  try {
    const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    hijriDate = hijriFormatter.format(now);
  } catch {
    hijriDate = '١٤٤٨ هـ';
  }

  return { gregorianDay, gregorianDate, hijriDate };
}
