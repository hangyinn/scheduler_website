"use client";

import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
} from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import type { ScheduledTask } from "@/lib/tasks";

type Props = {
  tasks: ScheduledTask[];
  onSelectRange: (startISO: string, durationMinutes: number) => void;
  onEventClick: (task: ScheduledTask) => void;
  onEventChange: (
    id: string,
    patch: { start: string; durationMinutes: number },
  ) => void;
};

export function CalendarView({
  tasks,
  onSelectRange,
  onEventClick,
  onEventChange,
}: Props) {
  const events = useMemo(
    () =>
      tasks.map((t) => {
        const start = new Date(t.start);
        const end = new Date(start.getTime() + t.durationMinutes * 60_000);
        return {
          id: t.id,
          title: t.title,
          start: start.toISOString(),
          end: end.toISOString(),
          backgroundColor: t.color,
          borderColor: t.color,
          textColor: "#ffffff",
          classNames: t.done ? ["fc-event-done"] : [],
          extendedProps: { description: t.description, done: t.done },
        };
      }),
    [tasks],
  );

  const handleSelect = (arg: DateSelectArg) => {
    const duration = Math.max(
      15,
      Math.round((arg.end.getTime() - arg.start.getTime()) / 60_000),
    );
    onSelectRange(arg.start.toISOString(), duration);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const task = tasks.find((t) => t.id === arg.event.id);
    if (task) onEventClick(task);
  };

  const handleEventChange = (arg: EventDropArg | EventResizeDoneArg) => {
    const start = arg.event.start;
    const end = arg.event.end;
    if (!start || !end) return;
    onEventChange(arg.event.id, {
      start: start.toISOString(),
      durationMinutes: Math.round((end.getTime() - start.getTime()) / 60_000),
    });
  };

  return (
    <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 sm:p-5">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
        ]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        height="auto"
        contentHeight="auto"
        expandRows
        nowIndicator
        selectable
        selectMirror
        editable
        dayMaxEvents
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        slotDuration="00:30:00"
        scrollTime="08:00:00"
        firstDay={1}
        allDaySlot={false}
        events={events}
        select={handleSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventChange}
        eventResize={handleEventChange}
      />
      <style jsx global>{`
        .fc-event-done {
          opacity: 0.55;
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
}
