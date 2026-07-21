import type { Metadata } from "next";
import Link from "next/link";

import { LegacyNotice } from "@/components/legacy-notice";
import { PageShell } from "@/components/page-shell";
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
      <section aria-labelledby="legacy-projects" className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold" id="legacy-projects">
          Published projects
        </h2>
        <ul className="mt-4 divide-y divide-slate-200">
          {legacyProjects.map((project) => (
            <li className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between" key={project.downloadPath}>
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-slate-600">
                  {project.category}
                  {project.publishedStatus === "incomplete" ? " · published as incomplete" : ""}
                </p>
              </div>
              <Link className="text-sm font-medium underline" href={project.downloadPath}>
                Legacy download
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

