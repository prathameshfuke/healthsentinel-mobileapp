import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
}

const lightTheme: Theme = {
  primary: '#2563EB',
  secondary: '#059669',
  accent: '#D97706',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#DC2626',
  warning: '#D97706',
  success: '#059669',
};

const darkTheme: Theme = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#111827',
  surface: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
};

const highContrastTheme: Theme = {
  primary: '#0000FF',
  secondary: '#008000',
  accent: '#FF8000',
  background: '#FFFFFF',
  surface: '#F0F0F0',
  text: '#000000',
  textSecondary: '#333333',
  border: '#000000',
  error: '#FF0000',
  warning: '#FF8000',
  success: '#008000',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  isHighContrast: boolean;
  toggleTheme: () => void;
  setHighContrast: (enabled: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  isHighContrast: false,
  toggleTheme: () => {},
  setHighContrast: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('@health_sentinel_theme');
      const storedContrast = await AsyncStorage.getItem('@health_sentinel_contrast');
      
      if (storedTheme) {
        setIsDark(storedTheme === 'dark');
      }
      
      if (storedContrast) {
        setIsHighContrast(storedContrast === 'true');
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    try {
      await AsyncStorage.setItem('@health_sentinel_theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error storing theme:', error);
    }
  };

  const setHighContrast = async (enabled: boolean) => {
    setIsHighContrast(enabled);
    
    try {
      await AsyncStorage.setItem('@health_sentinel_contrast', enabled.toString());
    } catch (error) {
      console.error('Error storing contrast setting:', error);
    }
  };

  const getTheme = (): Theme => {
    if (isHighContrast) {
      return highContrastTheme;
    }
    return isDark ? darkTheme : lightTheme;
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme: getTheme(), 
        isDark, 
        isHighContrast, 
        toggleTheme, 
        setHighContrast 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};