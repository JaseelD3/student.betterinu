/**
 * (student)/layout.tsx
 * Wraps all student-facing pages with the existing Navbar and toast system.
 */
import { Navbar } from "@/components/layout/main-navbar"
import { ToastHost } from "@/components/ui/toast"
import { StudentAuthGuard } from "@/components/layout/student-auth-guard"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <StudentAuthGuard>
        <div className="fixed inset-0 z-0 h-full w-full bg-[#f8fafc]" />
        <Navbar />
        <div className="relative z-10">{children}</div>
      </StudentAuthGuard>
      <ToastHost />
    </>
  )
}
