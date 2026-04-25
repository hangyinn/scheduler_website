"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type AppointmentStatus = "confirmed" | "tentative" | "completed";

export type Appointment = {
  id: string;
  staffId: string;
  clientName: string;
  service: string;
  /** ISO start time */
  start: string;
  /** Duration in minutes */
  durationMinutes: number;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type NewAppointmentInput = Omit<
  Appointment,
  "id" | "createdAt" | "status"
> & {
  status?: AppointmentStatus;
};

const STORAGE_KEY = "esglobal.appointments.v1";

function loadFromStorage(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (a): a is Appointment =>
        a &&
        typeof a.id === "string" &&
        typeof a.staffId === "string" &&
        typeof a.clientName === "string" &&
        typeof a.start === "string" &&
        typeof a.durationMinutes === "number",
    );
  } catch {
    return [];
  }
}

function saveToStorage(items: Appointment[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useAppointments(filterStaffId?: string) {
  const [items, setItems] = useState<Appointment[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage(items);
  }, [items, hydrated]);

  const visible = useMemo(
    () =>
      filterStaffId ? items.filter((a) => a.staffId === filterStaffId) : items,
    [items, filterStaffId],
  );

  const addAppointment = useCallback((input: NewAppointmentInput) => {
    const item: Appointment = {
      id: uid(),
      staffId: input.staffId,
      clientName: input.clientName,
      service: input.service,
      start: input.start,
      durationMinutes: input.durationMinutes,
      notes: input.notes,
      status: input.status ?? "confirmed",
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [...prev, item]);
    return item;
  }, []);

  const updateAppointment = useCallback(
    (id: string, patch: Partial<Omit<Appointment, "id" | "createdAt">>) => {
      setItems((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      );
    },
    [],
  );

  const removeAppointment = useCallback((id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setStatus = useCallback((id: string, status: AppointmentStatus) => {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  return {
    appointments: visible,
    allAppointments: items,
    hydrated,
    addAppointment,
    updateAppointment,
    removeAppointment,
    setStatus,
  };
}
