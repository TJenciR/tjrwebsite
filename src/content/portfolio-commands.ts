import { contactAccessCopy } from "@/content/contact";
import { education } from "@/content/education";
import { hobbies } from "@/content/hobbies";
import { currentActivities } from "@/content/now";
import { projects } from "@/content/projects";
import {
  communicationLanguages,
  programmingSkills,
  tools,
} from "@/content/skills";
import {
  formatCommunicationLevel,
  formatProjectStatus,
  getPublishedEntries,
  getPublishedValue,
  isPublishedContent,
} from "@/lib/public-content";
import type { PortfolioCommand } from "@/types/portfolio-command";

function joinList(values: readonly string[]): string {
  if (values.length <= 1) {
    return values[0] ?? "";
  }
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function projectBySlug(slug: string) {
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) {
    throw new Error(`Missing project for portfolio command: ${slug}`);
  }
  return project;
}

function projectResponse(slug: string): string {
  const project = projectBySlug(slug);
  const technologies = getPublishedValue(project.technologies) ?? [];
  const status = getPublishedValue(project.status);
  const technologyCopy = technologies.length > 0
    ? ` It lists ${joinList(technologies)}.`
    : "";
  const statusCopy = status ? ` Its verified status is ${formatProjectStatus(status).toLowerCase()}.` : "";
  return `Open Richard’s verified project record for ${project.title}.${technologyCopy}${statusCopy}`;
}

const strongerLanguages = getPublishedEntries(programmingSkills)
  .filter(({ proficiency }) => proficiency === "more-proficient")
  .map(({ name }) => name);
const toolNames = getPublishedEntries(tools)
  .map(({ name }) => name)
  .sort((left, right) => left.localeCompare(right));
const spokenLanguages = getPublishedEntries(communicationLanguages)
  .map(({ name, level }) => `${name} (${formatCommunicationLevel(level).toLowerCase()})`);
const educationInstitutions = education
  .map(({ institution }) => getPublishedValue(institution))
  .filter((institution): institution is string => institution !== null);
const hobbyNames = getPublishedEntries(hobbies).map(({ name }) => name);
const currentProjectActivity = currentActivities.find(
  (activity) => activity.kind === "currently-building" && isPublishedContent(activity),
);

function command(entry: PortfolioCommand): PortfolioCommand {
  return Object.freeze({ ...entry, synonyms: Object.freeze([...entry.synonyms]) });
}

