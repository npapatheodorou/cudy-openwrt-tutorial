import { BookOpen, Download, Moon, Sun, Wrench } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { GitHubIcon } from '../components/icons';
import { toggleTheme } from '../lib/theme';
import { contentUrl, REPO_URL } from '../lib/urls';

export function Topbar() {
  const progressRef = useRef<HTMLSpanElement>(null);

  // Reading progress bar: updated imperatively to avoid re-rendering on scroll.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (progressRef.current) progressRef.current.style.width = `${max > 0 ? (doc.scrollTop / max) * 100 : 0}%`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <a className="brand" href="#top" aria-label="Cudy + OpenWrt Tutorial, back to top">
          <img src={contentUrl('assets/icons/icon.svg')} width={34} height={34} alt="" />
          <span className="brand-name">
            Cudy<span className="plus">+</span>OpenWrt <span className="brand-sub">Tutorial</span>
          </span>
        </a>
        <nav className="nav" aria-label="Main">
          <a href="#guide" className="nav-optional" aria-label="Guide">
            <BookOpen className="i" aria-hidden="true" />
            <span className="nav-text">Guide</span>
          </a>
          <a href="#downloads" aria-label="Downloads">
            <Download className="i" aria-hidden="true" />
            <span className="nav-text">Downloads</span>
          </a>
          <a href="#tools" className="nav-optional" aria-label="Tools">
            <Wrench className="i" aria-hidden="true" />
            <span className="nav-text">Tools</span>
          </a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository (opens in a new tab)">
            <GitHubIcon />
            <span className="nav-text">GitHub</span>
          </a>
        </nav>
        <button className="icon-btn" type="button" onClick={toggleTheme} aria-label="Toggle dark mode">
          <Moon className="i theme-moon" aria-hidden="true" />
          <Sun className="i theme-sun" aria-hidden="true" />
        </button>
        <span className="read-progress" ref={progressRef} aria-hidden="true" />
      </div>
    </header>
  );
}
