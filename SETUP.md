# Health Sentinel - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project setup
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. **Install Dependencies**
```bash
npm install
# or
yarn install
```

2. **Firebase Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Phone Number sign-in)
   - Create Firestore database
   - Enable Cloud Storage
   - Enable Cloud Messaging
   - Download configuration files:
     - `google-services.json` (Android) → place in project root
     - `GoogleService-Info.plist` (iOS) → place in project root

3. **Environment Configuration**
```bash
cp .env.example .env
```
Fill in your Firebase configuration values in `.env`

4. **Start Development Server**
```bash
npm run dev
# or
yarn dev
```

## 🔥 Firebase Configuration

### Firestore Collections Structure
```
users/
├── {userId}/
│   ├── name: string
│   ├── role: 'health_official' | 'asha_worker' | 'villager'
│   ├── phone: string
│   ├── location: object
│   └── permissions: array

health_reports/
├── {reportId}/
│   ├── reporterId: string
│   ├── symptoms: array
│   ├── severity: string
│   ├── location: object
│   ├── status: string
│   └── createdAt: timestamp

alerts/
├── {alertId}/
│   ├── title: string
│   ├── message: string
│   ├── type: string
│   ├── severity: string
│   ├── targetRoles: array
│   └── createdAt: timestamp

outbreaks/
├── {outbreakId}/
│   ├── disease: string
│   ├── location: object
│   ├── severity: string
│   ├── caseCount: number
│   └── status: string
```

### Security Rules (Firestore)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Health reports - role-based access
    match /health_reports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.reporterId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'health_official');
    }
    
    // Alerts - role-based access
    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'health_official';
    }
    
    // Outbreaks - read-only for most users
    match /outbreaks/{outbreakId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'health_official';
    }
  }
}
```

### Cloud Functions Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize functions
firebase init functions

# Deploy functions
firebase deploy --only functions
```

## 📱 Development Workflow

### Running the App
```bash
# Start Expo development server
npm run dev

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Building for Production
```bash
# Build for production
expo build:android
expo build:ios

# Or using EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

## 🔧 Key Features Implemented

### ✅ Phase 1: Foundation
- [x] Expo SDK 54 (latest)
- [x] Redux Toolkit with RTK Query
- [x] Firebase Authentication (Phone)
- [x] Firestore real-time database
- [x] Offline-first architecture
- [x] Push notifications setup
- [x] Role-based navigation

### 🚧 Phase 2: Advanced Features (In Progress)
- [ ] Biometric authentication
- [ ] Multi-factor authentication
- [ ] Advanced offline sync
- [ ] ML Kit integration
- [ ] Voice recognition
- [ ] Geofencing alerts

### 📋 Phase 3: AI & Analytics (Planned)
- [ ] TensorFlow Lite models
- [ ] Predictive analytics
- [ ] Advanced dashboard
- [ ] Performance monitoring
- [ ] A/B testing framework

## 🎯 Demo Users

The app includes demo users for testing:

1. **Health Official**: Dr. Rajesh Kumar
   - Phone: +911234567890
   - OTP: 123456
   - Access: Full dashboard, analytics, outbreak management

2. **ASHA Worker**: Priya Devi
   - Phone: +919876543210
   - OTP: 123456
   - Access: Field data collection, offline surveys

3. **Villager**: Ram Singh
   - Phone: +918765432109
   - OTP: 123456
   - Access: Health reporting, family tracking

## 🔒 Security Features

- End-to-end encryption for health data
- Role-based access control
- Session management with automatic refresh
- Secure token storage
- Data anonymization for analytics
- HIPAA compliance considerations

## 📊 Monitoring & Analytics

- Firebase Analytics for user behavior
- Crashlytics for error tracking
- Performance monitoring
- Custom event tracking
- Real-time dashboard metrics

## 🌐 Offline Capabilities

- SQLite local database
- Automatic sync when online
- Conflict resolution
- Background sync
- Data compression
- Storage optimization

## 🚀 Deployment

### Environment Setup
- **Development**: Local Firebase emulators
- **Staging**: Firebase staging project
- **Production**: Firebase production project

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Health Sentinel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build app
        run: eas build --platform all --non-interactive
```

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## 🎉 Next Steps

1. Complete Firebase setup with your project credentials
2. Test authentication flow with demo users
3. Explore the dashboard and reporting features
4. Set up development environment
5. Begin customization for your specific needs

The app is now ready for development and testing with a solid foundation for scaling to production!