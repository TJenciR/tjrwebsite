import type { Metadata } from "next";
import Link from "next/link";

import { LegacyNotice } from "@/components/legacy-notice";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui";
import { legacyProjects } from "@/content/legacy-content";

export const metadata: Metadata = {
  title: "Work",
  description: "Legacy project inventory retained during the portfolio migration.",
};

export default function WorkPage() {
  return (
    <PageShell
      eyebrow="Legacy route: /work"
      summary="The published project names and download paths are retained as a migration inventory. Descriptions and outcomes remain on the legacy site until verified."
      title="Legacy project inventory"
    >
      <LegacyNotice path="/work" />
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

