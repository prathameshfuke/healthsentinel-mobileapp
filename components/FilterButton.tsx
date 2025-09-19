import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface FilterButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
  theme: any;
  accessibility: any;
  badge?: number;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  title,
  active,
  onPress,
  theme,
  accessibility,
  badge
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: active ? theme.primary : theme.surface,
          borderColor: active ? theme.primary : theme.border
        }
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`Filter by ${title}${badge ? ` (${badge})` : ''}`}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.text,
          {
            color: active ? '#FFFFFF' : theme.text,
            fontSize: accessibility.largeText ? 16 : 14
          }
        ]}
      >
        {title}
      </Text>
      {badge !== undefined && badge > 0 && (
        <View style={[styles.badge, { backgroundColor: active ? '#FFFFFF' : theme.primary }]}>
          <Text style={[styles.badgeText, { color: active ? theme.primary : '#FFFFFF' }]}>
            {badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    fontWeight: '500',
  },
  badge: {
    marginLeft: 6,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});