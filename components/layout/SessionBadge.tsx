"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, type Session } from "@/lib/session";
import { TIER_LABEL } from "@/lib/catalog";

/**
 * Who you are, in the header, on every page.
 *
 * The whole point of the sample subscribers is watching the catalog change
 * as you switch between them, and that only works if the current persona is
 * visible from wherever you happen to be looking. A signed-in state you have
 * to navigate to the account page to confirm is a signed-in state people
 * lose track of.
 */
export function SessionBadge({ compact = false }: { compact?: boolean }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sync = () => setSession(getSession());
    sync();
    window.addEventListener("brahmando:session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("brahmando:session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Nothing until mounted: this renders into statically exported HTML, so a
  // session read at build time would ship one visitor's state to everyone.
  if (!session) return <span className="h-4 w-16" aria-hidden="true" />;

  if (session.kind === "guest") {
    return (
      <Link
        href="/signin"
        className={compact ? "btn-primary" : "btn-primary px-4 py-2 text-xs"}
      >
        Sign in
      </Link>
    );
  }

  return (
    <Link href="/account" className="flex items-center gap-2 text-xs">
      <span
        aria-hidden="true"
        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
        style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--border)" }}
      >
        {session.displayName.slice(0, 1).toUpperCase()}
      </span>
      <span className="hidden sm:inline">
        <span className="font-semibold text-slate-200">{session.displayName}</span>
        <span className="ml-1.5 text-slate-500">{TIER_LABEL[session.tier]}</span>
      </span>
    </Link>
  );
}
