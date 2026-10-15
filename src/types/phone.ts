export type CallType = 'incoming' | 'outgoing' | 'missed' | 'rejected';

export type SimSlotId = 'sim1' | 'sim2';

export interface SimCard {
  id: SimSlotId;
  slot: 1 | 2;
  carrierName: string;
  phoneNumber: string;
  color: string; // hex or tailwind class
  accentBg: string;
  signalBars: number; // 1 to 5
  networkType: '5G' | '4G+' | '4G' | 'VoLTE' | 'VoWiFi';
  isDefault: boolean;
  balance: string;
  planData: string;
  roaming: boolean;
  pinLocked: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  secondaryPhone?: string;
  email?: string;
  avatar?: string;
  company?: string;
  title?: string;
  note?: string;
  isFavorite: boolean;
  customWallpaperId?: string;
  preferredSim?: SimSlotId;
  ringtone?: string;
  lastCallTimestamp?: number;
}

export interface CallLog {
  id: string;
  name: string;
  number: string;
  type: CallType;
  timestamp: number;
  durationSeconds: number;
  simId: SimSlotId;
  contactId?: string;
  recordedAudioUrl?: string;
  note?: string;
}

export interface CallWallpaper {
  id: string;
  title: string;
  category: 'luxury' | 'aurora' | 'nature' | 'cyber' | 'gradient' | 'custom';
  imageSrc?: string;
  gradientCss?: string;
  blur: number; // in px
  darkness: number; // 0 to 100%
  animationType: 'none' | 'aurora' | 'pulse' | 'particles';
  isCustom?: boolean;
}

export interface USSDCode {
  id: string;
  code: string;
  label: string;
  country: string;
  carrier: string;
  category: 'balance' | 'packages' | 'services' | 'device' | 'transfer';
  simSlot: 'any' | SimSlotId;
  responseMock: string;
}

export interface Voicemail {
  id: string;
  callerName: string;
  callerNumber: string;
  timestamp: number;
  durationSeconds: number;
  isRead: boolean;
  transcript: string;
}

export interface ActiveCallState {
  status: 'dialing' | 'ringing' | 'connected' | 'incoming';
  number: string;
  name: string;
  contact?: Contact;
  simId: SimSlotId;
  startTime?: number;
  duration: number;
  isMuted: boolean;
  isSpeaker: boolean;
  isRecording: boolean;
  isHold: boolean;
  isKeypadOpen: boolean;
  wallpaper: CallWallpaper;
}
