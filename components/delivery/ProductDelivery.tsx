"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import type { Offering } from "@/lib/offerings";
import { getAccount, enrol, enrolmentFor, type Enrolment } from "@/lib/entitlements";
import { StubNotice } from "@/components/delivery/StubNotice";

/**
 * Plan choice, enrolment, and the handover of whatever the customer actually
 * receives — the point of the whole site.
 *
 * The delivery step is per-kind rather than one generic "you're enrolled"
 * screen, because what arrives genuinely differs: a widget customer needs a
 * snippet to paste, a portal customer needs a link to walk through, and a
 * service customer needs to know a person will contact them and roughly
 * when. A single confirmation page would leave two of those three stuck.
 */
export function ProductDelivery({ offering }: { offering: Offering }) {
  // Rendered only after mount. Entitlements live in localStorage, so
  // rendering them during the static export would bake one visitor's state
  // into the HTML every other visitor downloads.
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [record, setRecord] = useState<Enrolment | null>(null);
  const [planId, setPlanId] = useState(
    offering.plans.find((p) => p.featured)?.id ?? offering.plans[0]?.id ?? ""
  );

  useEffect(() => {
    setSignedIn(!!getAccount());
    setRecord(enrolmentFor(offering.slug));
    setReady(true);
  }, [offering.slug]);

  function handleEnrol() {
    setRecord(enrol(offering.slug, planId, offering.delivery === "widget"));
  }

  if (!ready) {
    return <div className="mt-12 h-40" aria-hidden="true" />;
  }

  if (record) {
    return <Delivered offering={offering} record={record} />;
  }

  return (
    <section className="mt-12">
      <h2 className="section-title text-2xl">Choose a plan</h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {offering.plans.map((p) => {
          const active = p.id === planId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlanId(p.id)}
              aria-pressed={active}
              className="rounded-2xl p-6 text-left transition-colors"
              style={{
                border: `1px solid ${active ? offering.accent : "var(--border)"}`,
                background: active ? "var(--accent-dim)" : "var(--panel)",
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-bold text-slate-100">{p.name}</span>
                <span className="text-lg font-black" style={{ color: offering.accent }}>
                  {p.price}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{p.cadence}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{p.summary}</p>
              <ul className="mt-4 space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-xs text-slate-500">
                    <Check className="h-3.5 w-3.5 shrink-0" style={{ color: offering.accent }} />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {signedIn ? (
        <button type="button" onClick={handleEnrol} className="btn-primary mt-8 inline-flex">
          Enrol in {offering.name}
        </button>
      ) : (
        <div className="mt-8">
          <Link href={`/register/?next=${encodeURIComponent(`/products/${offering.slug}/`)}`} className="btn-primary inline-flex">
            Create an account to continue
          </Link>
          <p className="mt-3 text-xs text-slate-500">
            It takes an email address and the name of your business. Nothing else.
          </p>
        </div>
      )}

      <StubNotice className="mt-8" />
    </section>
  );
}

/* ── what the customer receives ───────────────────────────────────────── */

function Delivered({ offering, record }: { offering: Offering; record: Enrolment }) {
  return (
    <section className="mt-12">
      <div
        className="rounded-2xl p-6"
        style={{ border: `1px solid ${offering.accent}55`, background: "var(--accent-dim)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: offering.accent }}>
          Enrolled
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-100">
          {offering.name} is yours
        </h2>
        <p className="mt-2 text-sm text-slate-400">{offering.deliverable}</p>
      </div>

      {offering.delivery === "widget" && <WidgetHandover offering={offering} record={record} />}

      {offering.delivery === "app" && offering.appUrl && (
        <NextStep
          title="Open the app"
          body="REACH Studio runs in your browser. Sign in with the email you just used."
          href={offering.appUrl}
          cta="Open REACH Studio"
          external
        />
      )}

      {offering.delivery === "portal" && offering.appUrl && (
        <NextStep
          title="Open your portal"
          body="Your account is ready. Pick your role the first time you arrive."
          href={offering.appUrl}
          cta={`Open ${offering.name}`}
          external={offering.appUrl.startsWith("http")}
        />
      )}

      {offering.delivery === "service" && (
        <NextStep
          title="We will come to you"
          body="ORBIT's starter analysis runs against your public website — no credentials needed. Send us the address and we will run it and write back."
          href="https://www.brahmexa.com/services/orbit#orbit-request"
          cta="Send your website address"
          external
        />
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/account/" className="btn-secondary inline-flex">
          Your account
        </Link>
        <Link href="/catalog/" className="btn-secondary inline-flex">
          Browse the catalog
        </Link>
      </div>

      <StubNotice className="mt-8" />
    </section>
  );
}

function NextStep({
  title,
  body,
  href,
  cta,
  external,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
  external?: boolean;
}) {
  return (
    <div className="mt-8 rounded-2xl p-6" style={{ border: "1px solid var(--border)", background: "var(--panel)" }}>
      <h3 className="font-bold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 inline-flex">
          {cta}
        </a>
      ) : (
        <Link href={href} className="btn-primary mt-5 inline-flex">
          {cta}
        </Link>
      )}
    </div>
  );
}

/** The embed snippet, ready to paste. */
function WidgetHandover({ offering, record }: { offering: Offering; record: Enrolment }) {
  const [copied, setCopied] = useState(false);
  const key = record.publicKey ?? "pk_demo_missing";
  const snippet = `<script src="https://www.brahmexa.com/nexus/widget.js"\n        data-nexus-key="${key}" defer></script>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is permission-gated and refuses outright in some browsers.
      // The snippet is on screen and selectable either way, so a failed copy
      // costs the visitor nothing but a manual selection.
    }
  }

  return (
    <div className="mt-8 rounded-2xl p-6" style={{ border: "1px solid var(--border)", background: "var(--panel)" }}>
      <h3 className="font-bold text-slate-100">Paste this before &lt;/body&gt;</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Two lines, on every page you want {offering.name} to answer on. The key is public by
        design — it identifies your site, it does not authorise anything, and it is safe to
        commit.
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

      {/* Said plainly, next to the thing it applies to. A key that looks real
          and silently answers nothing would waste an afternoon of someone's
          time before they worked out why. */}
      <p className="mt-5 text-xs leading-relaxed text-slate-500">
        <strong className="text-slate-400">This key is a placeholder.</strong> It is prefixed
        <code className="mx-1 text-slate-400">pk_demo_</code>so it fails visibly rather than
        quietly if you paste it into a live site. Real keys are issued per business once
        accounts are live — <Link href="/access/" style={{ color: "var(--accent)" }}>ask us for one</Link> and
        we will set your site up today.
      </p>
    </div>
  );
}
