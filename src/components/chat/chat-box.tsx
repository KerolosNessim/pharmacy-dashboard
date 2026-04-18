/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Camera, Loader2, Send } from "lucide-react";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import Image from "next/image";
// import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
// import { useQuery } from "@tanstack/react-query";
// import { getMessagesApi, sendMessageApi } from "@/api/chat";
// import { toast } from "sonner";
// import { useUserStore } from "@/stores/user-store";
// import { initEcho } from "@/lib/echo-config";

// export default function Chatbox({ pharmacyId }: { pharmacyId: string }) {
//   const { clientToken, user } = useUserStore();

//   const [input, setInput] = useState("");
//   const [img, setImg] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [liveMessages, setLiveMessages] = useState<Record<string, any>[]>([]);
//   const initialized = useRef(false);

//   // 📥 أول تحميل للرسائل
//   const { data } = useQuery({
//     queryKey: ["messages", pharmacyId],
//     queryFn: () => getMessagesApi(pharmacyId),
//     staleTime: Infinity,      // ← منع React Query من إعادة الفيتش التلقائي
//     refetchOnWindowFocus: false, // ← منع refetch لما اليوزر يرجع للـ tab
//   });

//   const messages = data?.data?.messages ?? [];

//   // sync أول مرة فقط — لا نرجع نعمل reset تاني
//   useEffect(() => {
//     if (initialized.current) return; // ← لو اتحمل قبل كده، سيب
//     if (messages.length === 0) return; // ← مستنيين الداتا تيجي
//     initialized.current = true;
//     setLiveMessages(messages);
//   }, [messages]);

//   // 📡 Pusher realtime
//   useEffect(() => {
//     if (!clientToken) return;
//     console.log("hello from useEffect");

//     const echo = initEcho(clientToken);
//     if (!echo) return;

//     const isSuperAdmin = user?.role === "super_admin";
//     const myChannelName = isSuperAdmin
//       ? "chat.management"
//       : `chat.${user?.pharmacy_id}`;

//     console.log("📡 Subscribing to channel:", myChannelName);

//     const channel = echo.private(myChannelName);

//     channel.on("pusher:subscription_succeeded", () => {
//       console.log("✅ Subscription succeeded to:", myChannelName);
//     });

//     channel.on("pusher:subscription_error", (status: any) => {
//       console.error("❌ Subscription error for:", myChannelName, status);
//       toast.error("Real-time connection failed (Auth error)");
//     });

//     channel.listen(".message.sent", (data: any) => {
//       console.log("🔥 New message received:", data);
//       const newMessage = data?.message || data;

//       // Only add to list if it's from the person I'm currently chatting with
//       // OR if I sent it myself from another device (sender.id === user.id)
//       const isFromCurrentChat = newMessage?.sender?.id?.toString() === pharmacyId.toString();
//       const isFromMe = newMessage?.sender?.id === user?.id;

//       if (!isFromCurrentChat && !isFromMe) {
//           // If we are admin, we might want to see everything, but this component is per-id
//           if (!isSuperAdmin) {
//              console.log("⏭️ Message filtered out (belongs to another chat)");
//              return;
//           }
//       }

//       setLiveMessages((prev) => {
//         const exists = prev.find(
//           (m: any) =>
//             m?.id === newMessage?.id ||
//             (m?.message === newMessage?.message &&
//               m?.sender?.id === newMessage?.sender?.id &&
//               Math.abs(
//                 new Date(m.created_at).getTime() -
//                   new Date(newMessage.created_at).getTime(),
//               ) < 5000),
//         );
//         if (exists) return prev;

//         return [...prev, newMessage];
//       });
//     });

//     // 👇 كود الـ Test للـ Pusher Dashboard
//     const testChannel = echo.channel("my-channel");
//     testChannel.listen(".my-event", (data: unknown) => {
//       console.log("✅ PUSHER TEST EVENT RECEIVED:", data);
//       toast.success("Pusher Event Received Successfully!");
//     });

//     return () => {
//       console.log("🔌 Leaving channel:", myChannelName);
//       echo.leave(myChannelName);
//       echo.leave("my-channel");
//     };
//   }, [pharmacyId, clientToken]);

//   // 📸 اختيار صورة
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const imageUrl = URL.createObjectURL(file);
//     setImg(imageUrl);
//   };

//   // 📤 ارسال رسالة (Optimistic)
//   const sendMessage = async () => {
//     if (!input.trim() && !img) return;

//     const tempMessage = {
//       id: Date.now(),
//       message: input,
//       file_url: img,
//       sender: user,
//       created_at: new Date().toISOString(),
//     };

