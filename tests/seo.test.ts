import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { createRobotsPolicy } from "@/app/robots";
import sitemap from "@/app/sitemap";
import { projects } from "@/content/projects";
import { resumeMetadata } from "@/content/profile";
import { createPageMetadata, getCanonicalUrl } from "@/lib/seo";
import {
  createBreadcrumbStructuredData,
  createSiteStructuredData,
} from "@/lib/structured-data";

const canonicalOrigin = "https://jenorichardtokoli.com";

describe("canonical SEO metadata", () => {
  it("never derives canonical or sharing URLs from a Vercel preview", () => {
    const metadata = createPageMetadata({
      description: "Verified project inventory.",
      path: "/work",
      title: "Projects",
    });

    expect(metadata.alternates?.canonical).toBe(`${canonicalOrigin}/work`);
    expect(metadata.openGraph?.url).toBe(`${canonicalOrigin}/work`);
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({ url: `${canonicalOrigin}/opengraph-image` }),
    ]);
    expect(JSON.stringify(metadata)).not.toContain("vercel.app");
  });

  it("uses the canonical production hostname for résumé and project sharing", () => {
    expect(getCanonicalUrl("/resume")).toBe(`${canonicalOrigin}/resume`);
    for (const project of projects) {
      expect(getCanonicalUrl(`/work/${project.slug}`)).toBe(
        `${canonicalOrigin}/work/${project.slug}`,
      );
    }
  });

  it("uses a normal social-image route so file metadata cannot inject a preview URL", () => {
    expect(existsSync(resolve(process.cwd(), "src/app/opengraph-image.tsx"))).toBe(false);
    expect(existsSync(resolve(process.cwd(), "src/app/opengraph-image/route.tsx"))).toBe(true);
  });
});

describe("sitemap and robots", () => {
  it("lists public pages and every project at canonical production URLs", () => {
    const entries = sitemap();
    const urls = entries.map(({ url }) => url);

    expect(entries).toHaveLength(11 + projects.length);
    expect(urls).toContain(`${canonicalOrigin}/`);
    expect(urls).toContain(`${canonicalOrigin}/resume`);
    expect(urls).not.toContain(`${canonicalOrigin}/design-system`);
    expect(urls.every((url) => url.startsWith(canonicalOrigin))).toBe(true);
    for (const project of projects) {
      expect(urls).toContain(`${canonicalOrigin}/work/${project.slug}`);
    }
  });

  it("blocks previews while publishing the canonical sitemap reference", () => {
    const preview = createRobotsPolicy({ VERCEL_ENV: "preview" });
    const production = createRobotsPolicy({ VERCEL_ENV: "production" });

    expect(preview.rules).toEqual({ userAgent: "*", disallow: "/" });
    expect(production.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(preview.sitemap).toBe(`${canonicalOrigin}/sitemap.xml`);
    expect(production.host).toBe(canonicalOrigin);
  });
});

describe("structured data", () => {
  it("publishes only accurate Person and WebSite fields", () => {
    const serialized = JSON.stringify(createSiteStructuredData());

    expect(serialized).toContain('"@type":"Person"');
    expect(serialized).toContain('"@type":"WebSite"');
    expect(serialized).toContain(canonicalOrigin);
    expect(serialized).not.toMatch(/email|telephone|jobTitle|worksFor|alumniOf|award|rating|review/i);
    expect(serialized).not.toContain("vercel.app");
  });

  it("creates canonical project breadcrumbs", () => {
    const breadcrumb = createBreadcrumbStructuredData([
      { name: "Overview", path: "/" },
      { name: "Projects", path: "/work" },
      { name: "Example", path: "/work/example" },
    ]);
    const serialized = JSON.stringify(breadcrumb);

    expect(serialized).toContain('"@type":"BreadcrumbList"');
    expect(serialized).toContain(`${canonicalOrigin}/work/example`);
  });

  it("scrubs less-than characters before JSON-LD is injected", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/seo/json-ld.tsx"),
      "utf8",
    );

    expect(source).toContain('replaceAll("<", "\\\\u003c")');
  });
});

describe("résumé privacy", () => {
  it("publishes only the sanitized web résumé state", () => {
    const publicFiles = readdirSync(resolve(process.cwd(), "public"), {
      recursive: true,
    }).map(String);

    expect(resumeMetadata.publicPath).toBeNull();
    expect(resumeMetadata.documentState).toBe("future-sanitized-document");
    expect(publicFiles.some((path) => path.toLowerCase().endsWith(".pdf"))).toBe(false);
  });
});
