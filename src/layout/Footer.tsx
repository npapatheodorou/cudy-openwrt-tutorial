import { contentUrl, REPO_URL } from '../lib/urls';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <a className="brand" href="#top">
            <img src={contentUrl('assets/icons/icon.svg')} width={34} height={34} alt="" />
            <span>
              Cudy<span className="plus">+</span>OpenWrt Tutorial
            </span>
          </a>
          <p>Community guide by Nikos Papatheodorou, released under the MIT License. Not affiliated with Cudy or the OpenWrt project.</p>
        </div>
        <nav aria-label="Footer">
          <a href="#guide">Guide</a>
          <a href="#downloads">Downloads</a>
          <a href="#tools">Tools</a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={contentUrl('LICENSE')}>License</a>
        </nav>
      </div>
    </footer>
  );
}
