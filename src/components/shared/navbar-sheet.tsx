import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { History, LayoutDashboard, LogOut, Mail, Menu, MessageSquare, Package, Pill, ScanBarcode, Shield, Upload, Users, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ILink } from "@/types/constant";
import Link from "next/link";
const NavbarSheet = () => {
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
    },
    {
      name: "Upload Data ",
      href: "/",
      icon: Upload,
    },
    {
      name: "Manage Pharmacists ",
      href: "/",
      icon: Users,
    },
    {
      name: "Products Database ",
      href: "/",
      icon: Package,
    },
    {
      name: "Import Product",
      href: "/",
      icon: Upload,
    },
    {
      name: "Whatsapp Setup",
      href: "/",
      icon: MessageSquare,
    },
    {
      name: "Scan Ai",
      href: "/",
      icon: ScanBarcode,
    },
    {
      name: "Scan Components",
      href: "/",
      icon: ScanBarcode,
    },
    {
      name: "Manage Members ",
      href: "/",
      icon: Users,
    },
  ];
  return (
    <Sheet>
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
                  <li key={index} className="p-4 border-b hover:bg-primary/30 hover:text-primary">
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-lg"
                    >
                      <link.icon />
                      <p>{link.name}</p>
                    </Link>
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
