"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAccount, getEnrolments, signOut, type Account, type Enrolment } from "@/lib/entitlements";
import { offeringBySlug, DELIVERY_LABEL } from "@/lib/offerings";
import { StubNotice } from "@/components/delivery/StubNotice";

export function AccountView() {
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);

  useEffect(() => {
    setAccount(getAccount());
    setEnrolments(getEnrolments());
    setReady(true);
  }, []);

  // Rendered blank until mounted: this page is built once at export time and
  // served to everyone, so anything read from localStorage has to appear
  // after hydration or it would be baked into the shared HTML.
  if (!ready) return <div className="h-64" aria-hidden="true" />;

  if (!account) {
    return (
      <>
        <h1 className="section-title">No account in this browser</h1>
        <p className="section-subtitle mt-3">
          Accounts are stored locally for now, so they do not follow you between devices.
        </p>
        <Link href="/register/" className="btn-primary mt-8 inline-flex">
          Create an account
        </Link>
        <StubNotice className="mt-8" />
      </>
    );
  }

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Account</p>
      <h1 className="section-title mt-2">{account.organisation}</h1>
      <p className="mt-2 text-sm text-slate-500">{account.email}</p>

      <h2 className="mt-14 text-lg font-bold text-slate-100">Your products</h2>

      {enrolments.length === 0 ? (
        <div
          className="mt-5 rounded-2xl p-6"
          style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
        >
          <p className="text-sm text-slate-400">
            Nothing yet. The catalog has five products you can start with today.
          </p>
          <Link href="/catalog/" className="btn-primary mt-5 inline-flex">
            Browse the catalog
          </Link>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {enrolments.map((e) => {
            const o = offeringBySlug(e.slug);
            if (!o) return null;
            const plan = o.plans.find((p) => p.id === e.planId);
            return (
              <div
                key={e.slug}
                className="rounded-2xl p-6"
                style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                      style={{ border: `1px solid ${o.accent}55`, color: o.accent }}
                    >
                      {o.glyph}
                    </span>
                    <div>
                      <p className="font-bold text-slate-100">{o.name}</p>
                      <p className="text-xs text-slate-500">
                        {plan?.name ?? e.planId} · {DELIVERY_LABEL[o.delivery]}
                      </p>
                    </div>
                  </div>
                  <Link href={`/products/${o.slug}/`} className="btn-secondary text-xs">
                    Open
                  </Link>
                </div>

                {e.publicKey && (
                  <div className="mt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Widget key
                    </p>
                    <code
                      className="mt-1 block overflow-x-auto rounded-lg px-3 py-2 text-xs text-slate-300"
                      style={{ border: "1px solid var(--border)", background: "rgba(0,0,0,0.35)" }}
                    >
                      {e.publicKey}
                    </code>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          signOut();
          setAccount(null);
          setEnrolments([]);
        }}
        className="btn-secondary mt-12 inline-flex"
      >
        Sign out and clear this browser
      </button>

      <StubNotice className="mt-8" />
    </>
  );
}
