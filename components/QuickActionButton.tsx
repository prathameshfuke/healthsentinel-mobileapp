import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionButtonProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  accessible?: boolean;
  accessibilityLabel?: string;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  title,
  subtitle,
  icon,
  color,
  onPress,
  accessible,
  accessibilityLabel
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={24} color="#FFFFFF" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 100,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
    textAlign: 'center',
  },
});