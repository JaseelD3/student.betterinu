"use client"

import { ClipboardCheck, Loader2, Timer } from "lucide-react"
import { toast } from "sonner"

import {
  useAttendanceStatus,
  usePunchIn,
  usePunchOut,
} from "@/lib/hooks/use-attendance"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function AttendanceCard() {
  const { data: status, isLoading, isError } = useAttendanceStatus()
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
        onError: (e) =>
          toast.error(e instanceof Error ? e.message : "Something went wrong"),
      })
    }
  }

  return (
    <Card className="py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
          <ClipboardCheck className="size-3.5 text-primary" />
          Today's Attendance  
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">
            Failed to load attendance.
          </p>
        ) : !status ? null : (
          <div className="space-y-4">
            {/* Status badge */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full",
                  status.isBlocked
                    ? "bg-muted text-muted-foreground"
                    : status.punchedIn || status.hasMarkedAttendance
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-secondary-foreground"
                )}
              >
                {status.punchedIn || status.hasMarkedAttendance ? (
                  <ClipboardCheck className="size-5" />
                ) : (
                  <Timer className="size-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {status.isBlocked
                    ? (status.blockedReason ?? "Attendance disabled today")
                    : status.punchedIn
                      ? `Punched in at ${status.punchInTime ? fmtTime(status.punchInTime) : "—"}`
                      : status.hasMarkedAttendance
                        ? `Marked · ${status.punchInTime ? fmtTime(status.punchInTime) : ""}`
                        : "Not marked yet"}
                </p>
                {!status.punchedIn && !status.hasMarkedAttendance && !status.isBlocked && (
                  <p className="text-xs text-muted-foreground">
                    Punch in to record attendance
                  </p>
                )}
              </div>
            </div>

            {/* Status badge row */}
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  status.isBlocked
                    ? "secondary"
                    : status.punchedIn
                      ? "default"
                      : status.hasMarkedAttendance
                        ? "default"
                        : "outline"
                }
                className="text-[10px]"
              >
                {status.isBlocked
                  ? "Blocked"
                  : status.punchedIn
                    ? "Present"
                    : status.hasMarkedAttendance
                      ? "Checked Out"
                      : "Absent"}
              </Badge>

              {!status.hasMarkedAttendance && !status.isBlocked && (
                <Button
                  size="sm"
                  variant={status.punchedIn ? "outline" : "default"}
                  onClick={handlePunch}
                  disabled={loading}
                  className="gap-1.5"
                >
                  {loading && <Loader2 className="size-3.5 animate-spin" />}
                  {status.punchedIn ? "Punch Out" : "Punch In"}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
