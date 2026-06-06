import { useState } from "react"
import { Lock, Zap, CheckCircle2, Circle, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Course, StudentProgress } from "@/types"
import type { WeekStub } from "@/lib/api-client"
import { useProgress } from "@/lib/hooks/useProgress"
import { useWeek } from "@/lib/hooks/use-course"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type SyllabusAccordionProps = {
  course: Course
  weeks: WeekStub[]
}

export function SyllabusAccordion({ course, weeks }: SyllabusAccordionProps) {
  const { progress, isWeekUnlocked } = useProgress()
  const [expanded, setExpanded] = useState<string[]>(weeks.length > 0 ? [weeks[0].id] : [])

  const other = course.id === "mern" ? "Python" : "MERN Stack"

  /** Compute the duration-gap weeks (coming soon placeholders) */
  const durationWeeks =
    parseInt(course.duration.match(/\d+/)?.[0] || "0", 10) ||
    weeks.length
  const comingSoonCount = Math.max(0, durationWeeks - weeks.length)

  return (
    <Card className="py-0">
      <CardHeader className="border-b pt-4 pb-3 px-3 sm:px-5">
        <CardTitle className="text-foreground text-sm font-bold">
          Weekly Curriculum <span className="text-xs text-muted-foreground"> {" "}( You need to complete the current week full lesson to unlock next week)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 mx-0 pb-4 px-3 sm:px-5">
        <Accordion
          type="multiple"
          value={expanded}
          onValueChange={setExpanded}
          className="w-full -mt-1.5"
        >
          {weeks.map((week, index) => {
            const unlocked = isWeekUnlocked(course, week.id)
            const weekDone = progress.completedWeeks.includes(
              `${course.id}:${week.id}`
            )
            const isLocked = !unlocked && index > 0
            const isExpanded = expanded.includes(week.id)

            return (
              <AccordionItem key={week.id} value={week.id} disabled={isLocked}>
                <AccordionTrigger className={cn("hover:no-underline", isLocked && "[&>[data-slot=accordion-trigger-icon]]:hidden")}>
                  <div className="flex min-w-0 flex-1 flex-col gap-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      {weekDone ? (
                        <CheckCircle2
                          className="text-accent size-4 shrink-0"
                          aria-hidden
                        />
                      ) : isLocked ? (
                        <Lock
                          className="text-muted-foreground size-4 shrink-0"
                          aria-hidden
                        />
                      ) : (
                        <Circle
                          className="text-border size-4 shrink-0"
                          aria-hidden
                        />
                      )}
                      <span className="text-foreground text-base font-semibold">
                        {week.title} 
                      </span>
                      {week.is_shared && (
                        <Badge variant="secondary" className="text-[10px]">
                          <Zap className="size-3" aria-hidden />
                          Shared with {other}
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                {!isLocked && (
                  <AccordionContent>
                    <SyllabusWeekContent
                      courseId={course.id}
                      weekId={week.id}
                      isExpanded={isExpanded}
                      progress={progress}
                    />
                  </AccordionContent>
                )}
              </AccordionItem>
            )
          })}

          {/* Coming soon placeholders */}
          {Array.from({ length: comingSoonCount }).map((_, i) => {
            const weekNum = weeks.length + i + 1
            return (
              <div
                key={`coming-soon-${weekNum}`}
                className="border-border flex items-center gap-2 border-t px-1 py-4 opacity-40"
              >
                <Lock
                  className="text-muted-foreground size-4 shrink-0"
                  aria-hidden
                />
                <span className="text-foreground text-base font-semibold">
                  Week {weekNum}: Coming Soon
                </span>
              </div>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}

function SyllabusWeekContent({
  courseId,
  weekId,
  isExpanded,
  progress,
}: {
  courseId: string
  weekId: string
  isExpanded: boolean
  progress: StudentProgress
}) {
  const { data: week, isLoading } = useWeek(courseId, weekId, isExpanded)

  if (isLoading && !week) {
    return (
      <div className="flex items-center justify-center py-6 text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2" />
        <span className="text-sm">Loading week contents...</span>
      </div>
    )
  }

  if (!week || !week.days || week.days.length === 0) {
    return (
      <div className="py-4 text-sm text-muted-foreground text-center">
        No content available for this week.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0">
      {week.days.map((day, dayIndex) => (
        <div key={day.id}>
          {dayIndex > 0 && <Separator className="my-2" />}
          <div className="py-1">
            <p className="text-foreground mb-1.5 text-sm font-semibold">
              {day.title || day.label}
            </p>
            <ul className="flex flex-col gap-2">
              {day.subModules?.map((sm) => {
                const done = progress.completedSubModules.includes(sm.id)
                return (
                  <li key={sm.id} className="flex items-center gap-2">
                    {done ? (
                      <CheckCircle2
                        className="text-accent size-3 shrink-0"
                        aria-hidden
                      />
                    ) : (
                      <Circle
                        className="text-border size-3 shrink-0"
                        aria-hidden
                      />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        done
                          ? "text-muted-foreground line-through"
                          : "text-foreground/70"
                      )}
                    >
                      {sm.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "ml-auto shrink-0 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5",
                        sm.type === "lesson" ||
                          sm.type === "video" ||
                          sm.type === "mixed"
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900"
                          : sm.type === "doc" || sm.type === "resource"
                            ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900"
                            : sm.type === "assignment" ||
                                sm.type === "quiz" ||
                                sm.type === "exercise"
                              ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900"
                              : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {sm.type}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
