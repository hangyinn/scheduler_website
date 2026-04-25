"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

export type SyncStatus = "loading" | "remote" | "local" | "error";

const STORAGE_KEY = "esglobal.appointments.v1";
const POLL_MS = 15_000;

function loadLocal(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Appointment[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(items: Appointment[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useAppointments(filterStaffId?: string) {
  const [items, setItems] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<SyncStatus>("loading");
  const remoteRef = useRef(false);
  const inFlightRef = useRef<Promise<void> | null>(null);

  const pushRemote = useCallback(async (next: Appointment[]) => {
    if (!remoteRef.current) return;
    try {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: next }),
      });
      if (!res.ok) throw new Error("save failed");
    } catch {
      setStatus("error");
    }
  }, []);

  const pullRemote = useCallback(async () => {
    if (inFlightRef.current) return inFlightRef.current;
    const p = (async () => {
      try {
        const res = await fetch("/api/appointments", { cache: "no-store" });
        if (!res.ok) throw new Error("load failed");
        const data = (await res.json()) as {
          remote: boolean;
          items: Appointment[];
        };
        if (data.remote) {
          remoteRef.current = true;
          setItems(data.items ?? []);
          setStatus("remote");
        } else {
          remoteRef.current = false;
          setItems(loadLocal());
          setStatus("local");
        }
      } catch {
        remoteRef.current = false;
        setItems(loadLocal());
        setStatus("local");
      } finally {
        inFlightRef.current = null;
      }
    })();
    inFlightRef.current = p;
    return p;
  }, []);

  // Initial load
  useEffect(() => {
    pullRemote();
  }, [pullRemote]);

  // Background poll for remote so other devices' edits appear
  useEffect(() => {
    if (status !== "remote") return;
    const id = setInterval(pullRemote, POLL_MS);
    const onFocus = () => pullRemote();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [status, pullRemote]);

  // Persist local-only mode to localStorage
  useEffect(() => {
    if (status === "local") saveLocal(items);
  }, [items, status]);

  const visible = useMemo(
    () =>
      filterStaffId ? items.filter((a) => a.staffId === filterStaffId) : items,
    [items, filterStaffId],
  );

  const addAppointment = useCallback(
    (input: NewAppointmentInput) => {
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
      setItems((prev) => {
        const next = [...prev, item];
        pushRemote(next);
        return next;
      });
      return item;
    },
    [pushRemote],
  );

  const updateAppointment = useCallback(
    (id: string, patch: Partial<Omit<Appointment, "id" | "createdAt">>) => {
      setItems((prev) => {
        const next = prev.map((a) => (a.id === id ? { ...a, ...patch } : a));
        pushRemote(next);
        return next;
      });
    },
    [pushRemote],
  );

  const removeAppointment = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((a) => a.id !== id);
        pushRemote(next);
        return next;
      });
    },
    [pushRemote],
  );

  const setApptStatus = useCallback(
    (id: string, s: AppointmentStatus) => {
      setItems((prev) => {
        const next = prev.map((a) => (a.id === id ? { ...a, status: s } : a));
        pushRemote(next);
        return next;
      });
    },
    [pushRemote],
  );

  return {
    appointments: visible,
    allAppointments: items,
    syncStatus: status,
    hydrated: status !== "loading",
    addAppointment,
    updateAppointment,
    removeAppointment,
    setStatus: setApptStatus,
  };
}
