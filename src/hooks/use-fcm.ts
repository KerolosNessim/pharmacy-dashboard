import { useState, useEffect, useCallback } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging, isPushSupported } from "@/lib/firebase/client";

async function registerMessagingWorker() {
  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );
  await navigator.serviceWorker.ready;
  return registration;
}

async function fetchDeviceToken(vapidKey: string): Promise<string | null> {
  const messagingInstance = getFirebaseMessaging();
  if (!messagingInstance) return null;

  const registration = await registerMessagingWorker();
  const deviceToken = await getToken(messagingInstance, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });

  return deviceToken || null;
}

export const useFcm = (vapidKey: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }
    setNotificationPermission(Notification.permission);
  }, []);

  // If permission was granted earlier (e.g. on login), fetch token without re-prompting
  useEffect(() => {
    if (!vapidKey || notificationPermission !== "granted") return;

    let cancelled = false;

    fetchDeviceToken(vapidKey)
      .then((deviceToken) => {
        if (!cancelled && deviceToken) setToken(deviceToken);
      })
      .catch(() => {
        // Push unavailable in this browser/environment.
      });

    return () => {
      cancelled = true;
    };
  }, [notificationPermission, vapidKey]);

  const requestPermission = useCallback(async () => {
    if (!isPushSupported() || !vapidKey) {
      setNotificationPermission("unsupported");
      return;
    }

    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        const deviceToken = await fetchDeviceToken(vapidKey);
        if (deviceToken) setToken(deviceToken);
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
