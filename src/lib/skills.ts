import { programmingSkills, tools } from "@/content/skills";
import type {
  ProgrammingSkill,
  SkillProficiencyBand,
  Tool,
} from "@/types/content-model";

export interface SkillDisplayItem {
  readonly evidenceProjectSlugs: readonly string[];
  readonly id: string;
  readonly name: string;
  readonly proficiency: SkillProficiencyBand;
}

export interface SkillGroup {
  readonly description: string;
  readonly id:
    | "more-proficient"
    | "additional-programming"
    | "web"
    | "databases"
    | "tools"
    | "game-simulation";
  readonly items: readonly SkillDisplayItem[];
  readonly title: string;
}

function fromSkill(skill: ProgrammingSkill): SkillDisplayItem {
  return {
    id: skill.id,
    name: skill.name,
    proficiency: skill.proficiency,
    evidenceProjectSlugs: skill.evidenceProjectSlugs,
  };
}

function fromTool(tool: Tool): SkillDisplayItem {
  return {
    id: tool.id,
    name: tool.name,
    proficiency: "worked-with",
    evidenceProjectSlugs: tool.evidenceProjectSlugs,
  };
}

function selectSkills(ids: readonly string[]): readonly SkillDisplayItem[] {
  return ids.map((id) => {
    const skill = programmingSkills.find((entry) => entry.id === id);
    if (!skill) {
      throw new Error(`Unknown programming skill in display group: ${id}`);
    }
    return fromSkill(skill);
  });
}

function selectTools(ids: readonly string[]): readonly SkillDisplayItem[] {
  return ids.map((id) => {
    const tool = tools.find((entry) => entry.id === id);
    if (!tool) {
      throw new Error(`Unknown tool in display group: ${id}`);
    }
    return fromTool(tool);
  });
}

export const skillGroups: readonly SkillGroup[] = Object.freeze([
  {
    id: "more-proficient",
    title: "More proficient programming languages",
    description: "The stronger programming languages recorded by the CV.",
    items: selectSkills(["cpp", "java", "python"]),
  },
  {
    id: "additional-programming",
    title: "Additional programming languages",
    description: "Additional languages previously worked with.",
    items: selectSkills(["c", "csharp", "assembly", "bash"]),
  },
  {
    id: "web",
    title: "Web technologies",
    description: "Web technologies previously worked with.",
    items: selectSkills(["javascript", "typescript", "html", "css"]),
  },
  {
    id: "databases",
    title: "Databases",
    description: "Database technologies previously worked with.",
    items: selectSkills(["mssql", "mysql"]),
  },
  {
    id: "tools",
    title: "Tools and IDEs",
    description: "Development and numerical-computing tools recorded by the CV.",
    items: [...selectTools(["intellij-idea"]), ...selectSkills(["matlab"])],
  },
  {
    id: "game-simulation",
    title: "Game and simulation tools",
    description: "Game technology supported by project evidence.",
    items: selectTools(["unreal-engine-4"]),
  },
]);
