import type { Metadata } from "next";
import Link from "next/link";

import { LegacyNotice } from "@/components/legacy-notice";
import { PageShell } from "@/components/page-shell";
import { ProjectLibraryCard } from "@/components/projects";
import { EmptyState, SectionHeading } from "@/components/ui";
import { projects } from "@/content/projects";
import {
  filterProjects,
  getFeaturedProjects,
  getProjectFilterOptions,
  parseProjectFilters,
  type ProjectSearchParams,
} from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Verified project inventory and case studies by Tököli Jenő-Richard.",
  alternates: { canonical: "/work" },
};

interface WorkPageProps {
  searchParams: Promise<ProjectSearchParams>;
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const filters = parseProjectFilters(await searchParams);
  const filteredProjects = filterProjects(projects, filters);
  const featuredProjects = getFeaturedProjects();
  const options = getProjectFilterOptions(projects);

  return (
    <PageShell
      eyebrow="Project library"
      summary="A source-aware record of confirmed projects. Unverified descriptions, outcomes, and links remain unpublished."
      title="Projects and case studies"
    >
      <LegacyNotice path="/work" />

      <section aria-labelledby="featured-projects" className="project-library-section">
        <SectionHeading
          description="The current project priorities, presented without unverified outcomes or performance claims."
          id="featured-projects"
          title="Featured projects"
        />
        <div className="project-library-grid project-library-grid--featured">
          {featuredProjects.map((project) => (
            <ProjectLibraryCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section aria-labelledby="all-projects" className="project-library-section">
        <SectionHeading
          description="Search and combine status, technology, and category filters. Filter state is stored in the URL."
          id="all-projects"
          title="All projects"
        />

        <form action="/work" className="project-filter-form" method="get" role="search">
          <label className="project-filter-field project-filter-field--search">
            <span>Search projects</span>
            <input
              defaultValue={filters.query}
              name="q"
              placeholder="Search by title or technology"
              type="search"
            />
          </label>
          <label className="project-filter-field">
            <span>Status</span>
            <select defaultValue={filters.status} name="status">
              <option value="">All statuses</option>
              <option value="finished">Finished</option>
              <option value="work-in-progress">Work in progress</option>
              <option value="incomplete">Incomplete</option>
              <option value="undocumented">Not documented</option>
            </select>
          </label>
          <label className="project-filter-field">
            <span>Technology</span>
            <select defaultValue={filters.technology} name="technology">
              <option value="">All technologies</option>
              {options.technologies.map((technology) => (
                <option key={technology} value={technology}>{technology}</option>
              ))}
            </select>
          </label>
          <label className="project-filter-field">
            <span>Category</span>
            <select defaultValue={filters.category} name="category">
              <option value="">All categories</option>
              {options.categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <div className="project-filter-actions">
            <button type="submit">Apply filters</button>
            <Link href="/work">Reset</Link>
          </div>
        </form>

        <p aria-live="polite" className="project-result-count">
          {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
        </p>

        {filteredProjects.length > 0 ? (
          <div className="project-library-grid">
            {filteredProjects.map((project) => (
              <ProjectLibraryCard
                anchorId={project.slug}
                key={project.id}
                project={project}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            action={<Link className="project-card-link" href="/work">Reset filters</Link>}
            description="Try another search term or clear one of the selected filters."
            icon="search"
            title="No projects match these filters"
          />
        )}
      </section>
    </PageShell>
  );
}
