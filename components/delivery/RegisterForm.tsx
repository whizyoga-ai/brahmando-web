"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createAccount } from "@/lib/entitlements";
import { StubNotice } from "@/components/delivery/StubNotice";

/**
 * Account creation.
 *
 * NO PASSWORD FIELD, deliberately. This is a static site with no server, so
 * a password collected here could only be stored in the visitor's own
 * browser — which is strictly worse than not collecting one, because people
 * reuse passwords and would be handing us a real credential to keep badly.
 * The field is absent rather than disabled so nobody types one out of habit.
 */
export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    // Deliberately permissive: enough to catch a typo, not so strict it
    // rejects a valid address with an unusual shape.
    if (!trimmed.includes("@") || trimmed.startsWith("@") || trimmed.endsWith("@")) {
      setError("That does not look like an email address.");
      return;
    }
    if (!org.trim()) {
      setError("Tell us the name of your business or organisation.");
      return;
    }
    createAccount(trimmed, org);

    // Only ever return to a path on this site. `next` comes from the URL, so
    // honouring an absolute one would turn this form into an open redirect —
    // a link that looks like brahmando.com and lands somewhere else.
    const next = params.get("next") ?? "/account/";
    const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/account/";
    router.push(safe);
  }

  const field =
    "mt-1 w-full rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors";
  const fieldStyle = {
    border: "1px solid var(--border)",
    background: "rgba(0,0,0,0.30)",
  };

  return (
    <form onSubmit={submit} className="mt-10">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
          style={fieldStyle}
          placeholder="you@yourbusiness.com"
          autoComplete="email"
          required
        />
      </label>

      <label className="mt-6 block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Business or organisation
        </span>
        <input
          type="text"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          className={field}
          style={fieldStyle}
          placeholder="Northstar Heating &amp; Air"
          autoComplete="organization"
          required
        />
      </label>

      {error && (
        <p role="alert" className="mt-4 text-sm text-rose-300">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary mt-8 w-full justify-center">
        Create account
      </button>

      <StubNotice className="mt-6" />
    </form>
  );
}
