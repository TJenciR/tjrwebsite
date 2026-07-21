"use client";

import Link from "next/link";
import type { MouseEventHandler } from "react";

import { Icon } from "@/components/icons";
import { Avatar, IconButton, Tooltip } from "@/components/ui";
import { siteConfig } from "@/content/site-config";
import { getPublicValue } from "@/lib/content-value";

import { WorkspaceNavigation } from "./workspace-navigation";

interface WorkspaceSidebarContentProps {
  collapsed?: boolean;
  mobile?: boolean;
  onCollapseToggle?: () => void;
  onNavigate?: MouseEventHandler<HTMLAnchorElement>;
  onSearch: () => void;
  pathname: string;
}

export function WorkspaceSidebarContent({
  collapsed = false,
  mobile = false,
  onCollapseToggle,
  onNavigate,
  onSearch,
  pathname,
}: WorkspaceSidebarContentProps) {
  const name = getPublicValue(siteConfig.name) ?? "Portfolio";
  const title = getPublicValue(siteConfig.draftProfessionalTitle);
  const location = getPublicValue(siteConfig.location);
  const githubUrl = getPublicValue(siteConfig.githubUrl);
  const linkedinUrl = getPublicValue(siteConfig.linkedinUrl);

  return (
    <div className="workspace-sidebar-content">
      <div className="workspace-sidebar-top">
        <div className="workspace-identity">
          <Link aria-label={`${name} overview`} className="workspace-monogram" href="/" onClick={onNavigate}>
            TJR
          </Link>
          <div className="workspace-identity__copy">
            <strong>{name}</strong>
            <span>Personal workspace</span>
          </div>
        </div>

        <Tooltip className="workspace-nav-tooltip" content="New exploration" placement="right">
          <Link className="workspace-new-exploration" href="/" onClick={onNavigate}>
            <Icon name="plus" />
            <span className="workspace-nav-link__label">New exploration</span>
          </Link>
        </Tooltip>

        <Tooltip className="workspace-nav-tooltip" content="Search portfolio" placement="right">
          <button className="workspace-search-trigger" onClick={onSearch} type="button">
            <Icon name="search" />
            <span className="workspace-nav-link__label">Search portfolio</span>
            <kbd className="workspace-search-trigger__shortcut" aria-hidden="true">Ctrl K</kbd>
          </button>
        </Tooltip>
      </div>

      <div className="workspace-sidebar-scroll">
        <WorkspaceNavigation
          onNavigate={onNavigate}
          pathname={pathname}
          tooltips={!mobile}
        />
      </div>

      <div className="workspace-sidebar-bottom">
        <div className="workspace-profile">
          <Avatar alt={`${name} portrait placeholder`} initials="TJR" size="medium" />
          <div className="workspace-profile__copy">
            <strong>{name}</strong>
            <span>{title ?? "Title pending confirmation"}</span>
            <span className="workspace-profile__location">
              <Icon name="location" />
              {location ?? "Location pending confirmation"}
            </span>
          </div>
        </div>

        <div className="workspace-profile-links">
          {githubUrl ? (
            <a href={githubUrl} rel="noreferrer" target="_blank">
              <Icon name="code" />
              <span className="workspace-nav-link__label">GitHub</span>
            </a>
          ) : (
            <span aria-label="GitHub profile pending verification">
              <Icon name="code" />
              <span className="workspace-nav-link__label">GitHub pending verification</span>
            </span>
          )}
          {linkedinUrl ? (
            <a href={linkedinUrl} rel="noreferrer" target="_blank">
              <Icon name="externalLink" />
              <span className="workspace-nav-link__label">LinkedIn</span>
            </a>
          ) : null}
        </div>

        <div className="workspace-sidebar-controls">
          <Tooltip content="Dark appearance is active" placement="right">
            <IconButton
              disabled
              icon="appearance"
              label="Appearance: dark (only theme available)"
              variant="ghost"
            />
          </Tooltip>
          {!mobile && onCollapseToggle ? (
            <Tooltip
              className="workspace-collapse-control"
              content={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              placement="right"
            >
              <IconButton
                icon={collapsed ? "panelOpen" : "panelClose"}
                label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                onClick={onCollapseToggle}
                variant="ghost"
              />
            </Tooltip>
          ) : null}
        </div>
      </div>
    </div>
  );
}
