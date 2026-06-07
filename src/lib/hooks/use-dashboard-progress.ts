"use client"

import { useQuery } from "@tanstack/react-query"

import { getClientAuth } from "@/lib/firebase-client"
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
    queryFn: async () => {
      const user = getClientAuth().currentUser
      if (!user) throw new Error("You must sign in to continue")
      const token = await user.getIdToken()
      const res = await fetch("/api/student/dashboard/progress", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return null
      return res.json() as Promise<DashboardProgress>
    },
    staleTime: 30_000,
  })
}

export type WeekProgress = {
  courseId: string
  courseTitle: string
  thumbnailUrl: string | null
  weekNumber: number
  weekTitle: string
  dayNumber: number
  dayTitle: string
  weekCompleted: number
  weekTotal: number
  weekPct: number
  completedModules: number
  totalModules: number
  overallPct: number
}

/**
 * Returns null when the student has no enrolled course (404).
 * Returns undefined (loading) while fetching.
 * Throws only on unexpected errors (5xx, auth failures, etc).
 */
export function useWeekProgress() {
  return useQuery({
    queryKey: queryKeys.dashboard.weekProgress(),
    queryFn: async () => {
      const user = getClientAuth().currentUser
      if (!user) throw new Error("You must sign in to continue")
      const token = await user.getIdToken()
      const res = await fetch("/api/student/dashboard/week-progress", {
        headers: { Authorization: `Bearer ${token}` },
      })
      // 404 = no enrolled course — not an error, just null data
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      return res.json() as Promise<WeekProgress>
    },
    staleTime: 30_000,
  })
}
