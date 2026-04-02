"use client";

import { useEffect, useState } from "react";
import { Camera, Loader2, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getMessagesApi, sendMessageApi } from "@/api/chat";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";
import { initEcho } from "@/lib/echo-config";

export default function Chatbox({ pharmacyId }: { pharmacyId: string }) {
  const { clientToken, user } = useUserStore();

  const [input, setInput] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveMessages, setLiveMessages] = useState<unknown[]>([]);

  // 📥 أول تحميل للرسائل
  const { data } = useQuery({
    queryKey: ["messages", pharmacyId],
    queryFn: () => getMessagesApi(pharmacyId),
  });

  const messages = data?.data?.messages ?? [];

  // sync أول مرة
  useEffect(() => {
    console.log("hello from useEffect live");
    setLiveMessages(messages);
  }, [messages]);

  // 📡 Pusher realtime
  useEffect(() => {
    if (!clientToken) return;
    console.log("hello from useEffect");

    const echo = initEcho(clientToken);
    if (!echo) return;

    const channel = echo.private(`${pharmacyId}`);
    console.log(channel);

    channel.listen(".message.new", (data: unknown) => {
      console.log("🔥 New message:", data);

      setLiveMessages((prev) => {
        // منع التكرار لو optimistic message موجود
        const exists = prev.find(
          (m: any) => m?.id === (data as any)?.message?.id,
        );
        if (exists) return prev;

        return [...prev, (data as any)?.message];
      });
    });

    // 👇 كود الـ Test للـ Pusher Dashboard
    const testChannel = echo.channel("my-channel");
    testChannel.listen(".my-event", (data: unknown) => {
      console.log("✅ PUSHER TEST EVENT RECEIVED:", data);
      toast.success("Pusher Event Received Successfully!");
    });

    return () => {
      echo.leave(`${pharmacyId}`);
      echo.leave("my-channel");
    };
  }, [pharmacyId, clientToken]);

  // 📸 اختيار صورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImg(imageUrl);
  };

  // 📤 ارسال رسالة (Optimistic)
  const sendMessage = async () => {
    if (!input.trim() && !img) return;

    const tempMessage = {
      id: Date.now(),
      message: input,
      file_url: img,
      sender: user,
      created_at: new Date().toISOString(),
    };

    // ✅ يظهر فورًا
    setLiveMessages((prev) => [...prev, tempMessage]);

    const formData = new FormData();
    formData.append("message", input);
    formData.append("pharmacy_id", pharmacyId);

    setInput("");
    setImg(null);
    setLoading(true);

    const res = await sendMessageApi(formData);

    if (!res?.ok) {
      toast.error("failed to send message");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col    text-white rounded-xl overflow-hidden">
      {/* الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {liveMessages.map((msg) => (
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
                  : "bg-bg rounded-bl-none"
              }`}
            >
              {/* صورة */}
              {msg?.file_url && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Image
                      src={msg.file_url}
                      alt="msg"
                      width={100}
                      height={100}
                      className="w-80 rounded-lg mb-1 max-w-full"
                    />
                  </DialogTrigger>
                  <DialogContent>
                    <Image
                      src={msg.file_url}
                      alt="msg"
                      width={100}
                      height={100}
                      className="w-full h-full rounded-lg mb-1 max-w-full"
                    />
                  </DialogContent>
                </Dialog>
              )}

              {/* نص */}
              {msg?.message && <p className="text-sm">{msg.message}</p>}

              {/* وقت */}
              <span className="text-[10px] opacity-70 block mt-1">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {user?.role !== "super_admin" && (
        <>
          {/* preview للصورة */}
          {img && (
            <div className="px-4 pb-2">
              <Image
                src={img}
                alt="preview"
                width={100}
                height={100}
                className="w-24 rounded-lg"
              />
            </div>
          )}

          {/* input */}
          <div className="p-3 border-t border-white/10 flex items-center gap-2">
            {/* اختيار صورة */}
            <div>
              <Label htmlFor="camera" className="cursor-pointer">
                <Camera className="size-8 text-white/70 hover:text-white" />
              </Label>

              <Input
                id="camera"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* كتابة */}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border-none rounded-full px-4 py-2 text-sm 
              text-black dark:text-white 
              focus-visible:ring-primary 
              placeholder:text-black/70 dark:placeholder:text-white/70 min-h-14"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            {/* ارسال */}
            <Button
              disabled={loading}
              onClick={sendMessage}
              className="rounded-full size-12"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
