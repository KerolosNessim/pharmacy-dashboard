"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { onForegroundMessage } from "@/lib/firebase/client";
import { useFcm } from "@/hooks/use-fcm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotificationsApi, getUnreadCountApi } from "@/api/notifications";
import { subscribeToTopicApi } from "@/api/fcm";
import { useUserStore } from "@/stores/user-store";
import { showNotificationToast } from "@/lib/notification-toast";
import type { Notification } from "@/types/notifications";

interface FirebaseContextType {
  token: string | null;
  notificationPermission: NotificationPermission | "unsupported";
  requestPermission: () => Promise<void>;
  unreadCount: number;
  isLoading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseNotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";
  const {
    token,
    notificationPermission,
    requestPermission,
    isLoading: fcmLoading,
  } = useFcm(VAPID_KEY);

  const seenNotificationIdsRef = useRef<Set<string>>(new Set());
  const pollingInitializedRef = useRef(false);

  const isLoggedIn = !!user?.id;

  const { data: unreadCountData, isLoading: countLoading } = useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const res = await getUnreadCountApi();
      if (!res.ok) return 0;
      return res.data?.data ?? 0;
    },
    enabled: isLoggedIn,
    refetchInterval: isLoggedIn ? 15_000 : false,
    refetchIntervalInBackground: true,
  });

  const unreadCount = unreadCountData ?? 0;

  // Poll unread notifications and show in-app toasts (works even when FCM push fails)
  const { data: latestUnread } = useQuery({
    queryKey: ["notifications", "poll-unread"],
    queryFn: async () => {
      const res = await getNotificationsApi(1, "unread");
      if (!res.ok) return [] as Notification[];
      return res.data?.data?.data ?? [];
    },
    enabled: isLoggedIn,
    refetchInterval: isLoggedIn ? 15_000 : false,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!isLoggedIn || !latestUnread) return;

    if (!pollingInitializedRef.current) {
      latestUnread.forEach((n) => seenNotificationIdsRef.current.add(n.id));
      pollingInitializedRef.current = true;
      return;
    }

    for (const notification of latestUnread) {
      if (seenNotificationIdsRef.current.has(notification.id)) continue;
      seenNotificationIdsRef.current.add(notification.id);
      showNotificationToast(notification);
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    }
  }, [isLoggedIn, latestUnread, queryClient]);

  // Ask for browser notification permission after login
  useEffect(() => {
    if (!isLoggedIn) {
      pollingInitializedRef.current = false;
      seenNotificationIdsRef.current.clear();
      return;
    }

    if (
      notificationPermission === "default" &&
      typeof window !== "undefined" &&
      "Notification" in window
    ) {
      void requestPermission();
    }
  }, [isLoggedIn, notificationPermission, requestPermission]);

  // Register device token with backend for push delivery
  useEffect(() => {
    if (!token || !isLoggedIn) return;
    subscribeToTopicApi(token).catch(() => {
      // Backend may reject invalid/expired tokens — polling still works.
    });
  }, [token, isLoggedIn]);

  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      showNotificationToast({
        title: payload.notification?.title || payload.data?.title,
        body: payload.notification?.body || payload.data?.body,
      });
    });

    return () => unsubscribe();
  }, [queryClient]);

  // Show toast when service worker receives a push while the tab is open
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const onSwMessage = (event: MessageEvent) => {
      if (event.data?.type !== "FCM_BACKGROUND_MESSAGE") return;

      const payload = event.data.payload ?? {};
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      showNotificationToast({
        title: payload.data?.title || payload.notification?.title,
        body: payload.data?.body || payload.notification?.body,
      });
    };

    navigator.serviceWorker.addEventListener("message", onSwMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onSwMessage);
  }, [queryClient]);

  return (
    <FirebaseContext.Provider
      value={{
        token,
        notificationPermission,
        requestPermission,
        unreadCount,
        isLoading: fcmLoading || countLoading,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseNotifications = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error(
      "useFirebaseNotifications must be used within a FirebaseNotificationProvider",
    );
  }
  return context;
};
