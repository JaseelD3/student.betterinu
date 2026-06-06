"use client"

import Link from "next/link"
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lock,
  ClipboardCheck,
  ExternalLink,
  FileText,
  PlayCircle,
  Wrench,
  HelpCircle,
  ArrowLeft,
  LayoutList,
  Loader2,
} from "lucide-react"
import { useState, useEffect } from "react"
import type { Course, Day, SubModule, Week } from "@/types"
import { useProgress } from "@/lib/hooks/useProgress"
import { Button, buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { DocViewer } from "./doc-viewer"
import { VideoPlayer } from "./video-player"
import { AssignmentViewer } from "./assignment-viewer"
import { QuizViewer } from "./quiz-viewer"
import { FileViewer } from "@/components/ui/FileViewer"
import { LessonSectionViewer } from "./lesson-section-viewer"
import { studentApi } from "@/lib/api-client"

const TYPE_ICONS: Record<string, React.ElementType> = {
  doc: FileText,
  video: PlayCircle,
  exercise: Wrench,
  resource: ExternalLink,
  quiz: HelpCircle,
  assignment: ClipboardCheck,
}

const TYPE_LABELS: Record<string, string> = {
  doc: "Reading",
  video: "Video",
  exercise: "Exercise",
  resource: "Resource",
  quiz: "Quiz",
  assignment: "Assignment",
  lesson: "Lesson",
}

type SidebarSubModuleItemProps = {
  courseId: string
  weekId: string
  module: SubModule
  isActive: boolean
  isComplete: boolean
  dayId?: string
  daySubModulesIds?: string[]
}

function SidebarSubModuleItem({
  courseId,
  weekId,
  module,
  isActive,
  isComplete,
  dayId,
  daySubModulesIds,
}: SidebarSubModuleItemProps) {
  const Icon = TYPE_ICONS[module.type] ?? HelpCircle
  const { markSubModuleComplete } = useProgress()
  const isAutoAssessed = module.type === "quiz" || module.type === "assignment"
  const [assignmentStatus, setAssignmentStatus] = useState<string | null>(null)

  useEffect(() => {
    if (module.type === "assignment") {
      studentApi
        .listAssignments({ assignmentId: module.id, courseId })
        .then((data) => {
          if (data.submission) setAssignmentStatus(data.submission.status)
        })
        .catch(() => { })
    }
  }, [module.type, module.id, courseId])

  return (
    <div
      className={cn(
        "border-border group flex items-center gap-3 rounded-md border bg-card px-3 py-2 transition-all hover:shadow-sm",
        isComplete && "border-primary/20 bg-card",
        isActive && "border-primary bg-card ring-2 ring-primary/20"
      )}
    >
      <Link
        className="flex min-w-0 flex-1 items-center gap-3 no-underline focus-visible:outline-none"
        href={`/course/${courseId}/learn/${weekId}/${module.id}`}
      >
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-md transition-colors",
            isComplete
              ? "bg-accent/15 text-accent"
              : isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          {isComplete ? (
            <CheckCircle2 className="size-4" aria-hidden />
          ) : (
            <Icon className="size-4" aria-hidden />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block whitespace-normal break-words text-xs leading-snug font-semibold transition-colors text-foreground/90",
              isActive ? "text-primary" : !isComplete && "group-hover:text-primary"
            )}
          >
            {module.title}
          </span>
          <span className="text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <span className="text-[10px] font-bold tracking-widest uppercase">
              {TYPE_LABELS[module.type] ?? module.type}
            </span>
            {module.duration && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground">{module.duration}</span>
              </>
            )}
          </span>
        </span>
      </Link>

      {isAutoAssessed ? (
        <div className="shrink-0">
          {module.type === "assignment" ? (
            assignmentStatus === "approved" || isComplete ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                <CheckCircle2 className="size-3" />
                Approved
              </span>
            ) : assignmentStatus === "pending" ? (
              <span className="border-border inline-flex items-center gap-1 rounded-full border bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                <ClipboardCheck className="size-3" />
                Pending
              </span>
            ) : assignmentStatus === "rejected" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                Needs Revision
              </span>
            ) : (
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                Assignment
              </span>
            )
          ) : isComplete ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
              <CheckCircle2 className="size-3" />
              Done
            </span>
          ) : (
            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
              Quiz
            </span>
          )}
        </div>
      ) : (
        <Button
          onClick={() => markSubModuleComplete(module.id, dayId, daySubModulesIds)}
          size="xs"
          type="button"
          variant={isComplete ? "default" : "outline"}
          className={cn(
            "shrink-0 gap-1 transition-all duration-200",
            isComplete
              ? "bg-accent/80 text-accent-foreground hover:bg-primary/90"
              : "hover:bg-accent hover:text-accent-foreground hover:border-accent"
          )}
        >
          {isComplete && <CheckCircle2 className="size-3" aria-hidden />}
          {isComplete ? "Done" : "Mark Done"}
        </Button>
      )}
    </div>
  )
}

