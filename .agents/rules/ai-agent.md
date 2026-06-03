---
trigger: always_on
---

# AI Agent Guidelines

This codebase is built with AI coding agents. These rules ensure agents produce
consistent, verifiable, reviewable output without ambiguity.

## Principle 1 — Read Before Write

Before creating or editing ANY file:

1. Read the target file in full if it exists.
2. Read the closest relevant rule file.
3. Read at least one existing file in the same directory as a style reference.

Never generate code from memory alone.

## Principle 2 — One Task, One Change Set

Each agent task MUST be atomic — it completes exactly one logical unit of
work (one page, one component, one API route). Do not bundle unrelated changes.

**Checklist before starting a task:**

- [ ] What file(s) will be created or edited?
- [ ] What rule(s) govern those files?
- [ ] What existing component/hook can be reused?
- [ ] Will this task introduce a new shadcn component? (if yes: `npx shadcn@latest add`)
- [ ] Does the route need `loading.tsx` + `error.tsx`?

## Principle 3 — No Assumptions, No Inventions

| Never invent               | Always look up                   |
| -------------------------- | -------------------------------- |
| A CSS variable name        | Check `app/globals.css`          |
| A component API / props    | Check `components/ui/<name>.tsx` |
| A DB schema field          | Check `prisma/schema.prisma`     |
| An env var name            | Check `.env.example`             |
| A Prisma model relation    | Check the schema, don't guess    |
| An existing hook signature | Check `hooks/use-*.ts`           |

If something is missing (token, component, schema field), STOP and add it
following the pattern in the relevant rule — don't work around it.

## Principle 4 — Styling Checklist (run for every JSX block)

- [ ] No hardcoded hex/rgb/oklch color values in JSX
- [ ] No `style={{ color, background, border, padding, fontSize, borderRadius }}`
- [ ] All colors come from token utilities (`bg-background`, `text-foreground`, …)
- [ ] All spacing uses Tailwind scale (`p-4`, `gap-6`, not `p-[18px]`)
- [ ] All radius uses `rounded-*` mapped to `--radius` token
- [ ] `cn()` used wherever class props are merged
- [ ] Dark mode works without extra `dark:` overrides (tokens handle it)

## Principle 5 — Component Checklist

- [ ] Uses shadcn primitive from approved list (see `ui-components.md`)
- [ ] Props typed with `type FooProps = { … }` above the component
- [ ] Named function export (no `export default` except Next required files)
- [ ] No `any`, no `@ts-ignore`, no `// eslint-disable`
- [ ] Icons ONLY from `lucide-react`
- [ ] Wrapped in correct layout (`NavbarLayout`, `FormLayout`, etc.)

## Principle 6 — Route Checklist

- [ ] `page.tsx` created
- [ ] `loading.tsx` created with `Skeleton`-based layout mirror
- [ ] `error.tsx` created with `"use client"` + reset button
- [ ] `not-found.tsx` created (where 404 is reachable)
- [ ] `metadata` exported from `page.tsx`
- [ ] Dynamic `params` properly `await`-ed

## Principle 7 — Verification After Every Task

After writing all files for a task, run in order:

```bash
pnpm typecheck   # must exit 0
pnpm lint        # fix all NEW lint errors introduced (not pre-existing)
pnpm format      # auto-fix formatting
```

Report any errors that cannot be auto-fixed before marking the task complete.

## Principle 8 — Reporting Format

Every completed task MUST end with:

1. **Summary** — one sentence describing what was built.
2. **File tree** — showing created (✦) and edited (✎) files.
3. **Verification result** — `typecheck ✓`, `lint ✓`, `format ✓` or describe failures.

```
Built the Courses list page with skeleton loading and error boundary.

app/
└── admin/
    └── (home)/
        └── courses/
            ├── page.tsx             ✦ created
            ├── loading.tsx          ✦ created
            ├── error.tsx            ✦ created
            └── _components/
                └── course-grid.tsx  ✦ created

typecheck ✓  lint ✓  format ✓
```

## Principle 9 — Forbidden Shortcuts

These are HARD blocks — the agent must never do them regardless of context:

- Do NOT `git commit` or `git push`
- Do NOT `npm install` / `pnpm add` without listing the package and version
- Do NOT copy a shadcn component manually — use `npx shadcn@latest add`
- Do NOT edit files in `components/ui/*` — only wrap them
- Do NOT use `@tabler/icons-react` — use `lucide-react` exclusively
- Do NOT use the `style` attribute for theming
- Do NOT skip `loading.tsx` or `error.tsx` on a new route
- Do NOT leave a `TODO` comment without filing a follow-up task description

## Principle 10 — When Stuck

If the correct approach is unclear, output a short decision matrix and wait
for human confirmation. Do not guess and proceed.

```
Unclear: Should CourseCard live in components/lms/ or components/admin/?

Option A — components/lms/course-card.tsx
  Pro: domain-neutral, reusable across admin + student tenants
  Con: adds a new domain folder

Option B — components/admin/course-card.tsx
  Pro: consistent with existing admin component location
  Con: not reusable if student tenant needs it

Recommendation: Option A (it's referenced in both admin and student routes)
Waiting for confirmation before proceeding.
```
