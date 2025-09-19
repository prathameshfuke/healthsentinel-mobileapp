import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/store/hooks';

export default function TabLayout() {
  const { user } = useAppSelector(state => state.auth);

  if (!user) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
      }}>
      
      {/* Home tab - available to all users */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Report tab - available to all users */}
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />

      {/* Dashboard tab - only for Health Officials */}
      {user.role === 'health_official' && (
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="bar-chart" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Field Data tab - for ASHA Workers */}
      {user.role === 'asha_worker' && (
        <Tabs.Screen
          name="fielddata"
          options={{
            title: 'Field Data',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="clipboard" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Alerts tab - available to all users */}
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />

      {/* Settings tab - available to all users */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}