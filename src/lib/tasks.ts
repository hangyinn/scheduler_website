"use client";

import { useCallback, useEffect, useState } from "react";

export type ScheduledTask = {
  id: string;
  title: string;
  description?: string;
  /** ISO string for the start time */
  start: string;
  /** Duration in minutes */
  durationMinutes: number;
  color: string;
  done: boolean;
  createdAt: string;
};

export type NewTaskInput = Omit<ScheduledTask, "id" | "createdAt" | "done"> & {
  done?: boolean;
};

const STORAGE_KEY = "plan.tasks.v1";

export const TASK_COLORS = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#0ea5e9", label: "Sky" },
  { value: "#10b981", label: "Emerald" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ef4444", label: "Rose" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#64748b", label: "Slate" },
];

function loadFromStorage(): ScheduledTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is ScheduledTask =>
        t &&
        typeof t.id === "string" &&
        typeof t.title === "string" &&
        typeof t.start === "string" &&
        typeof t.durationMinutes === "number",
    );
  } catch {
    return [];
  }
}

function saveToStorage(tasks: ScheduledTask[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useTasks() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTasks(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage(tasks);
  }, [tasks, hydrated]);

  const addTask = useCallback((input: NewTaskInput) => {
    const task: ScheduledTask = {
      id: uid(),
      title: input.title,
      description: input.description,
      start: input.start,
      durationMinutes: input.durationMinutes,
      color: input.color,
      done: input.done ?? false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const updateTask = useCallback(
    (id: string, patch: Partial<Omit<ScheduledTask, "id" | "createdAt">>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
    },
    [],
  );

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  return { tasks, hydrated, addTask, updateTask, removeTask, toggleDone };
}
