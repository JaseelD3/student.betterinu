"use client"

import Link from "next/link"
import { AlertCircle, Clock, CreditCard } from "lucide-react"

import { useStudentFee } from "@/lib/hooks/useStudentFee"
import type { StudentInstallment } from "@/lib/services/student-fee-service"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function isUrgent(inst: StudentInstallment): boolean {
  if (inst.status === "paid" || inst.status === "waived") return false
  if (inst.status === "overdue") return true
  const due = new Date(inst.dueDate)
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  return due <= sevenDaysFromNow
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function FeeAlertCard() {
  const { data: enrollments, isLoading, isError } = useStudentFee()

  if (isLoading) {
    return (
      <Card className="py-0">
        <CardHeader className="border-b border-border px-4 py-3">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-2 px-4 py-4">
          <Skeleton className="h-14 w-full rounded-md" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="py-0">
        <CardContent className="px-4 py-4">
          <p className="text-sm text-destructive">
            Failed to load fee information.
          </p>
        </CardContent>
      </Card>
    )
  }

  const urgentInstallments = (enrollments ?? [])
    .flatMap((e) =>
      e.installments
        .filter(isUrgent)
        .map((inst) => ({ inst, courseTitle: e.courseTitle }))
    )
    .slice(0, 3) // show max 3

  // Nothing urgent — render nothing
  if (urgentInstallments.length === 0) return null

  return (
    <Card className="py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
          <CreditCard className="size-3.5 text-destructive" />
          Fee Alert
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 py-4">
        {urgentInstallments.map(({ inst, courseTitle }) => {
          const isOverdue = inst.status === "overdue"
          return (
            <div
              key={inst.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-md border p-3",
                isOverdue
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2.5">
                {isOverdue ? (
                  <AlertCircle className="size-4 shrink-0 text-destructive" />
                ) : (
                  <Clock className="size-4 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {fmtCurrency(inst.remainingBalance)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {courseTitle} · Due {fmtDate(inst.dueDate)}
                  </p>
                </div>
              </div>
              <Badge
                variant={isOverdue ? "destructive" : "secondary"}
                className="shrink-0 text-[10px]"
              >
                {isOverdue ? "Overdue" : "Due Soon"}
              </Badge>
            </div>
          )
        })}

        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/profile#fees">View All Fees</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
