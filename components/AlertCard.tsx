import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AlertCardProps {
  alert: any;
  onPress: () => void;
  theme: any;
  accessibility: any;
  t: (key: string) => string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onPress,
  theme,
  accessibility,
  t
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return theme.textSecondary;
    }
  };

  const getTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'outbreak': return 'warning';
      case 'weather': return 'rainy';
      case 'iot': return 'hardware-chip';
      case 'community': return 'people';
      default: return 'information-circle';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          backgroundColor: theme.surface,
          borderLeftColor: getSeverityColor(alert.severity),
          opacity: alert.read ? 0.7 : 1
        }
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`${alert.title} - ${alert.severity} severity - ${formatTimestamp(alert.timestamp)}`}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons 
            name={getTypeIcon(alert.type)} 
            size={20} 
            color={getSeverityColor(alert.severity)} 
          />
          <Text 
            style={[
              styles.title, 
              { 
                color: theme.text,
                fontSize: accessibility.largeText ? 18 : 16
              }
            ]}
          >
            {alert.title}
          </Text>
        </View>
        
        <View style={styles.meta}>
          <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
            {formatTimestamp(alert.timestamp)}
          </Text>
          {!alert.read && (
            <View style={[styles.unreadDot, { backgroundColor: getSeverityColor(alert.severity) }]} />
          )}
        </View>
      </View>

      <Text 
        style={[
          styles.message, 
          { 
            color: theme.textSecondary,
            fontSize: accessibility.largeText ? 16 : 14
          }
        ]}
        numberOfLines={2}
      >
        {alert.message}
      </Text>

      {alert.location && (
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color={theme.textSecondary} />
          <Text style={[styles.location, { color: theme.textSecondary }]}>
            {alert.location}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  message: {
    lineHeight: 20,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
  },
});