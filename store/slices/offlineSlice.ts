import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Temporarily disabled NetInfo import
// import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PendingAction {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
}

interface OfflineState {
  isConnected: boolean;
  connectionType: string | null;
  pendingActions: PendingAction[];
  syncInProgress: boolean;
  lastSyncTime: string | null;
  syncErrors: string[];
  offlineData: {
    reports: any[];
    media: any[];
    cachedData: any[];
  };
  storageUsage: {
    used: number; // in MB
    available: number; // in MB
    total: number; // in MB
  };
}

const initialState: OfflineState = {
  isConnected: true,
  connectionType: null,
  pendingActions: [],
  syncInProgress: false,
  lastSyncTime: null,
  syncErrors: [],
  offlineData: {
    reports: [],
    media: [],
    cachedData: [],
  },
  storageUsage: {
    used: 0,
    available: 0,
    total: 0,
  },
};

// Async thunks (temporarily using mock data)
export const initializeNetworkListener = createAsyncThunk(
  'offline/initializeNetworkListener',
  async (_, { dispatch }) => {
    // Mock network listener
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      isConnected: true,
      connectionType: 'wifi',
    };
  }
);

export const addPendingAction = createAsyncThunk(
  'offline/addPendingAction',
  async (action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>, { getState }) => {
    const pendingAction: PendingAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };
    
    // Store in AsyncStorage for persistence
    const state = getState() as { offline: OfflineState };
    const updatedActions = [...state.offline.pendingActions, pendingAction];
    await AsyncStorage.setItem('@health_sentinel_pending_actions', JSON.stringify(updatedActions));
    
    return pendingAction;
  }
);

export const syncPendingActions = createAsyncThunk(
  'offline/syncPendingActions',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      // Mock sync for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const state = getState() as { offline: OfflineState };
      const { pendingActions } = state.offline;
      
      if (pendingActions.length === 0) return { syncedActions: [], failedActions: [] };
      
      // Mock successful sync of all actions
      const syncResults = pendingActions.map(action => action.id);
      const failedActions: PendingAction[] = [];
      
      // Update AsyncStorage
      await AsyncStorage.setItem('@health_sentinel_pending_actions', JSON.stringify(failedActions));
      
      return { syncedActions: syncResults, failedActions };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadPendingActions = createAsyncThunk(
  'offline/loadPendingActions',
  async () => {
    try {
      const storedActions = await AsyncStorage.getItem('@health_sentinel_pending_actions');
      return storedActions ? JSON.parse(storedActions) : [];
    } catch (error) {
      console.error('Failed to load pending actions:', error);
      return [];
    }
  }
);

export const calculateStorageUsage = createAsyncThunk(
  'offline/calculateStorageUsage',
  async () => {
    try {
      // This is a simplified calculation
      // In a real app, you'd calculate actual storage usage
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        if (key.startsWith('@health_sentinel_')) {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            totalSize += new Blob([value]).size;
          }
        }
      }
      
      return {
        used: Math.round(totalSize / (1024 * 1024) * 100) / 100, // Convert to MB
        available: 100, // Assume 100MB available (this would be calculated differently in production)
        total: 100,
      };
    } catch (error) {
      console.error('Failed to calculate storage usage:', error);
      return { used: 0, available: 100, total: 100 };
    }
  }
);

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    updateConnectionStatus: (state, action: PayloadAction<{ isConnected: boolean; connectionType: string }>) => {
      state.isConnected = action.payload.isConnected;
      state.connectionType = action.payload.connectionType;
    },
    removePendingAction: (state, action: PayloadAction<string>) => {
      state.pendingActions = state.pendingActions.filter(action => action.id !== action.payload);
    },
    clearSyncErrors: (state) => {
      state.syncErrors = [];
    },
    addOfflineReport: (state, action: PayloadAction<any>) => {
      state.offlineData.reports.push(action.payload);
    },
    removeOfflineReport: (state, action: PayloadAction<string>) => {
      state.offlineData.reports = state.offlineData.reports.filter(report => report.id !== action.payload);
    },
    addOfflineMedia: (state, action: PayloadAction<any>) => {
      state.offlineData.media.push(action.payload);
    },
    clearOfflineData: (state) => {
      state.offlineData = {
        reports: [],
        media: [],
        cachedData: [],
      };
    },
    updateLastSyncTime: (state) => {
      state.lastSyncTime = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize network listener
      .addCase(initializeNetworkListener.fulfilled, (state, action) => {
        state.isConnected = action.payload.isConnected;
        state.connectionType = action.payload.connectionType;
      })
      
      // Add pending action
      .addCase(addPendingAction.fulfilled, (state, action) => {
        state.pendingActions.push(action.payload);
      })
      
      // Sync pending actions
      .addCase(syncPendingActions.pending, (state) => {
        state.syncInProgress = true;
        state.syncErrors = [];
      })
      .addCase(syncPendingActions.fulfilled, (state, action) => {
        state.syncInProgress = false;
        state.lastSyncTime = new Date().toISOString();
        
        // Remove synced actions
        const { syncedActions, failedActions } = action.payload;
        state.pendingActions = failedActions;
        
        if (syncedActions.length > 0) {
          console.log(`Successfully synced ${syncedActions.length} actions`);
        }
      })
      .addCase(syncPendingActions.rejected, (state, action) => {
        state.syncInProgress = false;
        state.syncErrors.push(action.payload as string);
      })
      
      // Load pending actions
      .addCase(loadPendingActions.fulfilled, (state, action) => {
        state.pendingActions = action.payload;
      })
      
      // Calculate storage usage
      .addCase(calculateStorageUsage.fulfilled, (state, action) => {
        state.storageUsage = action.payload;
      });
  },
});

export const {
  updateConnectionStatus,
  removePendingAction,
  clearSyncErrors,
  addOfflineReport,
  removeOfflineReport,
  addOfflineMedia,
  clearOfflineData,
  updateLastSyncTime,
} = offlineSlice.actions;

export default offlineSlice.reducer;