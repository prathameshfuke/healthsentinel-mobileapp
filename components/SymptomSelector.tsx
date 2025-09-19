import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
  accessibility: any;
}

const commonSymptoms = [
  { id: 'fever', label: 'Fever', icon: 'thermometer' as keyof typeof Ionicons.glyphMap },
  { id: 'cough', label: 'Cough', icon: 'medical' as keyof typeof Ionicons.glyphMap },
  { id: 'headache', label: 'Headache', icon: 'sad' as keyof typeof Ionicons.glyphMap },
  { id: 'bodyache', label: 'Body ache', icon: 'body' as keyof typeof Ionicons.glyphMap },
  { id: 'nausea', label: 'Nausea', icon: 'restaurant' as keyof typeof Ionicons.glyphMap },
  { id: 'diarrhea', label: 'Diarrhea', icon: 'water' as keyof typeof Ionicons.glyphMap },
  { id: 'rash', label: 'Skin rash', icon: 'hand-left' as keyof typeof Ionicons.glyphMap },
  { id: 'breathing', label: 'Difficulty breathing', icon: 'fitness' as keyof typeof Ionicons.glyphMap },
];

export const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  selectedSymptoms,
  onSymptomsChange,
  accessibility
}) => {
  const toggleSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      onSymptomsChange(selectedSymptoms.filter(id => id !== symptomId));
    } else {
      onSymptomsChange([...selectedSymptoms, symptomId]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {commonSymptoms.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom.id);
          
          return (
            <TouchableOpacity
              key={symptom.id}
              style={[
                styles.symptomButton,
                isSelected && styles.selectedSymptom,
                accessibility.largeText && styles.largeButton
              ]}
              onPress={() => toggleSymptom(symptom.id)}
              accessible={true}
              accessibilityLabel={symptom.label}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
            >
              {accessibility.pictograms && (
                <Ionicons 
                  name={symptom.icon} 
                  size={accessibility.largeText ? 28 : 24} 
                  color={isSelected ? '#FFFFFF' : '#6B7280'} 
                  style={styles.symptomIcon}
                />
              )}
              <Text 
                style={[
                  styles.symptomText,
                  isSelected && styles.selectedText,
                  accessibility.largeText && styles.largeText
                ]}
              >
                {symptom.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomButton: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    minHeight: 80,
  },
  largeButton: {
    minHeight: 100,
    padding: 16,
  },
  selectedSymptom: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  symptomIcon: {
    marginBottom: 4,
  },
  symptomText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  largeText: {
    fontSize: 16,
  },
});