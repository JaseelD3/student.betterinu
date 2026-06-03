"use client"

import { Lock, Zap } from "lucide-react"
import type { Course } from "@/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useProgress } from "@/lib/hooks/useProgress"

export function SyllabusList({ course }: { course: Course }) {
  const { isWeekUnlocked } = useProgress()
  const other = course.id === "mern" ? "Python" : "MERN Stack"

  return (
    <Accordion
      type="multiple"
      defaultValue={course.weeks.length > 0 ? [course.weeks[0].id] : []}
      className="border-default bg-surface w-full rounded-xl border px-5"
    >
      {course.weeks.map((week, index) => {
        const unlocked = isWeekUnlocked(course, week.id)
        return (
          <AccordionItem
            value={week.id}
            key={week.id}
            className="border-muted border-t border-b-0 py-2 first:border-t-0"
          >
            <AccordionTrigger className="py-4 hover:no-underline">
              <span className="flex flex-wrap items-center gap-3">
                <span className="font-display text-lg font-bold">
                  {week.title}
                </span>
                {week.isShared ? (
                  <Badge
                    title="This module is identical across courses"
                    variant="secondary"
                    className="bg-[#1a4031] text-white"
                  >
                    <Zap className="size-3" aria-hidden />
                    Shared with {other}
                  </Badge>
                ) : null}
                {!unlocked ? (
                  <Lock
                    className="animate-lock-pulse size-4 text-[var(--amber-600)]"
                    aria-hidden
                  />
                ) : null}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div
                className={
                  !unlocked && index > 0 ? "opacity-60 blur-[1px]" : ""
                }
              >
                {week.days.map((day) => (
                  <div
                    className="border-muted border-t py-3 first:border-t-0"
                    key={day.id}
                  >
                    <p className="text-foreground text-sm font-bold">
                      {day.label}:
                    </p>
                    <ul className="text-secondary mt-2 grid gap-1 text-sm">
                      {day.subModules.map((module) => (
                        <li key={module.id}>{module.title}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {!unlocked && index > 0 ? (
                <p className="text-xp mt-3 text-sm font-semibold">
                  Complete Week {index} to unlock
                </p>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        )
      })}

      {Array.from({
        length: Math.max(
          0,
          (parseInt(course.duration.match(/\d+/)?.[0] || "0", 10) ||
            course.weeks.length) - course.weeks.length
        ),
      }).map((_, i) => {
        const weekNum = course.weeks.length + i + 1
        return (
          <div
            key={`coming-soon-${weekNum}`}
            className="border-muted flex items-center justify-between border-t px-1 py-4"
          >
            <span className="flex items-center gap-3 opacity-50">
              <span className="font-display text-lg font-bold">
                Week {weekNum}: Coming Soon
              </span>
              <Lock className="text-muted-foreground size-4" aria-hidden />
            </span>
          </div>
        )
      })}
    </Accordion>
  )
}
