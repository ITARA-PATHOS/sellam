// src/firebase.js

// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// ✅ Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAQBkC9UDrKRpFoEFus9kTXOFD7bXerl50",
  authDomain: "sellam-b1cf0.firebaseapp.com",
  projectId: "sellam-b1cf0",
  storageBucket: "sellam-b1cf0.appspot.com", // ✅ Corrected bucket
  messagingSenderId: "110265483944",
  appId: "1:110265483944:web:5a4cd270fc3aa62d0a789d",
  measurementId: "G-1XMS30HNC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Messaging
const messaging = getMessaging(app);

export { messaging };
