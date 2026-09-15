import { Check } from 'lucide-react';
import { Callout } from '../components/Callout';
import { Step } from '../components/Step';

const OUTCOMES = ['OpenWrt installed', 'LuCI Web UI', 'Adblock filtering', 'WireGuard VPN (general + NordVPN setup)', 'IPv6 control'];

export function Done() {
  return (
    <Step id="done" badge="🎉" kicker="Finish" title="Done!" trackable={false}>
      <p>You now have:</p>
      <ul className="done-list">
        {OUTCOMES.map((outcome) => (
          <li key={outcome}>
            <span className="tick" aria-hidden="true">
              <Check className="i" strokeWidth={3} />
            </span>
            {outcome}
          </li>
        ))}
      </ul>
      <Callout tone="warn">
        <p>
          ⚠️ <strong>Disclaimer:</strong> Use this at your own risk. Flashing firmware may void warranty or brick your device.
        </p>
      </Callout>
    </Step>
  );
}
