import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 w-full">
            <SidebarTrigger className="mb-4" />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
