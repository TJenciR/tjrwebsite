import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icons";
import {
  ContentPlaceholder,
  ProfilePortrait,
  ProjectExperienceList,
} from "@/components/profile";
import { Badge, Card } from "@/components/ui";
import { portfolioContent } from "@/content/portfolio";
import {
  formatCommunicationLevel,
  getPublishedEntries,
  getPublishedValue,
} from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Overview",
  description: "Verified portfolio overview for Tököli Jenő-Richard.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const name = getPublishedValue(portfolioContent.profile.name) ?? "Tököli Jenő-Richard";
  const positioning = getPublishedValue(portfolioContent.profile.professionalTitle);
  const location = getPublishedValue(portfolioContent.profile.location);
  const strongestTechnologies = getPublishedEntries(portfolioContent.programmingSkills)
    .filter(({ proficiency }) => proficiency === "more-proficient");
  const languages = getPublishedEntries(portfolioContent.communicationLanguages);
  const selectedHobbies = getPublishedEntries(portfolioContent.hobbies).slice(0, 3);
  const currentWork = getPublishedEntries(portfolioContent.currentActivities);

  return (
    <main className="profile-page overview-page" id="main-content">
      <section aria-labelledby="overview-title" className="profile-hero">
        <div className="profile-hero__copy">
          <p className="ds-eyebrow">Personal workspace · overview</p>
          <h1 id="overview-title">Hello, I’m {name}.</h1>
          {positioning ? (
            <p className="profile-hero__positioning">{positioning}</p>
          ) : (
            <ContentPlaceholder
              description="Add an approved current title or positioning statement in the verified content model."
              icon="briefcase"
              title="Professional positioning awaiting confirmation"
            />
          )}
          {location ? (
            <p className="profile-location"><Icon name="location" />{location}</p>
          ) : null}
          <div className="profile-actions" aria-label="Overview actions">
            <Link className="profile-action profile-action--primary" href="/work">
              <Icon name="projects" />Explore Projects
            </Link>
            <Link className="profile-action profile-action--secondary" href="/about">
              <Icon name="user" />About
            </Link>
            <Link className="profile-action profile-action--ghost" href="/contact-access">
              <Icon name="lock" />Request Contact Access
            </Link>
          </div>
        </div>
        <ProfilePortrait />
      </section>

      <section aria-labelledby="featured-projects" className="profile-section" id="projects">
        <div className="profile-section-heading">
          <div>
            <p className="ds-eyebrow">Selected source-backed entries</p>
            <h2 id="featured-projects">Featured projects</h2>
          </div>
          <Link className="profile-inline-link" href="/work">All project experience</Link>
        </div>
        <ProjectExperienceList limit={3} />
      </section>

      <div className="profile-dashboard-grid">
        <Card as="section" aria-labelledby="current-work" className="profile-dashboard-card" id="now">
          <div className="profile-card-heading-row">
            <h2 id="current-work">Current work</h2>
            <Badge variant="warning">Needs confirmation</Badge>
          </div>
          {currentWork.length > 0 ? (
            <ul className="profile-plain-list">
              {currentWork.map((activity) => <li key={activity.id}>{activity.title}</li>)}
            </ul>
          ) : (
            <ContentPlaceholder
              description="No dated current-focus statement is verified for publication."
              icon="timer"
              title="Current activity awaiting confirmation"
            />
          )}
        </Card>

        <Card as="section" aria-labelledby="strongest-technologies" className="profile-dashboard-card" id="technologies">
          <h2 id="strongest-technologies">Strongest technologies</h2>
          <ul className="profile-tag-list profile-tag-list--large">
            {strongestTechnologies.map((skill) => <li key={skill.id}>{skill.name}</li>)}
          </ul>
          <p className="profile-muted-copy">Categorical CV wording; no percentage scores.</p>
        </Card>

        <Card as="section" aria-labelledby="background" className="profile-dashboard-card">
          <h2 id="background">Mathematics and Computer Science background</h2>
          <p>
            Babeș-Bolyai University is part of the verified education inventory.
            Completion and current university status remain unconfirmed.
          </p>
          <Link className="profile-inline-link" href="/education">Review education</Link>
        </Card>

        <Card as="section" aria-labelledby="communication-languages" className="profile-dashboard-card" id="languages">
          <h2 id="communication-languages">Communication languages</h2>
          <dl className="profile-language-list">
            {languages.map((language) => (
              <div key={language.id}>
                <dt>{language.name}</dt>
                <dd>{formatCommunicationLevel(language.level)}</dd>
              </div>
            ))}
          </dl>
          <p className="profile-muted-copy">One additional language level remains under review.</p>
        </Card>

        <Card as="section" aria-labelledby="selected-hobbies" className="profile-dashboard-card">
          <h2 id="selected-hobbies">Selected hobbies</h2>
          <ul className="profile-icon-list">
            {selectedHobbies.map((hobby) => <li key={hobby.id}><Icon name="pin" />{hobby.name}</li>)}
          </ul>
        </Card>
      </div>

      <section aria-labelledby="starter-prompts" className="profile-section profile-prompts">
        <div className="profile-section-heading">
          <div>
            <p className="ds-eyebrow">Start exploring</p>
            <h2 id="starter-prompts">Starter command prompts</h2>
          </div>
        </div>
        <nav aria-label="Starter command prompts">
          <Link href="#technologies"><Icon name="command" />Show strongest technologies</Link>
          <Link href="/work"><Icon name="command" />Browse project experience</Link>
          <Link href="/education"><Icon name="command" />Review education and qualifications</Link>
          <Link href="/about"><Icon name="command" />Learn what is verified about Richard</Link>
        </nav>
      </section>
    </main>
  );
}
