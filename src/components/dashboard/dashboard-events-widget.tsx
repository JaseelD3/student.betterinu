"use client"

import { useState } from "react"
import { CalendarDays, MapPin, Clock, Sparkles, X } from "lucide-react"

import { useEvents } from "@/lib/hooks/use-events"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

function fmtDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    day: d.toLocaleDateString("en-IN", { day: "numeric" }),
    month: d.toLocaleDateString("en-IN", { month: "short" }),
    weekday: d.toLocaleDateString("en-IN", { weekday: "short" }),
    full: d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  }
}

function fmtTime(timeStr: string | null) {
  if (!timeStr) return null
  const [h, m] = timeStr.split(":").map(Number)
  const d = new Date()
  d.setHours(h, m)
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
}

type Event = {
  id: string
  title: string
  description: string | null
  date: string
  time: string | null
  location: string | null
}

const ACCENT_COLORS = [
  { dateBg: "bg-violet-50 dark:bg-violet-950/40", dateText: "text-violet-700 dark:text-violet-400", border: "border-l-violet-400", iconBg: "bg-violet-500/10", iconColor: "text-violet-600" },
  { dateBg: "bg-sky-50 dark:bg-sky-950/40", dateText: "text-sky-700 dark:text-sky-400", border: "border-l-sky-400", iconBg: "bg-sky-500/10", iconColor: "text-sky-600" },
  { dateBg: "bg-emerald-50 dark:bg-emerald-950/40", dateText: "text-emerald-700 dark:text-emerald-400", border: "border-l-emerald-400", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600" },
  { dateBg: "bg-amber-50 dark:bg-amber-950/40", dateText: "text-amber-700 dark:text-amber-400", border: "border-l-amber-400", iconBg: "bg-amber-500/10", iconColor: "text-amber-600" },
  { dateBg: "bg-rose-50 dark:bg-rose-950/40", dateText: "text-rose-700 dark:text-rose-400", border: "border-l-rose-400", iconBg: "bg-rose-500/10", iconColor: "text-rose-600" },
]

function EventDetailDialog({ event, colorIdx, open, onClose }: { event: Event; colorIdx: number; open: boolean; onClose: () => void }) {
  const color = ACCENT_COLORS[colorIdx % ACCENT_COLORS.length]
  const { full } = fmtDate(event.date)
  const time = fmtTime(event.time)

  return (
    <Dialog open={open} onClose={onClose} title={event.title} size="sm">
      <div className="flex flex-col gap-4">
        {/* Date + Time + Location */}
        <div className={cn("flex items-center gap-3 rounded-lg p-3", color.dateBg)}>
          <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", color.iconBg)}>
            <CalendarDays className={cn("size-5", color.iconColor)} />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className={cn("text-xs font-semibold", color.dateText)}>{full}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
              {time && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  {time}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="size-3" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Description</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No description provided.</p>
        )}
      </div>
    </Dialog>
  )
}

export function DashboardEventsWidget() {
  const { data, isLoading } = useEvents()
  const events = (data?.events ?? []).slice(0, 2)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  return (
    <>
      <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg py-0 gap-2 overflow-hidden flex flex-col bg-white dark:bg-card">
        <CardHeader className="px-5 py-4 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
              <CalendarDays className="size-3.5 text-violet-500" />
              Upcoming Events
            </CardTitle>

          </div>
        </CardHeader>

        <CardContent className="px-4 pb-3 pt-0 flex flex-col gap-2">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-2 pb-4 pt-2">
              <p className="text-xs font-semibold text-foreground">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event, idx) => {
                const color = ACCENT_COLORS[idx % ACCENT_COLORS.length]
                const { day, month, weekday } = fmtDate(event.date)
                const time = fmtTime(event.time)
                return (
                  <button
                    key={event.id}
                    onClick={() => setSelectedIdx(idx)}
                    className={cn(
                      "w-full text-left flex items-start gap-3 rounded-md border border-border bg-muted/40 p-3 transition-colors hover:bg-muted/70 cursor-pointer"
                    )}
                  >
                    {/* Date badge */}
                    <div className={cn("flex flex-col items-center justify-center rounded-md px-4 py-1 min-w-[40px]", color.dateBg)}>
                      <span className={cn("text-[10px] font-bold uppercase", color.dateText)}>{month}</span>
                      <span className={cn("text-base font-extrabold leading-none", color.dateText)}>{day}</span>
                      <span className={cn("text-[9px] font-medium", color.dateText)}>{weekday}</span>
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-foreground">{event.title}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        {time && (
                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            <Clock className="size-2.5" />
                            {time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            <MapPin className="size-2.5" />
                            <span className="truncate max-w-[120px]">{event.location}</span>
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="mt-1 text-[10px] text-muted-foreground line-clamp-1">{event.description}</p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      {selectedIdx !== null && events[selectedIdx] && (
        <EventDetailDialog
          event={events[selectedIdx]}
          colorIdx={selectedIdx}
          open={selectedIdx !== null}
          onClose={() => setSelectedIdx(null)}
        />
      )}
    </>
  )
}
