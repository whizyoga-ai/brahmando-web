import type { Metadata } from "next";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";

export const metadata: Metadata = {
  title: "Marketplace — apps, widgets, APIs and MCP servers | Brahmando",
  description:
    "Browse everything Brahmexa builds: the Nexus widget, ANYO and Smart Board apps, the Brahmando REST API, MCP servers, and the REACH, ORBIT and SMB portals.",
};

export default function MarketplacePage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Marketplace</p>
        <h1 className="section-title mt-2">Everything Brahmexa makes, in one place</h1>
        <p className="section-subtitle mt-3 max-w-2xl">
          Widgets you embed, apps you install, APIs and MCP servers your own software calls, and
          portals you sign into. Browsing needs no account; what you can take away depends on your
          plan.
        </p>
        <MarketplaceGrid />
      </div>
    </div>
  );
}
