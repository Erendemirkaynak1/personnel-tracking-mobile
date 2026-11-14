import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase web configuration is a public client identifier, not an admin secret.
// Restrict this key to this app and the Firebase APIs it actually uses in Google Cloud.
const firebaseConfig = {
  apiKey: "AIzaSyAoh9S5m-h_VMVRV5f9IizSFtnMQ_WFBOQ",
  authDomain: "personeltakip-60760.firebaseapp.com",
  databaseURL: "https://personeltakip-60760-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "personeltakip-60760",
  storageBucket: "personeltakip-60760.firebasestorage.app",
  messagingSenderId: "148591490016",
  appId: "1:148591490016:web:4792571ed395e81e89f185",
  measurementId: "G-694H8T91NJ",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // Fast Refresh can evaluate this module again after Auth was initialized.
  if (error?.code !== 'auth/already-initialized') {
    throw error;
  }
  auth = getAuth(app);
}

export { auth };
export const database = getDatabase(app);
