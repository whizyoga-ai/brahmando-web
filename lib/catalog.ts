/**
 * The Brahmando marketplace catalog.
 * ─────────────────────────────────
 *
 * Brahmando is two things at once, and the catalog has to hold both:
 *
 *   MARKETPLACE — you browse, and you take something away. A widget snippet,
 *   an app build, an MCP server, an API key.
 *
 *   SAAS — what you may take away depends on the plan you are on, and the
 *   thing keeps running afterwards.
 *
 * So every item declares `kind` (what it is) and `requires` (the plan tier
 * that unlocks it). The storefront reads both.
 *
 * HONESTY RULE, ENFORCED BY `status`
 *   live       — running today, you can use it now
 *   beta       — works, rough edges, we will tell you which
 *   building   — real code exists, not deployable by you yet
 *   planned    — named only, nothing to hand over
 *
 * Only `live` and `beta` can be acquired. `building` and `planned` render
 * with no button at all rather than a disabled one, because a greyed-out
 * button still reads as "nearly ready" and these are not.
 *
 * Every status below was checked against the repository and the live hosts
 * on 2026-07-28, not copied from a roadmap. Where something is not deployed,
 * `caveat` says so on the card, not in a footnote.
 */

export type ItemKind = "widget" | "app" | "api" | "mcp" | "service" | "portal";
export type ItemStatus = "live" | "beta" | "building" | "planned";
export type Tier = "guest" | "starter" | "growth" | "scale" | "community";

export type CatalogItem = {
  slug: string;
  name: string;
  tagline: string;
  kind: ItemKind;
  status: ItemStatus;
  /** Lowest plan that unlocks it. `guest` means no account needed. */
  requires: Tier;
  summary: string;
  /** What you physically leave with. */
  deliverable: string;
  /** Stated on the card when the thing is not fully available. */
  caveat?: string;
  glyph: string;
  accent: string;
  /** Where it is explained in full, if that lives elsewhere. */
  learnMore?: string;
  /** Where the working thing is, once unlocked. */
  useUrl?: string;
  /** Marketplace facets. */
  tags: string[];
};

export const KIND_LABEL: Record<ItemKind, string> = {
  widget: "Widget",
  app: "App",
  api: "API",
  mcp: "MCP server",
  service: "Service",
  portal: "Portal",
};

export const TIER_LABEL: Record<Tier, string> = {
  guest: "Free — no account",
  starter: "Starter",
  growth: "Growth",
  scale: "Scale",
  community: "Community",
};

/** Plan ordering, so "does this tier reach that requirement" is a comparison. */
export const TIER_RANK: Record<Tier, number> = {
  guest: 0,
  community: 1,
  starter: 1,
  growth: 2,
  scale: 3,
};

