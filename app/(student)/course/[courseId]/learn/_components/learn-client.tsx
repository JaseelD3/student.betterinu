"use client"

import type { Course } from "@/types"
import { useProgress } from "@/lib/hooks/useProgress"
import { LockedWeekCard } from "./locked-week-card"
import { WeekCard } from "./week-card"
import { Sidebar } from "./main-sidebar"

export function LearnClient({ course }: { course: Course }) {
  const { isWeekUnlocked } = useProgress()

  // Pad the weeks to 30 to show upcoming weeks as locked.
  const paddedWeeks = Array.from({ length: 30 }).map((_, index) => {
    if (index < course.weeks.length) return course.weeks[index]
    return {
      id: `dummy-week-${index + 1}`,
      title: `Week ${index + 1}: Coming Soon`,
      isLocked: true,
      isShared: false,
      days: [],
    } as any
  })

  const paddedCourse = { ...course, weeks: paddedWeeks }
  const activeWeek =
    paddedCourse.weeks.find(
      (week: any) =>
        isWeekUnlocked(paddedCourse, week.id) && !week.id.startsWith("dummy")
    ) ?? paddedCourse.weeks[0]

  return (
    <div className="flex min-h-0 w-full">
      {/* Left sidebar — flush against the left edge */}
      <Sidebar activeWeekId={activeWeek.id} course={paddedCourse} />

      {/* Right content — matches course-detail-client p-4 sm:p-5 */}
      <div className="min-w-0 flex-1 space-y-6 p-4 sm:p-5">
        {/* Course header */}
        <div className="bg-card ring-foreground/10 rounded-md ring-1">
          <div className="px-4 py-3">
            <p className="text-primary text-[11px] font-bold tracking-widest uppercase">
              Course Material
            </p>
            <h1 className="text-foreground mt-0.5 text-base font-bold leading-snug truncate">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Week cards */}
        {paddedCourse.weeks.map((week: any, index: number) =>
          isWeekUnlocked(paddedCourse, week.id) &&
            !week.id.startsWith("dummy") ? (
            <WeekCard courseId={paddedCourse.id} key={week.id} week={week} />
          ) : (
            <LockedWeekCard
              key={week.id}
              previousWeekNumber={index}
              week={week}
            />
          )
        )}
      </div>
    </div>
  )
}
