import { NextResponse } from "next/server";
import { redis, KEYS } from "@/lib/storage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export type StaffProfileOverride = {
  tagline?: string;
  bio?: string;
};

export type StaffProfileMap = Record<string, StaffProfileOverride>;

export async function GET() {
  if (!redis) {
    return NextResponse.json({ remote: false, profiles: {} }, { status: 200 });
  }
  const profiles = (await redis.get<StaffProfileMap>(KEYS.staffProfiles)) ?? {};
  return NextResponse.json(
    { remote: true, profiles },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function PUT(request: Request) {
  if (!redis) {
    return NextResponse.json(
      { remote: false, error: "no-store-configured" },
      { status: 503 },
    );
  }
  const body = (await request.json()) as { profiles: StaffProfileMap };
  if (!body?.profiles || typeof body.profiles !== "object") {
    return NextResponse.json({ error: "invalid-body" }, { status: 400 });
  }
  await redis.set(KEYS.staffProfiles, body.profiles);
  return NextResponse.json({ remote: true, ok: true });
}
