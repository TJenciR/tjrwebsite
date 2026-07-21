import type { Metadata } from "next";

import { ContactRequestForm } from "@/components/contact";
import { PageShell } from "@/components/page-shell";
import { StatusNotice } from "@/components/ui";
import { contactAccessCopy } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact Access",
  description: "Submit a privacy-safe request for legitimate professional contact.",
  alternates: { canonical: "/contact-access" },
};

export default function ContactAccessPage() {
  return (
    <PageShell
      eyebrow="Manual review"
      summary={contactAccessCopy.body}
      title={contactAccessCopy.heading}
    >
      <StatusNotice title="Private by design" variant="info">
        <p>
          Direct contact details are not displayed publicly. This form sends a request for manual review; it is not a login or automatic access system.
        </p>
      </StatusNotice>
      <ContactRequestForm />
    </PageShell>
  );
}
