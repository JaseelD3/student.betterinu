<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

- No `fetch()` inside Client Components for server state — use TanStack Query
- No direct `axios.get/post` calls — always use `lib/axios.ts` shared instance
- No `useEffect` for data fetching — ever

<!-- END:nextjs-agent-rules -->
