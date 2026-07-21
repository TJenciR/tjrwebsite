export interface LegacyProject {
  readonly name: string;
  readonly category: "Python" | "Java";
  readonly downloadPath: string;
  readonly publishedStatus: "unspecified" | "incomplete";
}

export const legacyProjects: readonly LegacyProject[] = [
  {
    name: "3D Optimal Pathfinding",
    category: "Python",
    downloadPath: "/download/pathfinder.zip",
    publishedStatus: "unspecified",
  },
  {
    name: "Optical Character Recognition",
    category: "Python",
    downloadPath: "/download/optical_character_recognition.zip",
    publishedStatus: "unspecified",
  },
  {
    name: "Spam Filtering",
    category: "Python",
    downloadPath: "/download/spam_filtering.zip",
    publishedStatus: "unspecified",
  },
  {
    name: "Basic Pizza Decorator",
    category: "Java",
    downloadPath: "/download/basic_pizza_creator.zip",
    publishedStatus: "unspecified",
  },
  {
    name: "Flower Growth Simulator",
    category: "Java",
    downloadPath: "/download/flower_growth_simulation.zip",
    publishedStatus: "unspecified",
  },
  {
    name: "Space Invaders Type Shooter",
    category: "Java",
    downloadPath: "/download/space_invaders_v0.1.zip",
    publishedStatus: "incomplete",
  },
] as const;

export const legacyQualifications = [
  "Bacalaureate diploma",
  "Linguistic competence certificate",
  "Digital competence certificate",
  "Professional competence certificate",
] as const;

