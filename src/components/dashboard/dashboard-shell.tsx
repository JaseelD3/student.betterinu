"use client"

import { DashboardWelcomeHeader } from "@/components/dashboard/dashboard-welcome-header"
import { ContinueLearningCard } from "@/components/dashboard/continue-learning-card"
import { DashboardAttendanceCard } from "@/components/dashboard/dashboard-attendance-card"
import { DashboardAssignmentsWidget } from "@/components/dashboard/dashboard-assignments-widget"
import { DashboardTasksWidget } from "@/components/dashboard/dashboard-tasks-widget"
import { DashboardFinesWidget } from "@/components/dashboard/dashboard-fines-widget"
import { DashboardAttendanceSummary } from "@/components/dashboard/dashboard-attendance-summary"
import { DashboardFeeSummary } from "@/components/dashboard/dashboard-fee-summary"
import { DashboardEventsWidget } from "@/components/dashboard/dashboard-events-widget"

export function DashboardShell() {
  return (
    <div className="mx-auto flex w-full  flex-col gap-5 ">

      {/* ── Row 1: Welcome ───────────────────────────────────────────── */}
      <DashboardWelcomeHeader />

      {/* ── Main Layout: Asymmetric Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Left Area (2/3 width) */}
        <div className="flex flex-col gap-5 lg:col-span-2">

          {/* Top Row Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Left Column: Attendance (taller) + Events (shorter) */}
            <div className="flex flex-col gap-5">
              <div className="flex-1">
                <DashboardAttendanceCard />
              </div>
              <div className="flex-none">
                <DashboardEventsWidget />
              </div>
            </div>

            {/* Right Column: Course Tasks (tall) */}
            <DashboardAssignmentsWidget />

            {/* Next Row items */}
            <DashboardTasksWidget />
            <DashboardFinesWidget />
          </div>

          {/* Wide bottom card */}
          <DashboardAttendanceSummary />
        </div>

        {/* Right Area (1/3 width) */}
        <div className="flex flex-col gap-5 lg:col-span-1">
          <ContinueLearningCard />
          <DashboardFeeSummary />
        </div>

      </div>
    </div>
  )
}
