import { HeroSection } from "@/components/home/HeroSection";
import { MarketplaceTeaser } from "@/components/home/MarketplaceTeaser";
import { WhatIsBrahmando } from "@/components/home/WhatIsBrahmando";
import { AboutSection } from "@/components/home/AboutSection";
import { CSRSection } from "@/components/home/CSRSection";
import { CTASection } from "@/components/home/CTASection";

/**
 * The marketplace sits directly under the hero.
 *
 * Someone arriving asks "what can I get?" before "who are you?", so the
 * catalog answers first and the company story follows. It was the other way
 * round when this was a repository site, which is the right order for a
 * site whose job is to explain itself — and the wrong one for a shop.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <hr className="section-rule mx-auto max-w-5xl" />
      <MarketplaceTeaser />
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
