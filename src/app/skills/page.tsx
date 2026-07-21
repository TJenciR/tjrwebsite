import type { Metadata } from "next";
import Link from "next/link";

import { VerificationStamp } from "@/components/content";
import { Icon } from "@/components/icons";
import { Badge, Card } from "@/components/ui";
import { communicationLanguages } from "@/content/skills";
import { contentAuditDate } from "@/lib/content-model";
import {
  formatCommunicationLevel,
  getPublishedEntries,
} from "@/lib/public-content";
import { getProjectBySlug } from "@/lib/projects";
import { skillGroups, type SkillDisplayItem } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Skills",
  description: "Verified technical skills, project evidence, and communication languages.",
  alternates: { canonical: "/skills" },
};

function SkillItem({ item }: { item: SkillDisplayItem }) {
  const evidence = item.evidenceProjectSlugs
    .map(getProjectBySlug)
    .filter((project) => project !== null);

  return (
    <article className="skill-item">
      <div className="skill-item__heading">
        <h3>{item.name}</h3>
        <Badge variant={item.proficiency === "more-proficient" ? "primary" : "neutral"}>
          {item.proficiency === "more-proficient" ? "More proficient" : "Worked with"}
        </Badge>
      </div>
      {evidence.length > 0 ? (
        <div className="skill-evidence">
          <p>Project evidence</p>
          <ul>
            {evidence.map((project) => (
              <li key={project.id}>
                <Link href={`/work/${project.slug}`}>{project.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="skill-evidence-empty">Project evidence is not yet documented.</p>
      )}
    </article>
  );
}

export default function SkillsPage() {
  const publishedLanguages = getPublishedEntries(communicationLanguages);

  return (
    <main className="experience-page skills-page" id="main-content">
      <header className="experience-page-header">
        <p className="ds-eyebrow">Verified stack</p>
        <h1>Skills</h1>
        <p>Category-based experience from the CV and verified project records.</p>
        <VerificationStamp date={contentAuditDate} />
      </header>

      {skillGroups.map((group) => (
        <section aria-labelledby={`skill-group-${group.id}`} className="skill-group" key={group.id}>
          <div className="experience-section-heading">
            <span className="experience-heading-icon"><Icon name={group.id === "more-proficient" ? "terminal" : "code"} /></span>
            <div>
              <h2 id={`skill-group-${group.id}`}>{group.title}</h2>
              <p>{group.description}</p>
            </div>
          </div>
          <div className={group.id === "more-proficient" ? "skills-primary-grid" : "skills-grid"}>
            {group.items.map((item) => <SkillItem item={item} key={item.id} />)}
          </div>
        </section>
      ))}

      <section aria-labelledby="communication-languages" className="skill-group">
        <div className="experience-section-heading">
          <span className="experience-heading-icon"><Icon name="globe" /></span>
          <div>
            <h2 id="communication-languages">Communication languages</h2>
            <p>Explicit proficiency labels replace unsupported visual scores.</p>
          </div>
        </div>
        <div className="language-grid">
          {publishedLanguages.map((language) => (
            <Card as="article" className="language-card" key={language.id}>
              <h3>{language.name}</h3>
              <p>{formatCommunicationLevel(language.level)} proficiency</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
