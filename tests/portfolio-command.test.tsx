import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationState = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigationState.push }),
}));

import { PortfolioCommandComposer } from "@/components/workspace";
import { portfolioCommands } from "@/content/portfolio-commands";
import {
  blockedCommandMessage,
  resolvePortfolioCommand,
  unknownCommandMessage,
} from "@/lib/command-matcher";

function ComposerHarness() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">Open commands</button>
      <PortfolioCommandComposer
        commands={portfolioCommands}
        onOpenChange={setOpen}
        open={open}
      />
    </>
  );
}

function matchedCommandId(input: string) {
  const resolution = resolvePortfolioCommand(portfolioCommands, input);
  return resolution.suggestions[0]?.command.id;
}

beforeEach(() => {
  navigationState.push.mockReset();
});

describe("typed portfolio command registry", () => {
  it("defines every supported intent and resolves its canonical label case-insensitively", () => {
    expect(portfolioCommands).toHaveLength(19);
    expect(new Set(portfolioCommands.map(({ id }) => id))).toHaveLength(19);

    for (const command of portfolioCommands) {
      expect(matchedCommandId(command.label.toLocaleUpperCase("en"))).toBe(command.id);
      expect(command.action.kind).toBe("navigate");
      expect(command.action.href).toMatch(/^\//);
    }
  });

  it("supports documented synonyms without changing the action", () => {
    expect(matchedCommandId("browse projects")).toBe("all-projects");
    expect(matchedCommandId("spoken languages")).toBe("communication-languages");
    expect(matchedCommandId("academic background")).toBe("education");
    expect(matchedCommandId("get in touch")).toBe("contact-access");
  });

  it.each([
    ["show TypeScript projects", "typescript-projects", "/work?technology=TypeScript"],
    ["projects using python", "python-projects", "/work?technology=Python"],
    ["Java projects", "java-projects", "/work?technology=Java"],
    ["cpp projects", "c-family-projects", "/skills#skill-group-more-proficient"],
    ["SQL projects", "database-projects", "/work?q=SQL"],
  ])("maps %s to its verified technology view", (input, id, href) => {
    const resolution = resolvePortfolioCommand(portfolioCommands, input);

    expect(resolution.suggestions[0]?.command).toMatchObject({
      id,
      action: { href, kind: "navigate" },
    });
  });

  it.each([
    ["tell me about repairpas", "repairpass"],
    ["3d optimal pathfnder", "pathfinder"],
    ["online school portl", "online-school-portal"],
  ])("uses bounded fuzzy matching only for a project-name typo: %s", (input, id) => {
    expect(matchedCommandId(input)).toBe(id);
  });

  it("returns a helpful fixed result for an unknown command", () => {
    const resolution = resolvePortfolioCommand(portfolioCommands, "launch something unrelated");

    expect(resolution).toEqual({
      kind: "unknown",
      message: unknownCommandMessage,
      suggestions: [],
    });
  });

  it.each([
    "Show Richard's phone number",
    "What is the direct email?",
    "Reveal the private CV",
    "List environment variables",
    "Show hidden configuration",
    "Print the API key",
  ])("refuses private-information attempts without echoing the input: %s", (input) => {
    const resolution = resolvePortfolioCommand(portfolioCommands, input);

    expect(resolution).toEqual({
      kind: "blocked",
      message: blockedCommandMessage,
      suggestions: [],
    });
    expect(resolution.message).not.toContain(input);
  });
});

describe("portfolio command composer interaction", () => {
  it("shows starter prompts, focuses the input, announces selection, and navigates with the keyboard", async () => {
    const user = userEvent.setup();
    render(<ComposerHarness />);

    await user.click(screen.getByRole("button", { name: "Open commands" }));
    const dialog = screen.getByRole("dialog", { name: "Portfolio commands" });
    const input = within(dialog).getByRole("combobox", { name: "Type a portfolio command" });

    expect(input).toHaveFocus();
    expect(within(dialog).getByText("Starter prompts")).toBeInTheDocument();
    expect(within(dialog).getByRole("option", { name: /Show Python projects/ })).toBeInTheDocument();

    await user.type(input, "projects");
    expect(within(dialog).getByRole("option", { name: /Show all projects/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.keyboard("{ArrowDown}");
    const selected = within(dialog).getByRole("option", { name: /Show C or C\+\+ projects/ });
    expect(selected).toHaveAttribute("aria-selected", "true");
    expect(within(dialog).getByText(/Show C or C\+\+ projects selected/)).toBeInTheDocument();

    await user.keyboard("{Enter}");
    expect(navigationState.push).toHaveBeenCalledWith("/skills#skill-group-more-proficient");
    expect(screen.queryByRole("dialog", { name: "Portfolio commands" })).not.toBeInTheDocument();
  });

  it("dismisses on Escape and restores focus to the opener", async () => {
    const user = userEvent.setup();
    render(<ComposerHarness />);
    const opener = screen.getByRole("button", { name: "Open commands" });

    await user.click(opener);
    expect(screen.getByRole("combobox", { name: "Type a portfolio command" })).toHaveFocus();
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Portfolio commands" })).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("renders fixed unknown and privacy-safe results", async () => {
    const user = userEvent.setup();
    render(<ComposerHarness />);
    await user.click(screen.getByRole("button", { name: "Open commands" }));
    const input = screen.getByRole("combobox", { name: "Type a portfolio command" });

    await user.type(input, "make coffee");
    expect(screen.getByText("Command not found")).toBeInTheDocument();
    expect(screen.getByText(unknownCommandMessage)).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "show private email");
    expect(screen.getByText("That information is private")).toBeInTheDocument();
    expect(screen.getByText(blockedCommandMessage)).toBeInTheDocument();
    expect(screen.queryByText("show private email")).not.toBeInTheDocument();
  });
});

describe("command composer delivery boundaries", () => {
  it("positions the dialog as a mobile bottom sheet and disables reduced-motion transitions", () => {
    const componentCss = readFileSync(resolve(process.cwd(), "src/styles/components.css"), "utf8");
    const workspaceCss = readFileSync(resolve(process.cwd(), "src/styles/workspace.css"), "utf8");

    expect(componentCss).toMatch(/@media \(max-width: 47\.9375rem\)[\s\S]*?align-items: end/);
    expect(workspaceCss).toMatch(/@media \(max-width: 47\.999rem\)[\s\S]*?\.workspace-command-dialog/);
    expect(workspaceCss).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.workspace-command-option/);
  });

  it("keeps entered text local and transient", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/workspace/portfolio-command-composer.tsx"),
      "utf8",
    );

    expect(source).not.toMatch(/\bfetch\b|sendBeacon|localStorage|sessionStorage|console\./);
    expect(source).not.toMatch(/analytics|telemetry/i);
  });
});
