"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Zap } from "lucide-react"
import type { CourseId, Week } from "@/types"
import { useProgress } from "@/lib/hooks/useProgress"
import { cn } from "@/lib/utils"
import { Accordion } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ModuleAccordion } from "./module-accordion"

export function WeekCard({
  courseId,
  week,
  isLoading = false,
}: {
  courseId: CourseId
  week: Week
  isLoading?: boolean
}) {
  const { areAllWeekDaysComplete, hasPassedQuiz, isSubModuleComplete } =
    useProgress()

  const allSubModules = week.days.flatMap((day) => day.subModules)
  const complete = allSubModules.filter((m) => isSubModuleComplete(m.id)).length
  const percent = allSubModules.length
    ? Math.round((complete / allSubModules.length) * 100)
    : 0
  const daysComplete = areAllWeekDaysComplete(courseId, week.id)
  const passed = hasPassedQuiz(courseId, week.id)

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="space-y-4" id={week.id}>
        <Card>
          <CardContent className="py-0">
            <div className="animate-pulse flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-2.5 w-1/4 rounded bg-muted" />
              </div>
              <div className="w-full shrink-0 sm:w-48 space-y-1.5">
                <div className="h-2 w-full rounded-full bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-4" id={week.id}>
      {/* Week Header */}
      <Card className={cn(passed && "border-primary/30")}>
        <CardContent className="py-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: title + meta */}
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                {week.isShared && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Zap className="size-3 text-primary" aria-hidden />
                    Shared
                  </Badge>
                )}
                {passed && (
                  <Badge className="gap-1 bg-accent text-accent-foreground hover:bg-accent/90 text-xs">
                    <CheckCircle2 className="size-3" aria-hidden />
                    Quiz Passed
                  </Badge>
                )}
              </div>
              <h2 className="font-heading text-foreground text-base font-bold leading-snug tracking-tight">
                {week.title.replace(":", " —")}
              </h2>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {complete} / {allSubModules.length} lessons complete
              </p>
            </div>

            {/* Right: progress bar */}
            <div className="w-full shrink-0 sm:w-48">
              <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Progress</span>
                <span
                  className={cn(
                    "text-foreground",
                    percent === 100 && "text-primary font-bold"
                  )}
                >
                  {percent}%
                </span>
              </div>
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day accordions */}
      <Accordion
        type="multiple"
        defaultValue={
          !week.days[0] ||
            (week.days.length > 1 &&
              !week.days[0].subModules.every((m) => isSubModuleComplete(m.id)))
            ? []
            : [week.days[0].id]
        }
        className="grid w-full gap-2"
      >
        {week.days.map((day, idx) => {
          const isLocked =
            idx > 0 &&
            !week.days[idx - 1].subModules.every((m) =>
              isSubModuleComplete(m.id)
            )
          return (
            <ModuleAccordion
              courseId={courseId}
              day={day}
              key={day.id}
              weekId={week.id}
              isLocked={isLocked}
            />
          )
        })}
      </Accordion>

      {/* Quiz CTA — only when all days are done */}
      {daysComplete && (
        <Card className="border-primary bg-primary text-primary-foreground">
          <CardContent className="py-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-heading text-base font-bold">
                  Week complete!
                </p>
                <p className="mt-0.5 text-xs text-primary-foreground/80">
                  Pass the quiz to unlock the next week and earn 150 XP.
                </p>
              </div>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="shrink-0 gap-1.5 font-semibold"
              >
                <Link href={`/quiz/${courseId}/${week.id}`}>
                  Take Quiz
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
