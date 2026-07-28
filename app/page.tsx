import { HeroSection } from "@/components/home/HeroSection";
import { CatalogSection } from "@/components/home/CatalogSection";
import { WhatIsBrahmando } from "@/components/home/WhatIsBrahmando";
import { AboutSection } from "@/components/home/AboutSection";
import { CSRSection } from "@/components/home/CSRSection";
import { CTASection } from "@/components/home/CTASection";

/**
 * Order matters here.
 *
 * The catalog sits directly under the hero, because a visitor just told they
 * can get something working today will ask "like what?" and should not have
 * to navigate to find out. What the platform is built from, and the CSR
 * programmes, follow as supporting evidence — they opened the page when this
 * was a repository site, and that is no longer what it is for.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <hr className="section-rule mx-auto max-w-5xl" />
      <CatalogSection />
      <hr className="section-rule mx-auto max-w-5xl" />
      <WhatIsBrahmando />
      <hr className="section-rule mx-auto max-w-5xl" />
      <CSRSection />
      <hr className="section-rule mx-auto max-w-5xl" />
      <AboutSection />
      <CTASection />
    </>
  );
}
