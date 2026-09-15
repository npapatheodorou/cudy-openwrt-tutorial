import { Eye, EyeOff, Lock, Wifi } from 'lucide-react';
import { useState } from 'react';
import { wifiIssues } from '../lib/wifi';
import { useGuide } from '../state/guide';

export function WifiHelper() {
  const { placeholders, setPlaceholders } = useGuide();
  const [showPassword, setShowPassword] = useState(false);
  const name = placeholders.WIFI_NAME ?? '';
  const password = placeholders.WIFI_PASS ?? '';
  const issues = wifiIssues(name, password);

  return (
    <div className="helper">
      <div className="helper-head">
        <b>
          <Wifi className="i" aria-hidden="true" />
          Fill in your Wi-Fi details
        </b>
        <span className="privacy">
          <Lock className="i" aria-hidden="true" />
          Stays in your browser
        </span>
      </div>
      <div className="fields">
        <div className="field">
          <label htmlFor="wifi-name">
            Wi-Fi name (<code>&lt;WIFI_NAME&gt;</code>)
          </label>
          <input
            id="wifi-name"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="e.g. MyHome"
            value={name}
            onChange={(event) => setPlaceholders({ WIFI_NAME: event.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="wifi-pass">
            Wi-Fi password (<code>&lt;WIFI_PASS&gt;</code>)
          </label>
          <div className="input-row">
            <input
              id="wifi-pass"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              spellCheck={false}
              placeholder="8–63 characters"
              value={password}
              onChange={(event) => setPlaceholders({ WIFI_PASS: event.target.value })}
            />
            <button
              type="button"
              className="icon-btn"
              aria-label="Show password"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((shown) => !shown)}
            >
              {showPassword ? <EyeOff className="i" aria-hidden="true" /> : <Eye className="i" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
      <p className={issues.length ? 'hint warn' : 'hint'} aria-live="polite">
        {issues.length
          ? issues.join(' ')
          : 'Your values replace the placeholders in the commands below, so Copy grabs a ready-to-paste block.'}
      </p>
    </div>
  );
}
