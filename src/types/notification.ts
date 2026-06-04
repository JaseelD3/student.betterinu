export type NotificationType =
  | "assignment_feedback"
  | "assignment_due"
  | "quiz_result"
  | "course_update"
  | "fee_reminder"
  | "general"

export type Notification = {
  id: string
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  createdAt: string
  linkUrl?: string
}
