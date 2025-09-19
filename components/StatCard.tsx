import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: keyof typeof Ionicons.glyphMap;
  theme: any;
  accessibility: any;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  theme,
  accessibility,
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return theme.success;
      case 'negative':
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.surface,
          borderColor: theme.border,
          width: accessibility.largeText ? '100%' : '48%',
        }
      ]}
      accessible={true}
      accessibilityLabel={`${title}: ${value}, change: ${change}`}
    >
      <View style={styles.header}>
        <Ionicons name={icon} size={24} color={theme.primary} />
        <Text 
          style={[
            styles.change, 
            { 
              color: getChangeColor(),
              fontSize: accessibility.largeText ? 14 : 12,
            }
          ]}
        >
          {change}
        </Text>
      </View>
      
      <Text 
        style={[
          styles.value, 
          { 
            color: theme.text,
            fontSize: accessibility.largeText ? 28 : 24,
          }
        ]}
      >
        {value}
      </Text>
      
      <Text 
        style={[
          styles.title, 
          { 
            color: theme.textSecondary,
            fontSize: accessibility.largeText ? 16 : 14,
          }
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontWeight: '500',
  },
  change: {
    fontWeight: '600',
  },
});