"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import {
  CATALOG,
  KIND_LABEL,
  acquirable,
  type CatalogItem,
  type ItemKind,
} from "@/lib/catalog";
import { getSession, canAcquire, lockReason, type Session } from "@/lib/session";
import { StatusChip } from "@/components/marketplace/StatusChip";

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
                color: active ? "var(--accent)" : "#94a3b8",
              }}
            >
              {f.label} <span className="opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.slug} item={item} session={session} />
        ))}
      </div>
    </>
  );
}

function Card({ item, session }: { item: CatalogItem; session: Session | null }) {
  // Until the session is read (client-side only), render the locked-neutral
  // state rather than guessing — a card that flips from unlocked to locked
  // after hydration looks like the site retracting an offer.
  const unlocked = session ? canAcquire(session, item) : false;
  const reason = session ? lockReason(session, item) : null;
  const ready = acquirable(item);

  return (
    <Link href={`/marketplace/${item.slug}/`} className="card group flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
          style={{
            border: `1px solid ${item.accent}55`,
            color: item.accent,
            background: "var(--accent-dim)",
          }}
        >
          {item.glyph}
        </span>
        <div className="flex flex-col items-end gap-1.5">
          <span className="tag text-[10px]">{KIND_LABEL[item.kind]}</span>
          <StatusChip status={item.status} />
        </div>
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-100">{item.name}</h2>
      <p className="text-xs font-medium" style={{ color: item.accent }}>
        {item.tagline}
      </p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{item.summary}</p>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        <span className="text-slate-400">You get:</span> {item.deliverable}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
        {!ready ? (
          <span className="text-slate-600">Not available to take yet</span>
        ) : unlocked ? (
          <span style={{ color: item.accent }}>Open →</span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <Lock className="h-3.5 w-3.5" />
            {reason ?? "Sign in to use this"}
          </span>
        )}
      </div>
    </Link>
  );
}
