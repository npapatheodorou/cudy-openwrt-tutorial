export const LIVE_REGION_ID = 'sr-status';

/** Announce a short status message to screen readers through the page's live region. */
export function announce(message: string): void {
  const region = document.getElementById(LIVE_REGION_ID);
  if (!region) return;
  region.textContent = '';
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}
