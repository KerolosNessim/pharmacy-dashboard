import { AppSidebar } from "@/components/shared/app-sidebar";
import Navbar from "@/components/shared/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
  );
}
