import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OFFERINGS, DELIVERY_LABEL } from "@/lib/offerings";

/**
 * The products, on the homepage, above everything else.
 *
 * A visitor who has just been told they can get something working today
 * should not have to click "Catalog" to find out what. The full catalog page
 * still exists for browsing; this is the answer to "like what?".
 */
export function CatalogSection() {
  const live = OFFERINGS.filter((o) => o.status !== "soon");

  return (
    <section className="py-24" id="catalog">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="section-title">What you can pick up</h2>
        <p className="section-subtitle mt-3 max-w-2xl">
          Five products, each with a free way to start. Every one of them is running today —
          nothing here is a waiting list.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {live.map((o) => (
            <Link key={o.slug} href={`/products/${o.slug}/`} className="card group flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                  style={{
                    border: `1px solid ${o.accent}55`,
                    color: o.accent,
                    background: "var(--accent-dim)",
                  }}
                >
                  {o.glyph}
                </span>
                <span className="tag text-[10px]">{DELIVERY_LABEL[o.delivery]}</span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-100">{o.name}</h3>
              <p className="text-xs font-medium" style={{ color: o.accent }}>
                {o.tagline}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{o.summary}</p>

              <span
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform group-hover:translate-x-0.5"
                style={{ color: o.accent }}
              >
                Get {o.name} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
