import { needsConfirmationMetadata } from "@/lib/content-model";
import type { CurrentActivity } from "@/types/content-model";

export const currentActivities: readonly CurrentActivity[] = Object.freeze([
  {
    ...needsConfirmationMetadata(
      "docs/audit/questions-for-richard.md#identity-education-and-professional-status",
      "No dated current-focus or availability statement has been approved.",
    ),
    id: "current-focus",
    title: null,
    description: null,
  },
]);
