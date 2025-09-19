import React, { useContext, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { LanguageContext } from '@/context/LanguageContext';
import { AccessibilityContext } from '@/context/AccessibilityContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchHealthReports, fetchOutbreaks } from '@/store/slices/healthDataSlice';
import { fetchAlerts } from '@/store/slices/alertsSlice';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { reports, outbreaks } = useAppSelector(state => state.healthData);
  const { alerts } = useAppSelector(state => state.alerts);
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { accessibility } = useContext(AccessibilityContext);

  useEffect(() => {
    if (user) {
      dispatch(fetchHealthReports());
      dispatch(fetchOutbreaks());
      dispatch(fetchAlerts({ userId: user.id, userRole: user.role }));
    }
  }, [dispatch, user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const QuickActionCard = ({ title, subtitle, icon, onPress, color }: any) => (
    <TouchableOpacity
      style={[
        styles.quickActionCard,
        { 
          backgroundColor: theme.surface,
          borderColor: theme.border,
          width: accessibility.largeText ? '100%' : '48%',
        }
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
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

  const StatCard = ({ title, value, icon, color }: any) => (
    <View 
      style={[
        styles.statCard,
        { 
          backgroundColor: theme.surface,
          borderColor: theme.border,
        }
      ]}
    >
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={20} color={color} />
        <Text 
          style={[
            styles.statValue, 
            { 
              color: theme.text,
              fontSize: accessibility.largeText ? 26 : 22,
            }
          ]}
        >
          {value}
        </Text>
      </View>
      <Text 
        style={[
          styles.statTitle, 
          { 
            color: theme.textSecondary,
            fontSize: accessibility.largeText ? 15 : 13,
          }
        ]}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text 
            style={[
              styles.greeting, 
              { 
                color: theme.textSecondary,
                fontSize: accessibility.largeText ? 18 : 16,
              }
            ]}
          >
            {getGreeting()}
          </Text>
          <Text 
            style={[
              styles.userName, 
              { 
                color: theme.text,
                fontSize: accessibility.largeText ? 26 : 22,
              }
            ]}
          >
            {user?.name || 'User'}
          </Text>
          <Text 
            style={[
              styles.userRole, 
              { 
                color: theme.primary,
                fontSize: accessibility.largeText ? 16 : 14,
              }
            ]}
          >
            {t(`home.role.${user?.role || 'villager'}`)}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.profileButton, { backgroundColor: theme.primary }]}
          accessible={true}
          accessibilityLabel="Profile"
        >
          <Ionicons name="person" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        {user?.role === 'health_official' && (
          <>
            <StatCard
              title={t('home.activeOutbreaks')}
              value={outbreaks.length}
              icon="warning"
              color={theme.error}
            />
            <StatCard
              title={t('home.reportsToday')}
              value={reports.length}
              icon="document-text"
              color={theme.primary}
            />
          </>
        )}
        
        {user?.role === 'asha_worker' && (
          <>
            <StatCard
              title={t('home.todaysVisits')}
              value="8"
              icon="walk"
              color={theme.success}
            />
            <StatCard
              title={t('home.pendingReports')}
              value="3"
              icon="clipboard"
              color={theme.warning}
            />
          </>
        )}
        
        {user?.role === 'villager' && (
          <>
            <StatCard
              title={t('home.myReports')}
              value={reports.filter(r => r.reporterId === user.id).length}
              icon="document"
              color={theme.primary}
            />
            <StatCard
              title={t('home.communityAlerts')}
              value={alerts.filter(a => !a.isRead).length}
              icon="notifications"
              color={theme.warning}
            />
          </>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text 
          style={[
            styles.sectionTitle, 
            { 
              color: theme.text,
              fontSize: accessibility.largeText ? 22 : 18,
            }
          ]}
        >
          {t('home.quickActions')}
        </Text>
        
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            title={t('home.quickReport')}
            subtitle={t('home.reportSymptoms')}
            icon="add-circle"
            color={theme.primary}
            onPress={() => {}}
          />
          
          <QuickActionCard
            title={t('home.healthAlerts')}
            subtitle={t('home.viewAlerts')}
            icon="notifications"
            color={theme.warning}
            onPress={() => {}}
          />
          
          {user?.role === 'asha_worker' && (
            <QuickActionCard
              title={t('home.fieldData')}
              subtitle={t('home.collectData')}
              icon="clipboard"
              color={theme.success}
              onPress={() => {}}
            />
          )}
          
          {user?.role === 'health_official' && (
            <QuickActionCard
              title={t('home.dashboard')}
              subtitle={t('home.viewAnalytics')}
              icon="bar-chart"
              color={theme.accent}
              onPress={() => {}}
            />
          )}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text 
          style={[
            styles.sectionTitle, 
            { 
              color: theme.text,
              fontSize: accessibility.largeText ? 22 : 18,
            }
          ]}
        >
          Recent Activity
        </Text>
        
        <View style={[styles.activityCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.activityText, { color: theme.textSecondary }]}>
            {reports.length > 0 
              ? `Latest report: ${reports[0]?.symptoms.join(', ')} - ${reports[0]?.status}`
              : 'No recent activity'
            }
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  greeting: {
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderWidth: 1,
    marginHorizontal: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontWeight: 'bold',
  },
  statTitle: {
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  activityCard: {
    padding: 16,
    borderRadius: 12,
  },
  activityText: {
    fontSize: 14,
    lineHeight: 20,
  },
});