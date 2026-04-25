"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Pencil, X } from "lucide-react";
import type { Staff } from "@/lib/staff";
import { getDefaultBio, useStaffProfiles } from "@/lib/staffProfiles";

type Props = {
  staff: Staff;
};

export function StaffProfile({ staff }: Props) {
  const { resolved, hydrated, syncRemote, updateProfile } = useStaffProfiles();
  const profile = resolved[staff.id];
  const tagline = profile?.tagline ?? staff.tagline;
  const bio = profile?.bio ?? getDefaultBio(staff.id);

  const [editing, setEditing] = useState(false);
  const [tDraft, setTDraft] = useState("");
  const [bDraft, setBDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setTDraft(tagline);
      setBDraft(bio);
      setError(null);
    }
  }, [editing, tagline, bio]);

  const onSave = async () => {
    setSaving(true);
    setError(null);
    const ok = await updateProfile(staff.id, {
      tagline: tDraft,
      bio: bDraft,
    });
    setSaving(false);
    if (ok) {
      setEditing(false);
    } else {
      setError("Could not save. Try again.");
    }
  };

  const onReset = async () => {
    setSaving(true);
    setError(null);
    const ok = await updateProfile(staff.id, {});
    setSaving(false);
    if (ok) setEditing(false);
    else setError("Could not reset. Try again.");
  };

  return (
    <section className="pt-6 sm:pt-10 pb-6 sm:pb-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--muted)] hover:text-[var(--foreground)] transition mb-6"
      >
        <ArrowLeft size={14} /> All artists
      </Link>

      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <div
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{
            background: `linear-gradient(135deg, ${staff.gradient[0]}, ${staff.gradient[1]})`,
          }}
          aria-hidden
        />
        <div className="relative p-6 sm:p-9">
          <div className="flex items-start gap-4 sm:gap-6 flex-wrap">
            <div
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full flex items-center justify-center text-white font-medium shadow-sm shrink-0 text-xl sm:text-2xl font-display"
              style={{
                background: `linear-gradient(135deg, ${staff.gradient[0]}, ${staff.gradient[1]})`,
              }}
            >
              {staff.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-[var(--muted)] uppercase">
                {staff.role}
              </p>
              <h1 className="font-display text-3xl sm:text-5xl tracking-tight mt-1.5 leading-[1.05]">
                {staff.name}
              </h1>
              {!editing ? (
                <p className="font-display italic text-[15px] sm:text-lg text-[var(--foreground)]/80 mt-2 leading-snug max-w-xl">
                  {tagline}
                </p>
              ) : (
                <input
                  value={tDraft}
                  onChange={(e) => setTDraft(e.target.value)}
                  placeholder="One-line tagline"
                  maxLength={120}
                  className="mt-2 w-full max-w-xl font-display italic text-base sm:text-lg bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] outline-none py-1"
                />
              )}
            </div>
            <div className="ml-auto">
              {!editing ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  disabled={!hydrated}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] text-[12px] font-medium px-3.5 py-2 hover:bg-[var(--accent-soft)] transition min-h-10 disabled:opacity-50"
                  title="Edit profile"
                >
                  <Pencil size={13} /> Edit profile
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center gap-1 rounded-full text-[var(--muted)] text-[12px] font-medium px-3 py-2 hover:bg-[var(--accent-soft)] transition min-h-10"
                  >
                    <X size={13} /> Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--foreground)] text-[#fffaf2] text-[12px] font-medium px-3.5 py-2 hover:opacity-90 transition min-h-10 disabled:opacity-50"
                  >
                    <Check size={13} /> {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 max-w-3xl">
            {!editing ? (
              <p className="text-[14px] sm:text-[15px] text-[var(--muted)] leading-relaxed whitespace-pre-line">
                {bio}
              </p>
            ) : (
              <textarea
                value={bDraft}
                onChange={(e) => setBDraft(e.target.value)}
                rows={5}
                placeholder="A few sentences about this artist…"
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[14px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
              />
            )}
            {editing ? (
              <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--muted)]">
                <button
                  type="button"
                  onClick={onReset}
                  className="underline-offset-2 hover:underline"
                >
                  Reset to default
                </button>
                {error ? (
                  <span className="text-rose-700">{error}</span>
                ) : !syncRemote ? (
                  <span>Saved on this device only.</span>
                ) : (
                  <span>Visible to everyone in the studio.</span>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
