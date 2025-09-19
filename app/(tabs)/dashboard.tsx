import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { LanguageContext } from '@/context/LanguageContext';
import { AccessibilityContext } from '@/context/AccessibilityContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchHealthReports, fetchOutbreaks } from '@/store/slices/healthDataSlice';
import { StatCard } from '@/components/StatCard';
import { OutbreakMap } from '@/components/OutbreakMap';
import { RecentReports } from '@/components/RecentReports';
import { TrendChart } from '@/components/TrendChart';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { reports, outbreaks, loading } = useAppSelector(state => state.healthData);
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { accessibility } = useContext(AccessibilityContext);
  
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    loadDashboardData();
  }, [dispatch, timeRange]);

  const loadDashboardData = async () => {
    dispatch(fetchHealthReports());
    dispatch(fetchOutbreaks());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Calculate dashboard stats from Redux data
  const dashboardData = {
    totalReports: reports.length,
    activeOutbreaks: outbreaks.length,
    ashaWorkers: 23, // Mock data
    avgResponseTime: '2.3h', // Mock data
    reportTrends: [
      { date: '2024-01-01', reports: 12 },
      { date: '2024-01-02', reports: 18 },
      { date: '2024-01-03', reports: 15 },
      { date: '2024-01-04', reports: 22 },
      { date: '2024-01-05', reports: 19 },
      { date: '2024-01-06', reports: 25 },
      { date: '2024-01-07', reports: 21 },
    ],
    outbreakLocations: outbreaks.map(outbreak => ({
      id: outbreak.id,
      lat: outbreak.location.latitude,
      lng: outbreak.location.longitude,
      severity: outbreak.severity,
      cases: outbreak.caseCount,
    })),
    recentReports: reports.slice(0, 5).map(report => ({
      id: report.id,
      reporter: `${report.reporterRole === 'asha_worker' ? 'ASHA Worker' : 'Community Member'} - ${report.reporterName}`,
      symptoms: report.symptoms,
      location: report.location.village || report.location.address,
      timestamp: report.createdAt,
      status: report.status,
    })),
  };

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text 
          style={[styles.title, { color: theme.text }]}
          accessible={true}
          accessibilityLabel={t('dashboard.title')}
        >
          {t('dashboard.title')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t('dashboard.subtitle')}
        </Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <StatCard
          title={t('dashboard.totalReports')}
          value={dashboardData.totalReports.toString()}
          change="+12%"
          changeType="positive"
          icon="document-text"
          theme={theme}
          accessibility={accessibility}
        />
        
        <StatCard
          title={t('dashboard.activeOutbreaks')}
          value={dashboardData.activeOutbreaks.toString()}
          change="+1"
          changeType="negative"
          icon="warning"
          theme={theme}
          accessibility={accessibility}
        />
        
        <StatCard
          title={t('dashboard.ashaWorkers')}
          value={dashboardData.ashaWorkers.toString()}
          change="0"
          changeType="neutral"
          icon="people"
          theme={theme}
          accessibility={accessibility}
        />
        
        <StatCard
          title={t('dashboard.avgResponseTime')}
          value={dashboardData.avgResponseTime}
          change="-0.5h"
          changeType="positive"
          icon="time"
          theme={theme}
          accessibility={accessibility}
        />
      </View>

      {/* Outbreak Map */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('dashboard.outbreakMap')}
        </Text>
        <OutbreakMap
          outbreaks={dashboardData.outbreakLocations}
          theme={theme}
          accessibility={accessibility}
        />
      </View>

      {/* Report Trends */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('dashboard.reportTrends')}
        </Text>
        <TrendChart
          data={dashboardData.reportTrends}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          theme={theme}
          accessibility={accessibility}
        />
      </View>

      {/* Recent Reports */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('dashboard.recentReports')}
        </Text>
        <RecentReports
          reports={dashboardData.recentReports}
          theme={theme}
          accessibility={accessibility}
          t={t}
        />
      </View>

      {/* System Status */}
      <View style={[styles.systemStatus, { backgroundColor: theme.surface }]}>
        <View style={styles.statusHeader}>
          <Ionicons name="pulse" size={20} color="#059669" />
          <Text style={[styles.statusTitle, { color: theme.text }]}>
            {t('dashboard.systemStatus')}
          </Text>
        </View>
        
        <View style={styles.statusItems}>
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { backgroundColor: '#059669' }]} />
            <Text style={[styles.statusText, { color: theme.text }]}>
              {t('dashboard.apiStatus')}: {t('common.online')}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { backgroundColor: '#059669' }]} />
            <Text style={[styles.statusText, { color: theme.text }]}>
              {t('dashboard.dbStatus')}: {t('common.healthy')}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { backgroundColor: '#D97706' }]} />
            <Text style={[styles.statusText, { color: theme.text }]}>
              {t('dashboard.syncStatus')}: {t('dashboard.syncing')}
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  systemStatus: {
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusItems: {
    gap: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
  },
});