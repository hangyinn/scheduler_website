import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { STAFF } from "@/lib/staff";

const SERVICES = [
  "Bridal makeup",
  "Editorial",
  "Runway",
  "Boudoir",
  "Avant-garde",
  "SFX",
  "Studio portraits",
  "Brand campaigns",
];

export default function Home() {
  return (
    <main className="relative">
      {/* Ambient gradient mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] overflow-hidden"
      >
        <div
          className="absolute -top-32 -left-24 h-[460px] w-[460px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #f0c2c8 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-12 right-[-120px] h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, #e8b3a8 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-40 left-[35%] h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #a8c4b3 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 pb-24">
        {/* Editorial masthead */}
        <section className="pt-12 sm:pt-20 pb-10 sm:pb-16">
          <div className="flex items-center gap-3 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[var(--muted)]">
            <span>ES Global Inc.</span>
            <span className="h-px flex-1 bg-[var(--border)] max-w-[180px]" />
            <span className="hidden sm:inline">Vol. I — Studio Booking</span>
          </div>

          <h1 className="font-display mt-7 text-5xl sm:text-7xl lg:text-[88px] leading-[0.95] tracking-tight text-[var(--foreground)]">
            Beauty,
            <br />
            <span className="italic font-normal text-[var(--accent)]">
              on schedule.
            </span>
          </h1>

          <div className="mt-8 grid sm:grid-cols-[1fr_auto] gap-6 sm:items-end max-w-3xl">
            <p className="text-[15px] sm:text-[17px] text-[var(--muted)] leading-relaxed max-w-xl">
              A small house of four makeup artists and one photographer.
              Book any artist, view the studio at a glance, or open an
              individual calendar.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] text-[#fffaf2] text-sm font-medium px-5 py-3 hover:opacity-90 transition shadow-sm min-h-11"
              >
                <CalendarDays size={15} /> Studio calendar
              </Link>
            </div>
          </div>
        </section>

        {/* Services marquee */}
        <section className="relative -mx-5 sm:-mx-8 my-10 py-5 border-y border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-sm overflow-hidden">
          <div className="marquee flex gap-12 whitespace-nowrap">
            {[...SERVICES, ...SERVICES, ...SERVICES].map((s, i) => (
              <span
                key={i}
                className="font-display italic text-xl sm:text-2xl text-[var(--foreground)]/70 inline-flex items-center gap-12"
              >
                {s}
                <span className="text-[var(--accent)]">✦</span>
              </span>
            ))}
          </div>
        </section>

        {/* Numbered staff index */}
        <section className="pt-8">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[var(--muted)] mb-2">
                The team
              </p>
              <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
                Five artists, <span className="italic">one studio.</span>
              </h2>
            </div>
            <span className="font-display text-[var(--muted)] text-sm hidden sm:block">
              {String(STAFF.length).padStart(2, "0")} profiles
            </span>
          </div>

          <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {STAFF.map((s, i) => (
              <li key={s.id}>
                <Link
                  href={`/team/${s.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[64px_auto_1fr_auto] items-center gap-4 sm:gap-6 py-5 sm:py-7 px-1 sm:px-2 hover:bg-[var(--accent-soft)]/40 transition"
                >
                  <span className="font-display text-[var(--muted)] text-sm sm:text-base hidden sm:block">
                    {`No. ${String(i + 1).padStart(2, "0")}`}
                  </span>

                  <div
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center text-white font-medium shadow-sm shrink-0 text-sm sm:text-base font-display"
                    style={{
                      background: `linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]})`,
                    }}
                  >
                    {s.initials}
                  </div>

                  <div className="min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-5">
                    <span className="font-display text-2xl sm:text-3xl tracking-tight text-[var(--foreground)] truncate">
                      {s.name}
                    </span>
                    <span className="font-display italic text-[13px] sm:text-base text-[var(--muted)] truncate">
                      {s.tagline}
                    </span>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[var(--muted)] group-hover:text-[var(--foreground)] transition">
                    {s.role.split(" ")[0]}
                    <ArrowUpRight size={14} />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="sm:hidden text-[var(--muted)] group-hover:text-[var(--foreground)] transition"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer mark */}
        <section className="mt-20 sm:mt-28 pt-10 border-t border-[var(--border)] flex items-center justify-between gap-5">
          <span className="wordmark text-[12px] sm:text-sm text-[var(--muted)]">
            ES&nbsp;GLOBAL&nbsp;·&nbsp;EST.&nbsp;2026
          </span>
          <span className="font-display italic text-[var(--muted)] text-sm">
            ✦
          </span>
          <Link
            href="/studio"
            className="text-[12px] sm:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition inline-flex items-center gap-1"
          >
            Open studio calendar <ArrowUpRight size={14} />
          </Link>
        </section>
      </div>
    </main>
  );
}
