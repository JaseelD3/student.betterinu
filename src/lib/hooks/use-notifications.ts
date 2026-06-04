"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useAppStore } from "@/store/useAppStore"
import { queryKeys } from "@/lib/query-keys"

// NOTE: The backend does NOT have notification endpoints yet.
// These hooks are stubs that return empty data so the UI doesn't crash.

export type Notification = {
  id: string
  message: string
  isRead: boolean
  createdAt: string
}

/**
 * Paginated list of all notifications for the student.
 * NOTE: Backend endpoint not yet implemented — returns empty array.
 */
export function useNotifications() {
  return {
    data: [] as Notification[],
    isLoading: false,
    isError: false,
  }
}

/**
 * Fetches and caches the unread notification count.
 * NOTE: Backend endpoint not yet implemented — returns 0.
 */
export function useUnreadNotificationCount() {
  return {
    data: { count: 0 },
    isLoading: false,
  }
}

/**
 * Marks a single notification as read.
 * NOTE: Backend endpoint not yet implemented — no-op stub.
 */
export function useMarkNotificationRead() {
  return {
    mutate: (_id: string) => {},
    isPending: false,
  }
}

/**
 * Marks all notifications as read and clears the badge count.
 * NOTE: Backend endpoint not yet implemented — no-op stub.
 */
export function useMarkAllNotificationsRead() {
  return {
    mutate: () => {},
    isPending: false,
  }
}
