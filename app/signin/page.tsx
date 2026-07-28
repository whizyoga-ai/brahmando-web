import type { Metadata } from "next";
import { SignInPanel } from "@/components/auth/SignInPanel";

export const metadata: Metadata = {
  title: "Sign in | Brahmando",
  description:
    "Sign in as a sample subscriber, continue with Google, or browse the Brahmando marketplace as a guest.",
  robots: { index: false, follow: true },
};

export default function SignInPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Brahmando</p>
        <h1 className="section-title mt-2">Sign in, or don&rsquo;t</h1>
        <p className="section-subtitle mt-3 max-w-2xl">
          Browsing needs no account. Signing in changes what you can take away — and the fastest way
          to understand the plans is to wear one for a minute.
        </p>
        <SignInPanel />
      </div>
    </div>
  );
}
