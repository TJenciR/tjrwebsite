import { projects } from "@/content/projects";
import { getPublishedValue } from "@/lib/public-content";
import type { Project, ProjectLifecycleStatus } from "@/types/content-model";

export type ProjectStatusFilter =
  | Exclude<ProjectLifecycleStatus, "unknown">
  | "undocumented";

export interface ProjectFilters {
  readonly query: string;
  readonly status: ProjectStatusFilter | "";
  readonly technology: string;
  readonly category: string;
}

export interface ProjectSearchParams {
  readonly q?: string | readonly string[];
  readonly status?: string | readonly string[];
  readonly technology?: string | readonly string[];
  readonly category?: string | readonly string[];
}

const allowedStatusFilters = new Set<ProjectStatusFilter>([
  "finished",
  "work-in-progress",
  "incomplete",
  "undocumented",
]);

function firstValue(value: string | readonly string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function parseProjectFilters(params: ProjectSearchParams): ProjectFilters {
  const requestedStatus = firstValue(params.status);

  return {
    query: firstValue(params.q),
    status: allowedStatusFilters.has(requestedStatus as ProjectStatusFilter)
      ? requestedStatus as ProjectStatusFilter
      : "",
    technology: firstValue(params.technology),
    category: firstValue(params.category),
  };
}

function publishedStatus(project: Project) {
  return getPublishedValue(project.status);
}

export function filterProjects(
  sourceProjects: readonly Project[],
  filters: ProjectFilters,
): readonly Project[] {
  const query = filters.query.toLocaleLowerCase("en");

  return sourceProjects.filter((project) => {
    const technologies = getPublishedValue(project.technologies) ?? [];
    const categories = getPublishedValue(project.categories) ?? [];
    const status = publishedStatus(project);
    const searchable = [
      project.title,
      ...project.alternateTitles,
      ...technologies,
      ...categories,
    ].join(" ").toLocaleLowerCase("en");

    const matchesQuery = query.length === 0 || searchable.includes(query);
    const matchesStatus = filters.status.length === 0 ||
      (filters.status === "undocumented" ? status === null : status === filters.status);
    const matchesTechnology = filters.technology.length === 0 ||
      technologies.includes(filters.technology);
    const matchesCategory = filters.category.length === 0 ||
      categories.includes(filters.category);

    return matchesQuery && matchesStatus && matchesTechnology && matchesCategory;
  });
}

function uniqueSorted(values: readonly string[]) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

export function getProjectFilterOptions(sourceProjects: readonly Project[]) {
  return {
    technologies: uniqueSorted(sourceProjects.flatMap(
      (project) => getPublishedValue(project.technologies) ?? [],
    )),
    categories: uniqueSorted(sourceProjects.flatMap(
      (project) => getPublishedValue(project.categories) ?? [],
    )),
  };
}

export function getFeaturedProjects(): readonly Project[] {
  return projects.filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | null {
  return projects.find((project) => project.slug === slug) ?? null;
}

export function getAdjacentProjects(slug: string): {
  previous: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((project) => project.slug === slug);

  if (index < 0) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}
