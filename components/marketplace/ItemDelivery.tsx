"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Lock } from "lucide-react";
import { KIND_LABEL, TIER_LABEL, acquirable, type CatalogItem } from "@/lib/catalog";
import { canAcquire, getSession, lockReason, type Session } from "@/lib/session";

/**
 * The half of the page that depends on who is looking.
 *
 * Rendered only after mount: this page is exported once and served to
 * everybody, so anything read from the session has to appear after
 * hydration or one visitor's state would be baked into the shared HTML.
 */
export function ItemDelivery({ item }: { item: CatalogItem }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sync = () => setSession(getSession());
    sync();
    window.addEventListener("brahmando:session", sync);
    return () => window.removeEventListener("brahmando:session", sync);
  }, []);

  if (!session) return <div className="mt-12 h-56" aria-hidden="true" />;

  const ready = acquirable(item);
  const unlocked = canAcquire(session, item);

  if (!ready) {
    return (
      <section className="mt-12 rounded-2xl p-6" style={{ border: "1px solid var(--border)", background: "var(--panel)" }}>
        <h2 className="text-lg font-bold text-slate-100">Not available to take yet</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {item.caveat ??
            "This is named here because it is being built, not because it is ready. There is nothing to hand over today."}
        </p>
        <p className="mt-4 text-xs text-slate-500">
          There is no button, deliberately — a greyed-out one still reads as &ldquo;nearly
          ready&rdquo;, and this is not.
        </p>
        <Link href="/access/" className="btn-secondary mt-5 inline-flex">
          Tell us you want it
        </Link>
      </section>
    );
  }

  if (!unlocked) {
    return (
      <section className="mt-12 rounded-2xl p-6" style={{ border: "1px solid var(--border)", background: "var(--panel)" }}>
        <h2 className="inline-flex items-center gap-2 text-lg font-bold text-slate-100">
          <Lock className="h-4 w-4" /> {lockReason(session, item)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {item.name} is included from <strong className="text-slate-200">{TIER_LABEL[item.requires]}</strong>.
          {session.kind === "guest"
            ? " Sign in as one of the sample subscribers to see it from the inside."
            : " Your current plan does not include it."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/signin/?next=${encodeURIComponent(`/marketplace/${item.slug}/`)}`}
            className="btn-primary inline-flex"
          >
            {session.kind === "guest" ? "Sign in" : "Switch subscriber"}
          </Link>
          <Link href="/access/" className="btn-secondary inline-flex">
            Talk to us about upgrading
          </Link>
        </div>
      </section>
    );
  }

  return <Unlocked item={item} session={session} />;
}

function Unlocked({ item, session }: { item: CatalogItem; session: Session }) {
  return (
    <section className="mt-12">
      <div
        className="rounded-2xl p-6"
        style={{ border: `1px solid ${item.accent}55`, background: "var(--accent-dim)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: item.accent }}>
          Included on your plan
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-100">{item.deliverable}</h2>
        {session.organisation && (
          <p className="mt-2 text-sm text-slate-400">for {session.organisation}</p>
        )}
      </div>

      {item.kind === "widget" && <WidgetHandover item={item} session={session} />}

      {item.kind !== "widget" && item.useUrl && (
        <div className="mt-8 rounded-2xl p-6" style={{ border: "1px solid var(--border)", background: "var(--panel)" }}>
          <h3 className="font-bold text-slate-100">
            {item.kind === "service" ? "We come to you" : "Open it"}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {item.kind === "service"
              ? "ORBIT's starter analysis runs against your public website — no credentials needed. Send the address and we run it and write back."
              : `${item.name} runs in your browser. Sign in with the email on your account.`}
          </p>
          <a
            href={item.useUrl}
            target={item.useUrl.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="btn-primary mt-5 inline-flex"
          >
            {item.kind === "service" ? "Send your website address" : `Open ${item.name}`}
          </a>
        </div>
      )}

      {(item.kind === "api" || item.kind === "mcp") && (
        <div className="mt-8 rounded-2xl p-6" style={{ border: "1px solid var(--border)", background: "var(--panel)" }}>
          <h3 className="font-bold text-slate-100">Provisioned by a person, for now</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {KIND_LABEL[item.kind]} credentials are issued by hand: self-serve issuing needs the
            gateway deployed and an identity provider chosen, and neither is done. Ask and we will
            set you up the same day.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/developers/" className="btn-primary inline-flex">
              See what it exposes
            </Link>
            <Link href="/access/" className="btn-secondary inline-flex">
              Request credentials
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/account/" className="btn-secondary inline-flex">
          Your account
        </Link>
        <Link href="/marketplace/" className="btn-secondary inline-flex">
          Back to the marketplace
        </Link>
      </div>
    </section>
  );
}

/** The embed snippet, ready to paste. */
function WidgetHandover({ item, session }: { item: CatalogItem; session: Session }) {
  const [copied, setCopied] = useState(false);
  const key = `pk_demo_${session.accountId ?? "guest"}_${item.slug.replace(/-/g, "_")}`;
  const snippet = `<script src="https://www.brahmexa.com/nexus/widget.js"\n        data-nexus-key="${key}" defer></script>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access is permission-gated and refused outright in some
      // browsers. The snippet is on screen and selectable regardless.
    }
  }

  return (
    <div className="mt-8 rounded-2xl p-6" style={{ border: "1px solid var(--border)", background: "var(--panel)" }}>
      <h3 className="font-bold text-slate-100">Paste this before &lt;/body&gt;</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Two lines, on every page you want {item.name} to answer on. The key is public by design: it
        identifies your site, authorises nothing, and is safe to commit.
      </p>

      <pre
        className="mt-5 overflow-x-auto rounded-xl p-4 text-xs leading-relaxed"
        style={{ border: "1px solid var(--border)", background: "rgba(0,0,0,0.35)", color: "#cbd5e1" }}
      >
        <code>{snippet}</code>
      </pre>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={copy} className="btn-secondary inline-flex items-center gap-2 text-sm">
          <Copy className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy snippet"}
        </button>
        <a
          href="https://www.brahmexa.com/nexus-sample-client.php"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm"
          style={{ color: "var(--accent)" }}
        >
          See it answering on a live site →
        </a>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-slate-500">
        <strong className="text-slate-400">This key is a placeholder.</strong> It is prefixed
        <code className="mx-1 text-slate-400">pk_demo_</code>so it fails visibly rather than
        silently if you paste it into a live site. Real keys are issued per business against a
        tenant, which needs the admin API —{" "}
        <Link href="/access/" style={{ color: "var(--accent)" }}>
          ask us
        </Link>{" "}
        and we will set your site up today.
      </p>
    </div>
  );
}
