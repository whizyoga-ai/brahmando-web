import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/delivery/RegisterForm";

export const metadata: Metadata = {
  title: "Create an account | Brahmando",
  description:
    "Create a Brahmexa account to enrol in Nexus, REACH, ORBIT, ANYO Academy or the SMB Engine.",
  // Nothing here belongs in a search result: it is a form, and any URL that
  // matters carries a ?next= that would index as a duplicate.
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Brahmexa</p>
        <h1 className="section-title mt-2">Create an account</h1>
        <p className="section-subtitle mt-3">
          An email address and the name of your business. No password — see the note below.
        </p>
        {/* useSearchParams reads the ?next= that says where to return after
            signing up. On a statically exported page that value is unknown
            until the browser has the URL, so the form has to be able to bail
            out of prerendering — which is what this boundary permits. Without
            it the export fails outright rather than degrading. */}
        <Suspense fallback={<div className="mt-10 h-72" aria-hidden="true" />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
