import { Icon } from "@/components/icons";
import { Badge, Card, StatusNotice } from "@/components/ui";
import { portfolioContent } from "@/content/portfolio";
import {
  formatEducationStatus,
  getPublishedEntries,
  getPublishedValue,
} from "@/lib/public-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Education",
  description: "Verified education institutions and qualification inventory.",
  path: "/education",
});

export default function EducationPage() {
  const qualifications = getPublishedEntries(portfolioContent.qualifications);

  return (
    <main className="profile-page education-page" id="main-content">
      <header className="profile-page-header">
        <p className="ds-eyebrow">Education · source-aware record</p>
        <h1>Education and qualifications</h1>
        <p>
          Institution and qualification names come from the verified content
          inventory. Unconfirmed dates and university completion are omitted.
        </p>
      </header>

      <StatusNotice title="University status requires confirmation" variant="warning">
        No university end date, current-status label, degree type, or completion
        claim is published.
      </StatusNotice>

      <section aria-labelledby="academic-background" className="profile-section">
        <div className="profile-section-heading"><h2 id="academic-background">Academic background</h2></div>
        <div className="education-timeline">
          {portfolioContent.education.map((entry) => {
            const institution = getPublishedValue(entry.institution);
            const programme = getPublishedValue(entry.programme);
            const status = getPublishedValue(entry.status);

            return institution ? (
              <Card as="article" className="education-entry" key={entry.id}>
                <div aria-hidden="true" className="education-entry__marker"><Icon name="graduation" /></div>
                <div className="education-entry__content">
                  <div className="profile-card-heading-row">
                    <h3>{institution}</h3>
                    <Badge variant={status ? "success" : "warning"}>
                      {status ? formatEducationStatus(status) : "Status requires confirmation"}
                    </Badge>
                  </div>
                  {programme ? <p className="education-entry__programme">{programme}</p> : null}
                  <p className="profile-muted-copy">
                    Dates are withheld until they are confirmed for public use.
                  </p>
                </div>
              </Card>
            ) : null;
          })}
        </div>
      </section>

      <section aria-labelledby="qualifications" className="profile-section">
        <div className="profile-section-heading">
          <div>
            <p className="ds-eyebrow">Text-only public facts</p>
            <h2 id="qualifications">Qualifications and accreditations</h2>
          </div>
        </div>
        <div className="qualification-grid">
          {qualifications.map((qualification) => (
            <Card as="article" className="qualification-card" key={qualification.id}>
              <Icon name="document" />
              <div><h3>{qualification.title}</h3><p>Document access is not published.</p></div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
