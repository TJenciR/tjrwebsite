import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface SectionHeadingProps {
  actions?: ReactNode;
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  id?: string;
  title: ReactNode;
}

export function SectionHeading({
  actions,
  className,
  description,
  eyebrow,
  id,
  title,
}: SectionHeadingProps) {
  return (
    <header className={cn("ds-section-heading", className)}>
      <div>
        {eyebrow ? <p className="ds-eyebrow">{eyebrow}</p> : null}
        <h2 id={id}>{title}</h2>
        {description ? <p className="ds-section-heading__description">{description}</p> : null}
      </div>
      {actions ? <div className="ds-section-heading__actions">{actions}</div> : null}
    </header>
  );
}
