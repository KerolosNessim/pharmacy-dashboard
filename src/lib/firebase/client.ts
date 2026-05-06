import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
  MessagePayload,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

// Lazy initialize Firebase App only in the browser
export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === "undefined") return null;
  
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return app;
};

// Singleton pattern for Messaging, only in the browser
export const getFirebaseMessaging = (): Messaging | null => {
  if (typeof window === "undefined") return null;
  
  const firebaseApp = getFirebaseApp();
  if (firebaseApp && !messaging) {
    try {
      messaging = getMessaging(firebaseApp);
    } catch (error) {
      console.error("Failed to initialize Firebase Messaging:", error);
    }
  }
  return messaging;
};

// Helper for listening to messages in the foreground
export const onForegroundMessage = (
  callback: (payload: MessagePayload) => void
) => {
  if (typeof window === "undefined") return () => {};
  
  const messagingInstance = getFirebaseMessaging();
  if (messagingInstance) {
    return onMessage(messagingInstance, (payload: MessagePayload) => {
      console.log("Foreground message received:", payload);
      callback(payload);
    });
  }
  return () => {};
};

// Request notification permission and get the FCM registration token
// export const getFCMToken = async (): Promise<string | null> => {
//   if (typeof window === "undefined") return null;

//   try {
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.warn("Notification permission not granted.");
//       return null;
//     }

//     const messagingInstance = getFirebaseMessaging();
//     if (!messagingInstance) return null;

//     const token = await getToken(messagingInstance, {
//       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//     });

//     return token ?? null;
//   } catch (error) {
//     console.error("Failed to get FCM token:", error);
//     return null;
//   }
// };


export const getFCMToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
      return null;
    }

    const messagingInstance = getFirebaseMessaging();
    if (!messagingInstance) return null;

    let registration;

try {
  registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );
} catch (e) {
  console.error("SW registration failed", e);
  return null;
}

    const token = await getToken(messagingInstance, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("FCM TOKEN:", token);

    return token ?? null;
  } catch (error) {
    console.error("Failed to get FCM token:", error);
    return null;
  }
};

