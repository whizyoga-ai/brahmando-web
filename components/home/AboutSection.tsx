import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { branding } from "@/lib/branding";

export function AboutSection() {
  return (
    <section className="py-24" id="about">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Prose column */}
          <div>
            {/* This section named ManjuLAB as "the customer-facing operating
                company" carrying P&L and engaging clients, and described
                Brahmando and ManjuLAB as peers. Stated in prose, on the
                homepage, it was the clearest identity signal the group
                published anywhere — and it pointed at the wrong entity.
                Brahmexa LLC is the company; Brahmando is its platform. */}
            <h2 className="section-title">Brahmexa &amp; Brahmando</h2>
            <p className="mt-5 leading-relaxed text-slate-400">
              <strong className="text-slate-200">{branding.groupBrand}</strong> is the company. It
              builds and delivers AI products and services for small businesses, schools and
              enterprise customers — the brand behind everything on this platform.
            </p>
            <p className="mt-4 leading-relaxed text-slate-400">
              <strong className="text-slate-200">{branding.host}</strong> is where those assets
              live: the agents, MCP servers and agentic workflows Brahmexa builds, published in one
              place. Access to the full catalog — including deployment guides and integration
              support — comes through a Brahmexa commercial agreement or the community access
              program.
            </p>
            <p className="mt-4 leading-relaxed text-slate-400">
              The catalog is curated and access-gated rather than an open public marketplace, so
              what appears here has been reviewed and is supported. Brahmexa&rsquo;s services and
              company information live at{" "}
              <a
                href={branding.companySite}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)" }}
              >
                brahmexa.com
              </a>
              .
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={branding.companySite}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                Visit Brahmexa
              </a>
              <Link href="/#about" className="btn-secondary inline-flex">
                Brahmexa group
              </Link>
              <Link href="/access" className="btn-secondary inline-flex items-center gap-1">
                Request access
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Brand hierarchy card */}
          <div
            className="flex flex-col gap-4 rounded-2xl p-6"
            style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
          >
            {/* Brahmexa top card */}
            <div className="rounded-xl bg-gradient-to-r from-amber-500/90 to-amber-400/90 px-5 py-4 text-stone-900">
              <div className="mb-3 flex min-h-[36px] items-center">
                <Image
                  src={branding.logos.brahmexa.wordmark}
                  alt={`${branding.groupBrand} logo`}
                  width={160}
                  height={36}
                  className="h-7 w-auto max-w-[min(200px,55%)] object-contain object-left"
                />
              </div>
              <p className="font-bold">{branding.groupBrand}</p>
              <p className="text-sm opacity-80">Group brand · {branding.groupBrandTagline}</p>
            </div>

            {/* Two surfaces, one company.
                This was three cards — ManjuLAB as "Operating co. · P&L", then
                Brahmando, then "Other group companies — names on request". A
                diagram is read faster than prose, so it was teaching the wrong
                structure at a glance. The unnamed third card is gone too: a
                company nobody will name is not a signal, it is a question. */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white px-4 py-4 text-slate-900">
                <div className="mb-3 flex min-h-[36px] items-center">
                  <Image
                    src={branding.logos.brahmexa.wordmark}
                    alt={`${branding.groupBrand} logo`}
                    width={150}
                    height={36}
                    className="h-7 w-auto max-w-full object-contain object-left"
                  />
                </div>
                <p className="font-bold text-sm">{branding.groupBrand}</p>
                <p className="text-xs opacity-70 leading-snug">Company · services &amp; information · brahmexa.com</p>
              </div>
              <div className="rounded-xl px-4 py-4" style={{ background: "var(--accent-dim)", border: "1px solid var(--border)" }}>
                <div className="mb-3 flex min-h-[36px] items-center">
                  <Image
                    src={branding.logos.brahmando.wordmark}
                    alt={`${branding.host} logo`}
                    width={150}
                    height={36}
                    className="h-7 w-auto max-w-full object-contain object-left"
                  />
                </div>
                <p className="font-bold text-sm text-slate-200">{branding.host}</p>
                <p className="text-xs leading-snug text-slate-400">Platform · agents, MCP &amp; workflows · brahmando.com</p>
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-600">
              <span className="text-slate-400">{branding.groupBrand}</span>
              <span className="mx-2 text-slate-600">→</span>
              <span className="text-slate-400">{branding.host}</span>
              <span className="mx-1 text-slate-600">·</span>
              <span style={{ color: "var(--accent)" }} className="opacity-70">one company, one platform</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
