"use client"

import Image from "next/image"
import Link from "next/link"
import { GraduationCap, ArrowRight, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { useProgress } from "@/lib/hooks/useProgress"
import type { Course } from "@/types"

type MyCoursesSectionProps = {
  courses: Course[] | undefined
  isLoading: boolean
}

export function MyCoursesSection({
  courses,
  isLoading,
}: MyCoursesSectionProps) {
  const { getCourseProgress } = useProgress()

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title="My Courses" count={courses?.length} />

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : !courses || courses.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="text-muted-foreground size-8" />}
          title="No courses yet"
          description="Contact your admin to get enrolled."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((course) => {
            const pct = getCourseProgress(course)
            return (
              <CourseCard key={course.id} course={course} progressPct={pct} />
            )
          })}
        </div>
      )}
    </section>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function CourseCard({
  course,
  progressPct,
}: {
  course: Course
  progressPct: number
}) {
  return (
    <Link
      href={`/course/${course.id}`}
      className="group bg-card ring-foreground/10 hover:ring-primary/30 flex flex-col overflow-hidden rounded-md ring-1 transition-all duration-300 hover:shadow-lg"
    >
      {/* Thumbnail */}
      <div className="from-primary/10 to-accent/5 relative aspect-[16/7] w-full overflow-hidden bg-gradient-to-br">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <GraduationCap className="text-primary/25 size-10" />
          </div>
        )}

        {/* Progress pill overlay */}
        <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
          <span className="text-[11px] font-bold text-white">
            {progressPct}%
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 p-4">
        <div>
          <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-sm leading-snug font-bold transition-colors">
            {course.title}
          </h3>
          {course.instructor && (
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-[11px]">
              <User className="size-3" />
              {course.instructor}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <Progress value={progressPct} className="h-1.5" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[10px]">
              {progressPct}% complete
            </span>
            <span className="text-primary flex items-center gap-0.5 text-[10px] font-semibold opacity-0 transition-opacity group-hover:opacity-100">
              Continue <ArrowRight className="size-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function CourseCardSkeleton() {
  return (
    <div className="bg-card ring-foreground/10 flex flex-col overflow-hidden rounded-md ring-1">
      <Skeleton className="aspect-[16/7] w-full rounded-none" />
      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  )
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-foreground text-sm font-bold tracking-wide">
        {title}
      </h2>
      {count !== undefined && count > 0 && (
        <span className="text-muted-foreground text-[11px]">
          {count} enrolled
        </span>
      )}
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card ring-foreground/10 ring-dashed flex flex-col items-center justify-center gap-3 rounded-md py-12 text-center ring-1">
      {icon}
      <div>
        <p className="text-foreground text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
      </div>
    </div>
  )
}
