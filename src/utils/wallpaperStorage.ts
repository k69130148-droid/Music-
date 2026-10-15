import { Wallpaper, ClockCustomization, PhoneFrameType } from '../types/wallpaper';
import { INITIAL_WALLPAPERS } from '../data/wallpapers';

const STORAGE_KEYS = {
  FAVORITES: 'rawnaq_favorites_v1',
  CUSTOM_WALLPAPERS: 'rawnaq_custom_wallpapers_v1',
  DOWNLOADS_HISTORY: 'rawnaq_downloads_history_v1',
  CLOCK_CONFIG: 'rawnaq_clock_config_v1',
  PHONE_FRAME: 'rawnaq_phone_frame_v1',
  ACTIVE_PREVIEW_ID: 'rawnaq_active_preview_v1',
  THEME_PREFERENCE: 'rawnaq_theme_mode_v1',
};

export const defaultClockConfig: ClockCustomization = {
  fontFamily: 'cairo',
  color: '#ffffff',
  numeralType: 'western',
  fontSize: 'lg',
  showHijriDate: true,
};

export const wallpaperStorage = {
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : ['wp-desert-aurora', 'wp-amoled-gold'];
    } catch {
      return [];
    }
  },

  toggleFavorite(id: string): string[] {
    try {
      const favs = this.getFavorites();
      const updated = favs.includes(id) ? favs.filter((item) => item !== id) : [...favs, id];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  },

  getCustomWallpapers(): Wallpaper[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_WALLPAPERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomWallpaper(wallpaper: Wallpaper): Wallpaper[] {
    try {
      const existing = this.getCustomWallpapers();
      const updated = [wallpaper, ...existing];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_WALLPAPERS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  deleteCustomWallpaper(id: string): Wallpaper[] {
    try {
      const existing = this.getCustomWallpapers();
      const updated = existing.filter((w) => w.id !== id);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_WALLPAPERS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  recordDownload(id: string): void {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOWNLOADS_HISTORY);
      const history: { id: string; timestamp: number }[] = data ? JSON.parse(data) : [];
      const updated = [{ id, timestamp: Date.now() }, ...history.filter((h) => h.id !== id)].slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.DOWNLOADS_HISTORY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  getDownloadedIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOWNLOADS_HISTORY);
      const history: { id: string; timestamp: number }[] = data ? JSON.parse(data) : [];
      return history.map((item) => item.id);
    } catch {
      return [];
    }
  },

  getClockConfig(): ClockCustomization {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLOCK_CONFIG);
      return data ? { ...defaultClockConfig, ...JSON.parse(data) } : defaultClockConfig;
    } catch {
      return defaultClockConfig;
    }
  },

  saveClockConfig(config: ClockCustomization): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CLOCK_CONFIG, JSON.stringify(config));
    } catch {
      // ignore
    }
  },

  getPhoneFrame(): PhoneFrameType {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHONE_FRAME);
      return data === 'android' ? 'android' : 'iphone';
    } catch {
      return 'iphone';
    }
  },

  savePhoneFrame(frame: PhoneFrameType): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PHONE_FRAME, frame);
    } catch {
      // ignore
    }
  },

  getAllWallpapers(): Wallpaper[] {
    const custom = this.getCustomWallpapers();
    return [...custom, ...INITIAL_WALLPAPERS];
  }
};
