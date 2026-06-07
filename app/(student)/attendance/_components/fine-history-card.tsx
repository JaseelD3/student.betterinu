"use client"

import {
  AlertTriangle,
  BadgeAlert,
  CheckCheck,
  MinusCircle,
} from "lucide-react"

import { useFines } from "@/lib/hooks/use-attendance"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FineHistoryCard() {
  const { data: finesData } = useFines()
  const allFines = finesData?.fines ?? []
  const pendingFines = allFines.filter((f) => f.status === "pending")

  return (
    <Card className="py-0 bg-card gap-0 flex flex-col h-full overflow-hidden">
      <CardHeader className="shrink-0 border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            Fine History
          </CardTitle>
          {pendingFines.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">
              <AlertTriangle className="size-2.5" />
              {pendingFines.length} Pending
            </span>
          )}
        </div>
      </CardHeader>

      {/* Pending Fine Alert Banner */}
      {pendingFines.length > 0 && (
        <div className="mx-3 mt-3 flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5">
          <BadgeAlert className="size-4 shrink-0 text-amber-600 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-amber-900">
              ₹{pendingFines.reduce((s, f) => s + Number(f.fine_amount), 0).toLocaleString("en-IN")} due
            </p>
            <p className="text-[10px] text-amber-700 leading-relaxed">
              {pendingFines.length} unpaid fine{pendingFines.length > 1 ? "s" : ""}. Please contact admin.
            </p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .fine-scroll { scrollbar-width: thin; }
        .fine-scroll::-webkit-scrollbar { width: 4px; }
        .fine-scroll::-webkit-scrollbar-track { background: transparent; }
        .fine-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        .dark .fine-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
      `}} />

      <CardContent className="fine-scroll flex-1 overflow-y-auto space-y-2 px-4 pt-3 pb-4">
        {allFines.length === 0 ? (
          <div className="flex md:pb-30 h-full flex-col items-center justify-center text-center pb-8">
            <CheckCheck className="size-8 text-muted-foreground/30 mb-3" />
            <p className="text-xs font-semibold text-foreground">No Fines</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              You don't have any fine history.
            </p>
          </div>
        ) : (
          allFines.map((fine) => {
            const isAbsent = fine.fine_type === "absent"
            const dateLabel = isAbsent
              ? (fine.absent_date
                  ? new Date(fine.absent_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : fine.period_label)
              : fine.period_label

            return (
              <div
                key={fine.id}
                className="rounded-md border border-border bg-muted/40 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground">
                      {isAbsent ? "Absence Fine" : "Leave Fine"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{dateLabel}</p>
                    {fine.waive_reason && (
                      <p className="mt-1 text-[10px] italic text-muted-foreground">
                        "{fine.waive_reason}"
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span
                      className={cn(
                        "text-xs font-bold",
                        fine.status === "waived" && "line-through text-muted-foreground",
                        fine.status === "pending" && "text-amber-700",
                        fine.status === "paid" && "text-green-700"
                      )}
                    >
                      ₹{Number(fine.fine_amount).toLocaleString("en-IN")}
                    </span>
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase",
                        fine.status === "pending" && "bg-amber-50 text-amber-700 border-amber-200",
                        fine.status === "paid" && "bg-green-50 text-green-700 border-green-200",
                        fine.status === "waived" && "bg-slate-50 text-slate-500 border-slate-200"
                      )}
                    >
                      {fine.status === "paid" && <CheckCheck className="mr-0.5 inline size-2.5" />}
                      {fine.status === "waived" && <MinusCircle className="mr-0.5 inline size-2.5" />}
                      {fine.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
