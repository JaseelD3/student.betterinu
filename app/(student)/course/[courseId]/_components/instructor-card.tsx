import type { Course } from "@/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type InstructorCardProps = {
  course: Course
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function InstructorCard({ course }: InstructorCardProps) {
  if (!course.instructor) return null

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-foreground text-sm font-bold">
          Instructor
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {getInitials(course.instructor)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-foreground text-sm font-semibold">
              {course.instructor}
            </p>
            {course.instructorBio && (
              <>
                <Separator className="my-2" />
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {course.instructorBio}
                </p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
