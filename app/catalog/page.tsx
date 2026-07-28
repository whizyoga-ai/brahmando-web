import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { OFFERINGS, DELIVERY_LABEL } from "@/lib/offerings";

export const metadata: Metadata = {
  title: "Catalog — get a Brahmexa product | Brahmando",
  description:
    "Every Brahmexa product you can enrol in: Nexus, REACH, ORBIT, ANYO Academy and the SMB Engine. Pick one, choose a plan, and get the thing.",
};

export default function CatalogPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
          Brahmexa catalog
        </p>
        <h1 className="section-title mt-2">Pick a product. Get it working.</h1>
        <p className="section-subtitle mt-3 max-w-2xl">
          Brahmexa.com explains what each product does and why. This is where you sign up and
          receive it — a widget key, a portal account, or a person who gets in touch.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {OFFERINGS.map((o) => {
            const ready = o.status !== "soon";
            return (
              <div
                key={o.slug}
                className="card flex flex-col p-6"
                style={{ opacity: ready ? 1 : 0.55 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                    style={{ border: `1px solid ${o.accent}55`, color: o.accent, background: "var(--accent-dim)" }}
                  >
                    {o.glyph}
                  </span>
                  <span className="tag text-[10px]">
                    {ready ? DELIVERY_LABEL[o.delivery] : "Coming soon"}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-100">{o.name}</h2>
                <p className="text-xs font-medium" style={{ color: o.accent }}>
                  {o.tagline}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{o.summary}</p>

                {/* What you actually walk away with. A catalog that lists
                    features but never says what arrives leaves the visitor
                    guessing at the one thing they came to find out. */}
                {ready && (
                  <p className="mt-4 text-xs leading-relaxed text-slate-500">
                    <span className="text-slate-400">You get:</span> {o.deliverable}
                  </p>
                )}

                {ready ? (
                  <Link
                    href={`/products/${o.slug}/`}
                    className="btn-primary mt-5 inline-flex items-center justify-center gap-2 text-sm"
                  >
                    Get {o.name} <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <p className="mt-5 text-xs text-slate-600">
                    Not available yet — nothing to sign up for.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
