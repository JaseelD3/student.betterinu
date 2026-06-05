"use client"

import { useMemo } from "react"
import { Lock } from "lucide-react"
import type { CourseId, Day } from "@/types"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useProgress } from "@/lib/hooks/useProgress"
import { cn } from "@/lib/utils"
import { ProgressBar } from "./progress-bar"
import { SubModuleItem } from "./sub-module-item"
import { CompletionBadge } from "./completion-badge"

export function ModuleAccordion({
  courseId,
  weekId,
  day,
  isLocked,
}: {
  courseId: CourseId
  weekId: string
  day: Day
  isLocked?: boolean
}) {
  const { isSubModuleComplete, isDayComplete } = useProgress()

  const completeCount = useMemo(
    () => day.subModules.filter((m) => isSubModuleComplete(m.id)).length,
    [day.subModules, isSubModuleComplete]
  )
  const percent = day.subModules.length
    ? Math.round((completeCount / day.subModules.length) * 100)
    : 0

  return (
    <section
      className={cn(
        "border-border bg-card overflow-hidden rounded-md border transition-opacity",
        isLocked && "pointer-events-none opacity-50"
      )}
      id={day.id}
    >
      <AccordionItem value={day.id} className="border-b-0">
        <AccordionTrigger
          className={cn(
            "hover:no-underline px-4 py-3 [&[data-state=open]>span>svg]:rotate-180",
            isLocked && "cursor-default"
          )}
        >
          <span className="flex w-full items-center justify-between gap-3 text-left">
            {/* Day title */}
            <span className="font-heading text-foreground text-sm font-bold leading-snug">
              {day.title}
            </span>

            {/* Right badge */}
            <span className="shrink-0">
              {isLocked ? (
                <Badge
                  variant="outline"
                  className="text-muted-foreground gap-1 text-[11px]"
                >
                  <Lock className="size-3" aria-hidden />
                  Locked
                </Badge>
              ) : (
                <CompletionBadge
                  complete={
                    isDayComplete(day.id) ||
                    (day.subModules.length > 0 &&
                      completeCount === day.subModules.length)
                  }
                />
              )}
            </span>
          </span>
        </AccordionTrigger>

        <AccordionContent>
          <div className="border-border border-t px-4 pt-3 pb-4">
            {/* Locked state message */}
            {isLocked ? (
              <div className="border-border text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-md border border-dashed py-6 text-center">
                <Lock className="size-5 opacity-40" aria-hidden />
                <p className="text-xs font-semibold">
                  Complete the previous day&apos;s lessons to unlock this
                  content.
                </p>
              </div>
            ) : (
              <>
                {/* Day progress */}
                <div className="bg-muted/50 mb-3 space-y-1.5 rounded-md px-3 py-2.5">
                  <div className="text-primary flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                    <span>Day progress</span>
                    <span>
                      {completeCount} / {day.subModules.length}
                    </span>
                  </div>
                  <ProgressBar
                    value={percent}
                    label={`${day.title} progress`}
                  />
                </div>

                {/* Lesson rows */}
                <div className="grid gap-1.5">
                  {day.subModules.map((module) => (
                    <SubModuleItem
                      courseId={courseId}
                      key={module.id}
                      module={module}
                      weekId={weekId}
                      dayId={day.id}
                      daySubModulesIds={day.subModules.map((m) => m.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </section>
  )
}
