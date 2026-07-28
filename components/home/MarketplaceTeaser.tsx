import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATALOG, KIND_LABEL, type ItemKind } from "@/lib/catalog";
import { StatusChip } from "@/components/marketplace/StatusChip";

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
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {g.items.map((i) => (
                  <Link key={i.slug} href={`/marketplace/${i.slug}/`} className="card group flex flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                        style={{
                          border: `1px solid ${i.accent}55`,
                          color: i.accent,
                          background: "var(--accent-dim)",
                        }}
                      >
                        {i.glyph}
                      </span>
                      <StatusChip status={i.status} />
                    </div>
                    <p className="mt-3 font-bold text-slate-100">{i.name}</p>
                    <p className="text-xs" style={{ color: i.accent }}>
                      {i.tagline}
                    </p>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">
                      {i.deliverable}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
