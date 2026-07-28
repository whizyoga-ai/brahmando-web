import Link from "next/link";
import { Lock } from "lucide-react";
import { KIND_LABEL, acquirable, type CatalogItem } from "@/lib/catalog";
import { StatusChip } from "@/components/marketplace/StatusChip";

/**
 * One marketplace item as a circular portal.
 *
 * brahmexa.com renders its services as circles rather than cards, and this
 * is that treatment: a glowing ring, a dashed orbit turning inside it, and
 * the content in the core.
 *
 * A circle holds less than a rectangle, which forces a useful discipline —
 * mark, name, one line, one status. The summary, the caveat, the plan and
 * the delivery all live on the item's page, one click away. Trying to keep
 * the card's full content inside a disc is what makes circular layouts look
 * cramped; giving things up is what makes them look composed.
 *
 * `locked` is passed in rather than read here, so this stays a server
 * component and the grid decides once for all of them.
 */
export function PortalCard({
  item,
  locked = false,
  lockLabel,
}: {
  item: CatalogItem;
  locked?: boolean;
  lockLabel?: string | null;
}) {
  const ready = acquirable(item);
  const classes = [
    "bx-portal",
    !ready ? "is-unavailable" : locked ? "is-locked" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={`/marketplace/${item.slug}/`}
      className={classes}
      // The accent tints the glow, so a row of portals reads as several
      // different things rather than as repeated wallpaper.
      style={
        {
          "--p-accent": item.accent,
          "--p-glow": `${item.accent}33`,
        } as React.CSSProperties
      }
      aria-label={`${item.name} — ${item.tagline}${locked ? ` (${lockLabel ?? "locked"})` : ""}`}
    >
      <span className="bx-portal-ring" aria-hidden="true" />
      <span className="bx-portal-orbit" aria-hidden="true" />
      <span className="bx-portal-core">
        <span className="bx-portal-glyph" aria-hidden="true">
          {item.glyph}
        </span>
        <span className="bx-portal-name">{item.name}</span>
        <span className="bx-portal-sub">{item.tagline}</span>
        <span className="bx-portal-foot">
          <StatusChip status={item.status} />
          {!ready ? null : locked ? (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold"
              style={{ color: "var(--text-3)" }}
            >
              <Lock className="h-2.5 w-2.5" />
              {lockLabel ?? "Locked"}
            </span>
          ) : (
            <span className="text-[10px] font-semibold" style={{ color: item.accent }}>
              Open
            </span>
          )}
        </span>
        <span className="sr-only">{KIND_LABEL[item.kind]}</span>
      </span>
    </Link>
  );
}