export const portfolioCommands: readonly PortfolioCommand[] = Object.freeze([
  command({
    id: "featured-projects",
    label: "Show featured projects",
    synonyms: ["featured projects", "best projects", "strongest projects"],
    response: "Here are Richard’s featured project records.",
    action: { kind: "navigate", href: "/work?category=Featured" },
    icon: "pin",
    starter: true,
  }),
  command({
    id: "all-projects",
    label: "Show all projects",
    synonyms: ["all projects", "browse projects", "view all projects", "projects"],
    response: `Here are all ${projects.length} project records in Richard’s portfolio.`,
    action: { kind: "navigate", href: "/work" },
    icon: "projects",
    starter: true,
  }),
  ...(["TypeScript", "Python", "Java"] as const).map((technology) => command({
    id: `${technology.toLocaleLowerCase()}-projects` as "typescript-projects" | "python-projects" | "java-projects",
    label: `Show ${technology} projects`,
    synonyms: [`${technology} projects`, `projects using ${technology}`, `show me ${technology} projects`],
    response: `Here are Richard’s projects that use ${technology}.`,
    action: { kind: "navigate", href: `/work?technology=${technology}` },
    icon: "code",
    starter: technology === "Python",
  })),
  command({
    id: "c-family-projects",
    label: "Show C or C++ projects",
    synonyms: ["c projects", "c++ projects", "cpp projects", "c or c++ projects", "projects using c++"],
    response: "No verified project record currently lists C or C++; the Skills page records both as technologies Richard has worked with.",
    action: { kind: "navigate", href: "/skills#skill-group-more-proficient" },
    icon: "code",
    starter: false,
  }),
  command({
    id: "database-projects",
    label: "Show database projects",
    synonyms: ["database projects", "sql projects", "mysql projects", "mssql projects"],
    response: "Here are Richard’s projects with verified SQL database technologies.",
    action: { kind: "navigate", href: "/work?q=SQL" },
    icon: "projects",
    starter: false,
  }),
  command({
    id: "repairpass",
    label: "Tell me about RepairPass",
    synonyms: ["repairpass", "repair pass", "about repairpass", "open repairpass"],
    fuzzyProjectTerms: ["repairpass", "repairpass architecture"],
    response: projectResponse("repairpass-architecture"),
    action: { kind: "navigate", href: "/work/repairpass-architecture" },
    icon: "projects",
    starter: true,
  }),
  command({
    id: "pathfinder",
    label: "Tell me about the 3D Optimal Pathfinder",
    synonyms: ["3d optimal pathfinder", "3d optimal pathfinding", "pathfinder", "pathfinding project"],
    fuzzyProjectTerms: ["3d optimal pathfinder", "3d optimal pathfinding", "pathfinder"],
    response: projectResponse("3d-optimal-pathfinder"),
    action: { kind: "navigate", href: "/work/3d-optimal-pathfinder" },
    icon: "projects",
    starter: false,
  }),
  command({
    id: "online-school-portal",
    label: "Tell me about the Online School Portal",
    synonyms: ["online school portal", "school portal", "about online school portal"],
    fuzzyProjectTerms: ["online school portal", "school portal"],
    response: projectResponse("online-school-portal"),
    action: { kind: "navigate", href: "/work/online-school-portal" },
    icon: "projects",
    starter: false,
  }),
  command({
    id: "current-project",
    label: "What is Richard currently building?",
    synonyms: ["currently building", "current project", "what is richard building", "now"],
    response: currentProjectActivity?.title
      ? `Richard is currently building ${currentProjectActivity.title}. It remains documented as work in progress.`
      : "No current project is published.",
    action: { kind: "navigate", href: "/now" },
    icon: "timer",
    starter: true,
  }),
  command({
    id: "strongest-languages",
    label: "What are Richard’s strongest languages?",
    synonyms: ["strongest languages", "best programming languages", "strong programming languages", "core stack"],
    response: `Richard’s stronger programming languages are ${joinList(strongerLanguages)}.`,
    action: { kind: "navigate", href: "/skills#skill-group-more-proficient" },
    icon: "terminal",
    starter: true,
  }),
  command({
    id: "tools",
    label: "Which tools has Richard used?",
    synonyms: ["tools", "tools used", "ides", "development tools"],
    response: `Richard’s verified tool inventory includes ${joinList(toolNames)}.`,
    action: { kind: "navigate", href: "/skills#skill-group-tools" },
    icon: "wrench",
    starter: false,
  }),
  command({
    id: "communication-languages",
    label: "Which human languages does Richard speak?",
    synonyms: ["human languages", "spoken languages", "communication languages", "languages richard speaks"],
    response: `Richard’s communication languages are ${joinList(spokenLanguages)}.`,
    action: { kind: "navigate", href: "/skills#communication-languages" },
    icon: "globe",
    starter: false,
  }),
  command({
    id: "education",
    label: "Show Richard’s education",
    synonyms: ["education", "academic background", "schools", "university"],
    response: `Richard’s education record includes ${joinList(educationInstitutions)}; university completion remains unconfirmed.`,
    action: { kind: "navigate", href: "/education" },
    icon: "graduation",
    starter: false,
  }),
  command({
    id: "hobbies",
    label: "Show Richard’s hobbies",
    synonyms: ["hobbies", "interests", "personal interests"],
    response: `Richard’s verified hobbies are ${joinList(hobbyNames)}.`,
    action: { kind: "navigate", href: "/hobbies" },
    icon: "gamepad",
    starter: false,
  }),
  command({
    id: "resume",
    label: "Open the résumé",
    synonyms: ["resume", "cv", "open resume", "view resume"],
    response: "Open Richard’s privacy-safe web résumé. No private contact details are included.",
    action: { kind: "navigate", href: "/resume" },
    icon: "document",
    starter: false,
  }),
  command({
    id: "contact-access",
    label: "Request contact access",
    synonyms: ["contact access", "contact richard", "request contact", "get in touch"],
    response: `${contactAccessCopy.heading}. ${contactAccessCopy.body}`,
    action: { kind: "navigate", href: "/contact-access" },
    icon: "lock",
    starter: false,
  }),
  command({
    id: "about",
    label: "About Richard",
    synonyms: ["about", "about richard", "who is richard", "profile"],
    response: "Open the verified About page. Unconfirmed biography details remain unpublished.",
    action: { kind: "navigate", href: "/about" },
    icon: "user",
    starter: false,
  }),
]);
