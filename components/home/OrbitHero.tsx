import Link from "next/link";
import { CATALOG, type CatalogItem, type Tier } from "@/lib/catalog";

/**
 * The catalog, in orbit.
 *
 * brahmexa.com opens on concentric dashed rings turning around a central
 * sun. This is the same figure, drawn with the same timings, but the
 * planets are not decoration: every one is a marketplace item and a link
 * to it.
 *
 * DISTANCE FROM THE CENTRE IS PRICE
 *   inner   what costs nothing — the free analysis, the widget
 *   middle  the business plans — portals and the education track
 *   outer   the developer surface — APIs and MCP servers
 *
 * So the tier model is legible before a word of it is read, and adding an
 * item to the catalog places it on the right ring automatically. A picture
 * that derives itself from the data cannot drift from the data.
 *
 * Server-rendered: the rings are CSS and the planets are plain links, so
 * this arrives in the HTML and works before any JavaScript does. It is the
 * first thing on the page, which is the wrong place for something that
 * needs hydrating to become useful.
 */

/** Which ring an item belongs on — the only place this mapping lives. */
function ringFor(tier: Tier): 0 | 1 | 2 {
  if (tier === "guest" || tier === "starter") return 0;
  if (tier === "scale") return 2;
  return 1; // growth and community
}

const RING_CLASS = ["bx-ring--inner", "bx-ring--mid", "bx-ring--outer"] as const;

export function OrbitHero() {
  const rings: CatalogItem[][] = [[], [], []];
  for (const item of CATALOG) rings[ringFor(item.requires)].push(item);

  return (
    <div className="bx-orbit-stage" role="presentation">
      {rings.map((items, r) => (
        <div key={r} className={`bx-ring ${RING_CLASS[r]}`}>
          {items.map((item, i) => {
            // Spread evenly, and offset each ring so planets on different
            // rings do not stack into a line at the same bearing.
            const angle = (360 / Math.max(items.length, 1)) * i + r * 24;
            return (
              <div key={item.slug} className="bx-slot" style={{ transform: `rotate(${angle}deg)` }}>
                <Link
                  href={`/marketplace/${item.slug}/`}
                  className="bx-planet"
                  aria-label={`${item.name} — ${item.tagline}`}
                >
                  {/* Shell spins against the ring; face cancels the slot's
                      angle. Between them the label stays upright at every
                      point of the orbit. */}
                  <span className="bx-planet-shell">
                    <span
                      className="bx-planet-face"
                      style={{ transform: `rotate(${-angle}deg)`, color: item.accent }}
                    >
                      <span aria-hidden="true">{item.glyph}</span>
                    </span>
                    <span className="bx-planet-label" style={{ transform: `translateX(-50%) rotate(${-angle}deg)` }}>
                      {item.name}
                    </span>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      ))}

      <div className="bx-core">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Brahmando
          </p>
          <p className="mt-1 text-xs leading-snug text-slate-500">
            Intelligence for every gap
          </p>
        </div>
      </div>
    </div>
  );
}
