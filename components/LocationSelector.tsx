import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocationSelectorProps {
  location: any;
  onLocationChange: (location: any) => void;
  theme: any;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  location,
  onLocationChange,
  theme
}) => {
  const getCurrentLocation = () => {
    // In a real app, this would use expo-location
    // For demo purposes, we'll simulate location detection
    Alert.alert(
      'Location Access',
      'Location detection would be implemented here using expo-location',
      [
        { text: 'Cancel' },
        { 
          text: 'Use Demo Location', 
          onPress: () => {
            onLocationChange({
              latitude: 26.2006,
              longitude: 92.9376,
              address: 'Guwahati, Assam, India'
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.locationButton,
          { backgroundColor: theme.surface, borderColor: theme.border }
        ]}
        onPress={getCurrentLocation}
        accessible={true}
        accessibilityLabel="Get current location"
        accessibilityRole="button"
      >
        <Ionicons name="location" size={24} color={theme.primary} />
        <View style={styles.locationInfo}>
          <Text style={[styles.locationTitle, { color: theme.text }]}>
            {location ? 'Location Selected' : 'Get Current Location'}
          </Text>
          <Text style={[styles.locationAddress, { color: theme.textSecondary }]}>
            {location ? location.address : 'Tap to detect your location'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
  },
});