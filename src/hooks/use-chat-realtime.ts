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

  // Keep refs of active conversation pharmacyId and user to avoid stale closures in Echo event handlers
  const pharmacyIdRef = useRef(pharmacyId);
  const userRef = useRef(user);

  pharmacyIdRef.current = pharmacyId;
  userRef.current = user;

  // Reset realtime messages when switching between conversations
  useEffect(() => {
    setRealtimeMessages([]);
  }, [pharmacyId]);

  useEffect(() => {
    if (!token || !user?.id) return;

    const echo = initEcho(token, user.role);
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

    const handleMessage = (data: any) => {
      const newMessage = data?.message || data;
      const currentPharmacyId = pharmacyIdRef.current;
      const currentUser = userRef.current;

      console.log("🔥 REALTIME MESSAGE RECEIVED:", {
        id: newMessage?.id,
        type: newMessage?.file_type,
        sender: newMessage?.sender?.name,
        senderPharmacyId: newMessage?.sender?.pharmacy_id,
        fromPharmacyId: newMessage?.from_pharmacy_id,
        senderId: newMessage?.sender?.id,
        currentPharmacyId
      });

      if (!newMessage) return;

      // Extract sender's pharmacy ID from any possible attribute
      const senderPharmacyId =
        newMessage.sender?.pharmacy_id ||
        newMessage.from_pharmacy_id ||
        newMessage.sender_pharmacy_id ||
        newMessage.pharmacy_id;

      // Extract recipient's pharmacy ID from any possible attribute
      const recipientPharmacyId =
        newMessage.to_pharmacy_id ||
        newMessage.recipient_pharmacy_id ||
        newMessage.receiver_pharmacy_id;

      // Filter: only keep messages belonging to the current conversation
      const isFromCurrentConversation =
        // 1. Match by sender's pharmacy ID (either belongs to the active chat party or the logged-in user)
        (senderPharmacyId?.toString() === currentPharmacyId?.toString() ||
         senderPharmacyId?.toString() === currentUser?.pharmacy_id?.toString()) ||
        // 2. Match by recipient's pharmacy ID (either belongs to the active chat party or the logged-in user)
        (recipientPharmacyId?.toString() === currentPharmacyId?.toString() ||
         recipientPharmacyId?.toString() === currentUser?.pharmacy_id?.toString()) ||
        // 3. Fallback match by pharmacist user ID (either sender is us or sender is the other party)
        (newMessage.sender?.id?.toString() === currentUser?.id?.toString() ||
         newMessage.sender?.id?.toString() === currentPharmacyId?.toString());

      if (!isFromCurrentConversation) {
        console.log("⏭️ Skipping message from other conversation");
        return;
      }

      setRealtimeMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) {
          console.log("⏭️ Skipping duplicate message:", newMessage.id);
          return prev;
        }
        return [...prev, newMessage];
      });
    };

    // Listen to multiple possible event naming formats for maximum reliability
    channel.listen(".message.sent", handleMessage);
    channel.listen("message.sent", handleMessage);
    channel.listen("MessageSent", handleMessage);
    channel.listen(".MessageSent", handleMessage);

    return () => {
      console.log("🔌 Leaving:", channelName);
      echo.leave(channelName);
      channelRef.current = null;
    };
  }, [token, user?.id, user?.pharmacy_id]);

  return { realtimeMessages };
};