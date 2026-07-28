import Image from "next/image";
import Link from "next/link";
import { branding } from "@/lib/branding";

type PartnerLogosBarProps = {
  /** Larger treatment for the home hero. */
  variant?: "default" | "hero";
  /** When true, draws a top rule above the row (e.g. under page titles). */
  showTopRule?: boolean;
  className?: string;
};

export function PartnerLogosBar({
  variant = "default",
  showTopRule = true,
  className = "",
}: PartnerLogosBarProps) {
  const imgMax =
    variant === "hero"
      ? "max-h-10 sm:max-h-12 max-w-[min(180px,32vw)]"
      : "max-h-7 sm:max-h-8 max-w-[min(150px,30vw)]";

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-6 sm:gap-10 ${showTopRule ? "border-t border-slate-300/20 pt-6" : "pt-1"} ${className}`}
      aria-label="Brahmexa and Brahmando"
    >
      {/* The ManjuLAB wordmark was the first logo on the bar, linked to
          manjulab.com. A logo is an ownership claim that needs no sentence to
          read, so it stated the wrong company faster than the copy could
          state the right one. Two marks now: the company and its platform. */}
      <Link href="/#about" className="flex items-center opacity-90 transition-opacity hover:opacity-100">
        <Image
          src={branding.logos.brahmexa.wordmark}
          alt={`${branding.groupBrand} logo`}
          width={180}
          height={48}
          className={`h-auto w-auto object-contain ${imgMax}`}
        />
      </Link>
      <Link href="/" className="flex items-center opacity-90 transition-opacity hover:opacity-100">
        <Image
          src={branding.logos.brahmando.wordmark}
          alt={`${branding.name} logo`}
          width={180}
          height={48}
          className={`h-auto w-auto object-contain ${imgMax}`}
        />
      </Link>
    </div>
  );
}
