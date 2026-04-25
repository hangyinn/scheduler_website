"use client";

import { useEffect, useMemo, useState } from "react";
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
import type { Appointment } from "@/lib/appointments";
import { getStaffById } from "@/lib/staff";

type Props = {
  appointments: Appointment[];
  onSelectRange: (startISO: string, durationMinutes: number) => void;
  onEventClick: (appt: Appointment) => void;
  onEventChange: (
    id: string,
    patch: { start: string; durationMinutes: number },
  ) => void;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export function CalendarView({
  appointments,
  onSelectRange,
  onEventClick,
  onEventChange,
}: Props) {
  const isMobile = useIsMobile();

  const events = useMemo(
    () =>
      appointments.map((a) => {
        const start = new Date(a.start);
        const end = new Date(start.getTime() + a.durationMinutes * 60_000);
        const staff = getStaffById(a.staffId);
        const color = staff?.color ?? "#6b6157";
        return {
          id: a.id,
          title: `${a.clientName} · ${a.service}`,
          start: start.toISOString(),
          end: end.toISOString(),
          backgroundColor: color,
          borderColor: color,
          textColor: "#ffffff",
          classNames: a.status === "completed" ? ["fc-event-completed"] : [],
          extendedProps: { staffId: a.staffId, service: a.service },
        };
      }),
    [appointments],
  );

  const handleSelect = (arg: DateSelectArg) => {
    const duration = Math.max(
      15,
      Math.round((arg.end.getTime() - arg.start.getTime()) / 60_000),
    );
    onSelectRange(arg.start.toISOString(), duration);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const appt = appointments.find((a) => a.id === arg.event.id);
    if (appt) onEventClick(appt);
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
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm p-3 sm:p-5">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
        ]}
        initialView={isMobile ? "timeGrid3Day" : "timeGridWeek"}
        key={isMobile ? "mobile" : "desktop"}
        views={{
          timeGrid3Day: {
            type: "timeGrid",
            duration: { days: 3 },
            buttonText: "3 days",
          },
        }}
        headerToolbar={
          isMobile
            ? {
                left: "prev,next",
                center: "title",
                right: "today",
              }
            : {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }
        }
        footerToolbar={
          isMobile
            ? {
                center: "timeGridDay,timeGrid3Day,listWeek",
              }
            : undefined
        }
        height="auto"
        contentHeight="auto"
        expandRows
        nowIndicator
        selectable
        selectMirror
        editable
        longPressDelay={250}
        eventLongPressDelay={250}
        selectLongPressDelay={250}
        dayMaxEvents
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        slotDuration="00:30:00"
        scrollTime="09:00:00"
        firstDay={1}
        allDaySlot={false}
        events={events}
        select={handleSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventChange}
        eventResize={handleEventChange}
      />
    </div>
  );
}
