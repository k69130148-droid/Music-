export type WallpaperCategory = 
  | 'all'
  | 'amoled'
  | 'nature'
  | 'islamic'
  | 'cyberpunk'
  | 'space'
  | 'abstract'
  | 'minimal'
  | 'cars'
  | 'anime';

export type WallpaperColor = 
  | 'all'
  | 'dark'
  | 'gold'
  | 'blue'
  | 'emerald'
  | 'purple'
  | 'sunset'
  | 'crimson';

export interface Wallpaper {
  id: string;
  titleAr: string;
  titleEn: string;
  category: WallpaperCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  dominantColor: string; // Hex for theme matching
  colorCategory: WallpaperColor;
  tags: string[];
  views: number;
  downloads: number;
  likes: number;
  resolution: string; // '4K Ultra HD', 'QHD+ 1440p', etc.
  aspectRatio: string; // '9:16'
  descriptionAr: string;
  descriptionEn: string;
  featured?: boolean;
  credit?: string;
}

export type PreviewScreenMode = 'lock' | 'home' | 'clean';

export type PhoneFrameType = 'iphone' | 'android';

export interface ClockCustomization {
  fontFamily: 'cairo' | 'tajawal' | 'almarai' | 'scheherazade' | 'mono';
  color: string;
  numeralType: 'arabic' | 'western'; // '١٢:٤٥' or '12:45'
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  showHijriDate: boolean;
}

export interface WallpaperFilterOptions {
  category: WallpaperCategory;
  color: WallpaperColor;
  searchQuery: string;
  sortBy: 'popular' | 'newest' | 'downloads' | 'favorites';
}
