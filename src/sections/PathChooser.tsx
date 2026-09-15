import type { ReactNode } from 'react';
import { PATHS, type GuidePath } from '../content/steps';
import { announce } from '../lib/a11y';
import { useGuide } from '../state/guide';

const DESCRIPTIONS: Record<GuidePath, ReactNode> = {
  beginner: <>Setup using Interface: click through LuCI in your browser, with screenshots.</>,
  advanced: (
    <>
      Setup using SSH Connection: copy-paste <code>uci</code> commands, plus kill switch, PBR and IPv6.
    </>
  ),
};

export function PathChooser() {
  const { path, setPath } = useGuide();

  return (
    <section className="path-choose" id="path" aria-labelledby="path-title">
      <p className="kicker">Next</p>
      <h2 id="path-title">Choose your setup path</h2>
      <p className="muted">Both paths get you to the same place. Pick the one you're comfortable with. You can switch any time.</p>
      <div className="path-grid">
        {(Object.keys(PATHS) as GuidePath[]).map((key) => (
          <button
            key={key}
            className="path-card"
            type="button"
            aria-pressed={path === key}
            onClick={() => {
              setPath(key);
              announce(`${PATHS[key].title} path selected`);
            }}
          >
            <span className="radio" aria-hidden="true" />
            <span className="emoji" aria-hidden="true">
              {PATHS[key].emoji}
            </span>
            <b>{PATHS[key].title}</b>
            <span>{DESCRIPTIONS[key]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/** Wrapper for one path's steps; the inactive path stays mounted (keeps helper input) but hidden. */
export function PathPanel({ path, children }: { path: GuidePath; children: ReactNode }) {
  const { path: current } = useGuide();
  return (
    <div className="path-panel" hidden={current !== path}>
      <p className="path-banner">
        <span aria-hidden="true">{PATHS[path].emoji}</span>
        <span>
          <b>{PATHS[path].title}</b> ({PATHS[path].subtitle})
        </span>
      </p>
      {children}
    </div>
  );
}
