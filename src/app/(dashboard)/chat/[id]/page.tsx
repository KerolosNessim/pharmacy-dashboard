"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAdminSingleInboxApi } from "@/api/chat";
import { VoicePlayer } from "@/components/chat/voice-player";


export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;

  const { data } = useQuery({
    queryKey: ["admin-single-inbox", chatId],
    queryFn: () => getAdminSingleInboxApi(chatId),
  });



  const messages = (data?.data?.messages ?? []).sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

const firstSenderId = messages[0]?.sender?.id;





  return (
    <div className=" flex flex-col">
      {/* Header */}
      <div className="p-4 border-b  dark:bg-zinc-bg flex items-center justify-between">
        <h2 className="font-semibold text-lg">{data?.data?.pharmacy_name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isRight = msg.sender.id === firstSenderId;

          return (
            <div
              key={msg.id}
              className={`flex ${isRight ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[75%] flex flex-col gap-1">
                {/* اسم المرسل */}
                <span
                  className={`text-xs px-2 ${
                    isRight
                      ? "text-right text-gray-400"
                      : "text-left text-gray-500"
                  }`}
                >
                  {msg.sender.name} • {msg.sender.pharmacy_name}
                </span>

                {/* bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    isRight
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white dark:bg-zinc-800 text-black dark:text-white rounded-bl-none"
                  }`}
                >
                  {/* صورة */}
                  {msg.file_url &&
                    !msg.file_url.toLowerCase().includes(".webm") &&
                    !msg.file_url.toLowerCase().includes(".mp3") &&
                    !msg.file_url.toLowerCase().includes(".wav") && (
                      <Image
                        src={msg.file_url}
                        alt="msg"
                        width={200}
                        height={200}
                        className="rounded-lg mb-2 max-w-full"
                        unoptimized
                      />
                    )}

                  {(msg?.file_type === "voice" ||
                    msg?.file_url?.toLowerCase().includes(".webm") ||
                    msg?.file_url?.toLowerCase().includes(".mp3") ||
                    msg?.file_url?.toLowerCase().includes(".wav")) && (
                    <div className="min-w-[220px] mt-2 mb-2">
                      <VoicePlayer url={msg.file_url} isMe={isRight} />
                    </div>
                  )}

                  {/* نص */}
                  {msg.message && <p>{msg.message}</p>}

                  {/* وقت */}
                  <span
                    className={`text-[10px] block mt-1 ${
                      isRight
                        ? "text-white/70 text-right"
                        : "text-gray-400 text-left"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
