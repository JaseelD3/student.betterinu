"use client"

import Link from "next/link"
import {
  AlertCircle,
  CreditCard,
  Receipt,
  TrendingDown,
  CheckCircle2,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useStudentFee } from "@/lib/hooks/useStudentFee"
import type { FeeInstalment } from "@/types/fee"

function fmtCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getNextInstalment(
  instalments: FeeInstalment[]
): FeeInstalment | null {
  return (
    instalments
      .filter((i) => i.status === "pending")
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )[0] ?? null
  )
}

function getOverdueInstalments(
  instalments: FeeInstalment[]
): FeeInstalment[] {
  return instalments.filter((i) => i.status === "overdue")
}

export function FeePaymentsSection() {
  const { data: feeDetail, isLoading, isError } = useStudentFee()

  const firstEnrollment = feeDetail?.[0]

  const totalPaid = firstEnrollment?.paidAmount ?? 0
  const totalOutstanding = firstEnrollment?.outstandingBalance ?? 0
  const installmentsRaw = firstEnrollment?.installments ?? []
  const instalments: FeeInstalment[] = installmentsRaw.map((inst) => ({
    id: inst.id,
    amount: inst.totalAmount,
    dueDate: inst.dueDate,
    status: (inst.status === "overdue" ? "overdue" : inst.status === "paid" ? "paid" : "pending"),
  }))
  const nextInstalment = getNextInstalment(instalments)
  const overdueList = getOverdueInstalments(instalments)

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-foreground text-sm font-bold tracking-wide">
          Fee &amp; Payments
        </h2>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-[11px]"
        >
          <Link href="/profile">
            <Receipt className="size-3" />
            Receipts
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      ) : isError || !feeDetail || feeDetail.length === 0 ? (
        <div className="bg-card ring-foreground/10 ring-dashed flex flex-col items-center justify-center gap-2 rounded-md py-10 ring-1">
          <CreditCard className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-xs">
            No fee data available.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {/* Balance overview */}
          <div className="bg-card ring-foreground/10 grid grid-cols-2 gap-px overflow-hidden rounded-md ring-1">
            <BalanceCell
              label="Total Paid"
              value={fmtCurrency(totalPaid)}
              icon={
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              }
              valueClass="text-emerald-600 dark:text-emerald-400"
            />
            <BalanceCell
              label="Outstanding"
              value={fmtCurrency(totalOutstanding)}
              icon={
                <TrendingDown
                  className={`size-3.5 ${totalOutstanding > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}
                />
              }
              valueClass={
                totalOutstanding > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-foreground"
              }
            />
          </div>

          {/* Overdue alert */}
          {overdueList.length > 0 && (
            <div className="bg-destructive/5 ring-destructive/20 flex items-start gap-3 rounded-md p-3.5 ring-1">
              <AlertCircle className="text-destructive mt-0.5 size-4 shrink-0" />
              <div>
                <p className="text-destructive text-xs font-bold">
                  {overdueList.length} overdue instalment
                  {overdueList.length > 1 ? "s" : ""}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  Total overdue:{" "}
                  {fmtCurrency(
                    overdueList.reduce((s, i) => s + i.amount, 0)
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Next instalment */}
          {nextInstalment && (
            <div className="bg-card ring-foreground/10 flex items-center gap-3 rounded-md p-3.5 ring-1">
              <div className="from-primary/15 to-primary/5 flex size-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br">
                <CreditCard className="text-primary size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-xs font-semibold">
                  Next Instalment
                </p>
                <p className="text-muted-foreground text-[10px]">
                  Due {fmtDate(nextInstalment.dueDate)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-foreground text-sm font-bold">
                  {fmtCurrency(nextInstalment.amount)}
                </p>
              </div>
            </div>
          )}

          {/* Course row */}
          <div className="bg-muted/40 ring-foreground/6 flex items-center justify-between rounded-md px-3 py-2 ring-1">
            <p className="text-foreground truncate text-[11px] font-medium">
              {firstEnrollment?.courseTitle}
            </p>
            <span
              className={`shrink-0 text-[11px] font-bold ${
                totalOutstanding > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {totalOutstanding > 0
                ? `${fmtCurrency(totalOutstanding)} due`
                : "Paid"}
            </span>
          </div>
        </div>
      )}
    </section>
  )
}

function BalanceCell({
  label,
  value,
  icon,
  valueClass,
}: {
  label: string
  value: string
  icon: React.ReactNode
  valueClass: string
}) {
  return (
    <div className="bg-card flex flex-col gap-1.5 p-4">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
          {label}
        </span>
      </div>
      <p
        className={`font-display text-lg leading-none font-bold ${valueClass}`}
      >
        {value}
      </p>
    </div>
  )
}
