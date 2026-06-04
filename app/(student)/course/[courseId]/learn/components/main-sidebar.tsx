"use client"

import Link from "next/link"
import { CheckCircle2, Lock, LayoutList } from "lucide-react"
import { ChevronDown } from "lucide-react"
import type { Course } from "@/types"
import { useProgress } from "@/lib/hooks/useProgress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export function Sidebar({
  course,
  activeWeekId,
}: {
  course: Course
  activeWeekId?: string
}) {
  const { isDayComplete, isWeekUnlocked, isSubModuleComplete } = useProgress()

  return (
    <aside className="border-border-strong/50 sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[360px] shrink-0 border-r-2 lg:block">
      <ScrollArea className="h-full">
        <div className="px-5 pt-5 pb-5">
          {/* Course progress block */}
          <div className="border-border bg-card mb-4 overflow-hidden rounded-md border">
            <div className="bg-primary px-4 py-3">
              <p className="text-primary-foreground/70 text-[11px] font-bold tracking-widest uppercase">
                Course Progress
              </p>
              <p className="text-primary-foreground mt-0.5 truncate text-base font-bold leading-snug">
                {course.title} 
              </p>
            </div>
          </div>

          {/* Curriculum nav label */}
          <div className="text-muted-foreground mb-2 flex items-center gap-2 px-1 text-[11px] font-bold tracking-widest uppercase">
            <LayoutList className="size-3.5" />
            Curriculum
          </div>

          <nav aria-label="Course weeks">
            <Accordion
              type="single"
              collapsible
              defaultValue={activeWeekId}
              className="grid gap-1.5"
            >
              {course.weeks.map((week) => {
                const unlocked = isWeekUnlocked(course, week.id)
                const active = activeWeekId === week.id
                return (
                  <AccordionItem
                    value={week.id}
                    className={cn(
                      "border-border bg-card overflow-hidden rounded-sm border transition-all",
                      active && "border-primary/40"
                    )}
                    key={week.id}
                  >
                    <AccordionTrigger
                      disabled={!unlocked}
                      className="px-3 py-2.5 hover:no-underline [&>svg]:!hidden [&[data-state=open]>div>svg.sidebar-chevron]:rotate-180"
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <a
                          aria-disabled={!unlocked}
                          onClick={(e) => {
                            if (!unlocked) {
                              e.preventDefault()
                              return
                            }
                            e.preventDefault()
                            const weekEl = document.getElementById(week.id)
                            if (weekEl) {
                              const trigger = weekEl.querySelector(
                                'button[data-state="closed"]'
                              )
                              if (trigger) {
                                ; (trigger as HTMLElement).click()
                              }
                              weekEl.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              })
                            }
                            history.pushState(null, "", `#${week.id}`)
                          }}
                          className={cn(
                            "flex-1 cursor-pointer text-left text-xs leading-snug font-semibold",
                            unlocked
                              ? active
                                ? "text-primary font-bold"
                                : "text-foreground hover:text-primary"
                              : "text-muted-foreground pointer-events-none"
                          )}
                          href={`#${week.id}`}
                        >
                          {week.title.replace(":", " —")}
                        </a>
                        {unlocked ? (
                          <ChevronDown className="text-muted-foreground sidebar-chevron size-4 shrink-0 transition-transform duration-200" />
                        ) : (
                          <Lock
                            className="text-muted-foreground size-3 shrink-0"
                            aria-hidden
                          />
                        )}
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="border-border border-t px-3 pt-0 pb-3">
                      <div className="mt-2 flex flex-col gap-0.5">
                        {week.days.map((day) => (
                          <a
                            className="text-foreground/90 hover:bg-muted group flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-[11px] font-medium transition-colors"
                            href={`#${day.id}`}
                            onClick={(e) => {
                              e.preventDefault()

                              const openAndScroll = () => {
                                const dayEl = document.getElementById(day.id)
                                if (dayEl) {
                                  const dayTrigger = dayEl.querySelector(
                                    'button[data-state="closed"]'
                                  ) as HTMLElement | null
                                  if (dayTrigger) {
                                    dayTrigger.click()
                                    setTimeout(() => {
                                      dayEl.scrollIntoView({
                                        behavior: "smooth",
                                        block: "center",
                                      })
                                    }, 200)
                                  } else {
                                    dayEl.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                    })
                                  }
                                }
                              }

                              const weekEl = document.getElementById(week.id)
                              if (weekEl) {
                                const weekTrigger = weekEl.querySelector(
                                  'button[data-state="closed"]'
                                ) as HTMLElement | null
                                if (weekTrigger) {
                                  weekTrigger.click()
                                  setTimeout(openAndScroll, 300)
                                } else {
                                  openAndScroll()
                                }
                              } else {
                                openAndScroll()
                              }

                              history.pushState(null, "", `#${day.id}`)
                            }}
                            key={day.id}
                          >
                            {isDayComplete(day.id) || (day.subModules.length > 0 && day.subModules.every(m => isSubModuleComplete(m.id))) ? (
                              <CheckCircle2
                                className="text-accent size-3.5 shrink-0 "
                                aria-hidden
                              />
                            ) : (
                              <span className="border-border group-hover:border-primary bg-card size-3.5 shrink-0 rounded-full border transition-colors" />
                            )}
                            <span className="min-w-0 flex-1 truncate">
                              {day.label}
                            </span>
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </nav>
        </div>
      </ScrollArea>
    </aside>
  )
}
