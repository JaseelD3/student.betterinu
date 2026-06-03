"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Award, BarChart3, Clock, UserRound, ChevronRight } from "lucide-react"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { CourseHero } from "@/components/course/course-hero"
import { SyllabusList } from "@/components/course/syllabus-list"
import { EnrollButton } from "@/components/course/enroll-button"
import { Card } from "@/components/ui/card"
import RoboLoader from "@/components/loading/robo-loader"
import { studentApi } from "@/lib/api-client"
import type { Course } from "@/types"

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    studentApi
      .getCourse(courseId)
      .then(({ course: nextCourse }) => setCourse(nextCourse))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Course not found")
      )
  }, [courseId])

  if (error) {
    return (
      <PageWrapper>
        <p className="mx-auto max-w-7xl pt-8 text-sm text-red-600">{error}</p>
      </PageWrapper>
    )
  }

  if (!course) {
    return (
      <PageWrapper>
        <div className="flex h-64 items-center justify-center">
          <RoboLoader size="md" />
        </div>
      </PageWrapper>
    )
  }

  const stats = [
    { Icon: Clock, label: "Duration", value: course.duration },
    { Icon: BarChart3, label: "Modules", value: `${course.totalModules}` },
    { Icon: Award, label: "Certificate", value: "Included" },
    { Icon: UserRound, label: "Level", value: course.level },
  ]

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl space-y-6 pt-2">
        <nav
          className="text-muted mb-2 flex items-center gap-2 text-xs font-semibold"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="opacity-50" />
          <span className="text-foreground">{course.title}</span>
        </nav>

        <CourseHero course={course} />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section>
            <div className="mb-4">
              <p className="text-muted text-sm font-bold uppercase">
                Syllabus preview
              </p>
              <h2 className="font-display text-3xl font-bold">
                Weekly Curriculum
              </h2>
            </div>
            <SyllabusList course={course} />
          </section>
          <aside className="relative">
            {/* Invisible spacer to perfectly align the card with the Syllabus accordion */}
            <div className="invisible mb-4 hidden lg:block" aria-hidden="true">
              <p className="text-muted text-sm font-bold uppercase">Spacer</p>
              <h2 className="font-display text-3xl font-bold">Spacer</h2>
            </div>

            <div className="space-y-5 lg:sticky lg:top-24">
              <Card className="p-5">
                <h2 className="font-display text-xl font-bold">Course Stats</h2>
                <div className="mt-4 grid gap-3">
                  {stats.map(({ Icon, label, value }) => (
                    <div
                      className="bg-subtle flex items-center justify-between gap-3 rounded-lg p-3"
                      key={label}
                    >
                      <span className="text-secondary flex items-center gap-2 text-sm">
                        <Icon className="text-primary size-4" aria-hidden />
                        {label}
                      </span>
                      <span className="font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
              {/* <Card className="p-5">
                <h2 className="font-display text-xl font-bold">Instructor</h2>
                <div className="mt- flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-elevated font-bold">
                    {course.instructor[0]}
                  </span>
                  <div>
                    <p className="font-bold">{course.instructor}</p>
                    <p className="text-sm text-secondary">
                      {course.instructorBio}
                    </p>
                  </div>
                </div>
              </Card> */}
              <EnrollButton courseId={course.id} className="w-full" />
            </div>
          </aside>
        </div>
      </div>
    </PageWrapper>
  )
}
