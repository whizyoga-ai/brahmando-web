import type { Metadata } from "next";
import { MovedNotice } from "@/components/marketplace/MovedNotice";

export const metadata: Metadata = {
  title: "Moved | Brahmando",
  alternates: { canonical: "https://brahmando.com/marketplace/" },
  robots: { index: false, follow: true },
};

export default function LegacyCatalogPage() {
  return <MovedNotice to="/marketplace/" what="The catalog" />;
}
