import {
  contentAuditDate,
  cvVerifiedMetadata,
  hiddenMetadata,
  needsConfirmationMetadata,
  source,
  sourcedValue,
  userConfirmedMetadata,
} from "@/lib/content-model";
import type {
  ContentMetadata,
  Project,
  ProjectLifecycleStatus,
} from "@/types/content-model";

const projectConflictSource = "docs/audit/content-conflicts.md";

const legacyVerifiedMetadata: ContentMetadata = Object.freeze({
  source: source("legacy-website", "docs/audit/content-inventory.md#work-page"),
  verifiedAt: contentAuditDate,
  confidence: "high",
  publicationStatus: "published",
  verificationStatus: "verified",
  internalNote: null,
  requiresConfirmation: false,
});

function unresolvedSummary(note = "No source-approved description or outcome is available.") {
  return sourcedValue<string>(null, hiddenMetadata(projectConflictSource, note));
}

function unresolvedExternalUrl(kind: "repository" | "live demo") {
  return sourcedValue<string>(
    null,
    hiddenMetadata(
      "docs/audit/questions-for-richard.md#projects",
      `No public ${kind} URL has been confirmed.`,
    ),
  );
}

function unknownStatus(note: string) {
  return sourcedValue<ProjectLifecycleStatus>(
    "unknown",
    needsConfirmationMetadata(projectConflictSource, note),
  );
}

interface ProjectSeed {
  slug: string;
  title: string;
  alternateTitles?: readonly string[];
  technologies: Project["technologies"];
  lifecycleStatus: Project["lifecycleStatus"];
  legacyDownloadPath?: string;
  internalNote?: string;
}

function project(seed: ProjectSeed): Project {
  return Object.freeze({
    ...userConfirmedMetadata,
    slug: seed.slug,
    title: seed.title,
    alternateTitles: seed.alternateTitles ?? [],
    summary: unresolvedSummary(),
    technologies: seed.technologies,
    lifecycleStatus: seed.lifecycleStatus,
    repositoryUrl: unresolvedExternalUrl("repository"),
    liveDemoUrl: unresolvedExternalUrl("live demo"),
    legacyDownloadPath: seed.legacyDownloadPath ?? null,
    mediaAssetIds: [],
    internalNote: seed.internalNote ?? null,
  });
}

export const projects: readonly Project[] = Object.freeze([
  project({
    slug: "repairpass-architecture",
    title: "RepairPass Architecture",
    technologies: sourcedValue(["TypeScript"], cvVerifiedMetadata),
    lifecycleStatus: sourcedValue(
      "work-in-progress",
      needsConfirmationMetadata(
        projectConflictSource,
        "CV and newer repository material align on work-in-progress, but the audit requires confirmation before publication.",
        "repository-verified",
      ),
    ),
    internalNote: "Conflicting generated scope and stack claims are excluded; only TypeScript and work-in-progress are retained.",
  }),
  project({
    slug: "3d-optimal-pathfinder",
    title: "3D Optimal Pathfinder",
    alternateTitles: ["3D Optimal Pathfinding"],
    technologies: sourcedValue(["Python"], cvVerifiedMetadata),
    lifecycleStatus: sourcedValue("finished", cvVerifiedMetadata),
    legacyDownloadPath: "/download/pathfinder.zip",
    internalNote: "The v0.5 brief supplies the canonical title; legacy and CV title variants remain recorded.",
  }),
  project({
    slug: "online-school-portal",
    title: "Online School Portal",
    technologies: sourcedValue(
      ["HTML", "CSS", "JavaScript", "MySQL"],
      cvVerifiedMetadata,
    ),
    lifecycleStatus: sourcedValue("finished", cvVerifiedMetadata),
  }),
  project({
    slug: "m4rs",
    title: "M4RS",
    technologies: sourcedValue(["Unreal Engine 4"], cvVerifiedMetadata),
    lifecycleStatus: sourcedValue("finished", cvVerifiedMetadata),
    internalNote: "C++ and generated narrative claims are excluded because the CV inventory confirms only Unreal Engine 4.",
  }),
  project({
    slug: "pizza-decorator",
    title: "Pizza Decorator",
    alternateTitles: ["Basic Pizza Decorator"],
    technologies: sourcedValue(["Java", "IntelliJ"], cvVerifiedMetadata),
    lifecycleStatus: sourcedValue("finished", cvVerifiedMetadata),
    legacyDownloadPath: "/download/basic_pizza_creator.zip",
    internalNote: "The v0.5 brief supplies the canonical title; the legacy title remains an alias.",
  }),
  project({
    slug: "flower-growth-simulator",
    title: "Flower Growth Simulator",
    technologies: sourcedValue(
      ["Java"],
      needsConfirmationMetadata(
        projectConflictSource,
        "Java is the legacy-site category but is not specified by the CV inventory.",
        "legacy-website",
      ),
    ),
    lifecycleStatus: unknownStatus("No project status is supplied by the CV or live website."),
    legacyDownloadPath: "/download/flower_growth_simulation.zip",
  }),
  project({
    slug: "space-invaders-type-shooter-game",
    title: "Space Invaders Type Shooter Game",
    alternateTitles: ["Space Invaders Type Shooter"],
    technologies: sourcedValue(["Java"], legacyVerifiedMetadata),
    lifecycleStatus: sourcedValue("incomplete", {
      ...legacyVerifiedMetadata,
      internalNote: "The live site explicitly labels this incomplete; no newer status is available.",
    }),
    legacyDownloadPath: "/download/space_invaders_v0.1.zip",
  }),
  project({
    slug: "basic-ocr",
    title: "Basic OCR",
    alternateTitles: ["Optical Character Recognition"],
    technologies: sourcedValue(["Python"], legacyVerifiedMetadata),
    lifecycleStatus: unknownStatus("Neither the CV inventory nor live website supplies a status."),
    legacyDownloadPath: "/download/optical_character_recognition.zip",
    internalNote: "The v0.5 brief supplies the canonical title; the expanded legacy title remains an alias.",
  }),
  project({
    slug: "spam-filter",
    title: "Spam Filter",
    alternateTitles: ["Spam Filtering"],
    technologies: sourcedValue(["Python"], legacyVerifiedMetadata),
    lifecycleStatus: unknownStatus("Neither the CV inventory nor live website supplies a status."),
    legacyDownloadPath: "/download/spam_filtering.zip",
    internalNote: "The v0.5 brief supplies the canonical title; the legacy title remains an alias.",
  }),
  project({
    slug: "electronic-products-database-form-app",
    title: "Electronic Products Database Form App",
    technologies: sourcedValue(["MSSQL"], cvVerifiedMetadata),
    lifecycleStatus: sourcedValue("finished", cvVerifiedMetadata),
  }),
]);
