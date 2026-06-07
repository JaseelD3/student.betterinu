"use client"

import { useState } from "react"
import { ClipboardCheck, Loader2, Timer, LogIn, LogOut } from "lucide-react"
import { toast } from "sonner"

import {
  usePunchIn,
  usePunchOut,
  useAttendanceStatus,
} from "@/lib/hooks/use-attendance"
import type { AttendanceStatus } from "@/lib/attendance/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function SingleAttendanceCard({ status, titleLabel }: { status: AttendanceStatus, titleLabel: string }) {
  const punchInMutation = usePunchIn()
  const punchOutMutation = usePunchOut()
  const loading = punchInMutation.isPending || punchOutMutation.isPending
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handlePunch() {
    if (!status) return
    if (status.punchedIn) {
      punchOutMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success("Punched out ✓")
          setConfirmOpen(false)
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Something went wrong"),
      })
    } else {
      punchInMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success("Attendance marked ✓")
          setConfirmOpen(false)
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Something went wrong"),
      })
    }
  }

  const isMarked = status?.hasMarkedAttendance || false
  const isPunchedIn = status?.punchedIn || false
  const isBlocked = status?.isBlocked || false

  // Glassmorphism base classes (Pending state)
  let cardBg = "bg-primary/90 dark:bg-primary/60 backdrop-blur-xl border border-white/20 dark:border-white/10  text-white"
  let iconBg = "bg-white/20 text-white "
  let buttonBg = "bg-white text-primary hover:bg-white/90 "
  let titleColor = "text-white/80"
  let subtitleColor = "text-white/80"

  if (isBlocked) {
    cardBg = "bg-card  backdrop-blur-xl border border-white/20 dark:border-white/10  text-slate-800 dark:text-slate-200"
    iconBg = "bg-slate-400/20 text-slate-600 dark:text-slate-300 "
    buttonBg = "bg-slate-300/50 text-slate-600 hover:bg-slate-300/70 dark:bg-slate-700 dark:text-slate-300"
    titleColor = "text-slate-600 dark:text-slate-400"
    subtitleColor = "text-slate-600 dark:text-slate-400"
  } else if (isMarked) {
    cardBg = "bg-accent dark:bg-accent/60  border border-white/20 dark:border-white/10  text-white"
    iconBg = "bg-white/20 text-white "
    titleColor = "text-emerald-100"
    subtitleColor = "text-emerald-100"
  } else if (isPunchedIn) {
    cardBg = "bg-amber-500/90 dark:bg-amber-500/60 backdrop-blur-xl border border-white/20 dark:border-white/10  text-white"
    iconBg = "bg-white/20 text-white "
    buttonBg = "bg-white/90 text-amber-600 hover:bg-white "
    titleColor = "text-amber-100/90"
    subtitleColor = "text-amber-100/90"
  }

  return (
    <>
      <Card className={cn("rounded-lg py-0 gap-5 overflow-hidden flex flex-col h-full", cardBg)}>
      <CardHeader className="px-5 py-5 pb-0">
        <CardTitle className={cn("flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase", titleColor)}>
          <ClipboardCheck className="size-4" />
          {titleLabel}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pb-6 pt-0 flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-6 flex-1">
          {/* Status display */}
          <div className="flex flex-1 flex-col items-center justify-center text-center gap-4">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-2xl",
                iconBg
              )}
            >
              {isPunchedIn || isMarked
                ? <ClipboardCheck className="size-5" />
                : <Timer className="size-5" />
              }
            </div>
            <div>
              <p className="text-lg font-bold">
                {isBlocked
                  ? (status.blockedReason ?? "Attendance disabled today")
                  : isPunchedIn
                    ? `Punched in at ${status.punchInTime ? fmtTime(status.punchInTime) : "—"}`
                    : isMarked
                      ? `Checked out at ${status.punchOutTime ? fmtTime(status.punchOutTime) : "—"}`
                      : "Not marked yet"}
              </p>
              <p className={cn("text-xs font-medium mt-0.5", subtitleColor)}>
                {isBlocked
                  ? "Attendance is closed today"
                  : isPunchedIn
                    ? "You're marked present"
                    : isMarked
                      ? "Attendance complete for today"
                      : "Punch in to mark attendance"}
              </p>
            </div>
          </div>

          {/* Punch button */}
          {!isMarked && !isBlocked && (
            <div className="mt-auto">
              <Button
                size="lg"
                onClick={() => setConfirmOpen(true)}
                disabled={loading}
                className={cn("w-full gap-2 rounded-lg font-bold py-6 text-sm", buttonBg)}
              >
                {loading
                  ? <Loader2 className="size-4 animate-spin" />
                  : isPunchedIn
                    ? <LogOut className="size-4" />
                    : <LogIn className="size-4" />
                }
                {isPunchedIn ? "Punch Out" : "Punch In"}
              </Button>
            </div>
          )}

          {isMarked && (
            <div className="mt-auto rounded-md bg-black/10 dark:bg-black/20 px-4 py-3 text-center">
              <p className="text-sm font-bold">
                ✓ Attendance Complete
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    <Dialog
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      title="Attendance Confirmation"
      size="sm"
    >
      <div className="py-2 flex flex-col items-center text-center text-foreground">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <ClipboardCheck className="size-6 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">
          {isPunchedIn ? "Punch Out" : "Punch In"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to {isPunchedIn ? "punch out" : "punch in"} for today's attendance?
        </p>
        <div className="mt-6 flex w-full gap-3">
          <Button
            className="flex-1 text-red-500 bg-background hover:bg-background/70 hover:text-red-300 border border-border"
            onClick={() => setConfirmOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePunch}
            disabled={loading}
            className="flex-1 gap-2"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
    </>
  )
}

export function DashboardAttendanceCard() {
  const { data: status, isLoading } = useAttendanceStatus()

  if (isLoading) {
    return (
      <Card className="rounded-lg h-full min-h-[180px] py-0 gap-5 overflow-hidden flex flex-col bg-card border-border/50">
        <CardHeader className="px-5 py-5 pb-0">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="px-5 pb-6 pt-0 flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex flex-1 flex-col items-center justify-center text-center gap-4">
              <Skeleton className="size-10 rounded-2xl" />
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="mt-auto">
              <Skeleton className="w-full h-12 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card className="rounded-lg h-[180px] flex flex-col items-center justify-center bg-card shadow-sm border-none gap-2">
        <p className="text-sm font-semibold text-muted-foreground">Unable to load attendance</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <SingleAttendanceCard titleLabel="Today's Attendance" status={status} />
    </div>
  )
}
