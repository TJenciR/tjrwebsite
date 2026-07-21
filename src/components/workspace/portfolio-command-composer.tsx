"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Icon } from "@/components/icons";
import { CommandInput, Dialog } from "@/components/ui";
import { portfolioCommands } from "@/content/portfolio-commands";
import { resolvePortfolioCommand } from "@/lib/command-matcher";
import type { PortfolioCommand } from "@/types/portfolio-command";

interface PortfolioCommandComposerProps {
  commands?: readonly PortfolioCommand[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function PortfolioCommandComposer({
  commands = portfolioCommands,
  onOpenChange,
  open,
}: PortfolioCommandComposerProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const resolution = useMemo(
    () => resolvePortfolioCommand(commands, query),
    [commands, query],
  );
  const suggestions = resolution.suggestions;
  const activeSuggestion = suggestions[activeIndex] ?? suggestions[0];
  const listboxId = "portfolio-command-options";
  const activeOptionId = activeSuggestion
    ? `portfolio-command-${activeSuggestion.command.id}`
    : undefined;
  const announcement = activeSuggestion
    ? `${resolution.message} ${activeSuggestion.command.label} selected. ${activeSuggestion.command.response}`
    : "";

  const changeOpen = useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      setQuery("");
      setActiveIndex(0);
    }
    onOpenChange(nextOpen);
  }, [onOpenChange]);

  function executeCommand(selectedCommand: PortfolioCommand) {
    changeOpen(false);
    router.push(selectedCommand.action.href);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length);
      return;
    }

    if (event.key === "Enter" && activeSuggestion) {
      event.preventDefault();
      executeCommand(activeSuggestion.command);
    }
  }

  return (
    <Dialog
      className="workspace-command-dialog"
      description="Local, deterministic navigation built from verified portfolio content."
      initialFocusRef={inputRef}
      onOpenChange={changeOpen}
      open={open}
      title="Portfolio commands"
    >
      <div className="workspace-command-composer">
        <CommandInput
          aria-activedescendant={activeOptionId}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={suggestions.length > 0}
          autoComplete="off"
          hint="Esc"
          label="Type a portfolio command"
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Type a command or search…"
          ref={inputRef}
          role="combobox"
          spellCheck={false}
          value={query}
        />

        <p aria-atomic="true" aria-live="polite" className="ds-visually-hidden">
          {announcement}
        </p>

        {resolution.kind === "blocked" || resolution.kind === "unknown" ? (
          <div className="workspace-command-empty" role="status">
            <Icon name={resolution.kind === "blocked" ? "lock" : "info"} />
            <div>
              <strong>{resolution.kind === "blocked" ? "That information is private" : "Command not found"}</strong>
              <p>{resolution.message}</p>
            </div>
          </div>
        ) : (
          <div className="workspace-command-results">
            <p className="workspace-command-section-label">
              {resolution.kind === "starter" ? "Starter prompts" : "Matching commands"}
            </p>
            <div aria-label="Portfolio command suggestions" id={listboxId} role="listbox">
              {suggestions.map(({ command: suggestedCommand }, index) => (
                <button
                  aria-selected={index === activeIndex}
                  className="workspace-command-option"
                  id={`portfolio-command-${suggestedCommand.id}`}
                  key={suggestedCommand.id}
                  onClick={() => executeCommand(suggestedCommand)}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  tabIndex={-1}
                  type="button"
                >
                  <Icon name={suggestedCommand.icon} />
                  <span>
                    <strong>{suggestedCommand.label}</strong>
                    <small>{suggestedCommand.response}</small>
                  </span>
                  <kbd aria-hidden="true">Enter</kbd>
                </button>
              ))}
            </div>
          </div>
        )}

        <footer className="workspace-command-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>Enter</kbd> Open</span>
          <span>Runs locally · deterministic</span>
        </footer>
      </div>
    </Dialog>
  );
}
