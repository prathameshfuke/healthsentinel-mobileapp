import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { LanguageContext } from '@/context/LanguageContext';
import { AccessibilityContext } from '@/context/AccessibilityContext';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signInWithPhone, verifyOTP, demoLogin } from '@/store/slices/authSlice';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const { theme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);
  const { accessibility } = useContext(AccessibilityContext);
  const router = useRouter();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmation, setConfirmation] = useState<any>(null);

  const demoUsers = [
    { id: '1', name: 'Dr. Rajesh Kumar', role: 'health_official', phone: '+911234567890' },
    { id: '2', name: 'Priya Devi', role: 'asha_worker', phone: '+919876543210' },
    { id: '3', name: 'Ram Singh', role: 'villager', phone: '+918765432109' },
  ];

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert(t('common.error'), t('auth.enterValidPhone'));
      return;
    }

    try {
      const result = await dispatch(signInWithPhone({ phoneNumber })).unwrap();
      setConfirmation(result.confirmation);
      setStep('otp');
      Alert.alert(t('auth.otpSent'), t('auth.otpSentMessage'));
    } catch (error: any) {
      Alert.alert(t('common.error'), error);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert(t('common.error'), t('auth.enterValidOTP'));
      return;
    }

    if (!confirmation) {
      Alert.alert(t('common.error'), 'Please request OTP first');
      return;
    }

    try {
      await dispatch(verifyOTP({ confirmation, otp })).unwrap();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(t('common.error'), error);
    }
  };

  const handleDemoLogin = (user: any) => {
    dispatch(demoLogin({
      ...user,
      permissions: ['basic_access'],
      lastActive: new Date().toISOString(),
      isOnline: true,
    }));
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
            <Ionicons name="medical" size={48} color="#FFFFFF" />
          </View>
          <Text 
            style={[styles.appTitle, { color: theme.text }]}
            accessible={true}
            accessibilityLabel="Health Sentinel"
          >
            Health Sentinel
          </Text>
          <Text style={[styles.appSubtitle, { color: theme.textSecondary }]}>
            {t('auth.subtitle')}
          </Text>
        </View>

        <View style={styles.form}>
          {step === 'phone' ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>
                  {t('auth.phoneNumber')}
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { 
                      borderColor: theme.border,
                      backgroundColor: theme.surface,
                      color: theme.text,
                      fontSize: accessibility.largeText ? 18 : 16,
                    }
                  ]}
                  placeholder={t('auth.phonePlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  accessible={true}
                  accessibilityLabel={t('auth.phoneNumber')}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { 
                    backgroundColor: loading ? theme.textSecondary : theme.primary,
                    minHeight: accessibility.largeText ? 60 : 50,
                  }
                ]}
                onPress={handleSendOTP}
                disabled={loading}
                accessible={true}
                accessibilityLabel={t('auth.sendOTP')}
                accessibilityRole="button"
              >
                <Text style={[styles.primaryButtonText, { fontSize: accessibility.largeText ? 18 : 16 }]}>
                  {loading ? t('auth.sending') : t('auth.sendOTP')}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>
                  {t('auth.enterOTP')}
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { 
                      borderColor: theme.border,
                      backgroundColor: theme.surface,
                      color: theme.text,
                      fontSize: accessibility.largeText ? 18 : 16,
                    }
                  ]}
                  placeholder="123456"
                  placeholderTextColor={theme.textSecondary}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  accessible={true}
                  accessibilityLabel={t('auth.enterOTP')}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { 
                    backgroundColor: loading ? theme.textSecondary : theme.primary,
                    minHeight: accessibility.largeText ? 60 : 50,
                  }
                ]}
                onPress={handleVerifyOTP}
                disabled={loading}
                accessible={true}
                accessibilityLabel={t('auth.verifyOTP')}
                accessibilityRole="button"
              >
                <Text style={[styles.primaryButtonText, { fontSize: accessibility.largeText ? 18 : 16 }]}>
                  {loading ? t('auth.verifying') : t('auth.verifyOTP')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setStep('phone')}
                accessible={true}
                accessibilityLabel={t('auth.changeNumber')}
                accessibilityRole="button"
              >
                <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>
                  {t('auth.changeNumber')}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Demo Login Options */}
        <View style={styles.demoSection}>
          <Text style={[styles.demoTitle, { color: theme.text }]}>
            {t('auth.demoLogin')}
          </Text>
          {demoUsers.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={[styles.demoButton, { backgroundColor: theme.surface }]}
              onPress={() => handleDemoLogin(user)}
              accessible={true}
              accessibilityLabel={`${t('auth.loginAs')} ${user.name}`}
              accessibilityRole="button"
            >
              <View style={styles.demoUserInfo}>
                <Text style={[styles.demoUserName, { color: theme.text }]}>
                  {user.name}
                </Text>
                <Text style={[styles.demoUserRole, { color: theme.textSecondary }]}>
                  {t(`home.role.${user.role}`)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  demoSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 30,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  demoUserInfo: {
    flex: 1,
  },
  demoUserName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  demoUserRole: {
    fontSize: 14,
  },
});