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

export interface DrawerProps {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  footer?: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  side?: "left" | "right";
  title: ReactNode;
}

export function Drawer({
  children,
  className,
  description,
  footer,
  onOpenChange,
  open,
  side = "left",
  title,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId().replaceAll(":", "");
  const titleId = `drawer-title-${generatedId}`;
  const descriptionId = description ? `drawer-description-${generatedId}` : undefined;
  const dismiss = useCallback(() => onOpenChange(false), [onOpenChange]);

  useModalFocus(open, drawerRef, dismiss);

  if (!open) {
    return null;
  }

  function handleOverlayPointer(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      dismiss();
    }
  }

  return (
    <div className="ds-modal-layer ds-modal-layer--drawer" onMouseDown={handleOverlayPointer}>
      <aside
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn("ds-drawer", `ds-drawer--${side}`, className)}
        ref={drawerRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="ds-modal-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </div>
          <IconButton icon="close" label="Close drawer" onClick={dismiss} variant="ghost" />
        </header>
        <div className="ds-modal-body ds-drawer__body">{children}</div>
        {footer ? <footer className="ds-modal-footer">{footer}</footer> : null}
      </aside>
    </div>
  );
}
