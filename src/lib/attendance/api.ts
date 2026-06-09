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
  | "before_start"

export type DayRecord = {
  date: string
  status: DayStatus
  punchIn?: string | null
  punchOut?: string | null
  duration?: string | null
  note?: string | null
  isStartDay?: boolean
}

export type LeaveReasonCategory =
  | "Medical"
  | "Family Emergency"
  | "Personal"
  | "Academic"
  | "Travel"
  | "Other"

export const LEAVE_REASON_CATEGORIES: LeaveReasonCategory[] = [
  "Medical",
  "Family Emergency",
  "Personal",
  "Academic",
  "Travel",
  "Other",
]

export type LeaveRequest = {
  id: string
  date: string
  start_date?: string
  end_date?: string
  number_of_days?: number
  reason_category?: LeaveReasonCategory
  detailed_reason?: string | null
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
  startedAt?: string | null
}

export type LeaveFineSettings = {
  enabled: boolean
  free_leaves_per_period: number
  fine_amount: number
  fine_period: "monthly" | "yearly"
  fine_model: string
  per_day_amount: number
  weekend_days: string[]
}

export type ApplyLeavePayload = {
  start_date: string
  end_date: string
  reason_category: LeaveReasonCategory
  detailed_reason: string
  declaration_acknowledged: true
}

export type ApplyLeaveResponse = {
  ok: true
  id: string
  status: string
  number_of_days: number
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

export async function applyForLeave(payload: ApplyLeavePayload): Promise<ApplyLeaveResponse> {
  return apiClient<ApplyLeaveResponse>("/api/student/attendance/leave/apply", {
    method: "POST",
    body: payload,
  })
}

export async function fetchLeaveFineSettings(): Promise<LeaveFineSettings> {
  return apiClient<LeaveFineSettings>("/api/student/leave-fine-settings")
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