function flatten(week: Week) {
  return week.days.flatMap((day) =>
    day.subModules.map((module) => ({ day, module }))
  )
}

type LessonViewerClientProps = {
  course: Course
  week: Week
  day: Day
  subModule: SubModule
  isLoading?: boolean
}

export function LessonViewerClient({
  course,
  week,
  day,
  subModule,
  isLoading,
}: LessonViewerClientProps) {
  const { isSubModuleComplete, markSubModuleComplete } = useProgress()

  const modules = flatten(week)
  const index = modules.findIndex((item) => item.module.id === subModule.id)
  const previous = modules[index - 1]
  const next = modules[index + 1]
  const completeCount = modules.filter((item) => isSubModuleComplete(item.module.id)).length
  const complete = isSubModuleComplete(subModule.id)
  const progressPercent = Math.round((completeCount / modules.length) * 100)

  const currentDayIndex = week.days.findIndex((d) => d.id === day.id)
  let isCurrentDayLocked = false
  let lockedReason = "Complete all lessons in the previous day before accessing this content."

  if (currentDayIndex > 0) {
    const prevDay = week.days[currentDayIndex - 1]
    if (!prevDay.subModules.every((m) => isSubModuleComplete(m.id))) {
      isCurrentDayLocked = true
      if (
        prevDay.subModules.some(
          (m) =>
            m.type === "assignment" &&
            (!m.assignmentData || m.assignmentData.requiresApproval !== false)
        )
      ) {
        lockedReason = "The previous day has an assignment awaiting admin approval."
      }
    }
  }

  if (isCurrentDayLocked) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-md border border-border bg-card">
          <Lock className="size-9 text-muted-foreground" aria-hidden />
        </div>
        <h2 className="font-heading text-foreground text-2xl font-bold tracking-tight">Day Locked</h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-sm text-sm leading-relaxed">
          {lockedReason}
        </p>
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "mt-8 gap-2 rounded-md px-5")}
          href={`/course/${course.id}/learn`}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back to Curriculum  
        </Link>
      </div>
    )
  }

  const ContentIcon = TYPE_ICONS[subModule.type] ?? HelpCircle

  return (
    /*
     * This component fills the height given by PageWrapper (flex-1 min-h-0).
     * Three rows stacked vertically:
     *   1. [flex-1 min-h-0] — the two-panel row (sidebar + content), clips overflow
     *   2. [shrink-0]       — footer, never scrolls, always visible at bottom
     *
     * Inside row 1:
     *   - Sidebar: fixed width, ScrollArea fills its full height → sidebar-only scroll
     *   - Main:    flex-1, overflow-y-auto → main-only scroll
     */
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

      {/* ── TWO-PANEL ROW ── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* ── LEFT SIDEBAR ── */}
        {/*
         * `h-full` here is the key: it tells the aside to fill the row height,
         * which gives ScrollArea a concrete pixel height to scroll within.
         * Without h-full, ScrollArea has no bounded height and never scrolls.
         */}
        <aside className="hidden h-full w-[420px] shrink-0 flex-col border-r-2 border-border-strong bg-background lg:flex">
          {/*
           * ScrollArea must also be h-full so Radix's internal Viewport
           * gets size-full (width+height) and the scrollbar appears correctly.
           */}
          <ScrollArea className="h-full">
            <div className="px-5 pb-5 pt-5">
              {/* Header card */}
              <div className="border-border bg-card mb-4 overflow-hidden rounded-md border">
                <div className="bg-primary px-4 py-3">
                  <Link
                    href={`/course/${course.id}/learn`}
                    className="mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-primary-foreground/70 uppercase transition-colors hover:text-primary-foreground"
                  >
                    <ArrowLeft className="size-3" />
                    Back to Curriculum  
                  </Link>
                  <p className="truncate text-base font-bold leading-snug text-primary-foreground">
                    {day.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-primary-foreground/70">
                    {week.title.replace(":", " —")}
                  </p>
                </div>
                <div className="px-4 py-2.5">
                  <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">
                      {completeCount}/{modules.length}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-muted-foreground mb-2 flex items-center gap-2 px-1 text-[11px] font-bold tracking-widest uppercase">
                <LayoutList className="size-3.5" />
                Lessons
              </div>

              <nav className="grid gap-1.5">
                {day.subModules.map((mod) => (
                  <SidebarSubModuleItem
                    key={mod.id}
                    module={mod}
                    courseId={course.id}
                    weekId={week.id}
                    isActive={mod.id === subModule.id}
                    isComplete={isSubModuleComplete(mod.id)}
                    dayId={day.id}
                    daySubModulesIds={day.subModules.map((m) => m.id)}
                  />
                ))}
              </nav>
            </div>
          </ScrollArea>
        </aside>

        {/* ── MAIN CONTENT — scrolls independently ── */}
        <div className="min-w-0 flex-1 overflow-y-auto scrollbar-minimal">
          <div className="w-full space-y-4 px-5 py-5 md:pt-5">
            {/* Lesson header */}
            <div className="bg-card ring-foreground/10 rounded-md ring-1">
              <div className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-primary uppercase">
                    <ContentIcon className="size-3" aria-hidden />
                    {TYPE_LABELS[subModule.type] ?? subModule.type}
                  </span>
                  {complete && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-primary uppercase">
                      <CheckCircle2 className="size-3" aria-hidden />
                      Completed
                    </span>
                  )}
                </div>
                <h1 className="text-foreground mt-1.5 text-base font-bold leading-snug">
                  {subModule.title}
                </h1>
                {/* {subModule.duration && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Estimated time · {subModule.duration}
                  </p>
                )} */}
              </div>
            </div>

            {/* Content renderer */}
            <div className="relative bg-card rounded-md border border-border overflow-hidden min-h-[400px]">
              {isLoading ? (
                /* ── Skeleton shown while new lesson data is fetching ── */
                <div className="p-6 space-y-5 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-3 w-16 rounded bg-muted" />
                    <div className="h-6 w-2/3 rounded bg-muted" />
                  </div>
                  <div className="h-px w-full bg-border" />
                  <div className="space-y-3">
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-[90%] rounded bg-muted" />
                    <div className="h-4 w-[80%] rounded bg-muted" />
                  </div>
                  <div className="h-48 w-full rounded-md bg-muted" />
                  <div className="space-y-3">
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-[85%] rounded bg-muted" />
                    <div className="h-4 w-[70%] rounded bg-muted" />
                    <div className="h-4 w-[95%] rounded bg-muted" />
                  </div>
                </div>
              ) : subModule.type === "video" ? (
                <div className="space-y-5">
                  <VideoPlayer module={subModule} />
                  {subModule.attachedFiles?.length ? (
                    <FileViewer files={subModule.attachedFiles} title="Lesson Attachments" />
                  ) : null}
                </div>
              ) : subModule.type === "doc" || subModule.type === "lesson" ? (
                <div className="space-y-5">
                  {subModule.sections?.length ? (
                    <LessonSectionViewer
                      sections={subModule.sections}
                      pagePadding={subModule.pagePadding}
                      pageBgColor={subModule.pageBgColor}
                    />
                  ) : (
                    <DocViewer content={subModule.content ?? ""} />
                  )}
                  {subModule.attachedFiles?.length ? (
                    <FileViewer files={subModule.attachedFiles} title="Lesson Attachments" />
                  ) : null}
                </div>
              ) : subModule.type === "mixed" ? (
                <div className="space-y-10">
                  {(subModule.blocks ?? []).map((block, bIdx) => (
                    <div key={bIdx} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                          {block.title}
                        </h3>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      {block.kind === "video" ? (
                        <VideoPlayer
                          module={{
                            ...subModule,
                            videoUrl: block.videoUrl,
                            description: block.description,
                          }}
                        />
                      ) : (
                        <DocViewer content={block.content} />
                      )}
                    </div>
                  ))}
                  {subModule.attachedFiles?.length ? (
                    <FileViewer files={subModule.attachedFiles} title="Lesson Attachments" />
                  ) : null}
                </div>
              ) : subModule.type === "quiz" ? (
                <QuizViewer
                  moduleId={subModule.id}
                  courseId={course.id}
                  weekId={week.id}
                  dayId={day.id}
                  quizData={subModule.quizData ?? { questions: [], passingScore: 70 }}
                  onPass={() =>
                    markSubModuleComplete(subModule.id, day.id, day.subModules.map((m) => m.id))
                  }
                />
              ) : subModule.type === "assignment" ? (
                <AssignmentViewer
                  module={subModule}
                  courseId={course.id}
                  weekId={week.id}
                  dayId={day.id}
                  onApprovedComplete={() =>
                    markSubModuleComplete(subModule.id, day.id, day.subModules.map((m) => m.id))
                  }
                />
              ) : (
                <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  Unknown content type
                </div>
              )}

              {subModule.externalLinks?.length ? (
                <section>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      External Resources
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subModule.externalLinks.map((link) => (

                      <a key={link.url}
                        href={link.url}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="group flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        <ExternalLink className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER — shrink-0 means it never participates in the flex-1 height race ── */}
      <div className="shrink-0 border-t border-border bg-card px-4 py-3 sm:px-5">
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="justify-self-start">
            {previous ? (
              <Link
                className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                href={`/course/${course.id}/learn/${week.id}/${previous.module.id}`}
              >
                <ChevronLeft className="size-4 shrink-0" />
                <span className="hidden sm:inline">Previous</span>
              </Link>
            ) : null}
          </div>

          <div className="justify-self-center">
            {subModule.type !== "quiz" && subModule.type !== "assignment" ? (
              <Button
                onClick={() =>
                  markSubModuleComplete(subModule.id, day.id, day.subModules.map((m) => m.id))
                }
                type="button"
                className={cn(
                  "h-11 px-8 text-sm md:text-base min-w-[160px] gap-2 font-bold active:scale-95",
                  complete && "opacity-90"
                )}
              >
                {complete && <CheckCircle2 className="size-4 shrink-0" />}
                {complete ? "Completed" : "Mark Complete"}
              </Button>
            ) : (
              <div className="flex items-center justify-center">
                {complete ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                    <CheckCircle2 className="size-3.5" /> Completed
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {subModule.type === "quiz" ? "Pass the quiz to complete" : "Awaiting approval"}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="justify-self-end">
            {next ? (
              next.day.id !== day.id && !day.subModules.every((m) => isSubModuleComplete(m.id)) ? (
                <span className="flex cursor-not-allowed items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-semibold text-muted-foreground opacity-50">
                  <Lock className="size-3.5 shrink-0" />
                  <span className="hidden sm:inline">Locked</span>
                </span>
              ) : (
                <Link
                  className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  href={`/course/${course.id}/learn/${week.id}/${next.module.id}`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="size-4 shrink-0" />
                </Link>
              )
            ) : (
              <Button asChild className="h-11 px-8 text-sm md:text-base gap-1.5 font-bold active:scale-95">
                <Link href={`/course/${course.id}/learn`}>
                  Finish Week
                  <ChevronRight className="size-4 shrink-0" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}