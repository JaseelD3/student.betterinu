import type { CSSProperties } from "react"
import Image from "next/image"
import { DM_Sans, DM_Serif_Display } from "next/font/google"

import { BookOpen, Clock, Laptop, User } from "lucide-react"

import { Card } from "@/components/ui/card"
import { EnrollButton } from "./enroll-button"
import type { Course } from "@/types"

const dmSerif = DM_Serif_Display({ weight: ["400"], subsets: ["latin"] })
const dmSans = DM_Sans({ weight: ["400", "500"], subsets: ["latin"] })

export function CourseHero({ course }: { course: Course }) {
  const lessonCount = course.totalModules
  const projectCount =
    course.weeks
      .flatMap((w) => w.days.flatMap((d) => d.subModules))
      .filter((sm) => sm.type === "exercise" || sm.type === "assignment")
      .length || 8

  return (
    <Card className="overflow-hidden py-0">
      <div className={`grid grid-cols-1 lg:grid-cols-[1fr_420px] lg:items-stretch `}>
        {/* Left: Content */}
        <section className="px-3 py-5 sm:px-5">
          {/* Track badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium tracking-widest text-primary uppercase">
            <BookOpen className="size-3" aria-hidden />
            Course Track
          </span>

          {/* Title */}
          <h1
            className={`text-foreground mt-3 text-[40px] leading-[1.1] font-bold tracking-tight`}
            style={
              { "--course-color": `var(${course.color})` } as CSSProperties
            }
          >
            {course.title}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mt-3 max-w-xl text-[15px] leading-relaxed">
            {course.description}
          </p>

          {/* Meta chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="border-border bg-muted/50 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px]">
              <User className="size-3.5" aria-hidden />
              {course.instructor}
            </span>
            <span className="border-border bg-muted/50 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px]">
              <Clock className="size-3.5" aria-hidden />
              {course.duration}
            </span>
          </div>

          {/* Divider */}
          <div className="bg-border my-4 h-px" />

          {/* CTA row */}
          <div className="flex items-center gap-4">
            <EnrollButton
              courseId={course.id}
              size="lg"
              className="w-auto"
            />
          </div>
        </section>

        {/* Right: Thumbnail — flush, full height, no border */}
        {course.image && (
          <div className="relative hidden min-h-[250px] lg:block ">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>
    </Card>
  )
}
