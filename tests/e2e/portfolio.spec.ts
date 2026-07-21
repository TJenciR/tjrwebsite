import { expect, test, type Page } from "@playwright/test";

const desktopViewport = { width: 1_280, height: 900 };
const mobileViewport = { width: 390, height: 844 };

async function openCommandComposer(page: Page) {
  await page.getByRole("button", { name: "Open portfolio commands" }).click();
  const dialog = page.getByRole("dialog", { name: "Portfolio commands" });
  await expect(dialog).toBeVisible();
  return dialog.getByRole("combobox", { name: "Type a portfolio command" });
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize(desktopViewport);
});

test("1. overview loads", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", {
    level: 1,
    name: "Hello, I’m Tököli Jenő-Richard.",
  })).toBeVisible();
  await expect(page.getByRole("region", {
    name: "Hello, I’m Tököli Jenő-Richard.",
  }).getByText("Cluj-Napoca", { exact: true })).toBeVisible();
});

test("2. desktop navigation works", async ({ page }) => {
  await page.goto("/");
  const sidebar = page.getByTestId("workspace-sidebar");

  await sidebar.getByRole("link", { name: "About", exact: true }).click();

  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1, name: "About" })).toBeVisible();
});

test("3. sidebar collapse state persists and restores", async ({ page }) => {
  await page.goto("/");
  const sidebar = page.getByTestId("workspace-sidebar");

  await sidebar.getByRole("button", { name: "Collapse sidebar" }).click();
  await expect(sidebar).toHaveAttribute("data-collapsed", "true");
  await page.reload();
  await expect(sidebar).toHaveAttribute("data-collapsed", "true");

  await sidebar.getByRole("button", { name: "Expand sidebar" }).click();
  await expect(sidebar).toHaveAttribute("data-collapsed", "false");
});

test("4. mobile drawer opens and traps focus", async ({ page }) => {
  await page.setViewportSize(mobileViewport);
  await page.goto("/");

  await page.getByRole("button", { name: "Open navigation" }).click();
  const drawer = page.getByRole("dialog", { name: "Portfolio navigation" });
  const closeButton = drawer.getByRole("button", { name: "Close drawer" });
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(drawer.locator(":focus")).toHaveCount(1);
  await expect(closeButton).not.toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();
});

