import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { LanguageContext } from '@/context/LanguageContext';
import { AccessibilityContext } from '@/context/AccessibilityContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { submitHealthReport } from '@/store/slices/healthDataSlice';

const commonSymptoms = [
  'Fever', 'Cough', 'Headache', 'Body pain', 'Nausea', 'Vomiting',
  'Diarrhea', 'Fatigue', 'Difficulty breathing', 'Chest pain',
  'Abdominal pain', 'Skin rash', 'Joint pain', 'Dizziness'
];

const severityLevels = [
  { key: 'low', label: 'Mild', color: '#059669' },
  { key: 'medium', label: 'Moderate', color: '#D97706' },
  { key: 'high', label: 'Severe', color: '#DC2626' },
];

export default function ReportScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { loading } = useAppSelector(state => state.healthData);
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { accessibility } = useContext(AccessibilityContext);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('low');
  const [description, setDescription] = useState('');
  const [voiceInput, setVoiceInput] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleVoiceInput = () => {
    // Mock voice input for demo
    const mockVoiceInput = "I have been experiencing fever and headache for the past two days.";
    setVoiceInput(mockVoiceInput);
    setDescription(mockVoiceInput);
    
    // Auto-detect symptoms from voice input
    const detectedSymptoms = commonSymptoms.filter(symptom => 
      mockVoiceInput.toLowerCase().includes(symptom.toLowerCase())
    );
    setSelectedSymptoms(detectedSymptoms);
    
    Alert.alert(t('report.voiceInputReceived'), mockVoiceInput);
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert(t('common.error'), t('report.selectSymptoms'));
      return;
    }

    if (!user) return;

    const reportData = {
      reporterId: user.id,
      reporterName: user.name,
      reporterRole: user.role,
      symptoms: selectedSymptoms,
      severity,
      location: {
        latitude: 26.2006, // Mock location
        longitude: 92.9376,
        address: 'Mock Address',
        district: 'Mock District',
        block: 'Mock Block',
        village: 'Mock Village',
      },
      patientInfo: {
        age: 30, // Mock data
        gender: 'male' as const,
      },
      media: {
        photos: [],
        audio: [],
      },
      status: 'pending' as const,
      followUpRequired: severity !== 'low',
      notes: description,
    };

    try {
      await dispatch(submitHealthReport(reportData)).unwrap();
      Alert.alert(
        t('report.reportSubmitted'),
        t('report.reportSubmittedMessage'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              // Reset form
              setSelectedSymptoms([]);
              setSeverity('low');
              setDescription('');
              setVoiceInput('');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), t('report.submitError'));
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text 
          style={[
            styles.title, 
            { 
              color: theme.text,
              fontSize: accessibility.largeText ? 28 : 24,
            }
          ]}
        >
          {t('report.title')}
        </Text>
        <Text 
          style={[
            styles.subtitle, 
            { 
              color: theme.textSecondary,
              fontSize: accessibility.largeText ? 18 : 16,
            }
          ]}
        >
          {t('report.subtitle')}
        </Text>
      </View>

      {/* Voice Input */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.voiceButton,
            { 
              backgroundColor: theme.primary,
              minHeight: accessibility.largeText ? 60 : 50,
            }
          ]}
          onPress={handleVoiceInput}
          accessible={true}
          accessibilityLabel={t('report.useVoiceInput')}
        >
          <Ionicons name="mic" size={24} color="#FFFFFF" />
          <Text 
            style={[
              styles.voiceButtonText,
              { fontSize: accessibility.largeText ? 18 : 16 }
            ]}
          >
            {t('report.useVoiceInput')}
          </Text>
        </TouchableOpacity>
        
        {voiceInput && (
          <View style={[styles.voiceInputDisplay, { backgroundColor: theme.surface }]}>
            <Text style={[styles.voiceInputText, { color: theme.text }]}>
              {voiceInput}
            </Text>
          </View>
        )}
      </View>

      {/* Symptoms Selection */}
      <View style={styles.section}>
        <Text 
          style={[
            styles.sectionTitle, 
            { 
              color: theme.text,
              fontSize: accessibility.largeText ? 20 : 18,
            }
          ]}
        >
          {t('report.symptoms')}
        </Text>
        
        <View style={styles.symptomsGrid}>
          {commonSymptoms.map((symptom) => (
            <TouchableOpacity
              key={symptom}
              style={[
                styles.symptomChip,
                {
                  backgroundColor: selectedSymptoms.includes(symptom) 
                    ? theme.primary 
                    : theme.surface,
                  borderColor: theme.border,
                }
              ]}
              onPress={() => toggleSymptom(symptom)}
              accessible={true}
              accessibilityLabel={symptom}
              accessibilityState={{ selected: selectedSymptoms.includes(symptom) }}
            >
              <Text
                style={[
                  styles.symptomText,
                  {
                    color: selectedSymptoms.includes(symptom) 
                      ? '#FFFFFF' 
                      : theme.text,
                    fontSize: accessibility.largeText ? 16 : 14,
                  }
                ]}
              >
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Severity Selection */}
      <View style={styles.section}>
        <Text 
          style={[
            styles.sectionTitle, 
            { 
              color: theme.text,
              fontSize: accessibility.largeText ? 20 : 18,
            }
          ]}
        >
          {t('report.severity')}
        </Text>
        
        <View style={styles.severityContainer}>
          {severityLevels.map((level) => (
            <TouchableOpacity
              key={level.key}
              style={[
                styles.severityButton,
                {
                  backgroundColor: severity === level.key ? level.color : theme.surface,
                  borderColor: level.color,
                }
              ]}
              onPress={() => setSeverity(level.key as any)}
              accessible={true}
              accessibilityLabel={level.label}
              accessibilityState={{ selected: severity === level.key }}
            >
              <Text
                style={[
                  styles.severityText,
                  {
                    color: severity === level.key ? '#FFFFFF' : level.color,
                    fontSize: accessibility.largeText ? 16 : 14,
                  }
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text 
          style={[
            styles.sectionTitle, 
            { 
              color: theme.text,
              fontSize: accessibility.largeText ? 20 : 18,
            }
          ]}
        >
          {t('report.description')}
        </Text>
        
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
              fontSize: accessibility.largeText ? 18 : 16,
            }
          ]}
          placeholder={t('report.descriptionPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          accessible={true}
          accessibilityLabel={t('report.description')}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          {
            backgroundColor: loading ? theme.textSecondary : theme.primary,
            minHeight: accessibility.largeText ? 60 : 50,
          }
        ]}
        onPress={handleSubmit}
        disabled={loading}
        accessible={true}
        accessibilityLabel={t('report.submitReport')}
      >
        <Text 
          style={[
            styles.submitButtonText,
            { fontSize: accessibility.largeText ? 18 : 16 }
          ]}
        >
          {loading ? t('report.submitting') : t('report.submitReport')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  voiceButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  voiceInputDisplay: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  voiceInputText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  symptomText: {
    fontWeight: '500',
  },
  severityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  severityText: {
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});