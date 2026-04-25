"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { STAFF } from "@/lib/staff";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLinks = [
    { href: "/studio", label: "Studio" },
    ...STAFF.map((s) => ({ href: `/team/${s.slug}`, label: s.name })),
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/85 backdrop-blur border-b border-[var(--border)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="wordmark text-[15px] sm:text-base text-[var(--foreground)] hover:opacity-80 transition"
          aria-label="ES Global home"
        >
          ES&nbsp;GLOBAL
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-full text-[13px] font-medium transition ${
                  active
                    ? "bg-[var(--foreground)] text-[#fffaf2]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-soft)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden h-11 w-11 -mr-2 inline-flex items-center justify-center rounded-full text-[var(--foreground)] hover:bg-[var(--accent-soft)] transition"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--background)]">
          <nav className="px-5 py-3 flex flex-col">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3.5 rounded-xl text-[15px] font-medium transition ${
                    active
                      ? "bg-[var(--foreground)] text-[#fffaf2]"
                      : "text-[var(--foreground)] hover:bg-[var(--accent-soft)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
