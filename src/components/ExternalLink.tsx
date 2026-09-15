import { ExternalLink as ExternalIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/** Opens in a new tab so the guide stays open alongside the external page. */
export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ExternalIcon className="i ext-icon" aria-hidden="true" />
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
