"use client"

import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"

// ── Actual backend response shapes ──────────────────────────────────────────
// GET /api/student/fee → { enrollments: Enrollment[] }
// The frontend FeeDetail type doesn't match the backend Enrollment shape.
// We return the raw enrollments array and let components adapt.

type Enrollment = {
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
  installments: {
    id: string
    installmentNumber: number
    dueDate: string
    totalAmount: number
    paidAmount: number
    remainingBalance: number
    status: string
    overpaymentReduction: number
    waiverReduction: number
  }[]
  paymentLogs: {
    id: string
    installmentId: string
    amountPaid: number
    paymentDate: string
    paymentMode: string
    referenceNumber: string | null
    entryType: string
  }[]
}

/**
 * Returns the student's full fee detail including instalments.
 * Backend: GET /api/student/fee → { enrollments: Enrollment[] }
 */
export function useStudentFee() {
  return useQuery({
    queryKey: queryKeys.fees.detail(),
    queryFn: async () => {
      const res = await apiClient<{ enrollments: Enrollment[] }>(
        "/api/student/fee"
      )
      return res.enrollments ?? []
    },
    staleTime: 30_000,
  })
}

export type { Enrollment as StudentEnrollment }
