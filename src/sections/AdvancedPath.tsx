import { ShieldCheck, Wrench } from 'lucide-react';
import { Snippet } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ExternalLink } from '../components/ExternalLink';
import { Step } from '../components/Step';
import { Tabs } from '../components/Tabs';
import { WifiHelper } from '../components/WifiHelper';
import { WireGuardHelper } from '../components/WireGuardHelper';
import { PathPanel } from './PathChooser';

const PLACEHOLDER_ROWS: [string, string][] = [
  ['<PRIVATE_KEY>', '[Interface] PrivateKey'],
  ['<ADDRESS>', '[Interface] Address'],
  ['<DNS>', '[Interface] DNS'],
  ['<PEER_PUBLIC_KEY>', '[Peer] PublicKey'],
];

function Ipv6Disable() {
  return (
    <>
      <h3>Disable IPv6</h3>
      <ol className="steps-ol">
        <li>
          <p>Remove WAN6 interface entirely</p>
          <Snippet id="ipv6-disable-wan6" />
        </li>
        <li>
          <p>Disable IPv6 on LAN</p>
          <Snippet id="ipv6-disable-lan" />
        </li>
        <li>
          <p>Commit changes</p>
        </li>
        <li>
          <p>Disable odhcpd (not needed without IPv6)</p>
          <Snippet id="ipv6-disable-odhcpd" />
        </li>
        <li>
          <p>
            <strong>Optional:</strong> Kernel-Level Disable
          </p>
          <Snippet id="ipv6-disable-kernel" />
        </li>
        <li>
          <p>Restart network</p>
          <Snippet id="ipv6-disable-restart" />
        </li>
      </ol>
    </>
  );
}

function Ipv6Enable() {
  return (
    <>
      <h3>Enable IPv6</h3>
      <ol className="steps-ol">
        <li>
          <p>Create WAN6 interface</p>
          <Snippet id="ipv6-enable-wan6" />
        </li>
        <li>
          <p>Enable IPv6 on LAN</p>
          <Snippet id="ipv6-enable-lan" />
        </li>
        <li>
          <p>Commit changes</p>
          <Snippet id="ipv6-enable-commit" />
        </li>
        <li>
          <p>Enable odhcpd</p>
          <Snippet id="ipv6-enable-odhcpd" />
        </li>
        <li>
          <p>
            <strong>Optional:</strong> Remove Kernel-Level Disable (if previously added)
          </p>
          <Snippet id="ipv6-enable-kernel" />
        </li>
        <li>
          <p>Restart network</p>
          <Snippet id="ipv6-enable-restart" />
        </li>
      </ol>
    </>
  );
}

