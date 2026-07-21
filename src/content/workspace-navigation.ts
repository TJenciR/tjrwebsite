import type { IconName } from "@/components/icons";

export type WorkspaceHref =
  | "/"
  | "/about"
  | "/contact-access"
  | "/education"
  | "/hobbies"
  | "/now"
  | "/resume"
  | "/skills"
  | "/work"
  | `/work#${string}`;

export interface WorkspaceNavigationItem {
  readonly href: WorkspaceHref;
  readonly icon: IconName;
  readonly id: string;
  readonly label: string;
  readonly match?: "exact" | "prefix";
  readonly matchAliases?: readonly string[];
}

export interface WorkspaceProjectLink {
  readonly href: `/work#${string}`;
  readonly icon: IconName;
  readonly id: string;
  readonly label: string;
}

export const primaryWorkspaceNavigation = [
  { id: "overview", label: "Overview", href: "/", icon: "home", match: "exact" },
  { id: "about", label: "About", href: "/about", icon: "user", match: "prefix" },
  {
    id: "projects",
    label: "Projects",
    href: "/work",
    icon: "projects",
    match: "prefix",
    matchAliases: ["/projects"],
  },
  { id: "now", label: "Now", href: "/now", icon: "timer", match: "prefix" },
  { id: "skills", label: "Skills", href: "/skills", icon: "brain", match: "prefix" },
  { id: "hobbies", label: "Hobbies", href: "/hobbies", icon: "gamepad", match: "prefix" },
  {
    id: "education",
    label: "Education",
    href: "/education",
    icon: "graduation",
    match: "prefix",
  },
  { id: "resume", label: "Résumé", href: "/resume", icon: "document", match: "prefix" },
  {
    id: "contact-access",
    label: "Contact Access",
    href: "/contact-access",
    icon: "lock",
    match: "prefix",
  },
] as const satisfies readonly WorkspaceNavigationItem[];

export const pinnedProjectNavigation = [
  {
    id: "repairpass-architecture",
    label: "RepairPass Architecture",
    href: "/work#repairpass-architecture",
    icon: "pin",
  },
  {
    id: "3d-optimal-pathfinder",
    label: "3D Optimal Pathfinder",
    href: "/work#3d-optimal-pathfinder",
    icon: "pin",
  },
  {
    id: "online-school-portal",
    label: "Online School Portal",
    href: "/work#online-school-portal",
    icon: "pin",
  },
] as const satisfies readonly WorkspaceProjectLink[];

export const secondaryProjectNavigation = [
  { id: "m4rs", label: "M4RS", href: "/work#m4rs", icon: "code" },
  {
    id: "pizza-decorator",
    label: "Pizza Decorator",
    href: "/work#pizza-decorator",
    icon: "code",
  },
  { id: "basic-ocr", label: "Basic OCR", href: "/work#basic-ocr", icon: "code" },
  { id: "spam-filter", label: "Spam Filter", href: "/work#spam-filter", icon: "code" },
] as const satisfies readonly WorkspaceProjectLink[];

export function isWorkspaceNavigationActive(
  item: WorkspaceNavigationItem,
  pathname: string,
): boolean {
  const paths = [item.href, ...(item.matchAliases ?? [])];

  return paths.some((path) => {
    if (item.match === "exact" || path === "/") {
      return pathname === path;
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

export function getWorkspaceBreadcrumb(pathname: string): string {
  return primaryWorkspaceNavigation.find((item) =>
    isWorkspaceNavigationActive(item, pathname),
  )?.label ?? "Workspace";
}
