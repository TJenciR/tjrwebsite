import {
  contentAuditDate,
  cvVerifiedMetadata,
  hiddenMetadata,
  needsConfirmationMetadata,
  source,
  sourcedValue,
  userConfirmedMetadata,
  userConfirmedMetadataFor,
} from "@/lib/content-model";
import type {
  ContentMetadata,
  Project,
  ProjectDates,
  ProjectLifecycleStatus,
  ProjectMedia,
  SourcedValue,
} from "@/types/content-model";

const projectConflictSource = "docs/audit/content-conflicts.md";
const projectQuestionsSource = "docs/audit/questions-for-richard.md#projects";
const legacyOrigin = "https://tjrichard.netlify.app";
const v07BriefMetadata = userConfirmedMetadataFor(
  "User-provided v0.7.0 projects/case-studies brief",
);

const legacyVerifiedMetadata: ContentMetadata = Object.freeze({
  source: source("legacy-website", "docs/audit/content-inventory.md#work-page"),
  verifiedAt: contentAuditDate,
  confidence: "high",
  publicationStatus: "published",
  verificationStatus: "verified",
  internalNote: null,
  requiresConfirmation: false,
});

function undocumented<T>(field: string): SourcedValue<T> {
  return sourcedValue<T>(
    null,
    hiddenMetadata(
      projectQuestionsSource,
      `${field} has not been confirmed by an approved source.`,
    ),
  );
}

function unresolvedExternalUrl(kind: "repository" | "live") {
  return sourcedValue<string>(
    null,
    hiddenMetadata(projectQuestionsSource, `No public ${kind} URL has been confirmed.`),
  );
}

function unknownStatus(note: string) {
  return sourcedValue<ProjectLifecycleStatus>(
    "unknown",
    needsConfirmationMetadata(projectConflictSource, note),
  );
}

interface ProjectSeed {
  id?: string;
  slug: string;
  title: string;
  alternateTitles?: readonly string[];
  technologies: Project["technologies"];
  status: Project["status"];
  categories: readonly string[];
  featured?: boolean;
  pinned?: boolean;
  legacyPath?: string;
  internalNote?: string;
}

function project(seed: ProjectSeed): Project {
  const legacyUrl = seed.legacyPath
    ? sourcedValue(`${legacyOrigin}${seed.legacyPath}`, legacyVerifiedMetadata)
    : undocumented<string>("Legacy project URL");

  return Object.freeze({
    ...userConfirmedMetadata,
    id: seed.id ?? seed.slug,
    slug: seed.slug,
    title: seed.title,
    alternateTitles: seed.alternateTitles ?? [],
    shortDescription: undocumented<string>("Short description"),
    overview: undocumented<string>("Overview"),
    problem: undocumented<string>("Problem"),
    responsibilities: undocumented<readonly string[]>("Responsibilities"),
    process: undocumented<string>("Process"),
    technicalDecisions: undocumented<readonly string[]>("Technical decisions"),
    solution: undocumented<string>("Solution"),
    outcome: undocumented<string>("Outcome"),
    lessonsLearned: undocumented<readonly string[]>("Lessons learned"),
    implementedFunctionality: undocumented<readonly string[]>(
      "Implemented functionality",
    ),
    plannedFunctionality: undocumented<readonly string[]>("Planned functionality"),
    status: seed.status,
    featured: seed.featured ?? false,
    pinned: seed.pinned ?? false,
    dates: undocumented<ProjectDates>("Project dates"),
    technologies: seed.technologies,
    categories: sourcedValue(seed.categories, v07BriefMetadata),
    coverImage: undocumented<ProjectMedia>("Cover image"),
    gallery: undocumented<readonly ProjectMedia[]>("Gallery"),
    architectureDiagram: undocumented<ProjectMedia>("Architecture diagram"),
    repositoryUrl: unresolvedExternalUrl("repository"),
    liveUrl: unresolvedExternalUrl("live"),
    legacyUrl,
    legacyPath: seed.legacyPath ?? null,
    privateProjectNotice: undocumented<string>("Private-project notice"),
    internalNote: seed.internalNote ?? null,
  });
}

