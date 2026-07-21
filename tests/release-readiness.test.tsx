import { readFileSync, readdirSync } from "node:fs";
import { extname, join, resolve } from "node:path";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import ErrorPage from "@/app/error";
import { createSiteStructuredData } from "@/lib/structured-data";

vi.mock("server-only", () => ({}));

const repositoryRoot = resolve(import.meta.dirname, "..");

afterEach(() => {
  vi.unstubAllEnvs();
});

function filesBelow(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  });
}

describe("production release safeguards", () => {
  it("keeps the private source ignored and browser-visible secrets undefined", () => {
    const gitignore = readFileSync(join(repositoryRoot, ".gitignore"), "utf8");
    const envExample = readFileSync(join(repositoryRoot, ".env.example"), "utf8");

    expect(gitignore).toMatch(/^\.private\/$/m);
    expect(envExample).not.toMatch(/^\s*NEXT_PUBLIC_[A-Z0-9_]+\s*=/m);
  });

  it("contains no public PDF or direct-contact protocol", () => {
    const publicFiles = filesBelow(join(repositoryRoot, "public"));
    const sourceFiles = filesBelow(join(repositoryRoot, "src"))
      .filter((path) => [".ts", ".tsx", ".css", ".json"].includes(extname(path)));
    const publicSource = sourceFiles
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    expect(publicFiles.some((path) => extname(path).toLowerCase() === ".pdf")).toBe(false);
    expect(publicSource).not.toMatch(/(?:mailto|tel):/i);
  });

  it("keeps direct-contact and unsupported claims out of structured data", () => {
    const structuredData = JSON.stringify(createSiteStructuredData());

    expect(structuredData).not.toMatch(/email|telephone|worksFor|jobTitle|alumniOf|award|rating/i);
    expect(structuredData).toContain("https://jenorichardtokoli.com/");
  });

  it("retains all twenty manual cutover gates", () => {
    const checklist = readFileSync(join(repositoryRoot, "RELEASE_CHECKLIST.md"), "utf8");

    for (let item = 1; item <= 20; item += 1) {
      expect(checklist).toMatch(new RegExp(`^## ${item}\\. `, "m"));
    }
  });

  it("fails contact delivery closed when the emergency mode is disabled", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("CONTACT_DELIVERY_MODE", "disabled");
    const { getContactRequestProvider } = await import("@/lib/contact/provider");
    const provider = getContactRequestProvider();

    await expect(provider.send({
      fullName: "Release Test",
      professionalEmail: "release@example.test",
      organization: "Test Organization",
      opportunityType: "professional-collaboration",
      message: "This deterministic test message is never delivered.",
      roleUrl: null,
    })).rejects.toThrow("Contact delivery is unavailable.");
  });
});

describe("runtime error recovery", () => {
  it("offers a retry without exposing error details", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();

    render(<ErrorPage reset={reset} />);

    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeVisible();
    expect(screen.queryByText(/stack|digest|recipient/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "/");
  });
});
