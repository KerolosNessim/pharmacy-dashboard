import { useState, useEffect, useCallback } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging, isPushSupported } from "@/lib/firebase/client";

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
    if (!isPushSupported()) {
      setNotificationPermission("unsupported");
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
        if (messagingInstance) {
          try {
            let registration: ServiceWorkerRegistration | undefined;
            try {
              registration = await navigator.serviceWorker.register(
                "/firebase-messaging-sw.js",
              );
              await navigator.serviceWorker.ready;
            } catch {
              return;
            }

            const deviceToken = await getToken(messagingInstance, {
              vapidKey,
              serviceWorkerRegistration: registration,
            });
            setToken(deviceToken);
          } catch {
            // Push service not available in this environment.
          }
        }
      }
    } catch {
      // Permission request failed or was dismissed.
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
