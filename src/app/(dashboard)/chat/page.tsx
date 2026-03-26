"use client";
import { getInboxApi } from "@/api/chat";
import { getPharmaciesApi } from "@/api/pharmacies";
import Chatbox from "@/components/chat/chat-box";
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
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, MessageSquare, RefreshCcw, Users } from "lucide-react";
import { useState } from "react";

const ChatPage = () => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<string >("");
  const { data } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: getPharmaciesApi,
  });
  const { data: inboxData } = useQuery({
    queryKey: ["inbox"],
    queryFn: getInboxApi,
  });
  const pharmacies = data?.data?.data?.data ?? [];
  const inbox = inboxData?.data?.inbox ?? [];
  return (
    <section className="flex flex-col ">
      {/* selector */}
      <div className="bg-bg p-4 flex items-center gap-2 ">
        {selectedPharmacy &&
        <Button
        onClick={() => setSelectedPharmacy("")}
        variant={"ghost"}
        className="hover:bg-background! h-12!"
        >
          <ChevronLeft/>
        </Button>
        }
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
      <>
        {selectedPharmacy ? (
          <Chatbox pharmacyId={selectedPharmacy}/>
        ) : (
          <>
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
              {
                inbox.length > 0 ? (
                  <div className="flex flex-col gap-2 p-4 ">
                    <h2 className="text-muted-foreground font-semibold">Recent Conversations</h2>
                  {inbox.map((item) => (
                    <RecentChatCard key={item.conversation_id} item={item} setSelectedPharmacy={setSelectedPharmacy} />
                  ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No recent chats</p>
                )
              }

          </>
        )}
      </>
    </section>
  );
};

export default ChatPage;
