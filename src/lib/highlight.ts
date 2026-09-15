/** Placeholders in README snippets that the website's helpers can fill in. */
export const PLACEHOLDERS = [
  'WIFI_NAME',
  'WIFI_PASS',
  'PRIVATE_KEY',
  'ADDRESS',
  'DNS',
  'PEER_PUBLIC_KEY',
  'ENDPOINT_HOST',
] as const;

export type Placeholder = (typeof PLACEHOLDERS)[number];
export type PlaceholderValues = Partial<Record<Placeholder, string>>;

export type Token =
  | { type: 'text'; value: string }
  | { type: 'comment'; value: string }
  | { type: 'placeholder'; name: Placeholder };

const COMMENT_LANGS = new Set(['sh', 'bash', 'shell', 'powershell']);
const PLACEHOLDER_PATTERN = new RegExp(`<(${PLACEHOLDERS.join('|')})>`, 'g');

/** Index where a `#` comment starts in a shell line, ignoring `#` inside quotes or words; -1 if none. */
export function commentStart(line: string): number {
  let quote: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }
    if (ch === '#' && (i === 0 || /\s/.test(line[i - 1] ?? ''))) return i;
  }
  return -1;
}

function splitPlaceholders(text: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of text.matchAll(PLACEHOLDER_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ type: 'text', value: text.slice(last, index) });
    tokens.push({ type: 'placeholder', name: match[1] as Placeholder });
    last = index + match[0].length;
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
  return tokens;
}

/** Split a snippet into lines of tokens: plain text, fillable placeholders and shell comments. */
export function tokenizeLines(code: string, lang: string): Token[][] {
  const highlightComments = COMMENT_LANGS.has(lang);
  return code.split('\n').map((line) => {
    const index = highlightComments ? commentStart(line) : -1;
    if (index < 0) return splitPlaceholders(line);
    return [...splitPlaceholders(line.slice(0, index)), { type: 'comment', value: line.slice(index) }];
  });
}

/** Replace placeholders that have a value; unknown or empty ones stay as `<NAME>`. */
export function fillPlaceholders(code: string, values: PlaceholderValues): string {
  return code.replace(PLACEHOLDER_PATTERN, (whole, name: Placeholder) => values[name] || whole);
}
