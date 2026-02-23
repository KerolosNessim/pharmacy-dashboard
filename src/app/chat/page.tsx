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
import { MessageSquare, RefreshCcw, Users } from "lucide-react";
const ChatPage = () => {
  return (
    <section className="flex flex-col gap-8">
      {/* selector */}
      <div className="bg-bg p-4 flex items-center gap-2">
        <Select>
          <SelectTrigger className="w-full h-12! bg-background!">
            <SelectValue
              className="text-sm!"
              placeholder="select branch to chat"
            />
          </SelectTrigger>
          <SelectContent position="popper" className="bg-bg">
            <SelectGroup>
              {Array.from({ length: 10 }).map((_, index) => (
                <SelectItem
                  className="group text-base! hover:bg-primary!"
                  key={index}
                  value={index.toString()}
                >
                  <Users className="text-primary group-hover:text-white " />
                  Branch {index + 1}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant={"ghost"} className="hover:bg-background! h-12!">
          <RefreshCcw />
        </Button>
      </div>
      {/* content */}
      <div className=" flex flex-col  items-center gap-2">
        <div className="size-16 bg-primary/30 text-primary rounded-full flex items-center justify-center">
          <MessageSquare />
        </div>
        <h2 className="text-xl font-semibold">Branch Chat</h2>
        <p className="text-sm text-muted-foreground">
          Select a branch above to start chatting
        </p>
      </div>
      {/* recent chats */}
      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-muted-foreground font-semibold">Recent Conversations</h2>
        <RecentChatCard />
      </div>
    </section>
  );
};

export default ChatPage;
