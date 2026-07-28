/**
 * Who is browsing, and what that unlocks.
 * ──────────────────────────────────────
 *
 * Three ways in, and they are honestly different from each other:
 *
 *   GUEST     — no sign-in. Browses everything, acquires only what needs no
 *               account. This is the default and it is not a degraded mode:
 *               the whole catalog is readable, because hiding the catalog
 *               from someone deciding whether to buy is self-defeating.
 *
 *   SAMPLE    — a demonstration persona at a chosen tier. Not a credential,
 *               nothing verified. See lib/accounts.ts for why.
 *
 *   GOOGLE    — real Google Identity Services, when a client ID is
 *               configured. It establishes WHO someone is for personalisation
 *               and nothing more, because a static site cannot verify the ID
 *               token it receives — verification needs a server holding the
 *               signing keys. So a Google session grants no tier by itself.
 *               That is stated on the sign-in page rather than implied.
 *
 * All storage is this browser's localStorage, and every read and write goes
 * through this file. Nothing downstream touches localStorage directly, so
 * replacing this with the API gateway's /auth/session is one file.
 */

import { TIER_RANK, type CatalogItem, type Tier, tierUnlocks } from "@/lib/catalog";
import { accountById, type SampleAccount } from "@/lib/accounts";

export type SessionKind = "guest" | "sample" | "google";

export type Session = {
  kind: SessionKind;
  tier: Tier;
  displayName: string;
  email?: string;
  organisation?: string;
  accountId?: string;
  startedAt: string;
};

const KEY = "brahmando_session_v2";

export const GUEST: Session = {
  kind: "guest",
  tier: "guest",
  displayName: "Guest",
  startedAt: "",
};

const canStore = () => typeof window !== "undefined" && !!window.localStorage;

export function getSession(): Session {
  if (!canStore()) return GUEST;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return GUEST;
    const parsed = JSON.parse(raw) as Session;
    // A stored tier that is no longer a real tier would silently unlock or
    // lock everything, so an unrecognised value falls back to guest.
    if (!parsed || !(parsed.tier in TIER_RANK)) return GUEST;
    return parsed;
  } catch {
    return GUEST;
  }
}

function write(s: Session): Session {
  if (canStore()) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      // Private browsing and full quotas both throw. Losing the session is
      // survivable; breaking the page the visitor is on is not.
    }
  }
  // Same-tab listeners: the storage event only fires in OTHER tabs, so
  // without this the header would not notice its own sign-in.
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("brahmando:session"));
  }
  return s;
}

export function signInAsSample(accountId: string): Session {
  const a: SampleAccount | null = accountById(accountId);
  if (!a) return getSession();
  return write({
    kind: "sample",
    tier: a.tier,
    displayName: a.organisation,
    email: a.email,
    organisation: a.organisation,
    accountId: a.id,
    startedAt: new Date().toISOString(),
  });
}

export function signInWithGoogle(name: string, email: string): Session {
  return write({
    kind: "google",
    // No tier. A verified Google identity says who someone is; it says
    // nothing about what they have paid for, and this site cannot verify the
    // token anyway. Granting a tier here would be inventing a subscription.
    tier: "guest",
    displayName: name || email,
    email,
    startedAt: new Date().toISOString(),
  });
}

export function signOut(): Session {
  if (canStore()) {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* nothing useful to do */
    }
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("brahmando:session"));
  }
  return GUEST;
}

/* ── what the session can do ──────────────────────────────────────────── */

export function canAcquire(s: Session, item: CatalogItem): boolean {
  return tierUnlocks(s.tier, item);
}

/** Why an item is locked, phrased for the person reading it. */
export function lockReason(s: Session, item: CatalogItem): string | null {
  if (canAcquire(s, item)) return null;
  if (s.kind === "guest") return "Sign in to use this";
  if (item.requires === "community") return "Community programme only";
  return `Included from ${item.requires.charAt(0).toUpperCase()}${item.requires.slice(1)}`;
}

/**
 * The Google client ID, if one is configured at build time.
 *
 * Absent by default. The sign-in page then explains that Google sign-in
 * needs configuring rather than rendering a button that cannot work — a
 * button that fails on click is worse than one that says why it is not there.
 */
export const GOOGLE_CLIENT_ID: string =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
