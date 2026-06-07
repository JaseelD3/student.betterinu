"use client"

import { useState } from "react"
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Info,
  Plus,
  StickyNote,
  Timer,
  XCircle,
  CalendarCheck,
} from "lucide-react"

import type { DayRecord, DayStatus } from "@/lib/attendance/api"
import {
  useAttendanceHistory,
  useLeaveRequests,
} from "@/lib/hooks/use-attendance"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LeaveApplyModal } from "@/components/student/leave-apply-modal"

// ── Constants ─────────────────────────────────────────────────────────────────

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

type StatusCfg = {
  tile: string
  badge: string
  dot: string
  label: string
  Icon: React.ElementType
}

const STATUS_CFG: Record<DayStatus, StatusCfg> = {
  present: {
    tile: "bg-att-present/10 text-att-present-fg border-att-present-fg/20 hover:bg-att-present/30",
    badge: "bg-att-present/15 text-att-present-fg border-att-present-fg/30",
    dot: "bg-att-present-fg",
    label: "Present",
    Icon: CheckCircle2,
  },
  late: {
    tile: "bg-att-late/20 text-att-late-fg border-att-late-fg/20 hover:bg-att-late/30",
    badge: "bg-att-late/20 text-att-late-fg border-att-late-fg/30",
    dot: "bg-att-late-fg",
    label: "Late",
    Icon: Timer,
  },
  early_checkout: {
    tile: "bg-att-early-checkout/20 text-att-early-checkout-fg border-att-early-checkout-fg/20 hover:bg-att-early-checkout/30",
    badge: "bg-att-early-checkout/20 text-att-early-checkout-fg border-att-early-checkout-fg/30",
    dot: "bg-att-early-checkout-fg",
    label: "Early Checkout",
    Icon: Timer,
  },
  half_day: {
    tile: "bg-att-half-day/20 text-att-half-day-fg border-att-half-day-fg/20 hover:bg-att-half-day/30",
    badge: "bg-att-half-day/20 text-att-half-day-fg border-att-half-day-fg/30",
    dot: "bg-att-half-day-fg",
    label: "Half Day",
    Icon: CheckCircle2,
  },
  absent: {
    tile: "bg-att-absent/20 text-att-absent-fg border-att-absent-fg/20 hover:bg-att-absent/30",
    badge: "bg-att-absent/15 text-att-absent-fg border-att-absent-fg/30",
    dot: "bg-att-absent-fg",
    label: "Absent",
    Icon: XCircle,
  },
  leave: {
    tile: "bg-att-leave/20 text-att-leave-fg border-att-leave-fg/20 hover:bg-att-leave/30",
    badge: "bg-att-leave/20 text-att-leave-fg border-att-leave-fg/30",
    dot: "bg-att-leave-fg",
    label: "Leave",
    Icon: Info,
  },
  holiday: {
    tile: "bg-att-holiday/20 text-att-holiday-fg border-att-holiday-fg/20 hover:bg-att-holiday/30",
    badge: "bg-att-holiday/20 text-att-holiday-fg border-att-holiday-fg/30",
    dot: "bg-att-holiday-fg",
    label: "Holiday",
    Icon: CalendarCheck,
  },
  open: {
    tile: "bg-att-late/20 text-att-late-fg border-att-late-fg/20 animate-pulse hover:bg-att-late/30",
    badge: "bg-att-late/20 text-att-late-fg border-att-late-fg/30",
    dot: "bg-att-late-fg",
    label: "Open",
    Icon: Timer,
  },
  pending_leave: {
    tile: "bg-att-pending-leave/20 text-att-pending-leave-fg border-att-pending-leave-fg/20 border-dashed hover:bg-att-pending-leave/30",
    badge: "bg-att-pending-leave/20 text-att-pending-leave-fg border-att-pending-leave-fg/30",
    dot: "bg-att-pending-leave-fg",
    label: "Pending Leave",
    Icon: Clock,
  },
  future: {
    tile: "bg-att-future/20 text-att-future-fg border-att-future-fg/15 opacity-40",
    badge: "bg-att-future/20 text-att-future-fg border-att-future-fg/30",
    dot: "bg-att-future-fg",
    label: "—",
    Icon: CalendarDays,
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtTime(iso: string | null | undefined) {
  if (!iso) return "—"
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// ── Sub-components ────────────────────────────────────────────────────────────

type DayDetailProps = { day: DayRecord }

function DayDetail({ day }: DayDetailProps) {
  const cfg = STATUS_CFG[day.status]
  const StatusIcon = cfg.Icon

  return (
    <Card className="py-0 bg-card gap-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
          Day Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pt-3 pb-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Date
          </p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {fmtDate(day.date)}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Status
          </p>
          <span
            className={cn(
              "mt-1 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold uppercase",
              cfg.badge
            )}
          >
            <StatusIcon className="size-3" />
            {cfg.label}
          </span>
        </div>

        {day.punchIn && (
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Punch In
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-foreground">
                  <Clock className="size-3.5 text-primary" />
                  {fmtTime(day.punchIn)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Punch Out
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-foreground">
                  <Clock className="size-3.5 text-muted-foreground" />
                  {day.punchOut ? fmtTime(day.punchOut) : "Active"}
                </p>
              </div>
            </div>
            {day.duration && (
              <div className="mt-2 border-t border-border pt-2">
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Duration
                </p>
                <p className="mt-0.5 text-xs font-semibold text-foreground">
                  {day.duration}
                </p>
              </div>
            )}
          </div>
        )}

        {day.note && (
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <p className="mb-1 flex items-center gap-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              <StickyNote className="size-3" /> Admin Note
            </p>
            <p className="text-xs leading-relaxed text-foreground">
              {day.note}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function AttendanceClient() {
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  )
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [selectedDay, setSelectedDay] = useState<DayRecord | null>(null)
  const [applyModalOpen, setApplyModalOpen] = useState(false)

  const { data, isLoading } = useAttendanceHistory(year, month)
  const { data: leaveRequests = [] } = useLeaveRequests(year, month)

  // Auto-select today when data loads
  const days = data?.days ?? []
  const summary = data?.summary
  const displayDay =
    selectedDay ??
    days.find(
      (d) =>
        d.date ===
        `${year}-${String(month).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    ) ??
    days[0] ??
    null

  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth() + 1

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <CalendarDays className="size-5 text-primary" />
            My Attendance
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Monthly punch-in history, holidays, and leave records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
            <Button variant="ghost" size="icon" className="size-7" onClick={prevMonth}>
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[120px] text-center text-sm font-semibold text-foreground">
              {MONTH_NAMES[month - 1]} {year}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={isCurrentMonth}
              onClick={nextMonth}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <Button
            size="lg"
            onClick={() => setApplyModalOpen(true)}
            className="gap-1.5"
          >
            <Plus className="size-3.5" />
            Apply for Leave
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Calendar + Legend */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {/* Legend Skeleton */}
            <Card className="py-0 bg-card">
              <CardContent className="flex flex-wrap items-center justify-center gap-3 px-4 py-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Skeleton className="size-3 rounded" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Calendar Skeleton */}
            <Card className="py-0 bg-card overflow-hidden flex-1">
              <CardContent className="p-4">
                {/* Weekdays */}
                <div className="mb-3 grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex justify-center py-1.5">
                      <Skeleton className="h-3.5 w-8" />
                    </div>
                  ))}
                </div>
                {/* Grid cells */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-md" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            {/* Day Detail Skeleton */}
            <Card className="py-0 bg-card gap-0">
              <CardHeader className="border-b border-border px-4 py-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-4 px-4 pt-3 pb-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-7 w-20 rounded-md" />
                </div>
                <Skeleton className="h-20 w-full rounded-md" />
              </CardContent>
            </Card>

            {/* Monthly Stats Skeleton */}
            <Card className="py-0 bg-card gap-0 flex-1">
              <CardHeader className="border-b border-border px-4 py-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-4 px-4 pt-3 pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-md" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Calendar + Legend */}
          <div className="order-2 flex flex-col gap-4 lg:order-1 lg:col-span-2">
            {/* Legend */}
            <Card className="py-0 bg-card">
              <CardContent className="flex flex-wrap items-center justify-center gap-3 px-4 py-3 text-[11px] text-muted-foreground">
                {(
                  [
                    "present",
                    "late",
                    "early_checkout",
                    "half_day",
                    "absent",
                    "leave",
                    "pending_leave",
                    "holiday",
                  ] as DayStatus[]
                ).map((s) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-block size-3 rounded border-2",
                        STATUS_CFG[s].tile.split(" ").slice(0, 3).join(" ")
                      )}
                    />
                    {STATUS_CFG[s].label}
                  </span>
                ))}
                <div className="mx-1 h-3.5 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  {/* <div className="relative size-3 rounded border-2 border-border bg-muted/20"> */}
                    <span className=" size-1.5 rounded-full bg-muted-foreground/60" />
                  {/* </div> */}
                  Note Attached
                </span>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card className="py-0 bg-card overflow-hidden flex-1">
              <CardContent className="p-4">
                {/* Weekday headers */}
                <div className="mb-3 grid grid-cols-7 text-center text-[11px] font-semibold text-muted-foreground">
                  {WEEKDAYS.map((w) => (
                    <div key={w} className="py-1.5">{w}</div>
                  ))}
                </div>

                {/* Day tiles */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: offset }).map((_, i) => (
                    <div key={`off-${i}`} className="aspect-square" />
                  ))}

                  <TooltipProvider>
                    {days.map((day) => {
                      const dayNum = parseInt(day.date.split("-")[2], 10)
                      const cfg = STATUS_CFG[day.status]
                      const isSelected = displayDay?.date === day.date
                      const isToday = day.date === todayStr

                      const tile = (
                        <button
                          key={day.date}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={cn(
                            "relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-md border md:border-2 text-xs font-semibold transition-all att-glass backdrop-blur-sm shadow-sm",
                            cfg.tile,
                            isToday && "outline outline-1 outline-primary outline-offset-2",
                            isSelected && "ring-2 ring-primary ring-offset-2 scale-105 z-10"
                          )}
                        >
                          <span>{dayNum}</span>
                          {day.status !== "future" && (
                            <span
                              className={cn(
                                "absolute bottom-0.5 md:bottom-1 size-0.5 md:size-1 rounded-full",
                                cfg.dot
                              )}
                            />
                          )}
                          {day.note && day.status !== "future" && (
                            <span className="absolute right-0.5 top-0.5 md:right-1 md:top-1 size-1 md:size-1.5 rounded-full bg-muted-foreground/60" />
                          )}
                        </button>
                      )

                      return day.note && day.status !== "future" ? (
                        <Tooltip key={day.date}>
                          <TooltipTrigger asChild>{tile}</TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[180px] text-center text-xs">
                            {day.note}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        tile
                      )
                    })}
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="order-1 flex flex-col gap-4 lg:order-2 lg:col-span-1">
            {/* Day detail */}
            {displayDay && <DayDetail day={displayDay} />}

            {/* Monthly stats */}
            {summary && (
              <Card className={cn("py-0 bg-card gap-0", leaveRequests.length === 0 && "flex-1")}>
                <CardHeader className="border-b border-border px-4 py-3">
                  <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                    Monthly Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-4 pt-3 pb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="relative flex size-14 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(var(--primary) ${summary.percentage}%, var(--border) 0)`
                      }}
                    >
                      <div className="absolute inset-[3.5px] rounded-full bg-card flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {summary.percentage}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        Attendance Score
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Half Day counts as 0.5
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { label: "Present", value: summary.present, status: "present" as DayStatus },
                      { label: "Late", value: summary.late, status: "late" as DayStatus },
                      { label: "Early Checkout", value: summary.earlyCheckout, status: "early_checkout" as DayStatus },
                      { label: "Half Day", value: summary.halfDay, status: "half_day" as DayStatus },
                      { label: "Absent", value: summary.absent, status: "absent" as DayStatus },
                      { label: "Leave", value: summary.leave, status: "leave" as DayStatus },
                    ].map(({ label, value, status }) => (
                      <div
                        key={label}
                        className={cn(
                          "rounded-md border p-2.5",
                          STATUS_CFG[status].tile.split(" ").slice(0, 2).join(" ")
                        )}
                      >
                        <span className="block text-muted-foreground">
                          {label}
                        </span>
                        <span className="mt-0.5 block text-sm font-bold">
                          {value} Days
                        </span>
                      </div>
                    ))}
                    <div
                      className={cn(
                        "col-span-2 rounded-md border p-2.5",
                        STATUS_CFG.holiday.tile.split(" ").slice(0, 2).join(" ")
                      )}
                    >
                      <span className="block text-muted-foreground">
                        Holidays
                      </span>
                      <span className="mt-0.5 block text-sm font-bold">
                        {summary.holiday} Days
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leave requests */}
            {leaveRequests.length > 0 && (
              <Card className="py-0 bg-card gap-0 flex-1">
                <CardHeader className="border-b border-border px-4 py-3">
                  <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                    My Leave Requests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 px-4 pt-3 pb-4">
                  {leaveRequests.map((lr) => (
                    <div
                      key={lr.id}
                      className="flex items-start justify-between gap-3 rounded-md border border-border bg-muted/40 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground">
                          {new Date(lr.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {lr.reason}
                        </p>
                        {lr.admin_note && (
                          <p className="mt-0.5 text-[10px] italic text-muted-foreground">
                            "{lr.admin_note}"
                          </p>
                        )}
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded border px-2 py-0.5 text-[10px] font-bold uppercase",
                          lr.status === "pending" &&
                          "bg-att-pending-leave text-att-pending-leave-fg border-att-pending-leave-fg/30",
                          lr.status === "approved" &&
                          "bg-att-present text-att-present-fg border-att-present-fg/30",
                          lr.status === "rejected" &&
                          "bg-att-absent text-att-absent-fg border-att-absent-fg/30"
                        )}
                      >
                        {lr.status}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {applyModalOpen && (
        <LeaveApplyModal
          year={year}
          month={month}
          onClose={() => setApplyModalOpen(false)}
        />
      )}
    </div>
  )
}
