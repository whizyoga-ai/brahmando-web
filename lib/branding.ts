/**
 * Brahmando / Brahmexa Branding Configuration
 * ─────────────────────────────────────────────
 * Single source of truth for all brand tokens.
 * All UI components should consume from this file.
 *
 * WHOSE SITE THIS IS
 * These values used to name ManjuLAB as the company, the developer and the
 * link target, and every component reads from here — so one file was
 * asserting across the whole site that the commercial entity behind
 * brahmando.com is ManjuLAB, and linking to manjulab.com to prove it.
 *
 * That is why a search for Brahmexa answered "ManjuLAB". brahmexa.com had
 * its own such claims removed on 2026-07-27, but this domain kept making
 * them in prose, in metadata and in the footer of every page — a louder and
 * more consistent signal than anything on the marketing site.
 *
 * Brahmexa LLC is the entity. Keep it that way: a second name here
 * propagates to sixteen components and back into search results.
 *
 * TO ADD LOGOS: replace the `logoPath` / `iconPath` values with
 * paths under /public/branding/ once assets are provided.
 */

export const branding = {
  // ─── Names & messaging ─────────────────────────────────────────
  name: "Brahmando",
  fullName: "Brahmando — the Brahmexa platform",
  tagline:
    "AI agents, MCP servers and agentic workflows from Brahmexa. Offered to customers and community partners.",
  company: "Brahmexa LLC",
  companySite: "https://www.brahmexa.com",
  groupBrand: "Brahmexa",
  groupBrandTagline: "Democratizing Intelligence",
  /** Same values as `groupBrand` / `groupBrandTagline`; kept for backward-compatible imports. */
  aiBrand: "Brahmexa",
  aiBrandTagline: "Democratizing Intelligence",
  developer: "Brahmexa",
  host: "Brahmando",
  domain: "brahmando.com",
  accessModel: {
    customer: true,
    community: true,
    public: false,
  },
  groupMembers: ["Brahmexa", "Brahmando"] as const,

  // ─── Logo paths (served from /public/branding/) ───────────────
  logos: {
    brahmando: {
      wordmark: "/branding/brahmando-logo.jpg",
      icon: "/branding/brahmando-logo.jpg",
    },
    brahmexa: {
      wordmark: "/branding/brahmexa-logo.jpeg",
      icon: "/branding/brahmexa-logo.jpeg",
    },
  },

  // ─── Colours (mirrors tailwind.config.js) ─────────────────────
  colors: {
    primary:    "#3b82f6",   // brand-500
    primaryDark:"#2563eb",   // brand-600
    navy:       "#1e3a8a",   // brand-900
    white:      "#ffffff",
    background: "#f8fafc",   // surface-muted
    border:     "#e2e8f0",   // surface-border
    text:       "#0f172a",   // slate-900
    textMuted:  "#64748b",   // slate-500
  },

  // ─── Typography ────────────────────────────────────────────────
  typography: {
    fontSans: "Inter, system-ui, sans-serif",
    fontMono: "JetBrains Mono, monospace",
  },
} as const;

export type Branding = typeof branding;
