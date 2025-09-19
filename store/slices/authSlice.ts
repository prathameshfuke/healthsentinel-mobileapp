import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Temporarily disabled Firebase imports
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

export interface User {
  id: string;
  name: string;
  role: 'health_official' | 'asha_worker' | 'villager';
  phone?: string;
  email?: string;
  profilePicture?: string;
  location?: {
    district: string;
    block: string;
    village?: string;
  };
  permissions: string[];
  lastActive: string;
  isOnline: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  sessionToken: string | null;
  biometricEnabled: boolean;
  mfaEnabled: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  sessionToken: null,
  biometricEnabled: false,
  mfaEnabled: false,
};

// Async thunks for authentication (temporarily using mock data)
export const signInWithPhone = createAsyncThunk(
  'auth/signInWithPhone',
  async ({ phoneNumber }: { phoneNumber: string }, { rejectWithValue }) => {
    try {
      // Mock Firebase phone authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { confirmation: { phoneNumber }, phoneNumber };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ confirmation, otp }: { confirmation: any; otp: string }, { rejectWithValue }) => {
    try {
      // Mock OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp !== '123456') {
        throw new Error('Invalid OTP');
      }
      
      // Mock user data based on phone number
      const demoUsers = [
        { id: '1', name: 'Dr. Rajesh Kumar', role: 'health_official', phone: '+911234567890' },
        { id: '2', name: 'Priya Devi', role: 'asha_worker', phone: '+919876543210' },
        { id: '3', name: 'Ram Singh', role: 'villager', phone: '+918765432109' },
      ];
      
      const user = demoUsers.find(u => u.phone === confirmation.phoneNumber);
      if (!user) {
        throw new Error('User not found');
      }
      
      const userData: User = {
        ...user,
        role: user.role as any,
        permissions: ['basic_access'],
        lastActive: new Date().toISOString(),
        isOnline: true,
      };
      
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      // Mock sign out
      await new Promise(resolve => setTimeout(resolve, 500));
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (updates: Partial<User>, { getState, rejectWithValue }) => {
    try {
      // Mock profile update
      await new Promise(resolve => setTimeout(resolve, 500));
      return updates;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUserOnlineStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isOnline = action.payload;
        state.user.lastActive = new Date().toISOString();
      }
    },
    enableBiometric: (state) => {
      state.biometricEnabled = true;
    },
    disableBiometric: (state) => {
      state.biometricEnabled = false;
    },
    enableMFA: (state) => {
      state.mfaEnabled = true;
    },
    disableMFA: (state) => {
      state.mfaEnabled = false;
    },
    // Demo login for development
    demoLogin: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign in with phone
      .addCase(signInWithPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithPhone.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signInWithPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Sign out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.sessionToken = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      });
  },
});

export const {
  clearError,
  setUserOnlineStatus,
  enableBiometric,
  disableBiometric,
  enableMFA,
  disableMFA,
  demoLogin,
} = authSlice.actions;

export default authSlice.reducer;