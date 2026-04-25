# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Studio scheduling site for **ES Global Inc.** — five staff members (4 makeup artists + 1 photographer), each with their own calendar page, plus a combined studio calendar. Client-only; appointments persist to `localStorage` under `esglobal.appointments.v1`. No backend, no auth.

## Commands

- `npm run dev` — dev server on http://localhost:3000 (Turbopack)
- `npm run build` — production build (also runs Next's TypeScript check)
- `npm start` — run the built production server
- `npm run lint` — ESLint via `eslint-config-next`

No test runner is configured.

## Architecture

### Routes
- `/` — landing: hero + staff grid
- `/studio` — combined calendar (all staff, color-coded)
- `/team/[slug]` — per-staff calendar (filter by `staffId`); pre-rendered via `generateStaticParams`

### Data
- `src/lib/staff.ts` — `STAFF` registry (id/slug/name/role/color/gradient/initials/tagline). **Staff colors and gradients are the visual source of truth** — the calendar event tint, dot indicators, and avatar gradients all read from here. Never hardcode a staff color in a component.
- `src/lib/appointments.ts` — `Appointment` type + `useAppointments(filterStaffId?)` hook. Hydrates from `localStorage` on mount (deferred to avoid SSR mismatch), writes back on every change. All mutations go through this hook.

### Components
- `src/components/Header.tsx` — sticky top nav. Desktop: pill-shaped nav links. Mobile (`<lg`): hamburger drawer that locks body scroll while open and closes on route change.
- `src/components/ScheduleWorkspace.tsx` — orchestration component used by both `/studio` and `/team/[slug]`. Owns dialog state and wires the hook to `CalendarView` + `UpcomingList`. Pass `staffId` to filter and `lockStaff` to hide the staff selector in the dialog.
- `src/components/CalendarView.tsx` — wraps FullCalendar. **Must be loaded with `dynamic(..., { ssr: false })`** because FullCalendar touches the DOM at import time. The `useIsMobile()` hook drives `initialView`: `timeGridDay` on phones, `timeGridWeek` on desktop. The `key` prop forces a remount when the breakpoint changes so the view actually switches.
- `src/components/AppointmentDialog.tsx` — modal form. On mobile it slides up from the bottom (`items-end sm:items-center`) and is scrollable; the staff selector is a 2- or 3-column grid of pill-buttons, hidden when `lockStaff` is true.
- `src/components/UpcomingList.tsx` — pure list of upcoming appointments, used as the right rail on desktop and below the calendar on mobile.

### Conventions to preserve

- **Time representation:** appointments store ISO `start` + integer `durationMinutes`. Don't introduce `endsAt` or store `Date` objects in state — `CalendarView` does the conversion at the boundary.
- **Persistence:** if you change the `Appointment` shape, bump the storage key (`esglobal.appointments.v2`) or add a migration in `loadFromStorage`. Never silently break saved data.
- **Adding a staff member:** add an entry to `STAFF` in `src/lib/staff.ts` — that's it. The home grid, header nav, studio legend, and dialog selector all map over `STAFF`. The dynamic route `/team/[slug]` is regenerated automatically.
- **Mobile-first styling:** every interactive element targets ≥44px tap height (`min-h-11` or padding equivalent). The header drawer, calendar toolbar, and dialog have explicit mobile branches — preserve them when editing.
- **Typography:** Inter (`--font-sans`) for UI, Fraunces (`--font-display`, via `.font-display`) for headings and the wordmark. Both loaded in `layout.tsx`.
- **Palette:** ivory background `#faf7f2`, espresso `#1a1612`, copper accent `#a8623f`. Defined as CSS vars in `globals.css` and exposed to Tailwind via the `@theme inline` block — reference them as `bg-[var(--accent)]` etc. instead of hardcoding hex.
- **FullCalendar styling:** restyled in `globals.css` via `--fc-*` variables and global selectors, with a `@media (max-width: 640px)` block for phone tweaks. Keep calendar styling there, not inline, so the look stays consistent across all three calendar pages.

## Deployment

The site is hosted on **Vercel**, connected to the `main` branch of the GitHub repo. Pushing to `main` auto-triggers a production deploy (~60s). The app prerenders all routes statically — no server runtime needed.
