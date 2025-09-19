import { 
  firebaseAuth, 
  firebaseFirestore, 
  firebaseStorage, 
  firebaseMessaging,
  firebaseFunctions,
  firebaseAnalytics 
} from '@/config/firebase';
import { User, HealthReport, OutbreakData, Alert } from '@/store/slices/healthDataSlice';

export class FirebaseService {
  // Authentication Services
  static async signInWithPhoneNumber(phoneNumber: string) {
    try {
      const confirmation = await firebaseAuth.signInWithPhoneNumber(phoneNumber);
      return confirmation;
    } catch (error) {
      console.error('Phone sign-in error:', error);
      throw error;
    }
  }

  static async verifyPhoneNumber(confirmation: any, code: string) {
    try {
      const result = await confirmation.confirm(code);
      return result;
    } catch (error) {
      console.error('Phone verification error:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      await firebaseAuth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // User Management
  static async createUserProfile(userId: string, userData: Partial<User>) {
    try {
      await firebaseFirestore.collection('users').doc(userId).set({
        ...userData,
        createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Create user profile error:', error);
      throw error;
    }
  }

  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const doc = await firebaseFirestore.collection('users').doc(userId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<User>) {
    try {
      await firebaseFirestore.collection('users').doc(userId).update({
        ...updates,
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // Health Reports
  static async submitHealthReport(report: Omit<HealthReport, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await firebaseFirestore.collection('health_reports').add({
        ...report,
        createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });
      
      // Trigger cloud function for analysis
      const analyzeReport = firebaseFunctions.httpsCallable('analyzeHealthReport');
      await analyzeReport({ reportId: docRef.id });
      
      return docRef.id;
    } catch (error) {
      console.error('Submit health report error:', error);
      throw error;
    }
  }

  static async getHealthReports(filters?: any): Promise<HealthReport[]> {
    try {
      let query = firebaseFirestore
        .collection('health_reports')
        .orderBy('createdAt', 'desc');

      if (filters?.severity) {
        query = query.where('severity', 'in', filters.severity);
      }

      if (filters?.status) {
        query = query.where('status', 'in', filters.status);
      }

      if (filters?.dateRange?.start) {
        query = query.where('createdAt', '>=', new Date(filters.dateRange.start));
      }

      if (filters?.dateRange?.end) {
        query = query.where('createdAt', '<=', new Date(filters.dateRange.end));
      }

      const snapshot = await query.limit(100).get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      })) as HealthReport[];
    } catch (error) {
      console.error('Get health reports error:', error);
      throw error;
    }
  }

  static async updateReportStatus(reportId: string, status: string, notes?: string) {
    try {
      await firebaseFirestore.collection('health_reports').doc(reportId).update({
        status,
        notes,
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Update report status error:', error);
      throw error;
    }
  }

  // Outbreak Management
  static async getActiveOutbreaks(): Promise<OutbreakData[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection('outbreaks')
        .where('status', '==', 'active')
        .orderBy('severity', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as OutbreakData[];
    } catch (error) {
      console.error('Get active outbreaks error:', error);
      throw error;
    }
  }

  // Alerts and Notifications
  static async getAlerts(userId: string, userRole: string): Promise<Alert[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection('alerts')
        .where('targetRoles', 'array-contains', userRole)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      })) as Alert[];

      // Get read status for each alert
      const readStatusSnapshot = await firebaseFirestore
        .collection('users')
        .doc(userId)
        .collection('alert_status')
        .get();

      const readAlerts = new Set(readStatusSnapshot.docs.map(doc => doc.id));

      return alerts.map(alert => ({
        ...alert,
        isRead: readAlerts.has(alert.id),
      }));
    } catch (error) {
      console.error('Get alerts error:', error);
      throw error;
    }
  }

  static async markAlertAsRead(alertId: string, userId: string) {
    try {
      await firebaseFirestore
        .collection('users')
        .doc(userId)
        .collection('alert_status')
        .doc(alertId)
        .set({
          readAt: firebaseFirestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Mark alert as read error:', error);
      throw error;
    }
  }

  // Media Upload
  static async uploadMedia(uri: string, path: string, metadata?: any): Promise<string> {
    try {
      const reference = firebaseStorage.ref(path);
      await reference.putFile(uri, metadata);
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Upload media error:', error);
      throw error;
    }
  }

  // Push Notifications
  static async getFCMToken(): Promise<string | null> {
    try {
      const token = await firebaseMessaging.getToken();
      return token;
    } catch (error) {
      console.error('Get FCM token error:', error);
      return null;
    }
  }

  static async subscribeToTopic(topic: string) {
    try {
      await firebaseMessaging.subscribeToTopic(topic);
    } catch (error) {
      console.error('Subscribe to topic error:', error);
      throw error;
    }
  }

  static async unsubscribeFromTopic(topic: string) {
    try {
      await firebaseMessaging.unsubscribeFromTopic(topic);
    } catch (error) {
      console.error('Unsubscribe from topic error:', error);
      throw error;
    }
  }

  // Analytics
  static async logEvent(eventName: string, parameters?: any) {
    try {
      if (__DEV__) return; // Don't log analytics in development
      await firebaseAnalytics.logEvent(eventName, parameters);
    } catch (error) {
      console.error('Log analytics event error:', error);
    }
  }

  static async setUserProperties(properties: any) {
    try {
      if (__DEV__) return;
      for (const [key, value] of Object.entries(properties)) {
        await firebaseAnalytics.setUserProperty(key, value as string);
      }
    } catch (error) {
      console.error('Set user properties error:', error);
    }
  }

  // Real-time Listeners
  static subscribeToHealthReports(callback: (reports: HealthReport[]) => void, filters?: any) {
    let query = firebaseFirestore
      .collection('health_reports')
      .orderBy('createdAt', 'desc');

    if (filters?.severity) {
      query = query.where('severity', 'in', filters.severity);
    }

    return query.limit(50).onSnapshot(
      snapshot => {
        const reports = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
        })) as HealthReport[];
        callback(reports);
      },
      error => {
        console.error('Health reports subscription error:', error);
      }
    );
  }

  static subscribeToAlerts(userId: string, userRole: string, callback: (alerts: Alert[]) => void) {
    return firebaseFirestore
      .collection('alerts')
      .where('targetRoles', 'array-contains', userRole)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .onSnapshot(
        snapshot => {
          const alerts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
            isRead: false, // Will be updated separately
          })) as Alert[];
          callback(alerts);
        },
        error => {
          console.error('Alerts subscription error:', error);
        }
      );
  }
}