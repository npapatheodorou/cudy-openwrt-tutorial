import { FileText, FileUp, Lock, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { PlaceholderValues } from '../lib/highlight';
import { extractWireGuardValues, WIREGUARD_FIELDS } from '../lib/wireguard';
import { useGuide } from '../state/guide';

const CONF_PLACEHOLDER = '[Interface]\nPrivateKey = …\nAddress = …\nDNS = …\n\n[Peer]\nPublicKey = …\nEndpoint = host:51820';

export function WireGuardHelper() {
  const { setPlaceholders } = useGuide();
  const [text, setText] = useState('');
  const result = useMemo(() => extractWireGuardValues(text), [text]);

  useEffect(() => {
    const values: PlaceholderValues = {};
    for (const field of WIREGUARD_FIELDS) values[field] = result.values[field] ?? '';
    setPlaceholders(values);
  }, [result, setPlaceholders]);

  const hasText = text.trim().length > 0;
  const filled = WIREGUARD_FIELDS.length - result.missing.length;
  const status = hasText
    ? [
        `Filled ${filled} of ${WIREGUARD_FIELDS.length} values in the commands below.`,
        result.missing.length ? `Not found: ${result.missing.join(', ')}.` : '',
        ...result.notes,
      ]
        .filter(Boolean)
        .join(' ')
    : 'Paste a config or open a .conf file and the placeholders below fill in automatically.';
  const warn = hasText && (result.missing.length > 0 || result.notes.length > 0);

  return (
    <div className="helper">
      <div className="helper-head">
        <b>
          <FileText className="i" aria-hidden="true" />
          Fill the five values from your <code>.conf</code>
        </b>
        <span className="privacy">
          <Lock className="i" aria-hidden="true" />
          Parsed locally · never uploaded or saved
        </span>
      </div>
      <div className="field helper-field">
        <label htmlFor="wg-conf">Paste your WireGuard configuration</label>
        <textarea
          id="wg-conf"
          spellCheck={false}
          autoComplete="off"
          placeholder={CONF_PLACEHOLDER}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </div>
      <div className="helper-actions">
        <label className="btn btn-ghost btn-sm file-btn">
          <FileUp className="i" aria-hidden="true" />
          Open .conf file
          <input
            type="file"
            accept=".conf,text/plain"
            onChange={async (event) => {
              const input = event.currentTarget;
              const file = input.files?.[0];
              input.value = '';
              if (file) setText(await file.text());
            }}
          />
        </label>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setText('')} disabled={!text}>
          <X className="i" aria-hidden="true" />
          Clear
        </button>
      </div>
      <p className={warn ? 'hint warn' : 'hint'} aria-live="polite">
        {status}
      </p>
    </div>
  );
}
