"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState, useEffect } from "react";
import { Camera, Loader2, Mic, Send, Square, Trash2, Play, Pause } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getMessagesApi, sendMessageApi } from "@/api/chat";
import { apiRequest } from "@/lib/api-request";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";
import { useChatRealtime } from "@/hooks/use-chat-realtime";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";

function VoicePlayer({ url, isMe }: { url: string; isMe: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex items-center gap-2 p-2 rounded-2xl w-full ${isMe ? "bg-white/10" : "bg-primary/10"} backdrop-blur-sm border border-white/5`}>
      <Button
        size="icon"
        variant="ghost"
        className="size-10 rounded-full hover:bg-white/20 shrink-0"
        onClick={togglePlay}
      >
        {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-1" />}
      </Button>

      <div className="flex-1 flex flex-col gap-1 pr-2">
        <div className="relative w-full h-1.5 bg-black/20 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] opacity-70 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}

export default function Chatbox({ pharmacyId }: { pharmacyId: string }) {
  const { clientToken, user } = useUserStore();

  const [input, setInput] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Optimistic messages (temp + confirmed from server)
  const [optimisticMessages, setOptimisticMessages] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    isRecording,
    audioBlob,
    recordingTime,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const bottomRef = useRef<HTMLDivElement>(null);

  // 📥 React Query — fetches existing messages once
  const { data } = useQuery({
    queryKey: ["messages", pharmacyId],
    queryFn: () => getMessagesApi(pharmacyId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const baseMessages: any[] = data?.data?.messages ?? [];

  // 🔥 Realtime — local state updated by Pusher
  const { realtimeMessages } = useChatRealtime({
    pharmacyId,
    user,
    token: clientToken,
  });

  // Merge: base + realtime + optimistic (deduplicated)
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

  // Reset optimistic when conversation changes
  useEffect(() => {
    setOptimisticMessages([]);
  }, [pharmacyId]);

  // 🧠 Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📸 Image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImg(URL.createObjectURL(file));
  };

  // 🎤 Send Voice Note
  useEffect(() => {
    if (audioBlob) {
      sendVoiceMessage(audioBlob);
    }
  }, [audioBlob]);

  const sendVoiceMessage = async (blob: Blob) => {
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      message: null,
      file_url: URL.createObjectURL(blob),
      file_type: "voice",
      sender: user,
      created_at: new Date().toISOString(),
    };

    setOptimisticMessages((prev) => [...prev, tempMessage]);

    const formData = new FormData();
    formData.append("pharmacy_id", pharmacyId);
    formData.append("message", "voice-note"); // Non-empty to help trigger broadcast
    formData.append("file_type", "voice");
    const audioFile = new File([blob], "voice-note.wav", { type: "audio/wav" });
    formData.append("voice", audioFile);

    setLoading(true);
    // Use apiRequest directly to pass Accept header without modifying global config
    const res = await apiRequest("/chat/send", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });
    console.log("📩 Voice Send Response:", res);

    if (res?.ok && (res.data as any)?.message) {
      setOptimisticMessages((prev) =>
        prev.map((m) => (m.id === tempId ? (res.data as any).message : m)),
      );
      resetRecording();
    } else if (res?.ok) {
      // If ok but no message object returned, keep optimistic but reset recorder
      resetRecording();
    } else {
      toast.error("Failed to send voice note");
      setOptimisticMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
    setLoading(false);
  };

  // 📤 Send message with optimistic update
  const sendMessage = async () => {
    if (!input.trim() && !img) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      message: input,
      file_url: img,
      sender: user,
      created_at: new Date().toISOString(),
    };

    // Show immediately
    setOptimisticMessages((prev) => [...prev, tempMessage]);

    const formData = new FormData();
    formData.append("message", input);
    formData.append("pharmacy_id", pharmacyId);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    setInput("");
    setImg(null);
    setSelectedFile(null);
    setLoading(true);

    const res = await sendMessageApi(formData);

    if (res?.ok && (res.data as any)?.message) {
      // Replace temp with confirmed message
      setOptimisticMessages((prev) =>
        prev.map((m) => (m.id === tempId ? (res.data as any).message : m)),
      );
    } else if (!res?.ok) {
      toast.error("Failed to send message");
      setOptimisticMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full text-white">
      {/* messages */}
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
              {msg?.file_url &&
                msg?.file_type !== "voice" &&
                !msg?.file_url?.includes(".webm") &&
                !msg?.file_url?.includes(".mp3") &&
                !msg?.file_url?.includes(".wav") && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Image
                        src={msg.file_url}
                        alt=""
                        width={200}
                        height={200}
                        className="rounded mb-1"
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <Image
                        src={msg.file_url}
                        alt=""
                        width={400}
                        height={400}
                      />
                    </DialogContent>
                  </Dialog>
                )}

              {(msg?.file_type === "voice" ||
                msg?.file_url?.includes(".webm") ||
                msg?.file_url?.includes(".mp3") ||
                msg?.file_url?.includes(".wav")) && (
                <div className="min-w-[220px] mt-2">
                   <VoicePlayer url={msg.file_url} isMe={msg?.sender?.id === user?.id} />
                </div>
              )}

              {msg?.message && msg?.file_type !== "voice" && (
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

      {/* preview */}
      {img && (
        <div className="px-4 pb-2">
          <Image src={img} alt="" width={100} height={100} />
        </div>
      )}

      {/* input */}
      <div className="p-3 border-t flex gap-2">
        <Label htmlFor="file">
          <Camera className="size-8 text-primary" />
        </Label>

        <Input
          id="file"
          type="file"
          className="hidden"
          onChange={handleImageChange}
        />

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type..."
          className="flex-1 bg-background rounded-full px-4 py-2 text-sm
              text-black dark:text-white
              focus-visible:ring-primary
              placeholder:text-black/70 dark:placeholder:text-white/70 h-12"
        />

        <Button
          className="rounded-full size-12"
          onClick={sendMessage}
          disabled={loading || isRecording}
        >
          <Send />
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
                onClick={stopRecording}
              >
                <Square className="size-4 fill-current" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-12 text-primary hover:bg-primary/10"
              onClick={startRecording}
              disabled={loading}
            >
              <Mic className="size-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
