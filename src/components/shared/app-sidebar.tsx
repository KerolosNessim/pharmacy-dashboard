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
import { useUserStore } from "@/stores/user-store";
import { ModeToggle } from "./mode-toggle";
import UserAvatar from "./user-avatar";
import Image from "next/image";

export function AppSidebar() {
  const pathName = usePathname();
  const { user } = useUserStore();

  const NAV_LINKS: ILink[] = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      allowedRoles: ["admin", "supervisor", "pharmacist"],
    },
    {
      name: "Transfer",
      href: "/transfer",
      icon: ArrowUpDown,
      allowedRoles: ["admin", "supervisor", "pharmacist"],
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: ClipboardList,
      allowedRoles: ["admin", "supervisor", "pharmacist"],
    },
    // {
    //   name: "Chat",
    //   href: "/chat",
    //   icon: MessagesSquare,
    // },
    {
      name: "Extintions",
      href: "/extintions",
      icon: Phone,
      allowedRoles: ["admin"],
    },
    {
      name: "Cash",
      href: "/cash",
      icon: Wallet,
      allowedRoles: ["admin", "supervisor", "pharmacist"],
    },
    {
      name: "Delivery",
      href: "/delivery",
      icon: Motorbike,
      allowedRoles: ["admin", "supervisor", "pharmacist"],
    },
    {
      name: "Categories",
      href: "/categories",
      icon: LibraryBig,
      allowedRoles: ["admin"],
    },
    {
      name: "Pharmacies",
      href: "/pharmacies",
      icon: Building2,
      allowedRoles: ["admin"],
    },
    {
      name: "Supervisors",
      href: "/supervisor",
      icon: UserStar,
      allowedRoles: ["admin"],
    },
    {
      name: "Pharmacists",
      href: "/pharmacists-staff",
      icon: Users,
      allowedRoles: ["admin", "supervisor"],
    },
    // {
    //   name: "Roles",
    //   href: "/roles",
    //   icon: ShieldAlert,
    //   allowedRoles: ["admin"],
    // },
  ];

  const filteredLinks = NAV_LINKS.filter(
    (link) => !link.allowedRoles || link.allowedRoles.includes(user?.role as string)
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b flex-row ">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <p className="font-bold">Pharmacy <br /> Platform</p>
        
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredLinks.map((link, index) => (
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
