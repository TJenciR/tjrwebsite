import {
  cvVerifiedMetadata,
  hiddenMetadata,
  sourcedValue,
  userConfirmedMetadataFor,
} from "@/lib/content-model";
import type { Hobby } from "@/types/content-model";

const hobbyBriefMetadata = userConfirmedMetadataFor(
  "User-provided v0.8.0 Now/Skills/Hobbies brief",
);

function undocumentedExperience(name: string) {
  return sourcedValue<string>(
    null,
    hiddenMetadata(
      "docs/audit/questions-for-richard.md#languages-and-interests",
      `No public duration, achievement, or event detail is approved for ${name}.`,
    ),
  );
}

export const hobbies: readonly Hobby[] = Object.freeze([
  {
    ...cvVerifiedMetadata,
    id: "djing-and-music",
    name: "Music and DJing",
    experience: sourcedValue(
      "The CV records more than ten years of DJ experience.",
      hobbyBriefMetadata,
    ),
  },
  {
    ...cvVerifiedMetadata,
    id: "gaming",
    name: "Gaming",
    experience: undocumentedExperience("gaming"),
  },
  {
    ...cvVerifiedMetadata,
    id: "fishing",
    name: "Fishing",
    experience: undocumentedExperience("fishing"),
  },
  {
    ...cvVerifiedMetadata,
    id: "geography",
    name: "Geography",
    experience: undocumentedExperience("geography"),
    internalNote: "Driving and photography remain excluded pending confirmation.",
  },
]);
