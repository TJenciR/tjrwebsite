import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProjectPage from "@/app/work/[slug]/page";
import WorkPage from "@/app/work/page";
import { projects } from "@/content/projects";
import {
  filterProjects,
  getProjectBySlug,
  parseProjectFilters,
} from "@/lib/projects";

describe("project library", () => {
  it("filters by text, status, technology, and category without a client dependency", () => {
    const filters = parseProjectFilters({
      q: "path",
      status: "finished",
      technology: "Python",
      category: "Featured",
    });

    expect(filterProjects(projects, filters).map(({ slug }) => slug)).toEqual([
      "3d-optimal-pathfinder",
    ]);
  });

  it("treats projects with an unpublished status as not documented", () => {
    const filters = parseProjectFilters({ status: "undocumented" });

    expect(filterProjects(projects, filters).map(({ slug }) => slug)).toEqual([
      "flower-growth-simulator",
      "basic-ocr",
      "spam-filter",
    ]);
  });

  it("renders URL-backed filters and an accessible empty state", async () => {
    render(await WorkPage({
      searchParams: Promise.resolve({ q: "definitely-no-such-project" }),
    }));

    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByRole("heading", {
      name: "No projects match these filters",
    })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reset filters" })).toHaveAttribute(
      "href",
      "/work",
    );
  });
});

describe("project case studies", () => {
  it("renders a known project using only confirmed metadata", async () => {
    render(await ProjectPage({
      params: Promise.resolve({ slug: "3d-optimal-pathfinder" }),
    }));

    expect(screen.getByRole("heading", { level: 1, name: "3D Optimal Pathfinder" }))
      .toBeInTheDocument();
    expect(screen.getAllByText("Python")).toHaveLength(2);
    expect(screen.getAllByText("Finished")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Legacy download" })).toHaveAttribute(
      "href",
      "https://tjrichard.netlify.app/download/pathfinder.zip",
    );
    expect(screen.queryByRole("heading", { name: "Outcome" })).not.toBeInTheDocument();
  });

  it("renders a graceful missing-image state", async () => {
    render(await ProjectPage({
      params: Promise.resolve({ slug: "online-school-portal" }),
    }));

    expect(screen.getByText("Online School Portal media")).toBeInTheDocument();
    expect(screen.getByText("No verified project image is available yet."))
      .toBeInTheDocument();
  });

  it("keeps RepairPass planned and implemented scope separate", async () => {
    render(await ProjectPage({
      params: Promise.resolve({ slug: "repairpass-architecture" }),
    }));

    expect(screen.getAllByText("Work in progress")).toHaveLength(2);
    expect(screen.getByText(
      "Implemented and planned functionality are being verified separately before publication.",
    )).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Implemented functionality" }))
      .not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Planned functionality" }))
      .not.toBeInTheDocument();
  });

  it("returns the not-found path for an invalid project slug", async () => {
    expect(getProjectBySlug("not-a-project")).toBeNull();
    await expect(ProjectPage({
      params: Promise.resolve({ slug: "not-a-project" }),
    })).rejects.toThrow();
  });
});
