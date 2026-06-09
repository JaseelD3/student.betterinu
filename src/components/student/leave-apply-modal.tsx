"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, CalendarDays, CheckCircle2, Info } from "lucide-react"
import { toast } from "sonner"

import { LEAVE_REASON_CATEGORIES, type LeaveReasonCategory } from "@/lib/attendance/api"
import { useApplyLeave, useAttendanceHistory, useLeaveFineSettings } from "@/lib/hooks/use-attendance"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// ── helpers ───────────────────────────────────────────────────────────────────

const DAY_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

function countWorkingDays(start: string, end: string, weekendDays: string[]): number {
  const weekendIndexes = weekendDays.map((d) => DAY_INDEX[d.toLowerCase()] ?? -1)
  const startDate = new Date(start)
  const endDate = new Date(end)
  let count = 0
  const cur = new Date(startDate)
  while (cur <= endDate) {
    if (!weekendIndexes.includes(cur.getDay())) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function fmtMonthLabel(period: "monthly" | "yearly", date: Date): string {
  if (period === "monthly") {
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
  }
  return String(date.getFullYear())
}

// ── types ─────────────────────────────────────────────────────────────────────

type LeaveApplyModalProps = {
  year: number
  month: number
  onClose: () => void
}

// ── component ─────────────────────────────────────────────────────────────────

export function LeaveApplyModal({ year, month, onClose }: LeaveApplyModalProps) {
  const today = new Date()
  const todayStr = toDateStr(today)

  const [startDate, setStartDate] = useState(todayStr)
  const [endDate, setEndDate] = useState(todayStr)
  const [category, setCategory] = useState<LeaveReasonCategory | "">("")
  const [detailedReason, setDetailedReason] = useState("")
  const [declaration, setDeclaration] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { mutate, isPending } = useApplyLeave(year, month)
  const { data: fineSettings } = useLeaveFineSettings()
  const { data: historyData } = useAttendanceHistory(year, month)

  // ── working-day calculation ────────────────────────────────────────────────
  const weekendDays = fineSettings?.weekend_days ?? []
  const numDays = useMemo(() => {
    if (!startDate || !endDate || endDate < startDate) return 0
    return countWorkingDays(startDate, endDate, weekendDays)
  }, [startDate, endDate, weekendDays])

  // ── fine projection ────────────────────────────────────────────────────────
  const projectedFine = useMemo(() => {
    if (!fineSettings?.enabled || !numDays) return null
    const existingLeaveDays = historyData?.summary.leave ?? 0
    const freeQuota = fineSettings.free_leaves_per_period
    const perDayAmount = fineSettings.per_day_amount ?? fineSettings.fine_amount
    let total = 0
    for (let i = 0; i < numDays; i++) {
      const position = existingLeaveDays + i + 1
      if (position > freeQuota) total += perDayAmount
    }
    return { total, period: fmtMonthLabel(fineSettings.fine_period, new Date(startDate)) }
  }, [fineSettings, numDays, historyData, startDate])

  // ── validation ────────────────────────────────────────────────────────────
  const daysError =
    numDays === 0 && startDate && endDate && endDate >= startDate
      ? "The selected range contains no working days"
      : numDays > 30
        ? "Leave period cannot exceed 30 days"
        : null

  const canSubmit =
    !!startDate &&
    !!endDate &&
    endDate >= startDate &&
    !!category &&
    detailedReason.length >= 10 &&
    detailedReason.length <= 500 &&
    numDays >= 1 &&
    numDays <= 30 &&
    declaration &&
    !isPending

  // ── reset end date when start changes ────────────────────────────────────
  useEffect(() => {
    if (endDate < startDate) setEndDate(startDate)
  }, [startDate, endDate])

  // ── submit ────────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !category) return
    setServerError(null)

    mutate(
      {
        start_date: startDate,
        end_date: endDate,
        reason_category: category as LeaveReasonCategory,
        detailed_reason: detailedReason.trim(),
        declaration_acknowledged: true,
      },
      {
        onSuccess: () => {
          toast.success("Leave request submitted")
          onClose()
        },
        onError: (err) => {
          setServerError(err instanceof Error ? err.message : "Failed to submit")
        },
      }
    )
  }

  return (
    <Dialog open title="Apply for Leave" onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 pb-1">

        {/* Server error */}
        {serverError && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </p>
        )}

        {/* Dates row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="leave-start">Leave Start Date</Label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="leave-start"
                type="date"
                required
                min={todayStr}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="leave-end">Leave End Date</Label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="leave-end"
                type="date"
                required
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
        </div>

        {/* Number of days */}
        <div className="space-y-1.5">
          <Label>Number of Working Days</Label>
          <div
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
              daysError
                ? "border-destructive/40 bg-destructive/5 text-destructive"
                : numDays > 0
                  ? "border-primary/30 bg-primary/5 text-foreground"
                  : "border-input bg-muted/30 text-muted-foreground"
            )}
          >
            <span className="font-bold">{numDays}</span>
            <span className="text-muted-foreground">{numDays === 1 ? "day" : "days"} (weekends excluded)</span>
            {daysError && (
              <span className="ml-auto flex items-center gap-1 text-xs font-medium text-destructive">
                <AlertTriangle className="size-3" />
                {daysError}
              </span>
            )}
          </div>
        </div>

        {/* Fine projection */}
        {projectedFine !== null && numDays >= 1 && (
          <div
            className={cn(
              "flex items-start gap-2 rounded-md border px-3 py-2 text-xs",
              projectedFine.total > 0
                ? "border-amber-400/40 bg-amber-50/60 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                : "border-green-400/40 bg-green-50/60 text-green-700 dark:bg-green-900/20 dark:text-green-300"
            )}
          >
            {projectedFine.total > 0 ? (
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            ) : (
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
            )}
            <span>
              {projectedFine.total > 0
                ? `If this leave is approved, you will be fined ₹${projectedFine.total.toFixed(2)} for ${projectedFine.period}.`
                : `Projected fine: ₹0.00 — within your free leave quota.`}
            </span>
          </div>
        )}

        {/* Reason category */}
        <div className="space-y-1.5">
          <Label htmlFor="leave-category">Reason Category</Label>
          <select
            id="leave-category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value as LeaveReasonCategory)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          >
            <option value="" disabled>Select a category…</option>
            {LEAVE_REASON_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Detailed reason */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="leave-detail">Detailed Reason</Label>
            <span
              className={cn(
                "text-[11px] tabular-nums",
                detailedReason.length > 500
                  ? "text-destructive"
                  : detailedReason.length < 10 && detailedReason.length > 0
                    ? "text-amber-600"
                    : "text-muted-foreground"
              )}
            >
              {detailedReason.length}/500
            </span>
          </div>
          <textarea
            id="leave-detail"
            value={detailedReason}
            onChange={(e) => setDetailedReason(e.target.value)}
            rows={3}
            required
            minLength={10}
            maxLength={500}
            placeholder="Please describe your reason in detail (10–500 characters)…"
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          {detailedReason.length > 0 && detailedReason.length < 10 && (
            <p className="text-xs text-amber-600">Minimum 10 characters required</p>
          )}
        </div>

        {/* Declaration */}
        <div className="rounded-md border border-border bg-muted/30 p-3">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={declaration}
              onChange={(e) => setDeclaration(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              I confirm that the information provided is accurate and understand that I am responsible for catching up on any missed classes, assignments, or activities during my leave period.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit} className="flex-1">
            {isPending ? "Submitting…" : "Submit Request"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
