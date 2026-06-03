---
description:
---

# Working Workflow

Follow these steps for every non-trivial change.

## 1. Plan Before Editing

- Read the relevant existing files first; match their style exactly.
- For changes touching 3 or more files or new domains, sketch a plan (todo
  list) before writing code.
- Prefer **editing existing files** over creating new ones. Only create a new
  file when there is no clear home in the current folders.

## 2. Single Responsibility & Modularity

- One component / hook / utility per file. Split a file once it grows past
  ~200 lines or mixes concerns (UI vs data fetching vs state machine).
- Extract reusable logic into `hooks/` or `lib/`; do not copy-paste.
- Avoid deep conditional/loop nesting — return early.

## 3. Error Handling & Logging

- Fail fast with descriptive messages, especially around env vars, auth, and
  DB calls.
- Never silently swallow errors (`try { … } catch {}`). Either rethrow with
  context or surface a user-visible state.
- Validate user input with the validators under `validators/<domain>/` — do
  not trust request bodies in route handlers.

## 4. Security Defaults

- Never hard-code secrets, tokens, or API keys. Use `process.env.*` and
  document the variable.
- Sanitize / validate all external input before it reaches Prisma.
- Auth-only routes must verify the Firebase session cookie before any DB work.
- Use parameterised Prisma queries — never concatenate SQL strings.

## 5. Verification (Run After Edits)

When the change can affect compilation, lint, or formatting, run in order:

```bash
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
pnpm format      # prettier --write **/*.{ts,tsx}
```

Fix what you introduced. Don't fix unrelated pre-existing issues unless asked.

## 6. Reporting

End every substantive change with a folder-structure summary showing which
files were created or edited:

```
root/
├── components/
│   └── layout/
│       └── form-layout.tsx        (edited)
├── hooks/
│   └── use-unsaved-changes.ts     (created)
```

## 7. Don't

- Don't introduce new dependencies without checking `package.json` for an
  existing equivalent. If you must add one, use `pnpm add` with the latest
  version — never invent a version string.
- Don't replace `@lucide react` with another icon library.
- Don't bypass `cn()` and concatenate Tailwind class strings manually.
- Don't add `// eslint-disable …` or `// @ts-ignore` to hide real problems.
- Don't run `git commit`, `git push`, or destructive git commands unless the
  user explicitly asks.
