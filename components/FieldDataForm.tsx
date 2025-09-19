import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FieldDataFormProps {
  theme: any;
  accessibility: any;
  t: (key: string) => string;
}

export const FieldDataForm: React.FC<FieldDataFormProps> = ({
  theme,
  accessibility,
  t
}) => {
  const [formData, setFormData] = useState({
    householdId: '',
    familyMembers: '',
    waterSource: 'well',
    sanitationAccess: 'yes',
    vaccination: '',
    pregnancies: '',
    elderlyCount: '',
    notes: '',
  });

  const waterSources = ['well', 'river', 'pond', 'tap', 'other'];
  const sanitationOptions = ['yes', 'no', 'partial'];

  const handleSubmit = () => {
    if (!formData.householdId || !formData.familyMembers) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert('Success', 'Field data has been recorded successfully.');
    
    // Reset form
    setFormData({
      householdId: '',
      familyMembers: '',
      waterSource: 'well',
      sanitationAccess: 'yes',
      vaccination: '',
      pregnancies: '',
      elderlyCount: '',
      notes: '',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.form, { backgroundColor: theme.surface }]}>
        <Text style={[styles.formTitle, { color: theme.text }]}>
          Household Data Collection
        </Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Household ID *
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { 
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text
              }
            ]}
            placeholder="Enter household ID"
            placeholderTextColor={theme.textSecondary}
            value={formData.householdId}
            onChangeText={(text) => setFormData(prev => ({ ...prev, householdId: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Family Members Count *
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { 
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text
              }
            ]}
            placeholder="Number of family members"
            placeholderTextColor={theme.textSecondary}
            value={formData.familyMembers}
            onChangeText={(text) => setFormData(prev => ({ ...prev, familyMembers: text }))}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Primary Water Source
          </Text>
          <View style={styles.optionsGrid}>
            {waterSources.map((source) => (
              <TouchableOpacity
                key={source}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: formData.waterSource === source ? theme.primary : theme.background,
                    borderColor: theme.border
                  }
                ]}
                onPress={() => setFormData(prev => ({ ...prev, waterSource: source }))}
                accessible={true}
                accessibilityLabel={`Select ${source} as water source`}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: formData.waterSource === source ? '#FFFFFF' : theme.text }
                  ]}
                >
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Sanitation Access
          </Text>
          <View style={styles.optionsGrid}>
            {sanitationOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: formData.sanitationAccess === option ? theme.primary : theme.background,
                    borderColor: theme.border
                  }
                ]}
                onPress={() => setFormData(prev => ({ ...prev, sanitationAccess: option }))}
                accessible={true}
                accessibilityLabel={`Select ${option} for sanitation access`}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: formData.sanitationAccess === option ? '#FFFFFF' : theme.text }
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Children Needing Vaccination
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { 
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text
              }
            ]}
            placeholder="Number of children"
            placeholderTextColor={theme.textSecondary}
            value={formData.vaccination}
            onChangeText={(text) => setFormData(prev => ({ ...prev, vaccination: text }))}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Pregnant Women
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { 
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text
              }
            ]}
            placeholder="Number of pregnant women"
            placeholderTextColor={theme.textSecondary}
            value={formData.pregnancies}
            onChangeText={(text) => setFormData(prev => ({ ...prev, pregnancies: text }))}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Elderly (60+ years)
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { 
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text
              }
            ]}
            placeholder="Number of elderly members"
            placeholderTextColor={theme.textSecondary}
            value={formData.elderlyCount}
            onChangeText={(text) => setFormData(prev => ({ ...prev, elderlyCount: text }))}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Additional Notes
          </Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text
              }
            ]}
            placeholder="Any additional observations or concerns..."
            placeholderTextColor={theme.textSecondary}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
          accessible={true}
          accessibilityLabel="Submit field data"
          accessibilityRole="button"
        >
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            Record Data
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    borderRadius: 8,
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});