import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { LanguageContext } from '@/context/LanguageContext';
import { AccessibilityContext } from '@/context/AccessibilityContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { signOut } from '@/store/slices/authSlice';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { theme, isDark, isHighContrast, toggleTheme, setHighContrast } = useContext(ThemeContext);
  const { language, changeLanguage, t } = useContext(LanguageContext);
  const { accessibility, toggleAccessibilityFeature } = useContext(AccessibilityContext);

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout'),
      t('settings.logoutConfirmation'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: async () => {
            await dispatch(signOut());
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    rightElement, 
    showChevron = true 
  }: any) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        { 
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        }
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={title}
      accessibilityHint={subtitle}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
          <Ionicons name={icon} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.settingText}>
          <Text 
            style={[
              styles.settingTitle, 
              { 
                color: theme.text,
                fontSize: accessibility.largeText ? 18 : 16,
              }
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              style={[
                styles.settingSubtitle, 
                { 
                  color: theme.textSecondary,
                  fontSize: accessibility.largeText ? 15 : 13,
                }
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {rightElement}
        {showChevron && !rightElement && (
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text 
      style={[
        styles.sectionHeader, 
        { 
          color: theme.text,
          fontSize: accessibility.largeText ? 18 : 16,
        }
      ]}
    >
      {title}
    </Text>
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
          {t('settings.title')}
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
          {t('settings.subtitle')}
        </Text>
      </View>

      {/* Profile Section */}
      <SectionHeader title={t('settings.profile')} />
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <View style={styles.profileCard}>
          <View style={[styles.profileAvatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.profileInitial}>
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text 
              style={[
                styles.profileName, 
                { 
                  color: theme.text,
                  fontSize: accessibility.largeText ? 20 : 18,
                }
              ]}
            >
              {user?.name || 'User'}
            </Text>
            <Text 
              style={[
                styles.profileRole, 
                { 
                  color: theme.textSecondary,
                  fontSize: accessibility.largeText ? 16 : 14,
                }
              ]}
            >
              {t(`home.role.${user?.role || 'villager'}`)}
            </Text>
            {user?.phone && (
              <Text 
                style={[
                  styles.profilePhone, 
                  { 
                    color: theme.textSecondary,
                    fontSize: accessibility.largeText ? 15 : 13,
                  }
                ]}
              >
                {user.phone}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Accessibility Section */}
      <SectionHeader title={t('settings.accessibility')} />
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <SettingItem
          title={t('settings.largeText')}
          subtitle={t('settings.largeTextDescription')}
          icon="text"
          rightElement={
            <Switch
              value={accessibility.largeText}
              onValueChange={() => toggleAccessibilityFeature('largeText')}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          }
          showChevron={false}
        />
        
        <SettingItem
          title={t('settings.highContrast')}
          subtitle={t('settings.highContrastDescription')}
          icon="contrast"
          rightElement={
            <Switch
              value={isHighContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          }
          showChevron={false}
        />
        
        <SettingItem
          title={t('settings.voiceNavigation')}
          subtitle={t('settings.voiceNavigationDescription')}
          icon="volume-high"
          rightElement={
            <Switch
              value={accessibility.voiceNavigation}
              onValueChange={() => toggleAccessibilityFeature('voiceNavigation')}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          }
          showChevron={false}
        />
      </View>

      {/* Appearance Section */}
      <SectionHeader title={t('settings.appearance')} />
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <SettingItem
          title={t('settings.darkMode')}
          subtitle={t('settings.darkModeDescription')}
          icon="moon"
          rightElement={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          }
          showChevron={false}
        />
        
        <SettingItem
          title={t('settings.language')}
          subtitle={`Current: ${language.toUpperCase()}`}
          icon="language"
          onPress={() => {
            // Cycle through languages for demo
            const languages = ['en', 'hi', 'as', 'bn'];
            const currentIndex = languages.indexOf(language);
            const nextIndex = (currentIndex + 1) % languages.length;
            changeLanguage(languages[nextIndex] as any);
          }}
        />
      </View>

      {/* Data & Privacy Section */}
      <SectionHeader title={t('settings.dataPrivacy')} />
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <SettingItem
          title={t('settings.syncData')}
          subtitle="Sync your data across devices"
          icon="sync"
          onPress={() => {}}
        />
        
        <SettingItem
          title={t('settings.exportData')}
          subtitle="Export your health data"
          icon="download"
          onPress={() => {}}
        />
        
        <SettingItem
          title={t('settings.privacyPolicy')}
          subtitle="View our privacy policy"
          icon="shield-checkmark"
          onPress={() => {}}
        />
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[
          styles.logoutButton,
          { 
            backgroundColor: theme.error,
            minHeight: accessibility.largeText ? 60 : 50,
          }
        ]}
        onPress={handleLogout}
        accessible={true}
        accessibilityLabel={t('settings.logout')}
      >
        <Ionicons name="log-out" size={24} color="#FFFFFF" />
        <Text 
          style={[
            styles.logoutText,
            { fontSize: accessibility.largeText ? 18 : 16 }
          ]}
        >
          {t('settings.logout')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 20,
  },
  sectionHeader: {
    fontWeight: '600',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  section: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileRole: {
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  profilePhone: {
    fontWeight: '400',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    lineHeight: 18,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});