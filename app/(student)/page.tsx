import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const metadata: Metadata = {
  title: "Dashboard | Betterinu",
  description:
    "Your personal learning dashboard — courses, progress, assignments and payments at a glance.",
}

export default function DashboardPage() {
  return <DashboardShell />
}
