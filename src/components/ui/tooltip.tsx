"use client";

import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";

import { cn } from "@/lib/cn";

interface DescribedElementProps {
  "aria-describedby"?: string;
}

export interface TooltipProps {
  children: ReactElement<DescribedElementProps>;
  className?: string;
  content: ReactNode;
  placement?: "top" | "right" | "bottom" | "left";
}

export function Tooltip({ children, className, content, placement = "top" }: TooltipProps) {
  const generatedId = useId();
  const id = `tooltip-${generatedId.replaceAll(":", "")}`;

  if (!isValidElement(children)) {
    return null;
  }

  return (
    <span className={cn("ds-tooltip", className)}>
      {cloneElement(children, {
        "aria-describedby": [children.props["aria-describedby"], id]
          .filter(Boolean)
          .join(" "),
      })}
      <span className={`ds-tooltip__content ds-tooltip__content--${placement}`} id={id} role="tooltip">
        {content}
      </span>
    </span>
  );
}
