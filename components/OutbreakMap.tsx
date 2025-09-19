import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface OutbreakMapProps {
  outbreaks: Array<{
    id: string | number;
    lat: number;
    lng: number;
    severity: string;
    cases: number;
  }>;
  theme: any;
  accessibility: any;
}

export const OutbreakMap: React.FC<OutbreakMapProps> = ({
  outbreaks,
  theme,
  accessibility,
}) => {
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.surface,
          borderColor: theme.border,
        }
      ]}
      accessible={true}
      accessibilityLabel={`Outbreak map showing ${outbreaks.length} active outbreaks`}
    >
      <Text style={[styles.placeholder, { color: theme.textSecondary }]}>
        📍 Interactive Map View
      </Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {outbreaks.length} active outbreak{outbreaks.length !== 1 ? 's' : ''} detected
      </Text>
      
      {outbreaks.map((outbreak, index) => (
        <View key={outbreak.id} style={styles.outbreakItem}>
          <View 
            style={[
              styles.severityIndicator, 
              { 
                backgroundColor: outbreak.severity === 'high' ? theme.error : 
                                outbreak.severity === 'medium' ? theme.warning : 
                                theme.success 
              }
            ]} 
          />
          <Text style={[styles.outbreakText, { color: theme.text }]}>
            Location {index + 1}: {outbreak.cases} cases ({outbreak.severity} severity)
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  outbreakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  outbreakText: {
    fontSize: 12,
  },
});