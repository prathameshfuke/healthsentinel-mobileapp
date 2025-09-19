import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TrendChartProps {
  data: Array<{
    date: string;
    reports: number;
  }>;
  timeRange: '24h' | '7d' | '30d';
  onTimeRangeChange: (range: '24h' | '7d' | '30d') => void;
  theme: any;
  accessibility: any;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  timeRange,
  onTimeRangeChange,
  theme,
  accessibility,
}) => {
  const maxReports = Math.max(...data.map(d => d.reports));

  return (
    <View style={styles.container}>
      {/* Time Range Selector */}
      <View style={styles.timeRangeSelector}>
        {(['24h', '7d', '30d'] as const).map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              {
                backgroundColor: timeRange === range ? theme.primary : theme.surface,
                borderColor: theme.border,
              }
            ]}
            onPress={() => onTimeRangeChange(range)}
          >
            <Text
              style={[
                styles.timeRangeText,
                {
                  color: timeRange === range ? '#FFFFFF' : theme.text,
                  fontSize: accessibility.largeText ? 16 : 14,
                }
              ]}
            >
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Simple Bar Chart */}
      <View 
        style={[
          styles.chartContainer, 
          { backgroundColor: theme.surface, borderColor: theme.border }
        ]}
      >
        <Text style={[styles.chartTitle, { color: theme.text }]}>
          📊 Report Trends
        </Text>
        
        <View style={styles.barsContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.reports / maxReports) * 80,
                    backgroundColor: theme.primary,
                  }
                ]}
              />
              <Text 
                style={[
                  styles.barLabel, 
                  { 
                    color: theme.textSecondary,
                    fontSize: accessibility.largeText ? 12 : 10,
                  }
                ]}
              >
                {item.reports}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  timeRangeText: {
    fontWeight: '600',
  },
  chartContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    height: 150,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: '#2563EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  barLabel: {
    fontWeight: '500',
  },
});