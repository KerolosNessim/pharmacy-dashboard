import { useState, useEffect, useCallback } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase/client";

export const useFcm = (vapidKey: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const [isLoading, setIsLoading] = useState(false);

  // Check supported and current permission status on mount
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }
    setNotificationPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("Notifications are not supported in this browser.");
      return;
    }

    setIsLoading(true);
    try {
      // Handle both old callback-style and new Promise-style Notification API
      let permission: NotificationPermission;
      
      const result = Notification.requestPermission();
      
      // If it's a Promise, await it; if it's the old callback style, handle that
      if (result && typeof (result as Promise<NotificationPermission>).then === "function") {
        permission = await (result as Promise<NotificationPermission>);
      } else {
        // Fallback: use Promise wrapper for old Safari callback style
        permission = await new Promise<NotificationPermission>((resolve) => {
          Notification.requestPermission(resolve);
        });
      }

      console.log("Notification permission result:", permission);
      setNotificationPermission(permission);

      if (permission === "granted") {
        const messagingInstance = getFirebaseMessaging();
        console.log("Firebase messaging instance:", messagingInstance);
        if (messagingInstance) {
          try {
            const deviceToken = await getToken(messagingInstance, { vapidKey });
            console.log("FCM Token generated:", deviceToken);
            setToken(deviceToken);
          } catch (tokenError) {
            console.error("Failed to get FCM token:", tokenError);
          }
        } else {
          console.error("Firebase messaging instance is null");
        }
      } else {
        console.log("Notification permission not granted:", permission);
      }
    } catch (error) {
      console.error("Failed to request notification permission:", error);
    } finally {
      setIsLoading(false);
    }
  }, [vapidKey]);

  return {
    token,
    notificationPermission,
    requestPermission,
    isLoading,
  };
};
