import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecentReportsProps {
  reports: Array<{
    id: string;
    reporter: string;
    symptoms: string[];
    location: string;
    timestamp: string;
    status: string;
  }>;
  theme: any;
  accessibility: any;
  t: (key: string) => string;
}

export const RecentReports: React.FC<RecentReportsProps> = ({
  reports,
  theme,
  accessibility,
  t,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.warning;
      case 'reviewed':
        return theme.primary;
      case 'investigating':
        return theme.warning;
      case 'resolved':
        return theme.success;
      default:
        return theme.textSecondary;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <View style={styles.container}>
      {reports.map((report) => (
        <TouchableOpacity
          key={report.id}
          style={[
            styles.reportCard,
            { 
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }
          ]}
          accessible={true}
          accessibilityLabel={`Report from ${report.reporter}, ${report.symptoms.join(', ')}, ${report.status}`}
        >
          <View style={styles.header}>
            <View style={styles.reporterInfo}>
              <Ionicons 
                name={report.reporter.includes('ASHA') ? 'medical' : 'person'} 
                size={16} 
                color={theme.primary} 
              />
              <Text 
                style={[
                  styles.reporter, 
                  { 
                    color: theme.text,
                    fontSize: accessibility.largeText ? 16 : 14,
                  }
                ]}
                numberOfLines={1}
              >
                {report.reporter}
              </Text>
            </View>
            
            <View style={styles.statusContainer}>
              <View 
                style={[
                  styles.statusIndicator, 
                  { backgroundColor: getStatusColor(report.status) }
                ]} 
              />
              <Text 
                style={[
                  styles.status, 
                  { 
                    color: getStatusColor(report.status),
                    fontSize: accessibility.largeText ? 14 : 12,
                  }
                ]}
              >
                {report.status}
              </Text>
            </View>
          </View>
          
          <Text 
            style={[
              styles.symptoms, 
              { 
                color: theme.textSecondary,
                fontSize: accessibility.largeText ? 15 : 13,
              }
            ]}
          >
            {report.symptoms.join(', ')}
          </Text>
          
          <View style={styles.footer}>
            <Text 
              style={[
                styles.location, 
                { 
                  color: theme.textSecondary,
                  fontSize: accessibility.largeText ? 13 : 11,
                }
              ]}
            >
              📍 {report.location}
            </Text>
            <Text 
              style={[
                styles.timestamp, 
                { 
                  color: theme.textSecondary,
                  fontSize: accessibility.largeText ? 13 : 11,
                }
              ]}
            >
              {formatTimestamp(report.timestamp)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      
      {reports.length === 0 && (
        <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
          <Ionicons name="document-text-outline" size={48} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No recent reports
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  reportCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reporter: {
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  symptoms: {
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flex: 1,
  },
  timestamp: {
    fontWeight: '500',
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
  },
});