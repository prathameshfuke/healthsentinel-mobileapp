import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Temporarily disabled Firebase imports
// import firestore from '@react-native-firebase/firestore';
// import messaging from '@react-native-firebase/messaging';

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'outbreak' | 'weather' | 'system' | 'emergency' | 'reminder';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: {
    district: string;
    block: string;
    village?: string;
    radius?: number;
  };
  targetRoles: ('health_official' | 'asha_worker' | 'villager')[];
  isRead: boolean;
  isActionRequired: boolean;
  actionUrl?: string;
  expiresAt?: string;
  createdAt: string;
  createdBy: string;
  metadata?: {
    outbreakId?: string;
    reportId?: string;
    weatherData?: any;
  };
}

interface AlertsState {
  alerts: Alert[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fcmToken: string | null;
  notificationPermission: 'granted' | 'denied' | 'not-determined';
  preferences: {
    enablePushNotifications: boolean;
    enableSoundAlerts: boolean;
    enableVibration: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    severityFilter: ('low' | 'medium' | 'high' | 'critical')[];
  };
}

const initialState: AlertsState = {
  alerts: [],
  unreadCount: 0,
  loading: false,
  error: null,
  fcmToken: null,
  notificationPermission: 'not-determined',
  preferences: {
    enablePushNotifications: true,
    enableSoundAlerts: true,
    enableVibration: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
    severityFilter: ['medium', 'high', 'critical'],
  },
};

// Async thunks (temporarily using mock data)
export const initializeMessaging = createAsyncThunk(
  'alerts/initializeMessaging',
  async (_, { rejectWithValue }) => {
    try {
      // Mock messaging initialization
      await new Promise(resolve => setTimeout(resolve, 500));
      return { token: 'mock_fcm_token', permission: 'granted' as const };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async ({ userId, userRole }: { userId: string; userRole: string }, { rejectWithValue }) => {
    try {
      // Mock alerts data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockAlerts: Alert[] = [
        {
          id: '1',
          title: 'Dengue Outbreak Alert',
          message: 'Increased dengue cases reported in Block 1. Take preventive measures.',
          type: 'outbreak',
          severity: 'high',
          location: {
            district: 'Guwahati',
            block: 'Block 1',
            radius: 5000,
          },
          targetRoles: ['health_official', 'asha_worker'],
          isRead: false,
          isActionRequired: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          createdBy: 'system',
        },
        {
          id: '2',
          title: 'Weather Warning',
          message: 'Heavy rainfall expected. Monitor for waterborne diseases.',
          type: 'weather',
          severity: 'medium',
          targetRoles: ['health_official', 'asha_worker', 'villager'],
          isRead: false,
          isActionRequired: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          createdBy: 'weather_service',
        },
      ];
      
      return mockAlerts.filter(alert => alert.targetRoles.includes(userRole as any));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAlertAsRead = createAsyncThunk(
  'alerts/markAlertAsRead',
  async ({ alertId, userId }: { alertId: string; userId: string }, { rejectWithValue }) => {
    try {
      // Mock mark as read
      await new Promise(resolve => setTimeout(resolve, 200));
      return alertId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createAlert = createAsyncThunk(
  'alerts/createAlert',
  async (alert: Omit<Alert, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      // Mock alert creation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAlert: Alert = {
        ...alert,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      return newAlert;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const subscribeToLocationAlerts = createAsyncThunk(
  'alerts/subscribeToLocationAlerts',
  async ({ district, block }: { district: string; block: string }, { rejectWithValue }) => {
    try {
      // Mock subscription
      await new Promise(resolve => setTimeout(resolve, 200));
      const topic = `alerts_${district}_${block}`.toLowerCase().replace(/\s+/g, '_');
      return topic;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    updatePreferences: (state, action: PayloadAction<Partial<AlertsState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    markAllAsRead: (state) => {
      state.alerts = state.alerts.map(alert => ({ ...alert, isRead: true }));
      state.unreadCount = 0;
    },
    removeExpiredAlerts: (state) => {
      const now = new Date().toISOString();
      state.alerts = state.alerts.filter(alert => 
        !alert.expiresAt || alert.expiresAt > now
      );
    },
    setFCMToken: (state, action: PayloadAction<string>) => {
      state.fcmToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize messaging
      .addCase(initializeMessaging.fulfilled, (state, action) => {
        state.fcmToken = action.payload.token;
        state.notificationPermission = action.payload.permission;
      })
      .addCase(initializeMessaging.rejected, (state, action) => {
        state.error = action.payload as string;
        state.notificationPermission = 'denied';
      })
      
      // Fetch alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
        state.unreadCount = action.payload.filter(alert => !alert.isRead).length;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Mark alert as read
      .addCase(markAlertAsRead.fulfilled, (state, action) => {
        const alertIndex = state.alerts.findIndex(alert => alert.id === action.payload);
        if (alertIndex !== -1 && !state.alerts[alertIndex].isRead) {
          state.alerts[alertIndex].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Create alert
      .addCase(createAlert.fulfilled, (state, action) => {
        state.alerts.unshift(action.payload);
      });
  },
});

export const {
  clearError,
  addAlert,
  updatePreferences,
  markAllAsRead,
  removeExpiredAlerts,
  setFCMToken,
} = alertsSlice.actions;

export default alertsSlice.reducer;