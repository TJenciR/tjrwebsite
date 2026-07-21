"use client";

import { useState } from "react";

import {
  Button,
  Checkbox,
  Dialog,
  Drawer,
  Input,
  StatusNotice,
  Textarea,
} from "@/components/ui";

export function ShowcaseInteractions() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="showcase-interactions">
      <div className="showcase-row">
        <Button icon="command" onClick={() => setDialogOpen(true)}>
          Open dialog
        </Button>
        <Button icon="menu" onClick={() => setDrawerOpen(true)} variant="secondary">
          Open drawer
        </Button>
      </div>

      <Dialog
        description="Keyboard focus stays inside while this modal is open. Escape closes it."
        footer={
          <>
            <Button onClick={() => setDialogOpen(false)} variant="ghost">Cancel</Button>
            <Button onClick={() => setDialogOpen(false)}>Confirm example</Button>
          </>
        }
        onOpenChange={setDialogOpen}
        open={dialogOpen}
        title="Dialog example"
      >
        <div className="showcase-form-stack">
          <Input label="Example field" placeholder="Enter a value" />
          <Textarea label="Example notes" placeholder="Add optional context" />
          <Checkbox
            description="This demonstrates a labelled native checkbox."
            label="Confirm example state"
          />
        </div>
      </Dialog>

      <Drawer
        description="A modal navigation shell for compact layouts."
        footer={<Button onClick={() => setDrawerOpen(false)} variant="secondary">Close drawer</Button>}
        onOpenChange={setDrawerOpen}
        open={drawerOpen}
        title="Workspace navigation"
      >
        <StatusNotice title="Keyboard behavior included" variant="info">
          Focus is trapped here and returns to the trigger after dismissal.
        </StatusNotice>
      </Drawer>
    </div>
  );
}
