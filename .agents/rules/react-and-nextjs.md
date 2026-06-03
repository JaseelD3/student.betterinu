---
trigger: always_on
---

# React & Next.js Patterns

## Server vs Client Components

- Default to **Server Components**. Only add `"use client"` when the file uses
  state, effects, refs, browser APIs, event handlers, or context.
- The `"use client"` directive is the **first line** of the file, followed by a
  blank line.
- Server-only files (e.g. `lib/auth/firebase-admin.ts`, `app/api/**/route.ts`)
  must NEVER end up in a client bundle.

### RSC → Client prop boundary

A Server Component may pass only **plain serializable values** as props to a
Client Component. React component references (icons, anything with `$$typeof`)
are NOT serializable and will throw at render time.

### Fix A (preferred) — re-export icons through a `"use client"` boundary

```ts
// components/navbar/icons.ts
"use client"

export { LayoutDashboard, Users, Book, BarChart } from "lucide-react"
```

Import from this file (not directly from `lucide-react`) when the
consuming layout is a Server Component.

### Fix B — mark the wrapper `"use client"`

Use when the file has no server-only work (no DB calls, no `redirect()`).

## App Router File Conventions

- Tenant trees: `app/admin/` and `app/student/`. Route group `(home)` attaches
  the authed shell without affecting the URL.
- Every route segment MUST have `page.tsx`, `loading.tsx`, `error.tsx`.
  `not-found.tsx` is required where a 404 is reachable (dynamic segments).
  See `next-structure.md` for templates.
- Dynamic params are `Promise`-typed in Next.js 16 — always `await params`.

## Layout Choice

| Use case                          | Layout component |
| --------------------------------- | ---------------- |
| Authed admin or student tenant    | `NavbarLayout`   |
| Authed legacy / sidebar feature   | `MainLayout`     |
| Forms with sticky save/cancel bar | `FormLayout`     |
| Login / forgot / onboarding pages | `AuthLayout`     |

Always reuse these — do not assemble shells inline in pages.

## Standard Page Body

```tsx
export default async function Page() {
  return (
    <div className="flex min-h-0 w-full flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="…"
        description="…"
        actions={<Button size="sm">…</Button>}
      />
      {/* page sections */}
    </div>
  )
}
```

## Tenant Detection

Never re-parse the `host` header in Server Components. Read the `x-tenant`
header set by middleware:

```ts
import { headers } from "next/headers"
import { TENANT_HEADER, type Tenant } from "@/lib/tenant"

export async function getCurrentTenant(): Promise<Tenant | null> {
  const h = await headers()
  const value = h.get(TENANT_HEADER)
  return value === "admin" || value === "student" ? value : null
}
```

In Edge middleware (`middleware.ts`) use
`getTenantFromHost(request.headers.get("host"))`.

## Component Authoring

- Named function components only (no `React.FC`, no arrow-default-export).
- Props type defined immediately above with the suffix `Props`.
- One component per file; co-locate small helpers only when not reused.
- Compose from `@/components/ui/*` (see `ui-components.md`).

## Hooks

- Files in `hooks/` are `use-*.ts(x)` and export the hook as a named export.
- Re-export third-party hooks through `hooks/` to keep import paths stable.
- `useCallback` / `useMemo` only when memoization is justified.

## Context Providers

- Live in `context/<name>-provider.tsx` and marked `"use client"`.
- Export both `XProvider` and `useX()`. The hook MUST throw if used outside
  its provider.

### Global providers (in `app/layout.tsx`) — mount ONCE

```
ThemeProvider → LayoutProvider → TooltipProvider → NavigationProgress → children
```

Do NOT re-wrap these in tenant or feature layouts.

## API Route Handlers

- `app/api/<domain>/<action>/route.ts` — named HTTP verbs only.
- Never put business logic in a handler — delegate to `lib/<domain>/service.ts`.
- Initialize Firebase Admin via `getAdminAuth()` from `@/lib/auth/firebase-admin`.
- Use `prisma` from `@/lib/db` — no ad-hoc `PrismaClient` instantiation.
