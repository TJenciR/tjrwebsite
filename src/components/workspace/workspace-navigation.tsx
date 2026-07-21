"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

import { Icon } from "@/components/icons";
import { Tooltip } from "@/components/ui";
import {
  isWorkspaceNavigationActive,
  pinnedProjectNavigation,
  primaryWorkspaceNavigation,
  secondaryProjectNavigation,
  type WorkspaceNavigationItem,
  type WorkspaceProjectLink,
} from "@/content/workspace-navigation";
import { cn } from "@/lib/cn";

interface NavigationLinkProps {
  active?: boolean;
  item: WorkspaceNavigationItem | WorkspaceProjectLink;
  onNavigate?: MouseEventHandler<HTMLAnchorElement>;
  tooltips?: boolean;
}

function NavigationLink({ active = false, item, onNavigate, tooltips = false }: NavigationLinkProps) {
  const link = (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn("workspace-nav-link", active && "workspace-nav-link--active")}
      data-navigation-id={item.id}
      href={item.href}
      onClick={onNavigate}
    >
      <Icon name={item.icon} />
      <span className="workspace-nav-link__label">{item.label}</span>
    </Link>
  );

  if (!tooltips) {
    return link;
  }

  return (
    <Tooltip className="workspace-nav-tooltip" content={item.label} placement="right">
      {link}
    </Tooltip>
  );
}

interface NavigationSectionProps {
  children: ReactNode;
  label?: string;
}

function NavigationSection({ children, label }: NavigationSectionProps) {
  return (
    <section className="workspace-nav-section">
      {label ? <h2>{label}</h2> : null}
      <div className="workspace-nav-section__items">{children}</div>
    </section>
  );
}

export interface WorkspaceNavigationProps {
  onNavigate?: MouseEventHandler<HTMLAnchorElement>;
  pathname: string;
  tooltips?: boolean;
}

export function WorkspaceNavigation({
  onNavigate,
  pathname,
  tooltips = false,
}: WorkspaceNavigationProps) {
  return (
    <nav aria-label="Portfolio sections" className="workspace-navigation">
      <NavigationSection>
        {primaryWorkspaceNavigation.map((item) => (
          <NavigationLink
            active={isWorkspaceNavigationActive(item, pathname)}
            item={item}
            key={item.id}
            onNavigate={onNavigate}
            tooltips={tooltips}
          />
        ))}
      </NavigationSection>

      <NavigationSection label="Pinned projects">
        {pinnedProjectNavigation.map((item) => (
          <NavigationLink
            item={item}
            key={item.id}
            onNavigate={onNavigate}
            tooltips={tooltips}
          />
        ))}
      </NavigationSection>

      <NavigationSection label="More projects">
        {secondaryProjectNavigation.map((item) => (
          <NavigationLink
            item={item}
            key={item.id}
            onNavigate={onNavigate}
            tooltips={tooltips}
          />
        ))}
      </NavigationSection>
    </nav>
  );
}
