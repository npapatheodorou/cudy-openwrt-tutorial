import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { announce } from '../lib/a11y';
import { useGuide } from '../state/guide';

interface StepProps {
  id: string;
  badge: string;
  kicker: string;
  title: ReactNode;
  variant?: 'alt';
  /** Whether the step counts toward progress and gets a "Mark as done" toggle. */
  trackable?: boolean;
  children: ReactNode;
}

export function Step({ id, badge, kicker, title, variant, trackable = true, children }: StepProps) {
  const { done, toggleDone } = useGuide();
  const isDone = trackable && done.has(id);
  const titleId = `${id}-title`;

  return (
    <section className={isDone ? 'step is-done' : 'step'} id={id} aria-labelledby={titleId}>
      <header className="step-head">
        <div className={variant === 'alt' ? 'step-num alt' : 'step-num'} aria-hidden="true">
          {badge}
        </div>
        <div className="step-title">
          <p className="step-kicker">{kicker}</p>
          <h2 id={titleId}>{title}</h2>
        </div>
        {trackable && (
          <label className="done-toggle">
            <input
              type="checkbox"
              checked={isDone}
              onChange={() => {
                toggleDone(id);
                announce(isDone ? 'Step marked as not done' : 'Step marked as done');
              }}
            />
            <span className="box" aria-hidden="true">
              <Check className="i" strokeWidth={3} />
            </span>
            <span className="label">Mark as done</span>
          </label>
        )}
      </header>
      {children}
    </section>
  );
}
