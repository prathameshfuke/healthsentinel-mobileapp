import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { LanguageContext } from '@/context/LanguageContext';
import { AccessibilityContext } from '@/context/AccessibilityContext';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

interface VoiceInputProps {
  fieldTag?: string;
  onTranscription?: (text: string) => void;
  onVoiceNote?: (voiceNote: any) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  showDuration?: boolean;
  style?: any;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  fieldTag,
  onTranscription,
  onVoiceNote,
  disabled = false,
  size = 'medium',
  showDuration = true,
  style,
}) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { accessibility } = useContext(AccessibilityContext);
  
  const {
    isRecording,
    duration,
    startRecording,
    stopRecording,
    hasPermission,
    requestPermission,
  } = useVoiceRecording();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 36, height: 36, iconSize: 18 };
      case 'large':
        return { width: 64, height: 64, iconSize: 32 };
      default:
        return { width: 48, height: 48, iconSize: 24 };
    }
  };

  const sizeStyles = getSizeStyles();

  const handlePress = async () => {
    if (disabled) return;

    try {
      if (isRecording) {
        await stopRecording();
      } else {
        if (!hasPermission) {
          const granted = await requestPermission();
          if (!granted) {
            Alert.alert(
              t('common.error'),
              'Microphone permission is required for voice input'
            );
            return;
          }
        }
        await startRecording(fieldTag);
      }
    } catch (error) {
      Alert.alert(
        t('common.error'),
        'Failed to start voice recording. Please try again.'
      );
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.voiceButton,
          {
            backgroundColor: isRecording ? theme.error : theme.primary,
            width: sizeStyles.width,
            height: sizeStyles.height,
            opacity: disabled ? 0.5 : 1,
          }
        ]}
        onPress={handlePress}
        disabled={disabled}
        accessible={true}
        accessibilityLabel={
          isRecording 
            ? t('voice.stopRecording') 
            : t('voice.startRecording')
        }
        accessibilityRole="button"
      >
        <Ionicons 
          name={isRecording ? 'stop' : 'mic'} 
          size={sizeStyles.iconSize} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
      
      {showDuration && isRecording && (
        <View style={styles.durationContainer}>
          <View style={[styles.recordingIndicator, { backgroundColor: theme.error }]} />
          <Text 
            style={[
              styles.durationText, 
              { 
                color: theme.text,
                fontSize: accessibility.largeText ? 16 : 14,
              }
            ]}
          >
            {formatDuration(duration)}
          </Text>
        </View>
      )}
      
      {isRecording && (
        <Text 
          style={[
            styles.recordingHint, 
            { 
              color: theme.textSecondary,
              fontSize: accessibility.largeText ? 14 : 12,
            }
          ]}
        >
          {fieldTag 
            ? t('voice.speakFieldValue', { field: fieldTag })
            : t('voice.speakNow')
          }
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  voiceButton: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  durationText: {
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  recordingHint: {
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 200,
  },
});