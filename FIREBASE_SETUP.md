# Firebase Configuration Guide

This Todo List application now uses Firebase Firestore for cloud storage instead of JSONBin.io. Firebase credentials are configured through the UI, making it perfect for GitHub Pages deployment.

## Features

✅ **UI-Based Configuration**: Configure Firebase through the interface - no environment variables needed  
✅ **Real-time Sync**: Tasks sync across devices in real-time  
✅ **Offline Support**: Works offline, syncs when back online  
✅ **Secure Storage**: Credentials stored locally in browser  
✅ **GitHub Pages Ready**: No server-side configuration required  

## Quick Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or select existing one
3. Enable Firestore Database in test mode
4. Get your web app configuration

### 2. Configure in App
1. Click the Firebase badge in the app header
2. Enter your Firebase credentials in the configuration form
3. Test connection to verify setup
4. Save configuration

### 3. Your Firebase Config
You'll need these fields from your Firebase project settings:

```javascript
{
  "apiKey": "AIzaSyC...",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abcdef..."
}
```

## Benefits Over JSONBin.io

| Feature | Firebase Firestore | JSONBin.io |
|---------|-------------------|------------|
| Real-time sync | ✅ | ❌ |
| Offline support | ✅ | ❌ |
| Free tier | 1GB storage, 50K reads/day | 10K requests/month |
| Setup complexity | UI-based | Requires API keys |
| Scalability | Google infrastructure | Limited |
| Security | Advanced rules | Basic |

## Security Notes

- Firebase credentials are stored locally in your browser
- Not transmitted to any external servers except Firebase
- For production, implement proper Firestore security rules
- Consider enabling Firebase Authentication for enhanced security

## Troubleshooting

### Connection Issues
- Verify all Firebase config fields are correct
- Check Firestore is enabled in your Firebase project
- Ensure Firestore rules allow read/write access

### Sync Problems  
- Check internet connection
- Verify Firebase project is active
- Review browser console for error messages

### Configuration Reset
- Use "Clear Config" button to reset Firebase settings
- App will fall back to local storage only mode
