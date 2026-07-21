import type { Metadata } from "next";
import Link from "next/link";

import { VerificationStamp } from "@/components/content";
import { Icon, type IconName } from "@/components/icons";
import { Badge, Card } from "@/components/ui";
import { currentActivities } from "@/content/now";
import { formatProjectStatus, getPublishedValue, isPublishedContent } from "@/lib/public-content";
import { getProjectBySlug } from "@/lib/projects";
import type { CurrentActivityKind } from "@/types/content-model";

export const metadata: Metadata = {
  title: "Now",
  description: "A dated, verified snapshot of current portfolio activity.",
  alternates: { canonical: "/now" },
};

const activityPresentation: Readonly<Record<CurrentActivityKind, {
  icon: IconName;
  label: string;
}>> = {
  "currently-building": { icon: "code", label: "Currently building" },
  "currently-learning": { icon: "brain", label: "Currently learning" },
  "currently-improving": { icon: "wrench", label: "Currently improving" },
  "upcoming-milestone": { icon: "flag", label: "Upcoming milestone" },
  "recently-completed": { icon: "history", label: "Recently completed" },
};

export default function NowPage() {
  const buildingActivity = currentActivities.find(
    ({ kind }) => kind === "currently-building",
  );
  const currentProject = buildingActivity?.projectSlug
    ? getProjectBySlug(buildingActivity.projectSlug)
    : null;
  const lastVerified = buildingActivity?.verifiedAt;

  return (
    <main className="experience-page now-page" id="main-content">
      <header className="experience-page-header">
        <p className="ds-eyebrow">Current snapshot</p>
        <h1>Now</h1>
        <p>Current activity is shown only where a dated source has been verified.</p>
        {lastVerified ? <VerificationStamp date={lastVerified} /> : null}
      </header>

      <section aria-labelledby="currently-building" className="now-primary-section">
        <div className="experience-section-heading">
          <span className="experience-heading-icon"><Icon name="code" /></span>
          <div>
            <h2 id="currently-building">Currently building</h2>
            <p>The documented current project.</p>
          </div>
        </div>

        {buildingActivity && currentProject && isPublishedContent(buildingActivity) ? (
          <Card as="article" className="now-project-card" variant="interactive">
            <div className="now-project-card__header">
              <div>
                <p className="ds-eyebrow">Current project</p>
                <h3>{currentProject.title}</h3>
              </div>
              {getPublishedValue(currentProject.status) ? (
                <Badge variant="warning">
                  {formatProjectStatus(getPublishedValue(currentProject.status)!)}
                </Badge>
              ) : null}
            </div>
            {(getPublishedValue(currentProject.technologies) ?? []).length > 0 ? (
              <ul aria-label="Current project technologies" className="experience-tag-list">
                {(getPublishedValue(currentProject.technologies) ?? []).map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            ) : null}
            <Link className="experience-link" href={`/work/${currentProject.slug}`}>
              View verified project record <Icon name="arrowRight" />
            </Link>
          </Card>
        ) : (
          <p className="experience-empty-copy">No verified current project is available.</p>
        )}
      </section>

      <section aria-labelledby="now-status-slots" className="now-status-section">
        <h2 className="ds-visually-hidden" id="now-status-slots">Current activity status</h2>
        <div className="now-status-grid">
          {currentActivities
            .filter(({ kind }) => kind !== "currently-building")
            .map((activity) => {
              const presentation = activityPresentation[activity.kind];
              return (
                <Card as="article" className="now-status-card" key={activity.id}>
                  <span className="experience-heading-icon"><Icon name={presentation.icon} /></span>
                  <div>
                    <h3>{presentation.label}</h3>
                    {isPublishedContent(activity) && activity.title ? (
                      <p>{activity.title}</p>
                    ) : (
                      <p className="experience-empty-copy">No verified update is available.</p>
                    )}
                  </div>
                </Card>
              );
            })}
        </div>
      </section>
    </main>
  );
}
