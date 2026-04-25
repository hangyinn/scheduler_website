import { ScheduleWorkspace } from "@/components/ScheduleWorkspace";

export const metadata = {
  title: "Studio Calendar — ES Global Inc.",
};

export default function StudioPage() {
  return (
    <main className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] overflow-hidden"
      >
        <div
          className="absolute -top-24 left-[10%] h-[380px] w-[380px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #e8b3a8 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-12 right-[5%] h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #a8c4b3 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8 pb-20">
        <section className="pt-8 sm:pt-14 pb-6 sm:pb-10">
          <div className="flex items-center gap-3 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[var(--muted)]">
            <span>ES Global Inc.</span>
            <span className="h-px flex-1 bg-[var(--border)] max-w-[140px]" />
            <span className="hidden sm:inline">The Studio</span>
          </div>
          <h1 className="font-display mt-5 text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
            Studio <span className="italic font-normal">calendar.</span>
          </h1>
          <p className="mt-3 text-[14px] sm:text-[15px] text-[var(--muted)] max-w-xl leading-relaxed">
            Every artist and the photographer in one place. Tap any slot to add
            an appointment, drag to reschedule.
          </p>
        </section>

        <ScheduleWorkspace />
      </div>
    </main>
  );
}
