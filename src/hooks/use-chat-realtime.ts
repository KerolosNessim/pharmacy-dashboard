/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { initEcho } from "@/lib/echo-config";
import { useEffect, useRef, useState } from "react";

/**
 * Maintains a list of realtime messages received via Pusher.
 * Completely independent from React Query — no race conditions.
 * The caller merges realtimeMessages with the React Query data.
 */
export const useChatRealtime = ({
  pharmacyId,
  user,
  token,
}: {
  pharmacyId: string;
  user: any;
  token: string | null;
}) => {
  const [realtimeMessages, setRealtimeMessages] = useState<any[]>([]);
  const channelRef = useRef<string | null>(null);

  // Reset realtime messages when switching between conversations
  useEffect(() => {
    setRealtimeMessages([]);
  }, [pharmacyId]);

  useEffect(() => {
    if (!token || !user?.id) return;

    const echo = initEcho(token);
    if (!echo) return;

    const isSuperAdmin = user.role === "super_admin";

    // Subscribe to the user's OWN channel — always authorized
    const channelName = isSuperAdmin
      ? "chat.management"
      : `chat.${user.pharmacy_id}`;

    if (channelRef.current === channelName) return; // already subscribed
    channelRef.current = channelName;

    console.log("📡 Subscribing to:", channelName);

    const channel = echo.private(channelName);

    channel.subscribed(() => console.log("✅ Subscribed:", channelName));
    channel.error((err: any) => console.error("❌ Error:", err));

    channel.listenToAll((event: string, data: any) => {
      console.log("📡 RAW PUSHER EVENT:", event, data);
    });

    channel.listen(".message.sent", (data: any) => {
      const newMessage = data?.message || data;
      console.log("🔥 REALTIME MESSAGE RECEIVED:", {
        id: newMessage.id,
        type: newMessage.file_type,
        sender: newMessage.sender?.name,
        pharmacyId: pharmacyId
      });

      setRealtimeMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) {
          console.log("⏭️ Skipping duplicate message:", newMessage.id);
          return prev;
        }
        return [...prev, newMessage];
      });
    });

    return () => {
      console.log("🔌 Leaving:", channelName);
      echo.leave(channelName);
      channelRef.current = null;
    };
  }, [token, user?.id, user?.pharmacy_id]);

  return { realtimeMessages };
};