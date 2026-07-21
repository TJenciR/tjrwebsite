import type { Metadata } from "next";

import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy notice for professional contact requests.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Contact requests"
      summary="How submitted professional contact information is handled."
      title="Privacy notice"
    >
      <section className="privacy-notice" aria-labelledby="privacy-use">
        <h2 id="privacy-use">Purpose and use</h2>
        <p>
          Information submitted through Contact Access is used only to review and respond to the professional request. Requests are reviewed manually and submission does not create an account, grant access, or trigger automatic approval.
        </p>
      </section>
      <section className="privacy-notice" aria-labelledby="privacy-data">
        <h2 id="privacy-data">Information submitted</h2>
        <p>
          The request includes the name, professional email, company or organization, opportunity type, message, consent choice, and any optional role-description URL supplied by the requester.
        </p>
      </section>
      <section className="privacy-notice" aria-labelledby="privacy-processing">
        <h2 id="privacy-processing">Processing and storage</h2>
        <p>
          The portfolio does not store requests in a database. When real delivery is enabled, the information is sent through the configured email provider to a private review inbox. Provider and inbox retention are operational matters outside the public portfolio application.
        </p>
      </section>
      <section className="privacy-notice" aria-labelledby="privacy-contact">
        <h2 id="privacy-contact">Private contact details</h2>
        <p>
          Richard’s private email and private telephone are not displayed, returned after submission, or made available automatically. A response, if appropriate, is sent manually using the information in the request.
        </p>
      </section>
    </PageShell>
  );
}
