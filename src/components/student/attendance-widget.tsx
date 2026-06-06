"use client"

import { ClipboardCheck, Loader2, Timer } from "lucide-react"
import { toast } from "sonner"

import {
  useAttendanceStatus,
  usePunchIn,
  usePunchOut,
} from "@/lib/hooks/use-attendance"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function AttendanceWidget() {
  const { data: status, isLoading } = useAttendanceStatus()
  const punchInMutation = usePunchIn()
  const punchOutMutation = usePunchOut()

  const loading = punchInMutation.isPending || punchOutMutation.isPending

  function handlePunch() {
    if (!status) return
    if (status.punchedIn) {
      punchOutMutation.mutate(undefined, {
        onSuccess: () => toast.success("Punched out ✓"),
        onError: (e) =>
          toast.error(e instanceof Error ? e.message : "Something went wrong"),
      })
    } else {
      punchInMutation.mutate(undefined, {
        onSuccess: () => toast.success("Attendance marked ✓"),
        onError: (e) => {
          const msg = e instanceof Error ? e.message : "Something went wrong"
          toast.error(
            msg.includes("409") ? "Already punched in today" : msg
          )
        },
      })
    }
  }

  if (isLoading) {
    return <Skeleton className="mb-6 h-[72px] w-full rounded-md" />
  }

  if (!status) return null

  const { punchedIn, hasMarkedAttendance, punchInTime, isBlocked, blockedReason } =
    status
  const isMarked = hasMarkedAttendance && !punchedIn

  const formattedTime = punchInTime
    ? new Date(punchInTime).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""

  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between",
        isBlocked
          ? "border-border bg-muted/40"
          : punchedIn || isMarked
            ? "border-primary/30 bg-primary/5"
            : "border-secondary-foreground/20 bg-secondary/30"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            isBlocked
              ? "bg-muted text-muted-foreground"
              : punchedIn || isMarked
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-secondary-foreground"
          )}
        >
          {punchedIn || isMarked ? (
            <ClipboardCheck className="size-5" />
          ) : (
            <Timer className="size-5" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isBlocked
              ? (blockedReason ?? "Attendance is disabled for today.")
              : punchedIn
                ? `Attendance marked ✓ · Punched in at ${formattedTime}`
                : isMarked
                  ? `Attendance marked ✓ · Punched in at ${formattedTime}`
                  : "You haven't marked attendance yet today."}
          </p>
          {!punchedIn && !isMarked && !isBlocked && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Please punch in to record your attendance.
            </p>
          )}
        </div>
      </div>

      {!isMarked && !isBlocked && (
        <Button
          onClick={handlePunch}
          disabled={loading}
          variant={punchedIn ? "outline" : "default"}
          size="sm"
          className="shrink-0"
        >
          {loading && <Loader2 className="mr-1.5 size-4 animate-spin" />}
          {punchedIn ? "Punch Out" : "Punch In"}
        </Button>
      )}
    </div>
  )
}
