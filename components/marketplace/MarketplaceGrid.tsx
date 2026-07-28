"use client";

import { useEffect, useMemo, useState } from "react";
import { CATALOG, type ItemKind } from "@/lib/catalog";
import { getSession, canAcquire, lockReason, type Session } from "@/lib/session";
import { PortalCard } from "@/components/marketplace/PortalCard";

const FILTERS: { id: ItemKind | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "widget", label: "Widgets" },
  { id: "app", label: "Apps" },
  { id: "api", label: "APIs" },
  { id: "mcp", label: "MCP servers" },
  { id: "portal", label: "Portals" },
  { id: "service", label: "Services" },
];

export function MarketplaceGrid() {
  const [session, setSession] = useState<Session | null>(null);
  const [filter, setFilter] = useState<ItemKind | "all">("all");

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

  const items = useMemo(
    () => (filter === "all" ? CATALOG : CATALOG.filter((i) => i.kind === filter)),
    [filter]
  );

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          const n = f.id === "all" ? CATALOG.length : CATALOG.filter((i) => i.kind === f.id).length;
          if (n === 0) return null;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
              style={{
                border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                background: active ? "var(--accent-dim)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-2)",
              }}
            >
              {f.label} <span className="opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      {/* Circles wrap in a centred flex row rather than a grid: discs of
          equal size read as a constellation when they are allowed to sit
          close and centre, and as a broken table when forced into columns. */}
      <div className="mt-10 flex flex-wrap items-start justify-center gap-x-6 gap-y-10">
        {items.map((item) => {
          const unlocked = session ? canAcquire(session, item) : false;
          return (
            <PortalCard
              key={item.slug}
              item={item}
              locked={!unlocked}
              lockLabel={session ? lockReason(session, item) : "Sign in"}
            />
          );
        })}
      </div>
    </>
  );
}
