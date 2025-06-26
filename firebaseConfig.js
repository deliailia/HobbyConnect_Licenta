import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Configurația Firebase din variabile de mediu
const firebaseConfig = {
  apiKey:"AIzaSyA5QmMZBXDADKfk03f-11rTY1rLPxyEzQc",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
console.log('Firebase API key:', firebaseConfig.apiKey);  // aici verifici dacă cheia există


// Inițializează Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const mailUser = process.env.MAIL_USER || "delia.toni77@gmail.com"; // Poți schimba mailul din .env

module.exports = { firebaseConfig, auth, mailUser };
