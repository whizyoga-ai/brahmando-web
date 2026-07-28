import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "APIs and MCP servers | Brahmando",
  description:
    "The Brahmando REST API at /api/v1 and the MCP tool surface — auth, tenants, devices, entitlements, education content, learning progress and classroom sessions.",
};

const REST_GROUPS: { name: string; paths: string[] }[] = [
  {
    name: "Auth and identity",
    paths: [
      "POST /api/v1/auth/token",
      "POST /api/v1/auth/service-token",
      "POST /api/v1/auth/refresh",
      "POST /api/v1/auth/logout",
      "GET  /api/v1/auth/session",
      "GET  /api/v1/users/me",
      "GET  /api/v1/users/me/permissions",
    ],
  },
  {
    name: "Tenants and devices",
    paths: [
      "GET  /api/v1/tenants/current",
      "GET  /api/v1/tenants/current/features",
      "POST /api/v1/devices/register",
      "POST /api/v1/devices/activate",
      "GET  /api/v1/devices/current",
    ],
  },
  {
    name: "Entitlements",
    paths: [
      "GET  /api/v1/entitlements",
      "GET  /api/v1/entitlements/bundles",
      "POST /api/v1/entitlements/activate",
      "POST /api/v1/entitlements/validate",
      "GET  /api/v1/entitlements/offline-license",
    ],
  },
  {
    name: "Education and learning",
    paths: [
      "GET  /api/v1/education/bundles",
      "GET  /api/v1/education/courses",
      "GET  /api/v1/education/lessons",
      "GET  /api/v1/education/content/{id}/manifest",
      "GET  /api/v1/learning/progress",
      "POST /api/v1/learning/progress/events",
      "POST /api/v1/learning/bookmarks",
    ],
  },
  {
    name: "Classroom",
    paths: [
      "POST /api/v1/classroom/sessions",
      "POST /api/v1/classroom/sessions/{id}/start",
      "POST /api/v1/classroom/sessions/{id}/events",
      "GET  /api/v1/classroom/sessions/{id}/activities",
    ],
  },
];

const MCP_TOOLS = [
  { name: "nexus_search", note: "Search a tenant's own knowledge" },
  { name: "nexus_query", note: "Ask a grounded question and get cited evidence" },
  { name: "nexus_get_entity", note: "Fetch one entity by id" },
  { name: "education_list_bundles", note: "Licensable content bundles" },
  { name: "education_list_courses", note: "Courses within an entitlement" },
  { name: "education_get_lesson", note: "One lesson and its resources" },
  { name: "education_search_content", note: "Search inside entitled content" },
  { name: "learning_get_progress", note: "A learner's progress record" },
  { name: "space_list_agents", note: "Agents available to the tenant" },
  { name: "space_invoke_agent", note: "Run one, with limits and an audit trail" },
  { name: "space_get_run", note: "Poll a run" },
  { name: "reach_start_audit", note: "Begin a site audit" },
  { name: "reach_get_audit", note: "Read the result" },
  { name: "orbit_list_workflows", note: "Workflows visible to the tenant" },
];

export default function DevelopersPage() {
  const panel = { border: "1px solid var(--border)", background: "var(--panel)" };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Developers</p>
        <h1 className="section-title mt-2">APIs and MCP servers</h1>
        <p className="section-subtitle mt-3 max-w-2xl">
          One REST surface for your own software, and an MCP endpoint so an assistant can use the
          same capabilities as a set of tools.
        </p>

        {/* Said at the top, not buried. Someone reading an endpoint list is
            deciding whether to build against it, and the single most useful
            fact is whether they can call it today. */}
        <section className="mt-10 rounded-2xl p-6" style={{ border: "1px solid rgba(147,197,253,0.32)", background: "rgba(59,130,246,0.08)" }}>
          <h2 className="text-sm font-bold text-blue-200">Built, not yet deployed</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Everything below exists in <code className="text-slate-200">services/api-gateway</code> and
            can be read and reviewed today. It is not yet serving:{" "}
            <code className="text-slate-200">api.brahmando.com</code> currently answers with the
            older edge gateway, so only <code className="text-slate-200">/health</code> and{" "}
            <code className="text-slate-200">/openapi.json</code> respond. Build against this and
            you are building against a contract, not a running service.
          </p>
        </section>

        {/* The genuinely interesting design decision on this platform, and
            the one a developer most needs to understand before integrating. */}
        <section className="mt-8 rounded-2xl p-6" style={panel}>
          <h2 className="text-lg font-bold text-slate-100">There is no password sign-in, on purpose</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            <code className="text-slate-300">POST /api/v1/auth/login</code> returns a
            not-implemented problem rather than a token. Two user stores exist and they are
            unrelated — the education portal keeps users in JSON files with its own login, and
            space-core keeps them in Postgres behind a cookie session, with no mapping between the
            two populations.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Verifying passwords against either one would quietly make that store{" "}
            <em>the</em> identity provider for the whole platform — a decision much larger than a
            gateway should make on its own, and very hard to reverse once applications depend on
            it. Building a third user store inside the gateway would be worse still.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            What works today covers every shipped client:{" "}
            <code className="text-slate-300">/auth/token</code> for the legacy education
            credential, <code className="text-slate-300">/auth/service-token</code> for server
            integrations, and <code className="text-slate-300">/devices/activate</code> for apps
            and boards.
          </p>
        </section>

        <h2 className="section-title mt-16 text-2xl">REST</h2>
        <p className="mt-2 text-sm text-slate-500">
          Base <code className="text-slate-300">https://api.brahmando.com</code> · prefix{" "}
          <code className="text-slate-300">/api/v1</code> · errors follow RFC 9457 problem details
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {REST_GROUPS.map((g) => (
            <div key={g.name} className="rounded-2xl p-6" style={panel}>
              <h3 className="text-sm font-bold text-slate-100">{g.name}</h3>
              <ul className="mt-4 space-y-1.5">
                {g.paths.map((p) => (
                  <li key={p} className="font-mono text-[11px] leading-relaxed text-slate-400">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="section-title mt-16 text-2xl">MCP</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          One endpoint at <code className="text-slate-300">/mcp</code>. Every tool enforces
          authentication, tenant scoping, permission checks, rate limits, timeouts, audit logging
          and output-size caps.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          None of them expose shell, SQL, Python, filesystem, Kubernetes, secrets or unrestricted
          network access — not as a setting, but because those tools do not exist. Use REST rather
          than MCP for routine work like login, catalog navigation, downloads and progress.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MCP_TOOLS.map((t) => (
            <div key={t.name} className="rounded-xl px-4 py-3" style={panel}>
              <p className="font-mono text-xs text-slate-200">{t.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">{t.note}</p>
            </div>
          ))}
        </div>

        <h2 className="section-title mt-16 text-2xl">Standalone MCP servers</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Two run on the platform cluster today, separately from the gateway.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl p-6" style={panel}>
            <h3 className="font-bold text-slate-100">DikeAI</h3>
            <p className="mt-2 text-sm text-slate-400">
              Legal and compliance for US small business — tax, startup law and policy questions.
            </p>
          </div>
          <div className="rounded-2xl p-6" style={panel}>
            <h3 className="font-bold text-slate-100">Narada</h3>
            <p className="mt-2 text-sm text-slate-400">
              A WhatsApp bridge for agent-driven customer messaging and notifications.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/access/" className="btn-primary inline-flex">
            Request credentials
          </Link>
          <Link href="/marketplace/" className="btn-secondary inline-flex">
            Back to the marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
