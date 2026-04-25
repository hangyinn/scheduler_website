import { Redis } from "@upstash/redis";

/**
 * Resolve Upstash / KV credentials from any of the common naming patterns
 * Vercel's marketplace integrations use:
 *  - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  (Upstash standalone)
 *  - KV_REST_API_URL / KV_REST_API_TOKEN                (Vercel KV legacy)
 *  - REDIS_URL                                          (some integrations)
 */
function resolveCreds(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.REDIS_REST_URL ||
    "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.REDIS_REST_TOKEN ||
    "";
  if (url && token) return { url, token };
  return null;
}

const creds = resolveCreds();
export const redis: Redis | null = creds ? new Redis(creds) : null;

export const KEYS = {
  appointments: "esglobal:appts.v2",
  staffProfiles: "esglobal:staff.v2",
} as const;

/** Names of relevant env vars that are present at runtime (no values) */
export function envDebug() {
  const candidates = [
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "KV_REST_API_URL",
    "KV_REST_API_TOKEN",
    "KV_URL",
    "KV_REST_API_READ_ONLY_TOKEN",
    "REDIS_URL",
    "REDIS_REST_URL",
    "REDIS_REST_TOKEN",
  ];
  return candidates.filter((k) => Boolean(process.env[k]));
}
