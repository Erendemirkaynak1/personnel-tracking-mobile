// Import only what you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAoh9S5m-h_VMVRV5f9IizSFtnMQ_WFBOQ",
  authDomain: "personeltakip-60760.firebaseapp.com",
  databaseURL: "https://personeltakip-60760-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "personeltakip-60760",
  storageBucket: "personeltakip-60760.firebasestorage.app",
  messagingSenderId: "148591490016",
  appId: "1:148591490016:web:4792571ed395e81e89f185",
  measurementId: "G-694H8T91NJ"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Geliştirilmiş fetchEmployees fonksiyonu
export const fetchEmployees = async () => {
  try {
    const snapshot = await get(ref(database, 'employees'));
    if (!snapshot.exists()) {
      throw new Error('Veritabanında employees düğümü bulunamadı');
    }
    return snapshot.val();
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    throw error;
  }
};