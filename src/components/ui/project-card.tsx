import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export interface ProjectCardProps {
  actions?: ReactNode;
  className?: string;
  description?: ReactNode;
  media?: ReactNode;
  metadata?: ReactNode;
  status?: ReactNode;
  title: ReactNode;
}

export function ProjectCard({
  actions,
  className,
  description,
  media,
  metadata,
  status,
  title,
}: ProjectCardProps) {
  return (
    <Card as="article" className={cn("ds-project-card", className)} padding="none" variant="elevated">
      {media ? <div className="ds-project-card__media">{media}</div> : null}
      <div className="ds-project-card__body">
        <div className="ds-project-card__heading">
          <h3>{title}</h3>
          {status ? <div>{status}</div> : null}
        </div>
        {metadata ? <div className="ds-project-card__metadata">{metadata}</div> : null}
        {description ? <p className="ds-project-card__description">{description}</p> : null}
        {actions ? <div className="ds-project-card__actions">{actions}</div> : null}
      </div>
    </Card>
  );
}
