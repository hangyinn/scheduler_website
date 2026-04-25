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

function isoDate() {
  const d = new Date();
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  return (
    <main className="grain relative">
      {/* Ambient gradient mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[820px] overflow-hidden"
      >
        <div
          className="absolute -top-32 -left-24 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #f0c2c8 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-12 right-[-120px] h-[560px] w-[560px] rounded-full opacity-40 blur-3xl"
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

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-10 pb-24">
        {/* Editorial masthead — magazine-style */}
        <section className="pt-10 sm:pt-16">
          <div className="grid grid-cols-3 gap-3 items-center text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[var(--muted)] border-b border-[var(--border)] pb-4">
            <span className="justify-self-start">Edition I · MMXXVI</span>
            <span className="justify-self-center text-center hidden sm:block">
              ES Global Inc. — The Studio Index
            </span>
            <span className="justify-self-end text-right">{isoDate()}</span>
          </div>
        </section>

        {/* Hero */}
        <section className="pt-12 sm:pt-20 pb-12 sm:pb-20 relative">
          {/* Floating ornament */}
          <div
            aria-hidden
            className="absolute right-2 sm:right-6 top-6 sm:top-12 text-[var(--accent)]/40 slow-spin font-display italic text-3xl sm:text-5xl"
          >
            ✦
          </div>

          <h1 className="font-display text-[15vw] sm:text-[12vw] lg:text-[160px] leading-[0.88] tracking-tight text-[var(--foreground)]">
            Beauty,
            <br />
            <span className="italic font-normal text-[var(--accent)]">
              by appointment
            </span>
          </h1>

          <div className="mt-10 grid sm:grid-cols-[1fr_auto] gap-8 sm:items-end max-w-3xl">
            <p className="text-[15px] sm:text-[17px] text-[var(--muted)] leading-relaxed max-w-xl">
              A small house of four makeup artists and one photographer.
              Open the studio calendar to see everyone at once, or step into
              an individual artist&apos;s page.
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
        <section className="relative -mx-5 sm:-mx-10 my-6 py-6 border-y border-[var(--border)] bg-[var(--surface)]/40 backdrop-blur-sm overflow-hidden">
          <div className="marquee flex gap-12 whitespace-nowrap">
            {[...SERVICES, ...SERVICES, ...SERVICES].map((s, i) => (
              <span
                key={i}
                className="font-display italic text-2xl sm:text-3xl text-[var(--foreground)]/75 inline-flex items-center gap-12 tracking-tight"
              >
                {s}
                <span className="text-[var(--accent)] not-italic text-xl">✦</span>
              </span>
            ))}
          </div>
        </section>

        {/* Numbered staff index — magazine page */}
        <section className="pt-16">
          <div className="grid sm:grid-cols-[auto_1fr] gap-y-3 gap-x-10 items-baseline mb-10">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[var(--muted)]">
              Section II · The Team
            </p>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight">
              Five artists,{" "}
              <span className="italic font-normal">one studio.</span>
            </h2>
          </div>

          <ul className="border-y border-[var(--border)]">
            {STAFF.map((s, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <li
                  key={s.id}
                  className="border-t border-[var(--border)] first:border-t-0"
                >
                  <Link
                    href={`/team/${s.slug}`}
                    className="group relative grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_72px_1fr_auto] items-center gap-4 sm:gap-7 py-7 sm:py-10 px-1 sm:px-3 hover:bg-[var(--accent-soft)]/40 transition overflow-hidden"
                  >
                    {/* Background numeral */}
                    <span
                      className="bg-numeral absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 select-none"
                      aria-hidden
                    >
                      {num}
                    </span>

                    <span className="font-display text-[var(--muted)] text-xs sm:text-sm tracking-[0.15em] uppercase">
                      No.&nbsp;{num}
                    </span>

                    <div
                      className="h-12 w-12 sm:h-16 sm:w-16 rounded-full flex items-center justify-center text-white font-medium shadow-sm shrink-0 text-sm sm:text-base font-display tracking-normal"
                      style={{
                        background: `linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]})`,
                      }}
                    >
                      {s.initials}
                    </div>

                    <div className="min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-6 relative">
                      <span className="font-display text-3xl sm:text-5xl tracking-tight text-[var(--foreground)] leading-[0.95]">
                        {s.name}
                      </span>
                      <span className="font-display italic font-normal text-[13px] sm:text-lg text-[var(--muted)] truncate">
                        {s.tagline}
                      </span>
                    </div>

                    <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] group-hover:text-[var(--foreground)] transition relative">
                      {s.role.split(" ")[0]}
                      <ArrowUpRight size={14} />
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="sm:hidden text-[var(--muted)] group-hover:text-[var(--foreground)] transition relative"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Closing colophon */}
        <section className="mt-24 sm:mt-32 pt-10 border-t border-[var(--border)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="wordmark text-[12px] sm:text-sm text-[var(--foreground)]">
                ES&nbsp;GLOBAL
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] mt-2">
                Private booking · By appointment only
              </p>
            </div>
            <div className="flex items-center gap-3 text-[var(--muted)]">
              <span className="font-display italic text-2xl">✦</span>
              <span className="h-px w-16 bg-[var(--border)]" />
              <span className="font-display italic text-sm">Est. MMXXVI</span>
            </div>
            <Link
              href="/studio"
              className="inline-flex items-center gap-1.5 text-[12px] sm:text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
            >
              Open studio calendar <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
