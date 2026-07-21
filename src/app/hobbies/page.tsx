import type { Metadata } from "next";

import { VerificationStamp } from "@/components/content";
import { Icon, type IconName } from "@/components/icons";
import { Badge, Card } from "@/components/ui";
import { hobbies } from "@/content/hobbies";
import { contentAuditDate } from "@/lib/content-model";
import { getPublishedEntries, getPublishedValue } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Hobbies",
  description: "Verified hobbies presented as personal workspace plugins.",
  alternates: { canonical: "/hobbies" },
};

const hobbyIcons: Readonly<Record<string, IconName>> = {
  "djing-and-music": "headphones",
  gaming: "gamepad",
  fishing: "fish",
  geography: "globe",
};

export default function HobbiesPage() {
  const publishedHobbies = getPublishedEntries(hobbies);

  return (
    <main className="experience-page hobbies-page" id="main-content">
      <header className="experience-page-header experience-page-header--plugins">
        <div>
          <p className="ds-eyebrow">Personal plugins</p>
          <h1>Hobbies</h1>
          <p>A workspace-inspired view of verified interests outside software projects.</p>
          <VerificationStamp date={contentAuditDate} />
        </div>
        <p className="plugin-count"><span aria-hidden="true" />{publishedHobbies.length} plugins active</p>
      </header>

      <section aria-label="Verified hobbies" className="hobby-grid">
        {publishedHobbies.map((hobby, index) => {
          const experience = getPublishedValue(hobby.experience);
          return (
            <Card as="article" className="hobby-plugin-card" key={hobby.id} variant="interactive">
              <div className="hobby-plugin-card__header">
                <span className="hobby-plugin-icon"><Icon name={hobbyIcons[hobby.id] ?? "plus"} /></span>
                <div>
                  <p className="hobby-plugin-id">plugin.{String(index + 1).padStart(2, "0")}</p>
                  <h2>{hobby.name}</h2>
                </div>
                <Badge icon="checkCircle" variant="success">Active</Badge>
              </div>
              <details className="hobby-details">
                <summary>View verified details</summary>
                <div>
                  <p>Recorded as an interest in the sanitized CV inventory.</p>
                  {experience ? <p>{experience}</p> : null}
                  {hobby.verifiedAt ? (
                    <VerificationStamp date={hobby.verifiedAt} label="Interest verified" />
                  ) : null}
                </div>
              </details>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
