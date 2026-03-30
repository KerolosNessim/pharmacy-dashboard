import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import Navbar from "@/components/shared/navbar";
import { FCMProvider } from "@/components/providers/fcm-provider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FCMProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </FCMProvider>
  );
}
