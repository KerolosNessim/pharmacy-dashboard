"use client";

import React, { createContext, useContext, useEffect } from "react";
import { onForegroundMessage } from "@/lib/firebase/client";
import { useFcm } from "@/hooks/use-fcm";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUnreadCountApi } from "@/api/notifications";

interface FirebaseContextType {
  token: string | null;
  notificationPermission: NotificationPermission | "unsupported";
  requestPermission: () => Promise<void>;
  unreadCount: number;
  isLoading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseNotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";
  const { token, notificationPermission, requestPermission, isLoading: fcmLoading } = useFcm(VAPID_KEY);

  // Fetch unread count from backend
  const { data: unreadCountData, isLoading: countLoading } = useQuery({
    queryKey: ["unread-count"],
    queryFn: () => getUnreadCountApi().then((res) => res.data?.data ?? 0),
  });

  const unreadCount = unreadCountData ?? 0;

  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = onForegroundMessage((payload) => {
      console.log("Foreground message received:", payload);
      
      // Invalidate unread count to refetch from server
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      
      // Show a toast for foreground messages
      const title = payload.notification?.title || payload.data?.title || "New Notification";
      const body = payload.notification?.body || payload.data?.body || "Check your notifications";
      
      toast.success(title, {
        description: body,
        position: "top-right",
      });
    });

    return () => unsubscribe();
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
      "useFirebaseNotifications must be used within a FirebaseNotificationProvider"
    );
  }
  return context;
};