test("5. mobile drawer closes with Escape and restores focus", async ({ page }) => {
  await page.setViewportSize(mobileViewport);
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Open navigation" });

  await opener.click();
  await expect(page.getByRole("dialog", { name: "Portfolio navigation" })).toBeVisible();
  await page.keyboard.press("Escape");

  await expect(page.getByRole("dialog", { name: "Portfolio navigation" })).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("6. a featured project opens", async ({ page }) => {
  await page.goto("/");
  const card = page.getByRole("article").filter({
    has: page.getByRole("heading", { name: "RepairPass Architecture" }),
  });
  await expect(card).toHaveCount(1);

  await card.getByRole("link", { name: "View project details" }).click();

  await expect(page).toHaveURL(/\/work\/repairpass-architecture$/);
  await expect(page.getByRole("heading", { level: 1, name: "RepairPass Architecture" })).toBeVisible();
});

test("7. project filtering is URL-backed and deterministic", async ({ page }) => {
  await page.goto("/work");

  await page.getByRole("searchbox", { name: "Search projects" }).fill("Pathfinder");
  await page.getByRole("button", { name: "Apply filters" }).click();

  await expect(page).toHaveURL(/q=Pathfinder/);
  await expect(page.locator(".project-result-count")).toHaveText("1 project");
});

test("8. RepairPass is labelled work in progress", async ({ page }) => {
  await page.goto("/work/repairpass-architecture");

  await expect(page.getByText("Work in progress", { exact: true })).toHaveCount(2);
  await expect(page.getByText(
    "Implemented and planned functionality are being verified separately before publication.",
  )).toBeVisible();
});

test("9. an invalid project route shows a useful state", async ({ page }) => {
  const response = await page.goto("/work/not-a-real-project");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Return home" })).toBeVisible();
});

test("10. a known command navigates correctly", async ({ page }) => {
  await page.goto("/");
  const input = await openCommandComposer(page);

  await input.fill("show Python projects");
  await input.press("Enter");

  await expect(page).toHaveURL(/\/work\?technology=Python$/);
  await expect(page.getByRole("heading", { level: 1, name: "Projects and case studies" })).toBeVisible();
});

test("11. an unknown command offers fixed guidance", async ({ page }) => {
  await page.goto("/");
  const input = await openCommandComposer(page);

  await input.fill("make coffee");

  await expect(page.getByText("Command not found", { exact: true })).toBeVisible();
  await expect(page.getByText(
    "I couldn’t match that to a portfolio command. Try projects, skills, education, hobbies, résumé, or contact access.",
  )).toBeVisible();
});

test("12. the résumé excludes public direct-contact links", async ({ page }) => {
  await page.goto("/resume");

  await expect(page.getByText("Private contact information is not included", { exact: true })).toBeVisible();
  await expect(page.locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator('meta[content*="@"]')).toHaveCount(0);
});

test("13. contact client validation displays field guidance", async ({ page }) => {
  await page.route("**/api/contact-request", async (route) => {
    expect(route.request().method()).toBe("POST");
    await route.fulfill({
      contentType: "application/json",
      status: 400,
      body: JSON.stringify({
        ok: false,
        state: "validation-error",
        message: "Review the highlighted fields and submit the request again.",
        fieldErrors: {
          fullName: "Enter a full name.",
          professionalEmail: "Enter a valid professional email.",
        },
      }),
    });
  });
  await page.goto("/contact-access");

  await page.getByRole("button", { name: "Submit request" }).click();

  await expect(page.getByText("Review the form", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Full name").locator("..")).toContainText("Enter a full name.");
  await expect(page.getByLabel("Professional email").locator("..")).toContainText(
    "Enter a valid professional email.",
  );
});

test("14. contact browser tests use a mock and never call an email provider", async ({ page }) => {
  let clientRequests = 0;
  let providerRequests = 0;
  page.on("request", (request) => {
    if (request.url().startsWith("https://api.resend.com/")) {
      providerRequests += 1;
    }
  });
  await page.route("**/api/contact-request", async (route) => {
    clientRequests += 1;
    await route.fulfill({
      contentType: "application/json",
      status: 200,
      body: JSON.stringify({
        ok: true,
        state: "submitted",
        message: "Request received for manual review. No automatic access has been granted.",
      }),
    });
  });
  await page.goto("/contact-access");

  await page.getByLabel("Full name").fill("End-to-end Test");
  await page.getByLabel("Professional email").fill("e2e@example.test");
  await page.getByLabel("Company or organization").fill("Automated test organization");
  await page.getByLabel("Opportunity type").selectOption("professional-collaboration");
  await page.getByLabel("Message or reason for contact").fill(
    "This deterministic browser-test message is not delivered or retained.",
  );
  await page.getByLabel(/I consent to the submitted information/).check();
  await page.getByRole("button", { name: "Submit request" }).click();

  await expect(page.getByText("Request submitted", { exact: true })).toBeVisible();
  expect(clientRequests).toBe(1);
  expect(providerRequests).toBe(0);
});

test("15. reduced-motion preference disables shell transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByTestId("workspace-sidebar")).toHaveCSS("transition-duration", "0s");
  await expect(page.getByTestId("workspace-sidebar")).toHaveCSS("animation-name", "none");
});

test("16. legacy routes use their documented response behavior", async ({ request }) => {
  const alias = await request.get("/about.html?source=e2e", { maxRedirects: 0 });
  expect(alias.status()).toBe(308);
  expect(alias.headers().location).toMatch(/\/about\?source=e2e$/);

  const resume = await request.get("/CV.pdf", { maxRedirects: 0 });
  expect(resume.status()).toBe(308);
  expect(resume.headers().location).toMatch(/\/resume$/);

  const retiredQualification = await request.get("/bacdipl.pdf", { maxRedirects: 0 });
  expect(retiredQualification.status()).toBe(410);
});

test("17. primary content has no horizontal overflow at key widths", async ({ page }) => {
  for (const width of [320, 768, 1_440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/work"]) {
      await page.goto(path);
      expect(await page.evaluate(() => (
        document.documentElement.scrollWidth <= document.documentElement.clientWidth
      ))).toBe(true);
    }
  }
});

test("18. primary pages have specific titles", async ({ page }) => {
  const pages = [
    ["/", "Overview"],
    ["/about", "About — Tököli Jenő-Richard"],
    ["/work", "Projects — Tököli Jenő-Richard"],
    ["/skills", "Skills — Tököli Jenő-Richard"],
    ["/education", "Education — Tököli Jenő-Richard"],
    ["/resume", "Résumé — Tököli Jenő-Richard"],
    ["/contact-access", "Contact Access — Tököli Jenő-Richard"],
  ] as const;

  for (const [path, title] of pages) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
  }
});

test("19. missing sanitized résumé file has an explicit disabled state", async ({ page }) => {
  await page.goto("/resume");

  await expect(page.getByText("Sanitized résumé file is not available", { exact: true })).toBeVisible();
  await expect(page.getByText("Download unavailable", { exact: true })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await expect(page.getByRole("link", { name: "Download sanitized résumé" })).toHaveCount(0);
});

test("20. development-only design-system page is unavailable and noindex", async ({ page }) => {
  const response = await page.goto("/design-system");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  expect(await page.locator('meta[name="robots"][content*="noindex"]').count()).toBeGreaterThan(0);
});
