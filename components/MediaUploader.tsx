import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface MediaUploaderProps {
  media: any[];
  onMediaChange: (media: any[]) => void;
  theme: any;
  accessibility: any;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  media,
  onMediaChange,
  theme,
  accessibility
}) => {
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return cameraStatus === 'granted' && mediaLibraryStatus === 'granted';
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      onMediaChange([...media, result.assets[0]]);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission needed', 'Media library permission is required to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      onMediaChange([...media, result.assets[0]]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.mediaButton,
            { backgroundColor: theme.surface, borderColor: theme.border }
          ]}
          onPress={takePhoto}
          accessible={true}
          accessibilityLabel="Take photo"
          accessibilityRole="button"
        >
          <Ionicons name="camera" size={24} color={theme.primary} />
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Take Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.mediaButton,
            { backgroundColor: theme.surface, borderColor: theme.border }
          ]}
          onPress={pickImage}
          accessible={true}
          accessibilityLabel="Select photo"
          accessibilityRole="button"
        >
          <Ionicons name="image" size={24} color={theme.primary} />
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Gallery
          </Text>
        </TouchableOpacity>
      </View>

      {media.length > 0 && (
        <View style={styles.mediaCount}>
          <Text style={[styles.countText, { color: theme.textSecondary }]}>
            {media.length} file(s) attached
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  mediaCount: {
    marginTop: 8,
    alignItems: 'center',
  },
  countText: {
    fontSize: 14,
  },
});