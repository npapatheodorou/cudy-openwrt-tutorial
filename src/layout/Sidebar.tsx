import { BookOpen, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { COMMON_STEPS, PATH_STEPS, PATHS, type GuidePath, type StepMeta } from '../content/steps';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { announce } from '../lib/a11y';
import { useGuide } from '../state/guide';

function TocLink({ step, active, done, onNavigate }: { step: StepMeta; active: boolean; done: boolean; onNavigate: () => void }) {
  const className = [active && 'active', done && 'is-done'].filter(Boolean).join(' ') || undefined;
  return (
    <li>
      <a href={`#${step.id}`} className={className} aria-current={active ? 'location' : undefined} onClick={onNavigate}>
        <span className="n" aria-hidden="true">
          {step.badge}
        </span>
        {step.label}
        {done && <span className="visually-hidden"> (done)</span>}
      </a>
    </li>
  );
}

export function Sidebar() {
  const { path, setPath, done, resetProgress } = useGuide();
  const wide = useMediaQuery('(min-width: 1001px)');
  const [tocOpen, setTocOpen] = useState(false);

  const tracked = [...COMMON_STEPS, ...PATH_STEPS[path]];
  const doneCount = tracked.filter((step) => done.has(step.id)).length;
  const percent = Math.round((doneCount / tracked.length) * 100);

  const spyIds = useMemo(() => [...COMMON_STEPS.map((s) => s.id), 'path', ...PATH_STEPS[path].map((s) => s.id), 'done'], [path]);
  const active = useScrollSpy(spyIds);

  const closeOnMobile = () => {
    if (!wide) setTocOpen(false);
  };

  const choosePath = (next: GuidePath) => {
    setPath(next);
    announce(`${PATHS[next].title} path selected`);
    document.getElementById('path')?.scrollIntoView({ block: 'start' });
  };

  const renderLinks = (steps: StepMeta[]) =>
    steps.map((step) => (
      <TocLink key={step.id} step={step} active={active === step.id} done={done.has(step.id)} onNavigate={closeOnMobile} />
    ));

  return (
    <aside className="sidebar" aria-label="Guide navigation">
      <div className="progress-card">
        <div className="progress-top">
          <span>Your progress</span>
          {doneCount > 0 && (
            <button type="button" onClick={() => { resetProgress(); announce('Progress reset'); }}>
              Reset
            </button>
          )}
        </div>
        <div className="bar" role="progressbar" aria-label="Guide progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
          <i style={{ width: `${percent}%` }} />
        </div>
        <p className="progress-text">
          {doneCount === 0
            ? 'Tick “Mark as done” on each step as you go.'
            : doneCount === tracked.length
              ? `All ${doneCount} steps done — nice work!`
              : `${doneCount} of ${tracked.length} steps done`}
        </p>
        <div className="seg" role="group" aria-label="Setup path">
          {(Object.keys(PATHS) as GuidePath[]).map((key) => (
            <button key={key} type="button" aria-pressed={path === key} onClick={() => choosePath(key)}>
              {PATHS[key].emoji} {PATHS[key].title === 'Beginners' ? 'Beginner' : PATHS[key].title}
            </button>
          ))}
        </div>
      </div>

      <details className="toc-details" open={wide || tocOpen} onToggle={(event) => !wide && setTocOpen(event.currentTarget.open)}>
        <summary>
          <BookOpen className="i" aria-hidden="true" /> On this page <ChevronRight className="i chev" aria-hidden="true" />
        </summary>
        <nav className="toc" aria-label="Guide contents">
          <p className="toc-label">Everyone</p>
          <ol>
            {renderLinks(COMMON_STEPS)}
            <TocLink step={{ id: 'path', badge: '⇄', label: 'Choose your path' }} active={active === 'path'} done={false} onNavigate={closeOnMobile} />
          </ol>
          <p className="toc-label">
            {PATHS[path].emoji} {PATHS[path].title} · {path === 'beginner' ? 'Interface' : 'SSH'}
          </p>
          <ol>{renderLinks(PATH_STEPS[path])}</ol>
          <p className="toc-label">Finish</p>
          <ol>
            <TocLink step={{ id: 'done', badge: '🎉', label: 'Done!' }} active={active === 'done'} done={false} onNavigate={closeOnMobile} />
          </ol>
        </nav>
      </details>
    </aside>
  );
}
