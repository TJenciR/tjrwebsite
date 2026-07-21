import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectCover, ProjectGallery } from "@/components/media";

const verifiedLocalImage = {
  alt: "Verified project interface",
  height: 900,
  publicPath: "/images/verified-project.webp",
  width: 1440,
} as const;

describe("media rendering", () => {
  it("reserves space and renders a useful missing-media state", () => {
    const { container } = render(
      <ProjectCover media={null} projectTitle="Test project" />,
    );

    expect(screen.getByText("Test project media")).toBeInTheDocument();
    expect(container.querySelector("[data-media-state='missing']")).toHaveStyle({
      "--media-aspect-ratio": "16 / 10",
    });
  });

  it("uses intrinsic dimensions, useful alt text, and lazy loading below the fold", () => {
    render(<ProjectCover media={verifiedLocalImage} projectTitle="Test project" />);

    const image = screen.getByRole("img", { name: "Verified project interface" });
    expect(image).toHaveAttribute("width", "1440");
    expect(image).toHaveAttribute("height", "900");
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("refuses remote media and keeps galleries server-renderable", () => {
    const remoteImage = {
      ...verifiedLocalImage,
      publicPath: "https://third-party.example/project.webp",
    };
    const { rerender } = render(
      <ProjectCover media={remoteImage} projectTitle="Remote project" />,
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Remote project media")).toBeInTheDocument();

    rerender(<ProjectGallery media={[verifiedLocalImage]} projectTitle="Test project" />);
    expect(screen.getByRole("img", { name: "Verified project interface" }))
      .toHaveAttribute("loading", "lazy");
  });
});

describe("motion and bundle contracts", () => {
  it("has no continuous animation and disables entrances for reduced motion", () => {
    const componentCss = readFileSync(resolve(process.cwd(), "src/styles/components.css"), "utf8");
    const globalCss = readFileSync(resolve(process.cwd(), "src/styles/globals.css"), "utf8");

    expect(componentCss).not.toMatch(/animation:[^;]*infinite/);
    expect(componentCss).toContain("--motion-duration-drawer");
    expect(globalCss).toContain("animation: page-enter var(--motion-duration-normal)");
    expect(globalCss).toContain("animation: none");
  });

  it("defers the command composer until it is opened", () => {
    const shellSource = readFileSync(
      resolve(process.cwd(), "src/components/workspace/workspace-shell.tsx"),
      "utf8",
    );

    expect(shellSource).toContain("dynamic(");
    expect(shellSource).toContain("{ ssr: false }");
    expect(shellSource).toContain("composerOpen ?");
  });
});
