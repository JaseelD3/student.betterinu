---
trigger: always_on
---

# Data Fetching — TanStack Query + Axios

All server state is managed through **TanStack Query** (`@tanstack/react-query`).
All HTTP requests go through a shared **Axios** instance. Never fetch directly
with `fetch()` in client components, never use `useEffect` for data fetching.

---

## Axios — Shared Instance

One Axios instance for the entire app. Never call `axios.get()` / `axios.post()`
directly from components or hooks — always go through the shared instance.

```ts
// lib/axios.ts
import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

// Request interceptor — attach auth token if needed
api.interceptors.request.use((config) => {
  // e.g. attach Firebase ID token here
  return config
})

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Unknown error"
    return Promise.reject(new Error(message))
  }
)
```

---

## Query Keys — Centralized Factory

All query keys live in one file. Never inline string arrays as query keys
directly in hooks — always reference the factory.

```ts
// lib/query-keys.ts
export const queryKeys = {
  courses: {
    all: () => ["courses"] as const,
    list: (filters?: object) => ["courses", "list", filters] as const,
    detail: (id: string) => ["courses", "detail", id] as const,
  },
  students: {
    all: () => ["students"] as const,
    list: (filters?: object) => ["students", "list", filters] as const,
    detail: (id: string) => ["students", "detail", id] as const,
  },
  lessons: {
    byCourse: (courseId: string) => ["lessons", courseId] as const,
    detail: (id: string) => ["lessons", "detail", id] as const,
  },
} as const
```

---

## API Service Functions

Data-fetching logic lives in `lib/<domain>/api.ts` — not inside hooks, not
inside components. Hooks call service functions; service functions call `api`.

```ts
// lib/courses/api.ts
import { api } from "@/lib/axios"
import type { Course, CreateCourseInput } from "@/types/course"

export async function fetchCourses(): Promise<Course[]> {
  const { data } = await api.get<Course[]>("/courses")
  return data
}

export async function fetchCourse(id: string): Promise<Course> {
  const { data } = await api.get<Course>(`/courses/${id}`)
  return data
}

export async function createCourse(input: CreateCourseInput): Promise<Course> {
  const { data } = await api.post<Course>("/courses", input)
  return data
}

export async function updateCourse(
  id: string,
  input: Partial<CreateCourseInput>
): Promise<Course> {
  const { data } = await api.patch<Course>(`/courses/${id}`, input)
  return data
}

export async function deleteCourse(id: string): Promise<void> {
  await api.delete(`/courses/${id}`)
}
```

---

## Query Hooks — `hooks/use-*.ts`

One hook file per domain. Export named hooks only.

```ts
// hooks/use-courses.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
  fetchCourses,
  fetchCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/lib/courses/api"
import type { CreateCourseInput } from "@/types/course"

export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses.list(),
    queryFn: fetchCourses,
  })
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => fetchCourse(id),
    enabled: Boolean(id),
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all() })
    },
  })
}

export function useUpdateCourse(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<CreateCourseInput>) => updateCourse(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all() })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all() })
    },
  })
}
```

---

## Provider Setup

Wrap the app in `QueryClientProvider` once — in `app/layout.tsx` via a
client boundary wrapper. Never instantiate `QueryClient` inside a component.

```tsx
// context/query-provider.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
```

```tsx
// app/layout.tsx — add QueryProvider to the global provider stack
<ThemeProvider>
  <QueryProvider>
    {" "}
    {/* ← add here */}
    <LayoutProvider>
      <TooltipProvider>
        <NavigationProgress />
        {children}
      </TooltipProvider>
    </LayoutProvider>
  </QueryProvider>
</ThemeProvider>
```

---

## Using Queries in Components

Components are always `"use client"` when using query hooks.
Always handle all three states: loading, error, and success.
Use `Skeleton` for loading and the shadcn error pattern for errors.

```tsx
"use client"

import { useCourses } from "@/hooks/use-courses"
import { Skeleton } from "@/components/ui/skeleton"

export function CourseList() {
  const { data: courses, isLoading, isError, error } = useCourses()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-md" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-destructive text-sm">
        {error instanceof Error ? error.message : "Failed to load courses."}
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

---

## Mutations in Forms

Use `useMutation` with react-hook-form. Call `mutate` / `mutateAsync` in the
form's `onSubmit` handler. Show loading state on the submit button.

```tsx
"use client"

import { useForm } from "react-hook-form"
import { useCreateCourse } from "@/hooks/use-courses"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export function CreateCourseForm() {
  const form = useForm<CreateCourseInput>()
  const { mutate, isPending } = useCreateCourse()

  function onSubmit(values: CreateCourseInput) {
    mutate(values, {
      onSuccess: () => form.reset(),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Creating…" : "Create Course"}
        </Button>
      </form>
    </Form>
  )
}
```

---

## Cache Invalidation Rules

| Action          | Invalidate                                |
| --------------- | ----------------------------------------- |
| Create resource | `queryKeys.<domain>.all()`                |
| Update resource | `queryKeys.<domain>.all()` + `detail(id)` |
| Delete resource | `queryKeys.<domain>.all()`                |
| Bulk action     | `queryKeys.<domain>.all()`                |

Use `invalidateQueries` as the default. Only use `setQueryData` for optimistic
updates where instant feedback is required and the mutation is low-risk.

---

## Rules Summary — Hard Stops

- **Never** use `fetch()` inside a Client Component for server state
- **Never** use `useEffect` to fetch data
- **Never** call `axios` directly — always go through `lib/axios.ts`
- **Never** inline query keys as string arrays — always use `queryKeys` factory
- **Never** put fetch logic inside a component — always in `lib/<domain>/api.ts`
- **Never** create a new `QueryClient` inside a component
- **Never** skip handling `isLoading` and `isError` states in a component
