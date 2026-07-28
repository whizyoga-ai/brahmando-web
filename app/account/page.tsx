import type { Metadata } from "next";
import { AccountView } from "@/components/delivery/AccountView";

export const metadata: Metadata = {
  title: "Your account | Brahmando",
  description: "Your Brahmexa products, plans and keys.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <AccountView />
      </div>
    </div>
  );
}
