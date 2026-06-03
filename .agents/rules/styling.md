---
trigger: always_on
---

# Styling Rules

## CSS Variables — Mandatory

All visual properties MUST come from the CSS custom properties defined in
`app/globals.css`. Never use raw color values, hardcoded pixel values for
spacing/radius, or the `style` attribute for anything a Tailwind utility or
CSS variable can express.

### Forbidden patterns

```tsx
// ❌ NEVER — hardcoded color
<div className="bg-zinc-900 text-white border-gray-200" />
<div className="text-[#1a1a1a]" />

// ❌ NEVER — inline style for visual properties
<div style={{ color: "#fff", background: "black", borderRadius: "8px" }} />
<div style={{ padding: "16px", fontSize: "14px" }} />

// ❌ NEVER — arbitrary Tailwind values that bypass the token system
<div className="bg-[#3b82f6] rounded-[12px] p-[18px]" />
```

### Required patterns

```tsx
// ✅ CORRECT — semantic token classes
<div className="bg-background text-foreground border border-border" />
<div className="bg-card text-card-foreground rounded-md p-4" />
<div className="bg-primary text-primary-foreground hover:bg-primary/90" />
```

### Token Reference

Use ONLY these token-backed Tailwind utilities:

| Category    | Utility classes                                                       |
| ----------- | --------------------------------------------------------------------- |
| Backgrounds | `bg-background` `bg-card` `bg-popover` `bg-muted` `bg-accent`         |
| Primary     | `bg-primary` `text-primary-foreground` `hover:bg-primary/90`          |
| Secondary   | `bg-secondary` `text-secondary-foreground`                            |
| Destructive | `bg-destructive` `text-destructive` `bg-destructive/10`               |
| Text        | `text-foreground` `text-muted-foreground` `text-accent-foreground`    |
| Borders     | `border-border` `border-input` `ring-ring` `outline-ring/50`          |
| Sidebar     | `bg-sidebar` `text-sidebar-foreground` `border-sidebar-border`        |
| Chart       | `text-chart-1` through `text-chart-5`                                 |
| Radius      | `rounded-sm` `rounded-md` `rounded-md` `rounded-md` (from `--radius`) |

> If a token is missing, ADD it to `app/globals.css` — do not hardcode.

## Dark Mode

Dark mode is controlled by the `.dark` class on `<html>` (managed by
`next-themes`). Every new token MUST have both a light (`:root`) and dark
(`.dark`) value in `globals.css`.

```css
/* globals.css */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

Use the `dark:` Tailwind variant ONLY for tweaks that the token system cannot
express. Prefer adding a new token pair instead.

## Class Merging

Always use `cn()` from `@/lib/utils` when combining static classes with props
or conditional classes. Never string-concatenate Tailwind classes.

```tsx
// ❌ BAD
<div className={`flex items-center ${isActive ? "bg-primary" : "bg-muted"}`} />

// ✅ GOOD
<div className={cn("flex items-center", isActive ? "bg-primary" : "bg-muted")} />
```

## No `style` Attribute for Theming

The `style` attribute is ONLY permitted for:

- Dynamically computed numeric values that cannot be expressed as a class
  (e.g. `style={{ "--progress": `${value}%` }}` for a CSS variable passthrough)
- CSS animations with dynamic keyframe values

Everything else — color, spacing, border, radius, shadow, font — must use
Tailwind utilities backed by CSS tokens.

## Adding New Design Tokens

1. Define in `app/globals.css` under `@theme inline { … }` (for Tailwind
   utilities) and in `:root` / `.dark` (for the OKLCH values).
2. Use the new utility immediately — never reference `var(--foo)` inline in JSX.

```css
/* globals.css — add token */
@theme inline {
  --color-brand-surface: var(--brand-surface);
}
:root {
  --brand-surface: oklch(0.97 0.01 250);
}
.dark {
  --brand-surface: oklch(0.18 0.02 250);
}
```

```tsx
/* component — consume token */
<div className="bg-brand-surface" />
```
