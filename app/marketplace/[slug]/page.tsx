import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATALOG, KIND_LABEL, TIER_LABEL, itemBySlug } from "@/lib/catalog";
import { StatusChip } from "@/components/marketplace/StatusChip";
import { ItemDelivery } from "@/components/marketplace/ItemDelivery";

/**
 * Every catalog item gets a page, including the ones being built.
 *
 * Unlike an enrolment route, a marketplace listing for unfinished work is
 * useful: it says what is coming and what it will need. The page refuses to
 * hand anything over — that decision lives in ItemDelivery — but it will
 * describe it honestly.
 */
export function generateStaticParams() {
  return CATALOG.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = itemBySlug(slug);
  if (!i) return { title: "Not found | Brahmando" };
  return {
    title: `${i.name} — ${i.tagline} | Brahmando`,
    description: i.summary,
  };
}

export default async function ItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = itemBySlug(slug);
  if (!item) notFound();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link href="/marketplace/" className="text-xs text-slate-500 hover:text-slate-300">
          ← Marketplace
        </Link>

        <div className="mt-6 flex flex-wrap items-start gap-5">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
            style={{
              border: `1px solid ${item.accent}55`,
              color: item.accent,
              background: "var(--accent-dim)",
            }}
          >
            {item.glyph}
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag text-[10px]">{KIND_LABEL[item.kind]}</span>
              <StatusChip status={item.status} />
              <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
                {TIER_LABEL[item.requires]}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-black text-slate-100">{item.name}</h1>
            <p className="text-sm font-medium" style={{ color: item.accent }}>
              {item.tagline}
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-400">{item.summary}</p>

        {item.learnMore && (
          <a
            href={item.learnMore}
            target={item.learnMore.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm"
            style={{ color: "var(--accent)" }}
          >
            {item.learnMore.startsWith("http")
              ? "Read the full description on brahmexa.com →"
              : "See the technical detail →"}
          </a>
        )}

        {/* The caveat sits ABOVE the acquisition control, always. Someone who
            meets a limitation after taking something is a support ticket and
            a refund; someone who reads it first made a choice. */}
        {item.caveat && (
          <section
            className="mt-10 rounded-2xl p-6"
            style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              What you should know first
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.caveat}</p>
          </section>
        )}

        <ItemDelivery item={item} />

        {item.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span key={t} className="tag text-[10px]">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
