"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { Icon } from "@/components/icons";
import { Avatar, Dialog, Drawer, IconButton, SearchField } from "@/components/ui";
import {
  getWorkspaceBreadcrumb,
  pinnedProjectNavigation,
  primaryWorkspaceNavigation,
  secondaryProjectNavigation,
} from "@/content/workspace-navigation";
import { siteConfig } from "@/content/site-config";
import { getPublicValue } from "@/lib/content-value";

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
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(
    subscribeToSidebarState,
    getStoredSidebarState,
    getServerSidebarState,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const name = getPublicValue(siteConfig.name) ?? "Portfolio";
  const breadcrumb = getWorkspaceBreadcrumb(pathname);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const items = [
      ...primaryWorkspaceNavigation,
      ...pinnedProjectNavigation,
      ...secondaryProjectNavigation,
    ];

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => item.label.toLocaleLowerCase().includes(normalizedQuery));
  }, [query]);

  function closeMobileNavigation() {
    setMobileOpen(false);
  }

  function openSearch() {
    setMobileOpen(false);
    setSearchOpen(true);
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
          onSearch={openSearch}
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
            <IconButton icon="search" label="Search portfolio" onClick={openSearch} variant="ghost" />
            <Avatar alt={`${name} portrait placeholder`} initials="TJR" size="small" />
          </div>
        </header>

        <div className="workspace-content-scroll">{children}</div>

        <footer aria-label="Command composer" className="workspace-composer-dock">
          <button onClick={openSearch} type="button">
            <Icon name="command" />
            <span>Search or navigate this portfolio</span>
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
          onSearch={openSearch}
          pathname={pathname}
        />
      </Drawer>

      <Dialog
        className="workspace-search-dialog"
        description="Search verified sections and project names."
        onOpenChange={setSearchOpen}
        open={searchOpen}
        title="Search portfolio"
      >
        <div className="workspace-search-dialog__content">
          <SearchField
            label="Search portfolio"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search sections and projects…"
            value={query}
          />
          <nav aria-label="Search results">
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((item) => (
                  <li key={`${item.id}-${item.href}`}>
                    <Link href={item.href} onClick={() => setSearchOpen(false)}>
                      <Icon name={item.icon} />
                      <span>{item.label}</span>
                      <Icon name="chevronRight" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No matching portfolio sections.</p>
            )}
          </nav>
        </div>
      </Dialog>
    </div>
  );
}
