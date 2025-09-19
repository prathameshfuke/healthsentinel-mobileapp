import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { LanguageContext } from '@/context/LanguageContext';
import { AccessibilityContext } from '@/context/AccessibilityContext';
import { useAppSelector } from '@/store/hooks';

export default function FieldDataScreen() {
  const { user } = useAppSelector(state => state.auth);
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { accessibility } = useContext(AccessibilityContext);

  const ActionCard = ({ title, subtitle, icon, onPress, color }: any) => (
    <TouchableOpacity
      style={[
        styles.actionCard,
        { 
          backgroundColor: theme.surface,
          borderColor: theme.border,
        }
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={title}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color="#FFFFFF" />
      </View>
      <Text 
        style={[
          styles.actionTitle, 
          { 
            color: theme.text,
            fontSize: accessibility.largeText ? 18 : 16,
          }
        ]}
      >
        {title}
      </Text>
      <Text 
        style={[
          styles.actionSubtitle, 
          { 
            color: theme.textSecondary,
            fontSize: accessibility.largeText ? 15 : 13,
          }
        ]}
      >
        {subtitle}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text 
          style={[
            styles.title, 
            { 
              color: theme.text,
              fontSize: accessibility.largeText ? 28 : 24,
            }
          ]}
        >
          {t('fieldData.title')}
        </Text>
        <Text 
          style={[
            styles.subtitle, 
            { 
              color: theme.textSecondary,
              fontSize: accessibility.largeText ? 16 : 14,
            }
          ]}
        >
          {t('fieldData.subtitle')}
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>12</Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Today's Visits</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statNumber, { color: theme.success }]}>8</Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Completed</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statNumber, { color: theme.warning }]}>4</Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Pending</Text>
        </View>
      </View>

      {/* Action Cards */}
      <View style={styles.actionsGrid}>
        <ActionCard
          title="Collect Health Data"
          subtitle="Survey households and collect health information"
          icon="clipboard"
          color={theme.primary}
          onPress={() => {}}
        />
        
        <ActionCard
          title="Record Symptoms"
          subtitle="Document symptoms and health concerns"
          icon="medical"
          color={theme.success}
          onPress={() => {}}
        />
        
        <ActionCard
          title="Take Photos"
          subtitle="Capture visual documentation"
          icon="camera"
          color={theme.warning}
          onPress={() => {}}
        />
        
        <ActionCard
          title="Voice Notes"
          subtitle="Record audio observations"
          icon="mic"
          color="#8B5CF6"
          onPress={() => {}}
        />
        
        <ActionCard
          title="GPS Tracking"
          subtitle="Track field visit locations"
          icon="location"
          color="#EF4444"
          onPress={() => {}}
        />
        
        <ActionCard
          title="Sync Data"
          subtitle="Upload collected data when online"
          icon="sync"
          color="#06B6D4"
          onPress={() => {}}
        />
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text 
          style={[
            styles.sectionTitle, 
            { 
              color: theme.text,
              fontSize: accessibility.largeText ? 20 : 18,
            }
          ]}
        >
          Recent Field Activities
        </Text>
        
        <View style={[styles.activityCard, { backgroundColor: theme.surface }]}>
          <View style={styles.activityItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <Text style={[styles.activityText, { color: theme.text }]}>
              Household survey completed - Village A
            </Text>
            <Text style={[styles.activityTime, { color: theme.textSecondary }]}>
              2h ago
            </Text>
          </View>
          
          <View style={styles.activityItem}>
            <Ionicons name="camera" size={20} color={theme.primary} />
            <Text style={[styles.activityText, { color: theme.text }]}>
              Health documentation photos taken
            </Text>
            <Text style={[styles.activityTime, { color: theme.textSecondary }]}>
              4h ago
            </Text>
          </View>
          
          <View style={styles.activityItem}>
            <Ionicons name="sync" size={20} color={theme.warning} />
            <Text style={[styles.activityText, { color: theme.text }]}>
              Data sync pending - 3 reports
            </Text>
            <Text style={[styles.activityTime, { color: theme.textSecondary }]}>
              6h ago
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    textAlign: 'center',
    lineHeight: 18,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  activityText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '500',
  },
});