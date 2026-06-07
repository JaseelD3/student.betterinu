"use client"

import { AlertCircle, CreditCard } from "lucide-react"
import { useStudentFee } from "@/lib/hooks/useStudentFee"

import { ReminderBanners } from "./reminder-banners"
import { PaymentSummaryStrip } from "./payment-summary-strip"
import { EnrollmentCard } from "./enrollment-card"
import { FineHistoryCard } from "../../attendance/_components/fine-history-card"
// ─── Skeleton ─────────────────────────────────────────────────────────────────

function FeesSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-20 rounded-md bg-muted" />
      <div className="h-14 rounded-md bg-muted" />
      <div className="h-56 rounded-md bg-muted" />
    </div>
  )
}

// ─── FeesClient ───────────────────────────────────────────────────────────────

export function FeesClient() {
  const { data: enrollments, isLoading, error } = useStudentFee()

  return (
    <div className="flex flex-col gap-5">

      {/* Page header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Fees
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your fee plan, installment schedule, and payment history.
        </p>
      </div>

      {isLoading ? (
        <FeesSkeleton />
      ) : error ? (
        <div className="flex items-center gap-2.5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          Failed to load fee information. Please try again.
        </div>
      ) : !enrollments || enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-card py-20 text-center">
          <div className="flex size-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <CreditCard className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">No fee records</p>
            <p className="mt-1 text-sm text-muted-foreground">
              No fee plans have been assigned to your account yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Fee Content (Left 2/3) */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <ReminderBanners enrollments={enrollments} />
            <PaymentSummaryStrip enrollments={enrollments} />
            {enrollments.map((enr) => (
              <EnrollmentCard key={enr.enrollmentId} enrollment={enr} />
            ))}
          </div>

          {/* Fines Section (Right 1/3, Sticky) */}
          <div id="fines" className="lg:col-span-1 relative">
            <div className="sticky top-2 h-[400px] lg:h-[calc(100vh-6rem)]">
              <FineHistoryCard />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}