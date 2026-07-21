import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import HobbiesPage from "@/app/hobbies/page";
import NowPage from "@/app/now/page";
import SkillsPage from "@/app/skills/page";
import { currentActivities } from "@/content/now";
import { hobbies } from "@/content/hobbies";
import { communicationLanguages } from "@/content/skills";
import { skillGroups } from "@/lib/skills";

describe("Now experience", () => {
  it("renders RepairPass as work in progress and leaves unverified slots empty", () => {
    render(<NowPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Now" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "RepairPass Architecture" }))
      .toBeInTheDocument();
    expect(screen.getByText("Work in progress")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.queryByText("Finished")).not.toBeInTheDocument();

    for (const heading of [
      "Currently learning",
      "Currently improving",
      "Upcoming milestone",
      "Recently completed",
    ]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(screen.getAllByText("No verified update is available.")).toHaveLength(4);
  });

  it("stores all activity states and a dated verified current project", () => {
    expect(currentActivities.map(({ kind }) => kind)).toEqual([
      "currently-building",
      "currently-learning",
      "currently-improving",
      "upcoming-milestone",
      "recently-completed",
    ]);
    expect(currentActivities[0]).toEqual(expect.objectContaining({
      projectSlug: "repairpass-architecture",
      publicationStatus: "published",
      verifiedAt: "2026-07-21",
    }));
  });
});

describe("Skills experience", () => {
  it("uses the requested categorical skill groups", () => {
    expect(skillGroups.map(({ title }) => title)).toEqual([
      "More proficient programming languages",
      "Additional programming languages",
      "Web technologies",
      "Databases",
      "Tools and IDEs",
      "Game and simulation tools",
    ]);
    expect(skillGroups[0].items.map(({ name }) => name)).toEqual([
      "C++",
      "Java",
      "Python",
    ]);
  });

  it("renders categorical labels and supporting project links", () => {
    render(<SkillsPage />);

    expect(screen.getAllByText("More proficient")).toHaveLength(3);
    expect(screen.getAllByRole("link", { name: "Pizza Decorator" })).toHaveLength(2);
    expect(screen.getByRole("link", { name: "3D Optimal Pathfinder" })).toHaveAttribute(
      "href",
      "/work/3d-optimal-pathfinder",
    );
    expect(screen.getByRole("link", { name: "RepairPass Architecture" })).toHaveAttribute(
      "href",
      "/work/repairpass-architecture",
    );

    const pageText = document.body.textContent ?? "";
    expect(pageText).not.toMatch(/expert|percentage|star rating|years of experience/i);
  });

  it("renders all four confirmed communication levels", () => {
    render(<SkillsPage />);

    expect(communicationLanguages.map(({ name, level }) => ({ name, level }))).toEqual([
      { name: "Hungarian", level: "native" },
      { name: "English", level: "full-professional" },
      { name: "Romanian", level: "limited-working" },
      { name: "German", level: "elementary" },
    ]);
    expect(screen.getByText("Native proficiency")).toBeInTheDocument();
    expect(screen.getByText("Full professional proficiency")).toBeInTheDocument();
    expect(screen.getByText("Limited working proficiency")).toBeInTheDocument();
    expect(screen.getByText("Elementary proficiency")).toBeInTheDocument();
  });
});

describe("Hobbies experience", () => {
  it("renders four hobby plugins and only the approved DJ duration", () => {
    render(<HobbiesPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Hobbies" })).toBeInTheDocument();
    for (const hobby of ["Music and DJing", "Gaming", "Fishing", "Geography"]) {
      expect(screen.getByRole("heading", { name: hobby })).toBeInTheDocument();
    }
    expect(screen.getByText("The CV records more than ten years of DJ experience."))
      .toBeInTheDocument();
    expect(hobbies.filter(({ experience }) => experience.value !== null)).toHaveLength(1);

    const pageText = document.body.textContent ?? "";
    expect(pageText).not.toMatch(/venue|audience|competitive rank|fishing achievement|travel history/i);
  });

  it("uses native accessible expandable details", async () => {
    const user = userEvent.setup();
    render(<HobbiesPage />);

    const summaries = screen.getAllByText("View verified details");
    expect(summaries).toHaveLength(4);
    const firstDetails = summaries[0].closest("details");
    expect(firstDetails).not.toHaveAttribute("open");
    await user.click(summaries[0]);
    expect(firstDetails).toHaveAttribute("open");
  });
});

describe("verification labels", () => {
  it("shows the last verified date on each experience", () => {
    const { unmount } = render(<NowPage />);
    expect(screen.getByText("Last verified")).toBeInTheDocument();
    expect(screen.getByText("21 July 2026")).toBeInTheDocument();
    unmount();

    render(<SkillsPage />);
    expect(screen.getByText("Last verified")).toBeInTheDocument();
    expect(screen.getByText("21 July 2026")).toBeInTheDocument();
  });
});
