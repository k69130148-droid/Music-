export interface DrivePhoto {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number; // in bytes
  blob: Blob;
  thumbnailUrl?: string;
  folderId: string;
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
  isTrash: boolean;
  trashDate: number | null;
  tags: string[];
  note?: string;
  width?: number;
  height?: number;
  isVault?: boolean;
  colorTag?: string;
  userEmail?: string;
}

export interface DriveFolder {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: number;
  isSystem?: boolean;
  isVault?: boolean;
  itemCount?: number;
}

export type DriveViewMode = 'grid' | 'list' | 'timeline';
export type DriveNavTab = 'all' | 'folders' | 'starred' | 'recent' | 'trash' | 'vault';
export type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc';

export interface StorageStats {
  usedBytes: number;
  photoCount: number;
  folderCount: number;
  trashCount: number;
  quotaBytes?: number;
  usagePercent?: number;
}

export interface AccountProfile {
  name: string;
  email?: string;
  phone: string;
  countryCode: string;
  isPhoneVerified: boolean;
  recoveryKey: string;
  pin?: string;
  registeredAt: number;
  updatedAt: number;
  isSignedInWithGoogle?: boolean;
  avatarUrl?: string;
  googleId?: string;
}

