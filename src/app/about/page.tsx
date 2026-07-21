import type { Metadata } from "next";

import {
  ContentPlaceholder,
  ProfilePortrait,
  ProjectExperienceList,
} from "@/components/profile";
import { Card } from "@/components/ui";
import { portfolioContent } from "@/content/portfolio";
import {
  formatCommunicationLevel,
  getPublishedEntries,
} from "@/lib/public-content";

export const metadata: Metadata = {
  title: "About",
  description: "Verified profile context and open biography questions.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const biographies = getPublishedEntries(portfolioContent.biographies);
  const shortBiography = biographies.find(({ kind }) => kind === "short")?.body;
  const longBiography = biographies.find(({ kind }) => kind === "long")?.body;
  const languages = getPublishedEntries(portfolioContent.communicationLanguages);
  const hobbies = getPublishedEntries(portfolioContent.hobbies);

  return (
    <main className="profile-page about-page" id="main-content">
      <header className="profile-page-header profile-page-header--split">
        <div>
          <p className="ds-eyebrow">Profile · verified facts and open questions</p>
          <h1>About Tököli Jenő-Richard</h1>
          <p>
            This page separates source-backed profile facts from biography details
            that still need Richard’s approval.
          </p>
        </div>
        <ProfilePortrait compact />
      </header>

      <section aria-labelledby="biography" className="profile-section">
        <div className="profile-section-heading"><h2 id="biography">Biography</h2></div>
        <div className="profile-two-column-grid">
          <Card as="article">
            <h3>Short biography</h3>
            {shortBiography ? <p>{shortBiography}</p> : (
              <ContentPlaceholder
                description="A concise public introduction has not been approved."
                title="Short biography unanswered"
              />
            )}
          </Card>
          <Card as="article">
            <h3>Long biography</h3>
            {longBiography ? <p>{longBiography}</p> : (
              <ContentPlaceholder
                description="Education, motivation, and project context need owner-supplied wording."
                title="Long biography unanswered"
              />
            )}
          </Card>
        </div>
      </section>

      <div className="profile-three-column-grid">
        <Card as="section" aria-labelledby="technical-interests">
          <h2 id="technical-interests">Technical interests</h2>
          <ContentPlaceholder
            description="Verified technologies do not automatically establish personal technical interests."
            icon="brain"
            title="Technical interests unanswered"
          />
        </Card>
        <Card as="section" aria-labelledby="development-approach">
          <h2 id="development-approach">Development approach</h2>
          <ContentPlaceholder
            description="No approved statement about process, collaboration, or software principles exists."
            icon="code"
            title="Development approach unanswered"
          />
        </Card>
        <Card as="section" aria-labelledby="learning-approach">
          <h2 id="learning-approach">Learning approach</h2>
          <ContentPlaceholder
            description="No verified learning-method or current-study statement exists."
            icon="graduation"
            title="Learning approach unanswered"
          />
        </Card>
      </div>

      <section aria-labelledby="project-experience" className="profile-section">
        <div className="profile-section-heading">
          <div><p className="ds-eyebrow">No employment timeline inferred</p><h2 id="project-experience">Project experience</h2></div>
        </div>
        <ProjectExperienceList limit={3} />
      </section>

      <div className="profile-two-column-grid">
        <Card as="section" aria-labelledby="about-languages">
          <h2 id="about-languages">Communication languages</h2>
          <dl className="profile-language-list">
            {languages.map((language) => (
              <div key={language.id}><dt>{language.name}</dt><dd>{formatCommunicationLevel(language.level)}</dd></div>
            ))}
          </dl>
          <p className="profile-muted-copy">Romanian proficiency remains under confirmation and is not presented as verified.</p>
        </Card>
        <Card as="section" aria-labelledby="personal-interests">
          <h2 id="personal-interests">Personal interests</h2>
          <ul className="profile-tag-list profile-tag-list--large">
            {hobbies.map((hobby) => <li key={hobby.id}>{hobby.name}</li>)}
          </ul>
        </Card>
      </div>
    </main>
  );
}
