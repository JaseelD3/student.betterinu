"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useProgress } from "@/lib/hooks/useProgress"
import type { Course } from "@/types"

type WeeklyProgressSectionProps = {
  courses: Course[] | undefined
  isLoading: boolean
}

export function WeeklyProgressSection({
  courses,
  isLoading,
}: WeeklyProgressSectionProps) {
  const { progress } = useProgress()

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-foreground text-sm font-bold tracking-wide">
        Weekly Progress
      </h2>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-md" />
          ))}
        </div>
      ) : !courses || courses.length === 0 ? (
        <div className="bg-card ring-foreground/10 ring-dashed flex items-center justify-center rounded-md py-10 ring-1">
          <p className="text-muted-foreground text-xs">
            No courses to display.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((course) => (
            <CourseWeekProgress
              key={course.id}
              course={course}
              completedDays={progress.completedDays}
              completedWeeks={progress.completedWeeks}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function CourseWeekProgress({
  course,
  completedDays,
  completedWeeks,
}: {
  course: Course
  completedDays: string[]
  completedWeeks: string[]
}) {
  return (
    <div className="bg-card ring-foreground/10 flex flex-col gap-3 rounded-md p-4 ring-1">
      <p className="text-foreground truncate text-xs font-semibold">
        {course.title}
      </p>

      <div className="flex flex-col gap-2">
        {course.weeks.map((week) => {
          const totalDays = week.days?.length ?? 0
          const doneDays =
            week.days?.filter((d) => completedDays.includes(d.id)).length ?? 0
          const isWeekComplete = completedWeeks.includes(
            `${course.id}:${week.id}`
          )
          const pct =
            totalDays > 0 ? Math.round((doneDays / totalDays) * 100) : 0

          return (
            <div key={week.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {isWeekComplete ? (
                    <CheckCircle2 className="text-primary size-3" />
                  ) : (
                    <Circle className="text-muted-foreground size-3" />
                  )}
                  <span className="text-foreground text-[11px] font-medium">
                    {week.title}
                  </span>
                </div>
                <span className="text-muted-foreground text-[10px]">
                  {doneDays}/{totalDays} days
                </span>
              </div>

              {/* Progress bar */}
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isWeekComplete ? "bg-primary" : "bg-primary/60"
                    }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
