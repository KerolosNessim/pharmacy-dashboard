"use client";

import { useEffect } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { subscribeToTopicApi } from "@/api/fcm";
import { toast } from "sonner";

export const useFCM = () => {
  useEffect(() => {
    const setupFCM = async () => {
      if (!messaging) return;

      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });

          if (token) {
            console.log("FCM Token:", token);
            // Subscribe to all_users topic via backend
            const res = await subscribeToTopicApi(token, "all_users");
            if (res.ok) {
              console.log("Successfully subscribed to all_users topic");
            } else {
              console.error("Failed to subscribe to topic:", res.error);
            }
          } else {
            console.warn("No FCM registration token available.");
          }
        }
      } catch (error) {
        console.error("Error setting up FCM:", error);
      }
    };

    setupFCM();

    // Handle foreground messages
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        toast(payload.notification?.title || "New Notification", {
          description: payload.notification?.body,
        });
      });

      return () => unsubscribe();
    }
  }, []);
};
