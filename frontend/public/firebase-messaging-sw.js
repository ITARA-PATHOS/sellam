// public/firebase-messaging-sw.js

/* global self, firebase */
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

// Your Firebase config
firebase.initializeApp({
  apiKey: "AIzaSyAQBkC9UDrKRpFoEFus9kTXOFD7bXerl50",
  authDomain: "sellam-b1cf0.firebaseapp.com",
  projectId: "sellam-b1cf0",
  storageBucket: "sellam-b1cf0.appspot.com", // ✅ Corrected bucket
  messagingSenderId: "110265483944",
  appId: "1:110265483944:web:5a4cd270fc3aa62d0a789d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png' // Optional: change to your app logo
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
