import Image from "next/image";

import { MediaPlaceholder } from "@/components/ui";
import { getPublishedValue } from "@/lib/public-content";
import type { SourcedValue, ProjectMedia as ProjectMediaValue } from "@/types/content-model";

interface ProjectMediaProps {
  media: SourcedValue<ProjectMediaValue>;
  priority?: boolean;
  projectTitle: string;
}

export function ProjectMedia({ media, priority = false, projectTitle }: ProjectMediaProps) {
  const publishedMedia = getPublishedValue(media);

  if (!publishedMedia) {
    return (
      <MediaPlaceholder
        className="project-media-placeholder"
        description="No verified project image is available yet."
        label={`${projectTitle} media`}
      />
    );
  }

  return (
    <Image
      alt={publishedMedia.alt}
      className="project-media-image"
      height={publishedMedia.height}
      priority={priority}
      sizes="(max-width: 48rem) 100vw, (max-width: 75rem) 50vw, 38rem"
      src={publishedMedia.publicPath}
      width={publishedMedia.width}
    />
  );
}
