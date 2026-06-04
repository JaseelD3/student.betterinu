export type CourseModule = {
  id: string
  title: string
  type: "video" | "doc" | "exercise" | "resource" | "quiz" | "assignment" | "lesson" | "mixed"
  duration: string
  isCompleted: boolean
}

export type CourseWeek = {
  id: string
  title: string
  isLocked: boolean
  isShared: boolean
  modules: CourseModule[]
}

export type Course = {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  level: string
  totalModules: number
  image: string
  color: string
  icon: string
  enrolledAt?: string
}

export type CourseDetail = Course & {
  weeks: CourseWeek[]
  outcomes: string[]
  instructorBio: string
  tagline: string
}