export const projects: readonly Project[] = Object.freeze([
  project({
    slug: "repairpass-architecture",
    title: "RepairPass Architecture",
    technologies: sourcedValue(["TypeScript"], v07BriefMetadata),
    status: sourcedValue("work-in-progress", v07BriefMetadata),
    categories: ["Featured"],
    featured: true,
    pinned: true,
    internalNote:
      "Implemented and planned functionality remain separate unpublished fields until each is confirmed.",
  }),
  project({
    slug: "3d-optimal-pathfinder",
    title: "3D Optimal Pathfinder",
    alternateTitles: ["3D Optimal Pathfinding", "Pathfinding"],
    technologies: sourcedValue(["Python"], v07BriefMetadata),
    status: sourcedValue("finished", v07BriefMetadata),
    categories: ["Featured"],
    featured: true,
    pinned: true,
    legacyPath: "/download/pathfinder.zip",
    internalNote:
      "No algorithm benchmark or performance claim is published because none has been verified.",
  }),
  project({
    slug: "online-school-portal",
    title: "Online School Portal",
    technologies: sourcedValue(
      ["HTML", "CSS", "JavaScript", "MySQL"],
      v07BriefMetadata,
    ),
    status: sourcedValue("finished", v07BriefMetadata),
    categories: ["Featured"],
    featured: true,
    pinned: true,
    internalNote:
      "No user count, school-client claim, or deployment-scale claim is published.",
  }),
  project({
    slug: "m4rs",
    title: "M4RS",
    technologies: sourcedValue(["Unreal Engine 4"], cvVerifiedMetadata),
    status: sourcedValue("finished", cvVerifiedMetadata),
    categories: ["Secondary"],
    internalNote:
      "C++ and generated narrative claims are excluded because the CV inventory confirms only Unreal Engine 4.",
  }),
  project({
    slug: "pizza-decorator",
    title: "Pizza Decorator",
    alternateTitles: ["Basic Pizza Decorator"],
    technologies: sourcedValue(["Java", "IntelliJ"], cvVerifiedMetadata),
    status: sourcedValue("finished", cvVerifiedMetadata),
    categories: ["Secondary"],
    legacyPath: "/download/basic_pizza_creator.zip",
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
    status: unknownStatus("No project status is supplied by the CV or live website."),
    categories: ["Secondary"],
    legacyPath: "/download/flower_growth_simulation.zip",
  }),
  project({
    slug: "space-invaders-type-shooter-game",
    title: "Space Invaders Type Shooter Game",
    alternateTitles: ["Space Invaders Type Shooter"],
    technologies: sourcedValue(["Java"], legacyVerifiedMetadata),
    status: sourcedValue("incomplete", {
      ...legacyVerifiedMetadata,
      internalNote: "The live site explicitly labels this incomplete; no newer status is available.",
    }),
    categories: ["Secondary"],
    legacyPath: "/download/space_invaders_v0.1.zip",
  }),
  project({
    slug: "basic-ocr",
    title: "Basic OCR",
    alternateTitles: ["Optical Character Recognition"],
    technologies: sourcedValue(["Python"], legacyVerifiedMetadata),
    status: unknownStatus("Neither the CV inventory nor live website supplies a status."),
    categories: ["Secondary"],
    legacyPath: "/download/optical_character_recognition.zip",
  }),
  project({
    slug: "spam-filter",
    title: "Spam Filter",
    alternateTitles: ["Spam Filtering"],
    technologies: sourcedValue(["Python"], legacyVerifiedMetadata),
    status: unknownStatus("Neither the CV inventory nor live website supplies a status."),
    categories: ["Secondary"],
    legacyPath: "/download/spam_filtering.zip",
  }),
  project({
    slug: "electronic-products-database-form-app",
    title: "Electronic Products Database Form App",
    technologies: sourcedValue(["MSSQL"], cvVerifiedMetadata),
    status: sourcedValue("finished", cvVerifiedMetadata),
    categories: ["Secondary"],
  }),
]);
