import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { LanguageContext } from '@/context/LanguageContext';
import { AccessibilityContext } from '@/context/AccessibilityContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchAlerts, markAlertAsRead } from '@/store/slices/alertsSlice';

export default function AlertsScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { alerts, loading, unreadCount } = useAppSelector(state => state.alerts);
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { accessibility } = useContext(AccessibilityContext);

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  useEffect(() => {
    if (user) {
      dispatch(fetchAlerts({ userId: user.id, userRole: user.role }));
    }
  }, [dispatch, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await dispatch(fetchAlerts({ userId: user.id, userRole: user.role }));
    }
    setRefreshing(false);
  };

  const handleAlertPress = async (alertId: string) => {
    if (user) {
      await dispatch(markAlertAsRead({ alertId, userId: user.id }));
    }
  };

  const getFilteredAlerts = () => {
    switch (filter) {
      case 'unread':
        return alerts.filter(alert => !alert.isRead);
      case 'critical':
        return alerts.filter(alert => alert.severity === 'critical');
      default:
        return alerts;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return theme.error;
      case 'high':
        return '#DC2626';
      case 'medium':
        return theme.warning;
      case 'low':
        return theme.success;
      default:
        return theme.textSecondary;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'outbreak':
        return 'warning';
      case 'weather':
        return 'rainy';
      case 'emergency':
        return 'medical';
      case 'system':
        return 'settings';
      case 'reminder':
        return 'time';
      default:
        return 'information-circle';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
          {t('alerts.title')}
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
          {unreadCount > 0 
            ? t('alerts.unreadCount', { count: unreadCount })
            : t('alerts.allRead')
          }
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {(['all', 'unread', 'critical'] as const).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              {
                backgroundColor: filter === filterType ? theme.primary : theme.surface,
                borderColor: theme.border,
              }
            ]}
            onPress={() => setFilter(filterType)}
            accessible={true}
            accessibilityLabel={t(`alerts.filter.${filterType}`)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === filterType ? '#FFFFFF' : theme.text,
                  fontSize: accessibility.largeText ? 16 : 14,
                }
              ]}
            >
              {t(`alerts.filter.${filterType}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alerts List */}
      <ScrollView
        style={styles.alertsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <TouchableOpacity
              key={alert.id}
              style={[
                styles.alertCard,
                {
                  backgroundColor: alert.isRead ? theme.surface : theme.background,
                  borderColor: alert.isRead ? theme.border : getSeverityColor(alert.severity),
                  borderWidth: alert.isRead ? 1 : 2,
                }
              ]}
              onPress={() => handleAlertPress(alert.id)}
              accessible={true}
              accessibilityLabel={`${alert.title}, ${alert.severity} severity, ${alert.isRead ? 'read' : 'unread'}`}
            >
              <View style={styles.alertHeader}>
                <View style={styles.alertIconContainer}>
                  <Ionicons 
                    name={getAlertIcon(alert.type)} 
                    size={24} 
                    color={getSeverityColor(alert.severity)} 
                  />
                  {!alert.isRead && (
                    <View 
                      style={[
                        styles.unreadIndicator, 
                        { backgroundColor: getSeverityColor(alert.severity) }
                      ]} 
                    />
                  )}
                </View>
                
                <View style={styles.alertInfo}>
                  <Text 
                    style={[
                      styles.alertTitle, 
                      { 
                        color: theme.text,
                        fontSize: accessibility.largeText ? 18 : 16,
                        fontWeight: alert.isRead ? '500' : 'bold',
                      }
                    ]}
                  >
                    {alert.title}
                  </Text>
                  
                  <View style={styles.alertMeta}>
                    <Text 
                      style={[
                        styles.alertSeverity, 
                        { 
                          color: getSeverityColor(alert.severity),
                          fontSize: accessibility.largeText ? 14 : 12,
                        }
                      ]}
                    >
                      {alert.severity.toUpperCase()}
                    </Text>
                    <Text 
                      style={[
                        styles.alertTime, 
                        { 
                          color: theme.textSecondary,
                          fontSize: accessibility.largeText ? 14 : 12,
                        }
                      ]}
                    >
                      {formatTimestamp(alert.createdAt)}
                    </Text>
                  </View>
                </View>
                
                {alert.isActionRequired && (
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                )}
              </View>
              
              <Text 
                style={[
                  styles.alertMessage, 
                  { 
                    color: theme.textSecondary,
                    fontSize: accessibility.largeText ? 16 : 14,
                  }
                ]}
              >
                {alert.message}
              </Text>
              
              {alert.location && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={16} color={theme.textSecondary} />
                  <Text 
                    style={[
                      styles.locationText, 
                      { 
                        color: theme.textSecondary,
                        fontSize: accessibility.largeText ? 14 : 12,
                      }
                    ]}
                  >
                    {alert.location.district}, {alert.location.block}
                    {alert.location.village && `, ${alert.location.village}`}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Ionicons name="notifications-off" size={64} color={theme.textSecondary} />
            <Text 
              style={[
                styles.emptyTitle, 
                { 
                  color: theme.text,
                  fontSize: accessibility.largeText ? 20 : 18,
                }
              ]}
            >
              {t('alerts.noAlerts')}
            </Text>
            <Text 
              style={[
                styles.emptyMessage, 
                { 
                  color: theme.textSecondary,
                  fontSize: accessibility.largeText ? 16 : 14,
                }
              ]}
            >
              {t('alerts.noAlertsMessage')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  alertsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  alertCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  unreadIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    marginBottom: 4,
    lineHeight: 22,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertSeverity: {
    fontWeight: 'bold',
  },
  alertTime: {
    fontWeight: '500',
  },
  alertMessage: {
    lineHeight: 20,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: 'center',
    lineHeight: 20,
  },
});