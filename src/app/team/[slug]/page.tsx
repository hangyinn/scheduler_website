import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScheduleWorkspace } from "@/components/ScheduleWorkspace";
import { STAFF, getStaffBySlug } from "@/lib/staff";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return STAFF.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const staff = getStaffBySlug(slug);
  if (!staff) return { title: "Not found — ES Global Inc." };
  return {
    title: `${staff.name} — ES Global Inc.`,
    description: `Book appointments with ${staff.name}, ${staff.role.toLowerCase()} at ES Global Inc.`,
  };
}

export default async function StaffPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const staff = getStaffBySlug(slug);
  if (!staff) notFound();

  return (
    <main className="mx-auto max-w-[1400px] px-4 sm:px-8 pb-20">
      <section className="pt-6 sm:pt-10 pb-6 sm:pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-[var(--muted)] hover:text-[var(--foreground)] transition mb-5"
        >
          <ArrowLeft size={14} /> All artists
        </Link>

        <div className="flex items-center gap-4 sm:gap-5">
          <div
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center text-white font-medium shadow-sm shrink-0 text-lg sm:text-xl"
            style={{
              background: `linear-gradient(135deg, ${staff.gradient[0]}, ${staff.gradient[1]})`,
            }}
          >
            {staff.initials}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-[0.2em] text-[var(--muted)] uppercase">
              {staff.role}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl tracking-tight mt-1">
              {staff.name}
            </h1>
            <p className="text-[13px] sm:text-sm text-[var(--muted)] mt-1">
              {staff.tagline}
            </p>
          </div>
        </div>
      </section>

      <ScheduleWorkspace staffId={staff.id} lockStaff />
    </main>
  );
}
