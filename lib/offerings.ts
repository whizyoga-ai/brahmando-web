/**
 * The delivery catalog — what a customer can actually get from Brahmando.
 * ──────────────────────────────────────────────────────────────────────
 *
 * WHY THIS FILE EXISTS
 * brahmexa.com is the face of the company: it says what Brahmexa does and
 * why. Brahmando is where you get the thing. That split only works if both
 * sides name the same products, so this mirrors data/offerings.php on
 * brahmexa.com — same slugs, same names, same status gate.
 *
 * STATUS IS THE GATE
 * Only `live` and `beta` are enrollable. `soon` renders as a named but
 * inert card, so an offering that is not ready cannot be signed up for by
 * anyone who guesses a URL. That makes "do not sell what does not exist" a
 * property of the system rather than a rule someone has to remember — the
 * same reason the marketing site works this way.
 *
 * HONESTY RULE
 * `limitations` are rendered on the product page, above the enrol button,
 * not buried in terms. Every one of them is true today. A customer who
 * discovers a limit after paying is a refund and a bad review; a customer
 * who reads it before paying is a customer who chose it.
 */

export type DeliveryKind = "widget" | "app" | "portal" | "service";

export type Plan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  summary: string;
  features: string[];
  featured?: boolean;
};

export type Offering = {
  slug: string;
  name: string;
  tagline: string;
  status: "live" | "beta" | "soon";
  /** How the customer receives it — drives the whole enrolment flow. */
  delivery: DeliveryKind;
  /** One line naming the artefact, shown on the enrol button's card. */
  deliverable: string;
  summary: string;
  audience: string;
  /** Where this product is described in full, on the marketing site. */
  marketingUrl: string;
  /** Where the working thing lives once enrolled. */
  appUrl?: string;
  glyph: string;
  accent: string;
  plans: Plan[];
  limitations?: string[];
};

const FREE_WHILE_SMALL: Plan = {
  id: "starter",
  name: "Starter",
  price: "Free",
  cadence: "while your business is small",
  summary: "Everything you need to run it on one business, at no charge.",
  features: [
    "Full product, not a trial",
    "Community support",
    "You decide when you have outgrown it",
  ],
  featured: true,
};

