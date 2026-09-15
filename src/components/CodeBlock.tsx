import { Check, Copy } from 'lucide-react';
import { Fragment, useMemo } from 'react';
import { getSnippet } from '../content/readme';
import type { SnippetId } from '../content/snippets';
import { useCopy } from '../hooks/useCopy';
import { fillPlaceholders, tokenizeLines, type PlaceholderValues, type Token } from '../lib/highlight';
import { useGuide } from '../state/guide';

interface CodeBlockProps {
  code: string;
  lang: string;
  /** Header label; defaults to the language. */
  title?: string;
  /** Shown instead of code while `code` is empty. */
  emptyText?: string;
}

function TokenView({ token, values }: { token: Token; values: PlaceholderValues }) {
  if (token.type === 'comment') return <span className="tok-c">{token.value}</span>;
  if (token.type === 'text') return token.value;
  const value = values[token.name];
  return <span className={value ? 'ph filled' : 'ph'}>{value || `<${token.name}>`}</span>;
}

export function CodeBlock({ code, lang, title, emptyText }: CodeBlockProps) {
  const { placeholders } = useGuide();
  const { status, copy } = useCopy();
  const lines = useMemo(() => tokenizeLines(code, lang), [code, lang]);
  const label = title ?? lang;

  return (
    <div className="code">
      <div className="code-head">
        <span className="code-lang">{label}</span>
        <button
          type="button"
          className={status === 'copied' ? 'copy-btn ok' : 'copy-btn'}
          onClick={() => copy(fillPlaceholders(code, placeholders))}
          disabled={!code}
        >
          {status === 'copied' ? <Check className="i" aria-hidden="true" /> : <Copy className="i" aria-hidden="true" />}
          <span>{status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy'}</span>
        </button>
      </div>
      <pre tabIndex={0} aria-label={`${label} code`}>
        <code>
          {code ? (
            lines.map((tokens, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && '\n'}
                {tokens.map((token, tokenIndex) => (
                  <TokenView key={tokenIndex} token={token} values={placeholders} />
                ))}
              </Fragment>
            ))
          ) : (
            <span className="code-empty">{emptyText}</span>
          )}
        </code>
      </pre>
    </div>
  );
}

/** A command block taken verbatim from README.md. */
export function Snippet({ id, title }: { id: SnippetId; title?: string }) {
  const { code, lang } = getSnippet(id);
  return <CodeBlock code={code} lang={lang} title={title} />;
}
