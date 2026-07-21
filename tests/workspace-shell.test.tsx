import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationState = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
}));

import {
  sidebarStorageKey,
  WorkspaceShell,
} from "@/components/workspace/workspace-shell";
import {
  isWorkspaceNavigationActive,
  pinnedProjectNavigation,
  primaryWorkspaceNavigation,
  secondaryProjectNavigation,
} from "@/content/workspace-navigation";

function renderShell() {
  return render(
    <WorkspaceShell>
      <main id="main-content">Workspace content</main>
    </WorkspaceShell>,
  );
}

beforeEach(() => {
  navigationState.pathname = "/";
  window.localStorage.clear();
});

describe("typed workspace navigation", () => {
  it("keeps the pinned and secondary project links data-driven", () => {
    expect(pinnedProjectNavigation.map(({ label }) => label)).toEqual([
      "RepairPass",
      "3D Optimal Pathfinder",
      "Online School Portal",
    ]);
    expect(secondaryProjectNavigation.map(({ label }) => label)).toEqual([
      "M4RS",
      "Pizza Decorator",
      "Basic OCR",
      "Spam Filter",
    ]);
    expect(pinnedProjectNavigation.every(({ href }) => href.startsWith("/work#"))).toBe(true);
  });

  it("matches exact, nested, and aliased active routes", () => {
    const overview = primaryWorkspaceNavigation.find(({ id }) => id === "overview");
    const projects = primaryWorkspaceNavigation.find(({ id }) => id === "projects");

    expect(overview && isWorkspaceNavigationActive(overview, "/")).toBe(true);
    expect(overview && isWorkspaceNavigationActive(overview, "/about")).toBe(false);
    expect(projects && isWorkspaceNavigationActive(projects, "/work/archive")).toBe(true);
    expect(projects && isWorkspaceNavigationActive(projects, "/projects")).toBe(true);
  });
});

describe("desktop workspace shell", () => {
  it("renders expanded navigation, active route state, pinned links, and an unobscured composer row", () => {
    navigationState.pathname = "/skills";
    renderShell();

    const sidebar = screen.getByTestId("workspace-sidebar");
    const skills = within(sidebar).getByRole("link", { name: "Skills" });

    expect(sidebar).toHaveAttribute("data-collapsed", "false");
    expect(skills).toHaveAttribute("aria-current", "page");
    expect(within(sidebar).getByRole("link", { name: "RepairPass" })).toHaveAttribute(
      "href",
      "/work#repairpass",
    );
    expect(screen.getByRole("contentinfo", { name: "Command composer" })).toBeInTheDocument();
  });

  it("persists collapsed state and restores the icon rail without a render-time default change", async () => {
    const user = userEvent.setup();
    renderShell();

    const sidebar = screen.getByTestId("workspace-sidebar");
    await user.click(within(sidebar).getByRole("button", { name: "Collapse sidebar" }));

    expect(sidebar).toHaveAttribute("data-collapsed", "true");
    expect(window.localStorage.getItem(sidebarStorageKey)).toBe("true");

    await user.click(within(sidebar).getByRole("button", { name: "Expand sidebar" }));
    expect(sidebar).toHaveAttribute("data-collapsed", "false");
    expect(window.localStorage.getItem(sidebarStorageKey)).toBe("false");
  });

  it("reads a previously saved collapsed preference on the client", async () => {
    window.localStorage.setItem(sidebarStorageKey, "true");
    renderShell();

    await waitFor(() => {
      expect(screen.getByTestId("workspace-sidebar")).toHaveAttribute("data-collapsed", "true");
    });
  });
});

describe("mobile workspace drawer", () => {
  it("traps focus, closes on Escape, and restores focus to the opener", async () => {
    const user = userEvent.setup();
    renderShell();

    const opener = screen.getByRole("button", { name: "Open navigation" });
    await user.click(opener);

    const drawer = screen.getByRole("dialog", { name: "Portfolio navigation" });
    const close = within(drawer).getByRole("button", { name: "Close drawer" });
    expect(close).toHaveFocus();

    const mobileLinks = within(drawer).getAllByRole("link");
    mobileLinks.at(-1)?.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Portfolio navigation" })).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("closes when a mobile navigation link or overlay is selected", async () => {
    const user = userEvent.setup();
    renderShell();

    const opener = screen.getByRole("button", { name: "Open navigation" });
    await user.click(opener);
    const drawer = screen.getByRole("dialog", { name: "Portfolio navigation" });
    const aboutLink = within(drawer).getByRole("link", { name: "About" });
    aboutLink.addEventListener("click", (event) => event.preventDefault(), { once: true });
    fireEvent.click(aboutLink);
    expect(screen.queryByRole("dialog", { name: "Portfolio navigation" })).not.toBeInTheDocument();

    await user.click(opener);
    const openDrawer = screen.getByRole("dialog", { name: "Portfolio navigation" });
    const overlay = openDrawer.parentElement;
    expect(overlay).toHaveClass("ds-modal-layer");
    if (overlay) {
      fireEvent.mouseDown(overlay);
    }
    expect(screen.queryByRole("dialog", { name: "Portfolio navigation" })).not.toBeInTheDocument();
  });
});

describe("workspace motion", () => {
  it("uses bounded shell durations and disables nonessential reduced-motion effects", () => {
    const tokens = readFileSync(resolve(process.cwd(), "src/styles/tokens.css"), "utf8");
    const css = readFileSync(resolve(process.cwd(), "src/styles/workspace.css"), "utf8");

    expect(tokens).toContain("--motion-duration-shell: 200ms");
    expect(tokens).toContain("--motion-duration-drawer: 220ms");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("transition: none !important");
    expect(css).toContain("animation: none !important");
  });
});
