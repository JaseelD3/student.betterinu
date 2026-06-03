---
trigger: always_on
---

# UI Components — shadcn/ui

## The Golden Rule

Before writing any UI element, check `components/ui/*` for an existing
primitive. If it exists there, USE IT — never reimplement it inline.

```tsx
// ❌ BAD — reimplementing Button
;<button className="bg-primary rounded-md px-4 py-2 text-white">Save</button>

// ✅ GOOD — shadcn primitive
import { Button } from "@/components/ui/button"
;<Button variant="default" size="sm">
  Save
</Button>
```

## Approved Component Set

These are the ONLY UI primitives allowed. For anything not on this list,
check shadcn docs first and add via `npx shadcn@latest add <component>`.

### Basic UI

| Component  | Import path                |
| ---------- | -------------------------- |
| `Button`   | `@/components/ui/button`   |
| `Input`    | `@/components/ui/input`    |
| `Textarea` | `@/components/ui/textarea` |
| `Label`    | `@/components/ui/label`    |
| `Badge`    | `@/components/ui/badge`    |
| `Avatar`   | `@/components/ui/avatar`   |

### Forms

| Component    | Import path                    |
| ------------ | ------------------------------ |
| `Form`       | `@/components/ui/form`         |
| `Select`     | `@/components/ui/select`       |
| `Checkbox`   | `@/components/ui/checkbox`     |
| `RadioGroup` | `@/components/ui/radio-group`  |
| `Switch`     | `@/components/ui/switch`       |
| `Slider`     | `@/components/ui/slider`       |
| `Calendar`   | `@/components/ui/calendar`     |
| `DatePicker` | compose `Popover` + `Calendar` |
| `InputOTP`   | `@/components/ui/input-otp`    |

### Overlays

| Component     | Import path                    |
| ------------- | ------------------------------ |
| `Dialog`      | `@/components/ui/dialog`       |
| `Sheet`       | `@/components/ui/sheet`        |
| `Drawer`      | `@/components/ui/drawer`       |
| `Popover`     | `@/components/ui/popover`      |
| `Tooltip`     | `@/components/ui/tooltip`      |
| `HoverCard`   | `@/components/ui/hover-card`   |
| `AlertDialog` | `@/components/ui/alert-dialog` |

### Navigation

| Component        | Import path                       |
| ---------------- | --------------------------------- |
| `Tabs`           | `@/components/ui/tabs`            |
| `DropdownMenu`   | `@/components/ui/dropdown-menu`   |
| `NavigationMenu` | `@/components/ui/navigation-menu` |
| `Menubar`        | `@/components/ui/menubar`         |
| `Breadcrumb`     | `@/components/ui/breadcrumb`      |
| `Command`        | `@/components/ui/command`         |

### Data Display

| Component     | Import path                   |
| ------------- | ----------------------------- |
| `Card`        | `@/components/ui/card`        |
| `Table`       | `@/components/ui/table`       |
| `Accordion`   | `@/components/ui/accordion`   |
| `Collapsible` | `@/components/ui/collapsible` |
| `Progress`    | `@/components/ui/progress`    |
| `Skeleton`    | `@/components/ui/skeleton`    |
| `Separator`   | `@/components/ui/separator`   |
| `ScrollArea`  | `@/components/ui/scroll-area` |

## Extending Primitives

To add app-specific behavior wrap the primitive — never edit `components/ui/*`
directly (it gets overwritten by `npx shadcn@latest add`).

```tsx
// components/lms/course-card.tsx — wraps Card, adds domain logic
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CourseCard({ title, status }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>
        <Badge variant="outline">{status}</Badge>
      </CardContent>
    </Card>
  )
}
```

## Variants and Sizes

Always pass explicit `variant` and `size` props — never leave them to implicit
defaults when context demands a specific appearance.

```tsx
// Page-level CTA
<Button variant="default" size="default">Enroll Now</Button>

// In-card action
<Button variant="outline" size="sm">View Details</Button>

// Inline row action
<Button variant="ghost" size="icon-xs"><Edit size={14} /></Button>

// Destructive confirmation
<Button variant="destructive" size="sm">Delete Course</Button>
```

## Form Fields

Wrap every form input in `Form` (react-hook-form) with `FormField`,
`FormItem`, `FormLabel`, `FormControl`, and `FormMessage`.

```tsx
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
```

## Installing New Components

```bash
npx shadcn@latest add <component-name>
```

After adding, verify the new file appeared in `components/ui/` and commit it.
Do NOT copy-paste shadcn component code manually.
