import Link from "next/link";

/**
 * Says, on the page, that accounts here are not real accounts yet.
 *
 * The enrolment flow is deliberately convincing — that is the point of
 * building it — and a convincing flow that quietly does nothing is a way to
 * mislead a customer into thinking they have bought something. So it is
 * stated wherever the flow is used, in the visitor's words rather than in a
 * source comment they will never read.
 *
 * It also tells them what to do instead, because a disclaimer that leaves
 * someone with no way forward just loses them.
 */
export function StubNotice({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-xl p-4 text-xs leading-relaxed text-slate-500 ${className}`}
      style={{ border: "1px dashed var(--border)", background: "rgba(0,0,0,0.2)" }}
    >
      <strong className="text-slate-400">Accounts here are a preview.</strong> Signing up records
      your choice in this browser only — there is no server behind it yet, no payment is taken,
      and nothing is sent to us. To start using a product today,{" "}
      <Link href="/access/" style={{ color: "var(--accent)" }}>
        talk to us
      </Link>{" "}
      and we will set you up by hand.
    </p>
  );
}
