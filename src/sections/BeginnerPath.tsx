import { KeyRound } from 'lucide-react';
import { Callout } from '../components/Callout';
import { ExternalLink } from '../components/ExternalLink';
import { Screenshot } from '../components/Screenshot';
import { Step } from '../components/Step';
import { IMAGES } from '../content/images';
import { PathPanel } from './PathChooser';

export function BeginnerPath() {
  return (
    <PathPanel path="beginner">
      <Step id="beginner-setup" badge="B" variant="alt" kicker="Beginner · After restart" title="First login & LAN address">
        <p>
          👉 After restart, log in at <code>192.168.1.1</code> via LuCI.
        </p>
        <ul>
          <li>Set a new password for root.</li>
          <li>
            Go to <strong>Network → Interfaces → LAN</strong>
            <Screenshot image={IMAGES.interfacesLan} />
            <ul>
              <li>
                Change IPv4 address → <code>192.168.2.1/24</code>
                <Screenshot image={IMAGES.lanAddress} />
              </li>
              <li>
                <strong>Save &amp; Apply</strong>
              </li>
            </ul>
          </li>
        </ul>
      </Step>

      <Step id="beginner-step-4" badge="4" kicker="Step 4 · Beginner" title="🛡️ Adblock (network-wide ad/tracker blocking)">
        <ol className="steps-ol">
          <li>
            <p>
              Go to <strong>System → Software</strong>
            </p>
            <ul>
              <li>Update Lists</li>
              <li>
                Install: <code>adblock</code>, <code>luci-app-adblock</code>
              </li>
            </ul>
            <Screenshot image={IMAGES.software} />
          </li>
          <li>
            <p>
              Configure via <strong>Services → Adblock</strong>:
            </p>
            <div className="settings">
              <div className="setting">
                <b>General Settings</b>
                <ul>
                  <li>✔ TLD Compression</li>
                  <li>✔ DNS Report</li>
                </ul>
                <Screenshot image={IMAGES.adblockGeneral} />
              </div>
              <div className="setting">
                <b>Firewall Settings</b>
                <ul>
                  <li>
                    Forced Zones → <code>@lan</code>, <code>@wan</code>, <code>@wan6</code>
                  </li>
                  <li>
                    Forced Ports → <code>853</code>, <code>53</code>, <code>5353</code>
                  </li>
                </ul>
                <Screenshot image={IMAGES.adblockFirewall} />
              </div>
              <div className="setting">
                <b>Advanced DNS Settings</b>
                <ul>
                  <li>
                    DNS Backend → <code>dnsmasq</code>
                  </li>
                </ul>
                <Screenshot image={IMAGES.adblockDns} />
              </div>
              <div className="setting">
                <b>Feed Selection</b>
                <ul>
                  <li>
                    Blocklist Feed → <code>adguard (L, general)</code>, <code>adguard_tracking (L, tracking)</code>,{' '}
                    <code>android_tracking (S, tracking)</code>, <code>anti_ad (L, compilation)</code>, <code>certpl (L, phishing)</code>
                  </li>
                </ul>
                <Screenshot image={IMAGES.adblockFeeds} />
              </div>
            </div>
          </li>
          <li>
            <p>
              Restart <strong>dnsmasq</strong> from <strong>System → Startup</strong>.
            </p>
            <Screenshot image={IMAGES.restartDnsmasq} />
          </li>
        </ol>
      </Step>

      <Step id="beginner-step-5" badge="5" kicker="Step 5 · Beginner" title="🔐 WireGuard VPN client (route LAN through a VPN provider)">
        <ol className="steps-ol">
          <li>
            <p>
              Go to <strong>System → Software</strong>
            </p>
            <ul>
              <li>Update Lists</li>
              <li>
                Install: <code>luci-proto-wireguard</code>
              </li>
              <li>Reboot</li>
            </ul>
          </li>
          <li>
            <p>
              Go to <strong>Network → Interfaces</strong>
            </p>
            <ul>
              <li>Add new interface</li>
              <li>
                Name → <code>wg0</code>
              </li>
              <li>
                Protocol → <strong>WireGuard VPN</strong>
              </li>
              <li>Create interface</li>
            </ul>
          </li>
          <li>
            <p>Firewall Setup:</p>
            <ul>
              <li>
                Go to <strong>Network → Firewall</strong>
              </li>
              <li>
                Add Zone:
                <ul>
                  <li>
                    Name → <code>vpn</code>
                  </li>
                  <li>✔ IPv4 Masquerading</li>
                  <li>✔ MSS Clamping</li>
                  <li>
                    Covered Networks → <code>wg0</code>
                  </li>
                  <li>
                    Allow forward from source zones → <code>lan</code>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Lan Forwarding</strong>:
                <ul>
                  <li>
                    Edit <code>lan</code> → Allow forward to destination zones → <code>wg0</code>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <p>
              Go again to <strong>Network → Interfaces</strong>
            </p>
            <ul>
              <li>
                Edit interface with Name → <code>wg0</code>
              </li>
              <li>
                Go to <code>Firewall Settings</code>
              </li>
              <li>
                Create / Assign firewall-zone → <code>vpn</code> (see step 2)
              </li>
              <li>
                <strong>Save &amp; Apply</strong>
              </li>
            </ul>
          </li>
          <li>
            <p>Kill Switch Rule (Optional):</p>
            <ul>
              <li>
                Go to <strong>Traffic Rules</strong>
              </li>
              <li>
                Add Rule:
                <ul>
                  <li>
                    Name → <code>vpn-killswitch</code>
                  </li>
                  <li>
                    Source Zone → <code>lan</code>
                  </li>
                  <li>
                    Destination Zone → <code>wan</code>
                  </li>
                  <li>
                    Action → <strong>drop</strong>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ol>
      </Step>

      <Step id="beginner-step-5-2" badge="5.2" kicker="Step 5.2 · Beginner" title="🌍 VPN Provider Configuration">
        <div className="provider">
          <div className="provider-head">
            <span className="badge-icon blue" aria-hidden="true">
              🛰️
            </span>
            <b>NordVPN</b>
          </div>
          <div className="provider-body">
            <ol className="steps-ol">
              <li>
                <p>
                  <strong>Generate Credentials</strong>
                </p>
                <ul>
                  <li>
                    Visit <ExternalLink href="https://my.nordaccount.com/dashboard/nordvpn/access-tokens/">Nord Account Access Tokens</ExternalLink> →{' '}
                    <code>Generate a token</code>.
                  </li>
                  <li>
                    <strong>Copy it</strong>.
                  </li>
                </ul>
                <Screenshot image={IMAGES.nordAccessToken} />
              </li>
              <li>
                <p>
                  <strong>Find Your Recommended Server and Download Configuration</strong>
                </p>
                <ul>
                  <li>
                    Visit <ExternalLink href="https://nordconf-wg.netlify.app/#private_key">nordconf-wg</ExternalLink>. The tool will automatically
                    recommend the nearest server based on your current location.
                  </li>
                  <li>
                    Paste your access token into the <strong>NordVPN access token</strong> field
                  </li>
                  <li>
                    Generate and download the <code>.conf</code> configuration file.
                  </li>
                </ul>
              </li>
              <li>
                <p>
                  <strong>Configure WireGuard</strong>
                </p>
                <ul>
                  <li>
                    Go to <strong>Network → Interfaces → wg0</strong>
                  </li>
                  <li>
                    Import your configuration file → <strong>Load configuration...</strong>
                  </li>
                  <li>In Peers → Edit → ✔ Route Allowed IPs</li>
                  <li>
                    <strong>Save</strong>
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
        <Callout icon={KeyRound}>
          <p>
            If you'd rather get your NordLynx private key yourself, try the <a href="#tool-nordvpn">NordVPN Private Key Extractor</a> in Tools.
          </p>
        </Callout>
      </Step>
    </PathPanel>
  );
}
