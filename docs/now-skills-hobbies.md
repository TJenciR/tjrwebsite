# Now, skills, and hobbies content contract

## Now

RepairPass Architecture is the only verified current project. Its public status
remains work in progress and its only confirmed technology is TypeScript. The
Now page must not turn planned functionality into implemented or completed
work.

The typed activity model supports:

- Currently building
- Currently learning
- Currently improving
- Upcoming milestone
- Recently completed

Only the first category has publishable content. The other categories render a
clear absence state until Richard provides a dated statement. A finished
project is not automatically “recently completed”; recency requires its own
source.

## Skills

The stronger programming languages are C++, Java, and Python. All other listed
technologies use “worked with” wording. Do not convert either category into a
percentage, star rating, seniority label, or years-of-experience claim.

Display group membership is maintained in `src/lib/skills.ts`. Evidence links
must use only project technology records that pass the content publication
gate. A missing evidence link does not mean a skill is unverified; it means the
current public project inventory does not document that connection.

Communication language labels are categorical:

- Hungarian — native proficiency
- English — full professional proficiency
- Romanian — limited working proficiency
- German — elementary

The v0.8 user brief confirms the Romanian wording and overrides the conflicting
Stitch concept. Stitch progress bars remain excluded.

## Hobbies

The page is titled Hobbies. “Plugins” is a visual metaphor only and must not
obscure the plain-language page title or the factual interest names:

- Music and DJing
- Gaming
- Fishing
- Geography

The user-confirmed statement that the CV records more than ten years of DJ
experience is the only published duration. Venue, event, audience, gaming-rank,
fishing-achievement, and travel claims remain prohibited without a new source.

Native `details` and `summary` elements provide expandable information without
client-side JavaScript. No autoplay, audio, carousel, or decorative loop is
used. The asset audit found no suitable owned standalone hobby imagery, so the
cards use the typed Lucide icon registry.

## Verification dates

Every page renders an explicit last-verified date. Update that date only when
the supporting content has genuinely been rechecked or Richard confirms a new
fact; do not use build or deployment time as a content-verification date.
