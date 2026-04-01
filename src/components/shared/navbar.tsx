"use client"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useFirebaseNotifications } from "@/providers/firebase-provider";
import { Bell, Megaphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logoImg from "../../assets/logo.png";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import NavbarSheet from "./navbar-sheet";
import UserAvatar from "./user-avatar";
const Navbar = () => {


    const { unreadCount } = useFirebaseNotifications();

  return (
    <div className="p-2 lg:pe-6 border-b  flex items-center justify-between sticky top-0 z-50 bg-bg">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image src={logoImg} alt="logo" width={25} height={25} />
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
            <Button variant="ghost" size="icon" className="relative">
              <Link href="/alerts">
                <Megaphone className="h-4 w-4" />
                <span className="sr-only"></span>
              </Link>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>Alerts</HoverCardContent>
        </HoverCard>
        {/* notifications */}
        <HoverCard openDelay={50} closeDelay={50}>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Link href="/notification">
                <Bell className="h-4 w-4" />
                <span className="sr-only"></span>
              </Link>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 size-4 flex items-center justify-center bg-red-500 rounded-full text-white text-xs">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
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
