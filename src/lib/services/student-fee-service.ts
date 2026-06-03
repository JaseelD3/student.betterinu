import { studentApi } from "@/lib/api-client"

/**
 * src/lib/services/student-fee-service.ts
 *
 * Student-facing fee data types and API fetch function.
 * Used exclusively by student pages.
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export type StudentInstallment = {
  id: string
  installmentNumber: number
  dueDate: string
  totalAmount: number
  paidAmount: number
  remainingBalance: number
  status: "upcoming" | "paid" | "partially_paid" | "overdue" | "waived"
  overpaymentReduction: number
  waiverReduction: number
}

export type StudentPaymentLog = {
  id: string
  installmentId: string
  amountPaid: number
  paymentDate: string
  paymentMode: string
  referenceNumber: string | null
  entryType: string
}

export type StudentFeeEnrollment = {
  enrollmentId: string
  courseId: string
  courseTitle: string
  paymentType: string
  isPlanCustomized: boolean
  planStartDate: string | null
  gracePeriodDays: number
  totalAmount: number
  paidAmount: number
  outstandingBalance: number
  totalWaiverReduction: number
  originalTotalAmount: number
  installments: StudentInstallment[]
  paymentLogs: StudentPaymentLog[]
}

// ── Fetch ──────────────────────────────────────────────────────────────────────

export async function fetchStudentFee(): Promise<{
  enrollments: StudentFeeEnrollment[]
}> {
  return studentApi.getFee()
}