//     // ✅ يظهر فورًا
//     setLiveMessages((prev) => [...prev, tempMessage]);

//     const formData = new FormData();
//     formData.append("message", input);
//     formData.append("pharmacy_id", pharmacyId);

//     setInput("");
//     setImg(null);
//     setLoading(true);

//     const res = await sendMessageApi(formData);

//     if (res?.ok) {
//       // ✅ استبدال الرسالة المؤقتة بالرسالة الحقيقية من السيرفر
//       setLiveMessages((prev) =>
//         prev.map((m) =>
//           m.id === tempMessage.id ? (res.data as any).message : m,
//         ),
//       );
//     } else {
//       toast.error("failed to send message");
//       // ❌ حذف الرسالة المؤقتة لو فشل الارسال
//       setLiveMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col text-white overflow-hidden relative">
//       {/* الرسائل */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {liveMessages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`flex ${
//               msg?.sender?.id === user?.id ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-xs px-3 py-2 rounded-2xl ${
//                 msg?.sender?.id === user?.id
//                   ? "bg-green-700 rounded-br-none"
//                   : "dark:bg-bg bg-black rounded-bl-none"
//               }`}
//             >
//               {/* صورة */}
//               {msg?.file_url && (
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Image
//                       src={msg.file_url}
//                       alt="msg"
//                       width={100}
//                       height={100}
//                       className="w-80 rounded-lg mb-1 max-w-full"
//                     />
//                   </DialogTrigger>
//                   <DialogContent>
//                     <Image
//                       src={msg.file_url}
//                       alt="msg"
//                       width={100}
//                       height={100}
//                       className="w-full h-full rounded-lg mb-1 max-w-full"
//                     />
//                   </DialogContent>
//                 </Dialog>
//               )}

//               {/* نص */}
//               {msg?.message && <p className="text-sm">{msg.message}</p>}

//               {/* وقت */}
//               <span className="text-[10px] opacity-70 block mt-1">
//                 {new Date(msg.created_at).toLocaleTimeString()}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {user?.role !== "super_admin" && (
//         <>
//           {/* preview للصورة */}
//           {img && (
//             <div className="px-4 pb-2">
//               <Image
//                 src={img}
//                 alt="preview"
//                 width={100}
//                 height={100}
//                 className="w-24 rounded-lg"
//               />
//             </div>
//           )}

//           {/* input */}
//           <div className=" p-3 border-t border  bg-bg flex items-center gap-2   w-full ">
//             {/* اختيار صورة */}
//             <div>
//               <Label htmlFor="camera" className="cursor-pointer">
//                 <Camera className="size-8 text-primary" />
//               </Label>

//               <Input
//                 id="camera"
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageChange}
//               />
//             </div>

//             {/* كتابة */}
//             <Input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type a message..."
//               className="flex-1 bg-background rounded-full px-4 py-2 text-sm
//               text-black dark:text-white
//               focus-visible:ring-primary
//               placeholder:text-black/70 dark:placeholder:text-white/70 min-h-14"
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />

//             {/* ارسال */}
//             <Button
//               disabled={loading}
//               onClick={sendMessage}
//               className="rounded-full size-12"
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 <Send size={18} />
//               )}
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import { useMemo, useRef, useState, useEffect } from "react";
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
import { useChatRealtime } from "@/hooks/use-chat-realtime";

export default function Chatbox({ pharmacyId }: { pharmacyId: string }) {
  const { clientToken, user } = useUserStore();

  const [input, setInput] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Optimistic messages (temp + confirmed from server)
  const [optimisticMessages, setOptimisticMessages] = useState<any[]>([]);

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
    const merged = [...baseMessages, ...realtimeMessages, ...optimisticMessages];
    return merged.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
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
    setImg(URL.createObjectURL(file));
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

    setInput("");
    setImg(null);
    setLoading(true);

    const res = await sendMessageApi(formData);

    if (res?.ok) {
      // Replace temp with confirmed message
      setOptimisticMessages((prev) =>
        prev.map((m) => (m.id === tempId ? res.data.message : m))
      );
    } else {
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
              {msg?.file_url && (
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
                    <Image src={msg.file_url} alt="" width={400} height={400} />
                  </DialogContent>
                </Dialog>
              )}

              {msg?.message && <p className="text-sm">{msg.message}</p>}

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
          <Camera className="size-8 text-primary"/>
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

        <Button className="rounded-full size-12" onClick={sendMessage} disabled={loading}>
             <Send />
        </Button>
      </div>
    </div>
  );
}