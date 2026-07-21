import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const workflow = readFileSync(resolve(process.cwd(), ".github/workflows/ci.yml"), "utf8");
const playwrightConfig = readFileSync(resolve(process.cwd(), "playwright.config.ts"), "utf8");
const packageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), "package.json"), "utf8"),
) as { scripts: Record<string, string> };

describe("continuous integration configuration", () => {
  it("runs the locked quality, build, and browser sequence with npm caching", () => {
    expect(workflow).toContain("cache: npm");
    expect(workflow).toContain("run: npm ci");
    expect(workflow).toContain("run: npm run lint");
    expect(workflow).toContain("run: npm run typecheck");
    expect(workflow).toContain("run: npm run test:unit");
    expect(workflow).toContain("run: npm run build");
    expect(workflow).toContain("run: npx playwright install --with-deps chromium");
    expect(workflow).toContain("run: npm run test:e2e");
    expect(packageJson.scripts["test:e2e"]).toBe("node scripts/run-e2e.mjs");
  });

  it("uses cancellation, read-only permissions, and no pull-request secrets", () => {
    expect(workflow).toMatch(/permissions:\s+contents: read/);
    expect(workflow).toContain("cancel-in-progress: true");
    expect(workflow).toContain("persist-credentials: false");
    expect(workflow).not.toContain("secrets.");
    expect(workflow).toContain("CONTACT_DELIVERY_MODE: development");
  });

  it("uploads only generated Playwright failure evidence", () => {
    expect(workflow).toContain("if: failure()");
    expect(workflow).toContain("playwright-report/");
    expect(workflow).toContain("test-results/");
    expect(workflow).toContain("include-hidden-files: false");
    expect(workflow).not.toContain(".private");
    expect(playwrightConfig).toContain('screenshot: "only-on-failure"');
    expect(playwrightConfig).toContain('trace: "retain-on-failure"');
    expect(playwrightConfig).toContain('video: "retain-on-failure"');
  });
});
