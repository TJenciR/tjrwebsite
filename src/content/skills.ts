import {
  cvVerifiedMetadata,
  needsConfirmationMetadata,
} from "@/lib/content-model";
import type {
  CommunicationLanguage,
  ProgrammingSkill,
  SkillKind,
  SkillProficiencyBand,
  Tool,
} from "@/types/content-model";

function skill(
  id: string,
  name: string,
  kind: SkillKind,
  proficiency: SkillProficiencyBand,
  evidenceProjectSlugs: readonly string[] = [],
): ProgrammingSkill {
  return Object.freeze({
    ...cvVerifiedMetadata,
    id,
    name,
    kind,
    proficiency,
    evidenceProjectSlugs,
  });
}

export const programmingSkills: readonly ProgrammingSkill[] = Object.freeze([
  skill("cpp", "C++", "programming-language", "more-proficient"),
  skill("java", "Java", "programming-language", "more-proficient", [
    "pizza-decorator",
  ]),
  skill("python", "Python", "programming-language", "more-proficient", [
    "3d-optimal-pathfinder",
    "basic-ocr",
    "spam-filter",
  ]),
  skill("c", "C", "programming-language", "worked-with"),
  skill("csharp", "C#", "programming-language", "worked-with"),
  skill("assembly", "Assembly", "assembly-language", "worked-with"),
  skill("bash", "Bash", "scripting-language", "worked-with"),
  skill("javascript", "JavaScript", "programming-language", "worked-with", [
    "online-school-portal",
  ]),
  skill("typescript", "TypeScript", "programming-language", "worked-with", [
    "repairpass-architecture",
  ]),
  skill("mssql", "MSSQL", "database", "worked-with", [
    "electronic-products-database-form-app",
  ]),
  skill("mysql", "MySQL", "database", "worked-with", ["online-school-portal"]),
  skill("matlab", "MATLAB", "numerical-computing", "worked-with"),
  skill("html", "HTML", "markup", "worked-with", ["online-school-portal"]),
  skill("css", "CSS", "stylesheet", "worked-with", ["online-school-portal"]),
]);

export const tools: readonly Tool[] = Object.freeze([
  {
    ...cvVerifiedMetadata,
    id: "unreal-engine-4",
    name: "Unreal Engine 4",
    evidenceProjectSlugs: ["m4rs"],
  },
  {
    ...cvVerifiedMetadata,
    id: "intellij-idea",
    name: "IntelliJ",
    evidenceProjectSlugs: ["pizza-decorator"],
  },
]);

export const communicationLanguages: readonly CommunicationLanguage[] = Object.freeze([
  {
    ...cvVerifiedMetadata,
    id: "hungarian",
    name: "Hungarian",
    level: "native",
  },
  {
    ...cvVerifiedMetadata,
    id: "english",
    name: "English",
    level: "full-professional",
  },
  {
    ...needsConfirmationMetadata(
      "docs/audit/content-conflicts.md#content-conflicts",
      "The CV says limited working while one concept says fluent; keep the CV value internal until confirmed.",
      "cv",
    ),
    id: "romanian",
    name: "Romanian",
    level: "limited-working",
  },
  {
    ...cvVerifiedMetadata,
    id: "german",
    name: "German",
    level: "elementary",
    internalNote: "CV-newer terminology retained; preferred public wording can still be refined.",
  },
]);
