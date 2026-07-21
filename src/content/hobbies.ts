import { cvVerifiedMetadata } from "@/lib/content-model";
import type { Hobby } from "@/types/content-model";

export const hobbies: readonly Hobby[] = Object.freeze([
  {
    ...cvVerifiedMetadata,
    id: "djing-and-music",
    name: "DJing and music",
    internalNote: "No duration claim is included.",
  },
  { ...cvVerifiedMetadata, id: "gaming", name: "Gaming" },
  { ...cvVerifiedMetadata, id: "fishing", name: "Fishing" },
  {
    ...cvVerifiedMetadata,
    id: "geography",
    name: "Geography",
    internalNote: "Driving and photography remain excluded pending confirmation.",
  },
]);
