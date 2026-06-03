"use client"

import { Card } from "@/components/ui/card"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—"
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    })
  } catch {
    return "—"
  }
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "₹0.00"
  return (
    "₹" +
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  )
}

function fmtMode(mode: string) {
  const MAP: Record<string, string> = {
    cash: "Cash",
    upi: "UPI",
    bank_transfer: "Bank Transfer",
    cheque: "Cheque",
    other: "Other",
  }
  return MAP[mode] ?? mode
}

const INST_ENV = {
  name: process.env.NEXT_PUBLIC_INSTITUTION_NAME || "Betterinu IT HUB",
  address:
    process.env.NEXT_PUBLIC_INSTITUTION_ADDRESS ||
    "30/264-13,14 | Near Moosakutty Bus Stand| Bypass Road Perinthalmanna| Malappuram Kerala 679322",
  phone: process.env.NEXT_PUBLIC_INSTITUTION_PHONE || "+91 81388 02562",
  email: process.env.NEXT_PUBLIC_INSTITUTION_EMAIL || "contact@betterinu.com",
}

export type ReceiptViewProps = {
  data: {
    receipt: {
      id: string
      amountPaid: number
      paymentDate: string
      paymentMode: string
      referenceNumber: string | null
      entryType: string
      recordedBy: string
      recordedByName?: string | null
      receiptNumber: string
      installmentNumber: number
      totalAmount: number
      paidAmount: number
      dueDate: string
      paymentType: string
      enrollmentId: string
      studentName: string
      studentId: string
      studentAddress: string | null
      studentPhone?: string | null
      courseName: string
      courseId: string
      oneTimePrice: number | null
      installmentTotalPrice: number | null
      defaultInstallmentCount: number | null
    }
    totalPaid: number
    nextInstallment: {
      installmentNumber: number
      totalAmount: number
      dueDate: string
    } | null
  }
}

// ── Field Row Helper ─────────────────────────────────────────────────────────

function Field({
  label,
  value,
  bold = false,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex px-2 py-1.5 text-[13px] leading-normal">
      <span className="w-[90px] shrink-0 font-bold text-[#1a1a1a]">
        {label}
      </span>
      <span className="mr-1 shrink-0 text-[#1a1a1a]">:</span>
      <span
        className={`${bold ? "font-bold" : ""} flex-1 break-words text-[#1a1a1a]`}
      >
        {value}
      </span>
    </div>
  )
}

