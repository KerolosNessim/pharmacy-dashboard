import { InboxAdminItem, InboxItem } from "@/types/chat";
import { Eye, Users } from "lucide-react";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import Link from "next/link";

const RecentAdminChatCard = ({
  item,
}: {
  item: InboxAdminItem;
}) => {
  return (
    <Link href={`/chat/${item?.conversation_id}`}>
    <Button
      variant={"secondary"}
      className="h-fit py-3 hover:bg-bg! border border-transparent hover:border-primary! justify-between max-md:flex-col max-md:items-start w-full cursor-pointer"
      asChild
    >
      <div role="button" tabIndex={0}>
        <div className="flex items-center gap-2">
          <div className="size-10 bg-primary/30 text-primary rounded-full flex items-center justify-center">
            <Users className="size-5" />
          </div>
          <div className="text-start">
            <h2 className="text-lg font-semibold">from: {item?.from_pharmacy_name}</h2>
            <p className="text-sm text-muted-foreground">
              to: {item?.to_pharmacy_name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 max-md:justify-between max-md:w-full">
          {/* <p className="text-sm text-muted-foreground">
            {item?.last_message_at
              ? new Date(item?.last_message_at).toLocaleDateString()
              : ""}
          </p> */}
          <HoverCard openDelay={50} closeDelay={50}>
            <HoverCardTrigger asChild>
              <Button
                variant={"ghost"}
                className="hover:bg-background! text-muted-foreground hover:text-primary!"
              >
                <Eye />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>View Conversation</HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </Button>
    </Link>
  );
};

export default RecentAdminChatCard;
