"use client"

import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"
import type { StudentFeeEnrollment } from "@/lib/services/student-fee-service"

// ── Actual backend response shapes ──────────────────────────────────────────
// GET /api/student/fee → { enrollments: Enrollment[] }
// We return the raw enrollments array and let components adapt.

/**
 * Returns the student's full fee detail including instalments.
 * Backend: GET /api/student/fee → { enrollments: StudentFeeEnrollment[] }
 */
export function useStudentFee() {
  return useQuery({
    queryKey: queryKeys.fees.detail(),
    queryFn: async () => {
      const res = await apiClient<{ enrollments: StudentFeeEnrollment[] }>(
        "/api/student/fee"
      )
      return res.enrollments ?? []
    },
    staleTime: 30_000,
  })
}

export type { StudentFeeEnrollment as StudentEnrollment }
