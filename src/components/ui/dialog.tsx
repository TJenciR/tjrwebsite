"use client";

import {
  useCallback,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import { useModalFocus } from "@/lib/use-modal-focus";

export interface DialogProps {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  footer?: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: ReactNode;
}

export function Dialog({
  children,
  className,
  description,
  footer,
  onOpenChange,
  open,
  title,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const generatedId = useId().replaceAll(":", "");
  const titleId = `dialog-title-${generatedId}`;
  const descriptionId = description ? `dialog-description-${generatedId}` : undefined;
  const dismiss = useCallback(() => onOpenChange(false), [onOpenChange]);

  useModalFocus(open, dialogRef, dismiss);

  if (!open) {
    return null;
  }

  function handleOverlayPointer(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      dismiss();
    }
  }

  return (
    <div className="ds-modal-layer" onMouseDown={handleOverlayPointer}>
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn("ds-dialog", className)}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="ds-modal-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </div>
          <IconButton icon="close" label="Close dialog" onClick={dismiss} variant="ghost" />
        </header>
        <div className="ds-modal-body">{children}</div>
        {footer ? <footer className="ds-modal-footer">{footer}</footer> : null}
      </div>
    </div>
  );
}
