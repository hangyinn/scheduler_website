"use client";

import { Check, Clock } from "lucide-react";
import type { Appointment } from "@/lib/appointments";
import { getStaffById } from "@/lib/staff";

type Props = {
  appointments: Appointment[];
  onSelect: (appt: Appointment) => void;
  onComplete: (id: string) => void;
  showStaff?: boolean;
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    d.getFullYear() === tomorrow.getFullYear() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getDate() === tomorrow.getDate();
  const time = d.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  if (sameDay) return `Today · ${time}`;
  if (isTomorrow) return `Tomorrow · ${time}`;
  return `${d.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  })} · ${time}`;
}

export function UpcomingList({
  appointments,
  onSelect,
  onComplete,
  showStaff = false,
}: Props) {
  const upcoming = [...appointments]
    .filter((a) => a.status !== "completed")
    .filter((a) => new Date(a.start).getTime() >= Date.now() - 60 * 60_000)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 8);

  if (upcoming.length === 0) {
    return (
      <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 text-center">
        <Clock className="mx-auto text-[var(--muted)]" size={20} />
        <p className="mt-2 text-sm text-[var(--muted)]">
          No upcoming appointments. Tap the calendar to add one.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] divide-y divide-[var(--border)]">
      <div className="px-5 py-3.5 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Upcoming
        </h3>
        <span className="text-[11px] text-[var(--muted)]">
          {upcoming.length}
        </span>
      </div>
      <ul className="divide-y divide-[var(--border)]">
        {upcoming.map((a) => {
          const staff = getStaffById(a.staffId);
          return (
            <li key={a.id}>
              <div className="group flex items-start gap-3 px-5 py-3.5 hover:bg-[var(--accent-soft)]/40 transition">
                <span
                  className="mt-1 h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: staff?.color ?? "#6b6157" }}
                  aria-hidden
                />
                <button
                  onClick={() => onSelect(a)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="text-[14px] font-medium text-[var(--foreground)] truncate">
                    {a.clientName}
                  </div>
                  <div className="text-[12px] text-[var(--muted)] truncate">
                    {a.service}
                    {showStaff && staff ? ` · ${staff.name}` : ""}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mt-1">
                    {formatWhen(a.start)} · {a.durationMinutes}m
                  </div>
                </button>
                <button
                  onClick={() => onComplete(a.id)}
                  className="h-9 w-9 -mr-1 inline-flex items-center justify-center rounded-full text-[var(--muted)] hover:text-emerald-600 hover:bg-emerald-50 transition"
                  aria-label="Mark completed"
                  title="Mark completed"
                >
                  <Check size={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
