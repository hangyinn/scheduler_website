# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Studio scheduling site for **ES Global Inc.** — five staff members (4 makeup artists + 1 photographer), each with their own calendar page, plus a combined studio calendar. The home page is an editorial-style index of the team. Appointments and staff descriptions sync across devices via Upstash Redis (when configured) with localStorage fallback.

## Commands

- `npm run dev` — dev server on http://localhost:3000 (Turbopack)
- `npm run build` — production build (also runs Next's TypeScript check)
- `npm start` — run the built production server
- `npm run lint` — ESLint via `eslint-config-next`

No test runner is configured.

## Architecture

### Routes
- `/` — editorial masthead, services marquee, numbered staff index
- `/studio` — combined calendar across all staff
- `/team/[slug]` — per-staff calendar + editable profile (`generateStaticParams` over `STAFF`)
- `/api/appointments` — `GET` (list) / `PUT` (replace whole array). Edge runtime.
- `/api/staff` — `GET` (profile overrides map) / `PUT` (replace map). Edge runtime.

### Storage model — sync vs local fallback
The app has **one shared store across all devices** when Upstash Redis env vars are set, and falls back to per-device localStorage when they aren't.

- `src/lib/storage.ts` — instantiates an `@upstash/redis` client iff both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are present.
- API routes return `{ remote: true, ... }` when the store is configured, `{ remote: false, ... }` otherwise. Clients use that flag to decide whether to fall back to localStorage.
- Storage keys: `esglobal:appointments` (whole `Appointment[]`), `esglobal:staffProfiles` (`Record<staffId, { tagline?, bio? }>`).
- **Provisioning**: in the Vercel dashboard, Storage → Marketplace → Upstash for Redis → Connect to project. Env vars are auto-injected; no `.env` file needed.

### Hooks
- `src/lib/appointments.ts` — `useAppointments(filterStaffId?)`. On mount calls `GET /api/appointments`; when remote-backed, polls every 15s and on window focus to pick up other devices' edits. Mutations push the full array to `PUT` (small data; simple to reason about). Returns `syncStatus: "loading" | "remote" | "local" | "error"`.
- `src/lib/staffProfiles.ts` — `useStaffProfiles()`. Same pattern. `resolved` merges defaults from `STAFF` with the override map and exposes a single `bio` field per staff. `DEFAULT_BIO` lives here.
- `src/lib/staff.ts` — `STAFF` registry (id/slug/name/role/color/gradient/initials/tagline). **Source of truth for visuals.** Adding a staff member only requires a new entry here.

### Components
- `src/components/Header.tsx` — sticky top nav. Desktop pill links; mobile hamburger drawer that locks body scroll and closes on route change.
- `src/components/ScheduleWorkspace.tsx` — orchestration shared by `/studio` and `/team/[slug]`. Owns dialog state, wires the appointments hook to `CalendarView` + `UpcomingList`, renders a `SyncBadge` ("Studio sync" / "This device only") so the cross-device behavior is visible.
- `src/components/CalendarView.tsx` — wraps FullCalendar. **Loaded with `dynamic(..., { ssr: false })`** because FullCalendar touches the DOM at import. The `useIsMobile()` hook drives `initialView` (`timeGridDay` on phones, `timeGridWeek` on desktop). The `key` prop forces a remount when the breakpoint changes so the view actually switches. Toolbar/footer differ between mobile and desktop.
- `src/components/AppointmentDialog.tsx` — modal form. Slides up from the bottom on mobile (`items-end sm:items-center`), scrollable. Staff selector is a 2/3-column pill grid; hidden when `lockStaff` is true (per-staff page).
- `src/components/UpcomingList.tsx` — pure list, used as a right rail on desktop and below the calendar on mobile.
- `src/components/StaffProfile.tsx` — editorial header for `/team/[slug]` with inline tagline + bio editor. Calls `updateProfile` on the `useStaffProfiles` hook; shows whether changes are saved studio-wide or device-only.

### Conventions

- **Time representation:** appointments store ISO `start` + integer `durationMinutes`. The `Date` ↔ ISO conversion happens at the FullCalendar boundary in `CalendarView`. Don't introduce `endsAt` or hold `Date` objects in state.
- **Storage key versioning:** if you change the `Appointment` shape, bump the Redis key (`esglobal:appointments:v2`) and the localStorage key together, or add a migration. Never silently break saved data.
- **Adding a staff member:** add an entry to `STAFF` in `src/lib/staff.ts`; optionally add a default bio in `DEFAULT_BIO` in `staffProfiles.ts`. Home grid, header nav, studio legend, dialog selector, and `/team/[slug]` are all derived from this list.
- **Mobile-first styling:** every interactive element targets ≥44px (`min-h-11` or padding equivalent). The header drawer, calendar toolbar, dialog, and profile editor have explicit mobile branches — preserve them when editing.
- **Typography:** Inter (`--font-sans`) for UI, Fraunces (`--font-display`) for headings, italic accents, and the wordmark. Both are loaded in `layout.tsx` with explicit `weight` arrays and `display: "swap"` (don't switch back to `axes: ["opsz"]` — that caused fallback issues on iOS Safari).
- **Palette:** ivory `#faf7f2`, espresso `#1a1612`, copper accent `#a8623f`. Defined as CSS vars in `globals.css` and exposed to Tailwind via `@theme inline`. Reference them as `bg-[var(--accent)]` etc., not hardcoded hex.
- **FullCalendar styling:** restyled in `globals.css` via `--fc-*` variables and global selectors, with a `@media (max-width: 640px)` block for phone tweaks. Keep calendar styling there, not inline.
- **Ambient decor:** the home and studio pages use absolutely-positioned `radial-gradient` blurs as a gradient mesh. They're decorative — `pointer-events-none` and `aria-hidden`. Keep them under any interactive content.

## Deployment

Hosted on **Vercel**, connected to the `main` branch of the GitHub repo. Pushing to `main` auto-deploys (~60s). Static routes (`/`, `/studio`, all `/team/[slug]`) prerender at build time; `/api/*` runs on the edge runtime.

To enable cross-device sync: in Vercel → **Storage → Marketplace → Upstash for Redis → Add integration → Connect** to the `scheduler_website` project. The `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` env vars are auto-injected; redeploy and the `SyncBadge` will flip from "This device only" to "Studio sync".
