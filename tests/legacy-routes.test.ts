import { describe, expect, it } from "vitest";

import {
  legacyAliases,
  legacyDownloadRedirects,
  legacyPageRoutes,
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

  it("keeps sensitive PDFs out of the new public tree", () => {
    expect(legacySensitiveAssets).toHaveLength(5);
    expect(legacySensitiveAssets.every((asset) => asset.migrationState === "legacy-only")).toBe(true);
  });
});

