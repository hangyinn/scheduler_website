import { NextResponse } from "next/server";
import { redis, KEYS } from "@/lib/storage";
import type { Appointment } from "@/lib/appointments";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type HashShape = { data?: string; version?: string | number };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const versionOnly = url.searchParams.get("v") === "1";

  if (!redis) {
    return NextResponse.json(
      { remote: false, items: [], version: 0 },
      { status: 200 },
    );
  }

  if (versionOnly) {
    const raw = await redis.hget<string | number>(KEYS.appointments, "version");
    const version = typeof raw === "number" ? raw : Number(raw ?? 0);
    return NextResponse.json(
      { remote: true, version },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const result = (await redis.hgetall<HashShape>(KEYS.appointments)) ?? {};
  let items: Appointment[] = [];
  if (result.data) {
    try {
      items =
        typeof result.data === "string"
          ? JSON.parse(result.data)
          : (result.data as unknown as Appointment[]);
    } catch {
      items = [];
    }
  }
  const version =
    typeof result.version === "number"
      ? result.version
      : Number(result.version ?? 0);
  return NextResponse.json(
    { remote: true, items, version },
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
  await redis.hset(KEYS.appointments, {
    data: JSON.stringify(body.items),
  });
  const version = await redis.hincrby(KEYS.appointments, "version", 1);
  return NextResponse.json({ remote: true, ok: true, version });
}
