import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

export type Language = 'en' | 'hi' | 'as' | 'bn';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const translations = {
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.ok': 'OK',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.online': 'Online',
    'common.healthy': 'Healthy',
    
    // Home
    'home.welcome': 'Welcome',
    'home.role.health_official': 'Health Official',
    'home.role.asha_worker': 'ASHA Worker',
    'home.role.villager': 'Community Member',
    'home.outbreakStatus': 'Outbreak Status',
    'home.activeOutbreaks': 'Active Outbreaks',
    'home.reportsToday': 'Reports Today',
    'home.pendingReview': 'Pending Review',
    'home.ashaWorkers': 'ASHA Workers',
    'home.activeWorkers': 'Active Workers',
    'home.todaysVisits': "Today's Visits",
    'home.completed': 'Completed',
    'home.pendingReports': 'Pending Reports',
    'home.needsSubmission': 'Needs Submission',
    'home.communityAlerts': 'Community Alerts',
    'home.new': 'New',
    'home.myReports': 'My Reports',
    'home.thisWeek': 'This Week',
    'home.familyHealth': 'Family Health',
    'home.members': 'Members',
    'home.quickActions': 'Quick Actions',
    'home.quickReport': 'Quick Report',
    'home.reportSymptoms': 'Report Symptoms',
    'home.viewAlerts': 'View Alerts',
    'home.healthAlerts': 'Health Alerts',
    'home.fieldData': 'Field Data',
    'home.collectData': 'Collect Data',
    'home.dashboard': 'Dashboard',
    'home.viewAnalytics': 'View Analytics',
    
    // Report
    'report.title': 'Health Report',
    'report.subtitle': 'Report symptoms and health concerns',
    'report.symptoms': 'Symptoms',
    'report.severity': 'Severity',
    'report.severity.mild': 'Mild',
    'report.severity.moderate': 'Moderate',
    'report.severity.severe': 'Severe',
    'report.description': 'Description',
    'report.descriptionPlaceholder': 'Describe the symptoms and concerns...',
    'report.location': 'Location',
    'report.attachments': 'Photos/Audio',
    'report.submitReport': 'Submit Report',
    'report.submitting': 'Submitting...',
    'report.selectSymptoms': 'Please select at least one symptom',
    'report.reportSubmitted': 'Report submitted successfully',
    'report.reportSubmittedMessage': 'Your health report has been submitted and will be reviewed by health officials.',
    'report.submitError': 'Failed to submit report. Please try again.',
    'report.useVoiceInput': 'Use Voice Input',
    'report.voiceNotSupported': 'Voice input not supported in web preview',
    'report.startSpeaking': 'Start speaking now...',
    'report.sampleVoiceInput': 'I have been experiencing fever and headache for the past two days.',
    'report.voiceInputReceived': 'Voice input received and processed',
    'report.voiceInputError': 'Error processing voice input',
    
    // Alerts
    'alerts.title': 'Health Alerts',
    'alerts.unreadCount': '{{count}} unread alerts',
    'alerts.allRead': 'All alerts read',
    'alerts.filter.all': 'All',
    'alerts.filter.unread': 'Unread',
    'alerts.filter.critical': 'Critical',
    'alerts.noAlerts': 'No Alerts',
    'alerts.noAlertsMessage': 'You have no health alerts at this time',
    'alerts.refreshed': 'Alerts refreshed',
    'alerts.unread': 'unread',
    'alerts.emergencyContact': 'Emergency Contact',
    'alerts.emergencyContactMessage': 'Critical health alerts detected',
    'alerts.callEmergency': 'Call Emergency',
    'alerts.dengueOutbreak': 'Dengue Outbreak Alert',
    'alerts.dengueOutbreakMessage': 'Increased dengue cases reported in your area. Take preventive measures.',
    'alerts.heavyRain': 'Heavy Rain Warning',
    'alerts.heavyRainMessage': 'Heavy rainfall expected. Risk of water-borne diseases.',
    'alerts.waterQuality': 'Water Quality Alert',
    'alerts.waterQualityMessage': 'Water quality issues detected in local wells.',
    'alerts.communityReport': 'Community Health Report',
    'alerts.communityReportMessage': 'New health concerns reported by community members.',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize your app experience',
    'settings.profile': 'Profile',
    'settings.editProfile': 'Edit Profile',
    'settings.language': 'Language',
    'settings.accessibility': 'Accessibility',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.dataPrivacy': 'Data & Privacy',
    'settings.largeText': 'Large Text',
    'settings.largeTextDescription': 'Increase text size for better readability',
    'settings.highContrast': 'High Contrast',
    'settings.highContrastDescription': 'Enhance color contrast for better visibility',
    'settings.voiceNavigation': 'Voice Navigation',
    'settings.voiceNavigationDescription': 'Enable voice feedback and navigation',
    'settings.pictograms': 'Pictograms',
    'settings.pictogramsDescription': 'Show visual icons alongside text',
    'settings.darkMode': 'Dark Mode',
    'settings.darkModeDescription': 'Use dark theme to reduce eye strain',
    'settings.healthAlerts': 'Health Alerts',
    'settings.healthAlertsDescription': 'Receive notifications for health warnings',
    'settings.reportUpdates': 'Report Updates',
    'settings.reportUpdatesDescription': 'Get notified about report status changes',
    'settings.syncData': 'Sync Data',
    'settings.exportData': 'Export Data',
    'settings.privacyPolicy': 'Privacy Policy',
    'settings.logout': 'Logout',
    'settings.logoutConfirmation': 'Are you sure you want to logout?',
    
    // Auth
    'auth.subtitle': 'Rural Healthcare Monitoring System',
    'auth.phoneNumber': 'Phone Number',
    'auth.phonePlaceholder': '+91 XXXXXXXXXX',
    'auth.sendOTP': 'Send OTP',
    'auth.sending': 'Sending...',
    'auth.enterOTP': 'Enter OTP',
    'auth.verifyOTP': 'Verify OTP',
    'auth.verifying': 'Verifying...',
    'auth.changeNumber': 'Change Number',
    'auth.demoLogin': 'Demo Login (for testing)',
    'auth.loginAs': 'Login as',
    'auth.enterValidPhone': 'Please enter a valid phone number',
    'auth.enterValidOTP': 'Please enter a valid 6-digit OTP',
    'auth.otpSent': 'OTP Sent',
    'auth.otpSentMessage': 'An OTP has been sent to your phone number. For demo, use: 123456',
    'auth.invalidOTP': 'Invalid OTP. Please try again.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Health monitoring overview',
    'dashboard.totalReports': 'Total Reports',
    'dashboard.activeOutbreaks': 'Active Outbreaks',
    'dashboard.ashaWorkers': 'ASHA Workers',
    'dashboard.avgResponseTime': 'Avg Response Time',
    'dashboard.outbreakMap': 'Outbreak Map',
    'dashboard.reportTrends': 'Report Trends',
    'dashboard.recentReports': 'Recent Reports',
    'dashboard.systemStatus': 'System Status',
    'dashboard.apiStatus': 'API Status',
    'dashboard.dbStatus': 'Database',
    'dashboard.syncStatus': 'Sync Status',
    'dashboard.syncing': 'Syncing',
    
    // Field Data
    'fieldData.title': 'Field Data',
    'fieldData.subtitle': 'Collect and manage field health data',
    'fieldData.collectData': 'Collect Data',
    'fieldData.history': 'History',
  },
  hi: {
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.ok': 'ठीक है',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    'common.online': 'ऑनलाइन',
    'common.healthy': 'स्वस्थ',
    
    // Home
    'home.welcome': 'स्वागत है',
    'home.role.health_official': 'स्वास्थ्य अधिकारी',
    'home.role.asha_worker': 'आशा कार्यकर्ता',
    'home.role.villager': 'ग्रामीण सदस्य',
    'home.quickActions': 'त्वरित कार्य',
    'home.quickReport': 'त्वरित रिपोर्ट',
    'home.reportSymptoms': 'लक्षण रिपोर्ट करें',
    'home.viewAlerts': 'अलर्ट देखें',
    'home.healthAlerts': 'स्वास्थ्य अलर्ट',
    
    // Report
    'report.title': 'स्वास्थ्य रिपोर्ट',
    'report.subtitle': 'लक्षण और स्वास्थ्य चिंताओं की रिपोर्ट करें',
    'report.symptoms': 'लक्षण',
    'report.severity': 'गंभीरता',
    'report.severity.mild': 'हल्का',
    'report.severity.moderate': 'मध्यम',
    'report.severity.severe': 'गंभीर',
    'report.submitReport': 'रिपोर्ट जमा करें',
    
    // Add more Hindi translations as needed
  },
  // Add Assamese and Bengali translations
  as: {
    'common.loading': 'ল\'ড হৈ আছে...',
    'home.welcome': 'স্বাগতম',
    // Add Assamese translations
  },
  bn: {
    'common.loading': 'লোড হচ্ছে...',
    'home.welcome': 'স্বাগতম',
    // Add Bengali translations
  }
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  changeLanguage: () => {},
  t: (key: string) => key,
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    loadLanguageSettings();
  }, []);

  const loadLanguageSettings = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem('@health_sentinel_language');
      if (storedLanguage && ['en', 'hi', 'as', 'bn'].includes(storedLanguage)) {
        setLanguage(storedLanguage as Language);
      } else {
        // Auto-detect from system locale
        const systemLanguage = Localization.locale?.split('-')[0] || 'en';
        if (['en', 'hi', 'as', 'bn'].includes(systemLanguage)) {
          setLanguage(systemLanguage as Language);
        }
      }
    } catch (error) {
      console.error('Error loading language settings:', error);
      // Fallback to English if there's any error
      setLanguage('en');
    }
  };

  const changeLanguage = async (newLanguage: Language) => {
    setLanguage(newLanguage);
    try {
      await AsyncStorage.setItem('@health_sentinel_language', newLanguage);
    } catch (error) {
      console.error('Error storing language:', error);
    }
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const langTranslations = translations[language] || translations.en;
    let translation = langTranslations[key as keyof typeof langTranslations] || key;
    
    // Simple parameter replacement
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param].toString());
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};