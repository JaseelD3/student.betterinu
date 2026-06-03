"use client"

import Link from "next/link"
import {
  BookOpen,
  Video,
  FileText,
  Link as LinkIcon,
  Dumbbell,
  CheckCircle2,
  Circle,
  CalendarDays,
  ChevronRight,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useProgress } from "@/lib/hooks/useProgress"
import { useDashboardStore } from "@/store/dashboard-store"
import type { Course, SubModule } from "@/types"

type TodayLearningSectionProps = {
  courses: Course[] | undefined
  isLoading: boolean
}

const TYPE_CONFIG: Record<
  string,
  { Icon: React.ElementType; label: string; cls: string }
> = {
  video: {
    Icon: Video,
    label: "Video",
    cls: "bg-purple-50 text-purple-700 ring-purple-100 dark:bg-purple-950/30 dark:text-purple-300 dark:ring-purple-900/30",
  },
  doc: {
    Icon: FileText,
    label: "Document",
    cls: "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-900/30",
  },
  lesson: {
    Icon: FileText,
    label: "Lesson",
    cls: "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-900/30",
  },
  resource: {
    Icon: LinkIcon,
    label: "Resource",
    cls: "bg-teal-50 text-teal-700 ring-teal-100 dark:bg-teal-950/30 dark:text-teal-300 dark:ring-teal-900/30",
  },
  exercise: {
    Icon: Dumbbell,
    label: "Exercise",
    cls: "bg-orange-50 text-orange-700 ring-orange-100 dark:bg-orange-950/30 dark:text-orange-300 dark:ring-orange-900/30",
  },
  mixed: {
    Icon: BookOpen,
    label: "Mixed",
    cls: "bg-indigo-50 text-indigo-700 ring-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-300 dark:ring-indigo-900/30",
  },
  assignment: {
    Icon: FileText,
    label: "Assignment",
    cls: "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900/30",
  },
  quiz: {
    Icon: FileText,
    label: "Quiz",
    cls: "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900/30",
  },
}

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG["doc"]
}

export function TodayLearningSection({
  courses,
  isLoading,
}: TodayLearningSectionProps) {
  const { progress } = useProgress()
  const { activeCourseId, setActiveCourseId } = useDashboardStore()

  // Find the first course with an incomplete day as the default active course
  const activeCourse =
    courses?.find((c) => c.id === activeCourseId) ?? courses?.[0] ?? null

  // Find the next incomplete day in the active course
  const nextDay = activeCourse
    ? (() => {
      for (const week of activeCourse.weeks) {
        for (const day of week.days) {
          if (!progress.completedDays.includes(day.id)) {
            return { week, day }
          }
        }
      }
      return null
    })()
    : null

  const subModules = nextDay?.day.subModules ?? []
  const completedCount = subModules.filter((sm) =>
    progress.completedSubModules.includes(sm.id)
  ).length
  const totalCount = subModules.length

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-foreground text-sm font-bold tracking-wide">
          Today&apos;s Learning
        </h2>
        {nextDay && (
          <Badge variant="outline" className="gap-1 text-[10px]">
            <CalendarDays className="size-3" />
            {nextDay.week.title} · {nextDay.day.label}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : !courses || courses.length === 0 ? (
        <EmptyCard message="Enroll in a course to start learning." />
      ) : (
        <div className="bg-card ring-foreground/10 flex flex-col overflow-hidden rounded-md ring-1">
          {/* Course selector tabs if multiple courses */}
          {courses.length > 1 && (
            <div className="border-border/50 flex gap-1 overflow-x-auto border-b px-3 pt-3 pb-0">
              {courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCourseId(c.id)}
                  className={`shrink-0 rounded-t-lg px-3 py-1.5 text-[10px] font-bold tracking-wide uppercase transition-colors ${activeCourse?.id === c.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {c.title.split(" ").slice(0, 3).join(" ")}
                </button>
              ))}
            </div>
          )}

          {nextDay === null ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <CheckCircle2 className="text-primary size-8" />
              <p className="text-foreground text-sm font-semibold">
                All days complete!
              </p>
              <p className="text-muted-foreground text-xs">
                Great work on {activeCourse?.title ?? "this course"}.
              </p>
            </div>
          ) : (
            <div className="flex flex-col p-3">
              {/* Day completion badge */}
              <div className="mb-3 flex items-center justify-between">
                <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                  {nextDay.day.title}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${completedCount === totalCount && totalCount > 0
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                    : "bg-muted text-muted-foreground"
                    }`}
                >
                  {completedCount}/{totalCount} done
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {subModules.map((sm) => (
                  <SubModuleRow
                    key={sm.id}
                    subModule={sm}
                    courseId={activeCourse!.id}
                    weekId={nextDay.week.id}
                    isCompleted={progress.completedSubModules.includes(sm.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function SubModuleRow({
  subModule,
  courseId,
  weekId,
  isCompleted,
}: {
  subModule: SubModule
  courseId: string
  weekId: string
  isCompleted: boolean
}) {
  const cfg = getTypeConfig(subModule.type)
  const href = `/course/${courseId}/learn/${weekId}/${subModule.id}`

  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-md px-3 py-2.5 ring-1 transition-all duration-200 hover:shadow-sm ${isCompleted
        ? "bg-muted/50 ring-border/30"
        : "bg-card ring-foreground/8 hover:ring-primary/20"
        }`}
    >
      {isCompleted ? (
        <CheckCircle2 className="text-primary size-4 shrink-0" />
      ) : (
        <Circle className="text-muted-foreground size-4 shrink-0" />
      )}

      <span
        className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ring-1 ${cfg.cls}`}
      >
        {cfg.label}
      </span>

      <p
        className={`min-w-0 flex-1 truncate text-xs font-medium ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"
          }`}
      >
        {subModule.title}
      </p>

      <ChevronRight className="text-muted-foreground size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="bg-card ring-foreground/10 ring-dashed flex items-center justify-center rounded-md py-10 ring-1">
      <p className="text-muted-foreground text-xs">{message}</p>
    </div>
  )
}
