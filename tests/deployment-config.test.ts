import { describe, expect, it } from "vitest";

import { configuredRedirects } from "@/config/redirects";
import { baseSecurityHeaders, getSecurityHeaders } from "@/config/security-headers";
import { legacyDownloadRedirects } from "@/content/legacy-routes";
import {
  getRetiredLegacyDocument,
  headRetiredLegacyDocument,
} from "@/lib/retired-legacy-document";

describe("security headers", () => {
  it("sets documented baseline protections without restrictive fetch directives", () => {
    const headers = Object.fromEntries(baseSecurityHeaders.map(({ key, value }) => [key, value]));

    expect(headers["Content-Security-Policy"]).toBe(
      "base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'",
    );
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
    expect(headers["Content-Security-Policy"]).not.toMatch(/script-src|style-src|img-src|font-src|connect-src/);
  });

  it("adds defense-in-depth noindex headers only outside production", () => {
    expect(getSecurityHeaders({ VERCEL_ENV: "preview" })).toContainEqual({
      key: "X-Robots-Tag",
      value: "noindex, nofollow, noarchive",
    });
    expect(getSecurityHeaders({ VERCEL_ENV: "production" }))
      .not.toContainEqual(expect.objectContaining({ key: "X-Robots-Tag" }));
  });
});

describe("preferred host and legacy redirects", () => {
  it("normalizes www and legacy aliases in one permanent redirect", () => {
    expect(configuredRedirects).toContainEqual({
      destination: "https://jenorichardtokoli.com/about",
      has: [{ type: "host", value: "www.jenorichardtokoli.com" }],
      permanent: true,
      source: "/about.html",
    });
    expect(configuredRedirects).toContainEqual({
      destination: "https://jenorichardtokoli.com/:path*",
      has: [{ type: "host", value: "www.jenorichardtokoli.com" }],
      permanent: true,
      source: "/:path*",
    });
    expect(configuredRedirects).toContainEqual({
      destination: "/resume",
      permanent: true,
      source: "/CV.pdf",
    });
  });

  it("keeps all six downloads on a one-hop temporary Netlify fallback", () => {
    for (const legacyDownload of legacyDownloadRedirects) {
      expect(configuredRedirects).toContainEqual({
        ...legacyDownload,
        permanent: false,
      });
    }
  });
});

describe("retired qualification documents", () => {
  it("returns explicit non-indexable 410 responses", async () => {
    const response = getRetiredLegacyDocument();
    const headResponse = headRetiredLegacyDocument();

    expect(response.status).toBe(410);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, noarchive");
    expect(await response.text()).not.toMatch(/@|telephone|phone/i);
    expect(headResponse.status).toBe(410);
    expect(await headResponse.text()).toBe("");
  });
});
