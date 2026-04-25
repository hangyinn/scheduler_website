"use client";

import dynamic from "next/dynamic";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AppointmentDialog } from "@/components/AppointmentDialog";
import { UpcomingList } from "@/components/UpcomingList";
import {
  useAppointments,
  type Appointment,
  type NewAppointmentInput,
} from "@/lib/appointments";
import { STAFF } from "@/lib/staff";

const CalendarView = dynamic(
  () => import("@/components/CalendarView").then((m) => m.CalendarView),
  { ssr: false },
);

type Props = {
  /** When set, only this staff's appointments are shown and new appointments default to this staff */
  staffId?: string;
  /** When true (per-staff page), hide the staff selector in the dialog */
  lockStaff?: boolean;
};

export function ScheduleWorkspace({ staffId, lockStaff }: Props) {
  const {
    appointments,
    hydrated,
    addAppointment,
    updateAppointment,
    removeAppointment,
    setStatus,
  } = useAppointments(staffId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [draftStart, setDraftStart] = useState<string | undefined>();
  const [draftDuration, setDraftDuration] = useState<number | undefined>();

  const openCreate = (start?: string, duration?: number) => {
    setEditing(null);
    setDraftStart(start);
    setDraftDuration(duration);
    setDialogOpen(true);
  };

  const openEdit = (appt: Appointment) => {
    setEditing(appt);
    setDraftStart(undefined);
    setDraftDuration(undefined);
    setDialogOpen(true);
  };

  const handleCreate = (input: NewAppointmentInput) => addAppointment(input);
  const handleUpdate = (id: string, patch: Partial<Appointment>) =>
    updateAppointment(id, patch);

  const isStudio = !staffId;

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-5 lg:gap-6">
      <div className="min-w-0">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => openCreate()}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--foreground)] text-[#fffaf2] text-sm font-medium px-4 py-2.5 hover:opacity-90 transition shadow-sm min-h-11"
          >
            <Plus size={15} /> New appointment
          </button>
          {isStudio ? (
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-[var(--muted)]">
              {STAFF.map((s) => (
                <span key={s.id} className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {hydrated ? (
          <CalendarView
            appointments={appointments}
            onSelectRange={(start, duration) => openCreate(start, duration)}
            onEventClick={openEdit}
            onEventChange={(id, patch) => updateAppointment(id, patch)}
          />
        ) : (
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-10 text-center text-sm text-[var(--muted)]">
            Loading calendar…
          </div>
        )}

        {isStudio ? (
          <div className="sm:hidden mt-4 flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-[var(--muted)]">
            {STAFF.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                {s.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start min-w-0">
        <UpcomingList
          appointments={appointments}
          onSelect={openEdit}
          onComplete={(id) => setStatus(id, "completed")}
          showStaff={isStudio}
        />
      </aside>

      <AppointmentDialog
        open={dialogOpen}
        initial={editing}
        defaultStaffId={staffId}
        defaultStart={draftStart}
        defaultDuration={draftDuration}
        lockStaff={lockStaff}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={removeAppointment}
      />
    </div>
  );
}
