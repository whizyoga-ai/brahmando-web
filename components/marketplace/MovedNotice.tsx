import Link from "next/link";

/**
 * A static redirect: the visible half, and the tag that does the work.
 *
 * The meta refresh is rendered HERE rather than through Next's metadata
 * `other` field, which emits `<meta name="refresh">` — a tag no browser acts
 * on. It needs `http-equiv`, and React hoists this into <head> from the
 * component. The first version of this shipped the inert `name=` form and
 * would have left every legacy link showing a page that never went anywhere.
 *
 * The canonical still comes from generateMetadata: the refresh moves people,
 * the canonical moves search engines, and they are different audiences.
 */
export function MovedNotice({ to, what }: { to: string; what: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <div className="py-24">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Moved</p>
          <h1 className="section-title mt-2">{what} lives in the marketplace now</h1>
          <p className="section-subtitle mt-3">
            Taking you there. If nothing happens, the link below still works.
          </p>
          <Link href={to} className="btn-primary mt-8 inline-flex">
            Continue
          </Link>
        </div>
      </div>
    </>
  );
}