export const CATALOG: CatalogItem[] = [
  /* ── Widgets ─────────────────────────────────────────────────────────── */
  {
    slug: "nexus-widget",
    name: "Nexus",
    tagline: "The AI Business Brain, on your site",
    kind: "widget",
    status: "live",
    requires: "starter",
    summary:
      "An embeddable assistant that learns your business from your own website and documents, answers customers with cited evidence, and says plainly when it does not know.",
    deliverable: "A public widget key and a two-line embed snippet",
    glyph: "◎",
    accent: "#7c8cff",
    learnMore: "https://www.brahmexa.com/nexus.php",
    useUrl: "https://www.brahmexa.com/nexus-sample-client.php",
    tags: ["chat", "support", "website", "grounded"],
  },

  /* ── Apps ────────────────────────────────────────────────────────────── */
  {
    slug: "anyo-android",
    name: "ANYO Academy for Android",
    tagline: "Study offline, sync when you reconnect",
    kind: "app",
    status: "building",
    requires: "community",
    summary:
      "The study portal as a native Android app, with downloadable content packs so a student without steady internet can keep working.",
    deliverable: "An APK and a device activation code",
    caveat:
      "In development in the brahmando-apps repository. There is no build to download yet — the device-activation and offline-licence endpoints it needs are written but not deployed.",
    glyph: "◐",
    accent: "#7ae8df",
    tags: ["education", "android", "offline"],
  },
  {
    slug: "swan-board",
    name: "SWAN Smart Board",
    tagline: "The classroom build",
    kind: "app",
    status: "building",
    requires: "community",
    summary:
      "The Smart Board build of the classroom experience — sessions, activities and roll-up reporting for a room rather than a single student.",
    deliverable: "A board image and an activation code",
    caveat:
      "In development. The classroom session and event endpoints exist in the API gateway; the gateway itself is not yet deployed.",
    glyph: "▣",
    accent: "#c98a5e",
    tags: ["education", "classroom", "hardware"],
  },

  /* ── APIs ────────────────────────────────────────────────────────────── */
  {
    slug: "brahmando-api",
    name: "Brahmando API",
    tagline: "REST for everything above",
    kind: "api",
    status: "building",
    requires: "scale",
    summary:
      "One stable REST surface at /api/v1 — auth, tenants, devices, entitlements, education content, learning progress and classroom sessions — so your own software can use what the apps use.",
    deliverable: "A service credential and the OpenAPI document",
    caveat:
      "Written and reviewable in services/api-gateway, not yet deployed: api.brahmando.com currently answers with the older edge gateway, so only /health and /openapi.json respond. Password sign-in is deliberately unimplemented — see the developer page.",
    glyph: "⬡",
    accent: "#60a5fa",
    learnMore: "/developers/",
    tags: ["rest", "openapi", "integration"],
  },

  /* ── MCP servers ─────────────────────────────────────────────────────── */
  {
    slug: "mcp-gateway",
    name: "Brahmando MCP",
    tagline: "Give your assistant these tools",
    kind: "mcp",
    status: "building",
    requires: "scale",
    summary:
      "An MCP endpoint exposing curated tools — nexus_search, nexus_query, education_list_bundles, learning_get_progress, space_invoke_agent, reach_start_audit and more — each with authentication, tenant scoping and rate limits.",
    deliverable: "An MCP endpoint URL and a service credential",
    caveat:
      "Implemented in the gateway alongside the REST surface, and deployed at the same time as it. Deliberately never exposes shell, SQL, filesystem or cluster access.",
    glyph: "⬢",
    accent: "#a78bfa",
    learnMore: "/developers/",
    tags: ["mcp", "agents", "tools"],
  },
  {
    slug: "dikeai-mcp",
    name: "DikeAI",
    tagline: "Legal and compliance MCP for US small business",
    kind: "mcp",
    status: "beta",
    requires: "scale",
    summary:
      "Tax, startup law and policy question answering for US small businesses, exposed as an MCP server your assistant can call.",
    deliverable: "Connection details for your MCP client",
    caveat: "Running on the platform cluster. Ask us for connection details — self-serve provisioning is not built.",
    glyph: "⚖",
    accent: "#57d8cf",
    tags: ["mcp", "legal", "compliance"],
  },
  {
    slug: "narada-mcp",
    name: "Narada",
    tagline: "WhatsApp bridge for agent messaging",
    kind: "mcp",
    status: "beta",
    requires: "scale",
    summary:
      "An MCP bridge that lets an agent send and receive WhatsApp messages for customer notifications and conversations.",
    deliverable: "Connection details for your MCP client",
    caveat: "Running on the platform cluster. Ask us for connection details — self-serve provisioning is not built.",
    glyph: "✉",
    accent: "#f4c86a",
    tags: ["mcp", "whatsapp", "messaging"],
  },

  /* ── Services and portals ────────────────────────────────────────────── */
  {
    slug: "reach-studio",
    name: "REACH Studio",
    tagline: "Digital marketing studio",
    kind: "portal",
    status: "live",
    requires: "growth",
    summary:
      "Drafts social posts and content, adapts each one per channel, and holds every publish behind an approval step you control.",
    deliverable: "Access to REACH Studio in your browser",
    caveat:
      "Publishing is dry-run today: REACH prepares and records the post, a person completes the publish. Performance figures are entered by a person, and it shows \"not enough data\" rather than estimating.",
    glyph: "✦",
    accent: "#f4c86a",
    learnMore: "https://www.brahmexa.com/services/reach",
    useUrl: "https://saas.brahmexa.com/reach/studio.html",
    tags: ["marketing", "social", "content"],
  },
  {
    slug: "orbit-hosting",
    name: "ORBIT",
    tagline: "Intelligent web hosting",
    kind: "service",
    status: "live",
    requires: "guest",
    summary:
      "Watches the digital face of your business — availability, speed, security, content freshness, and how easily customers and AI assistants find you.",
    deliverable: "A free starter analysis of your public site, then hosting if you want it",
    glyph: "◍",
    accent: "#57d8cf",
    learnMore: "https://www.brahmexa.com/services/orbit",
    useUrl: "https://www.brahmexa.com/services/orbit#orbit-request",
    tags: ["hosting", "monitoring", "seo"],
  },
  {
    slug: "anyo-portal",
    name: "ANYO Academy",
    tagline: "Study platform, free to browse",
    kind: "portal",
    status: "live",
    requires: "community",
    summary:
      "Curriculum-aligned material, practice and study rooms. Free to browse before you register, and free for qualifying schools and nonprofits.",
    deliverable: "A student, teacher or parent account",
    caveat: "Curriculum coverage varies by board and class. Browse before registering to check your syllabus is covered.",
    glyph: "◈",
    accent: "#7ae8df",
    learnMore: "https://www.brahmexa.com/services/education",
    useUrl: "/education/",
    tags: ["education", "cbse", "study-rooms"],
  },
  {
    slug: "smb-engine",
    name: "SMB Engine",
    tagline: "Agents for small business operations",
    kind: "portal",
    status: "live",
    requires: "growth",
    summary:
      "Industry-shaped assistants that answer routine questions and handle repetitive back-office steps.",
    deliverable: "Access to the assistant for your vertical",
    caveat:
      "Available verticals are listed on the hub; if yours is not there it is not supported yet. Assistants draft and answer — they do not take payments or make commitments for you.",
    glyph: "◉",
    accent: "#c98a5e",
    learnMore: "https://www.brahmexa.com/services/smb",
    useUrl: "https://saas.brahmexa.com/smb/",
    tags: ["agents", "operations", "smb"],
  },
];

export const acquirable = (i: CatalogItem) => i.status === "live" || i.status === "beta";

export const itemBySlug = (slug: string) => CATALOG.find((i) => i.slug === slug) ?? null;

/** Does `tier` reach what `item` asks for? */
export function tierUnlocks(tier: Tier, item: CatalogItem): boolean {
  if (item.requires === "guest") return true;
  // Community is its own track: it unlocks education, not the commercial tiers.
  if (item.requires === "community") return tier === "community" || TIER_RANK[tier] >= TIER_RANK.growth;
  if (tier === "community") return false;
  return TIER_RANK[tier] >= TIER_RANK[item.requires];
}
