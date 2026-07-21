import { describe, expect, it } from "vitest";

import { legacyProjects } from "../src/content/legacy-content";
import { projects } from "../src/content/projects";
import {
  legacyAliases,
  legacyDownloadRedirects,
  legacyPageRoutes,
  legacyPermanentRedirects,
  legacySensitiveAssets,
  legacyWebsiteOrigin,
} from "../src/content/legacy-routes";

describe("legacy route contract", () => {
  it("keeps every indexed page route", () => {
    expect(legacyPageRoutes).toEqual(["/", "/about", "/work", "/documents"]);
  });

  it("maps every html alias to its extensionless route", () => {
    expect(legacyAliases).toEqual([
      { source: "/about.html", destination: "/about" },
      { source: "/work.html", destination: "/work" },
      { source: "/documents.html", destination: "/documents" },
    ]);
  });

  it("temporarily maps all six public project downloads to Netlify", () => {
    expect(legacyDownloadRedirects).toHaveLength(6);

    for (const route of legacyDownloadRedirects) {
      expect(route.destination).toBe(`${legacyWebsiteOrigin}${route.source}`);
    }
  });

  it("maps every legacy project download to a current project record", () => {
    expect(legacyProjects).toHaveLength(6);

    for (const legacyProject of legacyProjects) {
      const migratedProject = projects.find(
        ({ legacyPath }) => legacyPath === legacyProject.downloadPath,
      );
      expect(migratedProject, legacyProject.name).toBeDefined();
      expect(migratedProject?.legacyUrl.value).toBe(
        `${legacyWebsiteOrigin}${legacyProject.downloadPath}`,
      );
    }
  });

  it("gives every sensitive PDF an explicit privacy-safe disposition", () => {
    expect(legacySensitiveAssets).toHaveLength(5);
    expect(legacyPermanentRedirects).toEqual([
      { source: "/CV.pdf", destination: "/resume" },
    ]);
    expect(legacySensitiveAssets).toEqual([
      { path: "/CV.pdf", migrationState: "permanent-redirect", destination: "/resume" },
      { path: "/bacdipl.pdf", migrationState: "intentional-410", destination: null },
      { path: "/engling.pdf", migrationState: "intentional-410", destination: null },
      { path: "/certcomp.pdf", migrationState: "intentional-410", destination: null },
      { path: "/ateprof.pdf", migrationState: "intentional-410", destination: null },
    ]);
  });
});

