import { Eye, Pin, Users } from 'lucide-react'
import { Button } from '../ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { InboxItem } from '@/types/chat';

const RecentChatCard = ({ item, setSelectedPharmacy }: { item: InboxItem, setSelectedPharmacy: (id: string) => void }) => {
  return (
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
            <h2 className="text-lg font-semibold">{item?.other_party_name}</h2>
            <p className="text-sm text-muted-foreground">{item?.last_message}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 max-md:justify-between max-md:w-full">
          <p className="text-sm text-muted-foreground">{item?.last_message_at ? new Date(item?.last_message_at).toLocaleDateString() : ""}</p>
          <HoverCard openDelay={50} closeDelay={50}>
            <HoverCardTrigger asChild>
              <Button onClick={() => setSelectedPharmacy(item?.other_party_id.toString())} variant={"ghost"} className="hover:bg-background! text-muted-foreground hover:text-primary!">
                <Eye />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>View Conversation</HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </Button>
  );
}

export default RecentChatCard