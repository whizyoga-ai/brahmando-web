import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OFFERINGS, offeringBySlug } from "@/lib/offerings";
import { ProductDelivery } from "@/components/delivery/ProductDelivery";

/**
 * Static export needs every route enumerated at build time.
 *
 * Only enrollable offerings get a page. A `soon` product has no route at
 * all, so guessing /products/space/ returns the 404 rather than an enrol
 * button for something that cannot be delivered — the status gate enforced
 * by the router instead of by a conditional someone can forget.
 */
export function generateStaticParams() {
  return OFFERINGS.filter((o) => o.status !== "soon").map((o) => ({ slug: o.slug }));
}

// `params` is a Promise from Next 15 onward — the lockfile resolves well past
// the 14.x in package.json, so these must be awaited or the build fails type
// checking after compiling cleanly.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const o = offeringBySlug(slug);
  if (!o) return { title: "Not found | Brahmando" };
  return {
    title: `Get ${o.name} — ${o.tagline} | Brahmando`,
    description: o.summary,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offering = offeringBySlug(slug);
  if (!offering || offering.status === "soon") notFound();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
            style={{
              border: `1px solid ${offering.accent}55`,
              color: offering.accent,
              background: "var(--accent-dim)",
            }}
          >
            {offering.glyph}
          </span>
          <div>
            <h1 className="text-3xl font-black text-slate-100">{offering.name}</h1>
            <p className="text-sm font-medium" style={{ color: offering.accent }}>
              {offering.tagline}
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400">
          {offering.summary}
        </p>
        <p className="mt-2 text-sm text-slate-500">For: {offering.audience}</p>

        <a
          href={offering.marketingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm"
          style={{ color: "var(--accent)" }}
        >
          Read the full description on brahmexa.com →
        </a>

        {/* Limitations sit ABOVE the enrol control, deliberately.
            Every line here is true today. A customer who finds a limit after
            signing up is a refund and a bad review; one who reads it first is
            a customer who chose it knowingly. */}
        {offering.limitations && offering.limitations.length > 0 && (
          <section
            className="mt-10 rounded-2xl p-6"
            style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              What it does not do yet
            </h2>
            <ul className="mt-4 space-y-3">
              {offering.limitations.map((l) => (
                <li key={l} className="flex gap-3 text-sm leading-relaxed text-slate-400">
                  <span aria-hidden="true" style={{ color: offering.accent }}>
                    ·
                  </span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ProductDelivery offering={offering} />
      </div>
    </div>
  );
}
