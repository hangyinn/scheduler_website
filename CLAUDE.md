# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Plan** — a single-page client-side scheduling web app. Users open the calendar, click/drag to create tasks (title, notes, start time, duration, color), drag events to reschedule, and check items off. There is no backend; all state lives in `localStorage` under key `plan.tasks.v1`.

## Commands

- `npm run dev` — start the dev server on http://localhost:3000 (Turbopack)
- `npm run build` — production build (also runs Next's TypeScript check)
- `npm start` — run the built production server
- `npm run lint` — ESLint via `eslint-config-next`

There is no test runner configured.

## Architecture

The app is intentionally small — three layers:

1. **Data layer** (`src/lib/tasks.ts`) — `useTasks()` hook owns the entire app state. It hydrates from `localStorage` on mount (deferred, to avoid SSR mismatch) and writes back on every change. All mutations (`addTask`, `updateTask`, `removeTask`, `toggleDone`) go through this hook. The `ScheduledTask` shape and `TASK_COLORS` palette are exported from here — reuse them, don't duplicate.

2. **View layer** (`src/components/`) — three presentational components, none of them own state:
   - `Sidebar.tsx` — branding, "New task" button, upcoming-task list. Pure props in/out.
   - `CalendarView.tsx` — wraps FullCalendar. **Must be loaded with `dynamic(..., { ssr: false })`** because FullCalendar touches the DOM at import time. Plugins used: `daygrid`, `timegrid`, `interaction`, `list`. Translates between FullCalendar's `Date` objects and our ISO-string + duration-minutes representation.
   - `TaskDialog.tsx` — modal form for create/edit. Uses `datetime-local` inputs; conversion to/from ISO is local to this component.

3. **Page** (`src/app/page.tsx`) — wires the hook to the components. Holds only ephemeral UI state (which task is being edited, dialog open/closed). It is a Client Component (`"use client"`) because it uses hooks.

### Conventions to preserve

- **Time representation:** task times are stored as ISO strings + an integer `durationMinutes`. Don't introduce `endsAt` or store `Date` objects in state — the calendar bridge handles the conversion.
- **Persistence:** if you change the `ScheduledTask` shape, bump the storage key (e.g. `plan.tasks.v2`) or add a migration in `loadFromStorage`. Never silently break existing users' saved data.
- **Styling:** Tailwind v4 with the `@theme` block in `src/app/globals.css`. FullCalendar's defaults are restyled there via CSS variables (`--fc-*`) and global selectors — keep calendar styling in `globals.css`, not inline, so the look stays consistent across views.
- **Font:** Inter, loaded via `next/font/google` in `layout.tsx` and exposed as `--font-inter` / `--font-sans`.

## Deployment

The app is a fully static, client-only Next.js build (the `/` route is prerendered as static). Deploy options, easiest first:

- **Vercel** — push the repo to GitHub, then `vercel.com/new` → import. Zero config; `npm run build` is auto-detected.
- **Netlify / Cloudflare Pages** — same flow; build command `npm run build`, publish directory handled by their Next.js adapter.
- **Static export** — if a fully static host is needed, add `output: "export"` to `next.config.ts` and serve `out/` from any static host (GitHub Pages, S3, etc.). The app has no server routes, so this works.
