import Link from "next/link";

import { Badge, ProjectCard } from "@/components/ui";
import { ProjectMedia } from "@/components/projects/project-media";
import { formatProjectStatus, getPublishedValue } from "@/lib/public-content";
import type { Project } from "@/types/content-model";

interface ProjectLibraryCardProps {
  anchorId?: string;
  project: Project;
}

export function ProjectLibraryCard({ anchorId, project }: ProjectLibraryCardProps) {
  const categories = getPublishedValue(project.categories) ?? [];
  const description = getPublishedValue(project.shortDescription);
  const status = getPublishedValue(project.status);
  const technologies = getPublishedValue(project.technologies) ?? [];

  return (
    <div className="project-card-anchor" id={anchorId}>
      <ProjectCard
        actions={(
          <Link className="project-card-link" href={`/work/${project.slug}`}>
            View case study
          </Link>
        )}
        className="project-library-card"
        description={description ?? "Details being documented."}
        media={(
          <ProjectMedia media={project.coverImage} projectTitle={project.title} />
        )}
        metadata={(
          <div className="project-card-metadata">
            {technologies.length > 0 ? (
              <ul aria-label={`${project.title} technologies`} className="project-tag-list">
                {technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            ) : null}
            {categories.length > 0 ? (
              <p className="project-card-category">{categories.join(" · ")}</p>
            ) : null}
          </div>
        )}
        status={status
          ? <Badge variant={status === "finished" ? "success" : "warning"}>{formatProjectStatus(status)}</Badge>
          : <Badge>Status not documented</Badge>}
        title={<Link href={`/work/${project.slug}`}>{project.title}</Link>}
      />
    </div>
  );
}
