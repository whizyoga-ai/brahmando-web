import type { ItemStatus } from "@/lib/catalog";

/**
 * The four states, coloured so they are distinguishable at a glance.
 *
 * "building" and "planned" are shown rather than hidden. A marketplace that
 * only lists what is finished tells you nothing about where it is going; one
 * that lists everything as if it were ready is lying. Saying which is which
 * costs a chip.
 */
const STYLES: Record<ItemStatus, { label: string; fg: string; bg: string; bd: string }> = {
  live:     { label: "Live",        fg: "#6ee7b7", bg: "rgba(16,185,129,0.10)", bd: "rgba(110,231,183,0.35)" },
  beta:     { label: "Beta",        fg: "#fcd34d", bg: "rgba(245,158,11,0.10)", bd: "rgba(252,211,77,0.35)" },
  building: { label: "In build",    fg: "#93c5fd", bg: "rgba(59,130,246,0.10)", bd: "rgba(147,197,253,0.32)" },
  planned:  { label: "Planned",     fg: "#94a3b8", bg: "rgba(148,163,184,0.08)", bd: "rgba(148,163,184,0.28)" },
};

export function StatusChip({ status }: { status: ItemStatus }) {
  const s = STYLES[status];
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
      style={{ color: s.fg, background: s.bg, border: `1px solid ${s.bd}` }}
    >
      {s.label}
    </span>
  );
}
