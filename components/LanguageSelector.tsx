import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language } from '@/context/LanguageContext';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  theme: any;
  accessibility: any;
}

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'as' as Language, name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'bn' as Language, name: 'Bengali', nativeName: 'বাংলা' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  theme,
  accessibility
}) => {
  return (
    <View style={styles.container}>
      {languages.map((language) => (
        <TouchableOpacity
          key={language.code}
          style={[
            styles.languageItem,
            currentLanguage === language.code && { backgroundColor: theme.primary + '20' }
          ]}
          onPress={() => onLanguageChange(language.code)}
          accessible={true}
          accessibilityLabel={`Select ${language.name}`}
          accessibilityRole="button"
        >
          <View style={styles.languageInfo}>
            <Text style={[styles.languageName, { color: theme.text }]}>
              {language.name}
            </Text>
            <Text style={[styles.languageNative, { color: theme.textSecondary }]}>
              {language.nativeName}
            </Text>
          </View>
          {currentLanguage === language.code && (
            <Ionicons name="checkmark" size={20} color={theme.primary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 1,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
  },
});