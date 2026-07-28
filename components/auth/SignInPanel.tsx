"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { SAMPLE_ACCOUNTS } from "@/lib/accounts";
import { TIER_LABEL } from "@/lib/catalog";
import { GOOGLE_CLIENT_ID, signInAsSample, signInWithGoogle } from "@/lib/session";

/** Minimal shape of the Google Identity Services credential response. */
type GisCredential = { credential?: string };

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (o: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
        };
      };
    };
  }
}

/**
 * Reads the display fields out of a Google ID token WITHOUT verifying it.
 *
 * This is decoding, not authentication, and the distinction matters enough
 * to name here: verifying the signature needs Google's public keys and a
 * server to check them on. A static site cannot do it, so this token is
 * treated as "the browser says the user is called this" — good enough to
 * greet someone by name, not good enough to grant anything.
 *
 * That is why signInWithGoogle() assigns no tier.
 */
function readIdToken(jwt: string): { name: string; email: string } | null {
  try {
    const [, payload] = jwt.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const claims = JSON.parse(json) as { name?: string; email?: string };
    if (!claims.email) return null;
    return { name: claims.name ?? claims.email, email: claims.email };
  } catch {
    return null;
  }
}

export function SignInPanel() {
  const router = useRouter();
  const googleSlot = useRef<HTMLDivElement>(null);
  const [googleReady, setGoogleReady] = useState(false);

  /**
   * Where to go after signing in.
   *
   * Read from the URL at click time rather than via useSearchParams, which
   * would force this whole panel to render client-side only — the sample
   * subscribers would then be absent from the exported HTML, so the page
   * would arrive empty and fill in afterwards.
   *
   * Only ever a path on this site. `next` comes from the URL, so honouring an
   * absolute one would make this an open redirect: a link that looks like
   * brahmando.com and lands somewhere else entirely.
   */
  const go = () => {
    let next = "/marketplace/";
    try {
      const raw = new URLSearchParams(window.location.search).get("next");
      if (raw && raw.startsWith("/") && !raw.startsWith("//")) next = raw;
    } catch {
      /* keep the default */
    }
    router.push(next);
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleSlot.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const id = window.google?.accounts?.id;
      if (!id || !googleSlot.current) return;
      id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res: GisCredential) => {
          const claims = res.credential ? readIdToken(res.credential) : null;
          if (claims) {
            signInWithGoogle(claims.name, claims.email);
            go();
          }
        },
      });
      id.renderButton(googleSlot.current, {
        theme: "filled_black",
        size: "large",
        width: 320,
        text: "continue_with",
      });
      setGoogleReady(true);
    };
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const panel = {
    border: "1px solid var(--border)",
    background: "var(--panel)",
  };

  return (
    <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr]">
      {/* ── Sample subscribers ─────────────────────────────────────────── */}
      <section className="rounded-2xl p-6" style={panel}>
        <h2 className="text-lg font-bold text-slate-100">Sign in as a sample subscriber</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Four businesses on four different plans. Pick the one closest to yours and the
          marketplace will show you exactly what that plan opens — which is easier to judge than a
          pricing table.
        </p>

        <div className="mt-6 space-y-3">
          {SAMPLE_ACCOUNTS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                signInAsSample(a.id);
                go();
              }}
              className="w-full rounded-xl p-4 text-left transition-colors hover:border-slate-500"
              style={{ border: "1px solid var(--border)", background: "rgba(0,0,0,0.25)" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-bold text-slate-100">{a.organisation}</span>
                <span className="tag text-[10px]">{TIER_LABEL[a.tier]}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{a.persona}</p>
              <p className="mt-2 font-mono text-[11px] text-slate-600">{a.email}</p>
            </button>
          ))}
        </div>

        <p className="mt-5 text-xs leading-relaxed text-slate-500">
          <strong className="text-slate-400">No password, deliberately.</strong> This site is
          static — a password typed here could only be checked in your own browser, which is not a
          check, and a fake login box is a way to collect real passwords by accident. These
          personas are not credentials and nothing is verified, because nothing here is secret.
        </p>
      </section>

      {/* ── Google and guest ───────────────────────────────────────────── */}
      <div className="space-y-6">
        <section className="rounded-2xl p-6" style={panel}>
          <h2 className="text-lg font-bold text-slate-100">Continue with Google</h2>

          {GOOGLE_CLIENT_ID ? (
            <>
              <div ref={googleSlot} className="mt-5 min-h-[44px]" />
              {!googleReady && (
                <p className="mt-3 text-xs text-slate-500">Loading Google sign-in…</p>
              )}
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                This signs you in by name and email so we can greet you and remember you between
                visits. It does <strong className="text-slate-400">not</strong> grant a plan: a
                static site cannot verify a Google token — that needs a server — so nothing here
                treats it as proof of a subscription.
              </p>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Not configured on this deployment yet. It needs a Google OAuth client ID, supplied
                at build time as{" "}
                <code className="text-slate-300">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>.
              </p>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                The button is absent rather than disabled. One that fails when clicked wastes more
                of your time than one that explains itself, and a dead Google button reads as a
                broken site rather than an unfinished setting.
              </p>
            </>
          )}
        </section>

        <section className="rounded-2xl p-6" style={panel}>
          <h2 className="text-lg font-bold text-slate-100">Or just look around</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            The whole catalog is readable without an account. You will see what each thing is, what
            it delivers, and what it does not do yet.
          </p>
          <ul className="mt-4 space-y-2">
            {[
              "Browse every app, widget, API and MCP server",
              "Read the limitations before the sales copy",
              "Start ORBIT's free site analysis with no account at all",
            ].map((t) => (
              <li key={t} className="flex gap-2 text-xs text-slate-500">
                <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent)" }} />
                {t}
              </li>
            ))}
          </ul>
          <Link href="/marketplace/" className="btn-secondary mt-5 inline-flex">
            Browse as a guest
          </Link>
        </section>
      </div>
    </div>
  );
}
