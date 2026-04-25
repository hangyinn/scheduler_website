"use client";

import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import {
  TASK_COLORS,
  type NewTaskInput,
  type ScheduledTask,
} from "@/lib/tasks";

type Props = {
  open: boolean;
  initialTask?: ScheduledTask | null;
  initialStart?: string;
  initialDuration?: number;
  onClose: () => void;
  onSave: (input: NewTaskInput) => void;
  onUpdate?: (id: string, patch: Partial<ScheduledTask>) => void;
  onDelete?: (id: string) => void;
};

function toInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function fromInputValue(value: string) {
  return new Date(value).toISOString();
}

export function TaskDialog({
  open,
  initialTask,
  initialStart,
  initialDuration,
  onClose,
  onSave,
  onUpdate,
  onDelete,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [duration, setDuration] = useState(60);
  const [color, setColor] = useState(TASK_COLORS[0].value);

  useEffect(() => {
    if (!open) return;
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description ?? "");
      setStart(toInputValue(initialTask.start));
      setDuration(initialTask.durationMinutes);
      setColor(initialTask.color);
    } else {
      setTitle("");
      setDescription("");
      setStart(toInputValue(initialStart ?? new Date().toISOString()));
      setDuration(initialDuration ?? 60);
      setColor(TASK_COLORS[0].value);
    }
  }, [open, initialTask, initialStart, initialDuration]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const payload: NewTaskInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      start: fromInputValue(start),
      durationMinutes: Math.max(5, Math.round(duration)),
      color,
    };
    if (initialTask && onUpdate) {
      onUpdate(initialTask.id, payload);
    } else {
      onSave(payload);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold tracking-tight">
            {initialTask ? "Edit task" : "New task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">
              Title
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs doing?"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">
              Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Optional details"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                Start
              </label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                Duration (min)
              </label>
              <input
                type="number"
                min={5}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {TASK_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  aria-label={c.label}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    color === c.value
                      ? "border-neutral-900 scale-110"
                      : "border-white shadow"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {initialTask && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(initialTask.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700 font-medium"
                >
                  <Trash2 size={14} /> Delete
                </button>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition"
              >
                {initialTask ? "Save changes" : "Create task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
