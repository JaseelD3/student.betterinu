import type { Metadata } from "next"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const metadata: Metadata = {
  title: "Dashboard | Betterinu",
  description:
    "Your personal learning dashboard — courses, progress, assignments and payments at a glance.",
}

export default function DashboardPage() {
  return (
    <PageWrapper>
      <DashboardShell />
    </PageWrapper>
  )
}
