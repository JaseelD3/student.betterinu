"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/lib/query-keys"
import {
  applyForLeave,
  fetchAttendanceHistory,
  fetchLeaveRequests,
  fetchAttendanceStatus,
  punchIn,
  punchOut,
} from "@/lib/attendance/api"
import { studentApi } from "@/lib/api-client"

export function useAttendanceHistory(year: number, month: number) {
  return useQuery({
    queryKey: queryKeys.attendance.history(year, month),
    queryFn: () => fetchAttendanceHistory(year, month),
    staleTime: 60_000,
  })
}

export function useLeaveRequests(year: number, month: number) {
  const monthStr = `${year}-${String(month).padStart(2, "0")}`
  return useQuery({
    queryKey: queryKeys.attendance.leave(monthStr),
    queryFn: () => fetchLeaveRequests(monthStr),
    staleTime: 60_000,
  })
}

export function useApplyLeave(year: number, month: number) {
  const queryClient = useQueryClient()
  const monthStr = `${year}-${String(month).padStart(2, "0")}`
  return useMutation({
    mutationFn: ({ date, reason }: { date: string; reason: string }) =>
      applyForLeave(date, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.leave(monthStr),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.history(year, month),
      })
    },
  })
}

export function useAttendanceStatus() {
  return useQuery({
    queryKey: queryKeys.attendance.status(),
    queryFn: fetchAttendanceStatus,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function usePunchIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: punchIn,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.status(),
      }),
  })
}

export function usePunchOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: punchOut,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.status(),
      }),
  })
}

export function useFines() {
  return useQuery({
    queryKey: queryKeys.attendance.fines(),
    queryFn: () => studentApi.getFines(),
    staleTime: 60_000,
  })
}
