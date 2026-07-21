import {
  hiddenMetadata,
  userConfirmedMetadataFor,
} from "@/lib/content-model";
import type { CurrentActivity } from "@/types/content-model";

const nowBriefMetadata = userConfirmedMetadataFor(
  "User-provided v0.8.0 Now/Skills/Hobbies brief",
);

function undocumentedActivity(
  id: string,
  kind: CurrentActivity["kind"],
): CurrentActivity {
  return Object.freeze({
    ...hiddenMetadata(
      "docs/audit/questions-for-richard.md#identity-education-and-professional-status",
      `No ${kind.replaceAll("-", " ")} statement has been approved.`,
    ),
    id,
    kind,
    title: null,
    description: null,
    projectSlug: null,
  });
}

export const currentActivities: readonly CurrentActivity[] = Object.freeze([
  Object.freeze({
    ...nowBriefMetadata,
    id: "repairpass-current-project",
    kind: "currently-building",
    title: "RepairPass Architecture",
    description: null,
    projectSlug: "repairpass-architecture",
  }),
  undocumentedActivity("current-learning", "currently-learning"),
  undocumentedActivity("current-improvement", "currently-improving"),
  undocumentedActivity("upcoming-milestone", "upcoming-milestone"),
  undocumentedActivity("recently-completed", "recently-completed"),
]);
