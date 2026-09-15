import { Images, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Callout } from '../components/Callout';
import { useGuide } from '../state/guide';

export function GuideIntro() {
  const { setAllScreenshots } = useGuide();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="guide-intro">
      <p className="kicker">The guide</p>
      <h2 id="guide-title">Step-by-step setup</h2>
      <p>
        Steps 1–3 are the same for everyone. After that, choose the <strong>Beginner</strong> path (point-and-click in the web
        interface) or the <strong>Advanced</strong> path (commands over SSH).
      </p>
      <Callout tone="tip" icon={ShoppingCart} id="buying">
        <p>
          <strong>🛒 Buying Suggestion:</strong> Prefer the Cudy WR3000E over other WR3000 variants if you plan to install OpenWrt — it
          offers significantly more memory, supports Wi-Fi 6, and overall provides excellent value for money (VFM)
        </p>
      </Callout>
      <div className="intro-actions">
        <button
          className="btn btn-ghost btn-sm"
          type="button"
          aria-pressed={expanded}
          onClick={() => {
            setExpanded(!expanded);
            setAllScreenshots(!expanded);
          }}
        >
          <Images className="i" aria-hidden="true" />
          {expanded ? 'Collapse all screenshots' : 'Expand all screenshots'}
        </button>
      </div>
    </div>
  );
}
