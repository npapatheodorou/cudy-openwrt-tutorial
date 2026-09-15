import { Lock, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { firewallLines, parseIpList, policyBlocks } from '../lib/pbr';
import { CodeBlock } from './CodeBlock';

export function PbrGenerator() {
  const [input, setInput] = useState('');
  const ips = useMemo(() => parseIpList(input), [input]);

  return (
    <div className="gen" id="pbr-generator">
      <div className="helper-head">
        <b>
          <Zap className="i" aria-hidden="true" />
          PBR exceptions generator
        </b>
        <span className="privacy">
          <Lock className="i" aria-hidden="true" />
          Runs in your browser
        </span>
        <span className="gen-count" aria-live="polite">
          {ips.length ? `${ips.length} unique ${ips.length === 1 ? 'entry' : 'entries'}` : 'No IPs yet'}
        </span>
      </div>
      <div className="gen-grid">
        <div className="field">
          <label htmlFor="pbr-input">IPs to exempt from the VPN</label>
          <textarea
            id="pbr-input"
            spellCheck={false}
            placeholder={'1.2.3.4\n5.6.7.8, 9.10.11.12\n203.0.113.0/24'}
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>
        <div>
          <span className="label-sm">
            PBR policies (<code>/etc/config/pbr</code>)
          </span>
          <CodeBlock code={policyBlocks(ips)} lang="text" title="pbr policies" emptyText="Policies will appear here" />
          <span className="label-sm">
            Kill-switch exemptions (<code>/etc/config/firewall</code>)
          </span>
          <CodeBlock code={firewallLines(ips)} lang="text" title="firewall rule lines" emptyText="Firewall lines will appear here" />
        </div>
      </div>
    </div>
  );
}
