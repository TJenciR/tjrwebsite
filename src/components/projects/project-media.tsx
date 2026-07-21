import { ArchitectureDiagram, ProjectCover } from "@/components/media";
import { getPublishedValue } from "@/lib/public-content";
import type { SourcedValue, ProjectMedia as ProjectMediaValue } from "@/types/content-model";

interface ProjectMediaProps {
  media: SourcedValue<ProjectMediaValue>;
  priority?: boolean;
  projectTitle: string;
}

export function ProjectMedia({ media, priority = false, projectTitle }: ProjectMediaProps) {
  const publishedMedia = getPublishedValue(media);

  return publishedMedia?.kind === "architecture" ? (
    <ArchitectureDiagram media={publishedMedia} projectTitle={projectTitle} />
  ) : (
    <ProjectCover
      className="project-media"
      eager={priority}
      media={publishedMedia}
      projectTitle={projectTitle}
    />
  );
}
