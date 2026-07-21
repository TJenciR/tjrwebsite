import type { Metadata } from "next";

import {
  ContentPlaceholder,
  ProjectExperienceList,
  ResumeDownload,
} from "@/components/profile";
import { Badge, StatusNotice } from "@/components/ui";
import { portfolioContent } from "@/content/portfolio";
import {
  formatCommunicationLevel,
  getPublishedEntries,
  getPublishedValue,
} from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Privacy-safe web résumé generated from verified public content.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  const name = getPublishedValue(portfolioContent.profile.name) ?? "Tököli Jenő-Richard";
  const positioning = getPublishedValue(portfolioContent.profile.professionalTitle);
  const location = getPublishedValue(portfolioContent.profile.location);
  const biographies = getPublishedEntries(portfolioContent.biographies);
  const summary = biographies.find(({ kind }) => kind === "short")?.body;
  const strongestSkills = getPublishedEntries(portfolioContent.programmingSkills)
    .filter(({ proficiency }) => proficiency === "more-proficient");
  const additionalSkills = getPublishedEntries(portfolioContent.programmingSkills)
    .filter(({ proficiency }) => proficiency === "worked-with");
  const languages = getPublishedEntries(portfolioContent.communicationLanguages);
  const qualifications = getPublishedEntries(portfolioContent.qualifications);

  return (
    <main className="profile-page resume-page" id="main-content">
      <header className="profile-page-header resume-page-intro no-print">
        <p className="ds-eyebrow">Public web résumé</p>
        <h1>Résumé</h1>
        <p>
          Generated from content explicitly approved for publication. Missing facts
          remain visible as editorial gaps instead of inferred claims.
        </p>
      </header>

      <div className="resume-controls no-print">
        <ResumeDownload />
        <p>Use your browser’s print command for a clean paper or PDF version.</p>
      </div>

      <article aria-labelledby="resume-name" className="web-resume" data-testid="print-resume">
        <header className="web-resume__header">
          <div>
            <p className="ds-eyebrow">Verified public résumé</p>
            <h2 id="resume-name">{name}</h2>
            {positioning ? <p className="web-resume__positioning">{positioning}</p> : (
              <p className="web-resume__positioning web-resume__positioning--missing">
                Professional positioning awaiting confirmation
              </p>
            )}
          </div>
          {location ? <Badge icon="location" variant="cyan">{location}</Badge> : null}
        </header>

        <StatusNotice className="resume-privacy-notice" title="Private contact information is not included">
          Contact access remains separate from this public résumé. The original CV is
          not used as a public asset.
        </StatusNotice>

        <section aria-labelledby="resume-profile">
          <h3 id="resume-profile">Profile</h3>
          {summary ? <p>{summary}</p> : (
            <ContentPlaceholder
              description="A public résumé summary has not been approved."
              title="Profile summary awaiting confirmation"
            />
          )}
        </section>

        <section aria-labelledby="resume-projects">
          <h3 id="resume-projects">Project experience</h3>
          <ProjectExperienceList limit={5} />
        </section>

        <section aria-labelledby="resume-skills">
          <h3 id="resume-skills">Technical skills</h3>
          <div className="resume-skill-groups">
            <div><h4>More proficient</h4><ul className="profile-tag-list">{strongestSkills.map((skill) => <li key={skill.id}>{skill.name}</li>)}</ul></div>
            <div><h4>Worked with</h4><ul className="profile-tag-list">{additionalSkills.map((skill) => <li key={skill.id}>{skill.name}</li>)}</ul></div>
          </div>
        </section>

        <section aria-labelledby="resume-education">
          <h3 id="resume-education">Education</h3>
          <div className="resume-education-list">
            {portfolioContent.education.map((entry) => {
              const institution = getPublishedValue(entry.institution);
              const programme = getPublishedValue(entry.programme);
              return institution ? (
                <div key={entry.id}>
                  <div><h4>{institution}</h4>{programme ? <p>{programme}</p> : null}</div>
                  <Badge variant="warning">Status requires confirmation</Badge>
                </div>
              ) : null;
            })}
          </div>
        </section>

        <section aria-labelledby="resume-qualifications">
          <h3 id="resume-qualifications">Qualifications</h3>
          <ul className="profile-plain-list">{qualifications.map((qualification) => <li key={qualification.id}>{qualification.title}</li>)}</ul>
        </section>

        <section aria-labelledby="resume-languages">
          <h3 id="resume-languages">Communication languages</h3>
          <dl className="profile-language-list">
            {languages.map((language) => <div key={language.id}><dt>{language.name}</dt><dd>{formatCommunicationLevel(language.level)}</dd></div>)}
          </dl>
        </section>
      </article>
    </main>
  );
}
