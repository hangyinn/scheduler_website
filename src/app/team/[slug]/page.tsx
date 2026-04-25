import { notFound } from "next/navigation";
import { ScheduleWorkspace } from "@/components/ScheduleWorkspace";
import { StaffProfile } from "@/components/StaffProfile";
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
      <StaffProfile staff={staff} />
      <ScheduleWorkspace staffId={staff.id} lockStaff />
    </main>
  );
}
