"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TaskDialog } from "@/components/TaskDialog";
import {
  useTasks,
  type NewTaskInput,
  type ScheduledTask,
} from "@/lib/tasks";

const CalendarView = dynamic(
  () => import("@/components/CalendarView").then((m) => m.CalendarView),
  { ssr: false },
);

export default function Home() {
  const { tasks, hydrated, addTask, updateTask, removeTask, toggleDone } =
    useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ScheduledTask | null>(null);
  const [draftStart, setDraftStart] = useState<string | undefined>();
  const [draftDuration, setDraftDuration] = useState<number | undefined>();

  const openCreate = (start?: string, duration?: number) => {
    setEditingTask(null);
    setDraftStart(start);
    setDraftDuration(duration);
    setDialogOpen(true);
  };

  const openEdit = (task: ScheduledTask) => {
    setEditingTask(task);
    setDraftStart(undefined);
    setDraftDuration(undefined);
    setDialogOpen(true);
  };

  const handleSave = (input: NewTaskInput) => {
    addTask(input);
  };

  const handleUpdate = (id: string, patch: Partial<ScheduledTask>) => {
    updateTask(id, patch);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Sidebar
        tasks={tasks}
        onCreate={() => openCreate()}
        onSelect={openEdit}
        onToggleDone={toggleDone}
      />

      <main className="flex-1 px-4 sm:px-8 py-6 lg:py-10 max-w-[1400px] mx-auto w-full">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Your week
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Click and drag on the calendar to block out a task. Drag events to
              reschedule, or click to edit.
            </p>
          </div>
        </header>

        {hydrated ? (
          <CalendarView
            tasks={tasks}
            onSelectRange={(start, duration) => openCreate(start, duration)}
            onEventClick={openEdit}
            onEventChange={(id, patch) => updateTask(id, patch)}
          />
        ) : (
          <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-10 text-center text-sm text-neutral-400">
            Loading calendar…
          </div>
        )}
      </main>

      <TaskDialog
        open={dialogOpen}
        initialTask={editingTask}
        initialStart={draftStart}
        initialDuration={draftDuration}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onDelete={removeTask}
      />
    </div>
  );
}
