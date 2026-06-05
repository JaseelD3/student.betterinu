"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Printer, Download, Loader2, AlertCircle } from "lucide-react"
import dynamic from "next/dynamic"

import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ReceiptView, type ReceiptViewProps } from "./receipt-view"
import { studentApi } from "@/lib/api-client"

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
)
import { ReceiptPDF } from "./receipt-pdf"

const INST_ENV = {
  name: process.env.NEXT_PUBLIC_INSTITUTION_NAME || "Betterinu IT HUB",
  address:
    process.env.NEXT_PUBLIC_INSTITUTION_ADDRESS ||
    "30/264-13,14 | Near Moosakutty Bus Stand| Bypass Road Perinthalmanna| Malappuram Kerala 679322",
  phone: process.env.NEXT_PUBLIC_INSTITUTION_PHONE || "+91 81388 02562",
  email: process.env.NEXT_PUBLIC_INSTITUTION_EMAIL || "contact@betterinu.com",
}

type ReceiptModalProps = {
  open: boolean
  onClose: () => void
  paymentLogId: string
}

export function ReceiptModal({
  open,
  onClose,
  paymentLogId,
}: ReceiptModalProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ["receipt", paymentLogId],
    queryFn: async () => {
      return studentApi.getReceipt<ReceiptViewProps["data"]>(paymentLogId)
    },
    enabled: open && !!paymentLogId,
  })

  // Header actions rendered when loaded successfully
  const headerActions = data ? (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.print()}
        className="h-8 text-xs font-semibold"
      >
        <Printer className="mr-1.5 size-3.5" /> Print Receipt
      </Button>

      {isClient && (
        <PDFDownloadLink
          document={
            <ReceiptPDF
              data={data.receipt}
              totalPaid={data.totalPaid}
              nextInstallment={data.nextInstallment}
              env={INST_ENV}
              logoUrl={
                typeof window !== "undefined"
                  ? `${window.location.origin}/logo.png`
                  : undefined
              }
            />
          }
          fileName={`Receipt-${data.receipt.receiptNumber}-${data.receipt.studentName.replace(/\s+/g, "_")}.pdf`}
        >
          {({ loading }) => (
            <Button
              disabled={loading}
              size="sm"
              className="h-8 text-xs font-semibold"
            >
              <Download className="mr-1.5 size-3.5" />
              {loading ? "Generating..." : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      )}
    </>
  ) : null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Fee Receipt"
      size="3xl"
      scrollable={true}
      headerActions={headerActions}
    >
      <div className="flex min-h-[200px] flex-col justify-center p-1">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="text-primary size-7 animate-spin" />
            <p className="text-muted-foreground text-xs">
              Loading fee receipt details...
            </p>
          </div>
        )}

        {error && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 py-12 text-center">
            <AlertCircle className="text-destructive size-8" />
            <div>
              <h3 className="text-foreground text-sm font-bold">
                Receipt Load Error
              </h3>
              <p className="text-muted-foreground mt-1 text-xs">
                {error instanceof Error
                  ? error.message
                  : "The requested receipt could not be loaded."}
              </p>
            </div>
          </div>
        )}

        {data && <ReceiptView data={data} />}
      </div>
    </Dialog>
  )
}
