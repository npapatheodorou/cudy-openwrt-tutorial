import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ALL_STEP_IDS, isGuidePath, pathForId, type GuidePath } from '../content/steps';
import type { PlaceholderValues } from '../lib/highlight';
import { storage } from '../lib/storage';

interface GuideContextValue {
  path: GuidePath;
  setPath: (path: GuidePath) => void;
  done: ReadonlySet<string>;
  toggleDone: (id: string) => void;
  resetProgress: () => void;
  /** Values typed into the Wi-Fi / WireGuard helpers. Kept in memory only, never stored. */
  placeholders: PlaceholderValues;
  setPlaceholders: (values: PlaceholderValues) => void;
  /** Bumped by "expand/collapse all screenshots"; each screenshot follows the latest request. */
  screenshots: { open: boolean; version: number };
  setAllScreenshots: (open: boolean) => void;
  /** Scroll to a section, switching to the path that contains it first. */
  goTo: (id: string) => void;
}

const GuideContext = createContext<GuideContextValue | null>(null);

export function GuideProvider({ children }: { children: ReactNode }) {
  const [path, setPathState] = useState<GuidePath>(() => {
    const saved = storage.get('path');
    return isGuidePath(saved) ? saved : 'beginner';
  });
  const [done, setDone] = useState<ReadonlySet<string>>(
    () => new Set(ALL_STEP_IDS.filter((id) => storage.get(`done.${id}`) === '1')),
  );
  const [placeholders, setPlaceholderState] = useState<PlaceholderValues>({});
  const [screenshots, setScreenshots] = useState({ open: false, version: 0 });
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  const setPath = useCallback((next: GuidePath) => {
    setPathState(next);
    storage.set('path', next);
  }, []);

  const toggleDone = useCallback(
    (id: string) => {
      const next = new Set(done);
      if (next.has(id)) {
        next.delete(id);
        storage.remove(`done.${id}`);
      } else {
        next.add(id);
        storage.set(`done.${id}`, '1');
      }
      setDone(next);
    },
    [done],
  );

  const resetProgress = useCallback(() => {
    for (const id of ALL_STEP_IDS) storage.remove(`done.${id}`);
    setDone(new Set());
  }, []);

  const setPlaceholders = useCallback((values: PlaceholderValues) => {
    setPlaceholderState((previous) => ({ ...previous, ...values }));
  }, []);

  const setAllScreenshots = useCallback((open: boolean) => {
    setScreenshots((previous) => ({ open, version: previous.version + 1 }));
  }, []);

  const goTo = useCallback(
    (id: string) => {
      const targetPath = pathForId(id);
      if (targetPath) setPath(targetPath);
      setScrollTarget(id);
      if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
    },
    [setPath],
  );

  // Scroll once the target is rendered (and visible, if its path was just switched on).
  useEffect(() => {
    if (!scrollTarget) return;
    document.getElementById(scrollTarget)?.scrollIntoView({ block: 'start' });
    setScrollTarget(null);
  }, [scrollTarget]);

  // Deep links: honour the hash on load and on back/forward navigation.
  useEffect(() => {
    const syncFromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      const targetPath = pathForId(id);
      if (targetPath) setPath(targetPath);
      setScrollTarget(id);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [setPath]);

  // In-page links into the hidden path would otherwise go nowhere.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const id = decodeURIComponent(link.hash.slice(1));
      if (!id || !pathForId(id)) return;
      event.preventDefault();
      goTo(id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [goTo]);

  const value = useMemo<GuideContextValue>(
    () => ({ path, setPath, done, toggleDone, resetProgress, placeholders, setPlaceholders, screenshots, setAllScreenshots, goTo }),
    [path, setPath, done, toggleDone, resetProgress, placeholders, setPlaceholders, screenshots, setAllScreenshots, goTo],
  );

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export function useGuide(): GuideContextValue {
  const context = useContext(GuideContext);
  if (!context) throw new Error('useGuide must be used inside <GuideProvider>');
  return context;
}
