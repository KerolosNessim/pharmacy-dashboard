import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppFooter } from "@/components/shared/app-footer";
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
      <SidebarInset className="flex min-h-svh flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
