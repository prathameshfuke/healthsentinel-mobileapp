// Temporarily disabled Firebase imports for initial setup
// import { initializeApp, getApps } from '@react-native-firebase/app';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
// import messaging from '@react-native-firebase/messaging';
// import functions from '@react-native-firebase/functions';
// import analytics from '@react-native-firebase/analytics';
// import crashlytics from '@react-native-firebase/crashlytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Temporarily disabled Firebase initialization for initial setup
// Initialize Firebase only if it hasn't been initialized
// let app;
// if (getApps().length === 0) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = getApps()[0];
// }

// Initialize Firebase services
export const firebaseAuth = null; // auth();
export const firebaseFirestore = null; // firestore();
export const firebaseStorage = null; // storage();
export const firebaseMessaging = null; // messaging();
export const firebaseFunctions = null; // functions();
export const firebaseAnalytics = null; // analytics();
export const firebaseCrashlytics = null; // crashlytics();

// Configure Firestore settings
// firebaseFirestore.settings({
//   persistence: true, // Enable offline persistence
//   cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
// });

// Configure Functions emulator for development
// if (__DEV__) {
//   // Uncomment and configure for local development
//   // firebaseFunctions.useEmulator('localhost', 5001);
//   // firebaseFirestore.useEmulator('localhost', 8080);
// }

export default null; // app;