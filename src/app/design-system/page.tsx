import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  CommandInput,
  Container,
  EmptyState,
  IconButton,
  Input,
  MediaPlaceholder,
  ProjectCard,
  SearchField,
  SectionHeading,
  Skeleton,
  StatusNotice,
  Textarea,
  Tooltip,
  VisuallyHidden,
} from "@/components/ui";

import { ShowcaseInteractions } from "./showcase-interactions";

export const metadata: Metadata = {
  title: "Design system showcase",
  description: "Development-only component reference.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

function isShowcaseEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.DESIGN_SYSTEM_SHOWCASE === "true";
}

export default function DesignSystemShowcasePage() {
  if (!isShowcaseEnabled()) {
    notFound();
  }

  return (
    <main className="showcase" id="main-content">
      <Container>
        <header className="showcase-hero">
          <p className="ds-eyebrow">Development reference · noindex</p>
          <h1>Technical workspace design system</h1>
          <p>
            Reusable tokens and primitives translated from the approved Stitch workspace. Sample copy is generic and not portfolio content.
          </p>
        </header>

        <section className="showcase-section" aria-labelledby="showcase-colors">
          <SectionHeading
            description="Semantic roles keep repeated color values out of components."
            eyebrow="Foundation"
            id="showcase-colors"
            title="Color and type tokens"
          />
          <div className="showcase-swatches" role="list">
            {[
              ["Application", "application"],
              ["Sidebar", "sidebar"],
              ["Primary surface", "surface"],
              ["Elevated", "elevated"],
              ["Interactive", "interactive"],
              ["Primary accent", "primary"],
              ["Cyan accent", "cyan"],
              ["Success", "success"],
              ["Warning", "warning"],
              ["Danger", "danger"],
            ].map(([label, token]) => (
              <div className="showcase-swatch" data-swatch={token} key={token} role="listitem">
                <span aria-hidden="true" />
                <code>{label}</code>
              </div>
            ))}
          </div>
          <Card className="showcase-type" variant="primary">
            <h2>Anchored heading</h2>
            <p>Body copy uses generous line height for readable long-form material.</p>
            <code>MONO LABEL · TECHNICAL METADATA</code>
          </Card>
        </section>

        <section className="showcase-section" aria-labelledby="showcase-actions">
          <SectionHeading eyebrow="Controls" id="showcase-actions" title="Actions and status" />
          <div className="showcase-row">
            <Button icon="arrowRight" iconPosition="end">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button icon="danger" variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
            <Tooltip content="Settings tooltip">
              <IconButton icon="settings" label="Open settings" />
            </Tooltip>
          </div>
          <div className="showcase-row">
            <Badge>Neutral</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="cyan">Cyan</Badge>
            <Badge icon="checkCircle" variant="success">Ready</Badge>
            <Badge icon="alert" variant="warning">Review</Badge>
            <Badge icon="danger" variant="danger">Blocked</Badge>
            <Avatar alt="Example avatar" initials="EX" />
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="showcase-forms">
          <SectionHeading eyebrow="Inputs" id="showcase-forms" title="Form controls" />
          <div className="showcase-grid showcase-grid--two">
            <Input description="Supporting description." label="Text input" placeholder="Placeholder" />
            <Input error="Example validation message." label="Invalid input" placeholder="Placeholder" />
            <Textarea label="Textarea" placeholder="Longer input" />
            <div className="showcase-form-stack">
              <SearchField label="Search examples" placeholder="Search workspace…" />
              <CommandInput label="Command input" placeholder="Type a command or search…" />
              <Checkbox description="The check mark communicates state without color alone." label="Example option" />
              <Checkbox disabled label="Disabled option" />
            </div>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="showcase-surfaces">
          <SectionHeading eyebrow="Surfaces" id="showcase-surfaces" title="Cards and project primitive" />
          <div className="showcase-grid showcase-grid--three">
            <Card variant="primary"><h3>Primary surface</h3><p>Base grouped content.</p></Card>
            <Card><h3>Elevated surface</h3><p>Default card treatment.</p></Card>
            <Card variant="interactive"><h3>Interactive surface</h3><p>Hover-ready affordance.</p></Card>
          </div>
          <ProjectCard
            actions={<Button icon="externalLink" size="small" variant="secondary">View details</Button>}
            description="A generic project-card composition. Final project descriptions belong to verified content sources."
            media={<MediaPlaceholder description="No production asset attached" label="Project media" />}
            metadata={<><Badge variant="cyan">TypeScript</Badge><Badge>Example</Badge></>}
            status={<Badge icon="alert" variant="warning">Needs review</Badge>}
            title="Project card primitive"
          />
        </section>

        <section className="showcase-section" aria-labelledby="showcase-feedback">
          <SectionHeading eyebrow="Feedback" id="showcase-feedback" title="System states" />
          <div className="showcase-form-stack">
            <StatusNotice title="Informational notice">Neutral supporting detail.</StatusNotice>
            <StatusNotice title="Completed state" variant="success">The icon and label reinforce the meaning.</StatusNotice>
            <StatusNotice title="Review required" variant="warning">This state is not communicated by color alone.</StatusNotice>
            <StatusNotice title="Unable to continue" variant="danger">Resolve the described problem before retrying.</StatusNotice>
          </div>
          <div className="showcase-grid showcase-grid--two">
            <EmptyState
              action={<Button size="small">Reset example</Button>}
              description="Adjust the current filters or clear the query."
              title="No matching items"
            />
            <Card aria-label="Loading example">
              <div className="showcase-skeleton-stack">
                <Skeleton shape="block" />
                <Skeleton />
                <Skeleton className="showcase-skeleton-short" />
              </div>
            </Card>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="showcase-overlays">
          <SectionHeading eyebrow="Overlays" id="showcase-overlays" title="Dialog and drawer" />
          <ShowcaseInteractions />
        </section>

        <VisuallyHidden>
          <Icon name="info" /> All showcase sections use semantic headings and landmarks.
        </VisuallyHidden>
      </Container>
    </main>
  );
}
