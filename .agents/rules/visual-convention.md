---
trigger: always_on
---

# Visual Conventions

Project-specific density, component defaults, animation, and scroll patterns.
For token enforcement see `styling.md`. For approved components see `ui-components.md`.

## Visual Density

- Default body type: `text-xs` / `text-xs/relaxed`.
- Headings use `font-heading` and stay small (`text-base`–`text-xl`).
- `Card` defaults to `rounded-none` + `ring-1 ring-foreground/10`.
  Use `<Card size="sm">` for tighter padding inside grids.
- `Item variant="outline"` is the canonical row in lists (review queues,
  module lists, task lists).
- Button sizes by context:
  - Primary page CTA → `size="default"`
  - In-card action → `size="sm"`
  - Inline row action → `size="xs"`
  - Icon-only → `size="icon"` / `size="icon-sm"` / `size="icon-xs"`

## Icon Sizes

Icons from `lucide-react` only. Standard sizes:

| Context             | Size class |
| ------------------- | ---------- |
| Inline with text xs | `size-3`   |
| Inline with text sm | `size-3.5` |
| Standard UI icon    | `size-4`   |
| Prominent / heading | `size-5`   |

Pass icons as components (not JSX elements) when configuring data-driven menus:

```tsx
// ✅ component reference — serializable across RSC boundary
{ title: "Students", url: "/students", icon: Users }

// ❌ JSX element — not serializable
{ title: "Students", url: "/students", icon: <Users /> }
```

## Multi-State Components — `cva`

For components with multiple visual states, define a `cva()` near the top of
the file. Expose `data-variant` and `data-size` attributes when consumers may
want to style descendants.

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border-border text-foreground border",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)
```

## CSS Modules — Animation Only

Use a CSS module **only** for component-local keyframes or animations that
cannot be expressed as Tailwind utilities. Co-locate the `.module.css` file
next to the component and import as `styles`.

```tsx
// components/loading/robo-loader.tsx
import styles from "./robo-loader.module.css"
;<div className={styles.spin} />
```

Always respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .spin {
    animation: none;
  }
}
```

## Sticky / Scroll Containers

The pattern below keeps the page body scrollable while navbar, breadcrumb,
and footer stay sticky. Preserve it whenever editing scroll containers.

```tsx
// Outer shell (NavbarLayout, FormLayout)
<div className="flex min-h-screen flex-col">
  <Navbar /> {/* sticky top */}
  <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
  <Footer /> {/* sticky bottom if present */}
</div>
```

The key classes: `min-h-0` removes the implicit `min-height: auto` that
breaks flex overflow, `flex-1` lets the main area grow, `overflow-y-auto`
makes only that region scroll.

## Form Inputs

Wrap every input in `<Field>` with `<FieldLabel>` and optionally
`<FieldDescription>`. Source components from:

- `@/components/ui/field`
- `@/components/ui/input`
- `@/components/ui/input-group`
- `@/components/ui/select`
- `@/components/ui/textarea`

```tsx
<Field>
  <FieldLabel>Course Title</FieldLabel>
  <FieldDescription>Shown on the student dashboard.</FieldDescription>
  <Input placeholder="Introduction to React" {...field} />
</Field>
```
