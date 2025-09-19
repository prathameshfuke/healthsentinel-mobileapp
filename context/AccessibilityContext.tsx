import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  voiceNavigation: boolean;
  pictograms: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
  toggleAccessibilityFeature: (feature: keyof AccessibilitySettings) => void;
  speak: (text: string) => void;
  accessibility: AccessibilitySettings;
}

const defaultSettings: AccessibilitySettings = {
  largeText: false,
  highContrast: false,
  voiceNavigation: false,
  pictograms: true,
};

export const AccessibilityContext = createContext<AccessibilityContextType>({
  ...defaultSettings,
  toggleAccessibilityFeature: () => {},
  speak: () => {},
  accessibility: defaultSettings,
});

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    loadAccessibilitySettings();
  }, []);

  const loadAccessibilitySettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('@health_sentinel_accessibility');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  };

  const toggleAccessibilityFeature = async (feature: keyof AccessibilitySettings) => {
    const newSettings = {
      ...settings,
      [feature]: !settings[feature],
    };
    
    setSettings(newSettings);
    
    try {
      await AsyncStorage.setItem('@health_sentinel_accessibility', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error storing accessibility settings:', error);
    }
  };

  const speak = (text: string) => {
    if (settings.voiceNavigation) {
      Speech.speak(text, {
        language: 'en', // This would be dynamic based on current language
        rate: 0.8,
        pitch: 1.0,
      });
    }
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        ...settings,
        toggleAccessibilityFeature,
        speak,
        accessibility: settings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};