"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useCourse } from "@/lib/hooks/use-course"
import { useStandaloneAssignment } from "@/lib/hooks/use-assignments"

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/courses": "My Courses",
  "/assignments": "My Tasks",
  "/attendance": "My Attendance",
  "/fees": "My Fees",
  "/profile": "My Profile",
  "/support": "Support",
  "/about": "About",
}

function getPageLabel(pathname: string): string {
  // Exact match first
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname]

  // Prefix match (e.g. /course/[id]/learn/…)
  if (pathname.startsWith("/course")) return "My Courses"
  if (pathname.startsWith("/quiz")) return "Quiz"
  if (pathname.startsWith("/assignments")) return "My Tasks"

  return "Betterinu"
}

export function SidebarHeaderBar() {
  const pathname = usePathname()
  const label = getPageLabel(pathname)

  // Parse path segments to check if on a course details/learn page
  const segments = pathname.split("/").filter(Boolean)
  const isCoursePath = segments[0] === "course" && segments[1]
  const courseId = isCoursePath ? segments[1] : ""
  const moduleId = segments[2] === "learn" && segments[4] ? segments[4] : ""

  const isAssignmentPath = segments[0] === "assignments" && segments[1]
  const assignmentId = isAssignmentPath ? segments[1] : ""

  const { data: course, isLoading } = useCourse(courseId)
  const { data: assignment, isLoading: isAssignmentLoading } = useStandaloneAssignment(assignmentId)

  // Resolve module title when on a lesson page
  const moduleTitle = moduleId && course
    ? course.weeks
        .flatMap((w) => w.days.flatMap((d) => d.subModules))
        .find((m) => m.id === moduleId)?.title ?? null
    : null

  const renderBreadcrumb = () => {
    if (isCoursePath) {
      const showLearn = segments[2] === "learn"
      const showLesson = showLearn && segments[3] && segments[4]
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {showLesson ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/course/${courseId}`}>
                      {course?.title || "Course"}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/course/${courseId}/learn`}>Learn</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[180px] truncate font-medium">
                    {moduleTitle ?? "Lesson"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : showLearn ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/course/${courseId}`}>
                      {course?.title || "Course"}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">Learn</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">
                  {course?.title || (isLoading ? "Loading..." : "Course")}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      )
    }

    if (isAssignmentPath) {
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/assignments">My Tasks</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[260px] truncate font-medium">
                {assignment?.title || (isAssignmentLoading ? "Loading..." : "Task Details")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
    }

    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">{label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <header className="border-sidebar-border bg-sidebar sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
      <div className="flex items-center gap-2">
        {/* SidebarTrigger only shown on desktop; mobile uses bottom nav */}
        <SidebarTrigger className="-ml-1 hidden md:flex" />
        <Separator
          orientation="vertical"
          className="mr-2 hidden h-4 md:block"
        />
        {renderBreadcrumb()}
      </div>
      <div className="flex items-center gap-2">
        {/* <ThemeToggle /> */}
      </div>
    </header>
  )
}
