import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ThemeContext } from '@/context/ThemeContext';
import { LanguageContext } from '@/context/LanguageContext';
import { AccessibilityContext } from '@/context/AccessibilityContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
  updateCurrentReading, 
  submitWaterQualityReading, 
  saveDraft,
  WaterQualityReading 
} from '@/store/slices/waterQualitySlice';
import { WaterParameterInput } from '@/components/WaterParameterInput';
import { VoiceInput } from '@/components/VoiceInput';

const sourceTypes = [
  { key: 'well', label: 'Well', icon: 'water' },
  { key: 'river', label: 'River', icon: 'water-outline' },
  { key: 'tap', label: 'Tap Water', icon: 'water-sharp' },
  { key: 'storage_tank', label: 'Storage Tank', icon: 'cube' },
  { key: 'pond', label: 'Pond', icon: 'ellipse' },
  { key: 'borewell', label: 'Borewell', icon: 'radio-button-on' },
  { key: 'other', label: 'Other', icon: 'help-circle' },
];

const waterParameters = {
  pH: {
    label: 'pH Level',
    unit: 'pH',
    range: { min: 0, max: 14, step: 0.1 },
    description: 'Acidity/Alkalinity of water',
    qualityIndicator: {
      excellent: { min: 6.5, max: 8.5 },
      good: { min: 6.0, max: 9.0 },
      fair: { min: 5.5, max: 9.5 },
      poor: { min: 0, max: 14 },
    },
  },
  turbidity: {
    label: 'Turbidity',
    unit: 'NTU',
    range: { min: 0, max: 100, step: 0.1 },
    description: 'Water clarity measurement',
    qualityIndicator: {
      excellent: { min: 0, max: 1 },
      good: { min: 0, max: 4 },
      fair: { min: 0, max: 10 },
      poor: { min: 0, max: 100 },
    },
  },
  electricalConductivity: {
    label: 'Electrical Conductivity',
    unit: 'μS/cm',
    range: { min: 0, max: 2000, step: 1 },
    description: 'Dissolved salts and minerals',
  },
  temperature: {
    label: 'Temperature',
    unit: '°C',
    range: { min: 0, max: 50, step: 0.1 },
    description: 'Water temperature',
  },
  dissolvedOxygen: {
    label: 'Dissolved Oxygen',
    unit: 'mg/L',
    range: { min: 0, max: 20, step: 0.1 },
    description: 'Oxygen content in water',
    qualityIndicator: {
      excellent: { min: 8, max: 20 },
      good: { min: 6, max: 8 },
      fair: { min: 4, max: 6 },
      poor: { min: 0, max: 4 },
    },
  },
  chlorine: {
    label: 'Free Chlorine',
    unit: 'mg/L',
    range: { min: 0, max: 5, step: 0.01 },
    description: 'Disinfectant level',
    qualityIndicator: {
      excellent: { min: 0.2, max: 1.0 },
      good: { min: 0.1, max: 1.5 },
      fair: { min: 0, max: 2.0 },
      poor: { min: 0, max: 5 },
    },
  },
};

