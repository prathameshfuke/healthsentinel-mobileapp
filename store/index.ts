import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import authSlice from './slices/authSlice';
import healthDataSlice from './slices/healthDataSlice';
import alertsSlice from './slices/alertsSlice';
import settingsSlice from './slices/settingsSlice';
import offlineSlice from './slices/offlineSlice';
import waterQualitySlice from './slices/waterQualitySlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'settings', 'offline', 'waterQuality'], // Only persist these slices
  blacklist: ['healthData', 'alerts'], // Don't persist real-time data
};

const rootReducer = combineReducers({
  auth: authSlice,
  healthData: healthDataSlice,
  alerts: alertsSlice,
  settings: settingsSlice,
  offline: offlineSlice,
  waterQuality: waterQualitySlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST', 
          'persist/REHYDRATE',
          'offline/initializeNetworkListener/fulfilled',
        ],
        ignoredPaths: ['offline.unsubscribe'],
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;