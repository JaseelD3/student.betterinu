"use client"

import { CheckCircle2, Lock, LayoutList, Loader2 } from "lucide-react"
import { ChevronDown } from "lucide-react"
import type { Week } from "@/types"
import type { WeekStub } from "@/lib/api-client"
import { useProgress } from "@/lib/hooks/useProgress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

// ─── skeleton shown while a week is loading ───────────────────────────────────
function DayListSkeleton() {
  return (
    <div className="mt-2 flex flex-col gap-0.5 animate-pulse" aria-hidden>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="flex items-center gap-2 rounded-sm px-2 py-1.5"
        >
          <span className="size-3.5 shrink-0 rounded-full bg-muted" />
          <span className="h-2.5 w-4/5 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export function Sidebar({
  courseId,
  weekStubs,
  weekCache,
  loadingWeekId,
  activeWeekId,
  onWeekExpand,
}: {
  courseId: string
  weekStubs: WeekStub[]
  weekCache: Record<string, Week>
  loadingWeekId: string | null
  activeWeekId?: string
  onWeekExpand: (weekId: string) => void
}) {
  const { isDayComplete, isSubModuleComplete } = useProgress()

  return (
    <aside className="border-border-strong sticky top-0 hidden h-[calc(100vh-3.5rem)] w-[360px] shrink-0 border-r-2 lg:block">
      <ScrollArea className="h-full">
        <div className="px-5 pt-5 pb-5">
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
              onValueChange={(value) => {
                // value is the weekId being opened (or "" when collapsing)
                if (value && !weekCache[value]) {
                  onWeekExpand(value)
                }
              }}
            >
              {weekStubs.map((stub) => {
                const unlocked = !stub.is_locked
                const active = activeWeekId === stub.id
                const week = weekCache[stub.id] ?? null
                const isLoading = loadingWeekId === stub.id

                return (
                  <AccordionItem
                    value={stub.id}
                    className={cn(
                      "border-border bg-card overflow-hidden rounded-sm border transition-all",
                      active && "border-primary/40"
                    )}
                    key={stub.id}
                  >
                    <AccordionTrigger
                      disabled={!unlocked}
                      className="px-3 py-2.5 hover:no-underline [&>svg]:!hidden [&[data-state=open]>div>svg.sidebar-chevron]:rotate-180"
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span
                          className={cn(
                            "flex-1 text-left text-xs leading-snug font-semibold",
                            unlocked
                              ? active
                                ? "text-primary font-bold"
                                : "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {stub.title.replace(":", " —")}
                        </span>

                        {isLoading ? (
                          <Loader2 className="text-muted-foreground size-3.5 shrink-0 animate-spin" />
                        ) : unlocked ? (
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
                      {isLoading || !week ? (
                        <DayListSkeleton />
                      ) : (
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

                                const weekEl = document.getElementById(stub.id)
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
                              {isDayComplete(day.id) ||
                              (day.subModules.length > 0 &&
                                day.subModules.every((m) =>
                                  isSubModuleComplete(m.id)
                                )) ? (
                                <CheckCircle2
                                  className="text-accent size-3.5 shrink-0"
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
                      )}
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
