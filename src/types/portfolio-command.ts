import type { IconName } from "@/components/icons";

export type PortfolioCommandId =
  | "featured-projects"
  | "all-projects"
  | "typescript-projects"
  | "python-projects"
  | "java-projects"
  | "c-family-projects"
  | "database-projects"
  | "repairpass"
  | "pathfinder"
  | "online-school-portal"
  | "current-project"
  | "strongest-languages"
  | "tools"
  | "communication-languages"
  | "education"
  | "hobbies"
  | "resume"
  | "contact-access"
  | "about";

export type PortfolioCommandHref =
  | "/"
  | "/about"
  | "/contact-access"
  | "/education"
  | "/hobbies"
  | "/now"
  | "/resume"
  | "/skills#communication-languages"
  | "/skills#skill-group-more-proficient"
  | "/skills#skill-group-tools"
  | "/work"
  | `/work/${string}`
  | `/work?${string}`;

export interface PortfolioCommand {
  readonly action: {
    readonly href: PortfolioCommandHref;
    readonly kind: "navigate";
  };
  readonly fuzzyProjectTerms?: readonly string[];
  readonly icon: IconName;
  readonly id: PortfolioCommandId;
  readonly label: string;
  readonly response: string;
  readonly starter: boolean;
  readonly synonyms: readonly string[];
}

export interface ScoredPortfolioCommand {
  readonly command: PortfolioCommand;
  readonly score: number;
}

export type PortfolioCommandResolution =
  | {
      readonly kind: "blocked";
      readonly message: string;
      readonly suggestions: readonly [];
    }
  | {
      readonly kind: "matches" | "starter";
      readonly message: string;
      readonly suggestions: readonly ScoredPortfolioCommand[];
    }
  | {
      readonly kind: "unknown";
      readonly message: string;
      readonly suggestions: readonly [];
    };
