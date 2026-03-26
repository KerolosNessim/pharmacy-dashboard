"use client";

import { useState } from "react";
import { Camera, Loader2, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessagesApi, sendMessageApi } from "@/api/chat";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";

export default function Chatbox({ pharmacyId }: { pharmacyId: string }) {
  const { user } = useUserStore();
  const [input, setInput] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["messages", pharmacyId],
    queryFn: () => getMessagesApi(pharmacyId),
    refetchInterval: 1000,
  });

  const messages = data?.data?.messages ?? [];
  // 📸 اختيار صورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImg(imageUrl);
  };

  // 📤 ارسال رسالة
  const sendMessage = async () => {
    if (!input.trim() && !img) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("message", input);
    formData.append("pharmacy_id", pharmacyId);
    if (img) {
      formData.append("image", img);
    }

    const res = await sendMessageApi(formData);
    if (res?.ok) {
      toast.success("message sent successfully");
      setInput("");
      setImg(null);
      queryClient.invalidateQueries({ queryKey: ["messages", pharmacyId] });
    } else {
      toast.error("failed to send message");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[81vh] text-white  rounded-xl overflow-hidden">
      {/* الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
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
                      src={msg?.file_url}
                      alt="msg"
                      width={100}
                      height={100}
                      className="w-80 rounded-lg mb-1 max-w-full"
                    />
                  </DialogTrigger>
                  <DialogContent>
                    <Image
                      src={msg?.file_url}
                      alt="msg"
                      width={100}
                      height={100}
                      className="w-full h-full o rounded-lg mb-1 max-w-full"
                    />
                  </DialogContent>
                </Dialog>
              )}

              {/* نص */}
              {msg?.message && <p className="text-sm">{msg?.message}</p>}

              {/* وقت */}
              <span className="text-[10px] opacity-70 block mt-1">
                {new Date(msg?.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

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
      <div className="p-3 border-t border-white/10 flex items-center gap-2 ">
        {/* زر اختيار صورة */}
        <div>
          <Label htmlFor="camera" className="cursor-pointer">
            <Camera className="size-5 text-white/70 hover:text-white" />
          </Label>

          <Input
            id="camera"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* كتابة رسالة */}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1  border-none rounded-full px-4 py-2 text-sm focus-visible:ring-primary"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        {/* ارسال */}
        <Button
          disabled={loading}
          onClick={sendMessage}
          className="rounded-full"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
        </Button>
      </div>
    </div>
  );
}
