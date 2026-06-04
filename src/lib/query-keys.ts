/** Centralized query key factory. Import this in every hook — never inline string arrays. */
export const queryKeys = {
  dashboard: {
    courses: () => ["dashboard", "courses"] as const,
    assignments: () => ["dashboard", "assignments"] as const,
    standaloneTasks: () => ["dashboard", "standalone-tasks"] as const,
    fee: () => ["dashboard", "fee"] as const,
  },
  courses: {
    all: () => ["courses"] as const,
    list: () => ["courses", "list"] as const,
    detail: (courseId: string) => ["courses", "detail", courseId] as const,
  },
  lessons: {
    all: () => ["lessons"] as const,
    detail: (courseId: string, weekId: string, moduleId: string) =>
      ["lessons", "detail", courseId, weekId, moduleId] as const,
  },
  assignments: {
    all: () => ["assignments"] as const,
    course: () => ["assignments", "course"] as const,
    standalone: () => ["assignments", "standalone"] as const,
    detail: (id: string) => ["assignments", "detail", id] as const,
  },
  grades: {
    all: () => ["grades"] as const,
    list: () => ["grades", "list"] as const,
  },
  profile: {
    me: () => ["profile", "me"] as const,
  },
  notifications: {
    all: () => ["notifications"] as const,
    list: () => ["notifications", "list"] as const,
    unreadCount: () => ["notifications", "unread-count"] as const,
  },
  quiz: {
    all: () => ["quiz"] as const,
    detail: (courseId: string, weekId: string) =>
      ["quiz", "detail", courseId, weekId] as const,
  },
  fees: {
    all: () => ["fees"] as const,
    detail: () => ["fees", "detail"] as const,
  },
  progress: {
    all: () => ["progress"] as const,
    detail: (courseId: string) => ["progress", "detail", courseId] as const,
  },
} as const
