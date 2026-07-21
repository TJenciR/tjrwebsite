import { describe, expect, it } from "vitest";

import { siteConfig } from "../src/content/site-config";
import {
  getPublicValue,
  isContentStatus,
} from "../src/lib/content-value";

describe("site configuration", () => {
  it("uses the required uncertainty envelope for every field", () => {
    for (const field of Object.values(siteConfig)) {
      expect(isContentStatus(field.status)).toBe(true);
      expect(field).toHaveProperty("value");
      expect(field).toHaveProperty("verifiedAt");
      expect(field.source.length).toBeGreaterThan(0);
    }
  });

  it("publishes only verified values", () => {
    expect(getPublicValue(siteConfig.name)).toBe("Tököli Jenő-Richard");
    expect(getPublicValue(siteConfig.productionDomain)).toBe(
      "https://jenorichardtokoli.com/",
    );
    expect(getPublicValue(siteConfig.legacyWebsiteUrl)).toBe(
      "https://tjrichard.netlify.app/",
    );
    expect(getPublicValue(siteConfig.draftProfessionalTitle)).toBeNull();
    expect(getPublicValue(siteConfig.sanitizedResumeUrl)).toBeNull();
  });

  it("gives verified values a verification date", () => {
    for (const field of Object.values(siteConfig)) {
      if (field.status === "verified") {
        expect(field.value).not.toBeNull();
        expect(field.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });
});

