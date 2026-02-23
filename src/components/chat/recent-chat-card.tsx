import { Pin, Users } from 'lucide-react'
import { Button } from '../ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';

const RecentChatCard = () => {
  return (
    <Button
      variant={"secondary"}
      className="h-fit py-3  hover:bg-bg! border border-transparent hover:border-primary! justify-between max-md:flex-col max-md:items-start"
    >
      <div className="flex items-center gap-2">
        <div className="size-10 bg-primary/30 text-primary rounded-full flex items-center justify-center">
          <Users className="size-5" />
        </div>
        <div className="text-start">
          <h2 className="text-lg font-semibold">Main Pharmacy Olaya</h2>
          <p className="text-sm text-muted-foreground">اي مستجدات</p>
        </div>
      </div>
      <div className="flex items-center gap-2 max-md:justify-between max-md:w-full">
        <p className="text-sm text-muted-foreground">Jan 26 3:58 PM</p>
        <HoverCard openDelay={50} closeDelay={50}>
          <HoverCardTrigger asChild>
            <Button variant={"ghost"}  className="hover:bg-background! text-muted-foreground hover:text-primary!">
              <Pin />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>Pin Conversation</HoverCardContent>
        </HoverCard>
      </div>
    </Button>
  );
}

export default RecentChatCard