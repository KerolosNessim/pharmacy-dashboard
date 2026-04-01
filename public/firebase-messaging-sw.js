/* global self, importScripts, firebase */
// Firebase Messaging Service Worker
// Handles background push notifications

importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyAqHyf0LsCuI7Ap5I6_ZgVmurNHzmOqZCc",
  authDomain: "pharmacy-api-ee8fe.firebaseapp.com",
  projectId: "pharmacy-api-ee8fe",
  storageBucket: "pharmacy-api-ee8fe.firebasestorage.app",
  messagingSenderId: "439148189545",
  appId: "1:439148189545:web:39937a1ca81394677bcff8",
  measurementId: "G-S5Y24BY4D5",
};

// Initialize Firebase App in SW context
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[Service Worker] Received background message:", payload);

  const notificationTitle =
    payload.data?.title || payload.notification?.title || "New Message";
  const notificationOptions = {
    body:
      payload.data?.body ||
      payload.notification?.body ||
      "Check your notifications.",
    icon: payload.data?.icon || "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