export function AdvancedPath() {
  return (
    <PathPanel path="advanced">
      <Step id="advanced-setup" badge="A" variant="alt" kicker="Advanced · After restart" title="Root password, LAN address & Wi-Fi">
        <p>
          👉 After restart, open <strong>PuTTY</strong> and connect to <code>192.168.1.1</code> via SSH
        </p>
        <WifiHelper />
        <Snippet id="advanced-setup" />
      </Step>

      <Step id="advanced-step-4" badge="4" kicker="Step 4 · Advanced" title="🛡️ Adblock (network-wide ad/tracker blocking)">
        <Snippet id="advanced-adblock" />
      </Step>

      <Step id="advanced-step-5" badge="5" kicker="Step 5 · Advanced" title="🔐 WireGuard VPN client (route LAN through a VPN provider)">
        <ol className="steps-ol">
          <li>
            <p>Install the packages</p>
            <Snippet id="wg-install" />
          </li>

          <li>
            <p>
              Assumption: you already have a WireGuard <code>.conf</code> file in hand. Standard format:
            </p>
            <Snippet id="wg-conf-example" />
            <p>You'll copy five values out of that file:</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Placeholder in the snippet</th>
                    <th scope="col">
                      Source in your <code>.conf</code>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PLACEHOLDER_ROWS.map(([placeholder, source]) => (
                    <tr key={placeholder}>
                      <td>
                        <code>{placeholder}</code>
                      </td>
                      <td>
                        <code>{source}</code>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <code>&lt;ENDPOINT_HOST&gt;</code>
                    </td>
                    <td>
                      host part of <code>[Peer] Endpoint</code> (everything before <code>:51820</code>)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <WireGuardHelper />
            <Snippet id="wg-interface" />
          </li>

          <li>
            <p>
              Firewall (kill-switch style)
              <br />
              One <code>vpn</code> zone for <code>wg0</code>, with masquerading. We also remove the default <code>lan → wan</code> forwarding so
              traffic <em>only</em> leaves through the VPN — if the tunnel drops, nothing leaks to your ISP.
            </p>
            <Snippet id="wg-firewall" />
            <Callout>
              <p>
                <strong>Don't want a kill switch?</strong> Skip the loop that deletes <code>lan → wan</code>. With it left in place, if the VPN
                drops, traffic falls back to your regular ISP (privacy-leaking but no outages).
              </p>
            </Callout>
          </li>

          <li>
            <p>
              <strong>
                Fail-safe: a <code>killswitch</code> toggle script
              </strong>
            </p>
            <p>
              The kill switch is great until your VPN config expires (looking at you, NordVPN), your provider has an outage, or you simply
              mistype an <code>Endpoint</code> and the LAN has no internet. You can always SSH into the router from LAN even when the kill
              switch is on — the router's own input policy isn't affected — so you'll never be fully locked out. But you want a one-line
              escape hatch.
            </p>
            <p>This script lets you flip the kill switch on and off without remembering UCI syntax in a panic:</p>
            <Snippet id="killswitch-script" />
            <p>Use it like this:</p>
            <Snippet id="killswitch-usage" />
            <Callout tone="tip" icon={ShieldCheck}>
              <p>
                Even with the kill switch ON and <code>wg0</code> down, the router itself can still reach the internet (the kill switch only
                governs <em>forwarded</em> traffic from LAN). That means you can <code>ssh root@192.168.1.1</code> from any LAN device, run{' '}
                <code>killswitch off</code>, fix your config, and re-enable. You're never truly locked out.
              </p>
            </Callout>
            <p>
              <strong>A more aggressive fail-safe (optional):</strong> drop a copy of <code>killswitch off</code> as <code>/root/PANIC.sh</code>{' '}
              so you can run <code>sh /root/PANIC.sh</code> blindly:
            </p>
            <Snippet id="panic-script" />
          </li>

          <li>
            <p>Verify</p>
            <p>Bring up the tunnel and check:</p>
            <Snippet id="wg-verify-handshake" />
            <p>Confirm your external IP changed (from a LAN client, or from the router itself):</p>
            <Snippet id="wg-verify-ip" />
            <p>
              Check for DNS leaks: <ExternalLink href="https://dnsleaktest.com">https://dnsleaktest.com</ExternalLink> from a LAN client.
            </p>
            <Callout tone="warn">
              <p>
                <strong>NordVPN gotcha:</strong> if the handshake never completes, the config may have expired (Nord rotates keys on
                manually-extracted configs) or the server may have stopped accepting manual WireGuard. Regenerate the config and try a
                different server hostname.
              </p>
            </Callout>
          </li>
        </ol>
      </Step>

      <Step id="advanced-step-5-1" badge="5.1" kicker="Step 5.1 · Advanced" title="📄🔓 VPN Whitelisting (Enable Policy-Based Routing)">
        <ol className="steps-ol">
          <li>
            <p>
              <strong>Install</strong>
            </p>
            <Snippet id="pbr-install" />
          </li>

          <li>
            <p>
              <strong>Enable PBR globally</strong>
            </p>
            <Snippet id="pbr-enable" />
            <Callout>
              <p>
                <strong>
                  About <code>strict_enforcement='1'</code>
                </strong>{' '}
                — if a policy says "route through <code>wg0</code>" and <code>wg0</code> is down, the traffic is <strong>dropped</strong> instead of
                falling back to <code>wan</code>. This prevents accidental leaks when the VPN flaps. Set to <code>'0'</code> if you'd rather have
                fallback.
              </p>
            </Callout>
          </li>

          <li>
            <p>
              <strong>Add a bypass policy (one per device or group)</strong>
            </p>

            <h4>
              <span className="sub">3.1</span>Bypass VPN by MAC address
            </h4>
            <p>
              For a smart TV (<code>AA:BB:CC:DD:EE:FF</code>) that should use the regular ISP connection:
            </p>
            <Snippet id="pbr-bypass-mac" />

            <h4>
              <span className="sub">3.2</span>Force a device ONLY through VPN
            </h4>
            <p>
              For a work laptop (<code>11:22:33:44:55:66</code>) that must always use VPN, even if other devices don't:
            </p>
            <Snippet id="pbr-force-vpn" />

            <h4>
              <span className="sub">3.3</span>Bypass VPN for specific destination domains/IPs
            </h4>
            <p>
              For banking sites that block known VPN exits — route them via <code>wan</code> for <em>all</em> LAN clients:
            </p>
            <Snippet id="pbr-bypass-domains" />

            <h4>
              <span className="sub">3.4</span>Bypass by source IP range
            </h4>
            <p>For a VLAN, subnet, or specific static-IP device:</p>
            <Snippet id="pbr-bypass-ip-range" />
            <Callout>
              <p>
                <code>src_addr</code> accepts single IPs, ranges (<code>a-b</code>), or CIDR (<code>192.168.1.0/28</code>).
              </p>
            </Callout>

            <h4>
              <span className="sub">3.5</span>Bypass a single port (e.g. Steam, Plex)
            </h4>
            <Snippet id="pbr-bypass-port" />

            <h4>
              <span className="sub">3.6</span>Combine criteria
            </h4>
            <p>
              Fields can be combined within a single policy. For example, <em>"this MAC, only for these ports, via VPN"</em>:
            </p>
            <Snippet id="pbr-combine" />
          </li>

          <li>
            <p>
              <strong>List, edit, disable, delete policies</strong>
            </p>
            <Snippet id="pbr-manage" />
          </li>

          <li>
            <p>
              <strong>Kill switch with MAC-based exemptions</strong>
            </p>
            <p>
              If you want a kill switch that <strong>doesn't lock out the bypassed devices</strong>, the cleanest approach is a firewall traffic
              rule using the <code>!</code> (NOT) operator on the source MAC. PBR routes the smart TV via <code>wan</code>; the kill switch then
              has to permit that.
            </p>
            <Callout>
              <p>
                <strong>Note:</strong> UCI handles <code>!</code> natively — only the LuCI web UI strips that character, which is why most online
                guides tell you to edit <code>/etc/config/firewall</code> by hand. From the CLI we don't need that workaround.
              </p>
            </Callout>

            <h4>
              <span className="sub">5.1</span>Create the rule
            </h4>
            <Snippet id="pbr-killswitch-rule" />
            <p>
              The resulting <code>/etc/config/firewall</code> entry:
            </p>
            <Snippet id="pbr-killswitch-config" title="/etc/config/firewall" />

            <h4>
              <span className="sub">5.2</span>Adding / removing exemptions later
            </h4>
            <Snippet id="pbr-killswitch-exemptions" />
            <Callout tone="tip" icon={Wrench}>
              <p>
                Lots of IPs to exempt? The <a href="#pbr-generator">PBR Firewall Exceptions Generator</a> writes the policy blocks and{' '}
                <code>!IP</code> lines for you.
              </p>
            </Callout>
          </li>

          <li>
            <p>
              <strong>Verification</strong>
            </p>
            <Snippet id="pbr-verify" />
          </li>
        </ol>
      </Step>

      <Step id="advanced-step-6" badge="6" kicker="Step 6 · Advanced" title="🌐 Manage IPv6">
        <Tabs
          label="IPv6 action"
          items={[
            { id: 'ipv6-disable', label: 'Disable IPv6', content: <Ipv6Disable /> },
            { id: 'ipv6-enable', label: 'Enable IPv6', content: <Ipv6Enable /> },
          ]}
        />
      </Step>
    </PathPanel>
  );
}
