import type { Metadata } from "next";
import Link from "next/link";

import { LegacyNotice } from "@/components/legacy-notice";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui";
import { legacyProjects } from "@/content/legacy-content";
import { portfolioContent } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Work",
  description: "Legacy project inventory retained during the portfolio migration.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <PageShell
      eyebrow="Legacy route: /work"
      summary="The published project names and download paths are retained as a migration inventory. Descriptions and outcomes remain on the legacy site until verified."
      title="Legacy project inventory"
    >
      <LegacyNotice path="/work" />
      <Card as="section" aria-labelledby="workspace-projects">
        <h2 className="foundation-card-heading" id="workspace-projects">
          Workspace project index
        </h2>
        <p className="foundation-supporting-copy">
          Project names are available for navigation. Descriptions remain withheld
          until their source facts are confirmed.
        </p>
        <ul className="foundation-list">
          {portfolioContent.projects.map((project) => (
            <li id={project.slug} key={project.slug}>
              <h3>{project.title}</h3>
            </li>
          ))}
        </ul>
      </Card>
      <Card as="section" aria-labelledby="legacy-projects">
        <h2 className="foundation-card-heading" id="legacy-projects">
          Published projects
        </h2>
        <ul className="foundation-list">
          {legacyProjects.map((project) => (
            <li key={project.downloadPath}>
              <div>
                <h3>{project.name}</h3>
                <p>
                  {project.category}
                  {project.publishedStatus === "incomplete" ? " · published as incomplete" : ""}
                </p>
              </div>
              <Link className="foundation-link" href={project.downloadPath}>
                Legacy download
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </PageShell>
  );
}

