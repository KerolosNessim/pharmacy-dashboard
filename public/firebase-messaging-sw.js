importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAqHyf0LsCuI7Ap5I6_ZgVmurNHzmOqZcc",
  authDomain: "pharmacy-api-ee8fe.firebaseapp.com",
  projectId: "pharmacy-api-ee8fe",
  storageBucket: "pharmacy-api-ee8fe.firebasestorage.app",
  messagingSenderId: "439148189545",
  appId: "1:439148189545:web:39937a1ca81394677bcff8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
