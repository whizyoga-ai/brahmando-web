/**
 * Nexus, answering questions about Brahmando on Brahmando.
 *
 * WHY THE PRODUCT IS ON THE PLATFORM THAT SELLS IT
 * A visitor deciding whether Nexus is worth having can ask this one what it
 * is and judge the answer. That is a harder demonstration to fake than a
 * screenshot, because it fails in public if the product is bad — including
 * when it says "I could not verify that", which is the behaviour the whole
 * design exists to produce.
 *
 * WHY A PLAIN SCRIPT TAG
 * This is character-for-character the snippet a customer pastes into their
 * own site. next/script with lazyOnload kept the URL out of the exported
 * HTML and injected it after hydration instead — which works, but would have
 * this site exercising a loading path no customer uses. If it breaks here it
 * should break the same way it breaks for them.
 *
 * The key is public by design: it identifies the site, authorises nothing,
 * and the API checks the request Origin against the tenant allowlist on top
 * of it. brahmando.com was added to that allowlist alongside brahmexa.com.
 */
export function NexusWidget() {
  return (
    <script
      src="https://www.brahmexa.com/nexus/widget.js"
      data-nexus-key="pk_brahmexa_site"
      defer
    />
  );
}
