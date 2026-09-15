import readme from '../../README.md?raw';
import { parseCodeBlocks, type SnippetId } from './snippets';

export interface Snippet {
  lang: string;
  code: string;
}

const snippets = new Map<string, Snippet>();
for (const block of parseCodeBlocks(readme)) {
  if (block.id) snippets.set(block.id, { lang: block.lang, code: block.code });
}

export function getSnippet(id: SnippetId): Snippet {
  const snippet = snippets.get(id);
  if (!snippet) throw new Error(`README.md has no <!-- snippet: ${id} --> code block`);
  return snippet;
}
