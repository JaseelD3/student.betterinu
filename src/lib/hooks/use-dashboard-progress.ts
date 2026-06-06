"use client"

import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"

export type DashboardProgress = {
  courseId: string
  courseTitle: string
  thumbnailUrl: string | null
  completionPercentage: number
  completedModules: number
  totalModules: number
}

export function useDashboardProgress() {
  return useQuery({
    queryKey: queryKeys.dashboard.courses(),
    queryFn: () => apiClient<DashboardProgress>("/api/student/dashboard/progress"),
    staleTime: 30_000,
  })
}
