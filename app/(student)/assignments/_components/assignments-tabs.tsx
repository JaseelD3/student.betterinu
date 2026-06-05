"use client"

import { GraduationCap, Globe, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { CourseAssignmentRow } from "./course-assignment-card"
import type { StandaloneAssignmentRow } from "./standalone-assignment-card"
import { CourseAssignmentCard } from "./course-assignment-card"
import { StandaloneAssignmentCard } from "./standalone-assignment-card"

// ── Filter types ─────────────────────────────────────────────────────────────
type CourseFilter = "all" | "pending" | "approved" | "rejected"
type OtherFilter = "all" | "todo" | "pending" | "approved" | "rejected"

const COURSE_FILTERS: { key: CourseFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Needs Revision" },
]

const OTHER_FILTERS: { key: OtherFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "todo", label: "To Do" },
  { key: "pending", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Needs Revision" },
]

// ── Props ─────────────────────────────────────────────────────────────────────
type AssignmentsTabsProps = {
  activeTab: "course" | "other"
  onTabChange: (tab: "course" | "other") => void
  courseFilter: CourseFilter
  onCourseFilterChange: (f: CourseFilter) => void
  otherFilter: OtherFilter
  onOtherFilterChange: (f: OtherFilter) => void
  courseAssignments: CourseAssignmentRow[]
  otherAssignments: StandaloneAssignmentRow[]
  /** Opens the task detail modal */
  onOpenTask: (assignmentId: string) => void
}

// ── FilterPill ────────────────────────────────────────────────────────────────
function FilterPill({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean
  label: string
  count: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-3.5 py-1.5 text-[11px] font-bold transition-colors",
        active
          ? "bg-primary border-primary text-primary-foreground"
          : "border-border text-muted-foreground bg-card hover:border-primary/40 hover:text-primary",
      )}
    >
      {label} ({count})
    </button>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center py-16">
      <span className="bg-muted flex size-14 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground size-6" aria-hidden />
      </span>
      <div>
        <p className="text-foreground text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function AssignmentsTabs({
  activeTab,
  onTabChange,
  courseFilter,
  onCourseFilterChange,
  otherFilter,
  onOtherFilterChange,
  courseAssignments,
  otherAssignments,
  onOpenTask,
}: AssignmentsTabsProps) {
  // Filtered lists
  const filteredCourse = courseAssignments.filter(
    (a) => courseFilter === "all" || a.submission_status === courseFilter,
  )
  const filteredOther = otherAssignments.filter((a) => {
    const s = a.submission_status ?? "todo"
    return otherFilter === "all" || s === otherFilter
  })

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* Tab bar with background container */}
      <div className="flex">
        <div className="inline-flex h-11 items-center justify-center rounded-lg bg-card p-1 text-muted-foreground border border-border/60">
          {(
            [
              {
                key: "course" as const,
                label: "Course Tasks",
                count: courseAssignments.length,
              },
              {
                key: "other" as const,
                label: "My Tasks",
                count: otherAssignments.length,
              },
            ] as const
          ).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition-all duration-200 select-none",
                activeTab === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/10",
              )}
            >
              <span>{label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold transition-all",
                    activeTab === key
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Shared Outer Container */}
      <div className="relative border border-dashed border-border bg-card rounded-md p-5 flex-1 flex flex-col gap-4 min-h-[350px]">
        {/* Top-right info icon explaining the active section */}
        <div className="absolute top-5 right-5 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center justify-center text-muted-foreground/60 hover:text-foreground transition-colors cursor-help p-1 rounded-full hover:bg-muted/40">
                <Info className="size-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="left" align="center" className="max-w-[240px] text-xs">
              {activeTab === "course"
                ? "Tasks from the course"
                : "Tasks assigned to the particular student"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Course tab */}
        {activeTab === "course" && (
          <div className="flex flex-1 flex-col gap-4">
            {courseAssignments.length > 0 && (
              <div className="flex flex-wrap gap-2 pr-10">
                {COURSE_FILTERS.map((f) => (
                  <FilterPill
                    key={f.key}
                    active={courseFilter === f.key}
                    label={f.label}
                    count={
                      f.key === "all"
                        ? courseAssignments.length
                        : courseAssignments.filter(
                            (a) => a.submission_status === f.key,
                          ).length
                    }
                    onClick={() => onCourseFilterChange(f.key)}
                  />
                ))}
              </div>
            )}

            {filteredCourse.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title={
                  courseFilter === "all"
                    ? "No course tasks yet"
                    : `No ${courseFilter} course tasks`
                }
                description="Assignments from your enrolled courses will appear here."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCourse.map((a) => (
                  <CourseAssignmentCard key={a.submission_id} assignment={a} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other tab */}
        {activeTab === "other" && (
          <div className="flex flex-1 flex-col gap-4">
            {otherAssignments.length > 0 && (
              <div className="flex flex-wrap gap-2 pr-10">
                {OTHER_FILTERS.map((f) => (
                  <FilterPill
                    key={f.key}
                    active={otherFilter === f.key}
                    label={f.label}
                    count={
                      f.key === "all"
                        ? otherAssignments.length
                        : otherAssignments.filter(
                            (a) => (a.submission_status ?? "todo") === f.key,
                          ).length
                    }
                    onClick={() => onOtherFilterChange(f.key)}
                  />
                ))}
              </div>
            )}

            {filteredOther.length === 0 ? (
              <EmptyState
                icon={Globe}
                title={
                  otherFilter === "all"
                    ? "No standalone tasks yet"
                    : `No ${otherFilter} tasks`
                }
                description="Standalone tasks assigned to you will appear here."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredOther.map((a) => (
                  <StandaloneAssignmentCard
                    key={a.assignment_id}
                    assignment={a}
                    onOpen={onOpenTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}