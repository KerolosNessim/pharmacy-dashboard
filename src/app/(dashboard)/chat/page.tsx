"use client";
import { getAdminInboxApi, getInboxApi } from "@/api/chat";
import { getPharmaciesApi } from "@/api/pharmacies";
import Chatbox from "@/components/chat/chat-box";
import RecentAdminChatCard from "@/components/chat/recent-card-admin";
import RecentChatCard from "@/components/chat/recent-chat-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/stores/user-store";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, MessageSquare, RefreshCcw, Users } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const ChatPage = () => {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id");
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>(conversationId??"");
  const { user } = useUserStore();
  const { data } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: () => getPharmaciesApi(),
  });
  const { data: inboxData } = useQuery({
    queryKey: ["inbox"],
    queryFn: getInboxApi,
  });
  const { data: adminInboxData } = useQuery({
    queryKey: ["admin-inbox"],
    queryFn: getAdminInboxApi,
  });

  const pharmacies = data?.data?.data?.data ?? [];
  const inbox = inboxData?.data?.inbox ?? [];
  const adminInbox = adminInboxData?.data?.data ?? [];

  return (
    <section className="flex flex-col h-[calc(100vh-70px)]">
      {/* selector */}
      <div className="bg-bg p-4 flex items-center gap-2 shrink-0">
        {selectedPharmacy && (
          <Button
            onClick={() => setSelectedPharmacy("")}
            variant={"ghost"}
            className="hover:bg-background! h-12!"
          >
            <ChevronLeft />
          </Button>
        )}
        <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
          <SelectTrigger className="w-full h-12! bg-background!">
            <SelectValue
              className="text-sm!"
              placeholder="select branch to chat"
            />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              {pharmacies.map((pharmacy) => (
                <SelectItem
                  className="group text-base!"
                  key={pharmacy?.id}
                  value={pharmacy?.id.toString()}
                >
                  <Users className="text-primary group-hover:text-white " />
                  {pharmacy?.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setSelectedPharmacy("")}
          variant={"ghost"}
          className="hover:bg-background! h-12!"
        >
          <RefreshCcw />
        </Button>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedPharmacy ? (
          <Chatbox pharmacyId={selectedPharmacy} />
        ) : (
          <div className="overflow-y-auto">
            {/* content */}
            <div className=" flex flex-col  items-center gap-2 mt-4">
              <div className="size-16 bg-primary/30 text-primary rounded-full flex items-center justify-center">
                <MessageSquare />
              </div>
              <h2 className="text-xl font-semibold">Branch Chat</h2>
              <p className="text-sm text-muted-foreground">
                Select a branch above to start chatting
              </p>
            </div>
            {/* recent chats */}

            {inbox.length > 0 && user?.role !== "super_admin" ? (
              <div className="flex flex-col gap-2 p-4 ">
                <h2 className="text-muted-foreground font-semibold">
                  Recent Conversations
                </h2>

                <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                  {inbox.map((item) => (
                    <RecentChatCard
                      key={item.conversation_id}
                      item={item}
                      setSelectedPharmacy={setSelectedPharmacy}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-4 ">
                <h2 className="text-muted-foreground font-semibold">
                  Recent Conversations
                </h2>

                <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                  {adminInbox?.map((item) => (
                    <RecentAdminChatCard
                      key={item.conversation_id}
                      item={item}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatPage;
