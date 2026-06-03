---
trigger: always_on
---

# Next.js App Router Structure

## Mandatory Route Files

Every route segment that renders a page MUST include ALL of the following
files. Never ship a `page.tsx` without its companions.

```
app/
└── admin/
    └── (home)/
        └── courses/
            ├── page.tsx          ← required: the page
            ├── loading.tsx       ← required: Suspense fallback
            ├── error.tsx         ← required: error boundary
            └── not-found.tsx     ← required: 404 boundary (dynamic segments)
```

## `loading.tsx` — Skeleton, Not a Spinner

Use `Skeleton` from `@/components/ui/skeleton` to mirror the page's real
layout. Never show a generic spinner — the skeleton must match the shape of
the content it replaces.

```tsx
// app/admin/(home)/courses/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-0 w-full flex-col gap-6 p-4 sm:p-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}
```

## `error.tsx` — Always a Client Component

`error.tsx` MUST be `"use client"` (Next.js requirement — it receives an
`Error` prop and a `reset` function from the error boundary).

```tsx
"use client"

import { Button } from "@/components/ui/button"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-0 w-full flex-col items-center justify-center gap-4 p-6">
      <p className="text-muted-foreground text-sm">{error.message}</p>
      <Button variant="outline" size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
```

## `not-found.tsx` — Server Component

```tsx
// app/admin/(home)/courses/[courseId]/not-found.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-0 w-full flex-col items-center justify-center gap-4 p-6">
      <p className="text-muted-foreground text-sm">Course not found.</p>
      <Button asChild variant="outline" size="sm">
        <Link href="/courses">Back to Courses</Link>
      </Button>
    </div>
  )
}
```

## Route Segment Naming

| Segment type   | Convention     | Example                     |
| -------------- | -------------- | --------------------------- |
| Route group    | `(group-name)` | `(home)`, `(auth)`          |
| Dynamic param  | `[paramName]`  | `[courseId]`, `[lessonId]`  |
| Catch-all      | `[...slug]`    | `[...path]`                 |
| Parallel route | `@slot`        | `@modal`                    |
| Private folder | `_folder`      | `_components` (not a route) |

## Dynamic Params (Next.js 16)

`params` is always `Promise`-typed. Always `await` it.

```tsx
type PageProps = {
  params: Promise<{ courseId: string }>
  searchParams: Promise<{ tab?: string }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { courseId } = await params
  const { tab = "overview" } = await searchParams
}
```

## Layout Nesting Rules

- The root `app/layout.tsx` mounts global providers ONCE:
  `ThemeProvider → LayoutProvider → TooltipProvider → children`
- Tenant layouts mount `NavbarLayout` or `MainLayout`.
- **Never re-mount global providers in tenant layouts.** They are already
  available via the root layout.
- Sub-feature layouts may add a `FormLayout` or tab shell but must NOT add
  shell navigation again.

## Metadata

Every `page.tsx` SHOULD export a `metadata` object or `generateMetadata`
function.

```tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Courses | Admin",
  description: "Manage all courses and their content.",
}
```

## Route Handlers

- Live at `app/api/<domain>/<action>/route.ts`.
- Export named HTTP verbs only: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- Never put business logic in a handler — delegate to `lib/<domain>/service.ts`.

```ts
// app/api/courses/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createCourse } from "@/lib/courses/service"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const course = await createCourse(body)
  return NextResponse.json(course, { status: 201 })
}
```

## Colocation Rules

```
app/admin/(home)/courses/
├── page.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
├── _components/           ← route-private components (not shared)
│   ├── course-grid.tsx
│   └── course-filters.tsx
└── [courseId]/
    ├── page.tsx
    ├── loading.tsx
    ├── error.tsx
    └── not-found.tsx
```

Use `_components/` for components only used by that route segment.
Promote to `components/<domain>/` the moment they are reused elsewhere.
