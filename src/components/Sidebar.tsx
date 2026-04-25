"use client";

import { CheckCircle2, Circle, Plus } from "lucide-react";
import type { ScheduledTask } from "@/lib/tasks";

type Props = {
  tasks: ScheduledTask[];
  onCreate: () => void;
  onSelect: (task: ScheduledTask) => void;
  onToggleDone: (id: string) => void;
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
    month: "short",
    day: "numeric",
  })} · ${time}`;
}

export function Sidebar({ tasks, onCreate, onSelect, onToggleDone }: Props) {
  const upcoming = [...tasks]
    .filter((t) => !t.done)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 12);

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <aside className="w-full lg:w-80 lg:shrink-0 lg:border-r border-neutral-200 bg-white/60 backdrop-blur lg:h-screen lg:sticky lg:top-0 flex flex-col">
      <div className="px-6 pt-7 pb-5 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            P
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">Plan</h1>
            <p className="text-[11px] text-neutral-500 -mt-0.5">
              A calm scheduler
            </p>
          </div>
        </div>

        <button
          onClick={onCreate}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 text-white text-sm font-medium px-3 py-2.5 hover:bg-neutral-800 transition shadow-sm"
        >
          <Plus size={15} /> New task
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="px-3 mb-2 flex items-center justify-between">
          <h2 className="text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
            Upcoming
          </h2>
          <span className="text-[11px] text-neutral-400">{upcoming.length}</span>
        </div>

        {upcoming.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-neutral-400">
            Nothing scheduled.
            <br />
            Click anywhere on the calendar to add a task.
          </div>
        ) : (
          <ul className="space-y-1">
            {upcoming.map((t) => (
              <li key={t.id}>
                <div className="group flex items-start gap-2 rounded-lg px-3 py-2 hover:bg-neutral-100 transition cursor-pointer">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDone(t.id);
                    }}
                    className="mt-0.5 text-neutral-300 hover:text-emerald-500 transition"
                    aria-label="Mark done"
                  >
                    {t.done ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : (
                      <Circle size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => onSelect(t)}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-sm font-medium text-neutral-800 truncate">
                        {t.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 ml-4 mt-0.5">
                      {formatWhen(t.start)} · {t.durationMinutes}m
                    </div>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-6 py-4 border-t border-neutral-100 text-[11px] text-neutral-500">
        {completedCount > 0
          ? `${completedCount} task${completedCount === 1 ? "" : "s"} completed`
          : "Saved locally on this device"}
      </div>
    </aside>
  );
}
