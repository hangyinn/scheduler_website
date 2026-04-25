import { NextResponse } from "next/server";
import { redis, KEYS } from "@/lib/storage";
import type { Appointment } from "@/lib/appointments";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!redis) {
    return NextResponse.json({ remote: false, items: [] }, { status: 200 });
  }
  const items = (await redis.get<Appointment[]>(KEYS.appointments)) ?? [];
  return NextResponse.json(
    { remote: true, items },
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
  const body = (await request.json()) as { items: Appointment[] };
  if (!Array.isArray(body?.items)) {
    return NextResponse.json({ error: "invalid-body" }, { status: 400 });
  }
  await redis.set(KEYS.appointments, body.items);
  return NextResponse.json({ remote: true, ok: true });
}
