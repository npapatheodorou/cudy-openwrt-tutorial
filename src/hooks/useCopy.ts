import { useCallback, useEffect, useRef, useState } from 'react';
import { announce } from '../lib/a11y';
import { copyText } from '../lib/clipboard';

export type CopyStatus = 'idle' | 'copied' | 'failed';

/** Copy to the clipboard and expose a short-lived status for button feedback. */
export function useCopy(resetAfterMs = 1800) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyText(text);
      setStatus(ok ? 'copied' : 'failed');
      announce(ok ? 'Copied to clipboard' : 'Copy failed');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setStatus('idle'), resetAfterMs);
    },
    [resetAfterMs],
  );

  return { status, copy };
}
