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
  ClipboardList,
  Home,
  MessagesSquare,
  Phone
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import UserAvatar from "./user-avatar";



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
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b gap-0">
        <h1 className="text-xl text-primary font-bold">MEP AI</h1>
        <p className="text-muted-foreground text-xs">Pharmacy Platform</p>
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
          <ModeToggle/>
        </div>
        <UserAvatar/>
      </SidebarFooter>
    </Sidebar>
  );
}
