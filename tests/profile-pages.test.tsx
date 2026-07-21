import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AboutPage from "@/app/about/page";
import EducationPage from "@/app/education/page";
import HomePage from "@/app/page";
import ResumePage from "@/app/resume/page";

const directEmailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const directTelephonePattern = /\+[0-9][0-9 ()-]{7,}[0-9]/;

describe("overview page", () => {
  it("renders the requested verified overview structure", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Hello, I’m Tököli Jenő-Richard.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Cluj-Napoca")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore Projects" })).toHaveAttribute(
      "href",
      "/work",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(
      screen.getByRole("link", { name: "Request Contact Access" }),
    ).toHaveAttribute("href", "/contact-access");
    expect(screen.getByRole("heading", { name: "Featured projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Current work" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Strongest technologies" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Starter command prompts" })).toBeInTheDocument();
  });

  it("uses a stable graceful placeholder when no approved portrait exists", () => {
    const { container } = render(<HomePage />);

    expect(screen.getByText("Portrait awaiting approved source")).toBeInTheDocument();
    expect(container.querySelector('[data-media-state="missing"]')).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});

describe("about page", () => {
  it("keeps unanswered biography and approach sections explicit", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { level: 1, name: "About Tököli Jenő-Richard" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Short biography" })).toBeInTheDocument();
    expect(screen.getByText("Short biography unanswered")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Technical interests" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Development approach" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Learning approach" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Project experience" })).toBeInTheDocument();
    expect(screen.queryByText("Work experience")).not.toBeInTheDocument();
  });
});

describe("education page", () => {
  it("shows verified institutions and qualification labels without claiming university completion", () => {
    const { container } = render(<EducationPage />);
    const text = container.textContent ?? "";

    expect(screen.getByRole("heading", { level: 1, name: "Education and qualifications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Liceul Teoretic “Báthory István”" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Babeș-Bolyai University" })).toBeInTheDocument();
    expect(screen.getByText("Mathematics and Computer Science")).toBeInTheDocument();
    expect(screen.getAllByText("Status requires confirmation")).toHaveLength(2);
    expect(text).not.toContain("2021-09");
    expect(text).not.toMatch(/graduated|degree completed/i);
  });
});

describe("public résumé", () => {
  it("renders a print-ready web résumé with privacy-safe structure", () => {
    const { container } = render(<ResumePage />);
    const resume = screen.getByTestId("print-resume");
    const text = container.textContent ?? "";

    expect(screen.getByRole("heading", { level: 1, name: "Résumé" })).toBeInTheDocument();
    expect(resume).toContainElement(screen.getByRole("heading", { name: "Project experience" }));
    expect(resume).toContainElement(screen.getByRole("heading", { name: "Technical skills" }));
    expect(resume).toContainElement(screen.getByRole("heading", { name: "Education" }));
    expect(screen.getByText("Private contact information is not included")).toBeInTheDocument();
    expect(text).not.toMatch(directEmailPattern);
    expect(text).not.toMatch(directTelephonePattern);
    expect(container.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
    expect(container.querySelector('a[href^="tel:"]')).not.toBeInTheDocument();
  });

  it("renders clear missing sanitized-file behavior without exposing the legacy CV", () => {
    const { container } = render(<ResumePage />);

    expect(screen.getByText("Sanitized résumé file is not available")).toBeInTheDocument();
    expect(screen.getByText("Download unavailable")).toHaveAttribute("aria-disabled", "true");
    expect(container.querySelector("a[download]")).not.toBeInTheDocument();
    expect(container.querySelector('a[href$="CV.pdf"]')).not.toBeInTheDocument();
  });

  it("includes a dedicated print stylesheet that removes the workspace chrome", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/profile-pages.css"), "utf8");

    expect(css).toContain("@media print");
    expect(css).toContain("@page");
    expect(css).toContain(".workspace-sidebar");
    expect(css).toContain(".workspace-composer-dock");
    expect(css).toContain(".web-resume");
    expect(css).toContain("break-inside: avoid");
  });
});

describe("profile page claim safety", () => {
  it("does not use unsupported seniority or fabricated-experience labels", () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? "";

    expect(text).not.toMatch(/senior developer|expert|industry veteran/i);
    expect(text).not.toMatch(/\b\d+\+? years? (?:of )?experience\b/i);
  });
});
