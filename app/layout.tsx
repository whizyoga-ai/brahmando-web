import type { Metadata } from "next";
import { Sora, Space_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CosmicWatermark } from "@/components/watermark/CosmicWatermark";
import { NexusWidget } from "@/components/nexus/NexusWidget";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

// `authors` renders a meta author tag, and it named ManjuLAB — so every page
// on this domain carried a machine-readable claim that ManjuLAB is who
// built and owns this. Together with the keyword and the "engineered by
// ManjuLAB" descriptions, this was the single most direct statement of
// identity on the site, repeated on every route.
//
// It is also the one a search engine reads first. brahmexa.com had the
// equivalent claims removed on 2026-07-27; leaving them here would have
// meant the group's own two domains contradicting each other, and the
// contradiction resolving toward the older, better-established name.
export const metadata: Metadata = {
  title: "Brahmando — the Brahmexa platform",
  description:
    "Brahmando is the Brahmexa platform for AI agents, MCP servers and agentic workflows — available to Brahmexa customers and community partners.",
  keywords: [
    "MCP servers",
    "AI agents",
    "AI workflows",
    "agentic workflows",
    "Brahmexa",
    "Brahmando",
    "Brahmexa platform",
  ],
  authors: [{ name: "Brahmexa" }],
  openGraph: {
    title: "Brahmando — the Brahmexa platform",
    description:
      "The Brahmexa platform for AI agents, MCP servers and agentic workflows.",
    url: "https://brahmando.com",
    siteName: "Brahmando",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brahmando — the Brahmexa platform",
    description:
      "The Brahmexa platform for AI agents, MCP servers and agentic workflows.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${spaceMono.variable} flex min-h-screen flex-col`}>
        <ThemeProvider>
          <CosmicWatermark />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          {/* Nexus, not the bespoke chat that used to sit here.

              This site now sells Nexus, so the assistant answering questions
              on it should be Nexus: a visitor can ask it what Nexus is and
              judge the reply, which is far harder to fake than a screenshot.
              Two floating chat buttons in the same corner was also just a
              defect.

              DeepakChat and its backend are untouched and still live at
              chat.brahmando.com — restoring it is one import and one line. */}
          <NexusWidget />
        </ThemeProvider>

        {/* Watermark, rendered on every page. It read @manjulab — a
            signature in the corner of every screen, which is exactly what a
            watermark is for and exactly why it had to change with the rest. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-4 right-5 z-[200] select-none"
        >
          <span className="text-[9px] font-bold tracking-[0.28em] text-white/[0.22]">
            @brahmexa
          </span>
        </div>
      </body>
    </html>
  );
}
