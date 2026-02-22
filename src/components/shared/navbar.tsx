import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Bell, Megaphone } from "lucide-react";
import { Button } from "../ui/button";
import UserAvatar from "./user-avatar";
import NavbarSheet from "./navbar-sheet";
const Navbar = () => {
  return (
    <div className="p-2 lg:pe-6 border-b flex items-center justify-between sticky top-0 z-50 bg-background">
      <Link href="/">
        <h1 className="text-lg font-medium">
          <span className="text-primary font-bold">ME</span> Pharmacies
        </h1>
      </Link>

      {/* links */}
      <div className="flex items-center gap-4">
        {/* mode toggle */}
        <ModeToggle variant="ghost" />
        {/* updates */}
        <HoverCard openDelay={50} closeDelay={50}>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="icon">
              <Link href="/updates">
                <Megaphone className="h-4 w-4" />
                <span className="sr-only"></span>
              </Link>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>Updates</HoverCardContent>
        </HoverCard>
        {/* notifications */}
        <HoverCard openDelay={50} closeDelay={50}>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="icon">
              <Link href="/notifications">
                <Bell className="h-4 w-4" />
                <span className="sr-only"></span>
              </Link>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>Notifications</HoverCardContent>
        </HoverCard>
        {/* user Avatar */}
        <UserAvatar withName={false} size="sm" />
        {/* navbar sheet */}
        <NavbarSheet />
      </div>
    </div>
  );
};

export default Navbar;
