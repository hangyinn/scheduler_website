import { ScheduleWorkspace } from "@/components/ScheduleWorkspace";

export const metadata = {
  title: "Studio Calendar — ES Global Inc.",
};

export default function StudioPage() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 sm:px-8 pb-20">
      <section className="pt-8 sm:pt-12 pb-6 sm:pb-8">
        <p className="text-[11px] font-medium tracking-[0.2em] text-[var(--muted)] uppercase">
          ES Global Inc.
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl tracking-tight">
          Studio calendar
        </h1>
        <p className="mt-2 text-[14px] sm:text-[15px] text-[var(--muted)] max-w-xl leading-relaxed">
          Every artist and the photographer in one place. Tap any slot to add
          an appointment, drag to reschedule.
        </p>
      </section>

      <ScheduleWorkspace />
    </main>
  );
}
