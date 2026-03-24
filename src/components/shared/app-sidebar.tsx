"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ILink } from "@/types/constant";
import {
  ArrowUpDown,
  Building2,
  ClipboardList,
  Home,
  LibraryBig,
  MessagesSquare,
  Motorbike,
  Phone,
  ShieldAlert,
  UserStar,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import UserAvatar from "./user-avatar";
import Image from "next/image";

export function AppSidebar() {
  const pathName = usePathname();
  const NAV_LINKS: ILink[] = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Transfer",
      href: "/transfer",
      icon: ArrowUpDown,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: ClipboardList,
    },
    {
      name: "Chat",
      href: "/chat",
      icon: MessagesSquare,
    },
    {
      name: "Extintions",
      href: "/extintions",
      icon: Phone,
    },
    {
      name: "Cash",
      href: "/cash",
      icon: Wallet,
    },
    {
      name: "Delivery",
      href: "/delivery",
      icon: Motorbike,
    },
    {
      name: "Categories",
      href: "/categories",
      icon: LibraryBig ,
    },
    {
      name: "Pharmacies",
      href: "/pharmacies",
      icon: Building2 ,
    },
    {
      name: "Supervisors",
      href: "/supervisor",
      icon: UserStar ,
    },
    {
      name: "Pharmacists",
      href: "/pharmacists-staff",
      icon: Users ,
    },
    {
      name: "Roles",
      href: "/roles",
      icon: ShieldAlert ,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b flex-row ">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <p className="font-bold">Pharmacy <br /> Platform</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {NAV_LINKS.map((link, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  size={"custom"}
                  className={cn(
                    link.href === pathName
                      ? "bg-primary text-white hover:bg-primary hover:text-white"
                      : "",
                  )}
                >
                  <Link href={link.href}>
                    <link.icon />
                    <p>{link.name}</p>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t gap-2 ">
        {/* theme */}
        <div className="flex items-center justify-between">
          <p>Theme</p>
          <ModeToggle />
        </div>
        <UserAvatar />
      </SidebarFooter>
    </Sidebar>
  );
}
