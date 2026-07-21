import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectMedia } from "@/components/projects";
import { Badge, Card, StatusNotice } from "@/components/ui";
import { projects } from "@/content/projects";
import {
  formatProjectStatus,
  getPublishedValue,
} from "@/lib/public-content";
import { getAdjacentProjects, getProjectBySlug } from "@/lib/projects";
import type { Project } from "@/types/content-model";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: getPublishedValue(project.shortDescription) ??
      `Verified project record for ${project.title}.`,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

interface TextSectionProps {
  body: string | null;
  heading: string;
}

function TextSection({ body, heading }: TextSectionProps) {
  if (!body) {
    return null;
  }

  return (
    <Card as="section" className="case-study-section">
      <h2>{heading}</h2>
      <p>{body}</p>
    </Card>
  );
}

interface ListSectionProps {
  heading: string;
  items: readonly string[] | null;
}

function ListSection({ heading, items }: ListSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Card as="section" className="case-study-section">
      <h2>{heading}</h2>
      <ul className="case-study-list">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </Card>
  );
}

function hasDocumentedNarrative(project: Project) {
  const values: readonly unknown[] = [
    getPublishedValue(project.overview),
    getPublishedValue(project.problem),
    getPublishedValue(project.responsibilities),
    getPublishedValue(project.process),
    getPublishedValue(project.technicalDecisions),
    getPublishedValue(project.solution),
    getPublishedValue(project.outcome),
    getPublishedValue(project.lessonsLearned),
    getPublishedValue(project.implementedFunctionality),
    getPublishedValue(project.plannedFunctionality),
  ];

  return values.some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { previous, next } = getAdjacentProjects(project.slug);
  const status = getPublishedValue(project.status);
  const dates = getPublishedValue(project.dates);
  const technologies = getPublishedValue(project.technologies) ?? [];
  const categories = getPublishedValue(project.categories) ?? [];
  const gallery = getPublishedValue(project.gallery) ?? [];
  const architectureDiagram = getPublishedValue(project.architectureDiagram);
  const repositoryUrl = getPublishedValue(project.repositoryUrl);
  const liveUrl = getPublishedValue(project.liveUrl);
  const legacyUrl = getPublishedValue(project.legacyUrl);
  const privateNotice = getPublishedValue(project.privateProjectNotice);
  const implemented = getPublishedValue(project.implementedFunctionality);
  const planned = getPublishedValue(project.plannedFunctionality);
  const hasLinks = Boolean(repositoryUrl || liveUrl || legacyUrl);

  return (
    <main className="case-study-page" id="main-content">
      <nav aria-label="Breadcrumb" className="case-study-breadcrumb">
        <Link href="/work">Projects</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{project.title}</span>
      </nav>

      <header className="case-study-hero">
        <div className="case-study-hero__copy">
          <p className="ds-eyebrow">Project case study</p>
          <h1>{project.title}</h1>
          {getPublishedValue(project.shortDescription) ? (
            <p>{getPublishedValue(project.shortDescription)}</p>
          ) : (
            <p>Details being documented.</p>
          )}
          <div className="case-study-badges">
            {status ? (
              <Badge variant={status === "finished" ? "success" : "warning"}>
                {formatProjectStatus(status)}
              </Badge>
            ) : <Badge>Status not documented</Badge>}
            {project.featured ? <Badge variant="primary">Featured</Badge> : null}
            {project.pinned ? <Badge variant="cyan">Pinned</Badge> : null}
          </div>
          {dates ? (
            <p className="case-study-dates">{dates.label ?? [dates.start, dates.end].filter(Boolean).join(" – ")}</p>
          ) : null}
        </div>
        <ProjectMedia media={project.coverImage} priority projectTitle={project.title} />
      </header>

      <section aria-labelledby="project-metadata" className="case-study-metadata">
        <h2 id="project-metadata">Confirmed metadata</h2>
        <dl>
          <div>
            <dt>Technologies</dt>
            <dd>{technologies.length > 0 ? technologies.join(", ") : "Not documented"}</dd>
          </div>
          <div>
            <dt>Categories</dt>
            <dd>{categories.length > 0 ? categories.join(", ") : "Not documented"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{status ? formatProjectStatus(status) : "Not documented"}</dd>
          </div>
        </dl>
      </section>

      {privateNotice ? (
        <StatusNotice title="Private project" variant="warning">{privateNotice}</StatusNotice>
      ) : null}

      {!hasDocumentedNarrative(project) ? (
        <StatusNotice title="Details being documented">
          Verified case-study narrative has not been published for this project yet.
        </StatusNotice>
      ) : null}

      {project.slug === "repairpass-architecture" && !implemented && !planned ? (
        <StatusNotice title="Implementation scope awaiting verification" variant="warning">
          Implemented and planned functionality are being verified separately before publication.
        </StatusNotice>
      ) : null}

      <div className="case-study-content">
        <TextSection body={getPublishedValue(project.overview)} heading="Overview" />
        <TextSection body={getPublishedValue(project.problem)} heading="Problem" />
        <ListSection heading="Responsibilities" items={getPublishedValue(project.responsibilities)} />
        <TextSection body={getPublishedValue(project.process)} heading="Process" />
        <ListSection heading="Technical decisions" items={getPublishedValue(project.technicalDecisions)} />
        <ListSection heading="Implemented functionality" items={implemented} />
        <ListSection heading="Planned functionality" items={planned} />
        <TextSection body={getPublishedValue(project.solution)} heading="Solution" />
        <TextSection body={getPublishedValue(project.outcome)} heading="Outcome" />
        <ListSection heading="Lessons learned" items={getPublishedValue(project.lessonsLearned)} />
      </div>

      {architectureDiagram ? (
        <section aria-labelledby="architecture-media" className="case-study-media-section">
          <h2 id="architecture-media">Architecture</h2>
          <ProjectMedia media={project.architectureDiagram} projectTitle={project.title} />
        </section>
      ) : null}

      {gallery.length > 0 ? (
        <section aria-labelledby="project-gallery" className="case-study-media-section">
          <h2 id="project-gallery">Gallery</h2>
          <div className="case-study-gallery">
            {gallery.map((image) => (
              <Image
                alt={image.alt}
                height={image.height}
                key={image.id}
                loading="lazy"
                sizes="(max-width: 48rem) 100vw, 50vw"
                src={image.publicPath}
                width={image.width}
              />
            ))}
          </div>
        </section>
      ) : null}

      {hasLinks ? (
        <section aria-labelledby="project-links" className="case-study-links">
          <h2 id="project-links">Project links</h2>
          <ul>
            {repositoryUrl ? <li><a href={repositoryUrl}>Repository</a></li> : null}
            {liveUrl ? <li><a href={liveUrl}>Live project</a></li> : null}
            {legacyUrl ? <li><a href={legacyUrl}>Legacy download</a></li> : null}
          </ul>
        </section>
      ) : null}

      {technologies.length > 0 ? (
        <section aria-labelledby="related-technologies" className="case-study-related">
          <h2 id="related-technologies">Related technologies</h2>
          <ul>
            {technologies.map((technology) => (
              <li key={technology}>
                <Link href={`/work?technology=${encodeURIComponent(technology)}`}>{technology}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav aria-label="Adjacent projects" className="case-study-pagination">
        {previous ? <Link href={`/work/${previous.slug}`}>← {previous.title}</Link> : <span />}
        {next ? <Link href={`/work/${next.slug}`}>{next.title} →</Link> : <span />}
      </nav>
    </main>
  );
}
