import Link from "next/link";

import { Icon } from "@/components/icons";
import { StatusNotice } from "@/components/ui";
import { portfolioContent } from "@/content/portfolio";
import { isPublishedContent } from "@/lib/public-content";

export function ResumeDownload() {
  const resume = portfolioContent.resume;
  const isAvailable = Boolean(isPublishedContent(resume) && resume.publicPath);

  if (isAvailable && resume.publicPath) {
    return (
      <Link className="profile-action profile-action--secondary" download href={resume.publicPath}>
        <Icon name="download" />
        Download sanitized résumé
      </Link>
    );
  }

  return (
    <StatusNotice
      className="resume-download-missing"
      title="Sanitized résumé file is not available"
      variant="warning"
    >
      <p>
        The legacy CV is intentionally excluded because it contains private contact
        information. A verified sanitized document can be added later.
      </p>
      <span aria-disabled="true" className="profile-action profile-action--disabled">
        <Icon name="download" />
        Download unavailable
      </span>
    </StatusNotice>
  );
}
