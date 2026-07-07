/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { initEcho } from "@/lib/echo-config";
import { getOwnChatChannelName } from "@/lib/chat-channels";
import type Echo from "laravel-echo";
import { useCallback, useEffect, useRef, useState } from "react";

type PrivateChannelLike = {
  subscribed: (callback: () => void) => PrivateChannelLike;
  error: (callback: (error: unknown) => void) => PrivateChannelLike;
  listen: (event: string, callback: (data: any) => void) => PrivateChannelLike;
};

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
  const echoRef = useRef<Echo<"pusher"> | null>(null);

  const pharmacyIdRef = useRef(pharmacyId);
  const userRef = useRef(user);
  pharmacyIdRef.current = pharmacyId;
  userRef.current = user;

  const addMessage = useCallback((newMessage: any) => {
    if (!newMessage?.id) return;
    setRealtimeMessages((prev) => {
      if (prev.some((m) => m.id === newMessage.id)) return prev;
      return [...prev, newMessage];
    });
  }, []);

  const shouldAcceptMessage = useCallback((newMessage: any) => {
    const currentPharmacyId = pharmacyIdRef.current;
    const currentUser = userRef.current;
    if (!newMessage) return false;

    const senderPharmacyId =
      newMessage.sender?.pharmacy_id ||
      newMessage.from_pharmacy_id ||
      newMessage.sender_pharmacy_id ||
      newMessage.pharmacy_id;

    const recipientPharmacyId =
      newMessage.to_pharmacy_id ||
      newMessage.recipient_pharmacy_id ||
      newMessage.receiver_pharmacy_id;

    return (
      senderPharmacyId?.toString() === currentPharmacyId?.toString() ||
      senderPharmacyId?.toString() === currentUser?.pharmacy_id?.toString() ||
      recipientPharmacyId?.toString() === currentPharmacyId?.toString() ||
      recipientPharmacyId?.toString() ===
        currentUser?.pharmacy_id?.toString() ||
      newMessage.sender?.id?.toString() === currentUser?.id?.toString() ||
      newMessage.sender?.id?.toString() === currentPharmacyId?.toString()
    );
  }, []);

  const handleServerMessage = useCallback(
    (data: any) => {
      const newMessage = data?.message || data;
      if (!shouldAcceptMessage(newMessage)) return;
      addMessage(newMessage);
    },
    [addMessage, shouldAcceptMessage],
  );

  useEffect(() => {
    setRealtimeMessages([]);
  }, [pharmacyId]);

  useEffect(() => {
    if (!token || !user?.id) return;

    const echo = initEcho(token, user.role);
    if (!echo) return;
    echoRef.current = echo;

    const ownChannel = getOwnChatChannelName(user);
    if (!ownChannel) return;

    const channel = echo.private(ownChannel) as unknown as PrivateChannelLike;

    channel.subscribed(() => {
      console.log("✅ Subscribed:", ownChannel);
    });
    channel.error((err) => {
      console.error("❌ Pusher subscription error:", ownChannel, err);
    });

    channel.listen(".message.sent", handleServerMessage);
    channel.listen("message.sent", handleServerMessage);
    channel.listen("MessageSent", handleServerMessage);
    channel.listen(".MessageSent", handleServerMessage);

    return () => {
      echo.leave(ownChannel);
    };
  }, [
    token,
    user?.id,
    user?.pharmacy_id,
    user?.role,
    handleServerMessage,
  ]);

  return { realtimeMessages };
};
