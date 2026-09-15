import { Info, ShieldCheck, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Tone = 'info' | 'tip' | 'warn';

const DEFAULT_ICONS: Record<Tone, LucideIcon> = { info: Info, tip: ShieldCheck, warn: TriangleAlert };

interface CalloutProps {
  tone?: Tone;
  icon?: LucideIcon;
  id?: string;
  children: ReactNode;
}

export function Callout({ tone = 'info', icon, id, children }: CalloutProps) {
  const Icon = icon ?? DEFAULT_ICONS[tone];
  return (
    <div className={`callout ${tone}`} id={id} role={tone === 'warn' ? 'note' : undefined}>
      <Icon className="i" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
