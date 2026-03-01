"use client";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
const NavbarSheet = () => {
  const [open, setOpen] = useState(false);
  const Sheet_Links: ILink[] = [
    {
      name: "Refill Tasks",
      href: "/refill",
      icon: Pill,
    },

    {
      name: "Transfer History",
      href: "/transfer/history",
      icon: History,
    },
    {
      name: "Send Transfer Report",
      href: "/",
      icon: Mail,
      isButton: true,
    },
    {
      name: "Upload Data ",
      href: "/upload",
      icon: Upload,
    },
    {
      name: "Manage Pharmacists ",
      href: "/pharmacists",
      icon: Users,
    },
    {
      name: "Products Database ",
      href: "/products",
      icon: Package,
    },
    {
      name: "Import Product",
      href: "/import-product",
      icon: Upload,
    },
    {
      name: "Whatsapp Setup",
      href: "/whatsapp",
      icon: MessageSquare,
    },
    // {
    //   name: "Scan Ai",
    //   href: "/",
    //   icon: ScanBarcode,
    // },
    // {
    //   name: "Scan Components",
    //   href: "/",
    //   icon: ScanBarcode,
    // },
    {
      name: "Manage Members ",
      href: "/members",
      icon: Users,
    },
  ];
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
            <div className="bg-bg rounded-lg p-4 flex items-center gap-4 ">
              {/* image */}
              <Image
                src="https://github.com/shadcn.png"
                alt="Logo"
                width={70}
                height={70}
                className="rounded-lg"
              />
              {/* info */}
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-lg">Alrashidi</h2>
                <p className="text-muted-foreground text-sm">ID: 382383</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="success">Neuro Pharmacy</Badge>
                  <Badge variant="pending">
                    <Shield />
                    Admin
                  </Badge>
                </div>
              </div>
            </div>
          </SheetTitle>
          <SheetDescription>
            <div className="flex flex-col gap-4">
              {/* navs */}
              <ul className="border rounded-xl overflow-hidden">
                {Sheet_Links.map((link, index) => (
                  <li
                    key={index}
                    className="p-4 border-b hover:bg-primary/30 hover:text-primary"
                  >
                    {link.isButton ? (
                      <SendReportDialog
                        button={
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-lg font-normal  hover:bg-transparent! hover:text-primary! p-0! "
                          >
                            <link.icon className="size-5" />
                            <p>{link.name}</p>
                          </Button>
                        }
                      />
                    ) : (
                      <Link
                        onClick={() => setOpen(false)}
                        href={link.href}
                        className="flex items-center gap-2 text-lg"
                      >
                        <link.icon />
                        <p>{link.name}</p>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              {/* logour */}
              <Button variant="destructive" className="cursor-pointer">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarSheet;
