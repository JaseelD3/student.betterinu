import { apiClient } from "@/lib/api-client"

export type DayStatus =
  | "present"
  | "late"
  | "early_checkout"
  | "half_day"
  | "absent"
  | "leave"
  | "holiday"
  | "open"
  | "future"
  | "pending_leave"

export type DayRecord = {
  date: string
  status: DayStatus
  punchIn?: string | null
  punchOut?: string | null
  duration?: string | null
  note?: string | null
}

export type LeaveRequest = {
  id: string
  date: string
  reason: string
  status: "pending" | "approved" | "rejected"
  admin_note?: string | null
  created_at: string
}

export type MonthSummary = {
  present: number
  absent: number
  leave: number
  holiday: number
  late: number
  earlyCheckout: number
  halfDay: number
  percentage: number
}

export type AttendanceHistory = {
  days: DayRecord[]
  summary: MonthSummary
}

export async function fetchAttendanceHistory(
  year: number,
  month: number
): Promise<AttendanceHistory> {
  return apiClient<AttendanceHistory>(
    `/api/student/attendance/history?year=${year}&month=${month}`
  )
}

export async function fetchLeaveRequests(month: string): Promise<LeaveRequest[]> {
  const res = await apiClient<{ requests: LeaveRequest[] }>(
    `/api/student/attendance/leave?month=${month}`
  )
  return res.requests ?? []
}

export async function applyForLeave(date: string, reason: string): Promise<void> {
  await apiClient("/api/student/attendance/leave/apply", {
    method: "POST",
    body: { date, reason },
  })
}

export type AttendanceStatus = {
  punchedIn: boolean
  hasMarkedAttendance: boolean
  punchInTime: string | null
  punchOutTime: string | null
  isBlocked?: boolean
  blockedReason?: string | null
}

export async function fetchAttendanceStatus(): Promise<AttendanceStatus> {
  return apiClient<AttendanceStatus>("/api/student/attendance/status")
}

export async function punchIn(): Promise<void> {
  await apiClient("/api/student/attendance/punch-in", { method: "POST" })
}

export async function punchOut(): Promise<void> {
  await apiClient("/api/student/attendance/punch-out", { method: "POST" })
}
