import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATALOG, KIND_LABEL, type ItemKind } from "@/lib/catalog";
import { PortalCard } from "@/components/marketplace/PortalCard";

/**
 * The marketplace, on the homepage, grouped by what a thing *is*.
 *
 * Grouping by kind rather than by product line is the point: someone arrives
 * wanting a widget, or an API, or an app for a classroom, and the shape of
 * the thing is what they can name. Which product line it belongs to is our
 * organisational chart, not their question.
 */
const ORDER: ItemKind[] = ["widget", "app", "api", "mcp", "portal", "service"];

export function MarketplaceTeaser() {
  const groups = ORDER.map((kind) => ({
    kind,
    items: CATALOG.filter((i) => i.kind === kind),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="py-24" id="marketplace">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">The marketplace</h2>
            <p className="section-subtitle mt-3 max-w-2xl">
              Browsing needs no account. What you can take away depends on your plan — and every
              card says which, along with what it does not do yet.
            </p>
          </div>
          <Link href="/marketplace/" className="btn-secondary inline-flex shrink-0">
            Browse everything <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 space-y-10">
          {groups.map((g) => (
            <div key={g.kind}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {KIND_LABEL[g.kind]}s
              </h3>
              {/* Circles wrap in a centred flex row rather than a grid.
                  Equal discs read as a constellation when allowed to sit
                  close and centre; forced into columns they read as a table
                  with the corners knocked off. */}
              <div className="mt-5 flex flex-wrap items-start justify-center gap-x-6 gap-y-10 sm:justify-start">
                {g.items.map((i) => (
                  <PortalCard key={i.slug} item={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
