import { Contact, CallLog, CallWallpaper, SimCard, USSDCode, Voicemail } from '../types/phone';
import { INITIAL_CONTACTS, INITIAL_CALL_LOGS, INITIAL_WALLPAPERS, INITIAL_SIM_CARDS, INITIAL_USSD_CODES, INITIAL_VOICEMAILS } from '../data/phoneData';

const KEYS = {
  CONTACTS: 'phoneplus_contacts',
  CALL_LOGS: 'phoneplus_call_logs',
  WALLPAPERS: 'phoneplus_wallpapers',
  ACTIVE_WALLPAPER: 'phoneplus_active_wallpaper_id',
  SIM_CARDS: 'phoneplus_sim_cards',
  USSD_CODES: 'phoneplus_ussd_codes',
  VOICEMAILS: 'phoneplus_voicemails',
  BLOCKED_NUMBERS: 'phoneplus_blocked_numbers',
  SETTINGS: 'phoneplus_settings',
};

export interface AppSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  autoRecord: boolean;
  activeRingtone: 'marimba' | 'cosmic' | 'classic';
  incomingDelaySeconds: number;
  phoneFrameMode: boolean; // whether to show device mock frame or fluid
  defaultSimId: 'sim1' | 'sim2';
}

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  autoRecord: false,
  activeRingtone: 'marimba',
  incomingDelaySeconds: 3,
  phoneFrameMode: true,
  defaultSimId: 'sim1',
};

export const phoneStorage = {
  getContacts: (): Contact[] => {
    try {
      const data = localStorage.getItem(KEYS.CONTACTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.some((c: Contact) => c.phone.startsWith('059') || c.name.includes('جوال'))) {
          return parsed;
        }
      }
      return INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  },

  saveContacts: (contacts: Contact[]) => {
    try {
      localStorage.setItem(KEYS.CONTACTS, JSON.stringify(contacts));
    } catch {}
  },

  getCallLogs: (): CallLog[] => {
    try {
      const data = localStorage.getItem(KEYS.CALL_LOGS);
      return data ? JSON.parse(data) : INITIAL_CALL_LOGS;
    } catch {
      return INITIAL_CALL_LOGS;
    }
  },

  saveCallLogs: (logs: CallLog[]) => {
    try {
      localStorage.setItem(KEYS.CALL_LOGS, JSON.stringify(logs));
    } catch {}
  },

  addCallLog: (log: Omit<CallLog, 'id'>): CallLog => {
    const logs = phoneStorage.getCallLogs();
    const newLog: CallLog = {
      ...log,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    };
    const updated = [newLog, ...logs];
    phoneStorage.saveCallLogs(updated);
    return newLog;
  },

  getWallpapers: (): CallWallpaper[] => {
    try {
      const data = localStorage.getItem(KEYS.WALLPAPERS);
      if (data) {
        const stored: CallWallpaper[] = JSON.parse(data);
        // Merge with initial if missing
        const ids = new Set(stored.map(w => w.id));
        const merged = [...stored];
        for (const init of INITIAL_WALLPAPERS) {
          if (!ids.has(init.id)) {
            merged.push(init);
          }
        }
        return merged;
      }
      return INITIAL_WALLPAPERS;
    } catch {
      return INITIAL_WALLPAPERS;
    }
  },

  saveWallpapers: (wallpapers: CallWallpaper[]) => {
    try {
      localStorage.setItem(KEYS.WALLPAPERS, JSON.stringify(wallpapers));
    } catch {}
  },

  getActiveWallpaperId: (): string => {
    try {
      return localStorage.getItem(KEYS.ACTIVE_WALLPAPER) || INITIAL_WALLPAPERS[0].id;
    } catch {
      return INITIAL_WALLPAPERS[0].id;
    }
  },

  setActiveWallpaperId: (id: string) => {
    try {
      localStorage.setItem(KEYS.ACTIVE_WALLPAPER, id);
    } catch {}
  },

  getSimCards: (): SimCard[] => {
    try {
      const data = localStorage.getItem(KEYS.SIM_CARDS);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.some((s: SimCard) => s.carrierName.includes('جوال'))) {
          return parsed;
        }
      }
      return INITIAL_SIM_CARDS;
    } catch {
      return INITIAL_SIM_CARDS;
    }
  },

  saveSimCards: (sims: SimCard[]) => {
    try {
      localStorage.setItem(KEYS.SIM_CARDS, JSON.stringify(sims));
    } catch {}
  },

  getUSSDCodes: (): USSDCode[] => {
    try {
      const data = localStorage.getItem(KEYS.USSD_CODES);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.some((u: USSDCode) => u.carrier.includes('جوال'))) {
          return parsed;
        }
      }
      return INITIAL_USSD_CODES;
    } catch {
      return INITIAL_USSD_CODES;
    }
  },

  saveUSSDCodes: (codes: USSDCode[]) => {
    try {
      localStorage.setItem(KEYS.USSD_CODES, JSON.stringify(codes));
    } catch {}
  },

  getVoicemails: (): Voicemail[] => {
    try {
      const data = localStorage.getItem(KEYS.VOICEMAILS);
      return data ? JSON.parse(data) : INITIAL_VOICEMAILS;
    } catch {
      return INITIAL_VOICEMAILS;
    }
  },

  saveVoicemails: (voicemails: Voicemail[]) => {
    try {
      localStorage.setItem(KEYS.VOICEMAILS, JSON.stringify(voicemails));
    } catch {}
  },

  getBlockedNumbers: (): string[] => {
    try {
      const data = localStorage.getItem(KEYS.BLOCKED_NUMBERS);
      return data ? JSON.parse(data) : ['0598887766'];
    } catch {
      return [];
    }
  },

  saveBlockedNumbers: (numbers: string[]) => {
    try {
      localStorage.setItem(KEYS.BLOCKED_NUMBERS, JSON.stringify(numbers));
    } catch {}
  },

  getSettings: (): AppSettings => {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: AppSettings) => {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  },

  resetDefaults: () => {
    localStorage.clear();
  },
};
