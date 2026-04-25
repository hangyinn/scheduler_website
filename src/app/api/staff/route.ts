import { NextResponse } from "next/server";
import { redis, KEYS } from "@/lib/storage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export type StaffProfileOverride = {
  tagline?: string;
  bio?: string;
};

export type StaffProfileMap = Record<string, StaffProfileOverride>;

type HashShape = { data?: string; version?: string | number };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const versionOnly = url.searchParams.get("v") === "1";

  if (!redis) {
    return NextResponse.json(
      { remote: false, profiles: {}, version: 0 },
      { status: 200 },
    );
  }

  if (versionOnly) {
    const raw = await redis.hget<string | number>(
      KEYS.staffProfiles,
      "version",
    );
    const version = typeof raw === "number" ? raw : Number(raw ?? 0);
    return NextResponse.json(
      { remote: true, version },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const result = (await redis.hgetall<HashShape>(KEYS.staffProfiles)) ?? {};
  let profiles: StaffProfileMap = {};
  if (result.data) {
    try {
      profiles =
        typeof result.data === "string"
          ? JSON.parse(result.data)
          : (result.data as unknown as StaffProfileMap);
    } catch {
      profiles = {};
    }
  }
  const version =
    typeof result.version === "number"
      ? result.version
      : Number(result.version ?? 0);
  return NextResponse.json(
    { remote: true, profiles, version },
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
  await redis.hset(KEYS.staffProfiles, {
    data: JSON.stringify(body.profiles),
  });
  const version = await redis.hincrby(KEYS.staffProfiles, "version", 1);
  return NextResponse.json({ remote: true, ok: true, version });
}
