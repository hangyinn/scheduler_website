"use client";

import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import { STAFF, getStaffById } from "@/lib/staff";
import type {
  Appointment,
  NewAppointmentInput,
} from "@/lib/appointments";

type Props = {
  open: boolean;
  initial?: Appointment | null;
  defaultStaffId?: string;
  defaultStart?: string;
  defaultDuration?: number;
  /** When true, hide the staff selector and lock to defaultStaffId */
  lockStaff?: boolean;
  onClose: () => void;
  onCreate: (input: NewAppointmentInput) => void;
  onUpdate: (id: string, patch: Partial<Appointment>) => void;
  onDelete: (id: string) => void;
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

export function AppointmentDialog({
  open,
  initial,
  defaultStaffId,
  defaultStart,
  defaultDuration,
  lockStaff,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const [staffId, setStaffId] = useState(defaultStaffId ?? STAFF[0].id);
  const [clientName, setClientName] = useState("");
  const [service, setService] = useState("");
  const [start, setStart] = useState("");
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setStaffId(initial.staffId);
      setClientName(initial.clientName);
      setService(initial.service);
      setStart(toInputValue(initial.start));
      setDuration(initial.durationMinutes);
      setNotes(initial.notes ?? "");
    } else {
      setStaffId(defaultStaffId ?? STAFF[0].id);
      setClientName("");
      setService("");
      setStart(toInputValue(defaultStart ?? new Date().toISOString()));
      setDuration(defaultDuration ?? 60);
      setNotes("");
    }
  }, [open, initial, defaultStaffId, defaultStart, defaultDuration]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !service.trim()) return;
    const payload: NewAppointmentInput = {
      staffId,
      clientName: clientName.trim(),
      service: service.trim(),
      start: fromInputValue(start),
      durationMinutes: Math.max(15, Math.round(duration)),
      notes: notes.trim() || undefined,
    };
    if (initial) onUpdate(initial.id, payload);
    else onCreate(payload);
    onClose();
  };

  const selectedStaff = getStaffById(staffId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1a1612]/35 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-[var(--surface)] shadow-xl border border-[var(--border)] sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--surface)] z-10">
          <h2 className="font-display text-lg font-medium tracking-tight">
            {initial ? "Edit appointment" : "New appointment"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 -mr-2 inline-flex items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-soft)] transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {!lockStaff ? (
            <div>
              <label className="block text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5">
                Staff
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STAFF.map((s) => {
                  const active = s.id === staffId;
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setStaffId(s.id)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition ${
                        active
                          ? "border-[var(--foreground)] bg-[var(--accent-soft)]"
                          : "border-[var(--border)] hover:bg-[var(--accent-soft)]/50"
                      }`}
                    >
                      <span
                        className="h-6 w-6 rounded-full shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]})`,
                        }}
                      />
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium leading-tight truncate">
                          {s.name}
                        </span>
                        <span className="block text-[10px] text-[var(--muted)] leading-tight truncate">
                          {s.role}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : selectedStaff ? (
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-3.5 py-3 bg-[var(--accent-soft)]/40">
              <span
                className="h-8 w-8 rounded-full shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${selectedStaff.gradient[0]}, ${selectedStaff.gradient[1]})`,
                }}
              />
              <div>
                <div className="text-sm font-medium">{selectedStaff.name}</div>
                <div className="text-[11px] text-[var(--muted)]">
                  {selectedStaff.role}
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5">
                Client name
              </label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5">
                Service
              </label>
              <input
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Bridal makeup"
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5">
                Start
              </label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5">
                Duration (min)
              </label>
              <input
                type="number"
                min={15}
                step={15}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Anything the team should know"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <div>
              {initial ? (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(initial.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-rose-700 hover:text-rose-800 font-medium h-11 px-2"
                >
                  <Trash2 size={15} /> Delete
                </button>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-[var(--accent-soft)] transition min-h-11"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[#fffaf2] hover:opacity-90 transition min-h-11"
              >
                {initial ? "Save" : "Book"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
