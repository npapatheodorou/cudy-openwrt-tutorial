import { ArrowRight, Download } from 'lucide-react';
import { FIRMWARE } from '../content/firmware';
import { contentUrl } from '../lib/urls';

const TERMINAL: { prompt?: boolean; text: string; dim?: string; ok?: string }[] = [
  { text: '', dim: '# flashed, now make it yours' },
  { prompt: true, text: 'apk add luci luci-ssl' },
  { prompt: true, text: 'apk add adblock luci-app-adblock' },
  { prompt: true, text: 'ifup wg0 && wg show' },
  { text: '', dim: '  latest handshake:', ok: '12 seconds ago ✓' },
  { prompt: true, text: 'killswitch status' },
  { text: '', dim: '  Kill switch:', ok: 'ON' },
];

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="rise">
          <span className="eyebrow">
            <b>Open-source guide</b> For Cudy routers · OpenWrt SNAPSHOT
          </span>
          <h1>
            Upgrade your <span className="grad">Cudy router</span> to OpenWrt
          </h1>
          <p className="lead">
            This guide walks you through upgrading your <strong>Cudy router</strong> to OpenWrt, enabling LuCI Web UI, blocking ads,
            setting up WireGuard VPN (general steps and provider-specific instructions), and managing IPv6.
          </p>
          <div className="cta">
            <a className="btn btn-primary" href="#step-1">
              Start the guide <ArrowRight className="i" aria-hidden="true" />
            </a>
            <a className="btn btn-ghost" href="#downloads">
              <Download className="i" aria-hidden="true" /> Download firmware
            </a>
          </div>
          <ul className="stats">
            <li>
              <b>{FIRMWARE.length}</b>
              <span>firmware packages</span>
            </li>
            <li>
              <b>2</b>
              <span>setup paths</span>
            </li>
            <li>
              <b>6</b>
              <span>guided steps</span>
            </li>
            <li>
              <b>MIT</b>
              <span>licensed</span>
            </li>
          </ul>
        </div>

        <div className="hero-art rise rise-2" aria-hidden="true">
          <img className="hero-icon" src={contentUrl('assets/icons/icon.svg')} width={104} height={104} alt="" />
          <div className="terminal">
            <div className="terminal-bar">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="terminal-title">root@OpenWrt: ~</span>
            </div>
            <pre>
              {TERMINAL.map((line, index) => (
                <span className="t-line" key={index}>
                  {line.prompt && <span className="t-p">root@OpenWrt:~# </span>}
                  {line.text}
                  {line.dim && <span className="t-d">{line.dim}</span>}
                  {line.ok && <span className="t-ok"> {line.ok}</span>}
                </span>
              ))}
              <span className="t-line">
                <span className="t-p">root@OpenWrt:~# </span>
                <span className="cursor" />
              </span>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