export const OFFERINGS: Offering[] = [
  {
    slug: "nexus",
    name: "Nexus",
    tagline: "The AI Business Brain",
    status: "live",
    delivery: "widget",
    deliverable: "A widget key and a two-line embed snippet",
    summary:
      "An embeddable AI assistant that learns your business from your own website and documents, answers customers with cited evidence, and says plainly when it does not know.",
    audience: "Businesses answering the same customer questions every day",
    marketingUrl: "https://www.brahmexa.com/nexus.php",
    glyph: "◎",
    accent: "#7c8cff",
    plans: [
      FREE_WHILE_SMALL,
      {
        id: "business",
        name: "Business",
        price: "Talk to us",
        cadence: "per site",
        summary: "For teams that need more sources, more traffic and a person to call.",
        features: [
          "Higher crawl and message limits",
          "Private document ingestion",
          "Named support contact",
        ],
      },
    ],
    limitations: [
      "Nexus answers from what you give it. Until you add a document or crawl a page, it will say it cannot verify rather than guess.",
      "Answers drawn from general AI knowledge are labelled separately and are never presented as verified facts about your business.",
    ],
  },
  {
    slug: "reach",
    name: "REACH",
    tagline: "Digital Marketing Studio",
    status: "live",
    delivery: "app",
    deliverable: "Access to REACH Studio in your browser",
    summary:
      "Drafts social media posts and content, adapts each one per channel, and keeps every publish behind an approval step you control.",
    audience: "Owner-operators doing their own digital marketing",
    marketingUrl: "https://www.brahmexa.com/services/reach",
    appUrl: "https://saas.brahmexa.com/reach/studio.html",
    glyph: "✦",
    accent: "#f4c86a",
    plans: [FREE_WHILE_SMALL],
    limitations: [
      "Publishing to social platforms is currently dry-run: REACH prepares and records the post, and a person completes the publish. It is not yet sending on your behalf.",
      "Performance figures are entered or imported by a person. REACH will show \"not enough data\" rather than estimate.",
    ],
  },
  {
    slug: "orbit",
    name: "ORBIT",
    tagline: "Intelligent Web Hosting",
    status: "live",
    delivery: "service",
    deliverable: "A free starter analysis of your site, then hosting if you want it",
    summary:
      "Watches the digital face of your business — availability, speed, security, content freshness, and how easily customers and AI assistants can find you.",
    audience: "Businesses that own a website and have no one watching it",
    marketingUrl: "https://www.brahmexa.com/services/orbit",
    glyph: "◍",
    accent: "#57d8cf",
    plans: [
      {
        id: "analysis",
        name: "Starter analysis",
        price: "Free",
        cadence: "one-off",
        summary: "Runs against your public website. No credentials, no access needed.",
        features: ["Availability, speed and security check", "Content freshness review", "A written report you keep"],
        featured: true,
      },
      {
        id: "hosting",
        name: "Hosting",
        price: "Talk to us",
        cadence: "per site",
        summary: "We run the site and keep watching it.",
        features: ["Hosting on Brahmexa infrastructure", "Continuous monitoring", "A person who answers"],
      },
    ],
  },
  {
    slug: "education",
    name: "ANYO Academy",
    tagline: "Learning Platform",
    status: "live",
    delivery: "portal",
    deliverable: "A student, teacher or parent account on the portal",
    summary:
      "Curriculum-aligned study material, practice and study rooms — free to browse before you register.",
    audience: "Students, parents and tutors",
    marketingUrl: "https://www.brahmexa.com/services/education",
    appUrl: "/education/",
    glyph: "◐",
    accent: "#7ae8df",
    plans: [
      {
        id: "community",
        name: "Community",
        price: "Free",
        cadence: "for qualifying schools and nonprofits",
        summary: "The full portal at no cost for under-resourced organisations.",
        features: ["Role-based access", "Syllabus filters", "Study rooms"],
        featured: true,
      },
    ],
    limitations: [
      "Curriculum coverage varies by board and class. Browse before registering to check your syllabus is covered.",
    ],
  },
  {
    slug: "smb",
    name: "SMB Engine",
    tagline: "Agents for Small Business Operations",
    status: "live",
    delivery: "portal",
    deliverable: "Access to the industry assistant for your vertical",
    summary:
      "Industry-shaped assistants that answer routine questions and handle repetitive back-office steps.",
    audience: "Hospitality, field services and clinics",
    marketingUrl: "https://www.brahmexa.com/services/smb",
    appUrl: "https://saas.brahmexa.com/smb/",
    glyph: "◉",
    accent: "#c98a5e",
    plans: [FREE_WHILE_SMALL],
    limitations: [
      "Available verticals are listed on the hub. If yours is not there, it is not supported yet.",
      "Assistants draft and answer; they do not take payments or make commitments on your behalf.",
    ],
  },
  {
    slug: "space",
    name: "SPACE",
    tagline: "Office Interior Intelligence",
    status: "soon",
    delivery: "service",
    deliverable: "Not available yet",
    summary: "Office-interior enquiries, technical responses and supporting diagrams.",
    audience: "Interior and facilities teams",
    marketingUrl: "https://www.brahmexa.com/",
    glyph: "◇",
    accent: "#a78bfa",
    plans: [],
  },
];

/** Everything a customer can actually enrol in. */
export const enrollableOfferings = () =>
  OFFERINGS.filter((o) => o.status === "live" || o.status === "beta");

export const offeringBySlug = (slug: string) =>
  OFFERINGS.find((o) => o.slug === slug) ?? null;

export const DELIVERY_LABEL: Record<DeliveryKind, string> = {
  widget: "Embed on your site",
  app: "Use in your browser",
  portal: "Portal account",
  service: "Delivered by our team",
};
