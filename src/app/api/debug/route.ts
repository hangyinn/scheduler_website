import { NextResponse } from "next/server";
import { envDebug, redis } from "@/lib/storage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const present = envDebug();
  let pingOk: boolean | null = null;
  let pingError: string | null = null;
  if (redis) {
    try {
      const v = await redis.ping();
      pingOk = v === "PONG" || v === "pong" || Boolean(v);
    } catch (e) {
      pingOk = false;
      pingError = e instanceof Error ? e.message : String(e);
    }
  }
  return NextResponse.json(
    {
      hasClient: redis !== null,
      pingOk,
      pingError,
      envVarsPresent: present,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
