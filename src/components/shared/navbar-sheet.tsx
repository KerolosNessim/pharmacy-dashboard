"use client";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ILink } from "@/types/constant";
import {
  History,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Package,
  Pill,
  ScanBarcode,
  Shield,
  Upload,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import SendReportDialog from "./send-report-dialog";
import { useState } from "react";
import LogoutBtn from "./logout-btn";
import UserInfo from "./user-info";
import { useUserStore } from "@/stores/user-store";

const NavbarSheet = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();

  const Sheet_Links: ILink[] = [
    {
      name: "Refill Tasks",
      href: "/refill",
      icon: Pill,
      allowedRoles: ["super_admin", "supervisor", "pharmacist"],
    },

    // {
    //   name: "Upload Data ",
    //   href: "/upload",
    //   icon: Upload,
    // },
    // {
    //   name: "Manage Pharmacists ",
    //   href: "/pharmacists",
    //   icon: Users,
    // },
    {
      name: "Products Database ",
      href: "/products",
      icon: Package,
      allowedRoles: ["super_admin", "supervisor", "pharmacist"],
    },
    {
      name: "Import Product",
      href: "/import-product",
      icon: Upload,
      allowedRoles: ["super_admin"],
    },
    // {
    //   name: "Manage Members ",
    //   href: "/members",
    //   icon: Users,
    // },
  ];

  const filteredLinks = Sheet_Links.filter(
    (link) => !link.allowedRoles || link.allowedRoles.includes(user?.role as string)
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-4 w-4" />
          <span className="sr-only"></span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="gap-4">
          <SheetTitle asChild>
            <UserInfo />
          </SheetTitle>
          <SheetDescription asChild>
            <div className="flex flex-col gap-4">
              {/* navs */}
              <ul className="border rounded-xl overflow-hidden">
                {filteredLinks.map((link, index) => (
                  <li
                    key={index}
                    className="p-4 border-b hover:bg-primary/30 hover:text-primary"
                  >
  
                      <Link
                        onClick={() => setOpen(false)}
                        href={link.href}
                        className="flex items-center gap-2 text-lg"
                      >
                        <link.icon />
                        <p>{link.name}</p>
                      </Link>
                    
                  </li>
                ))}
              </ul>
            </div>
          </SheetDescription>
        </SheetHeader>
      <SheetFooter>
        <LogoutBtn />
      </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarSheet;
