import type {
  PortfolioCommand,
  PortfolioCommandResolution,
  ScoredPortfolioCommand,
} from "@/types/portfolio-command";

export const blockedCommandMessage =
  "Private contact details, private CV content, configuration, and environment data are not available through this portfolio.";

export const unknownCommandMessage =
  "I couldn’t match that to a portfolio command. Try projects, skills, education, hobbies, résumé, or contact access.";

export function normalizeCommandText(value: string): string {
  return value
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en")
    .replaceAll("c++", "cpp")
    .replaceAll("c#", "csharp")
    .replaceAll(/[’']/g, "")
    .replaceAll(/[^a-z0-9]+/g, " ")
    .trim()
    .replaceAll(/\s+/g, " ");
}

const blockedPhrases = [
  "phone",
  "telephone",
  "mobile number",
  "email",
  "direct email",
  "email address",
  "contact details",
  "environment variable",
  "env var",
  "hidden configuration",
  "site configuration",
  "private cv",
  "private resume",
  "resume source",
  "api key",
  "access token",
  "password",
  "secret",
] as const;

export function isPrivateInformationAttempt(input: string): boolean {
  const normalized = normalizeCommandText(input);
  return blockedPhrases.some((phrase) => normalized.includes(phrase));
}

function levenshteinDistance(left: string, right: string): number {
  if (left === right) {
    return 0;
  }

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitution = previous[rightIndex - 1] +
        (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1);
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        substitution,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function projectQuery(input: string): string {
  return input
    .replace(/^(show|open|view|about|go to|tell me about)\s+(the\s+)?/, "")
    .replace(/\s+projects?$/, "")
    .trim();
}

function fuzzyProjectScore(command: PortfolioCommand, normalizedQuery: string): number {
  if (!command.fuzzyProjectTerms || normalizedQuery.length < 5) {
    return 0;
  }

  const query = projectQuery(normalizedQuery);
  if (query.length < 5) {
    return 0;
  }

  for (const rawTerm of command.fuzzyProjectTerms) {
    const term = normalizeCommandText(rawTerm);
    const maximumDistance = term.length >= 12 ? 2 : 1;
    if (
      Math.abs(query.length - term.length) <= maximumDistance &&
      levenshteinDistance(query, term) <= maximumDistance
    ) {
      return 60;
    }
  }

  return 0;
}

function scoreCommand(command: PortfolioCommand, normalizedQuery: string): number {
  const candidates = [command.label, ...command.synonyms].map(normalizeCommandText);

  if (candidates.includes(normalizedQuery)) {
    return 100;
  }

  if (normalizedQuery.length >= 2 && candidates.some((candidate) => candidate.startsWith(normalizedQuery))) {
    return 85;
  }

  if (normalizedQuery.length >= 3 && candidates.some((candidate) => candidate.includes(normalizedQuery))) {
    return 75;
  }

  const queryTokens = normalizedQuery.split(" ").filter((token) => token.length > 1);
  if (
    queryTokens.length > 0 &&
    candidates.some((candidate) => queryTokens.every((token) => candidate.includes(token)))
  ) {
    return 68;
  }

  return fuzzyProjectScore(command, normalizedQuery);
}

export function getCommandSuggestions(
  commands: readonly PortfolioCommand[],
  input: string,
  limit = 7,
): readonly ScoredPortfolioCommand[] {
  const normalizedQuery = normalizeCommandText(input);
  if (!normalizedQuery || isPrivateInformationAttempt(input)) {
    return [];
  }

  return commands
    .map((command) => ({ command, score: scoreCommand(command, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score ||
      left.command.label.localeCompare(right.command.label))
    .slice(0, limit);
}

export function resolvePortfolioCommand(
  commands: readonly PortfolioCommand[],
  input: string,
): PortfolioCommandResolution {
  if (isPrivateInformationAttempt(input)) {
    return { kind: "blocked", message: blockedCommandMessage, suggestions: [] };
  }

  if (normalizeCommandText(input).length === 0) {
    const suggestions = commands
      .filter(({ starter }) => starter)
      .map((command) => ({ command, score: 100 }));
    return {
      kind: "starter",
      message: `${suggestions.length} starter commands available.`,
      suggestions,
    };
  }

  const suggestions = getCommandSuggestions(commands, input);
  if (suggestions.length === 0) {
    return { kind: "unknown", message: unknownCommandMessage, suggestions: [] };
  }

  return {
    kind: "matches",
    message: `${suggestions.length} matching ${suggestions.length === 1 ? "command" : "commands"} available.`,
    suggestions,
  };
}
