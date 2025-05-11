import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDawp7XDQqPjhowIlF14Emcco4M8WcXqmo",
  projectId: "nguyenhuutinh-daf0b",
  storageBucket: "nguyenhuutinh-daf0b.firebasestorage.app",
  messagingSenderId: "381456532401",
  appId: "1:381456532401:android:76c486692e437673187390"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Auth và Firestore
export const auth = getAuth(app);
export const db = getFirestore(app); 