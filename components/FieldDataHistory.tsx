import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FieldDataHistoryProps {
  theme: any;
  accessibility: any;
  t: (key: string) => string;
}

const mockHistory = [
  {
    id: '1',
    householdId: 'HH001',
    familyMembers: 5,
    waterSource: 'well',
    sanitationAccess: 'yes',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'synced'
  },
  {
    id: '2',
    householdId: 'HH002',
    familyMembers: 7,
    waterSource: 'tap',
    sanitationAccess: 'partial',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'pending'
  },
  {
    id: '3',
    householdId: 'HH003',
    familyMembers: 4,
    waterSource: 'river',
    sanitationAccess: 'no',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'synced'
  },
];

export const FieldDataHistory: React.FC<FieldDataHistoryProps> = ({
  theme,
  accessibility,
  t
}) => {
  const [history] = useState(mockHistory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return '#059669';
      case 'pending': return '#F59E0B';
      case 'error': return '#DC2626';
      default: return theme.textSecondary;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Data Collection History
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {history.length} records
        </Text>
      </View>

      <View style={styles.historyList}>
        {history.map((record) => (
          <TouchableOpacity
            key={record.id}
            style={[
              styles.historyItem,
              { 
                backgroundColor: theme.surface,
                borderLeftColor: getStatusColor(record.status)
              }
            ]}
            accessible={true}
            accessibilityLabel={`Household ${record.householdId} record - ${record.status}`}
            accessibilityRole="button"
          >
            <View style={styles.recordHeader}>
              <Text style={[styles.householdId, { color: theme.text }]}>
                {record.householdId}
              </Text>
              <View style={styles.statusBadge}>
                <View 
                  style={[
                    styles.statusDot, 
                    { backgroundColor: getStatusColor(record.status) }
                  ]} 
                />
                <Text style={[styles.statusText, { color: getStatusColor(record.status) }]}>
                  {record.status}
                </Text>
              </View>
            </View>

            <View style={styles.recordDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="people" size={16} color={theme.textSecondary} />
                <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                  {record.familyMembers} members
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="water" size={16} color={theme.textSecondary} />
                <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                  Water: {record.waterSource}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="checkmark-circle" size={16} color={theme.textSecondary} />
                <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                  Sanitation: {record.sanitationAccess}
                </Text>
              </View>
            </View>

            <View style={styles.recordFooter}>
              <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
                {formatTimestamp(record.timestamp)}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.syncSection, { backgroundColor: theme.surface }]}>
        <View style={styles.syncHeader}>
          <Ionicons name="sync" size={20} color={theme.primary} />
          <Text style={[styles.syncTitle, { color: theme.text }]}>
            Data Synchronization
          </Text>
        </View>
        
        <Text style={[styles.syncDescription, { color: theme.textSecondary }]}>
          Pending records will be automatically synced when internet connection is available.
        </Text>
        
        <TouchableOpacity
          style={[styles.syncButton, { borderColor: theme.primary }]}
          accessible={true}
          accessibilityLabel="Force sync data"
          accessibilityRole="button"
        >
          <Text style={[styles.syncButtonText, { color: theme.primary }]}>
            Force Sync Now
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  historyList: {
    gap: 12,
    marginBottom: 20,
  },
  historyItem: {
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  householdId: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  recordDetails: {
    marginBottom: 12,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
  },
  syncSection: {
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  syncDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  syncButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  syncButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});