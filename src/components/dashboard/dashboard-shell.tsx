"use client"

import { WelcomeHeader } from "@/components/dashboard/welcome-header"
import { StatsSummary } from "@/components/dashboard/stats-summary"
import { MyCoursesSection } from "@/components/dashboard/my-courses-section"
import { TodayLearningSection } from "@/components/dashboard/today-learning-section"
import { WeeklyProgressSection } from "@/components/dashboard/weekly-progress-section"
import { AssignmentsSection } from "@/components/dashboard/assignments-section"
import { FeePaymentsSection } from "@/components/dashboard/fee-payments-section"
import {
  useDashboardCourses,
  useDashboardAssignments,
  useDashboardStandaloneTasks,
} from "@/lib/hooks/use-dashboard"
import { useStudentFee } from "@/lib/hooks/useStudentFee"

export function DashboardShell() {
  const { data: courses, isLoading: isLoadingCourses } = useDashboardCourses()

  const { data: submissions, isLoading: isLoadingSubmissions } =
    useDashboardAssignments()

  const { data: standaloneTasks, isLoading: isLoadingStandalone } =
    useDashboardStandaloneTasks()

  const { data: feeEnrollments, isLoading: isLoadingFee } = useStudentFee()

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
      {/* Header */}
      <WelcomeHeader
        courseCount={isLoadingCourses ? null : (courses?.length ?? 0)}
      />

      {/* Stats summary row */}
      <StatsSummary
        submissions={submissions}
        feeEnrollments={feeEnrollments}
        isLoadingSubmissions={isLoadingSubmissions}
        isLoadingFee={isLoadingFee}
      />

      {/* Main two-column grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <MyCoursesSection courses={courses} isLoading={isLoadingCourses} />

          <TodayLearningSection
            courses={courses}
            isLoading={isLoadingCourses}
          />

          <WeeklyProgressSection
            courses={courses}
            isLoading={isLoadingCourses}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <AssignmentsSection
            courses={courses}
            submissions={submissions}
            standaloneTasks={standaloneTasks}
            isLoading={isLoadingSubmissions || isLoadingStandalone}
          />

          <FeePaymentsSection />
        </div>
      </div>
    </div>
  )
}
