import type { Metadata } from "next";

import { PendingWorkspacePage } from "@/components/pending-workspace-page";

export const metadata: Metadata = {
  title: "Contact Access",
  description: "Contact access is currently closed.",
  alternates: { canonical: "/contact-access" },
};

export default function ContactAccessPage() {
  return (
    <PendingWorkspacePage
      eyebrow="Access closed"
      summary="Private contact information remains hidden and no contact provider is configured."
      title="Contact Access"
    />
  );
}
