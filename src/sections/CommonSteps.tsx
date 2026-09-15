import { Snippet } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ExternalLink } from '../components/ExternalLink';
import { QuickPick } from '../components/QuickPick';
import { Screenshot } from '../components/Screenshot';
import { Step } from '../components/Step';
import { IMAGES } from '../content/images';

export function CommonSteps() {
  return (
    <>
      <Step id="step-1" badge="1" kicker="Step 1" title="📥 Download Required Files">
        <ol className="steps-ol">
          <li>
            <p>
              <strong>OpenWrt Firmware (without recovery TFTP):</strong>
              <br />
              Select the appropriate firmware according to your router’s model. <a href="#downloads">Download here</a>
            </p>
            <QuickPick />
          </li>
          <li>
            <p>
              <strong>OpenWrt Firmware Finder (SNAPSHOT builds):</strong>
              <br />
              Select the firmware that matches your router’s model; ensure the version chosen is <code>SNAPSHOT</code>.{' '}
              <ExternalLink href="https://firmware-selector.openwrt.org/">Download Here</ExternalLink>
            </p>
            <Screenshot image={IMAGES.firmwareSelector} />
          </li>
          <li>
            <p>
              <strong>PuTTY (SSH client):</strong>
              <br />
              <ExternalLink href="https://www.putty.org/">Download PuTTY</ExternalLink>
            </p>
          </li>
        </ol>
      </Step>

      <Step id="step-2" badge="2" kicker="Step 2" title="⚡ Flash OpenWrt">
        <ol className="steps-ol">
          <li>
            <p>
              Access router at <code>192.168.10.1</code> (Cudy's portal).
            </p>
          </li>
          <li>
            <p>Upgrade the firmware using the OpenWrt image downloaded in Step 1.1.</p>
            <Screenshot image={IMAGES.cudyUpgrade} />
          </li>
          <li>
            <p>
              After upgrade → visit <code>192.168.1.1 → System → Backup / Flash Firmware</code>.
            </p>
          </li>
          <li>
            <p>Upload new file and start upgrade using the image download in Step 1.2.</p>
            <Screenshot image={IMAGES.flashImage} />
          </li>
          <li>
            <p>Since the snapshot has no UI:</p>
            <ul>
              <li>
                Open <strong>PuTTY</strong> and connect to <code>192.168.1.1</code> via SSH.
              </li>
              <li>
                Login as <code>root</code> (no password first time).
              </li>
            </ul>
          </li>
        </ol>
        <Callout tone="warn">
          <p>
            If an error occurs at any stage of the process, you can simply SSH into the system and run <code>firstboot &amp;&amp; reboot</code>
          </p>
        </Callout>
      </Step>

      <Step id="step-3" badge="3" kicker="Step 3" title="🖥️ Install LuCI Web Interface">
        <Snippet id="luci-install" />
      </Step>
    </>
  );
}
