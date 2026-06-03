"use client"

import Link from "next/link"
import { CheckCircle2, Lock, LayoutList } from "lucide-react"
import type { Course } from "@/types"
import { useProgress } from "@/lib/hooks/useProgress"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { ChevronDown } from "lucide-react"

export function Sidebar({
  course,
  activeWeekId,
}: {
  course: Course
  activeWeekId?: string
}) {
  const { getCourseProgress, isDayComplete, isWeekUnlocked } = useProgress()
  const progress = getCourseProgress(course)

  return (
    <aside className="border-default sticky top-20 hidden h-[calc(100vh-5rem)] w-[430px] shrink-0 border-r lg:block">
      <ScrollArea className="h-full pr-8">
        {/* Course progress block */}
        <div className="border-default mb-5 overflow-hidden rounded-md border bg-white">
          <div className="border-primary bg-primary border-b px-4 py-3">
            <p className="text-primary-light text-[10px] font-bold tracking-widest uppercase">
              Course Progress
            </p>
            <p className="mt-0.5 truncate text-sm font-bold text-white">
              {course.title}
            </p>
          </div>
          {/* <div className="p-4">
            <div className="flex items-center justify-between mb-2 text-xs font-semibold">
              <span className="text-muted">Overall</span>
              <span className="text-primary font-bold">{progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-subtle overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: "var(--color-primary)" }}
              />
            </div>
          </div> */}
        </div>

        {/* Curriculum nav label */}
        <div className="text-muted mb-3 flex items-center gap-2 px-1 text-[11px] font-bold tracking-widest uppercase">
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
                  className={`overflow-hidden rounded-md border border-b transition-all ${active ? "border-primary bg-white" : "border-default hover:border-strong bg-white"}`}
                  key={week.id}
                >
                  <AccordionTrigger
                    disabled={!unlocked}
                    className="px-3 py-3 hover:no-underline [&>svg]:!hidden [&[data-state=open]>div>svg.sidebar-chevron]:rotate-180"
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
                          // Open main week accordion if closed
                          const weekEl = document.getElementById(week.id)
                          if (weekEl) {
                            const trigger = weekEl.querySelector(
                              'button[data-state="closed"]'
                            )
                            if (trigger) {
                              ;(trigger as HTMLElement).click()
                            }
                            weekEl.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            })
                          }
                          history.pushState(null, "", `#${week.id}`)
                        }}
                        className={`flex-1 cursor-pointer text-left text-xs leading-snug ${
                          unlocked
                            ? active
                              ? "text-primary font-bold"
                              : "text-foreground hover:text-primary font-semibold"
                            : "text-muted pointer-events-none font-semibold"
                        } focus-ring`}
                        href={`#${week.id}`}
                      >
                        {week.title.replace(":", " —")}
                      </a>
                      {unlocked ? (
                        <ChevronDown className="text-muted sidebar-chevron size-4 shrink-0 transition-transform duration-200" />
                      ) : (
                        <Lock
                          className="text-muted size-3 shrink-0"
                          aria-hidden
                        />
                      )}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="border-default border-t px-3 pt-0 pb-3">
                    <div className="mt-2.5 flex flex-col gap-0.5">
                      {week.days.map((day) => (
                        <a
                          className="group text-secondary hover:bg-subtle hover:text-foreground focus-ring flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-[11px] transition-colors"
                          href={`#${day.id}`}
                          onClick={(e) => {
                            e.preventDefault()

                            const openAndScroll = () => {
                              const dayEl = document.getElementById(day.id)
                              if (dayEl) {
                                // Open day accordion if it's closed
                                const dayTrigger = dayEl.querySelector(
                                  'button[data-state="closed"]'
                                ) as HTMLElement | null
                                if (dayTrigger) {
                                  dayTrigger.click()
                                  // Wait for animation then scroll
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

                            // First ensure the week accordion is open
                            const weekEl = document.getElementById(week.id)
                            if (weekEl) {
                              const weekTrigger = weekEl.querySelector(
                                'button[data-state="closed"]'
                              ) as HTMLElement | null
                              if (weekTrigger) {
                                weekTrigger.click()
                                // Wait for week to open then handle day
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
                          {isDayComplete(day.id) ? (
                            <CheckCircle2
                              className="text-success size-3.5 shrink-0 text-green-500"
                              aria-hidden
                            />
                          ) : (
                            <span className="border-strong group-hover:border-primary size-3.5 shrink-0 rounded-full border bg-white transition-colors" />
                          )}
                          <span className="min-w-0 flex-1 truncate font-medium">
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
      </ScrollArea>
    </aside>
  )
}
