import { Download } from 'lucide-react';
import { useState } from 'react';
import { contentLabel, FIRMWARE, formatSize } from '../content/firmware';
import { firmwareUrl } from '../lib/urls';

/** Model picker inside Step 1.1 so users can grab their firmware without leaving the guide. */
export function QuickPick() {
  const [index, setIndex] = useState('');
  const pkg = index === '' ? undefined : FIRMWARE[Number(index)];

  return (
    <div className="quick-pick">
      <label className="visually-hidden" htmlFor="quick-pick">
        Your router model
      </label>
      <select id="quick-pick" value={index} onChange={(event) => setIndex(event.target.value)}>
        <option value="">Choose your router model…</option>
        {FIRMWARE.map((item, i) => (
          <option key={item.file} value={i}>
            {`${item.model}${item.badge ? ` (${item.badge})` : ''}${item.recommended ? ' — recommended' : ''}`}
          </option>
        ))}
      </select>
      {pkg ? (
        <a className="btn btn-primary btn-sm" href={firmwareUrl(pkg.file)} download>
          <Download className="i" aria-hidden="true" />
          Download · {formatSize(pkg.bytes)}
        </a>
      ) : (
        <span className="btn btn-primary btn-sm is-disabled" aria-disabled="true">
          <Download className="i" aria-hidden="true" />
          Download
        </span>
      )}
      <p className="meta">
        {pkg
          ? pkg.contents.map((content) => contentLabel(pkg, content)).join(' · ')
          : 'Find the model and hardware version (e.g. “V1”) on the label under your router.'}
      </p>
    </div>
  );
}
