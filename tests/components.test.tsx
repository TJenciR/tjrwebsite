import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  IconButton,
  Input,
  Skeleton,
  Textarea,
} from "@/components/ui";

describe("component variants", () => {
  it("applies typed button, badge, and card variants", () => {
    render(
      <>
        <Button variant="danger">Remove</Button>
        <Badge variant="success">Ready</Badge>
        <Card data-testid="card" variant="interactive">Interactive card</Card>
      </>,
    );

    expect(screen.getByRole("button", { name: "Remove" })).toHaveClass("ds-button--danger");
    expect(screen.getByText("Ready").closest("span.ds-badge")).toHaveClass("ds-badge--success");
    expect(screen.getByTestId("card")).toHaveClass("ds-card--interactive");
  });

  it("requires and renders an accessible name for icon-only controls", () => {
    render(<IconButton icon="settings" label="Open settings" />);

    expect(screen.getByRole("button", { name: "Open settings" })).toBeInTheDocument();
  });
});

describe("disabled controls", () => {
  it("preserves native disabled behavior for buttons and form controls", () => {
    render(
      <>
        <Button disabled>Disabled action</Button>
        <Input disabled label="Disabled input" />
        <Textarea disabled label="Disabled textarea" />
        <Checkbox disabled label="Disabled checkbox" />
      </>,
    );

    expect(screen.getByRole("button", { name: "Disabled action" })).toBeDisabled();
    expect(screen.getByLabelText("Disabled input")).toBeDisabled();
    expect(screen.getByLabelText("Disabled textarea")).toBeDisabled();
    expect(screen.getByLabelText("Disabled checkbox")).toBeDisabled();
  });
});

function DialogHarness() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch dialog</Button>
      <Dialog onOpenChange={setOpen} open={open} title="Keyboard dialog">
        <Input label="Dialog field" />
        <Button>Last action</Button>
      </Dialog>
    </>
  );
}

describe("focus and dialog keyboard behavior", () => {
  it("shows a global focus-visible treatment", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/globals.css"), "utf8");

    expect(css).toContain(":focus-visible");
    expect(css).toContain("--color-focus-ring");
  });

  it("closes on Escape and restores focus to the opener", async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);

    const opener = screen.getByRole("button", { name: "Launch dialog" });
    await user.click(opener);

    expect(screen.getByRole("dialog", { name: "Keyboard dialog" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Keyboard dialog" })).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("wraps Tab focus inside the dialog", async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);
    await user.click(screen.getByRole("button", { name: "Launch dialog" }));

    const close = screen.getByRole("button", { name: "Close dialog" });
    const last = screen.getByRole("button", { name: "Last action" });
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    expect(close).toHaveFocus();
  });
});

describe("reduced motion", () => {
  it("renders motion-aware loading feedback and disables animation in reduced-motion CSS", () => {
    render(<Skeleton label="Loading projects" />);
    const skeleton = screen.getByRole("status", { name: "Loading projects" });
    const css = readFileSync(resolve(process.cwd(), "src/styles/globals.css"), "utf8");

    expect(skeleton).toHaveAttribute("data-motion", "respects-user-preference");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("animation-duration: 0.01ms !important");
  });
});
