import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface WaterQualityReading {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterRole: 'health_official' | 'asha_worker' | 'villager';
  
  // Water Quality Parameters
  parameters: {
    pH?: number;
    turbidity?: number; // NTU
    electricalConductivity?: number; // μS/cm
    temperature?: number; // °C
    dissolvedOxygen?: number; // mg/L
    totalDissolvedSolids?: number; // ppm
    chlorine?: number; // mg/L
    fluoride?: number; // mg/L
    arsenic?: number; // ppb
    iron?: number; // mg/L
    nitrate?: number; // mg/L
    coliform?: number; // CFU/100ml
  };
  
  // Source Information
  sourceInfo: {
    type: 'well' | 'river' | 'tap' | 'storage_tank' | 'pond' | 'borewell' | 'other';
    customType?: string;
    depth?: number; // for wells
    isPublicSource: boolean;
    householdId?: string;
    sourceName?: string;
  };
  
  // Location Data
  location: {
    latitude: number;
    longitude: number;
    address: string;
    district: string;
    block: string;
    village?: string;
    accuracy?: number;
  };
  
  // Media & Documentation
  media: {
    photos: string[]; // URLs to photos
    voiceNotes: VoiceNote[];
    testKitPhotos: string[]; // Photos of test kit readings
  };
  
  // Quality Assessment
  assessment: {
    overallQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unsafe';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    issues: string[]; // Array of identified issues
    recommendations: string[];
  };
  
  // Metadata
  testKitUsed?: string;
  weatherConditions?: string;
  notes: string;
  voiceTranscription?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'flagged';
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
  
  // ML/Analytics Tags
  tags: string[];
  anomalyScore?: number;
  riskPrediction?: {
    outbreakRisk: number;
    contaminationRisk: number;
    seasonalRisk: number;
  };
}

export interface VoiceNote {
  id: string;
  audioUrl: string;
  transcription?: string;
  duration: number; // seconds
  timestamp: string;
  fieldTag?: string; // Which field this voice note relates to
  language?: string;
}

export interface WaterQualityDraft {
  id: string;
  data: Partial<WaterQualityReading>;
  lastModified: string;
}

interface WaterQualityState {
  readings: WaterQualityReading[];
  drafts: WaterQualityDraft[];
  currentReading: Partial<WaterQualityReading> | null;
  loading: boolean;
  error: string | null;
  voiceRecording: {
    isRecording: boolean;
    currentField?: string;
    recordingDuration: number;
  };
  filters: {
    dateRange: { start: string; end: string };
    sourceTypes: string[];
    qualityLevels: string[];
    riskLevels: string[];
    location: string[];
  };
  analytics: {
    totalReadings: number;
    riskySources: number;
    averageQuality: number;
    trendData: Array<{
      date: string;
      averageQuality: number;
      riskySources: number;
    }>;
  };
}

const initialState: WaterQualityState = {
  readings: [],
  drafts: [],
  currentReading: null,
  loading: false,
  error: null,
  voiceRecording: {
    isRecording: false,
    recordingDuration: 0,
  },
  filters: {
    dateRange: { start: '', end: '' },
    sourceTypes: [],
    qualityLevels: [],
    riskLevels: [],
    location: [],
  },
  analytics: {
    totalReadings: 0,
    riskySources: 0,
    averageQuality: 0,
    trendData: [],
  },
};

