import type { Metadata } from "next";
import { LEGACY_PRODUCT_SLUGS, marketplaceUrlFor } from "@/lib/legacy-routes";
import { MovedNotice } from "@/components/marketplace/MovedNotice";
import { itemBySlug } from "@/lib/catalog";

export function generateStaticParams() {
  return Object.keys(LEGACY_PRODUCT_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const to = marketplaceUrlFor(slug);
  return {
    title: "Moved | Brahmando",
    // The canonical is the redirect, as far as a search engine is concerned:
    // it consolidates this URL's history onto the new one instead of leaving
    // two pages competing.
    alternates: { canonical: `https://brahmando.com${to}` },
    robots: { index: false, follow: true },
  };
}

export default async function LegacyProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const to = marketplaceUrlFor(slug);
  const target = LEGACY_PRODUCT_SLUGS[slug];
  const name = target ? itemBySlug(target)?.name ?? "That product" : "That product";
  return <MovedNotice to={to} what={name} />;
}
