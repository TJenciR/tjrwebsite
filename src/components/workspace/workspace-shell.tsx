"use client";

import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { Icon } from "@/components/icons";
import { Avatar, Drawer, IconButton } from "@/components/ui";
import { getWorkspaceBreadcrumb } from "@/content/workspace-navigation";
import { siteConfig } from "@/content/site-config";
import { getPublicValue } from "@/lib/content-value";
import type { PortfolioCommand } from "@/types/portfolio-command";

import { PortfolioCommandComposer } from "./portfolio-command-composer";
import { WorkspaceSidebarContent } from "./workspace-sidebar-content";

export const sidebarStorageKey = "tjr:workspace-sidebar-collapsed";
const sidebarStorageEvent = "tjr:workspace-sidebar-state";

function subscribeToSidebarState(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(sidebarStorageEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(sidebarStorageEvent, onStoreChange);
  };
}

function getStoredSidebarState() {
  try {
    return window.localStorage.getItem(sidebarStorageKey) === "true";
  } catch {
    return false;
  }
}

function getServerSidebarState() {
  return false;
}

function persistSidebarState(collapsed: boolean) {
  try {
    window.localStorage.setItem(sidebarStorageKey, String(collapsed));
    window.dispatchEvent(new Event(sidebarStorageEvent));
  } catch {
    // The shell remains usable when storage is blocked.
  }
}

interface WorkspaceShellProps {
  children: ReactNode;
  commands: readonly PortfolioCommand[];
}

export function WorkspaceShell({ children, commands }: WorkspaceShellProps) {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(
    subscribeToSidebarState,
    getStoredSidebarState,
    getServerSidebarState,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const name = getPublicValue(siteConfig.name) ?? "Portfolio";
  const breadcrumb = getWorkspaceBreadcrumb(pathname);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setComposerOpen(true);
      }
    }

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  function closeMobileNavigation() {
    setMobileOpen(false);
  }

  function openComposer() {
    setMobileOpen(false);
    setComposerOpen(true);
  }

  return (
    <div className="workspace-shell" data-sidebar-collapsed={collapsed}>
      <aside
        aria-label="Portfolio workspace"
        className="workspace-sidebar"
        data-collapsed={collapsed}
        data-testid="workspace-sidebar"
      >
        <WorkspaceSidebarContent
          collapsed={collapsed}
          onCollapseToggle={() => persistSidebarState(!collapsed)}
          onSearch={openComposer}
          pathname={pathname}
        />
      </aside>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-topbar__context">
            <IconButton
              className="workspace-mobile-menu"
              icon="menu"
              label="Open navigation"
              onClick={() => setMobileOpen(true)}
              variant="ghost"
            />
            <Icon name="projects" />
            <span>workspace</span>
            <span aria-hidden="true">/</span>
            <strong>{breadcrumb}</strong>
          </div>
          <div className="workspace-topbar__actions">
            <IconButton
              icon="command"
              label="Open portfolio commands"
              onClick={openComposer}
              variant="ghost"
            />
            <Avatar alt={`${name} portrait placeholder`} initials="TJR" size="small" />
          </div>
        </header>

        <div className="workspace-content-scroll">{children}</div>

        <footer aria-label="Command composer" className="workspace-composer-dock">
          <button onClick={openComposer} type="button">
            <Icon name="command" />
            <span>Ask or navigate this portfolio</span>
            <kbd aria-hidden="true">Ctrl K</kbd>
          </button>
        </footer>
      </div>

      <Drawer
        className="workspace-mobile-drawer"
        description="Navigate portfolio sections and project indexes."
        onOpenChange={setMobileOpen}
        open={mobileOpen}
        title="Portfolio navigation"
      >
        <WorkspaceSidebarContent
          mobile
          onNavigate={closeMobileNavigation}
          onSearch={openComposer}
          pathname={pathname}
        />
      </Drawer>

      <PortfolioCommandComposer
        commands={commands}
        onOpenChange={setComposerOpen}
        open={composerOpen}
      />
    </div>
  );
}
