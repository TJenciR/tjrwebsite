# Portfolio command composer

## Purpose

The workspace command composer is deterministic navigation, not an AI or LLM
feature. It helps visitors reach verified project filters, project records, and
portfolio sections without creating new factual content.

The server builds `portfolioCommands` from published content. The root layout
passes only the sanitized command records into the client shell. Internal notes,
unpublished values, private contact details, and source documents are not part of
the registry.

## Matching contract

- Command IDs, labels, synonyms, responses, icons, and actions are typed.
- Matching is case-insensitive and ignores accents and ordinary punctuation.
- Exact matches rank above prefixes, contained phrases, and token matches.
- Fuzzy matching is limited to the three supported project names. It accepts at
  most one edit for shorter names or two edits for long names; it is not applied
  to arbitrary input.
- Empty input shows the curated starter prompts.
- Unknown input returns fixed help copy and never invents an answer.

Every action is a fixed same-origin route or URL-backed project filter. The
entered query is never included in a destination URL.

## Privacy and data handling

Raw command text exists only in component state while the dialog is open. The
composer does not use network requests, browser storage, logging, telemetry, or
analytics. Closing the dialog clears the input.

Attempts to request phone, direct email, private CV, hidden configuration,
environment, credential, or secret data receive a fixed refusal. Do not add a
command response that exposes unpublished source fields or private files.

The public contact command opens `/contact-access`; it does not provide contact
details. The résumé command opens the privacy-safe web résumé.

## Interaction and accessibility

- Ctrl/Cmd+K and all shell command triggers open the same composer.
- Initial focus moves to the labelled combobox.
- Up and Down arrows change the active suggestion while focus stays in the input.
- Enter runs the selected fixed action.
- Escape and the overlay dismiss the dialog and restore focus.
- A polite live region announces result counts, the active command, and its local
  response.
- On narrow screens the shared modal layer presents the composer as a bottom
  sheet with a bounded, scrollable result list.
- Reduced-motion preferences remove suggestion transitions.

## Extending commands

1. Confirm the source fact and publication state in the typed content system.
2. Add a `PortfolioCommandId` and one registry entry with a fixed local action.
3. Use only published values when generating response text.
4. Add matching, action, keyboard, and privacy regression tests as applicable.
5. Run lint, typecheck, tests, and the production build.
