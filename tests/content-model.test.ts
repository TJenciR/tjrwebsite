import { describe, expect, it } from "vitest";

import { education } from "@/content/education";
import { portfolioContent } from "@/content/portfolio";
import { projects } from "@/content/projects";
import { programmingSkills } from "@/content/skills";
import { socials } from "@/content/socials";
import { toContentValue } from "@/lib/content-model";
import { validatePortfolioContent } from "@/lib/content-validator";
import {
  sourcePrecedence,
  type PortfolioContentModel,
} from "@/types/content-model";

function withProjects(nextProjects: unknown[]): PortfolioContentModel {
  return {
    ...portfolioContent,
    projects: nextProjects,
  } as unknown as PortfolioContentModel;
}

describe("verified portfolio content", () => {
  it("passes the runtime content validator", () => {
    expect(validatePortfolioContent(portfolioContent)).toEqual([]);
  });

  it("uses the documented source precedence", () => {
    expect(sourcePrecedence).toEqual({
      "user-confirmed": 1,
      "repository-verified": 2,
      cv: 3,
      "legacy-website": 4,
      placeholder: 5,
    });
  });

  it("does not expose a source-backed fact while its publication state is draft", () => {
    const auditedFacebook = socials.find(({ platform }) => platform === "facebook");
    expect(auditedFacebook).toBeDefined();
    if (auditedFacebook) {
      expect(toContentValue(auditedFacebook.url, auditedFacebook).status).toBe(
        "needs-confirmation",
      );
    }
  });

  it("seeds the exact known project titles without generated summaries", () => {
    expect(projects.map(({ title }) => title)).toEqual([
      "RepairPass Architecture",
      "3D Optimal Pathfinder",
      "Online School Portal",
      "M4RS",
      "Pizza Decorator",
      "Flower Growth Simulator",
      "Space Invaders Type Shooter Game",
      "Basic OCR",
      "Spam Filter",
      "Electronic Products Database Form App",
    ]);
    expect(projects.every(({ summary }) => summary.value === null)).toBe(true);
  });

  it("retains only source-backed project technologies and statuses", () => {
    const repairPass = projects.find(({ slug }) => slug === "repairpass-architecture");
    const pathfinder = projects.find(({ slug }) => slug === "3d-optimal-pathfinder");
    const flower = projects.find(({ slug }) => slug === "flower-growth-simulator");

    expect(repairPass?.technologies.value).toEqual(["TypeScript"]);
    expect(repairPass?.lifecycleStatus.value).toBe("work-in-progress");
    expect(repairPass?.lifecycleStatus.requiresConfirmation).toBe(true);
    expect(pathfinder?.technologies.value).toEqual(["Python"]);
    expect(pathfinder?.lifecycleStatus.value).toBe("finished");
    expect(flower?.lifecycleStatus.value).toBe("unknown");
    expect(flower?.lifecycleStatus.requiresConfirmation).toBe(true);
  });

  it("uses categorical skill bands and project evidence instead of percentages", () => {
    const stronger = programmingSkills
      .filter(({ proficiency }) => proficiency === "more-proficient")
      .map(({ name }) => name);
    const typescript = programmingSkills.find(({ id }) => id === "typescript");

    expect(stronger).toEqual(["C++", "Java", "Python"]);
    expect(typescript?.proficiency).toBe("worked-with");
    expect(typescript?.evidenceProjectSlugs).toContain("repairpass-architecture");
    expect(programmingSkills.some((entry) => "percentage" in entry)).toBe(false);
  });

  it("keeps university status unresolved instead of treating an old Present label as current", () => {
    const university = education.find(({ id }) => id === "babes-bolyai-university");

    expect(university?.status.value).toBe("unknown");
    expect(university?.status.verificationStatus).toBe("needs-confirmation");
    expect(university?.status.requiresConfirmation).toBe(true);
    expect(university?.endDate.value).toBeNull();
  });
});

describe("content validation failures", () => {
  it("rejects duplicate project slugs", () => {
    const duplicate = { ...projects[1] };
    const issues = validatePortfolioContent(withProjects([...projects, duplicate]));

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate-project-slug" }),
      ]),
    );
  });

  it("rejects missing project titles", () => {
    const missingTitle = { ...projects[0], title: " " };
    const issues = validatePortfolioContent(withProjects([missingTitle, ...projects.slice(1)]));

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "missing-project-title" }),
      ]),
    );
  });

  it("rejects invalid lifecycle and publication statuses", () => {
    const invalidStatus = {
      ...projects[0],
      publicationStatus: "public-now",
      lifecycleStatus: {
        ...projects[0].lifecycleStatus,
        value: "abandoned",
      },
    };
    const issues = validatePortfolioContent(withProjects([invalidStatus, ...projects.slice(1)]));

    expect(issues.filter(({ code }) => code === "invalid-status").length).toBeGreaterThanOrEqual(2);
  });

  it("rejects invalid external URLs", () => {
    const invalidUrl = {
      ...projects[0],
      repositoryUrl: {
        ...projects[0].repositoryUrl,
        value: "javascript:alert(1)",
      },
    };
    const issues = validatePortfolioContent(withProjects([invalidUrl, ...projects.slice(1)]));

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-external-url" }),
      ]),
    );
  });

  it("rejects accidental private contact fields", () => {
    const unsafeContent = {
      ...portfolioContent,
      contact: {
        ...portfolioContent.contact,
        privateEmail: "redacted",
      },
    };
    const issues = validatePortfolioContent(unsafeContent);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "private-contact-data" }),
      ]),
    );
  });

  it("rejects content marked verified when confirmation is still required", () => {
    const inconsistentProject = {
      ...projects[0],
      publicationStatus: "published",
      verificationStatus: "verified",
      verifiedAt: null,
      requiresConfirmation: true,
    };
    const issues = validatePortfolioContent(
      withProjects([inconsistentProject, ...projects.slice(1)]),
    );

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "unverified-content-published" }),
      ]),
    );
  });
});
