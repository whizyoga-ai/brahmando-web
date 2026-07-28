/**
 * Account and entitlement adapter — STUB IMPLEMENTATION.
 * ──────────────────────────────────────────────────────
 *
 * READ THIS BEFORE TRUSTING ANYTHING IN HERE.
 *
 * This is not authentication. It is a browser-local record of what someone
 * said about themselves, so the enrolment and delivery screens can be built,
 * reviewed and navigated before an identity provider and a payment processor
 * are chosen. Everything it stores lives in this one browser's localStorage
 * and can be edited by anyone with a devtools console.
 *
 * What that means in practice:
 *   - No password is ever asked for, because a password collected here would
 *     be a password stored in localStorage, which is worse than no password.
 *   - Nothing behind it is secret. The widget keys it hands out are PUBLIC
 *     keys (pk_*), which are safe to embed in a page by design — the same
 *     class of key Stripe puts in client-side code. No secret key, no admin
 *     key and no customer data passes through here.
 *   - Every screen that uses it says so on the page, in words the visitor
 *     reads, not in a comment they never see.
 *
 * Brahmando is a static export served from GitHub Pages: there is no server
 * here to check a session against. Real accounts therefore need a real
 * backend, and this file is the seam where it plugs in. Replace the five
 * functions below with calls to it and every screen keeps working.
 *
 * The deliberate design constraint: nothing downstream may read localStorage
 * directly. Everything goes through these functions, so the swap is one file.
 */

export type Account = {
  email: string;
  organisation: string;
  createdAt: string;
};

export type Enrolment = {
  slug: string;
  planId: string;
  enrolledAt: string;
  /** Public widget key, for `widget`-delivery offerings only. */
  publicKey?: string;
};

const ACCOUNT_KEY = "brahmando_account";
const ENROL_KEY = "brahmando_enrolments";

const canStore = () => typeof window !== "undefined" && !!window.localStorage;

function read<T>(key: string, fallback: T): T {
  if (!canStore()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    // A corrupted or unparseable value is treated as absent rather than
    // thrown: a broken record must not make the account page unreachable.
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing and full quotas both throw here. Losing the record is
    // acceptable for a stub; breaking the page the visitor is reading is not.
  }
}

/* ── the seam ─────────────────────────────────────────────────────────── */

export function getAccount(): Account | null {
  return read<Account | null>(ACCOUNT_KEY, null);
}

export function createAccount(email: string, organisation: string): Account {
  const account: Account = {
    email: email.trim(),
    organisation: organisation.trim(),
    createdAt: new Date().toISOString(),
  };
  write(ACCOUNT_KEY, account);
  return account;
}

export function signOut(): void {
  if (!canStore()) return;
  try {
    window.localStorage.removeItem(ACCOUNT_KEY);
    window.localStorage.removeItem(ENROL_KEY);
  } catch {
    /* nothing useful to do */
  }
}

export function getEnrolments(): Enrolment[] {
  return read<Enrolment[]>(ENROL_KEY, []);
}

export function enrol(slug: string, planId: string, needsKey: boolean): Enrolment {
  const existing = getEnrolments().filter((e) => e.slug !== slug);
  const record: Enrolment = {
    slug,
    planId,
    enrolledAt: new Date().toISOString(),
    publicKey: needsKey ? issueDemoKey(slug) : undefined,
  };
  write(ENROL_KEY, [...existing, record]);
  return record;
}

export function enrolmentFor(slug: string): Enrolment | null {
  return getEnrolments().find((e) => e.slug === slug) ?? null;
}

/**
 * A placeholder public key, so the embed snippet on screen is complete and
 * copyable rather than showing `pk_YOUR_KEY_HERE`.
 *
 * It is prefixed `pk_demo_` and is NOT a working key — the real one is issued
 * by the Nexus admin API against a tenant, which needs a server. Naming it
 * "demo" in the key itself means a snippet pasted into a live site fails
 * visibly and immediately, rather than looking correct and silently serving
 * nothing. A key that fails loudly is kinder than one that fails quietly.
 */
function issueDemoKey(slug: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `pk_demo_${slug}_${rand}`;
}
