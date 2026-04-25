"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STAFF, type Staff } from "@/lib/staff";

export type StaffProfileOverride = {
  tagline?: string;
  bio?: string;
};

export type StaffProfileMap = Record<string, StaffProfileOverride>;

export type ResolvedStaffProfile = Staff & {
  bio: string;
  /** Whether this profile is using user-edited content (vs the default) */
  edited: boolean;
};

const STORAGE_KEY = "esglobal.staffProfiles.v1";

const DEFAULT_BIO: Record<string, string> = {
  emily:
    "Emily specialises in soft-glam editorial and bridal looks. With a decade in fashion campaigns and weddings, she brings a quiet, considered eye to every face.",
  scarlett:
    "Scarlett is our colour story specialist. Runway looks, magazine covers, and bold beauty editorials are her playground.",
  bella:
    "Bella's signature is the dewy, lit-from-within finish. A favourite of brides and boudoir clients alike.",
  thetis:
    "Thetis works at the edge of avant-garde and special effects. From couture to film, she sculpts faces into living art.",
  jay: "Jay shoots in our in-house studio — clean light, considered framing, and a calm set. Specialising in fashion, portrait, and brand work.",
};

function loadLocal(): StaffProfileMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveLocal(map: StaffProfileMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function resolve(profiles: StaffProfileMap): Record<string, ResolvedStaffProfile> {
  const out: Record<string, ResolvedStaffProfile> = {};
  for (const s of STAFF) {
    const override = profiles[s.id] ?? {};
    out[s.id] = {
      ...s,
      tagline: override.tagline?.trim() || s.tagline,
      bio: override.bio?.trim() || DEFAULT_BIO[s.id] || "",
      edited: Boolean(override.tagline || override.bio),
    };
  }
  return out;
}

export function useStaffProfiles() {
  const [profiles, setProfiles] = useState<StaffProfileMap>({});
  const [remote, setRemote] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const inFlightRef = useRef<Promise<void> | null>(null);

  const pull = useCallback(async () => {
    if (inFlightRef.current) return inFlightRef.current;
    const p = (async () => {
      try {
        const res = await fetch("/api/staff", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as {
          remote: boolean;
          profiles: StaffProfileMap;
        };
        if (data.remote) {
          setRemote(true);
          setProfiles(data.profiles ?? {});
        } else {
          setRemote(false);
          setProfiles(loadLocal());
        }
      } catch {
        setRemote(false);
        setProfiles(loadLocal());
      } finally {
        setHydrated(true);
        inFlightRef.current = null;
      }
    })();
    inFlightRef.current = p;
    return p;
  }, []);

  const push = useCallback(
    async (next: StaffProfileMap) => {
      if (!remote) {
        saveLocal(next);
        return true;
      }
      try {
        const res = await fetch("/api/staff", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ profiles: next }),
        });
        return res.ok;
      } catch {
        return false;
      }
    },
    [remote],
  );

  useEffect(() => {
    pull();
  }, [pull]);

  const updateProfile = useCallback(
    async (staffId: string, patch: StaffProfileOverride) => {
      const cleaned: StaffProfileOverride = {
        tagline: patch.tagline?.trim() || undefined,
        bio: patch.bio?.trim() || undefined,
      };
      const next: StaffProfileMap = {
        ...profiles,
        [staffId]: cleaned,
      };
      if (!cleaned.tagline && !cleaned.bio) {
        delete next[staffId];
      }
      setProfiles(next);
      const ok = await push(next);
      return ok;
    },
    [profiles, push],
  );

  return {
    profiles,
    resolved: resolve(profiles),
    syncRemote: remote,
    hydrated,
    updateProfile,
    refresh: pull,
  };
}

export function getDefaultBio(staffId: string) {
  return DEFAULT_BIO[staffId] ?? "";
}
