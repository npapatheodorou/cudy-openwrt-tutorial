import { Download, ExternalLink as ExternalIcon, FileText, KeyRound, Package, Route, ShieldCheck, Terminal, Zap, type LucideIcon } from 'lucide-react';
import { Snippet } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { PbrGenerator } from '../components/PbrGenerator';
import { contentUrl } from '../lib/urls';

const LINKS: { href: string; icon: LucideIcon; tone?: 'blue'; title: string; detail: string }[] = [
  { href: 'https://firmware-selector.openwrt.org/', icon: Package, title: 'OpenWrt Firmware Selector', detail: 'SNAPSHOT builds · Step 1.2' },
  { href: 'https://www.putty.org/', icon: Terminal, tone: 'blue', title: 'PuTTY', detail: 'SSH client · Step 1.3' },
  { href: 'https://nordconf-wg.netlify.app/#private_key', icon: FileText, title: 'nordconf-wg', detail: 'NordVPN .conf generator · Step 5.2' },
  { href: 'https://dnsleaktest.com', icon: ShieldCheck, tone: 'blue', title: 'DNS leak test', detail: 'Verify the VPN · Step 5' },
];

export function Tools() {
  return (
    <section className="section" id="tools" aria-labelledby="tools-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="kicker">Tools</p>
            <h2 id="tools-title">🧰 Extra Tools</h2>
            <p>Small helper scripts that go with the VPN steps, plus checksums for the firmware downloads.</p>
          </div>
        </div>

        <div className="tools">
          <article className="tool" id="tool-nordvpn" aria-labelledby="tool-nordvpn-title">
            <div className="tool-top">
              <span className="badge-icon" aria-hidden="true">
                <KeyRound className="i" />
              </span>
              <div>
                <h3 id="tool-nordvpn-title">NordVPN Private Key Extractor</h3>
                <small>tools/nordvpn_priv_key_extractor.ps1 · .exe</small>
              </div>
            </div>
            <p>
              Asks for your NordVPN access token (masked input) and queries NordVPN's credentials API to print your service username, password
              and NordLynx (WireGuard) private key.
            </p>
            <Snippet id="tool-nordvpn-run" />
            <Callout tone="warn">
              <p>
                The <code>.exe</code> is unsigned, so Windows SmartScreen may warn you. Prefer the <code>.ps1</code> if you want to read the code
                before running it.
              </p>
            </Callout>
            <div className="tool-actions">
              <a className="btn btn-primary btn-sm" href={contentUrl('tools/nordvpn_priv_key_extractor.ps1')} download>
                <Download className="i" aria-hidden="true" /> .ps1 script
              </a>
              <a className="btn btn-ghost btn-sm" href={contentUrl('tools/nordvpn_priv_key_extractor.exe')} download>
                <Download className="i" aria-hidden="true" /> .exe
              </a>
              <a className="btn btn-ghost btn-sm" href="https://my.nordaccount.com/dashboard/nordvpn/access-tokens/" target="_blank" rel="noopener noreferrer">
                <ExternalIcon className="i" aria-hidden="true" /> Get a token
              </a>
            </div>
          </article>

          <article className="tool" id="tool-pbr" aria-labelledby="tool-pbr-title">
            <div className="tool-top">
              <span className="badge-icon blue" aria-hidden="true">
                <Route className="i" />
              </span>
              <div>
                <h3 id="tool-pbr-title">PBR Firewall Exceptions Generator</h3>
                <small>tools/pbr_firewall_exceptions_gen.py</small>
              </div>
            </div>
            <p>
              Paste IPs (one per line, or separated by commas/spaces) and get <code>config policy</code> blocks that route each one via{' '}
              <code>wan</code>, plus <code>list dest_ip '!IP'</code> lines for your kill-switch rule (Step 5.1).
            </p>
            <Snippet id="tool-pbr-run" />
            <p className="muted">Paste the IPs into the terminal, then press Enter on an empty line. Or use the in-browser version below.</p>
            <div className="tool-actions">
              <a className="btn btn-primary btn-sm" href={contentUrl('tools/pbr_firewall_exceptions_gen.py')} download>
                <Download className="i" aria-hidden="true" /> .py script
              </a>
              <a className="btn btn-ghost btn-sm" href="#pbr-generator">
                <Zap className="i" aria-hidden="true" /> Try it in the browser
              </a>
            </div>
          </article>

          <article className="tool" id="tool-checksums" aria-labelledby="tool-checksums-title">
            <div className="tool-top">
              <span className="badge-icon" aria-hidden="true">
                <ShieldCheck className="i" />
              </span>
              <div>
                <h3 id="tool-checksums-title">Firmware checksums</h3>
                <small>firmware/SHA256SUMS.txt</small>
              </div>
            </div>
            <p>
              Before you flash, make sure the zip downloaded intact. Compute its SHA-256 and compare it with the value in{' '}
              <code>SHA256SUMS.txt</code> (or the copy button next to each download).
            </p>
            <Snippet id="tool-checksums" />
            <div className="tool-actions">
              <a className="btn btn-primary btn-sm" href={contentUrl('firmware/SHA256SUMS.txt')} download>
                <Download className="i" aria-hidden="true" /> SHA256SUMS.txt
              </a>
            </div>
          </article>
        </div>

        <PbrGenerator />

        <h3 className="links-title">External links used in the guide</h3>
        <ul className="links">
          {LINKS.map(({ href, icon: Icon, tone, title, detail }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                <span className={tone ? `badge-icon ${tone}` : 'badge-icon'} aria-hidden="true">
                  <Icon className="i" />
                </span>
                <span>
                  {title}
                  <small>{detail}</small>
                </span>
                <ExternalIcon className="i ext" aria-hidden="true" />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
