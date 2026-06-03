/**
 * (student)/layout.tsx
 * Wraps all student-facing pages with the sidebar shell and auth guard.
 */
import { StudentAuthGuard } from "@/components/layout/student-auth-guard"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarHeaderBar } from "@/components/layout/sidebar-header-bar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

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

          {/* Page content — add bottom padding on mobile for the floating nav */}
          <div className="flex-1 pb-16 md:pb-0">{children}</div>
        </SidebarInset>

        {/* Mobile floating bottom nav — hidden on desktop */}
        <MobileBottomNav />
      </SidebarProvider>
    </StudentAuthGuard>
  )
}
