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
import { SidebarTrigger } from "../ui/sidebar";
import Image from "next/image";
const Navbar = () => {
  return (
    <div className="p-2 lg:pe-6 border-b flex items-center justify-between sticky top-0 z-50 bg-background">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={25} height={25} />
          <p className="font-bold max-md:hidden">Pharmacies </p>
        </div>
      </Link>

      {/* links */}
      <div className="flex items-center gap-4">
        {/* sidebar collapse */}
        <HoverCard openDelay={50} closeDelay={50}>
          <HoverCardTrigger asChild>
            <SidebarTrigger size={"icon"}  />
          </HoverCardTrigger>
          <HoverCardContent>Sidebar</HoverCardContent>
        </HoverCard>
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
          <HoverCardContent>Alerts</HoverCardContent>
        </HoverCard>
        {/* notifications */}
        {/* <HoverCard openDelay={50} closeDelay={50}>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="icon">
              <Link href="/notifications">
                <Bell className="h-4 w-4" />
                <span className="sr-only"></span>
              </Link>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>Notifications</HoverCardContent>
        </HoverCard> */}
        {/* user Avatar */}
        <UserAvatar withName={false} size="sm" />
        {/* navbar sheet */}
        <NavbarSheet />
      </div>
    </div>
  );
};

export default Navbar;
