import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Temporarily disabled Firebase import
// import firestore from '@react-native-firebase/firestore';

export interface HealthReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterRole: 'health_official' | 'asha_worker' | 'villager';
  symptoms: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    address: string;
    district: string;
    block: string;
    village?: string;
  };
  patientInfo: {
    age: number;
    gender: 'male' | 'female' | 'other';
    familyId?: string;
  };
  media: {
    photos: string[];
    audio: string[];
  };
  status: 'pending' | 'reviewed' | 'investigating' | 'resolved';
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  notes?: string;
  followUpRequired: boolean;
}

export interface OutbreakData {
  id: string;
  disease: string;
  location: {
    latitude: number;
    longitude: number;
    district: string;
    block: string;
    radius: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  caseCount: number;
  confirmedCases: number;
  suspectedCases: number;
  deaths: number;
  recoveries: number;
  status: 'active' | 'contained' | 'resolved';
  firstReportedAt: string;
  lastUpdatedAt: string;
  affectedPopulation: number;
  interventions: string[];
}

interface HealthDataState {
  reports: HealthReport[];
  outbreaks: OutbreakData[];
  dashboardStats: {
    totalReports: number;
    activeOutbreaks: number;
    ashaWorkers: number;
    avgResponseTime: string;
  };
  loading: boolean;
  error: string | null;
  lastSync: string | null;
  filters: {
    dateRange: { start: string; end: string };
    severity: string[];
    status: string[];
    location: string[];
  };
}

const initialState: HealthDataState = {
  reports: [],
  outbreaks: [],
  dashboardStats: {
    totalReports: 0,
    activeOutbreaks: 0,
    ashaWorkers: 0,
    avgResponseTime: '0h',
  },
  loading: false,
  error: null,
  lastSync: null,
  filters: {
    dateRange: { start: '', end: '' },
    severity: [],
    status: [],
    location: [],
  },
};

// Async thunks (temporarily using mock data)
export const fetchHealthReports = createAsyncThunk(
  'healthData/fetchHealthReports',
  async (filters?: any, { rejectWithValue }) => {
    try {
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReports: HealthReport[] = [
        {
          id: '1',
          reporterId: '2',
          reporterName: 'Priya Devi',
          reporterRole: 'asha_worker',
          symptoms: ['Fever', 'Headache', 'Body pain'],
          severity: 'medium',
          location: {
            latitude: 26.2006,
            longitude: 92.9376,
            address: 'Village A, Block 1',
            district: 'Guwahati',
            block: 'Block 1',
            village: 'Village A',
          },
          patientInfo: {
            age: 35,
            gender: 'male',
          },
          media: {
            photos: [],
            audio: [],
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          followUpRequired: true,
        },
        {
          id: '2',
          reporterId: '3',
          reporterName: 'Ram Singh',
          reporterRole: 'villager',
          symptoms: ['Cough', 'Fever'],
          severity: 'low',
          location: {
            latitude: 26.1445,
            longitude: 91.7362,
            address: 'Village B, Block 2',
            district: 'Guwahati',
            block: 'Block 2',
            village: 'Village B',
          },
          patientInfo: {
            age: 28,
            gender: 'female',
          },
          media: {
            photos: [],
            audio: [],
          },
          status: 'reviewed',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
          followUpRequired: false,
        },
      ];
      
      return mockReports;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitHealthReport = createAsyncThunk(
  'healthData/submitHealthReport',
  async (report: Omit<HealthReport, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReport: HealthReport = {
        ...report,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newReport;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOutbreaks = createAsyncThunk(
  'healthData/fetchOutbreaks',
  async (_, { rejectWithValue }) => {
    try {
      // Mock outbreak data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockOutbreaks: OutbreakData[] = [
        {
          id: '1',
          disease: 'Dengue',
          location: {
            latitude: 26.2006,
            longitude: 92.9376,
            district: 'Guwahati',
            block: 'Block 1',
            radius: 5000,
          },
          severity: 'high',
          caseCount: 15,
          confirmedCases: 12,
          suspectedCases: 3,
          deaths: 0,
          recoveries: 8,
          status: 'active',
          firstReportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          affectedPopulation: 5000,
          interventions: ['Vector control', 'Health education'],
        },
      ];
      
      return mockOutbreaks;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateReportStatus = createAsyncThunk(
  'healthData/updateReportStatus',
  async ({ reportId, status, notes }: { reportId: string; status: string; notes?: string }, { rejectWithValue }) => {
    try {
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 500));
      return { reportId, status, notes };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const healthDataSlice = createSlice({
  name: 'healthData',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateLastSync: (state) => {
      state.lastSync = new Date().toISOString();
    },
    // Optimistic updates for offline support
    addReportOptimistic: (state, action: PayloadAction<HealthReport>) => {
      state.reports.unshift(action.payload);
    },
    removeReportOptimistic: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter(report => report.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch health reports
      .addCase(fetchHealthReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
        state.lastSync = new Date().toISOString();
      })
      .addCase(fetchHealthReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Submit health report
      .addCase(submitHealthReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitHealthReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload);
      })
      .addCase(submitHealthReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch outbreaks
      .addCase(fetchOutbreaks.fulfilled, (state, action) => {
        state.outbreaks = action.payload;
        state.dashboardStats.activeOutbreaks = action.payload.length;
      })
      
      // Update report status
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        const { reportId, status, notes } = action.payload;
        const reportIndex = state.reports.findIndex(report => report.id === reportId);
        if (reportIndex !== -1) {
          state.reports[reportIndex].status = status as any;
          if (notes) state.reports[reportIndex].notes = notes;
          state.reports[reportIndex].updatedAt = new Date().toISOString();
        }
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  updateLastSync,
  addReportOptimistic,
  removeReportOptimistic,
} = healthDataSlice.actions;

export default healthDataSlice.reducer;