export default function WaterQualityScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { currentReading, loading } = useAppSelector(state => state.waterQuality);
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { accessibility } = useContext(AccessibilityContext);

  const [showSourceModal, setShowSourceModal] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for water quality reporting');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Update current reading with location
      dispatch(updateCurrentReading({
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          address: 'Current Location',
          district: 'Unknown District',
          block: 'Unknown Block',
          accuracy: currentLocation.coords.accuracy,
        },
      }));
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleParameterChange = (parameter: string, value: number | undefined) => {
    dispatch(updateCurrentReading({
      parameters: {
        ...currentReading?.parameters,
        [parameter]: value,
      },
    }));
  };

  const handleSourceTypeSelect = (sourceType: string) => {
    dispatch(updateCurrentReading({
      sourceInfo: {
        ...currentReading?.sourceInfo,
        type: sourceType as any,
        isPublicSource: false,
      },
    }));
    setShowSourceModal(false);
  };

  const handleImagePicker = async (type: 'photo' | 'testKit') => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const currentMedia = currentReading?.media || { photos: [], voiceNotes: [], testKitPhotos: [] };
        
        dispatch(updateCurrentReading({
          media: {
            ...currentMedia,
            [type === 'photo' ? 'photos' : 'testKitPhotos']: [
              ...(type === 'photo' ? currentMedia.photos : currentMedia.testKitPhotos),
              imageUri,
            ],
          },
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const calculateOverallQuality = (): 'excellent' | 'good' | 'fair' | 'poor' | 'unsafe' => {
    const params = currentReading?.parameters;
    if (!params) return 'fair';

    let score = 0;
    let count = 0;

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && waterParameters[key as keyof typeof waterParameters]?.qualityIndicator) {
        const indicator = waterParameters[key as keyof typeof waterParameters].qualityIndicator!;
        if (value >= indicator.excellent.min && value <= indicator.excellent.max) {
          score += 4;
        } else if (value >= indicator.good.min && value <= indicator.good.max) {
          score += 3;
        } else if (value >= indicator.fair.min && value <= indicator.fair.max) {
          score += 2;
        } else {
          score += 1;
        }
        count++;
      }
    });

    if (count === 0) return 'fair';
    
    const average = score / count;
    if (average >= 3.5) return 'excellent';
    if (average >= 2.5) return 'good';
    if (average >= 1.5) return 'fair';
    return 'poor';
  };

  const handleSubmit = async () => {
    if (!user || !currentReading) return;

    // Validate required fields
    if (!currentReading.sourceInfo?.type) {
      Alert.alert('Missing Information', 'Please select a water source type');
      return;
    }

    if (!location) {
      Alert.alert('Missing Location', 'Location is required for water quality reporting');
      return;
    }

    const overallQuality = calculateOverallQuality();
    const riskLevel = overallQuality === 'poor' ? 'high' : 
                     overallQuality === 'fair' ? 'medium' : 'low';

    const reportData = {
      ...currentReading,
      reporterId: user.id,
      reporterName: user.name,
      reporterRole: user.role,
      assessment: {
        overallQuality,
        riskLevel,
        issues: [],
        recommendations: [],
      },
      status: 'submitted' as const,
      tags: ['water_quality_monitoring'],
    };

    try {
      await dispatch(submitWaterQualityReading(reportData)).unwrap();
      Alert.alert(
        'Report Submitted',
        'Water quality report has been submitted successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit water quality report');
    }
  };

  const handleSaveDraft = () => {
    if (currentReading) {
      dispatch(saveDraft(currentReading));
      Alert.alert('Draft Saved', 'Your water quality report has been saved as draft');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text 
            style={[
              styles.title, 
              { 
                color: theme.text,
                fontSize: accessibility.largeText ? 24 : 20,
              }
            ]}
          >
            Water Quality Report
          </Text>
          <Text 
            style={[
              styles.subtitle, 
              { 
                color: theme.textSecondary,
                fontSize: accessibility.largeText ? 16 : 14,
              }
            ]}
          >
            Environmental health monitoring
          </Text>
        </View>
      </View>

      {/* Source Information */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Water Source Information
        </Text>
        
        <TouchableOpacity
          style={[
            styles.sourceSelector,
            { 
              backgroundColor: theme.background,
              borderColor: theme.border,
            }
          ]}
          onPress={() => setShowSourceModal(true)}
        >
          <View style={styles.sourceSelectorContent}>
            <Ionicons 
              name={sourceTypes.find(s => s.key === currentReading?.sourceInfo?.type)?.icon as any || 'water'} 
              size={24} 
              color={theme.primary} 
            />
            <Text style={[styles.sourceSelectorText, { color: theme.text }]}>
              {sourceTypes.find(s => s.key === currentReading?.sourceInfo?.type)?.label || 'Select Water Source'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {currentReading?.sourceInfo?.type && (
          <View style={styles.sourceDetails}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text,
                }
              ]}
              placeholder="Source name (optional)"
              placeholderTextColor={theme.textSecondary}
              value={currentReading.sourceInfo.sourceName || ''}
              onChangeText={(text) => dispatch(updateCurrentReading({
                sourceInfo: { ...currentReading.sourceInfo, sourceName: text }
              }))}
            />
          </View>
        )}
      </View>

      {/* Water Parameters */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Water Quality Parameters
        </Text>
        
        {Object.entries(waterParameters).map(([key, config]) => (
          <WaterParameterInput
            key={key}
            label={config.label}
            value={currentReading?.parameters?.[key as keyof typeof currentReading.parameters]}
            onValueChange={(value) => handleParameterChange(key, value)}
            unit={config.unit}
            range={config.range}
            description={config.description}
            fieldTag={key}
            qualityIndicator={config.qualityIndicator}
          />
        ))}
      </View>

      {/* Media & Documentation */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Documentation
        </Text>
        
        <View style={styles.mediaButtons}>
          <TouchableOpacity
            style={[styles.mediaButton, { backgroundColor: theme.primary }]}
            onPress={() => handleImagePicker('photo')}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.mediaButtonText}>Water Sample</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.mediaButton, { backgroundColor: theme.secondary }]}
            onPress={() => handleImagePicker('testKit')}
          >
            <Ionicons name="hardware-chip" size={20} color="#FFFFFF" />
            <Text style={styles.mediaButtonText}>Test Kit Reading</Text>
          </TouchableOpacity>
        </View>

        {/* Voice Notes */}
        <View style={styles.voiceNotesSection}>
          <Text style={[styles.subsectionTitle, { color: theme.text }]}>
            Voice Notes
          </Text>
          <View style={styles.voiceInputContainer}>
            <VoiceInput
              fieldTag="notes"
              size="medium"
            />
            <Text style={[styles.voiceHint, { color: theme.textSecondary }]}>
              Record observations, conditions, or additional notes
            </Text>
          </View>
        </View>

        {/* Text Notes */}
        <TextInput
          style={[
            styles.notesInput,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
              color: theme.text,
            }
          ]}
          placeholder="Additional notes about water quality, weather conditions, or observations..."
          placeholderTextColor={theme.textSecondary}
          value={currentReading?.notes || ''}
          onChangeText={(text) => dispatch(updateCurrentReading({ notes: text }))}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Quality Assessment Preview */}
      {currentReading?.parameters && Object.keys(currentReading.parameters).length > 0 && (
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quality Assessment
          </Text>
          
          <View style={styles.qualityPreview}>
            <Text style={[styles.qualityLabel, { color: theme.text }]}>
              Overall Quality:
            </Text>
            <Text 
              style={[
                styles.qualityValue, 
                { 
                  color: calculateOverallQuality() === 'excellent' ? '#059669' :
                        calculateOverallQuality() === 'good' ? '#10B981' :
                        calculateOverallQuality() === 'fair' ? '#D97706' : '#DC2626'
                }
              ]}
            >
              {calculateOverallQuality().toUpperCase()}
            </Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.draftButton,
            { 
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }
          ]}
          onPress={handleSaveDraft}
        >
          <Ionicons name="save" size={20} color={theme.text} />
          <Text style={[styles.draftButtonText, { color: theme.text }]}>
            Save Draft
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            { 
              backgroundColor: loading ? theme.textSecondary : theme.primary,
            }
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Source Type Modal */}
      <Modal
        visible={showSourceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSourceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Select Water Source Type
              </Text>
              <TouchableOpacity
                onPress={() => setShowSourceModal(false)}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.sourceTypeList}>
              {sourceTypes.map((source) => (
                <TouchableOpacity
                  key={source.key}
                  style={[
                    styles.sourceTypeItem,
                    { borderBottomColor: theme.border }
                  ]}
                  onPress={() => handleSourceTypeSelect(source.key)}
                >
                  <Ionicons name={source.icon as any} size={24} color={theme.primary} />
                  <Text style={[styles.sourceTypeText, { color: theme.text }]}>
                    {source.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}const 
styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    lineHeight: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sourceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  sourceSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sourceSelectorText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  sourceDetails: {
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  mediaButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  voiceNotesSection: {
    marginBottom: 16,
  },
  voiceInputContainer: {
    alignItems: 'center',
    gap: 8,
  },
  voiceHint: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  qualityPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qualityLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  qualityValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  draftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  draftButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sourceTypeList: {
    maxHeight: 400,
  },
  sourceTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sourceTypeText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
});