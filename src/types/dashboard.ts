import type { SubmissionStatus } from "./assignment"

export type DashboardCourse = {
  id: string
  title: string
  instructor: string
  image: string
  progressPercentage: number
  totalModules: number
  completedModules: number
  enrolledAt: string
}

export type DashboardAssignment = {
  id: string
  title: string
  courseId: string
  courseTitle: string
  dueDate: string | null
  status: SubmissionStatus
  isOverdue: boolean
  feedback?: string
}

export type DashboardStats = {
  totalSubModulesCompleted: number
  assignmentsSubmitted: number
  assignmentsApproved: number
  assignmentsPending: number
  totalAmountPaid: number
  outstandingBalance: number
  currentStreak: number
  totalXp: number
}
