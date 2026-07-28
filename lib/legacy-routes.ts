/**
 * Where the pre-marketplace URLs went.
 * ───────────────────────────────────
 *
 * brahmando.com briefly published /catalog/ and /products/<slug>/. Those
 * paths were linked from brahmexa.com — including a footer link on every
 * page — and the rebuild removed them, so every one of those links 404'd
 * until it was noticed by someone clicking it.
 *
 * The links themselves are fixed at source. These redirects exist for
 * everything already out of our hands: a bookmark, a shared link, a cached
 * search result, a message someone sent last week.
 *
 * GitHub Pages serves static files and cannot issue a 301, so each of these
 * renders a page carrying a canonical link to the new URL (which is what a
 * search engine follows) and a meta refresh plus a visible link (which is
 * what a person follows). Slower than a real redirect and honest about it.
 */
export const LEGACY_PRODUCT_SLUGS: Record<string, string> = {
  nexus: "nexus-widget",
  orbit: "orbit-hosting",
  reach: "reach-studio",
  education: "anyo-portal",
  smb: "smb-engine",
  space: "", // was never published; send it to the marketplace index
};

export const marketplaceUrlFor = (legacy: string) => {
  const slug = LEGACY_PRODUCT_SLUGS[legacy];
  return slug ? `/marketplace/${slug}/` : "/marketplace/";
};
