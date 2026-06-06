"use client"

import { Separator } from "@/components/ui/separator"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ContinueLearningCard } from "@/components/dashboard/continue-learning-card"
import { AttendanceCard } from "@/components/dashboard/attendance-card"
import { FeeAlertCard } from "@/components/dashboard/fee-alert-card"

export function DashboardShell() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <DashboardHeader />

      <Separator />

      {/* Hero: Continue Learning — full width, most visual weight */}
      <ContinueLearningCard />

      {/* Secondary row: Attendance + Fee Alert side by side on large screens */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <AttendanceCard />
        <FeeAlertCard />
      </div>
    </div>
  )
}
