import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  accessibility: {
    largeText: boolean;
    highContrast: boolean;
    voiceNavigation: boolean;
    screenReader: boolean;
    reducedMotion: boolean;
  };
  privacy: {
    shareLocation: boolean;
    shareHealthData: boolean;
    allowAnalytics: boolean;
    dataRetention: '30d' | '90d' | '1y' | 'indefinite';
  };
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  offline: {
    autoSync: boolean;
    syncOnWifiOnly: boolean;
    maxStorageSize: number; // in MB
    retainOfflineData: number; // in days
  };
  location: {
    district: string;
    block: string;
    village?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  biometric: {
    enabled: boolean;
    type: 'fingerprint' | 'face' | 'none';
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    lastBackup?: string;
  };
}

const initialState: SettingsState = {
  theme: 'system',
  language: 'en',
  accessibility: {
    largeText: false,
    highContrast: false,
    voiceNavigation: false,
    screenReader: false,
    reducedMotion: false,
  },
  privacy: {
    shareLocation: true,
    shareHealthData: true,
    allowAnalytics: true,
    dataRetention: '1y',
  },
  notifications: {
    push: true,
    email: false,
    sms: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  },
  offline: {
    autoSync: true,
    syncOnWifiOnly: false,
    maxStorageSize: 100,
    retainOfflineData: 30,
  },
  location: {
    district: '',
    block: '',
    village: '',
  },
  biometric: {
    enabled: false,
    type: 'none',
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'weekly',
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    updateLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    updateAccessibility: (state, action: PayloadAction<Partial<SettingsState['accessibility']>>) => {
      state.accessibility = { ...state.accessibility, ...action.payload };
    },
    updatePrivacy: (state, action: PayloadAction<Partial<SettingsState['privacy']>>) => {
      state.privacy = { ...state.privacy, ...action.payload };
    },
    updateNotifications: (state, action: PayloadAction<Partial<SettingsState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updateOffline: (state, action: PayloadAction<Partial<SettingsState['offline']>>) => {
      state.offline = { ...state.offline, ...action.payload };
    },
    updateLocation: (state, action: PayloadAction<Partial<SettingsState['location']>>) => {
      state.location = { ...state.location, ...action.payload };
    },
    updateBiometric: (state, action: PayloadAction<Partial<SettingsState['biometric']>>) => {
      state.biometric = { ...state.biometric, ...action.payload };
    },
    updateBackup: (state, action: PayloadAction<Partial<SettingsState['backup']>>) => {
      state.backup = { ...state.backup, ...action.payload };
    },
    resetSettings: () => initialState,
    // Bulk update for syncing from server
    syncSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  updateTheme,
  updateLanguage,
  updateAccessibility,
  updatePrivacy,
  updateNotifications,
  updateOffline,
  updateLocation,
  updateBiometric,
  updateBackup,
  resetSettings,
  syncSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;