export function ReceiptView({ data }: ReceiptViewProps) {
  const { receipt, totalPaid, nextInstallment } = data
  const isOneTime = receipt.paymentType === "one_time"
  const courseFee = isOneTime
    ? (receipt.oneTimePrice ?? 0)
    : (receipt.installmentTotalPrice ?? 0)
  const balance = courseFee - totalPaid
  const studentAddressLines = (receipt.studentAddress || "").split("\n")

  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-6">
      {/* Dynamic print stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-print-area,
          #receipt-print-area * {
            visibility: visible;
          }
          #receipt-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 48pt;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>

      {/* Printable Card Area */}
      <Card
        id="receipt-print-area"
        className="border-border mx-auto flex w-full max-w-[180mm] flex-col gap-6 rounded-md border bg-white p-12 shadow-none"
      >
        <div className="mb-3 flex items-start justify-between gap-6">
          <div className="-mt-6 flex shrink-0 items-center">
            <img
              src="/new-logo.svg"
              alt="logo"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = "/logo.png"
              }}
            />
          </div>

          <div className="flex-1 pb-3 text-right font-semibold">
            <div className="relative mb-2 h-[3px] w-full bg-[#067635]">
              <div className="absolute top-[-0.5] right-0 h-[4px] w-1/4 bg-black" />
            </div>
            <h2 className="mb-2 text-[13.5px] font-bold tracking-tight text-[#1a1a1a]">
              {INST_ENV.name.toUpperCase()}
            </h2>
            {INST_ENV.address.split("|").map((part, i) => (
              <p key={i} className="text-[12px] leading-[1.5] text-[#444444]">
                {part.trim()}
              </p>
            ))}
            <p className="text-[12px] leading-[1.5] text-[#444444]">
              {INST_ENV.phone}
            </p>
            <p className="text-[12px] leading-[1.5] text-[#053a85]">
              {INST_ENV.email}
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="flex justify-center">
          <h1 className="text-[18px] font-bold tracking-[1.5px] text-[#067635] uppercase underline">
            FEE RECEIPT
          </h1>
        </div>

        {/* Main Info Table */}
        <div className="flex w-full flex-col border border-[#555555] bg-white">
          {/* Row 1: Receipt No | Course No */}
          <div className="flex">
            <div className="flex-1 border-r border-[#555555]">
              <Field label="Receipt No" value={receipt.receiptNumber ?? "—"} />
            </div>
            <div className="flex-1">
              <Field label="Course No" value={receipt.courseId ?? "—"} />
            </div>
          </div>

          {/* Row 2: Received From | Fees */}
          <div className="flex">
            <div className="flex-1 border-r border-[#555555]">
              <Field label="Received From" value={receipt.studentName ?? "—"} />
            </div>
            <div className="flex-1">
              <Field label="Fees" value={formatCurrency(courseFee)} bold />
            </div>
          </div>

          {/* Row 3: Address | Course Name */}
          <div className="flex">
            <div className="flex-1 border-r border-[#555555]">
              <div className="flex px-2 py-1.5 text-[13px] leading-normal">
                <span className="w-[90px] shrink-0 font-bold text-[#1a1a1a]">
                  Address
                </span>
                <span className="mr-1 shrink-0 text-[#1a1a1a]">:</span>
                <div className="flex flex-1 flex-col break-words text-[#1a1a1a]">
                  {studentAddressLines.map((line: string, i: number) => (
                    <span key={i}>{line}</span>
                  ))}
                  {receipt.studentPhone ? (
                    <span>{receipt.studentPhone}</span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <Field label="Course Name" value={receipt.courseName ?? "—"} />
            </div>
          </div>

          {/* Row 4: Installment Date | Total Paid */}
          <div className="flex">
            <div className="flex-1 border-r border-[#555555]">
              <Field
                label="Installment Date"
                value={formatDate(receipt.dueDate)}
              />
            </div>
            <div className="flex-1">
              <Field
                label="Total Paid"
                value={formatCurrency(totalPaid)}
                bold
              />
            </div>
          </div>

          {/* Row 5: Payment Date | Balance */}
          <div className="flex">
            <div className="flex-1 border-r border-[#555555]">
              <Field
                label="Payment Date"
                value={formatDate(receipt.paymentDate)}
              />
            </div>
            <div className="flex-1">
              <Field label="Balance" value={formatCurrency(balance)} bold />
            </div>
          </div>

          {/* Row 6: Amount Received | Next Installment */}
          <div className="flex">
            <div className="flex-1 border-r border-[#555555]">
              <Field
                label="Amount Received"
                value={formatCurrency(receipt.amountPaid)}
                bold
              />
            </div>
            <div className="flex-1">
              {nextInstallment && !isOneTime ? (
                <Field
                  label="Next Installment"
                  value={formatCurrency(nextInstallment.totalAmount)}
                  bold
                />
              ) : (
                <Field label="Next Installment" value="—" />
              )}
            </div>
          </div>

          {/* Row 7: Payment Method | Due Date */}
          <div className="flex">
            <div className="flex-1 border-r border-[#555555]">
              <Field
                label="Payment Method"
                value={fmtMode(receipt.paymentMode)}
              />
            </div>
            <div className="flex-1">
              {nextInstallment && !isOneTime ? (
                <Field
                  label="Due Date"
                  value={formatDate(nextInstallment.dueDate)}
                />
              ) : (
                <Field label="Due Date" value="—" />
              )}
            </div>
          </div>

          {/* Row 8: Transaction ID | (empty) */}
          <div className="flex">
            <div className="flex-1 border-r border-[#555555]">
              <Field
                label="Transaction ID"
                value={receipt.referenceNumber ?? "—"}
              />
            </div>
            <div className="flex-1">{/* empty cell */}</div>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="mt-6 mb-10 flex flex-row items-start justify-between px-2 text-[10.5px]">
          {/* Left: Student/Parent */}
          <div className="flex w-[200px] flex-col">
            <span className="mb-1 text-[#1a1a1a]">
              Student/Parent Name: {receipt.studentName ?? ""}
            </span>
            <div className="mt-2 flex items-end">
              <span className="text-[#1a1a1a]">Signature</span>
              <div className="mb-1 ml-2 w-[150px] border-b border-[#555555]" />
            </div>
          </div>

          {/* Right: Authorised Signatory */}
          <div className="flex w-[200px] flex-col items-end text-right">
            <span className="mb-14 font-bold text-[#1a1a1a]">
              Authorised Signatory:
            </span>
            <div className="w-full border-t border-[#555555] pt-1">
              <p className="text-center text-[9.5px] text-[#555555]">
                For {INST_ENV.name}
              </p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-1 border-t border-[#cccccc] pt-2 text-[12px] font-semibold text-[#333333]">
          <p className="pb-2 text-xl font-bold text-[#067635] underline">
            Terms and conditions
          </p>
          <p className="leading-relaxed">
            1. This receipt is issued subject to realization of cheque and/or
            confirmation of payment from the respective bank, payment gateway,
            or payment method used.
          </p>
          <p className="leading-relaxed">
            2. This receipt must be carefully preserved and produced upon
            request for any verification, refund processing, or account-related
            clarification.
          </p>
          <p className="leading-relaxed">
            3. Fees once paid are strictly non-refundable and non-transferable
            under any circumstances, except where the Second Party is eligible
            for refund under the officially defined fumigation period of one (1)
            month, subject to fulfilment of all conditions specified in the
            Agreement.
          </p>
          <p className="leading-relaxed">
            4. Failure to adhere to the agreed payment schedule may result in
            suspension or restriction of access to classes, facilities,
            mentorship, assessments, and other services until all dues are
            cleared.
          </p>
          <p className="leading-relaxed">
            5. The balance amount mentioned shall be payable as per the agreed
            schedule, and the student shall remain liable to pay the full course
            fee irrespective of course completion, withdrawal, or termination.
          </p>
          <p className="leading-relaxed">
            6. Any discrepancy in payment details must be reported within three
            (3) days from the date of receipt, failing which the records
            maintained by the institution shall be treated as final and binding.
          </p>
        </div>
      </Card>
    </div>
  )
}
