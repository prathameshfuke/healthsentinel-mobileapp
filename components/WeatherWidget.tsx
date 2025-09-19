import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const WeatherWidget: React.FC = () => {
  return (
    <View style={styles.widget}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather Alert</Text>
        <Ionicons name="partly-sunny" size={20} color="#D97706" />
      </View>
      <Text style={styles.temperature}>28°C</Text>
      <Text style={styles.description}>Partly cloudy, possible rain</Text>
      <Text style={styles.alert}>Risk of water stagnation</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  widget: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400E',
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#78350F',
    marginBottom: 4,
  },
  alert: {
    fontSize: 11,
    color: '#B45309',
    fontStyle: 'italic',
  },
});