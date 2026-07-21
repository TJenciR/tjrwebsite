import { describe, expect, it } from "vitest";

import { siteConfig } from "@/content/site-config";
import {
  getCanonicalProductionOrigin,
  getRuntimeOrigin,
  isIndexableDeployment,
} from "@/lib/site-origin";

describe("deployment origin policy", () => {
  it("stores canonical production and legacy Netlify origins separately", () => {
    expect(getCanonicalProductionOrigin().origin).toBe("https://jenorichardtokoli.com");
    expect(siteConfig.productionDomain.status).toBe("verified");
    expect(siteConfig.legacyWebsiteUrl.value).toBe("https://tjrichard.netlify.app/");
    expect(siteConfig.productionDomain.value).not.toBe(siteConfig.legacyWebsiteUrl.value);
  });

  it("uses the actual Vercel preview URL without making it canonical or indexable", () => {
    const environment = {
      NODE_ENV: "production",
      VERCEL_ENV: "preview",
      VERCEL_URL: "portfolio-git-shell-example.vercel.app",
    } as const;

    expect(getRuntimeOrigin(environment).origin).toBe(
      "https://portfolio-git-shell-example.vercel.app",
    );
    expect(isIndexableDeployment(environment)).toBe(false);
    expect(getCanonicalProductionOrigin().origin).toBe("https://jenorichardtokoli.com");
  });

  it("uses the canonical origin only for the production deployment", () => {
    const environment = {
      NODE_ENV: "production",
      VERCEL_ENV: "production",
      VERCEL_URL: "portfolio-production.vercel.app",
    } as const;

    expect(getRuntimeOrigin(environment).origin).toBe("https://jenorichardtokoli.com");
    expect(isIndexableDeployment(environment)).toBe(true);
  });
});
