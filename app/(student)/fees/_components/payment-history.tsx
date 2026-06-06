import { useState } from "react"
import { ChevronDown, ChevronUp, ReceiptText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReceiptModal } from "@/components/student/fee/receipt-modal"
import type { StudentPaymentLog } from "@/lib/services/student-fee-service"
import { fmt, fmtDate, fmtMode } from "./fee-utils"

export function PaymentHistory({ logs }: { logs: StudentPaymentLog[] }) {
  const [open, setOpen] = useState(false)
  const [receiptLogId, setReceiptLogId] = useState<string | null>(null)

  if (logs.length === 0) return null

  return (
    <div className="rounded-md border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <ReceiptText className="size-3.5" />
          Payment History
          <span className="rounded-full bg-muted/60 px-1.5 py-0.5 text-[10px] font-bold">
            {logs.length}
          </span>
        </span>
        {open ? (
          <ChevronUp className="size-3.5" />
        ) : (
          <ChevronDown className="size-3.5" />
        )}
      </button>

      {open && (
        <div className="border-t border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] table-fixed text-xs">
              <thead className="bg-muted/30">
                <tr>
                  <th className="w-[20%] px-4 py-2 text-left font-semibold text-muted-foreground">
                    Date
                  </th>
                  <th className="w-[20%] px-4 py-2 text-left font-semibold text-muted-foreground">
                    Amount
                  </th>
                  <th className="w-[20%] px-4 py-2 text-left font-semibold text-muted-foreground">
                    Mode
                  </th>
                  <th className="w-[25%] px-4 py-2 text-left font-semibold text-muted-foreground">
                    Reference
                  </th>
                  <th className="w-[15%] px-4 py-2 text-right font-semibold text-muted-foreground">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="bg-card transition-colors hover:bg-muted/10"
                  >
                    <td className="px-4 py-2.5 text-muted-foreground truncate">
                      {fmtDate(log.paymentDate)}
                    </td>
                    <td className="px-4 py-2.5 text-left font-semibold text-status-approved-foreground truncate">
                      {fmt(log.amountPaid)}
                    </td>
                    <td className="px-4 py-2.5 truncate">{fmtMode(log.paymentMode)}</td>
                    <td className="px-4 py-2.5 text-muted-foreground truncate">
                      {log.referenceNumber ?? (
                        <span className="text-[10px] italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        className="h-6 rounded border border-border px-1.5 text-[10px] font-semibold text-muted-foreground hover:text-primary"
                        onClick={() => setReceiptLogId(log.id)}
                      >
                        <ReceiptText className="mr-1 size-3" />
                        Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {receiptLogId && (
        <ReceiptModal
          open={!!receiptLogId}
          onClose={() => setReceiptLogId(null)}
          paymentLogId={receiptLogId}
        />
      )}
    </div>
  )
}
