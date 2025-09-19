import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { ThemeContext } from '@/context/ThemeContext';
import { LanguageContext } from '@/context/LanguageContext';
import { AccessibilityContext } from '@/context/AccessibilityContext';
import { VoiceInput } from './VoiceInput';

interface WaterParameterInputProps {
  label: string;
  value?: number;
  onValueChange: (value: number | undefined) => void;
  unit: string;
  range: { min: number; max: number; step: number };
  description?: string;
  voiceEnabled?: boolean;
  fieldTag?: string;
  qualityIndicator?: {
    excellent: { min: number; max: number };
    good: { min: number; max: number };
    fair: { min: number; max: number };
    poor: { min: number; max: number };
  };
}

export const WaterParameterInput: React.FC<WaterParameterInputProps> = ({
  label,
  value,
  onValueChange,
  unit,
  range,
  description,
  voiceEnabled = true,
  fieldTag,
  qualityIndicator,
}) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { accessibility } = useContext(AccessibilityContext);
  
  const [inputMode, setInputMode] = useState<'slider' | 'text'>('slider');
  const [textValue, setTextValue] = useState(value?.toString() || '');

  const getQualityColor = (val: number): string => {
    if (!qualityIndicator) return theme.primary;
    
    if (val >= qualityIndicator.excellent.min && val <= qualityIndicator.excellent.max) {
      return '#059669'; // Green
    } else if (val >= qualityIndicator.good.min && val <= qualityIndicator.good.max) {
      return '#10B981'; // Light green
    } else if (val >= qualityIndicator.fair.min && val <= qualityIndicator.fair.max) {
      return '#D97706'; // Orange
    } else {
      return '#DC2626'; // Red
    }
  };

  const getQualityLabel = (val: number): string => {
    if (!qualityIndicator) return '';
    
    if (val >= qualityIndicator.excellent.min && val <= qualityIndicator.excellent.max) {
      return 'Excellent';
    } else if (val >= qualityIndicator.good.min && val <= qualityIndicator.good.max) {
      return 'Good';
    } else if (val >= qualityIndicator.fair.min && val <= qualityIndicator.fair.max) {
      return 'Fair';
    } else {
      return 'Poor';
    }
  };

  const handleSliderChange = (newValue: number) => {
    const roundedValue = Math.round(newValue / range.step) * range.step;
    onValueChange(roundedValue);
    setTextValue(roundedValue.toString());
  };

  const handleTextChange = (text: string) => {
    setTextValue(text);
    const numValue = parseFloat(text);
    if (!isNaN(numValue) && numValue >= range.min && numValue <= range.max) {
      onValueChange(numValue);
    } else if (text === '') {
      onValueChange(undefined);
    }
  };

  const handleVoiceTranscription = (transcription: string) => {
    // Extract numeric value from transcription
    const numMatch = transcription.match(/(\d+\.?\d*)/);
    if (numMatch) {
      const numValue = parseFloat(numMatch[1]);
      if (numValue >= range.min && numValue <= range.max) {
        onValueChange(numValue);
        setTextValue(numValue.toString());
      }
    }
  };

  const toggleInputMode = () => {
    setInputMode(inputMode === 'slider' ? 'text' : 'slider');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <Text 
            style={[
              styles.label, 
              { 
                color: theme.text,
                fontSize: accessibility.largeText ? 18 : 16,
              }
            ]}
          >
            {label}
          </Text>
          {description && (
            <Text 
              style={[
                styles.description, 
                { 
                  color: theme.textSecondary,
                  fontSize: accessibility.largeText ? 14 : 12,
                }
              ]}
            >
              {description}
            </Text>
          )}
        </View>
        
        <View style={styles.controls}>
          {voiceEnabled && (
            <VoiceInput
              fieldTag={fieldTag}
              onTranscription={handleVoiceTranscription}
              size="small"
              showDuration={false}
            />
          )}
          
          <TouchableOpacity
            style={[styles.modeButton, { backgroundColor: theme.border }]}
            onPress={toggleInputMode}
            accessible={true}
            accessibilityLabel={`Switch to ${inputMode === 'slider' ? 'text' : 'slider'} input`}
          >
            <Ionicons 
              name={inputMode === 'slider' ? 'keypad' : 'options'} 
              size={16} 
              color={theme.text} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Value Display */}
      {value !== undefined && (
        <View style={styles.valueDisplay}>
          <Text 
            style={[
              styles.valueText, 
              { 
                color: qualityIndicator ? getQualityColor(value) : theme.primary,
                fontSize: accessibility.largeText ? 24 : 20,
              }
            ]}
          >
            {value.toFixed(range.step < 1 ? 1 : 0)} {unit}
          </Text>
          
          {qualityIndicator && (
            <Text 
              style={[
                styles.qualityLabel, 
                { 
                  color: getQualityColor(value),
                  fontSize: accessibility.largeText ? 14 : 12,
                }
              ]}
            >
              {getQualityLabel(value)}
            </Text>
          )}
        </View>
      )}

      {/* Input Controls */}
      {inputMode === 'slider' ? (
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={range.min}
            maximumValue={range.max}
            step={range.step}
            value={value || range.min}
            onValueChange={handleSliderChange}
            minimumTrackTintColor={qualityIndicator && value ? getQualityColor(value) : theme.primary}
            maximumTrackTintColor={theme.border}
            thumbStyle={{ backgroundColor: qualityIndicator && value ? getQualityColor(value) : theme.primary }}
          />
          
          <View style={styles.rangeLabels}>
            <Text style={[styles.rangeLabel, { color: theme.textSecondary }]}>
              {range.min} {unit}
            </Text>
            <Text style={[styles.rangeLabel, { color: theme.textSecondary }]}>
              {range.max} {unit}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.textInputContainer}>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
                fontSize: accessibility.largeText ? 18 : 16,
              }
            ]}
            value={textValue}
            onChangeText={handleTextChange}
            placeholder={`Enter ${label.toLowerCase()} (${range.min}-${range.max})`}
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            accessible={true}
            accessibilityLabel={`${label} input field`}
          />
          <Text style={[styles.unitLabel, { color: theme.textSecondary }]}>
            {unit}
          </Text>
        </View>
      )}

      {/* Quality Indicator Bar */}
      {qualityIndicator && (
        <View style={styles.qualityBar}>
          <View style={[styles.qualitySegment, { backgroundColor: '#059669', flex: 1 }]} />
          <View style={[styles.qualitySegment, { backgroundColor: '#10B981', flex: 1 }]} />
          <View style={[styles.qualitySegment, { backgroundColor: '#D97706', flex: 1 }]} />
          <View style={[styles.qualitySegment, { backgroundColor: '#DC2626', flex: 1 }]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    lineHeight: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  valueText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  qualityLabel: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sliderContainer: {
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  rangeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  unitLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  qualityBar: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  qualitySegment: {
    marginHorizontal: 0.5,
  },
});