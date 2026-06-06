"use client"

import { AlertCircle, CreditCard } from "lucide-react"
import { useStudentFee } from "@/lib/hooks/useStudentFee"

import { FeeOverviewCard } from "./fee-overview-card"
import { PaymentSummaryStrip } from "./payment-summary-strip"
import { EnrollmentCard } from "./enrollment-card"
import { ReminderBanners } from "./reminder-banners"

function FeesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-36 rounded-md bg-muted" />
      <div className="h-24 rounded-md bg-muted" />
      <div className="h-64 rounded-md bg-muted" />
    </div>
  )
}

export function FeesClient() {
  const { data: enrollments, isLoading, error } = useStudentFee()

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          My Fees
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          View your fee plan, installment schedule, and payment history.
        </p>
      </div>

      {isLoading ? (
        <FeesSkeleton />
      ) : error ? (
        <div className="flex items-center gap-2 rounded-md border border-status-rejected/30 bg-status-rejected/10 px-4 py-3 text-sm text-status-rejected-foreground">
          <AlertCircle className="size-4 shrink-0" />
          Failed to load fee information. Please try again.
        </div>
      ) : !enrollments || enrollments.length === 0 ? (
        <div className="border-default flex flex-col items-center gap-3 rounded-md border border-dashed bg-card py-20 text-center shadow-sm">
          <CreditCard size={40} className="text-muted-foreground" />
          <div>
            <p className="font-semibold text-foreground">No fee records</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              No fee plans have been assigned to your account yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Reminder banners */}
          <ReminderBanners enrollments={enrollments} />

          {/* Fee Overview */}
          {/* <FeeOverviewCard enrollments={enrollments} /> */}

          {/* Payment Summary Strip */}
          <PaymentSummaryStrip enrollments={enrollments} />

          {/* Per-enrollment cards */}
          {enrollments.map((enr) => (
            <EnrollmentCard key={enr.enrollmentId} enrollment={enr} />
          ))}
        </div>
      )}
    </div>
  )
}
