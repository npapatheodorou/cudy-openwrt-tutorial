import { ArrowRight, Globe, Lock, Monitor, Route, ShieldCheck, Zap, type LucideIcon } from 'lucide-react';
import type { GuidePath } from '../content/steps';
import { useGuide } from '../state/guide';

interface Feature {
  href: (path: GuidePath) => string;
  icon: LucideIcon;
  tone?: 'blue';
  title: string;
  text: string;
  step: string;
}

const FEATURES: Feature[] = [
  { href: () => '#step-2', icon: Zap, title: 'OpenWrt installed', text: "Swap Cudy's stock firmware for OpenWrt.", step: 'Step 2' },
  { href: () => '#step-3', icon: Monitor, tone: 'blue', title: 'LuCI Web UI', text: 'Add a web interface to the SNAPSHOT build.', step: 'Step 3' },
  { href: (path) => `#${path}-step-4`, icon: ShieldCheck, title: 'Adblock filtering', text: 'Block ads and trackers for every device on your network.', step: 'Step 4' },
  { href: (path) => `#${path}-step-5`, icon: Lock, tone: 'blue', title: 'WireGuard VPN', text: 'Send your LAN through a VPN provider, with a kill switch.', step: 'Step 5' },
  { href: () => '#advanced-step-5-1', icon: Route, title: 'VPN whitelisting', text: 'Choose which devices, sites or ports skip the VPN.', step: 'Step 5.1' },
  { href: () => '#advanced-step-6', icon: Globe, tone: 'blue', title: 'IPv6 control', text: 'Turn IPv6 off completely, or back on.', step: 'Step 6' },
];

export function Features() {
  const { path } = useGuide();
  return (
    <section className="features-wrap" aria-labelledby="features-title">
      <div className="wrap">
        <h2 id="features-title" className="visually-hidden">
          What you'll set up
        </h2>
        <ul className="features">
          {FEATURES.map(({ href, icon: Icon, tone, title, text, step }) => (
            <li key={title}>
              <a className="feature" href={href(path)}>
                <span className={tone ? `badge-icon ${tone}` : 'badge-icon'}>
                  <Icon className="i" aria-hidden="true" />
                </span>
                <b>{title}</b>
                <span>{text}</span>
                <span className="go">
                  {step} <ArrowRight className="i" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
