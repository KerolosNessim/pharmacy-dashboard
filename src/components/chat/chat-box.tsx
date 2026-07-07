"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState, useEffect } from "react";
import {
  Camera,
  Loader2,
  Mic,
  Paperclip,
  Send,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessagesApi, sendMessageApi } from "@/api/chat";
import { parseChatSendResponse } from "@/lib/chat-message";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";
import { useChatRealtime } from "@/hooks/use-chat-realtime";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { VoicePlayer } from "./voice-player";
import { ChatMediaImage } from "./chat-media-image";
import { isImageMedia, isVoiceMediaUrl } from "@/lib/media-url";

export default function Chatbox({ pharmacyId }: { pharmacyId: string }) {
  const { clientToken, user } = useUserStore();
  const queryClient = useQueryClient();

  const [input, setInput] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);

  const {
    isRecording,
    isRequestingMic,
    audioBlob,
    recordingTime,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const bottomRef = useRef<HTMLDivElement>(null);

  const { realtimeMessages } = useChatRealtime({
    pharmacyId,
    user,
    token: clientToken,
  });

  const { data } = useQuery({
    queryKey: ["messages", pharmacyId],
    queryFn: () => getMessagesApi(pharmacyId),
  });

  const baseMessages: any[] = data?.data?.messages ?? [];

  const messages = useMemo(() => {
    const seen = new Set<any>();
    const merged = [
      ...baseMessages,
      ...realtimeMessages,
      ...optimisticMessages,
    ];
    return merged
      .filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      })
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
  }, [baseMessages, realtimeMessages, optimisticMessages]);

  useEffect(() => {
    setOptimisticMessages([]);
  }, [pharmacyId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearImagePreview = () => {
    if (img) URL.revokeObjectURL(img);
    setImg(null);
    setSelectedFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("The file is too large. The maximum size is 50 megabytes.");
      return;
    }

    if (img) URL.revokeObjectURL(img);
    setSelectedFile(file);
    setImg(URL.createObjectURL(file));
  };

  const openVoiceFilePicker = () => {
    voiceInputRef.current?.click();
  };

  const handleVoiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/") && !/\.(webm|mp3|m4a|wav|ogg)$/i.test(file.name)) {
      toast.error("Please choose an audio file.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Audio file is too large. Maximum size is 50 MB.");
      return;
    }

    void sendVoiceMessage(file);
    if (voiceInputRef.current) voiceInputRef.current.value = "";
  };

  const handleSendSuccess = (tempId: string, serverMessage?: any) => {
    if (serverMessage) {
      setOptimisticMessages((prev) =>
        prev.map((m) => (m.id === tempId ? serverMessage : m)),
      );
    }
    queryClient.invalidateQueries({ queryKey: ["messages", pharmacyId] });
    queryClient.invalidateQueries({ queryKey: ["inbox"] });
  };

  const handleSendFailure = (tempId: string, error?: string) => {
    toast.error(error || "Failed to send message");
    setOptimisticMessages((prev) => prev.filter((m) => m.id !== tempId));
  };

  useEffect(() => {
    if (!audioBlob || audioBlob.size === 0) return;
    void sendVoiceMessage(audioBlob);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);

  const sendVoiceMessage = async (source: Blob | File) => {
    const tempId = `temp-${Date.now()}`;
    const previewUrl = URL.createObjectURL(source);
    const tempMessage = {
      id: tempId,
      message: null,
      file_url: previewUrl,
      file_type: "voice",
      sender: user,
      created_at: new Date().toISOString(),
    };

    setOptimisticMessages((prev) => [...prev, tempMessage]);

    const voiceType = source.type || "audio/webm";
    const voiceExt = voiceType.includes("webm")
      ? "webm"
      : voiceType.includes("mp4") || voiceType.includes("m4a")
        ? "m4a"
        : voiceType.includes("mpeg") || voiceType.includes("mp3")
          ? "mp3"
          : "webm";

    const formData = new FormData();
    formData.append("pharmacy_id", pharmacyId);
    formData.append("message", "voice-note");
    formData.append("file_type", "voice");
    formData.append(
      "voice",
      source instanceof File
        ? source
        : new File([source], `voice-note.${voiceExt}`, { type: voiceType }),
    );

    setLoading(true);
    try {
      const res = await sendMessageApi(formData);
      const serverMessage = res?.ok
        ? parseChatSendResponse(res.data)
        : null;

      if (res?.ok && serverMessage) {
        handleSendSuccess(tempId, serverMessage);
        resetRecording();
      } else if (res?.ok) {
        handleSendSuccess(tempId);
        resetRecording();
      } else {
        handleSendFailure(
          tempId,
          res?.error || "Failed to send voice note",
        );
      }
    } catch (error) {
      console.error("Voice send error:", error);
      handleSendFailure(tempId, "Failed to send voice note");
    } finally {
      setLoading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedFile) return;

    const tempId = `temp-${Date.now()}`;
    const caption = input.trim();
    const previewUrl = selectedFile ? img : null;

    const tempMessage = {
      id: tempId,
      message: caption || null,
      file_url: previewUrl,
      file_type: selectedFile ? "image" : "text",
      sender: user,
      created_at: new Date().toISOString(),
    };

    setOptimisticMessages((prev) => [...prev, tempMessage]);

    const formData = new FormData();
    formData.append("pharmacy_id", pharmacyId);
    formData.append("message", caption);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    setInput("");
    clearImagePreview();
    setLoading(true);

    try {
      const res = await sendMessageApi(formData);
      const serverMessage = res?.ok
        ? parseChatSendResponse(res.data)
        : null;

      if (res?.ok && serverMessage) {
        handleSendSuccess(tempId, serverMessage);
      } else if (res?.ok) {
        handleSendSuccess(tempId);
      } else {
        handleSendFailure(tempId, res?.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Chat send error:", error);
      handleSendFailure(tempId, "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = async () => {
    const error = await startRecording();
    if (error) {
      toast.error(`${error} Use upload voice instead.`, { duration: 4000 });
      openVoiceFilePicker();
    }
  };

  const handleStopRecording = () => {
    if (recordingTime < 1) {
      toast.error("Record at least 1 second.");
      stopRecording(false);
      resetRecording();
      return;
    }
    stopRecording(true);
  };

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex ${
              msg?.sender?.id === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-2xl ${
                msg?.sender?.id === user?.id
                  ? "bg-green-700 rounded-br-none"
                  : "bg-black rounded-bl-none"
              }`}
            >
              <p className="text-[10px] font-bold opacity-80 mb-1">
                {msg?.sender?.name}
              </p>

              {isImageMedia(msg?.file_type, msg?.file_url) && msg?.file_url && (
                <ChatMediaImage url={msg.file_url} />
              )}

              {(msg?.file_type === "voice" || isVoiceMediaUrl(msg?.file_url)) &&
                msg?.file_url && (
                  <div className="min-w-[220px] mt-2">
                    <VoicePlayer
                      url={msg.file_url}
                      isMe={msg?.sender?.id === user?.id}
                    />
                  </div>
                )}

              {msg?.message &&
                msg?.file_type !== "voice" &&
                msg?.message !== "voice-note" &&
                msg?.message.trim() !== "" && (
                  <p className="text-sm">{msg.message}</p>
                )}

              <span className="text-[10px] opacity-70">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {img && (
        <div className="relative px-4 pb-2">
          <Image src={img} alt="" width={100} height={100} unoptimized />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-4 top-0 size-7 rounded-full bg-black/60 text-white hover:bg-black/80"
            onClick={clearImagePreview}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      <div className="p-3 border-t flex gap-2">
        <Label htmlFor="chat-image-input" className="cursor-pointer">
          <Camera className="size-8 text-primary" />
        </Label>

        <Input
          ref={imageInputRef}
          id="chat-image-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        <Input
          ref={voiceInputRef}
          type="file"
          accept="audio/*,.webm,.mp3,.m4a,.wav,.ogg"
          capture
          className="hidden"
          onChange={handleVoiceFileChange}
        />

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          placeholder="Type..."
          className="flex-1 bg-background rounded-full px-4 py-2 text-sm
              text-black dark:text-white
              focus-visible:ring-primary
              placeholder:text-black/70 dark:placeholder:text-white/70 h-12"
        />

        <Button
          className="rounded-full size-12"
          onClick={sendMessage}
          disabled={loading || isRecording || (!input.trim() && !selectedFile)}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>

        <div className="flex items-center gap-2">
          {isRecording ? (
            <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/50 animate-pulse">
              <span className="text-red-500 text-xs font-mono">
                {Math.floor(recordingTime / 60)}:
                {String(recordingTime % 60).padStart(2, "0")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={() => {
                  stopRecording(false);
                  resetRecording();
                }}
              >
                <Trash2 className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={handleStopRecording}
              >
                <Square className="size-4 fill-current" />
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                title="Record voice note"
                className="rounded-full size-12 text-primary hover:bg-primary/10"
                onClick={handleMicClick}
                disabled={loading || isRequestingMic}
              >
                {isRequestingMic ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  <Mic className="size-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Upload voice note"
                className="rounded-full size-12 text-primary hover:bg-primary/10"
                onClick={openVoiceFilePicker}
                disabled={loading || isRequestingMic}
              >
                <Paperclip className="size-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
