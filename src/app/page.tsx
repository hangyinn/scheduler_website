import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { STAFF } from "@/lib/staff";

export default function Home() {
  return (
    <main className="mx-auto max-w-[1200px] px-5 sm:px-8 pb-24">
      <section className="pt-12 sm:pt-20 pb-10 sm:pb-16">
        <p className="text-[11px] font-medium tracking-[0.2em] text-[var(--muted)] uppercase">
          ES Global Inc.
        </p>
        <h1 className="font-display mt-3 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[var(--foreground)]">
          Scheduling for the
          <br />
          <span className="italic">studio.</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] sm:text-base text-[var(--muted)] leading-relaxed">
          Book appointments with our makeup artists and photographer, or view
          the entire studio at a glance. Designed to feel calm — on every
          screen.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] text-[#fffaf2] text-sm font-medium px-5 py-3 hover:opacity-90 transition shadow-sm min-h-11"
          >
            <CalendarDays size={15} /> View studio calendar
          </Link>
          <Link
            href="/team/emily"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] text-sm font-medium px-5 py-3 hover:bg-[var(--accent-soft)] transition min-h-11"
          >
            Browse team
          </Link>
        </div>
      </section>

      <section className="pb-8">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight">
            The team
          </h2>
          <span className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
            {STAFF.length} artists
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAFF.map((s) => (
            <Link
              key={s.id}
              href={`/team/${s.slug}`}
              className="group relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 hover:border-[var(--foreground)]/40 hover:shadow-md transition overflow-hidden"
            >
              <div
                className="absolute -top-12 -right-12 h-44 w-44 rounded-full opacity-30 group-hover:opacity-60 transition blur-2xl"
                style={{
                  background: `linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]})`,
                }}
                aria-hidden
              />
              <div className="relative flex items-center gap-4">
                <div
                  className="h-14 w-14 rounded-full flex items-center justify-center text-white text-base font-medium shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]})`,
                  }}
                >
                  {s.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-xl tracking-tight">
                    {s.name}
                  </div>
                  <div className="text-[12px] text-[var(--muted)]">
                    {s.role}
                  </div>
                </div>
                <ArrowUpRight
                  className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition"
                  size={18}
                />
              </div>
              <p className="relative mt-4 text-[13px] text-[var(--muted)] leading-relaxed">
                {s.tagline}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
