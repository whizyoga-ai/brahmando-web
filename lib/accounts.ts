/**
 * Sample subscriber accounts.
 * ──────────────────────────
 *
 * These are demonstration personas, not credentials. They exist so the
 * marketplace can be walked at every tier — you sign in as a Starter
 * business and watch which cards unlock, then as Scale and watch the API and
 * MCP entries open up. That is a thing you cannot show with screenshots and
 * cannot judge from a pricing table.
 *
 * WHY THERE ARE NO PASSWORDS
 * brahmando.com is a static export with no server, so a password typed here
 * could only be checked in the browser — which is not a check. Worse, people
 * reuse passwords, so a fake login box is a way to collect real credentials
 * by accident. You pick a persona from a list instead. Nothing is verified
 * because there is nothing here to protect.
 *
 * The platform's real identity story is deliberately unfinished, and it is
 * worth knowing why: the API gateway refuses to implement password sign-in
 * because education-portal and space-core keep unrelated user stores, and
 * whichever one the gateway verified against would silently become the
 * platform's identity provider. See services/api-gateway/app/routers/auth.py.
 * Until that is decided, no honest login can exist here either.
 *
 * WHAT THE GATE ACTUALLY IS
 * A storefront, not a security boundary. Nothing behind it is secret: widget
 * keys are public by design, app builds are not published yet, and MCP and
 * API access are provisioned by a person. Real enforcement lives in the
 * services — Nexus checks the request Origin against a tenant allowlist, and
 * the gateway checks tokens server-side. Tier gating here decides what a
 * visitor is shown and offered, which is a shopping experience.
 */

import type { Tier } from "@/lib/catalog";

export type SampleAccount = {
  id: string;
  /** What they would type, shown so the personas feel like real customers. */
  email: string;
  organisation: string;
  /** Who this persona is, so a visitor picks the one resembling them. */
  persona: string;
  tier: Tier;
  planName: string;
  planPrice: string;
  /** Education bundle ids, mirroring the gateway's bundle catalog. */
  bundles?: string[];
  seats?: number;
};

export const SAMPLE_ACCOUNTS: SampleAccount[] = [
  {
    id: "northstar",
    email: "owner@northstar-heating.example",
    organisation: "Northstar Heating & Air",
    persona: "A ten-person HVAC company that answers the same questions all day",
    tier: "starter",
    planName: "Starter",
    planPrice: "Free while you are small",
    seats: 3,
  },
  {
    id: "meridian",
    email: "ops@meridian-clinics.example",
    organisation: "Meridian Clinics",
    persona: "A three-site clinic group running marketing and front desk together",
    tier: "growth",
    planName: "Growth",
    planPrice: "Talk to us",
    seats: 12,
  },
  {
    id: "kestrel",
    email: "platform@kestrel-retail.example",
    organisation: "Kestrel Retail Group",
    persona: "An engineering team that wants the APIs and MCP tools, not the portals",
    tier: "scale",
    planName: "Scale",
    planPrice: "Talk to us",
    seats: 40,
  },
  {
    id: "vidya",
    email: "head@vidya-vidyalaya.example",
    organisation: "Vidya Vidyalaya",
    persona: "An under-resourced school on the community access programme",
    tier: "community",
    planName: "Community",
    planPrice: "No cost, qualifying schools and nonprofits",
    bundles: ["boards_cbse_icse", "science_8_12", "humanities_8_12", "misc_cbse_class10_school"],
    seats: 240,
  },
];

export const accountById = (id: string) => SAMPLE_ACCOUNTS.find((a) => a.id === id) ?? null;
