import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  startVoiceRecording, 
  stopVoiceRecording, 
  updateRecordingDuration,
  processVoiceInput,
  addVoiceNoteToCurrentReading 
} from '@/store/slices/waterQualitySlice';

export interface VoiceRecordingHook {
  isRecording: boolean;
  duration: number;
  startRecording: (fieldTag?: string) => Promise<void>;
  stopRecording: () => Promise<void>;
  playRecording: (audioUrl: string) => Promise<void>;
  deleteRecording: (recordingId: string) => void;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

export const useVoiceRecording = (): VoiceRecordingHook => {
  const dispatch = useAppDispatch();
  const { voiceRecording } = useAppSelector(state => state.waterQuality);
  
  const [hasPermission, setHasPermission] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting audio permission:', error);
      return false;
    }
  }, []);

  const startRecording = useCallback(async (fieldTag?: string): Promise<void> => {
    try {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Audio permission not granted');
        }
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      recordingRef.current = recording;
      dispatch(startVoiceRecording(fieldTag));

      // Start duration timer
      let seconds = 0;
      durationInterval.current = setInterval(() => {
        seconds += 1;
        dispatch(updateRecordingDuration(seconds));
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }, [hasPermission, requestPermission, dispatch]);

  const stopRecording = useCallback(async (): Promise<void> => {
    try {
      if (!recordingRef.current) return;

      // Stop duration timer
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }

      // Stop recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      if (uri) {
        // Convert to blob for processing
        const response = await fetch(uri);
        const audioBlob = await response.blob();
        
        // Process voice input
        const result = await dispatch(processVoiceInput({
          audioBlob,
          fieldTag: voiceRecording.currentField,
          language: 'en', // TODO: Get from user settings
        })).unwrap();
        
        // Add voice note to current reading
        dispatch(addVoiceNoteToCurrentReading(result));
      }

      recordingRef.current = null;
      dispatch(stopVoiceRecording());

    } catch (error) {
      console.error('Error stopping recording:', error);
      dispatch(stopVoiceRecording());
      throw error;
    }
  }, [dispatch, voiceRecording.currentField]);

  const playRecording = useCallback(async (audioUrl: string): Promise<void> => {
    try {
      // Stop any existing playback
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Create and play sound
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      soundRef.current = sound;
      await sound.playAsync();

      // Clean up when finished
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
        }
      });

    } catch (error) {
      console.error('Error playing recording:', error);
      throw error;
    }
  }, []);

  const deleteRecording = useCallback((recordingId: string): void => {
    // TODO: Implement recording deletion
    console.log('Delete recording:', recordingId);
  }, []);

  return {
    isRecording: voiceRecording.isRecording,
    duration: voiceRecording.recordingDuration,
    startRecording,
    stopRecording,
    playRecording,
    deleteRecording,
    hasPermission,
    requestPermission,
  };
};