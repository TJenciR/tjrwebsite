import Link from "next/link";

import { Badge, Card } from "@/components/ui";
import { portfolioContent } from "@/content/portfolio";
import {
  formatProjectStatus,
  getPublishedEntries,
  getPublishedValue,
} from "@/lib/public-content";

interface ProjectExperienceListProps {
  limit?: number;
}

export function ProjectExperienceList({ limit }: ProjectExperienceListProps) {
  const publishedProjects = getPublishedEntries(portfolioContent.projects);
  const displayedProjects = typeof limit === "number"
    ? publishedProjects.slice(0, limit)
    : publishedProjects;

  return (
    <div className="profile-project-grid">
      {displayedProjects.map((project) => {
        const technologies = getPublishedValue(project.technologies) ?? [];
        const status = getPublishedValue(project.lifecycleStatus);

        return (
          <Card as="article" className="profile-project-card" key={project.slug}>
            <div className="profile-card-heading-row">
              <h3>{project.title}</h3>
              {status ? <Badge variant="success">{formatProjectStatus(status)}</Badge> : null}
            </div>
            {technologies.length > 0 ? (
              <ul aria-label={`${project.title} technologies`} className="profile-tag-list">
                {technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            ) : (
              <p className="profile-muted-copy">Technology details await confirmation.</p>
            )}
            <Link className="profile-inline-link" href={`/work#${project.slug}`}>
              View in project experience
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