// Async thunks
export const submitWaterQualityReading = createAsyncThunk(
  'waterQuality/submitReading',
  async (reading: Omit<WaterQualityReading, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Mock submission - replace with actual Firebase call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReading: WaterQualityReading = {
        ...reading,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newReading;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWaterQualityReadings = createAsyncThunk(
  'waterQuality/fetchReadings',
  async (filters?: any, { rejectWithValue }) => {
    try {
      // Mock fetch - replace with actual Firebase call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockReadings: WaterQualityReading[] = [
        {
          id: '1',
          reporterId: '2',
          reporterName: 'Priya Devi',
          reporterRole: 'asha_worker',
          parameters: {
            pH: 7.2,
            turbidity: 3.5,
            electricalConductivity: 450,
            temperature: 24.5,
            dissolvedOxygen: 6.8,
            chlorine: 0.2,
          },
          sourceInfo: {
            type: 'well',
            depth: 15,
            isPublicSource: true,
            sourceName: 'Village Well #1',
          },
          location: {
            latitude: 26.2006,
            longitude: 92.9376,
            address: 'Village A, Block 1',
            district: 'Guwahati',
            block: 'Block 1',
            village: 'Village A',
          },
          media: {
            photos: [],
            voiceNotes: [],
            testKitPhotos: [],
          },
          assessment: {
            overallQuality: 'good',
            riskLevel: 'low',
            issues: [],
            recommendations: ['Regular monitoring recommended'],
          },
          notes: 'Water appears clear, no unusual odor',
          status: 'submitted',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          tags: ['routine_monitoring'],
        },
      ];
      
      return mockReadings;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const processVoiceInput = createAsyncThunk(
  'waterQuality/processVoiceInput',
  async ({ audioBlob, fieldTag, language = 'en' }: { 
    audioBlob: Blob; 
    fieldTag?: string; 
    language?: string; 
  }, { rejectWithValue }) => {
    try {
      // Mock voice processing - replace with actual speech-to-text service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcription based on field
      const mockTranscriptions: Record<string, string> = {
        'pH': 'pH value is 7.3',
        'turbidity': 'Turbidity reading is 4.6 NTU',
        'temperature': 'Temperature is 25.2 degrees Celsius',
        'notes': 'Water sample collected from the main village well. Water appears slightly cloudy with mild chlorine smell.',
        'default': 'Voice input processed successfully',
      };
      
      const transcription = mockTranscriptions[fieldTag || 'default'] || mockTranscriptions.default;
      
      const voiceNote: VoiceNote = {
        id: Date.now().toString(),
        audioUrl: URL.createObjectURL(audioBlob),
        transcription,
        duration: 5, // Mock duration
        timestamp: new Date().toISOString(),
        fieldTag,
        language,
      };
      
      return voiceNote;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const waterQualitySlice = createSlice({
  name: 'waterQuality',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    setCurrentReading: (state, action: PayloadAction<Partial<WaterQualityReading>>) => {
      state.currentReading = action.payload;
    },
    
    updateCurrentReading: (state, action: PayloadAction<Partial<WaterQualityReading>>) => {
      if (state.currentReading) {
        state.currentReading = { ...state.currentReading, ...action.payload };
      } else {
        state.currentReading = action.payload;
      }
    },
    
    saveDraft: (state, action: PayloadAction<Partial<WaterQualityReading>>) => {
      const draftId = action.payload.id || Date.now().toString();
      const existingDraftIndex = state.drafts.findIndex(draft => draft.id === draftId);
      
      const draft: WaterQualityDraft = {
        id: draftId,
        data: action.payload,
        lastModified: new Date().toISOString(),
      };
      
      if (existingDraftIndex >= 0) {
        state.drafts[existingDraftIndex] = draft;
      } else {
        state.drafts.push(draft);
      }
    },
    
    deleteDraft: (state, action: PayloadAction<string>) => {
      state.drafts = state.drafts.filter(draft => draft.id !== action.payload);
    },
    
    startVoiceRecording: (state, action: PayloadAction<string | undefined>) => {
      state.voiceRecording.isRecording = true;
      state.voiceRecording.currentField = action.payload;
      state.voiceRecording.recordingDuration = 0;
    },
    
    stopVoiceRecording: (state) => {
      state.voiceRecording.isRecording = false;
      state.voiceRecording.currentField = undefined;
      state.voiceRecording.recordingDuration = 0;
    },
    
    updateRecordingDuration: (state, action: PayloadAction<number>) => {
      state.voiceRecording.recordingDuration = action.payload;
    },
    
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    addVoiceNoteToCurrentReading: (state, action: PayloadAction<VoiceNote>) => {
      if (state.currentReading) {
        if (!state.currentReading.media) {
          state.currentReading.media = { photos: [], voiceNotes: [], testKitPhotos: [] };
        }
        state.currentReading.media.voiceNotes.push(action.payload);
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Submit water quality reading
      .addCase(submitWaterQualityReading.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitWaterQualityReading.fulfilled, (state, action) => {
        state.loading = false;
        state.readings.unshift(action.payload);
        state.currentReading = null;
        state.analytics.totalReadings += 1;
      })
      .addCase(submitWaterQualityReading.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch water quality readings
      .addCase(fetchWaterQualityReadings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWaterQualityReadings.fulfilled, (state, action) => {
        state.loading = false;
        state.readings = action.payload;
        state.analytics.totalReadings = action.payload.length;
        state.analytics.riskySources = action.payload.filter(r => 
          r.assessment.riskLevel === 'high' || r.assessment.riskLevel === 'critical'
        ).length;
      })
      .addCase(fetchWaterQualityReadings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Process voice input
      .addCase(processVoiceInput.pending, (state) => {
        state.loading = true;
      })
      .addCase(processVoiceInput.fulfilled, (state, action) => {
        state.loading = false;
        // Voice note will be added to current reading via separate action
      })
      .addCase(processVoiceInput.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentReading,
  updateCurrentReading,
  saveDraft,
  deleteDraft,
  startVoiceRecording,
  stopVoiceRecording,
  updateRecordingDuration,
  setFilters,
  clearFilters,
  addVoiceNoteToCurrentReading,
} = waterQualitySlice.actions;

export default waterQualitySlice.reducer;