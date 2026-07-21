import type {
  ContentStatus,
  ContentValue,
  IsoDate,
} from "@/types/content";

interface ContentValueOptions<T> {
  value: T | null;
  status: ContentStatus;
  verifiedAt: IsoDate | null;
  source: string;
}

export function defineContentValue<T>(
  options: ContentValueOptions<T>,
): ContentValue<T> {
  return Object.freeze({ ...options });
}

export function getPublicValue<T>(field: ContentValue<T>): T | null {
  if (field.status !== "verified") {
    return null;
  }

  return field.value;
}

export function isContentStatus(value: string): value is ContentStatus {
  return (
    value === "verified" ||
    value === "needs-confirmation" ||
    value === "hidden"
  );
}

