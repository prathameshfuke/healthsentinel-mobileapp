import { useContext, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '@/context/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { initializeNetworkListener } from '@/store/slices/offlineSlice';
import { initializeMessaging } from '@/store/slices/alertsSlice';

export default function Index() {
  const { user, loading, isAuthenticated } = useAppSelector(state => state.auth);
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize app services
    dispatch(initializeNetworkListener());
    dispatch(initializeMessaging());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, loading, isAuthenticated]);

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading Health Sentinel...
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
  },
});