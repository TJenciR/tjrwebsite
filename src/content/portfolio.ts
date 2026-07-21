import { contactAccessCopy } from "@/content/contact";
import { education, qualifications } from "@/content/education";
import { hobbies } from "@/content/hobbies";
import { currentActivities } from "@/content/now";
import {
  biographies,
  mediaAssets,
  profile,
  resumeMetadata,
} from "@/content/profile";
import { projects } from "@/content/projects";
import {
  communicationLanguages,
  programmingSkills,
  tools,
} from "@/content/skills";
import { socials } from "@/content/socials";
import { assertValidPortfolioContent } from "@/lib/content-validator";
import type { PortfolioContentModel } from "@/types/content-model";

export const portfolioContent: PortfolioContentModel = Object.freeze({
  profile,
  biographies,
  education,
  qualifications,
  programmingSkills,
  tools,
  communicationLanguages,
  projects,
  hobbies,
  currentActivities,
  socials,
  mediaAssets,
  resume: resumeMetadata,
  contact: contactAccessCopy,
});

assertValidPortfolioContent(portfolioContent);
