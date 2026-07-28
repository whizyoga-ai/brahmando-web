"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { CATALOG, KIND_LABEL, TIER_LABEL, acquirable } from "@/lib/catalog";
import { accountById } from "@/lib/accounts";
import { canAcquire, getSession, signOut, type Session } from "@/lib/session";

export function AccountView() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sync = () => setSession(getSession());
    sync();
    window.addEventListener("brahmando:session", sync);
    return () => window.removeEventListener("brahmando:session", sync);
  }, []);

  if (!session) return <div className="h-72" aria-hidden="true" />;

  const panel = { border: "1px solid var(--border)", background: "var(--panel)" };

  if (session.kind === "guest") {
    return (
      <>
        <h1 className="section-title">You are browsing as a guest</h1>
        <p className="section-subtitle mt-3 max-w-2xl">
          Which is a perfectly good way to use this site — the whole catalog is readable and
          ORBIT&rsquo;s free analysis needs no account at all. Sign in to see what a plan opens up.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signin/" className="btn-primary inline-flex">
            Sign in
          </Link>
          <Link href="/marketplace/" className="btn-secondary inline-flex">
            Keep browsing
          </Link>
        </div>
      </>
    );
  }

  const account = session.accountId ? accountById(session.accountId) : null;
  const included = CATALOG.filter((i) => canAcquire(session, i) && acquirable(i));
  const locked = CATALOG.filter((i) => !canAcquire(session, i) && acquirable(i));

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
        {session.kind === "google" ? "Signed in with Google" : "Sample subscriber"}
      </p>
      <h1 className="section-title mt-2">{session.displayName}</h1>
      {session.email && <p className="mt-2 text-sm text-slate-500">{session.email}</p>}

      {session.kind === "google" && (
        <div className="mt-8 rounded-2xl p-6" style={panel}>
          <h2 className="font-bold text-slate-100">No plan attached to this identity</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Google told us who you are, and this site believed it — but it cannot verify that token
            without a server, and knowing your name is not the same as knowing what you have paid
            for. So you have a guest&rsquo;s access. Sign in as a sample subscriber to see a plan
            from the inside, or talk to us about a real one.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/signin/" className="btn-secondary inline-flex">
              Try a sample subscriber
            </Link>
            <Link href="/access/" className="btn-secondary inline-flex">
              Talk to us
            </Link>
          </div>
        </div>
      )}

      {account && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["Plan", account.planName],
            ["Price", account.planPrice],
            ["Seats", String(account.seats ?? "—")],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl p-5" style={panel}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{k}</p>
              <p className="mt-1 font-bold text-slate-100">{v}</p>
            </div>
          ))}
        </div>
      )}

      {account?.bundles && account.bundles.length > 0 && (
        <div className="mt-6 rounded-2xl p-6" style={panel}>
          <h2 className="text-sm font-bold text-slate-100">Content bundles on this licence</h2>
          <p className="mt-1 text-xs text-slate-500">
            The same bundle identifiers the API gateway issues entitlements against.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {account.bundles.map((b) => (
              <span key={b} className="tag font-mono text-[10px]">
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      <h2 className="mt-14 text-lg font-bold text-slate-100">
        Included on your plan <span className="text-slate-500">({included.length})</span>
      </h2>
      <div className="mt-4 space-y-3">
        {included.map((i) => (
          <Row key={i.slug} slug={i.slug} name={i.name} kind={KIND_LABEL[i.kind]} note={i.deliverable} open />
        ))}
      </div>

      {locked.length > 0 && (
        <>
          <h2 className="mt-12 text-lg font-bold text-slate-100">
            Not on this plan <span className="text-slate-500">({locked.length})</span>
          </h2>
          <div className="mt-4 space-y-3">
            {locked.map((i) => (
              <Row
                key={i.slug}
                slug={i.slug}
                name={i.name}
                kind={KIND_LABEL[i.kind]}
                note={`Included from ${TIER_LABEL[i.requires]}`}
              />
            ))}
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setSession(signOut())}
        className="btn-secondary mt-12 inline-flex"
      >
        Sign out
      </button>
    </>
  );
}

function Row({
  slug,
  name,
  kind,
  note,
  open,
}: {
  slug: string;
  name: string;
  kind: string;
  note: string;
  open?: boolean;
}) {
  return (
    <Link
      href={`/marketplace/${slug}/`}
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-5 py-4 transition-colors hover:border-slate-500"
      style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
    >
      <div className="flex items-center gap-3">
        {open ? (
          <Check className="h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
        ) : (
          <Lock className="h-4 w-4 shrink-0 text-slate-600" />
        )}
        <div>
          <p className={open ? "font-bold text-slate-100" : "font-bold text-slate-400"}>{name}</p>
          <p className="text-xs text-slate-500">{note}</p>
        </div>
      </div>
      <span className="tag text-[10px]">{kind}</span>
    </Link>
  );
}
