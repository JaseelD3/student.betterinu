/**
 * (student)/layout.tsx
 * Wraps all student-facing pages with the sidebar shell and auth guard.
 */
import { StudentAuthGuard } from "@/components/layout/student-auth-guard"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarHeaderBar } from "@/components/layout/sidebar-header-bar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StudentAuthGuard>
      <SidebarProvider>
        {/* Desktop sidebar — hidden on mobile */}
        <AppSidebar />

        <SidebarInset>
          {/* Slim sticky header with trigger + breadcrumb */}
          <SidebarHeaderBar />

          {/* Page content — each page uses PageWrapper for consistent padding */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-minimal">{children}</div>
        </SidebarInset>

        {/* Mobile floating bottom nav — hidden on desktop */}
        <MobileBottomNav />
      </SidebarProvider>
    </StudentAuthGuard>
  )
}
